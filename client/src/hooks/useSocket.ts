import { useEffect, useCallback, useState, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useGameStore } from '../store/gameStore';
import { authService } from '../services/authService';
import type { Card, BoardCell, GameState, Player } from '../types/game';

interface UseSocketReturn {
  connected: boolean;
  connecting: boolean;
  latency: number;
  socket: Socket | null;
  emitMove: (data: { card: Card; to: BoardCell }) => void;
  emitResign: () => void;
  emitDrawOffer: () => void;
  emitDrawResponse: (accept: boolean) => void;
  joinGame: (roomId: string) => void;
  leaveGame: () => void;
  startMatchmaking: (playerData: { playerId: string; username: string; rating: number }) => void;
  cancelMatchmaking: () => void;
}

// Singleton socket instance - persists across component re-renders
let globalSocket: Socket | null = null;
let socketConnectionCount = 0;
let lastErrorLogTime = 0;
const ERROR_LOG_THROTTLE_MS = 5000;

export const useSocket = (): UseSocketReturn => {
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [latency, setLatency] = useState(0);
  const isInitialized = useRef(false);
  const eventHandlersAttached = useRef(false);

  // Sync state with global socket when it changes
  useEffect(() => {
    if (globalSocket) {
      setConnected(globalSocket.connected);
      (window as any).__skemino_socket = globalSocket;
    }
  }, []);

  const {
    setGameState,
    setPlayers,
    updateBoard,
    updateTime,
  } = useGameStore();

  // Access distribution methods separately to avoid undefined errors
  const setDistributionState = useGameStore(state => state.setDistributionState);
  const triggerCardDistribution = useGameStore(state => state.triggerCardDistribution);

  // Helper function to ensure authentication
  const ensureAuthentication = async (): Promise<string | null> => {
    // Check for existing token using consistent key names
    let token = localStorage.getItem('skemino_auth_token') || sessionStorage.getItem('skemino_auth_token');

    if (token) {
      return token;
    }

    // No token found, create guest session
    console.log('No auth token found, creating guest session...');
    try {
      const guestResponse = await authService.loginAsGuest();
      if (guestResponse.success && guestResponse.token) {
        // Store guest token in session storage
        sessionStorage.setItem('skemino_auth_token', guestResponse.token);
        if (guestResponse.user) {
          sessionStorage.setItem('skemino_user_data', JSON.stringify(guestResponse.user));
        }
        console.log('Guest session created successfully');
        return guestResponse.token;
      }
    } catch (error) {
      console.error('Failed to create guest session:', error);
    }

    return null;
  };

  // Initialize socket connection only once per application lifecycle
  useEffect(() => {
    if (!globalSocket && !isInitialized.current) {
      isInitialized.current = true;
      setConnecting(true);
      socketConnectionCount++;

      const initializeSocket = async () => {
        try {
          console.log(`🔗 Initializing socket connection #${socketConnectionCount}`);

          // Ensure we have authentication
          const token = await ensureAuthentication();

          if (!token) {
            console.error('Failed to obtain authentication token');
            setConnecting(false);
            isInitialized.current = false;
            return;
          }

          globalSocket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:3005', {
            transports: ['websocket', 'polling'],
            reconnection: true,
            reconnectionDelay: 2000,
            reconnectionDelayMax: 10000,
            reconnectionAttempts: 5,
            timeout: 15000,
            forceNew: false, // Allow reuse of existing connection
            auth: {
              token: token,
              isGuest: !localStorage.getItem('skemino_auth_token')
            }
          });

          // Connection event handlers - set only once
          globalSocket.on('connect', () => {
            console.log(`✅ Connected to server (connection #${socketConnectionCount})`);
            setConnected(true);
            setConnecting(false);
          });

          globalSocket.on('disconnect', (reason) => {
            console.log(`❌ Disconnected from server: ${reason}`);
            setConnected(false);
          });

          globalSocket.on('connect_error', (error) => {
            const now = Date.now();
            if (now - lastErrorLogTime > ERROR_LOG_THROTTLE_MS) {
              console.error('Connection error:', error);
              lastErrorLogTime = now;
            }
            setConnecting(false);
          });

          // Latency measurement
          globalSocket.on('pong', () => {
            const now = Date.now();
            const roundTripTime = now - (globalSocket as any).lastPing;
            setLatency(Math.round(roundTripTime / 2));
          });

          // Ping every 5 seconds for latency measurement
          const pingInterval = setInterval(() => {
            if (globalSocket?.connected) {
              (globalSocket as any).lastPing = Date.now();
              globalSocket.emit('ping');
            }
          }, 5000);

          // Cleanup interval when socket disconnects permanently
          const handleSocketDestroy = () => {
            clearInterval(pingInterval);
          };

          globalSocket.on('disconnect', handleSocketDestroy);

          // Store cleanup function globally
          (globalSocket as any).__cleanup = () => {
            clearInterval(pingInterval);
            handleSocketDestroy();
          };

          // Make socket available globally
          (window as any).__skemino_socket = globalSocket;

        } catch (error) {
          console.error('Failed to initialize socket:', error);
          setConnecting(false);
          isInitialized.current = false;
          globalSocket = null;
        }
      };

      initializeSocket();
    } else if (globalSocket) {
      // Use existing socket
      setConnected(globalSocket.connected);
      setConnecting(false);
    }

    // Cleanup only happens when the entire application unmounts
    // Individual component unmounts should NOT disconnect the shared socket
    return () => {
      socketConnectionCount--;
      console.log(`🔄 Component unmount, remaining connections: ${socketConnectionCount}`);

      // Only disconnect when no more components are using the socket
      if (socketConnectionCount <= 0 && globalSocket) {
        console.log('🔌 Disconnecting socket - no more active connections');
        globalSocket.disconnect();
        if ((globalSocket as any).__cleanup) {
          (globalSocket as any).__cleanup();
        }
        globalSocket = null;
        isInitialized.current = false;
        socketConnectionCount = 0;
      }
    };
  }, []);

  // Game event handlers - attach only once per hook instance
  useEffect(() => {
    if (!globalSocket || eventHandlersAttached.current) return;

    console.log('🎮 Attaching game event handlers');
    eventHandlersAttached.current = true;

    // Game state updates
    globalSocket.on('game:state', (gameState: GameState) => {
      setGameState(gameState);
    });

    // Player info
    globalSocket.on('game:players', (data: { current: Player; opponent: Player }) => {
      setPlayers(data.current, data.opponent);
    });

    // Move made
    globalSocket.on('move:made', (data: {
      card: Card;
      from?: BoardCell;
      to: BoardCell;
      capturedCard?: Card;
    }) => {
      // Update board with the move
      updateBoard(data.to, {
        card: data.card,
        owner: data.card ? 'white' : 'black',
      });

      // Play move sound
      const audio = new Audio('/sounds/move.mp3');
      audio.volume = 0.3;
      audio.play().catch(() => {});
    });

    // Time updates
    globalSocket.on('time:update', (data: { white: number; black: number }) => {
      updateTime('white', data.white);
      updateTime('black', data.black);
    });

    // Game over
    globalSocket.on('game:over', (data: {
      winner: 'white' | 'black';
      reason: string;
    }) => {
      console.log('Game over:', data);
    });

    // Draw offer
    globalSocket.on('draw:offered', () => {
      if (confirm('Your opponent offers a draw. Accept?')) {
        globalSocket?.emit('draw:response', { accept: true });
      } else {
        globalSocket?.emit('draw:response', { accept: false });
      }
    });

    // Chat message
    globalSocket.on('chat:message', (data: {
      player: string;
      message: string;
      timestamp: number;
    }) => {
      console.log('Chat:', data);
    });

    // Matchmaking events
    globalSocket.on('matchmaking:queued', (data: { timeControl: string }) => {
      console.log('Queued for matchmaking:', data);
      setDistributionState?.({ phase: 'waiting', isDistributing: false, currentCard: 0, animationProgress: 0 });
    });

    globalSocket.on('match:found', (data: { gameId: string; color: string; opponent: any }) => {
      console.log('Match found:', data);
      setDistributionState?.({ phase: 'matchmaking', isDistributing: true, currentCard: 0, animationProgress: 0 });

      const currentPlayerData = {
        id: data.color === 'white' ? 'current' : 'opponent',
        username: 'Current Player',
        rating: 1000,
        color: data.color as 'white' | 'black',
      };

      const opponentData = {
        id: data.opponent.userId,
        username: data.opponent.username,
        rating: data.opponent.rating,
        color: data.color === 'white' ? 'black' : 'white' as 'white' | 'black',
      };

      setPlayers(currentPlayerData, opponentData);
    });

    globalSocket.on('game:starting', (data: { roomId: string; message: string; timestamp: number }) => {
      console.log('Game starting:', data);
      setDistributionState?.({ phase: 'starting', isDistributing: true, currentCard: 0, animationProgress: 0 });
    });

    // Card distribution events
    globalSocket.on('cards:distribution-start', (data: { phase: string; timestamp: number }) => {
      console.log('Distribution started:', data);
      setDistributionState?.({
        phase: 'shuffling',
        isDistributing: true,
        currentCard: 0,
        animationProgress: 0
      });
    });

    globalSocket.on('cards:distribution-phase', (data: { phase: string; timestamp: number }) => {
      console.log('Distribution phase:', data);
      setDistributionState?.({
        phase: 'dealing',
        isDistributing: true,
        currentCard: 0,
        animationProgress: 0
      });
    });

    globalSocket.on('cards:card-dealt', (data: {
      cardNumber: number;
      totalCards: number;
      player: string;
      cardIndex: number;
      progress: number;
      timestamp: number;
    }) => {
      console.log('Card dealt:', data);
      setDistributionState?.({
        phase: 'dealing',
        isDistributing: true,
        currentCard: data.cardNumber,
        animationProgress: data.progress
      });

      triggerCardDistribution?.(data);
    });

    globalSocket.on('cards:distribution-complete', (data: { gameState: GameState; timestamp: number }) => {
      console.log('Distribution complete:', data);
      setGameState(data.gameState);
      setDistributionState?.({
        phase: 'complete',
        isDistributing: false,
        currentCard: 10,
        animationProgress: 100
      });
    });

    globalSocket.on('connection:established', (data: { socketId: string; timestamp: number; serverTime: string }) => {
      console.log('Connection established:', data);
    });

    // Cleanup function removes only this hook's handlers on unmount
    return () => {
      if (globalSocket && eventHandlersAttached.current) {
        console.log('🧹 Cleaning up event handlers for this hook instance');
        eventHandlersAttached.current = false;

        // Remove only the handlers that this hook instance added
        globalSocket.off('game:state');
        globalSocket.off('game:players');
        globalSocket.off('move:made');
        globalSocket.off('time:update');
        globalSocket.off('game:over');
        globalSocket.off('draw:offered');
        globalSocket.off('chat:message');
        globalSocket.off('matchmaking:queued');
        globalSocket.off('match:found');
        globalSocket.off('game:starting');
        globalSocket.off('cards:distribution-start');
        globalSocket.off('cards:distribution-phase');
        globalSocket.off('cards:card-dealt');
        globalSocket.off('cards:distribution-complete');
        globalSocket.off('connection:established');
      }
    };
  }, [globalSocket, setGameState, setPlayers, updateBoard, updateTime, setDistributionState, triggerCardDistribution]);

  // Emit functions - use globalSocket reference
  const emitMove = useCallback((data: { card: Card; to: BoardCell }) => {
    if (globalSocket?.connected) {
      globalSocket.emit('move:make', data);
    }
  }, []);

  const emitResign = useCallback(() => {
    if (globalSocket?.connected) {
      globalSocket.emit('game:resign');
    }
  }, []);

  const emitDrawOffer = useCallback(() => {
    if (globalSocket?.connected) {
      globalSocket.emit('draw:offer');
    }
  }, []);

  const emitDrawResponse = useCallback((accept: boolean) => {
    if (globalSocket?.connected) {
      globalSocket.emit('draw:response', { accept });
    }
  }, []);

  const joinGame = useCallback((roomId: string) => {
    if (globalSocket?.connected) {
      globalSocket.emit('game:join', { roomId });
    }
  }, []);

  const leaveGame = useCallback(() => {
    if (globalSocket?.connected) {
      globalSocket.emit('game:leave');
    }
  }, []);

  const startMatchmaking = useCallback((playerData: { playerId: string; username: string; rating: number }) => {
    if (globalSocket?.connected) {
      console.log('🎮 Starting matchmaking with player data:', playerData);

      const token = localStorage.getItem('skemino_auth_token') || sessionStorage.getItem('skemino_auth_token');
      const isGuest = !token;

      if (isGuest) {
        globalSocket.emit('matchmaking:join-guest', {
          timeControl: 'rapid',
          guestRating: playerData.rating || 1200,
          preferences: {
            maxRatingDifference: 400
          }
        });
        console.log('🎭 Started guest matchmaking for rapid');
      } else {
        globalSocket.emit('matchmaking:join', 'rapid');
        console.log('🔰 Started registered user matchmaking for rapid');
      }
    } else {
      console.error('❌ Cannot start matchmaking: socket not connected');
    }
  }, []);

  const cancelMatchmaking = useCallback(() => {
    if (globalSocket?.connected) {
      console.log('❌ Cancelling matchmaking');

      const token = localStorage.getItem('skemino_auth_token') || sessionStorage.getItem('skemino_auth_token');
      const isGuest = !token;

      if (isGuest) {
        globalSocket.emit('matchmaking:leave-guest');
        console.log('🎭 Cancelled guest matchmaking');
      } else {
        globalSocket.emit('matchmaking:leave');
        console.log('🔰 Cancelled registered user matchmaking');
      }
    }
  }, []);

  return {
    connected,
    connecting,
    latency,
    socket: globalSocket,
    emitMove,
    emitResign,
    emitDrawOffer,
    emitDrawResponse,
    joinGame,
    leaveGame,
    startMatchmaking,
    cancelMatchmaking,
  };
};