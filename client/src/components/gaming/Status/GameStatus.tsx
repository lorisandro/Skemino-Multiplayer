import React from 'react';
import { motion } from 'framer-motion';
import {
  Wifi,
  WifiOff,
  Zap,
  Users,
  Trophy,
  Eye,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';
import type { GameState } from '../../../types/game';

interface GameStatusProps {
  connected: boolean;
  latency?: number;
  gameState: GameState | null;
  spectatorCount?: number;
  isRated?: boolean;
}

export const GameStatus: React.FC<GameStatusProps> = ({
  connected,
  latency,
  gameState,
  spectatorCount = 0,
  isRated = true
}) => {
  const getConnectionStatus = () => {
    if (!connected) return { color: 'text-red-400', text: 'Disconnected' };
    if (!latency) return { color: 'text-yellow-400', text: 'Connecting...' };
    if (latency < 50) return { color: 'text-green-400', text: 'Excellent' };
    if (latency < 100) return { color: 'text-blue-400', text: 'Good' };
    if (latency < 200) return { color: 'text-yellow-400', text: 'Fair' };
    return { color: 'text-red-400', text: 'Poor' };
  };

  const getGameStatus = () => {
    if (!gameState) return { color: 'text-slate-400', text: 'Waiting...', icon: Clock };

    switch (gameState.status) {
      case 'waiting':
        return { color: 'text-yellow-400', text: 'Waiting for opponent', icon: Users };
      case 'active':
        return { color: 'text-green-400', text: 'Game in progress', icon: CheckCircle };
      case 'paused':
        return { color: 'text-blue-400', text: 'Game paused', icon: Clock };
      case 'completed':
        return { color: 'text-purple-400', text: 'Game completed', icon: Trophy };
      default:
        return { color: 'text-red-400', text: 'Unknown status', icon: AlertCircle };
    }
  };

  const connectionStatus = getConnectionStatus();
  const gameStatus = getGameStatus();
  const GameStatusIcon = gameStatus.icon;

  return (
    <div className="flex items-center justify-between w-full">
      {/* Left Section - Game Info */}
      <div className="flex items-center space-x-6">
        {/* Skèmino Branding */}
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">S</span>
          </div>
          <div>
            <div className="text-white font-semibold">Skèmino</div>
            <div className="text-xs text-slate-400">Competitive Gaming</div>
          </div>
        </div>

        {/* Game Status */}
        <div className="flex items-center space-x-2">
          <GameStatusIcon className={`w-4 h-4 ${gameStatus.color}`} />
          <span className={`text-sm font-medium ${gameStatus.color}`}>
            {gameStatus.text}
          </span>
        </div>

        {/* Game Type */}
        {isRated && (
          <div className="flex items-center space-x-2">
            <Trophy className="w-4 h-4 text-yellow-400" />
            <span className="text-sm text-yellow-400 font-medium">Rated</span>
          </div>
        )}

        {/* Spectators */}
        {spectatorCount > 0 && (
          <div className="flex items-center space-x-2">
            <Eye className="w-4 h-4 text-slate-400" />
            <span className="text-sm text-slate-400">
              {spectatorCount} watching
            </span>
          </div>
        )}
      </div>

      {/* Right Section - Technical Status */}
      <div className="flex items-center space-x-6">
        {/* Move Counter */}
        {gameState && (
          <div className="text-sm text-slate-300">
            <span className="text-slate-400">Move:</span>{' '}
            <span className="font-mono">{gameState.moveHistory.length}</span>
          </div>
        )}

        {/* Connection Status */}
        <div className="flex items-center space-x-2">
          <motion.div
            animate={{ rotate: connected ? 0 : 180 }}
            transition={{ duration: 0.3 }}
          >
            {connected ? (
              <Wifi className={`w-4 h-4 ${connectionStatus.color}`} />
            ) : (
              <WifiOff className="w-4 h-4 text-red-400" />
            )}
          </motion.div>
          <div className="text-sm">
            <span className={connectionStatus.color}>
              {connectionStatus.text}
            </span>
            {latency && (
              <span className="text-slate-400 ml-1">
                ({latency}ms)
              </span>
            )}
          </div>
        </div>

        {/* Performance Indicator */}
        <div className="flex items-center space-x-2">
          <Zap className={`w-4 h-4 ${
            latency && latency < 100 ? 'text-green-400' : 'text-yellow-400'
          }`} />
          <span className="text-sm text-slate-400">
            {latency && latency < 100 ? 'Optimal' : 'Normal'}
          </span>
        </div>

        {/* Version Info */}
        <div className="text-xs text-slate-500">
          v1.0.0-beta
        </div>
      </div>
    </div>
  );
};