import { useEffect, useCallback, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useGameStore } from '../store/gameStore';
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

  // Initialize socket connection
  useEffect(() => {
    if (!socket) {
      setConnecting(true);

      try {
        socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000', {
          transports: ['websocket', 'polling'],
          reconnection: true,
          reconnectionDelay: 1000,
          reconnectionAttempts: 5,
          timeout: 10000,
          forceNew: true,
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

    return () => {
      if (socket) {
        socket.off('game:state');
        socket.off('game:players');
        socket.off('move:made');
        socket.off('time:update');
        socket.off('game:over');
        socket.off('draw:offered');
        socket.off('chat:message');
      }
    };
  }, [setGameState, setPlayers, updateBoard, updateTime]);

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
  };
};