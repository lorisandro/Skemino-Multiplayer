import { useState, useEffect, useCallback } from 'react';
import { useWebSocket } from './useWebSocket';

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
  const { socket, isConnected } = useWebSocket();

  const [state, setState] = useState<MatchmakingState>({
    isSearching: false,
    timeControl: null,
    queuePosition: null,
    estimatedWait: null,
    error: null,
  });

  // Join matchmaking queue
  const joinQueue = useCallback(async (timeControl: string) => {
    if (!socket || !isConnected) {
      onError?.('No connection to server');
      return false;
    }

    try {
      setState(prev => ({
        ...prev,
        isSearching: true,
        timeControl,
        error: null,
      }));

      // For guests, use a different event or include guest flag
      if (isGuest) {
        socket.emit('matchmaking:join-guest', {
          timeControl,
          guestRating: userRating,
          preferences: {
            maxRatingDifference: 400, // More flexible for guests
            preferredColor: 'random',
          }
        });
      } else {
        socket.emit('matchmaking:join', timeControl);
      }

      return true;
    } catch (error) {
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
    if (!socket) return;

    setState(prev => ({
      ...prev,
      isSearching: false,
      timeControl: null,
      queuePosition: null,
      estimatedWait: null,
    }));

    if (isGuest) {
      socket.emit('matchmaking:leave-guest');
    } else {
      socket.emit('matchmaking:leave');
    }
  }, [socket, isGuest]);

  // Set up socket event listeners
  useEffect(() => {
    if (!socket) return;

    // Match found
    const handleMatchFound = (data: MatchFoundData) => {
      setState(prev => ({
        ...prev,
        isSearching: false,
        timeControl: null,
        queuePosition: null,
        estimatedWait: null,
      }));
      onMatchFound?.(data);
    };

    // Queue status updates
    const handleQueueUpdate = (data: {
      position: number;
      estimatedWait: number;
      playersInQueue: number;
    }) => {
      setState(prev => ({
        ...prev,
        queuePosition: data.position,
        estimatedWait: data.estimatedWait,
      }));
    };

    // Matchmaking queued
    const handleQueued = (data: { timeControl: string }) => {
      setState(prev => ({
        ...prev,
        isSearching: true,
        timeControl: data.timeControl,
      }));
    };

    // Matchmaking error
    const handleMatchmakingError = (error: { code: string; message: string }) => {
      setState(prev => ({
        ...prev,
        isSearching: false,
        error: error.message,
      }));
      onError?.(error.message);
    };

    // Register listeners
    socket.on('match:found', handleMatchFound);
    socket.on('matchmaking:queue-update', handleQueueUpdate);
    socket.on('matchmaking:queued', handleQueued);
    socket.on('matchmaking:error', handleMatchmakingError);

    // Guest-specific events
    if (isGuest) {
      socket.on('matchmaking:guest-queued', handleQueued);
      socket.on('matchmaking:guest-error', handleMatchmakingError);
    }

    // Cleanup
    return () => {
      socket.off('match:found', handleMatchFound);
      socket.off('matchmaking:queue-update', handleQueueUpdate);
      socket.off('matchmaking:queued', handleQueued);
      socket.off('matchmaking:error', handleMatchmakingError);

      if (isGuest) {
        socket.off('matchmaking:guest-queued', handleQueued);
        socket.off('matchmaking:guest-error', handleMatchmakingError);
      }
    };
  }, [socket, onMatchFound, onError, isGuest]);

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