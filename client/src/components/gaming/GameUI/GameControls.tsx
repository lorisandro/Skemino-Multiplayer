import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FlagIcon,
  HandRaisedIcon,
  ChatBubbleLeftIcon,
  CogIcon,
  ArrowUturnLeftIcon,
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
} from '@heroicons/react/24/outline';
import { useGameStore } from '../../../store/gameStore';
import { useSocket } from '../../../hooks/useSocket';

export const GameControls: React.FC = () => {
  const { gameState, soundEnabled, toggleSound } = useGameStore();
  const { emitResign, emitDrawOffer, connected } = useSocket();
  const [showSettings, setShowSettings] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [chatMessage, setChatMessage] = useState('');

  const handleResign = () => {
    if (confirm('Are you sure you want to resign?')) {
      emitResign();
    }
  };

  const handleDrawOffer = () => {
    if (confirm('Do you want to offer a draw?')) {
      emitDrawOffer();
    }
  };

  const handleSendMessage = () => {
    if (chatMessage.trim()) {
      // Emit chat message to server
      // emitChatMessage(chatMessage);
      setChatMessage('');
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full max-w-4xl mx-auto">
      {/* Main controls */}
      <motion.div
        className="flex justify-center gap-2 p-3 bg-white dark:bg-slate-800 rounded-lg shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Game actions */}
        <div className="flex gap-2">
          <motion.button
            className="p-2 rounded-lg bg-red-500 hover:bg-red-600 text-white transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleResign}
            title="Resign"
          >
            <FlagIcon className="w-5 h-5" />
          </motion.button>

          <motion.button
            className="p-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleDrawOffer}
            title="Offer Draw"
          >
            <HandRaisedIcon className="w-5 h-5" />
          </motion.button>

          <motion.button
            className="p-2 rounded-lg bg-gray-500 hover:bg-gray-600 text-white transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title="Take Back"
            disabled
          >
            <ArrowUturnLeftIcon className="w-5 h-5" />
          </motion.button>
        </div>

        {/* Separator */}
        <div className="w-px bg-gray-300 dark:bg-gray-600 mx-2" />

        {/* UI controls */}
        <div className="flex gap-2">
          <motion.button
            className={`p-2 rounded-lg transition-colors ${
              showChat
                ? 'bg-purple-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowChat(!showChat)}
            title="Chat"
          >
            <ChatBubbleLeftIcon className="w-5 h-5" />
          </motion.button>

          <motion.button
            className={`p-2 rounded-lg transition-colors ${
              soundEnabled
                ? 'bg-green-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleSound}
            title={soundEnabled ? 'Mute' : 'Unmute'}
          >
            {soundEnabled ? (
              <SpeakerWaveIcon className="w-5 h-5" />
            ) : (
              <SpeakerXMarkIcon className="w-5 h-5" />
            )}
          </motion.button>

          <motion.button
            className={`p-2 rounded-lg transition-colors ${
              showSettings
                ? 'bg-purple-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowSettings(!showSettings)}
            title="Settings"
          >
            <CogIcon className="w-5 h-5" />
          </motion.button>
        </div>
      </motion.div>

      {/* Chat panel */}
      <AnimatePresence>
        {showChat && (
          <motion.div
            className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-4"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex flex-col gap-3">
              {/* Chat messages */}
              <div className="h-32 overflow-y-auto bg-gray-50 dark:bg-slate-900 rounded-lg p-2">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Chat messages will appear here...
                </div>
              </div>

              {/* Chat input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  className="flex-1 px-3 py-2 bg-gray-100 dark:bg-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Type a message..."
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <button
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm transition-colors"
                  onClick={handleSendMessage}
                >
                  Send
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Settings panel */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-4"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="grid grid-cols-2 gap-4">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" className="rounded" defaultChecked />
                <span>Show move indicators</span>
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" className="rounded" defaultChecked />
                <span>Show coordinates</span>
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" className="rounded" defaultChecked />
                <span>Animate moves</span>
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" className="rounded" />
                <span>Auto-promote</span>
              </label>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Game status */}
      <motion.div
        className="text-center text-sm text-gray-600 dark:text-gray-400"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        {gameState?.status === 'active' && (
          <span>
            {gameState.currentTurn === 'white' ? 'White' : 'Black'} to move
          </span>
        )}
        {gameState?.status === 'completed' && (
          <span className="font-semibold text-lg">
            Game Over - {gameState.winner === 'white' ? 'White' : 'Black'} wins!
          </span>
        )}
        {!connected && (
          <span className="text-red-500 ml-2">• Disconnected</span>
        )}
      </motion.div>
    </div>
  );
};