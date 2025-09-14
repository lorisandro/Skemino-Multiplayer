import React from 'react';
import { motion } from 'framer-motion';
import { ClockIcon, UsersIcon } from '@heroicons/react/24/outline';

interface QueueStatusBadgeProps {
  isSearching: boolean;
  queuePosition?: number;
  estimatedWait?: number;
  playersInQueue?: number;
  timeControl: string;
}

export const QueueStatusBadge: React.FC<QueueStatusBadgeProps> = ({
  isSearching,
  queuePosition,
  estimatedWait,
  playersInQueue,
  timeControl,
}) => {
  if (!isSearching) {
    return null;
  }

  const formatWaitTime = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return remainingSeconds > 0 ? `${minutes}m ${remainingSeconds}s` : `${minutes}m`;
  };

  return (
    <motion.div
      className="fixed top-4 right-4 bg-blue-600 text-white rounded-lg shadow-lg p-3 z-50"
      initial={{ opacity: 0, y: -20, x: 20 }}
      animate={{ opacity: 1, y: 0, x: 0 }}
      exit={{ opacity: 0, y: -20, x: 20 }}
    >
      <div className="flex items-center space-x-3">
        {/* Spinning Icon */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="flex-shrink-0"
        >
          <ClockIcon className="w-5 h-5" />
        </motion.div>

        {/* Status Info */}
        <div className="text-sm">
          <div className="font-medium">
            Ricerca {timeControl}...
          </div>
          <div className="text-blue-200 text-xs">
            {queuePosition && (
              <span>Posizione #{queuePosition}</span>
            )}
            {estimatedWait && (
              <span className="ml-2">~{formatWaitTime(estimatedWait)}</span>
            )}
          </div>
        </div>

        {/* Players Count */}
        {playersInQueue && (
          <div className="flex items-center space-x-1 text-blue-200">
            <UsersIcon className="w-4 h-4" />
            <span className="text-xs">{playersInQueue}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
};