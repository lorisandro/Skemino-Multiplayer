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

  // Get rating color based on rating range (Gaming-optimized for dark backgrounds)
  const getRatingColor = (rating: number) => {
    if (rating < 1200) return 'text-slate-400';    // Beginner
    if (rating < 1400) return 'text-green-400';    // Novice
    if (rating < 1600) return 'text-blue-400';     // Intermediate
    if (rating < 1800) return 'text-purple-400';   // Advanced
    if (rating < 2000) return 'text-orange-400';   // Expert
    if (rating < 2200) return 'text-red-400';      // Master
    return 'text-yellow-400';                      // Grand Master+
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

  // Get rank border gradient for avatar (Gaming-style rank indication)
  const getRankBorderGradient = (rating: number) => {
    if (rating < 1200) return 'bg-gradient-to-br from-slate-500 to-slate-600';
    if (rating < 1400) return 'bg-gradient-to-br from-green-400 to-green-500';
    if (rating < 1600) return 'bg-gradient-to-br from-blue-400 to-blue-500';
    if (rating < 1800) return 'bg-gradient-to-br from-purple-400 to-purple-500';
    if (rating < 2000) return 'bg-gradient-to-br from-orange-400 to-orange-500';
    if (rating < 2200) return 'bg-gradient-to-br from-red-400 to-red-500';
    return 'bg-gradient-to-br from-yellow-400 to-yellow-500';
  };

  // Get rank badge style
  const getRankBadgeStyle = (rating: number) => {
    const baseStyle = 'text-xs font-medium rounded-full px-2 py-0.5';
    if (rating < 1200) return `${baseStyle} bg-slate-800 text-slate-400`;
    if (rating < 1400) return `${baseStyle} bg-green-900 text-green-400`;
    if (rating < 1600) return `${baseStyle} bg-blue-900 text-blue-400`;
    if (rating < 1800) return `${baseStyle} bg-purple-900 text-purple-400`;
    if (rating < 2000) return `${baseStyle} bg-orange-900 text-orange-400`;
    if (rating < 2200) return `${baseStyle} bg-red-900 text-red-400`;
    return `${baseStyle} bg-yellow-900 text-yellow-400`;
  };

  // Mobile layout
  if (mobile) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        {/* Avatar with rank border */}
        <div className="relative">
          <div className={`w-7 h-7 rounded-full p-0.5 ${getRankBorderGradient(displayPlayer.rating)}`}>
            <div className="w-full h-full bg-slate-800 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">
                {displayPlayer.username.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
          {/* Online indicator */}
          <div className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border border-slate-800 ${displayPlayer.isOnline ? 'bg-green-500' : 'bg-red-500'}`} />

          {/* Turn indicator */}
          {isCurrentTurn && (
            <motion.div
              className="absolute -top-0.5 -left-0.5 w-2 h-2 bg-green-400 rounded-full"
              animate={{
                scale: [1, 1.4, 1],
                opacity: [0.8, 1, 0.8],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          )}
        </div>

        {/* Player info */}
        <div className="min-w-0 flex-1">
          <div className="text-sm font-medium text-white truncate">
            {displayPlayer.username}
          </div>
          <div className={`text-xs font-medium ${getRatingColor(displayPlayer.rating)}`}>
            {displayPlayer.rating}
          </div>
        </div>
      </div>
    );
  }

  // Compact layout
  if (compact) {
    return (
      <div className={`flex items-center space-x-3 ${className}`}>
        {/* Avatar with rank border */}
        <div className="relative">
          <div className={`w-11 h-11 rounded-full p-0.5 ${getRankBorderGradient(displayPlayer.rating)}`}>
            <div className="w-full h-full bg-slate-800 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">
                {displayPlayer.username.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
          {/* Online indicator */}
          <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-slate-800 ${displayPlayer.isOnline ? 'bg-green-500' : 'bg-red-500'}`} />

          {/* Turn indicator */}
          {isCurrentTurn && (
            <motion.div
              className="absolute -top-1 -left-1 w-3 h-3 bg-green-400 rounded-full"
              animate={{
                scale: [1, 1.4, 1],
                opacity: [0.8, 1, 0.8],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          )}
        </div>

        {/* Player info */}
        <div className="min-w-0 flex-1">
          <div className="text-sm font-medium text-white truncate">
            {displayPlayer.username}
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-sm font-bold ${getRatingColor(displayPlayer.rating)}`}>
              {displayPlayer.rating}
            </span>
            <div className={getRankBadgeStyle(displayPlayer.rating)}>
              {getTitle(displayPlayer.rating)}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Full desktop layout
  return (
    <div className={`${className}`}>
      {/* Player header */}
      <div className="flex items-center space-x-4 mb-4">
        {/* Avatar with rank border */}
        <div className="relative">
          <div className={`w-14 h-14 rounded-full p-0.5 ${getRankBorderGradient(displayPlayer.rating)}`}>
            <div className="w-full h-full bg-slate-800 rounded-full flex items-center justify-center">
              <span className="text-white text-lg font-bold">
                {displayPlayer.username.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
          {/* Online indicator */}
          <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-slate-800 ${displayPlayer.isOnline ? 'bg-green-500' : 'bg-red-500'}`} />

          {/* Turn indicator */}
          {isCurrentTurn && (
            <motion.div
              className="absolute -top-1 -left-1 w-4 h-4 bg-green-400 rounded-full"
              animate={{
                scale: [1, 1.4, 1],
                opacity: [0.8, 1, 0.8],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          )}
        </div>

        {/* Player details */}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-white truncate mb-1">
            {displayPlayer.username}
          </h3>
          <div className="flex items-center gap-3">
            <span className={`text-xl font-bold ${getRatingColor(displayPlayer.rating)}`}>
              {displayPlayer.rating}
            </span>
            {showDetails && (
              <div className={getRankBadgeStyle(displayPlayer.rating)}>
                {getTitle(displayPlayer.rating)}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Additional details */}
      {showDetails && (
        <div className="space-y-3 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Color:</span>
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${displayPlayer.color === 'white' ? 'bg-white border-2 border-slate-600' : 'bg-slate-800 border-2 border-slate-500'}`} />
              <span className="capitalize text-slate-300 font-medium">{displayPlayer.color}</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-400">Status:</span>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${displayPlayer.isOnline ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className={`font-medium ${displayPlayer.isOnline ? 'text-green-400' : 'text-red-400'}`}>
                {displayPlayer.isOnline ? 'Online' : 'Offline'}
              </span>
            </div>
          </div>

          {isCurrentTurn && (
            <motion.div
              className="mt-3 px-4 py-2 bg-gradient-to-r from-green-800/30 to-green-700/30 border border-green-600/50 rounded-lg text-center backdrop-blur-sm"
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <span className="text-green-400 font-medium flex items-center justify-center gap-2">
                <motion.div
                  className="w-2 h-2 bg-green-400 rounded-full"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                />
                {isOpponent ? "Opponent's Turn" : "Your Turn"}
              </span>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
};