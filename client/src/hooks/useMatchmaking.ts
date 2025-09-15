import { useState, useEffect, useCallback } from 'react';
// import { useWebSocket } from './useWebSocket'; // Temporarily disabled for demo

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
  // const { socket, isConnected } = useWebSocket(); // Temporarily disabled for demo
  const socket = null;
  const isConnected = true; // Mock connection for demo

  const [state, setState] = useState<MatchmakingState>({
    isSearching: false,
    timeControl: null,
    queuePosition: null,
    estimatedWait: null,
    error: null,
  });

  // Join matchmaking queue (Demo version)
  const joinQueue = useCallback(async (timeControl: string) => {
    console.log('🎮 Starting matchmaking demo for:', timeControl);

    try {
      setState(prev => ({
        ...prev,
        isSearching: true,
        timeControl,
        error: null,
      }));

      // Demo: Timeout after 1 minute with no match found
      const timeoutDelay = 60000; // 1 minute
      setTimeout(() => {
        setState(prev => ({
          ...prev,
          isSearching: false,
          timeControl: null,
          queuePosition: null,
          estimatedWait: null,
          error: 'Nessun avversario trovato!',
        }));

        onError?.('Nessun avversario trovato!');
        console.log('⏰ Matchmaking timeout - no opponent found');
      }, timeoutDelay);

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
  }, [isGuest, userRating, onError, onMatchFound]);

  // Leave matchmaking queue (Demo version)
  const leaveQueue = useCallback(() => {
    console.log('❌ Leaving matchmaking queue (demo)');

    setState(prev => ({
      ...prev,
      isSearching: false,
      timeControl: null,
      queuePosition: null,
      estimatedWait: null,
    }));
  }, []);

  // Set up socket event listeners (Disabled for demo)
  useEffect(() => {
    // Disabled for demo - no WebSocket connection needed
    return () => {};
  }, []);

  // Auto-cleanup on unmount or disconnection (Demo version)
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