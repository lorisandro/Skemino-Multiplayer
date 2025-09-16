import { useEffect, useCallback, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useGameStore } from '../store/gameStore';
import { authService } from '../services/authService';
import type { Card, BoardCell, GameState, Player } from '../types/game';

interface UseSocketReturn {
  connected: boolean;
  connecting: boolean;
  latency: number;
  emitMove: (data: { card: Card; to: BoardCell }) => void;
  emitResign: () => void;
  emitDrawOffer: () => void;
  emitDrawResponse: (accept: boolean) => void;
  joinGame: (roomId: string) => void;
  leaveGame: () => void;
  startMatchmaking: (playerData: { playerId: string; username: string; rating: number }) => void;
  cancelMatchmaking: () => void;
}

let socket: Socket | null = null;

export const useSocket = (): UseSocketReturn => {
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [latency, setLatency] = useState(0);

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
    const token = localStorage.getItem('skemino_auth_token') || sessionStorage.getItem('skemino_auth_token');

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

  // Initialize socket connection
  useEffect(() => {
    if (!socket) {
      setConnecting(true);

      const initializeSocket = async () => {
        try {
          // Ensure we have authentication
          const token = await ensureAuthentication();

          if (!token) {
            console.error('Failed to obtain authentication token');
            setConnecting(false);
            return;
          }

          socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:3005', {
            transports: ['websocket', 'polling'],
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionAttempts: 5,
            timeout: 10000,
            forceNew: true,
            auth: {
              token: token,
              isGuest: !localStorage.getItem('skemino_auth_token')
            }
          });

          // Connection events
          socket.on('connect', () => {
            console.log('Connected to server');
            setConnected(true);
            setConnecting(false);
          });

          socket.on('disconnect', () => {
            console.log('Disconnected from server');
            setConnected(false);
          });

          socket.on('connect_error', (error) => {
            console.error('Connection error:', error);
            setConnecting(false);
          });

          // Latency measurement
          socket.on('pong', () => {
            const now = Date.now();
            const roundTripTime = now - (socket as any).lastPing;
            setLatency(Math.round(roundTripTime / 2));
          });

          // Ping every 5 seconds
          const pingInterval = setInterval(() => {
            if (socket?.connected) {
              (socket as any).lastPing = Date.now();
              socket.emit('ping');
            }
          }, 5000);

          return () => {
            clearInterval(pingInterval);
          };
        } catch (error) {
          console.error('Failed to initialize socket:', error);
          setConnecting(false);
        }
      };

      initializeSocket();
    }
  }, []);

  // Game event handlers
  useEffect(() => {
    if (!socket) return;

    // Game state updates
    socket.on('game:state', (gameState: GameState) => {
      setGameState(gameState);
    });

    // Player info
    socket.on('game:players', (data: { current: Player; opponent: Player }) => {
      setPlayers(data.current, data.opponent);
    });

    // Move made
    socket.on('move:made', (data: {
      card: Card;
      from?: BoardCell;
      to: BoardCell;
      capturedCard?: Card;
    }) => {
      // Update board with the move
      updateBoard(data.to, {
        card: data.card,
        owner: data.card ? 'white' : 'black', // Determine from game state
      });

      // Play move sound
      const audio = new Audio('/sounds/move.mp3');
      audio.volume = 0.3;
      audio.play().catch(() => {});
    });

    // Time updates
    socket.on('time:update', (data: { white: number; black: number }) => {
      updateTime('white', data.white);
      updateTime('black', data.black);
    });

    // Game over
    socket.on('game:over', (data: {
      winner: 'white' | 'black';
      reason: string;
    }) => {
      // Handle game over
      console.log('Game over:', data);
    });

    // Draw offer
    socket.on('draw:offered', () => {
      // Handle draw offer
      if (confirm('Your opponent offers a draw. Accept?')) {
        socket?.emit('draw:response', { accept: true });
      } else {
        socket?.emit('draw:response', { accept: false });
      }
    });

    // Chat message
    socket.on('chat:message', (data: {
      player: string;
      message: string;
      timestamp: number;
    }) => {
      // Handle chat message
      console.log('Chat:', data);
    });

    // Matchmaking events (using server's actual event names)
    socket.on('matchmaking:queued', (data: { timeControl: string }) => {
      console.log('Queued for matchmaking:', data);
      setDistributionState?.({ phase: 'waiting', isDistributing: false, currentCard: 0, animationProgress: 0 });
    });

    socket.on('match:found', (data: { gameId: string; color: string; opponent: any }) => {
      console.log('Match found:', data);
      setDistributionState?.({ phase: 'matchmaking', isDistributing: true, currentCard: 0, animationProgress: 0 });

      // Set players from match data
      const currentPlayerData = {
        id: data.color === 'white' ? 'current' : 'opponent',
        username: 'Current Player', // Will be updated with real data
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

    socket.on('game:starting', (data: { roomId: string; message: string; timestamp: number }) => {
      console.log('Game starting:', data);
      setDistributionState?.({ phase: 'starting', isDistributing: true, currentCard: 0, animationProgress: 0 });
    });

    // Card distribution events
    socket.on('cards:distribution-start', (data: { phase: string; timestamp: number }) => {
      console.log('Distribution started:', data);
      setDistributionState?.({
        phase: 'shuffling',
        isDistributing: true,
        currentCard: 0,
        animationProgress: 0
      });
    });

    socket.on('cards:distribution-phase', (data: { phase: string; timestamp: number }) => {
      console.log('Distribution phase:', data);
      setDistributionState?.({
        phase: 'dealing',
        isDistributing: true,
        currentCard: 0,
        animationProgress: 0
      });
    });

    socket.on('cards:card-dealt', (data: {
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

      // Trigger individual card animation
      triggerCardDistribution?.(data);
    });

    socket.on('cards:distribution-complete', (data: { gameState: GameState; timestamp: number }) => {
      console.log('Distribution complete:', data);

      // Set final game state
      setGameState(data.gameState);

      // Complete distribution animation
      setDistributionState?.({
        phase: 'complete',
        isDistributing: false,
        currentCard: 10,
        animationProgress: 100
      });
    });

    // Connection events
    socket.on('connection:established', (data: { socketId: string; timestamp: number; serverTime: string }) => {
      console.log('Connection established:', data);
    });

    return () => {
      if (socket) {
        socket.off('game:state');
        socket.off('game:players');
        socket.off('move:made');
        socket.off('time:update');
        socket.off('game:over');
        socket.off('draw:offered');
        socket.off('chat:message');
        socket.off('matchmaking:waiting');
        socket.off('game:found');
        socket.off('game:starting');
        socket.off('cards:distribution-start');
        socket.off('cards:distribution-phase');
        socket.off('cards:card-dealt');
        socket.off('cards:distribution-complete');
        socket.off('connection:established');
      }
    };
  }, [setGameState, setPlayers, updateBoard, updateTime, setDistributionState, triggerCardDistribution]);

  // Emit functions
  const emitMove = useCallback((data: { card: Card; to: BoardCell }) => {
    if (socket?.connected) {
      socket.emit('move:make', data);
    }
  }, []);

  const emitResign = useCallback(() => {
    if (socket?.connected) {
      socket.emit('game:resign');
    }
  }, []);

  const emitDrawOffer = useCallback(() => {
    if (socket?.connected) {
      socket.emit('draw:offer');
    }
  }, []);

  const emitDrawResponse = useCallback((accept: boolean) => {
    if (socket?.connected) {
      socket.emit('draw:response', { accept });
    }
  }, []);

  const joinGame = useCallback((roomId: string) => {
    if (socket?.connected) {
      socket.emit('game:join', { roomId });
    }
  }, []);

  const leaveGame = useCallback(() => {
    if (socket?.connected) {
      socket.emit('game:leave');
    }
  }, []);

  const startMatchmaking = useCallback((playerData: { playerId: string; username: string; rating: number }) => {
    if (socket?.connected) {
      // Use server's expected event name
      socket.emit('matchmaking:join', 'rapid'); // Default to rapid time control
    }
  }, []);

  const cancelMatchmaking = useCallback(() => {
    if (socket?.connected) {
      // Use server's expected event name
      socket.emit('matchmaking:leave');
    }
  }, []);

  return {
    connected,
    connecting,
    latency,
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