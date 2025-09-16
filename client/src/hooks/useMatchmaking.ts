import { useState, useEffect, useCallback } from 'react';
import { useSocket } from './useSocket';

export interface MatchmakingState {
  isSearching: boolean;
  timeControl: string | null;
  queuePosition: number | null;
  estimatedWait: number | null;
  error: string | null;
}

export interface MatchFoundData {
  gameId: string;
  color: 'white' | 'black';
  opponent: {
    userId: string;
    username: string;
    rating: number;
    isGuest?: boolean;
  };
  timeControl: string;
}

interface UseMatchmakingOptions {
  onMatchFound?: (data: MatchFoundData) => void;
  onError?: (error: string) => void;
  isGuest?: boolean;
  userRating?: number;
}

export const useMatchmaking = (options: UseMatchmakingOptions = {}) => {
  const { onMatchFound, onError, isGuest = false, userRating = 1200 } = options;
  const { connected, socket } = useSocket();

  const [state, setState] = useState<MatchmakingState>({
    isSearching: false,
    timeControl: null,
    queuePosition: null,
    estimatedWait: null,
    error: null,
  });

  // Join matchmaking queue
  const joinQueue = useCallback(async (timeControl: string) => {
    if (!socket || !connected) {
      onError?.('Non connesso al server');
      return false;
    }

    console.log('🎮 Starting real matchmaking for:', timeControl);

    try {
      setState(prev => ({
        ...prev,
        isSearching: true,
        timeControl,
        error: null,
      }));

      // Emit matchmaking join event based on user type
      if (isGuest) {
        socket.emit('matchmaking:join-guest', {
          timeControl,
          guestRating: userRating,
          preferences: {
            maxRatingDifference: 400, // More flexible for guests
          }
        });
      } else {
        socket.emit('matchmaking:join', timeControl);
      }

      console.log(`🚀 Sent matchmaking request: ${isGuest ? 'guest' : 'registered'} player for ${timeControl}`);
      return true;
    } catch (error) {
      console.error('Error joining matchmaking:', error);
      setState(prev => ({
        ...prev,
        isSearching: false,
        error: 'Failed to join matchmaking queue',
      }));
      onError?.('Failed to join matchmaking queue');
      return false;
    }
  }, [socket, isConnected, isGuest, userRating, onError]);

  // Leave matchmaking queue
  const leaveQueue = useCallback(() => {
    if (!socket || !isConnected) return;

    console.log('❌ Leaving matchmaking queue');

    // Emit leave event based on user type
    if (isGuest) {
      socket.emit('matchmaking:leave-guest');
    } else {
      socket.emit('matchmaking:leave');
    }

    setState(prev => ({
      ...prev,
      isSearching: false,
      timeControl: null,
      queuePosition: null,
      estimatedWait: null,
    }));
  }, [socket, isConnected, isGuest]);

  // Set up socket event listeners
  useEffect(() => {
    if (!socket) return;

    // Match found event
    const handleMatchFound = (data: any) => {
      console.log('🎯 Match found:', data);

      setState(prev => ({
        ...prev,
        isSearching: false,
        timeControl: null,
        queuePosition: null,
        estimatedWait: null,
        error: null,
      }));

      // Transform server data to client format
      const matchData: MatchFoundData = {
        gameId: data.gameId,
        color: data.color,
        opponent: data.opponent,
        timeControl: data.timeControl || state.timeControl || 'rapid'
      };

      onMatchFound?.(matchData);
    };

    // Matchmaking queue events
    const handleQueuedEvent = (data: any) => {
      console.log('⏳ Queued for matchmaking:', data);
      setState(prev => ({
        ...prev,
        isSearching: true,
        timeControl: data.timeControl,
        error: null,
      }));
    };

    const handleGuestQueuedEvent = (data: any) => {
      console.log('🎭 Guest queued for matchmaking:', data);
      setState(prev => ({
        ...prev,
        isSearching: true,
        timeControl: data.timeControl,
        error: null,
      }));
    };

    // Error events
    const handleMatchmakingError = (error: any) => {
      console.error('❌ Matchmaking error:', error);
      setState(prev => ({
        ...prev,
        isSearching: false,
        error: error.message || 'Errore nel matchmaking',
      }));
      onError?.(error.message || 'Errore nel matchmaking');
    };

    const handleGuestMatchmakingError = (error: any) => {
      console.error('❌ Guest matchmaking error:', error);
      setState(prev => ({
        ...prev,
        isSearching: false,
        error: error.message || 'Errore nel matchmaking guest',
      }));
      onError?.(error.message || 'Errore nel matchmaking guest');
    };

    // General error event
    const handleError = (error: any) => {
      console.error('❌ Socket error:', error);
      setState(prev => ({
        ...prev,
        error: error.message || 'Errore di connessione',
      }));
      onError?.(error.message || 'Errore di connessione');
    };

    // Register event listeners
    socket.on('match:found', handleMatchFound);
    socket.on('matchmaking:queued', handleQueuedEvent);
    socket.on('matchmaking:guest-queued', handleGuestQueuedEvent);
    socket.on('matchmaking:error', handleMatchmakingError);
    socket.on('matchmaking:guest-error', handleGuestMatchmakingError);
    socket.on('error', handleError);

    // Cleanup function
    return () => {
      socket.off('match:found', handleMatchFound);
      socket.off('matchmaking:queued', handleQueuedEvent);
      socket.off('matchmaking:guest-queued', handleGuestQueuedEvent);
      socket.off('matchmaking:error', handleMatchmakingError);
      socket.off('matchmaking:guest-error', handleGuestMatchmakingError);
      socket.off('error', handleError);
    };
  }, [socket, onMatchFound, onError, state.timeControl]);

  // Auto-cleanup on unmount or disconnection
  useEffect(() => {
    return () => {
      if (state.isSearching) {
        leaveQueue();
      }
    };
  }, [state.isSearching, leaveQueue]);

  return {
    ...state,
    joinQueue,
    leaveQueue,
    isConnected,
  };
};