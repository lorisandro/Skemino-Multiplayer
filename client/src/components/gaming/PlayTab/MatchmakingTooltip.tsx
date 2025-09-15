import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  XMarkIcon,
  ClockIcon,
  UserIcon,
} from '@heroicons/react/24/outline';

interface MatchmakingTooltipProps {
  isVisible: boolean;
  timeControl: string;
  onCancel: () => void;
  userRating?: number;
  isGuest?: boolean;
}

interface QueueStatus {
  position: number;
  estimatedWait: number;
  playersInQueue: number;
}

export const MatchmakingTooltip: React.FC<MatchmakingTooltipProps> = ({
  isVisible,
  timeControl,
  onCancel,
  userRating = 1200,
  isGuest = false,
}) => {
  const [elapsed, setElapsed] = useState(0);
  const [queueStatus, setQueueStatus] = useState<QueueStatus | null>(null);

  // Timer for elapsed time
  useEffect(() => {
    if (!isVisible) {
      setElapsed(0);
      return;
    }

    const interval = setInterval(() => {
      setElapsed(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isVisible]);

  // Mock queue status simulation
  useEffect(() => {
    if (!isVisible) {
      setQueueStatus(null);
      return;
    }

    // Initial status
    setQueueStatus({
      position: Math.floor(Math.random() * 5) + 1,
      estimatedWait: Math.floor(Math.random() * 60) + 30,
      playersInQueue: Math.floor(Math.random() * 50) + 10,
    });

    // Update status periodically
    const statusInterval = setInterval(() => {
      setQueueStatus(prev => {
        if (!prev) return null;
        return {
          position: Math.max(1, prev.position - Math.floor(Math.random() * 2)),
          estimatedWait: Math.max(10, prev.estimatedWait - Math.floor(Math.random() * 10)),
          playersInQueue: Math.floor(Math.random() * 50) + 10,
        };
      });
    }, 3000);

    return () => clearInterval(statusInterval);
  }, [isVisible]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimeControlDisplay = (timeControl: string) => {
    const controls: { [key: string]: string } = {
      'bullet': '1+0',
      'blitz': '3+2',
      'rapid': '10+5',
      'classical': '30+30',
    };
    return controls[timeControl] || timeControl;
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 z-50"
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.95 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          {/* Tooltip Content */}
          <div className="bg-gray-900 text-white rounded-lg shadow-2xl p-4 min-w-80">
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <motion.div
                  className="w-4 h-4 border-2 border-blue-300 border-t-blue-500 rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                <span className="text-sm font-medium">Cercando avversario...</span>
              </div>
              <button
                onClick={onCancel}
                className="text-gray-400 hover:text-white transition-colors p-1 rounded hover:bg-gray-700"
              >
                <XMarkIcon className="w-4 h-4" />
              </button>
            </div>

            {/* Game Info */}
            <div className="flex items-center justify-between mb-3 text-xs text-gray-300">
              <div className="flex items-center space-x-1">
                <ClockIcon className="w-3 h-3" />
                <span className="capitalize">{timeControl}</span>
                <span>•</span>
                <span>{getTimeControlDisplay(timeControl)}</span>
              </div>
              <div className="flex items-center space-x-1">
                <UserIcon className="w-3 h-3" />
                <span>{userRating}</span>
                {isGuest && <span className="text-yellow-400">• Guest</span>}
              </div>
            </div>

            {/* Timer */}
            <div className="text-center mb-3">
              <div className="text-lg font-mono font-semibold text-blue-400">
                {formatTime(elapsed)}
              </div>
              <div className="text-xs text-gray-400">tempo trascorso</div>
            </div>

            {/* Queue Status */}
            {queueStatus && (
              <div className="space-y-2">
                <div className="grid grid-cols-3 gap-3 text-xs">
                  <div className="text-center">
                    <div className="text-white font-medium">#{queueStatus.position}</div>
                    <div className="text-gray-400">in coda</div>
                  </div>
                  <div className="text-center">
                    <div className="text-white font-medium">{queueStatus.estimatedWait}s</div>
                    <div className="text-gray-400">stima</div>
                  </div>
                  <div className="text-center">
                    <div className="text-white font-medium">{queueStatus.playersInQueue}</div>
                    <div className="text-gray-400">online</div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-gray-700 rounded-full h-1.5 mt-3">
                  <motion.div
                    className="bg-blue-500 h-1.5 rounded-full"
                    initial={{ width: 0 }}
                    animate={{
                      width: `${Math.min(100, (elapsed / Math.max(queueStatus.estimatedWait, 30)) * 100)}%`
                    }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>
            )}

            {/* Cancel Button */}
            <button
              onClick={onCancel}
              className="w-full mt-3 bg-red-600 hover:bg-red-700 text-white text-sm font-medium py-2 px-3 rounded transition-colors"
            >
              Annulla Ricerca
            </button>
          </div>

          {/* Tooltip Arrow */}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2">
            <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};