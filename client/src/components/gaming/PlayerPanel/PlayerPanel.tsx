import React from 'react';
import { motion } from 'framer-motion';
import { User, Crown, Shield, Target } from 'lucide-react';
import type { Player, GameState } from '../../../types/game';

interface PlayerPanelProps {
  player: Player | null;
  isOpponent: boolean;
  gameState: GameState | null;
}

export const PlayerPanel: React.FC<PlayerPanelProps> = ({
  player,
  isOpponent,
  gameState
}) => {
  if (!player) {
    return (
      <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-slate-600 rounded-full flex items-center justify-center">
            <User className="w-6 h-6 text-slate-400" />
          </div>
          <div className="flex-1">
            <div className="text-slate-400 text-sm">Waiting for player...</div>
          </div>
        </div>
      </div>
    );
  }

  const getRatingColor = (rating: number) => {
    if (rating >= 2400) return 'text-purple-400'; // Super GM
    if (rating >= 2200) return 'text-yellow-400'; // GM
    if (rating >= 2000) return 'text-orange-400'; // Master
    if (rating >= 1800) return 'text-blue-400'; // Expert
    if (rating >= 1600) return 'text-green-400'; // Class A
    if (rating >= 1400) return 'text-cyan-400'; // Class B
    if (rating >= 1200) return 'text-gray-400'; // Class C
    return 'text-slate-400'; // Beginner
  };

  const getRatingTitle = (rating: number) => {
    if (rating >= 2700) return 'Super Grand Master';
    if (rating >= 2500) return 'Grand Master';
    if (rating >= 2400) return 'International Master';
    if (rating >= 2200) return 'FIDE Master';
    if (rating >= 2000) return 'Candidate Master';
    if (rating >= 1800) return 'Expert';
    if (rating >= 1600) return 'Class A';
    if (rating >= 1400) return 'Class B';
    if (rating >= 1200) return 'Class C';
    return 'Beginner';
  };

  const getCardsRemaining = () => {
    if (!gameState) return 0;
    return player.color === 'white'
      ? gameState.whiteHand.length
      : gameState.blackHand.length;
  };

  const getVerticesControlled = () => {
    if (!gameState) return 0;
    const vertices = ['a1', 'f1', 'a6', 'f6'];
    return vertices.filter(vertex => {
      const position = gameState.board.get(vertex as any);
      return position?.owner === player.color;
    }).length;
  };

  return (
    <motion.div
      className={`
        bg-gradient-to-r rounded-lg p-4 border-2 transition-all duration-300
        ${isOpponent
          ? 'from-red-900/20 to-red-800/20 border-red-700/50'
          : 'from-blue-900/20 to-blue-800/20 border-blue-700/50'
        }
        ${gameState?.currentTurn === player.color
          ? 'ring-2 ring-yellow-400/50 shadow-lg shadow-yellow-400/20'
          : ''
        }
      `}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Player Header */}
      <div className="flex items-center space-x-3 mb-3">
        {/* Avatar */}
        <div className={`
          w-12 h-12 rounded-full flex items-center justify-center border-2
          ${player.isOnline
            ? 'border-green-400 bg-green-900/30'
            : 'border-red-400 bg-red-900/30'
          }
        `}>
          {player.avatar ? (
            <img
              src={player.avatar}
              alt={player.username}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <User className={`w-6 h-6 ${player.isOnline ? 'text-green-400' : 'text-red-400'}`} />
          )}
        </div>

        {/* Player Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2">
            <h3 className="font-semibold text-white truncate">
              {player.username}
            </h3>
            {player.rating >= 2400 && (
              <Crown className="w-4 h-4 text-yellow-400" />
            )}
            <div className={`
              w-2 h-2 rounded-full
              ${player.isOnline ? 'bg-green-400' : 'bg-red-400'}
            `} />
          </div>

          <div className={`text-sm font-medium ${getRatingColor(player.rating)}`}>
            {player.rating} • {getRatingTitle(player.rating)}
          </div>
        </div>

        {/* Turn Indicator */}
        {gameState?.currentTurn === player.color && (
          <motion.div
            className="w-3 h-3 bg-yellow-400 rounded-full"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
        )}
      </div>

      {/* Game Statistics */}
      <div className="grid grid-cols-2 gap-3 text-sm">
        {/* Cards Remaining */}
        <div className="bg-slate-800/50 rounded p-2">
          <div className="flex items-center space-x-2">
            <Shield className="w-4 h-4 text-blue-400" />
            <span className="text-slate-300">Cards</span>
          </div>
          <div className="text-lg font-bold text-white">
            {getCardsRemaining()}
          </div>
        </div>

        {/* Vertices Controlled */}
        <div className="bg-slate-800/50 rounded p-2">
          <div className="flex items-center space-x-2">
            <Target className="w-4 h-4 text-purple-400" />
            <span className="text-slate-300">Vertices</span>
          </div>
          <div className="text-lg font-bold text-white">
            {getVerticesControlled()}/4
          </div>
        </div>
      </div>

      {/* Player Color Indicator */}
      <div className="mt-3 flex items-center justify-center">
        <div className={`
          px-3 py-1 rounded-full text-xs font-medium
          ${player.color === 'white'
            ? 'bg-gray-200 text-gray-800'
            : 'bg-gray-800 text-gray-200'
          }
        `}>
          Playing as {player.color}
        </div>
      </div>

      {/* Time Remaining (if game is active) */}
      {gameState?.status === 'active' && (
        <div className="mt-3 text-center">
          <div className="text-xs text-slate-400">Time Remaining</div>
          <div className={`
            text-lg font-mono font-bold
            ${player.timeRemaining < 60 ? 'text-red-400' : 'text-white'}
          `}>
            {Math.floor(player.timeRemaining / 60)}:
            {(player.timeRemaining % 60).toString().padStart(2, '0')}
          </div>
        </div>
      )}
    </motion.div>
  );
};