import React from 'react';
import { motion } from 'framer-motion';
import type { Player } from '../../../types/game';

interface PlayerInfoProps {
  player: Player | null;
  isOpponent: boolean;
  isCurrentTurn: boolean;
  compact?: boolean;
  mobile?: boolean;
  showDetails?: boolean;
  className?: string;
}

/**
 * PlayerInfo component - Displays player information and status
 */
export const PlayerInfo: React.FC<PlayerInfoProps> = ({
  player,
  isOpponent,
  isCurrentTurn,
  compact = false,
  mobile = false,
  showDetails = true,
  className = '',
}) => {
  // Default player data for development
  const displayPlayer = player || {
    id: 'guest',
    username: isOpponent ? 'Opponent' : 'You',
    rating: 1500,
    color: isOpponent ? 'black' : 'white',
    timeRemaining: 300,
    isOnline: true,
  };

  // Get rating color based on rating range
  const getRatingColor = (rating: number) => {
    if (rating < 1200) return 'text-gray-600';
    if (rating < 1400) return 'text-green-600';
    if (rating < 1600) return 'text-blue-600';
    if (rating < 1800) return 'text-purple-600';
    if (rating < 2000) return 'text-red-600';
    if (rating < 2200) return 'text-yellow-600';
    return 'text-gold-600';
  };

  // Get title based on rating
  const getTitle = (rating: number) => {
    if (rating < 1200) return 'Beginner';
    if (rating < 1400) return 'Novice';
    if (rating < 1600) return 'Intermediate';
    if (rating < 1800) return 'Advanced';
    if (rating < 2000) return 'Expert';
    if (rating < 2200) return 'Master';
    if (rating < 2400) return 'Grand Master';
    return 'Super Grand Master';
  };

  // Mobile layout
  if (mobile) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        {/* Avatar */}
        <div className="relative">
          <div className="w-6 h-6 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">
              {displayPlayer.username.charAt(0).toUpperCase()}
            </span>
          </div>
          {/* Online indicator */}
          <div className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full ${displayPlayer.isOnline ? 'bg-green-500' : 'bg-gray-400'}`} />
        </div>

        {/* Player info */}
        <div className="min-w-0 flex-1">
          <div className="text-sm font-medium text-gray-900 truncate">
            {displayPlayer.username}
          </div>
          <div className={`text-xs ${getRatingColor(displayPlayer.rating)}`}>
            {displayPlayer.rating}
          </div>
        </div>

        {/* Turn indicator */}
        {isCurrentTurn && (
          <motion.div
            className="w-2 h-2 bg-green-500 rounded-full"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.7, 1, 0.7],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        )}
      </div>
    );
  }

  // Compact layout
  if (compact) {
    return (
      <div className={`flex items-center space-x-3 ${className}`}>
        {/* Avatar */}
        <div className="relative">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-bold">
              {displayPlayer.username.charAt(0).toUpperCase()}
            </span>
          </div>
          {/* Online indicator */}
          <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${displayPlayer.isOnline ? 'bg-green-500' : 'bg-gray-400'}`} />
        </div>

        {/* Player info */}
        <div className="min-w-0">
          <div className="text-sm font-medium text-gray-900 truncate">
            {displayPlayer.username}
          </div>
          <div className={`text-sm font-medium ${getRatingColor(displayPlayer.rating)}`}>
            {displayPlayer.rating}
          </div>
        </div>

        {/* Turn indicator */}
        {isCurrentTurn && (
          <motion.div
            className="w-3 h-3 bg-green-500 rounded-full"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.7, 1, 0.7],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        )}
      </div>
    );
  }

  // Full desktop layout
  return (
    <div className={`${className}`}>
      {/* Player header */}
      <div className="flex items-center space-x-4 mb-3">
        {/* Avatar */}
        <div className="relative">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white text-lg font-bold">
              {displayPlayer.username.charAt(0).toUpperCase()}
            </span>
          </div>
          {/* Online indicator */}
          <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${displayPlayer.isOnline ? 'bg-green-500' : 'bg-gray-400'}`} />

          {/* Turn indicator */}
          {isCurrentTurn && (
            <motion.div
              className="absolute -top-1 -left-1 w-4 h-4 bg-green-500 rounded-full"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.7, 1, 0.7],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          )}
        </div>

        {/* Player details */}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 truncate">
            {displayPlayer.username}
          </h3>
          <div className="flex items-center space-x-2">
            <span className={`text-lg font-bold ${getRatingColor(displayPlayer.rating)}`}>
              {displayPlayer.rating}
            </span>
            {showDetails && (
              <span className="text-sm text-gray-500">
                {getTitle(displayPlayer.rating)}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Additional details */}
      {showDetails && (
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center justify-between">
            <span>Color:</span>
            <div className="flex items-center space-x-1">
              <div className={`w-3 h-3 rounded-full ${displayPlayer.color === 'white' ? 'bg-white border-2 border-gray-400' : 'bg-gray-800'}`} />
              <span className="capitalize">{displayPlayer.color}</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span>Status:</span>
            <span className={`font-medium ${displayPlayer.isOnline ? 'text-green-600' : 'text-gray-500'}`}>
              {displayPlayer.isOnline ? 'Online' : 'Offline'}
            </span>
          </div>

          {isCurrentTurn && (
            <motion.div
              className="mt-3 px-3 py-2 bg-green-100 border border-green-300 rounded-lg text-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <span className="text-green-800 font-medium">
                {isOpponent ? "Opponent's Turn" : "Your Turn"}
              </span>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
};