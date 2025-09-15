import React from 'react';
import { motion } from 'framer-motion';
import {
  WifiIcon,
  SignalIcon,
  Cog6ToothIcon,
  PauseIcon
} from '@heroicons/react/24/outline';
import type { Player } from '../../../types/game';

interface GameHeaderProps {
  currentPlayer: Player | null;
  opponent: Player | null;
  connected: boolean;
  latency?: number;
  compact?: boolean;
  mobile?: boolean;
  className?: string;
}

/**
 * GameHeader component - Top game bar with player info and system status
 */
export const GameHeader: React.FC<GameHeaderProps> = ({
  currentPlayer,
  opponent,
  connected,
  latency,
  compact = false,
  mobile = false,
  className = '',
}) => {
  // Get connection status
  const getConnectionStatus = () => {
    if (!connected) {
      return {
        icon: WifiIcon,
        color: 'text-red-500',
        bg: 'bg-red-100',
        text: 'Disconnected'
      };
    }

    if (latency && latency > 200) {
      return {
        icon: SignalIcon,
        color: 'text-yellow-500',
        bg: 'bg-yellow-100',
        text: `${latency}ms`
      };
    }

    return {
      icon: SignalIcon,
      color: 'text-green-500',
      bg: 'bg-green-100',
      text: latency ? `${latency}ms` : 'Connected'
    };
  };

  const connectionStatus = getConnectionStatus();

  // Mobile header
  if (mobile) {
    return (
      <header className={`h-14 bg-white border-b border-gray-200 px-4 flex items-center justify-between ${className}`}>
        {/* Left - Game status */}
        <div className="flex items-center space-x-2">
          <div className="text-lg font-bold text-gray-900">Skèmino</div>
          <div className={`w-2 h-2 rounded-full ${connected ? 'bg-green-500' : 'bg-red-500'}`} />
        </div>

        {/* Right - Performance and controls */}
        <div className="flex items-center space-x-2">
          <button className="p-2 text-gray-500 hover:text-gray-700">
            <Cog6ToothIcon className="w-4 h-4" />
          </button>
        </div>
      </header>
    );
  }

  // Compact header
  if (compact) {
    return (
      <header className={`h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between ${className}`}>
        {/* Left - Players */}
        <div className="flex items-center space-x-6">
          <div className="text-xl font-bold text-gray-900">Skèmino</div>

          <div className="flex items-center space-x-4">
            {/* Current player */}
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-blue-500 rounded-full" />
              <span className="text-sm font-medium">{currentPlayer?.username || 'You'}</span>
              <span className="text-sm text-gray-500">({currentPlayer?.rating || 1500})</span>
            </div>

            <span className="text-gray-400">vs</span>

            {/* Opponent */}
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-gray-500 rounded-full" />
              <span className="text-sm font-medium">{opponent?.username || 'Opponent'}</span>
              <span className="text-sm text-gray-500">({opponent?.rating || 1500})</span>
            </div>
          </div>
        </div>

        {/* Right - Status and controls */}
        <div className="flex items-center space-x-4">
          {/* Connection status */}
          <div className={`flex items-center space-x-1 px-2 py-1 rounded-lg ${connectionStatus.bg}`}>
            <connectionStatus.icon className={`w-4 h-4 ${connectionStatus.color}`} />
            <span className={`text-xs font-medium ${connectionStatus.color}`}>
              {connectionStatus.text}
            </span>
          </div>


          {/* Controls */}
          <div className="flex items-center space-x-1">
            <button className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100">
              <PauseIcon className="w-4 h-4" />
            </button>
            <button className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100">
              <Cog6ToothIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>
    );
  }

  // Full desktop header
  return (
    <header className={`h-20 bg-white border-b border-gray-200 px-8 ${className}`}>
      <div className="h-full flex items-center justify-between">
        {/* Left - Game branding and match info */}
        <div className="flex items-center space-x-8">
          <div className="flex items-center space-x-3">
            <div className="text-2xl font-bold text-gray-900">Skèmino</div>
            <div className="px-2 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-lg">
              Competitive
            </div>
          </div>

          {/* Match info */}
          <div className="flex items-center space-x-6 text-sm">
            <div className="flex items-center space-x-2">
              <span className="text-gray-500">Game:</span>
              <span className="font-medium">#SK2024-001</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-gray-500">Time:</span>
              <span className="font-medium">5+3</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-gray-500">Rated:</span>
              <span className="font-medium text-green-600">Yes</span>
            </div>
          </div>
        </div>

        {/* Center - Players */}
        <div className="flex items-center space-x-8">
          {/* Current player */}
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <div className="font-semibold text-gray-900">{currentPlayer?.username || 'You'}</div>
              <div className="text-sm text-gray-500">Rating: {currentPlayer?.rating || 1500}</div>
            </div>
            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold">
                {(currentPlayer?.username || 'Y').charAt(0).toUpperCase()}
              </span>
            </div>
          </div>

          <div className="text-2xl font-bold text-gray-400">VS</div>

          {/* Opponent */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold">
                {(opponent?.username || 'O').charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="text-left">
              <div className="font-semibold text-gray-900">{opponent?.username || 'Opponent'}</div>
              <div className="text-sm text-gray-500">Rating: {opponent?.rating || 1500}</div>
            </div>
          </div>
        </div>

        {/* Right - System status and controls */}
        <div className="flex items-center space-x-6">
          {/* System status */}
          <div className="flex items-center space-x-4">
            {/* Connection status */}
            <motion.div
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${connectionStatus.bg}`}
              whileHover={{ scale: 1.02 }}
            >
              <connectionStatus.icon className={`w-5 h-5 ${connectionStatus.color}`} />
              <div>
                <div className={`text-sm font-medium ${connectionStatus.color}`}>
                  {connectionStatus.text}
                </div>
                <div className="text-xs text-gray-500">Network</div>
              </div>
            </motion.div>

          </div>

          {/* Game controls */}
          <div className="flex items-center space-x-2">
            <motion.button
              className="p-3 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <PauseIcon className="w-5 h-5" />
            </motion.button>
            <motion.button
              className="p-3 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Cog6ToothIcon className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </div>
    </header>
  );
};