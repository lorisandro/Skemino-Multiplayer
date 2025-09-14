import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Flag,
  Handshake,
  Pause,
  Play,
  RotateCcw,
  Settings,
  Volume2,
  VolumeX,
  Crown,
  Shield
} from 'lucide-react';
import type { GameState } from '../../../types/game';

interface GameControlsProps {
  gameState: GameState | null;
  isMyTurn: boolean;
  onResign?: () => void;
  onOfferDraw?: () => void;
  onPause?: () => void;
  onSettings?: () => void;
}

export const GameControls: React.FC<GameControlsProps> = ({
  gameState,
  isMyTurn,
  onResign,
  onOfferDraw,
  onPause,
  onSettings
}) => {
  const [showConfirmResign, setShowConfirmResign] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showDrawOffer, setShowDrawOffer] = useState(false);

  const handleResign = () => {
    if (showConfirmResign) {
      onResign?.();
      setShowConfirmResign(false);
    } else {
      setShowConfirmResign(true);
      // Auto-hide after 5 seconds
      setTimeout(() => setShowConfirmResign(false), 5000);
    }
  };

  const handleDrawOffer = () => {
    if (!showDrawOffer) {
      setShowDrawOffer(true);
      onOfferDraw?.();
      // Auto-hide after 3 seconds
      setTimeout(() => setShowDrawOffer(false), 3000);
    }
  };

  const getGameStatusDisplay = () => {
    if (!gameState) return 'Waiting...';

    switch (gameState.status) {
      case 'waiting':
        return 'Waiting for opponent';
      case 'active':
        return isMyTurn ? 'Your turn' : 'Opponent\'s turn';
      case 'paused':
        return 'Game paused';
      case 'completed':
        return `Game over - ${gameState.result}`;
      default:
        return 'Unknown status';
    }
  };

  const isPaused = gameState?.status === 'paused';
  const isActive = gameState?.status === 'active';
  const isCompleted = gameState?.status === 'completed';

  return (
    <div className="space-y-4">
      {/* Game Status */}
      <div className="bg-slate-700/50 rounded-lg p-3 border border-slate-600">
        <div className="text-center">
          <div className="text-sm text-slate-400 mb-1">Game Status</div>
          <div className={`
            font-medium
            ${isMyTurn && isActive ? 'text-green-400' : 'text-slate-300'}
          `}>
            {getGameStatusDisplay()}
          </div>
          {isActive && (
            <div className={`
              w-2 h-2 rounded-full mx-auto mt-2
              ${isMyTurn ? 'bg-green-400 animate-pulse' : 'bg-slate-400'}
            `} />
          )}
        </div>
      </div>

      {/* Primary Controls */}
      <div className="space-y-2">
        {/* Resign Button */}
        <motion.button
          onClick={handleResign}
          disabled={isCompleted}
          className={`
            w-full px-4 py-3 rounded-lg font-medium transition-all duration-200
            ${showConfirmResign
              ? 'bg-red-600 hover:bg-red-500 text-white'
              : 'bg-slate-600 hover:bg-slate-500 text-slate-300'
            }
            disabled:opacity-50 disabled:cursor-not-allowed
          `}
          whileHover={{ scale: showConfirmResign ? 1.05 : 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center justify-center space-x-2">
            <Flag className="w-4 h-4" />
            <span>
              {showConfirmResign ? 'Confirm Resign?' : 'Resign'}
            </span>
          </div>
          {showConfirmResign && (
            <div className="text-xs mt-1 text-red-200">
              Click again to confirm
            </div>
          )}
        </motion.button>

        {/* Draw Offer Button */}
        <motion.button
          onClick={handleDrawOffer}
          disabled={isCompleted || showDrawOffer}
          className="w-full px-4 py-3 bg-slate-600 hover:bg-slate-500 rounded-lg font-medium text-slate-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center justify-center space-x-2">
            <Handshake className="w-4 h-4" />
            <span>
              {showDrawOffer ? 'Draw Offered' : 'Offer Draw'}
            </span>
          </div>
        </motion.button>
      </div>

      {/* Game Controls */}
      <div className="grid grid-cols-2 gap-2">
        {/* Pause/Resume */}
        <button
          onClick={onPause}
          disabled={isCompleted}
          className="flex items-center justify-center space-x-2 px-3 py-2 bg-slate-600 hover:bg-slate-500 rounded-lg text-slate-300 transition-colors disabled:opacity-50"
        >
          {isPaused ? (
            <Play className="w-4 h-4" />
          ) : (
            <Pause className="w-4 h-4" />
          )}
          <span className="text-sm">
            {isPaused ? 'Resume' : 'Pause'}
          </span>
        </button>

        {/* Settings */}
        <button
          onClick={onSettings}
          className="flex items-center justify-center space-x-2 px-3 py-2 bg-slate-600 hover:bg-slate-500 rounded-lg text-slate-300 transition-colors"
        >
          <Settings className="w-4 h-4" />
          <span className="text-sm">Settings</span>
        </button>
      </div>

      {/* Audio Controls */}
      <div className="bg-slate-700/50 rounded-lg p-3 border border-slate-600">
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-300">Sound Effects</span>
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`
              p-2 rounded-lg transition-colors
              ${soundEnabled
                ? 'bg-blue-600 text-white'
                : 'bg-slate-600 text-slate-400'
              }
            `}
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4" />
            ) : (
              <VolumeX className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="space-y-2">
        <div className="text-xs text-slate-400 uppercase tracking-wide">
          Quick Actions
        </div>

        <div className="grid grid-cols-2 gap-2">
          {/* Undo Request */}
          <button
            disabled={!isActive || isCompleted}
            className="flex items-center justify-center space-x-1 px-2 py-2 bg-slate-600/50 hover:bg-slate-600 rounded text-xs text-slate-400 transition-colors disabled:opacity-30"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Undo</span>
          </button>

          {/* Claim Victory */}
          <button
            disabled={!isActive || isCompleted}
            className="flex items-center justify-center space-x-1 px-2 py-2 bg-slate-600/50 hover:bg-slate-600 rounded text-xs text-slate-400 transition-colors disabled:opacity-30"
          >
            <Crown className="w-3 h-3" />
            <span>Claim</span>
          </button>
        </div>
      </div>

      {/* Game Info */}
      <div className="bg-slate-700/30 rounded-lg p-3 text-xs text-slate-400">
        <div className="space-y-1">
          <div className="flex justify-between">
            <span>Move count:</span>
            <span>{gameState?.moveHistory.length || 0}</span>
          </div>
          <div className="flex justify-between">
            <span>Time control:</span>
            <span>5+3</span>
          </div>
          <div className="flex justify-between">
            <span>Rated game:</span>
            <span className="text-yellow-400">Yes</span>
          </div>
        </div>
      </div>

      {/* Fair Play Notice */}
      <div className="bg-green-900/20 border border-green-700/50 rounded-lg p-2">
        <div className="flex items-center space-x-2">
          <Shield className="w-4 h-4 text-green-400" />
          <span className="text-xs text-green-300">
            Fair Play Protection Active
          </span>
        </div>
      </div>
    </div>
  );
};