import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSocket } from '../../hooks/useSocket';
import { useMatchmaking } from '../../hooks/useMatchmaking';
import { useGameStore } from '../../store/gameStore';
import { useAuthContext } from '../../contexts/AuthContext';

interface MatchmakingButtonProps {
  className?: string;
  autoStart?: boolean;
}

export const MatchmakingButton: React.FC<MatchmakingButtonProps> = ({ className, autoStart = false }) => {
  const { connected } = useSocket();
  const { distributionState, currentPlayer, opponent } = useGameStore();
  const { user } = useAuthContext();
  const [selectedTimeControl, setSelectedTimeControl] = useState<string>('classical');
  const [hasAutoStarted, setHasAutoStarted] = useState(false);

  // Use the matchmaking hook with proper options
  const {
    isSearching,
    joinQueue,
    leaveQueue,
    error: matchmakingError
  } = useMatchmaking({
    isGuest: !user?.id,
    userRating: user?.rating || 1200
  });

  const handleStartMatchmaking = async () => {
    if (!connected) return;

    console.log('Starting matchmaking with time control:', selectedTimeControl);
    const success = await joinQueue(selectedTimeControl);

    if (success) {
      // Save session for recovery
      localStorage.setItem('skemino_matchmaking_session', JSON.stringify({
        timeControl: selectedTimeControl,
        timestamp: Date.now()
      }));
    }
  };

  const handleCancelMatchmaking = () => {
    console.log('Cancelling matchmaking');
    leaveQueue();
    // Clear session if canceling
    localStorage.removeItem('skemino_matchmaking_session');
  };

  // Handle auto-start when prop is true
  useEffect(() => {
    if (autoStart && connected && !hasAutoStarted && !isSearching && !currentPlayer) {
      console.log('Auto-starting matchmaking from button');
      setHasAutoStarted(true); // Set this first to prevent re-runs
      handleStartMatchmaking();
    }
  }, [autoStart, connected, hasAutoStarted, isSearching, currentPlayer]);

  // Show error if any
  useEffect(() => {
    if (matchmakingError) {
      console.error('Matchmaking error:', matchmakingError);
    }
  }, [matchmakingError]);

  // Don't show button if already in game or distributing
  if (distributionState.phase === 'active' || distributionState.phase === 'complete') {
    return null;
  }

  return (
    <div className={`flex flex-col items-center gap-4 ${className}`}>
      <motion.button
        onClick={isSearching ? handleCancelMatchmaking : handleStartMatchmaking}
        disabled={!connected}
        className={`
          px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200
          ${!connected
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : isSearching || distributionState.isDistributing
            ? 'bg-red-500 hover:bg-red-600 text-white'
            : 'bg-blue-500 hover:bg-blue-600 text-white shadow-lg hover:shadow-xl'
          }
        `}
        whileHover={connected ? { scale: 1.05 } : {}}
        whileTap={connected ? { scale: 0.95 } : {}}
      >
        {!connected && 'Connecting...'}
        {connected && !isSearching && !distributionState.isDistributing && 'Find Game'}
        {connected && (isSearching || distributionState.isDistributing) && 'Cancel'}
      </motion.button>

      {/* Status indicators */}
      {(distributionState.phase === 'waiting' || (isSearching && !opponent)) && (
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="flex items-center gap-2 text-blue-600">
            <div className="animate-spin w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full" />
            <span className="text-sm font-medium">Searching for opponent...</span>
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {user ? `Matching for rating ${user.rating || 1000}` : 'Rating-based matching in progress'}
          </div>
        </motion.div>
      )}

      {distributionState.phase === 'matchmaking' && (
        <motion.div
          className="text-center text-green-600"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="text-sm font-medium">✓ Opponent found!</div>
          <div className="text-xs text-gray-500">Preparing game...</div>
        </motion.div>
      )}

      {distributionState.isDistributing && (
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="text-sm font-medium text-gray-700">
            {distributionState.phase === 'shuffling' && 'Shuffling cards...'}
            {distributionState.phase === 'dealing' && `Dealing card ${distributionState.currentCard}/10`}
          </div>
          <div className="w-48 h-2 bg-gray-200 rounded-full overflow-hidden mt-2">
            <motion.div
              className="h-full bg-blue-500"
              animate={{ width: `${distributionState.animationProgress}%` }}
              transition={{ duration: 0.2 }}
            />
          </div>
        </motion.div>
      )}

      {/* Connection status */}
      <div className="flex items-center gap-2 text-xs">
        <div
          className={`w-2 h-2 rounded-full ${
            connected ? 'bg-green-500' : 'bg-red-500'
          }`}
        />
        <span className="text-gray-600">
          {connected ? 'Connected' : 'Disconnected'}
        </span>
      </div>
    </div>
  );
};