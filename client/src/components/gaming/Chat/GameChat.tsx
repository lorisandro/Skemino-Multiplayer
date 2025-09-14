import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Settings, Smile, Shield, Flag } from 'lucide-react';
import type { Player } from '../../../types/game';

interface ChatMessage {
  id: string;
  playerId: string;
  playerName: string;
  message: string;
  timestamp: number;
  type: 'message' | 'system' | 'emote';
}

interface GameChatProps {
  gameId: string;
  currentPlayer: Player | null;
  disabled?: boolean;
}

export const GameChat: React.FC<GameChatProps> = ({
  gameId,
  currentPlayer,
  disabled = false
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      playerId: 'system',
      playerName: 'System',
      message: 'Good luck and have fun!',
      timestamp: Date.now() - 60000,
      type: 'system'
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [showEmotes, setShowEmotes] = useState(false);
  const [chatSettings, setChatSettings] = useState({
    soundEnabled: true,
    timestampsVisible: true,
    moderationEnabled: true
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !currentPlayer || disabled) return;

    const message: ChatMessage = {
      id: crypto.randomUUID(),
      playerId: currentPlayer.id,
      playerName: currentPlayer.username,
      message: newMessage.trim(),
      timestamp: Date.now(),
      type: 'message'
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');

    // TODO: Send to server via WebSocket
    // socketService.sendChatMessage(gameId, message);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const sendEmote = (emote: string) => {
    if (!currentPlayer || disabled) return;

    const message: ChatMessage = {
      id: crypto.randomUUID(),
      playerId: currentPlayer.id,
      playerName: currentPlayer.username,
      message: emote,
      timestamp: Date.now(),
      type: 'emote'
    };

    setMessages(prev => [...prev, message]);
    setShowEmotes(false);
  };

  const formatMessageTime = (timestamp: number): string => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const emotes = ['👍', '👎', '😊', '😢', '🤔', '💪', '🔥', '⚡', '🎯', '🏆'];

  const quickMessages = [
    'Good luck!',
    'Well played!',
    'Nice move!',
    'Sorry',
    'Thanks!',
    'gg'
  ];

  const MessageBubble: React.FC<{ message: ChatMessage }> = ({ message }) => {
    const isOwnMessage = message.playerId === currentPlayer?.id;
    const isSystem = message.type === 'system';

    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className={`
          flex mb-2
          ${isOwnMessage ? 'justify-end' : 'justify-start'}
          ${isSystem ? 'justify-center' : ''}
        `}
      >
        <div className={`
          max-w-xs rounded-lg px-3 py-2 text-sm
          ${isSystem
            ? 'bg-slate-600/50 text-slate-300 text-center'
            : isOwnMessage
              ? 'bg-blue-600 text-white'
              : 'bg-slate-700 text-slate-200'
          }
        `}>
          {!isSystem && (
            <div className={`
              text-xs mb-1 font-medium
              ${isOwnMessage ? 'text-blue-200' : 'text-slate-400'}
            `}>
              {message.playerName}
              {chatSettings.timestampsVisible && (
                <span className="ml-2 opacity-70">
                  {formatMessageTime(message.timestamp)}
                </span>
              )}
            </div>
          )}

          <div className={message.type === 'emote' ? 'text-lg' : ''}>
            {message.message}
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="h-full flex flex-col bg-slate-800/30 rounded-lg">
      {/* Chat Header */}
      <div className="p-4 border-b border-slate-700">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">Game Chat</h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setChatSettings(prev => ({ ...prev, moderationEnabled: !prev.moderationEnabled }))}
              className={`
                p-1 rounded transition-colors
                ${chatSettings.moderationEnabled ? 'bg-green-600' : 'bg-slate-600'}
              `}
              title="Content moderation"
            >
              <Shield className="w-4 h-4 text-white" />
            </button>
            <button
              className="p-1 bg-slate-600 hover:bg-slate-500 rounded transition-colors"
              title="Report inappropriate behavior"
            >
              <Flag className="w-4 h-4 text-slate-300" />
            </button>
            <button
              className="p-1 bg-slate-600 hover:bg-slate-500 rounded transition-colors"
              title="Chat settings"
            >
              <Settings className="w-4 h-4 text-slate-300" />
            </button>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        <AnimatePresence>
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Messages */}
      <div className="px-4 py-2 border-t border-slate-700/50">
        <div className="flex flex-wrap gap-1">
          {quickMessages.map((msg) => (
            <button
              key={msg}
              onClick={() => {
                setNewMessage(msg);
                setTimeout(() => handleSendMessage(), 100);
              }}
              disabled={disabled}
              className="px-2 py-1 text-xs bg-slate-600/50 hover:bg-slate-600 rounded text-slate-300 transition-colors disabled:opacity-50"
            >
              {msg}
            </button>
          ))}
        </div>
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-slate-700">
        <div className="flex items-center space-x-2">
          {/* Emote Button */}
          <div className="relative">
            <button
              onClick={() => setShowEmotes(!showEmotes)}
              disabled={disabled}
              className="p-2 bg-slate-600 hover:bg-slate-500 rounded transition-colors disabled:opacity-50"
            >
              <Smile className="w-4 h-4 text-slate-300" />
            </button>

            {/* Emote Picker */}
            <AnimatePresence>
              {showEmotes && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 10 }}
                  className="absolute bottom-full mb-2 bg-slate-700 rounded-lg p-3 shadow-xl border border-slate-600"
                >
                  <div className="grid grid-cols-5 gap-2">
                    {emotes.map((emote) => (
                      <button
                        key={emote}
                        onClick={() => sendEmote(emote)}
                        className="p-2 hover:bg-slate-600 rounded text-lg transition-colors"
                      >
                        {emote}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Message Input */}
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={disabled}
              placeholder={disabled ? "Chat disabled" : "Type a message..."}
              className="w-full px-3 py-2 bg-slate-600 text-white placeholder-slate-400 border border-slate-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              maxLength={200}
            />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-slate-400">
              {newMessage.length}/200
            </div>
          </div>

          {/* Send Button */}
          <button
            onClick={handleSendMessage}
            disabled={!newMessage.trim() || disabled}
            className="p-2 bg-blue-600 hover:bg-blue-500 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Chat Guidelines */}
        <div className="mt-2 text-xs text-slate-400">
          Be respectful • No spam • Follow community guidelines
        </div>
      </div>
    </div>
  );
};