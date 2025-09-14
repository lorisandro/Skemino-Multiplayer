import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  XMarkIcon,
  ChartBarIcon,
  UsersIcon,
  CogIcon,
  ChatBubbleLeftIcon,
  InformationCircleIcon,
  PlayIcon,
} from '@heroicons/react/24/outline';
import { PlayTab } from '../PlayTab/PlayTab';
import type { GameState, Player } from '../../../types/game';

interface GameSidebarProps {
  onClose: () => void;
  gameState: GameState | null;
  currentPlayer: Player | null;
  opponent: Player | null;
  className?: string;
  onMatchFound?: (gameId: string, opponent: any) => void;
}

/**
 * GameSidebar component - Collapsible sidebar with game info and controls
 */
export const GameSidebar: React.FC<GameSidebarProps> = ({
  onClose,
  gameState,
  currentPlayer,
  opponent,
  className = '',
  onMatchFound,
}) => {
  const [activeTab, setActiveTab] = useState<'play' | 'analysis' | 'spectators' | 'settings' | 'chat'>('play');

  const tabs = [
    { id: 'play', label: 'Gioca', icon: PlayIcon },
    { id: 'analysis', label: 'Analysis', icon: ChartBarIcon },
    { id: 'spectators', label: 'Spectators', icon: UsersIcon },
    { id: 'chat', label: 'Chat', icon: ChatBubbleLeftIcon },
    { id: 'settings', label: 'Settings', icon: CogIcon },
  ] as const;

  // Mock data for development
  const spectators = [
    { id: '1', username: 'Observer1', rating: 1600 },
    { id: '2', username: 'SkeminoMaster', rating: 2100 },
    { id: '3', username: 'GameWatcher', rating: 1450 },
  ];

  const chatMessages = [
    { id: '1', user: 'Observer1', message: 'Interesting opening!', timestamp: Date.now() - 120000 },
    { id: '2', user: 'SkeminoMaster', message: 'Strong vertex control', timestamp: Date.now() - 60000 },
    { id: '3', user: 'GameWatcher', message: 'Good luck both!', timestamp: Date.now() - 30000 },
  ];

  // Play tab content (Matchmaking) - now using dedicated component
  const PlayTabContent = () => (
    <PlayTab
      currentPlayer={currentPlayer}
      onMatchFound={onMatchFound}
    />
  );

  // Analysis tab content
  const AnalysisTab = () => (
    <div className="p-4 space-y-4">
      <div>
        <h4 className="font-semibold text-gray-900 mb-2">Game Analysis</h4>
        <div className="space-y-3">
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <span className="text-sm text-gray-600">Position Evaluation</span>
            <span className="text-sm font-medium">Balanced</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <span className="text-sm text-gray-600">Vertex Control</span>
            <span className="text-sm font-medium">2-2</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <span className="text-sm text-gray-600">Cards Played</span>
            <span className="text-sm font-medium">{gameState?.moveHistory.length || 0}</span>
          </div>
        </div>
      </div>

      <div>
        <h4 className="font-semibold text-gray-900 mb-2">Opening Theory</h4>
        <div className="p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-700">
            Standard opening detected. Consider controlling vertex quadrants early.
          </p>
        </div>
      </div>

      <div>
        <h4 className="font-semibold text-gray-900 mb-2">Suggested Moves</h4>
        <div className="space-y-2">
          <div className="p-2 bg-green-50 border border-green-200 rounded text-sm">
            <span className="font-mono">C7:d4</span> - Control center
          </div>
          <div className="p-2 bg-yellow-50 border border-yellow-200 rounded text-sm">
            <span className="font-mono">P3:a6</span> - Vertex pressure
          </div>
        </div>
      </div>
    </div>
  );

  // Spectators tab content
  const SpectatorsTab = () => (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h4 className="font-semibold text-gray-900">Spectators ({spectators.length})</h4>
        <span className="text-sm text-gray-500">Watching live</span>
      </div>

      <div className="space-y-2">
        {spectators.map((spectator) => (
          <motion.div
            key={spectator.id}
            className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50"
            whileHover={{ x: 4 }}
          >
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-xs font-bold">
                {spectator.username.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-gray-900 truncate">
                {spectator.username}
              </div>
              <div className="text-xs text-gray-500">
                Rating: {spectator.rating}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  // Chat tab content
  const ChatTab = () => (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-gray-200">
        <h4 className="font-semibold text-gray-900">Live Chat</h4>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {chatMessages.map((message) => (
          <div key={message.id} className="flex space-x-2">
            <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-bold">
                {message.user.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-900">{message.user}</span>
                <span className="text-xs text-gray-500">
                  {new Date(message.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
              <p className="text-sm text-gray-700">{message.message}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-gray-200">
        <div className="flex space-x-2">
          <input
            type="text"
            placeholder="Type a message..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600">
            Send
          </button>
        </div>
      </div>
    </div>
  );

  // Settings tab content
  const SettingsTab = () => (
    <div className="p-4 space-y-4">
      <div>
        <h4 className="font-semibold text-gray-900 mb-3">Game Settings</h4>
        <div className="space-y-3">
          <label className="flex items-center justify-between">
            <span className="text-sm text-gray-700">Sound Effects</span>
            <input type="checkbox" defaultChecked className="rounded" />
          </label>
          <label className="flex items-center justify-between">
            <span className="text-sm text-gray-700">Move Highlights</span>
            <input type="checkbox" defaultChecked className="rounded" />
          </label>
          <label className="flex items-center justify-between">
            <span className="text-sm text-gray-700">Auto-promote</span>
            <input type="checkbox" className="rounded" />
          </label>
        </div>
      </div>

      <div>
        <h4 className="font-semibold text-gray-900 mb-3">Display</h4>
        <div className="space-y-3">
          <label className="flex items-center justify-between">
            <span className="text-sm text-gray-700">Show Coordinates</span>
            <input type="checkbox" defaultChecked className="rounded" />
          </label>
          <label className="flex items-center justify-between">
            <span className="text-sm text-gray-700">Highlight Last Move</span>
            <input type="checkbox" defaultChecked className="rounded" />
          </label>
        </div>
      </div>

      <div>
        <h4 className="font-semibold text-gray-900 mb-3">Performance</h4>
        <div className="space-y-3">
          <label className="flex items-center justify-between">
            <span className="text-sm text-gray-700">Reduce Animations</span>
            <input type="checkbox" className="rounded" />
          </label>
          <label className="flex items-center justify-between">
            <span className="text-sm text-gray-700">Performance Mode</span>
            <input type="checkbox" className="rounded" />
          </label>
        </div>
      </div>
    </div>
  );

  return (
    <motion.div
      className={`h-full bg-white border-l border-gray-200 flex flex-col ${className}`}
      initial={{ x: 300 }}
      animate={{ x: 0 }}
      exit={{ x: 300 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Game Info</h3>
        <button
          onClick={onClose}
          className="p-1 text-gray-400 hover:text-gray-600 rounded"
        >
          <XMarkIcon className="w-5 h-5" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex-1 flex flex-col items-center px-2 py-3 text-xs font-medium
                ${activeTab === tab.id
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }
              `}
            >
              <Icon className="w-4 h-4 mb-1" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="h-full overflow-y-auto"
          >
            {activeTab === 'play' && <PlayTabContent />}
            {activeTab === 'analysis' && <AnalysisTab />}
            {activeTab === 'spectators' && <SpectatorsTab />}
            {activeTab === 'chat' && <ChatTab />}
            {activeTab === 'settings' && <SettingsTab />}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
};