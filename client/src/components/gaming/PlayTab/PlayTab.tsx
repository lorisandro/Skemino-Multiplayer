import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PlayIcon,
  UserIcon,
  ExclamationTriangleIcon,
  XMarkIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';
import { useMatchmaking } from '../../../hooks/useMatchmaking';

interface PlayTabProps {
  currentPlayer?: {
    id: string;
    username: string;
    rating: number;
    isGuest: boolean;
  } | null;
  onMatchFound?: (gameId: string, opponent: any) => void;
}

export const PlayTab: React.FC<PlayTabProps> = ({
  currentPlayer,
  onMatchFound,
}) => {
  const [selectedTimeControl, setSelectedTimeControl] = useState<string>('rapid');
  const [elapsed, setElapsed] = useState(0);

  const { joinQueue, leaveQueue, isSearching, error } = useMatchmaking({
    onMatchFound: (data) => {
      onMatchFound?.(data.gameId, data.opponent);
    },
    onError: (error) => {
      console.error('Matchmaking error:', error);
    },
    isGuest: currentPlayer?.isGuest || false,
    userRating: currentPlayer?.rating || 1200,
  });

  // Timer for elapsed time during matchmaking
  useEffect(() => {
    if (!isSearching) {
      setElapsed(0);
      return;
    }

    const interval = setInterval(() => {
      setElapsed(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isSearching]);

  const timeControls = [
    {
      id: 'bullet',
      name: 'Bullet',
      description: '1+0, 2+1',
      color: 'from-orange-100 to-orange-200 text-orange-800',
      hoverColor: 'hover:from-orange-200 hover:to-orange-300',
    },
    {
      id: 'blitz',
      name: 'Blitz',
      description: '3+2, 5+3',
      color: 'from-yellow-100 to-yellow-200 text-yellow-800',
      hoverColor: 'hover:from-yellow-200 hover:to-yellow-300',
    },
    {
      id: 'rapid',
      name: 'Rapid',
      description: '10+5, 15+10',
      color: 'from-green-100 to-green-200 text-green-800',
      hoverColor: 'hover:from-green-200 hover:to-green-300',
    },
    {
      id: 'classical',
      name: 'Classical',
      description: '30+30',
      color: 'from-blue-100 to-blue-200 text-blue-800',
      hoverColor: 'hover:from-blue-200 hover:to-blue-300',
    },
  ];

  const handleQuickPlay = async () => {
    await joinQueue(selectedTimeControl);
  };

  const handleTimeControlSelect = (timeControl: string) => {
    setSelectedTimeControl(timeControl);
  };

  const handleCancelMatchmaking = () => {
    leaveQueue();
  };

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
    <div className="p-4 space-y-4 h-full flex flex-col">
      <div className="flex-1">
        <h4 className="font-semibold text-gray-900 mb-4">Nuova Partita</h4>

        {/* Quick Play Button */}
        <div className="mb-4">
          <motion.button
            onClick={handleQuickPlay}
            disabled={isSearching}
            className={`
              w-full font-semibold py-3 px-4 rounded-lg transition-all duration-200
              flex items-center justify-center space-x-2
              ${isSearching
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 transform hover:scale-105'
              }
              text-white
            `}
            whileHover={!isSearching ? { scale: 1.02 } : {}}
            whileTap={!isSearching ? { scale: 0.98 } : {}}
          >
            <PlayIcon className="w-5 h-5" />
            <span>{isSearching ? 'Ricerca in corso...' : 'Gioca Online'}</span>
          </motion.button>
        </div>

        {/* Time Control Selection */}
        {!isSearching && (
          <div className="space-y-3">
            <h5 className="font-medium text-gray-700">Controllo Tempo</h5>

            <div className="grid grid-cols-2 gap-2">
              {timeControls.map((control) => (
                <motion.button
                  key={control.id}
                  onClick={() => handleTimeControlSelect(control.id)}
                  className={`
                    p-3 rounded-lg text-sm font-medium transition-all duration-200
                    bg-gradient-to-br ${control.color} ${control.hoverColor}
                    ${selectedTimeControl === control.id
                      ? 'ring-2 ring-blue-500 ring-offset-1 transform scale-105'
                      : ''
                    }
                  `}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {control.name}
                  <div className="text-xs opacity-75">{control.description}</div>
                </motion.button>
              ))}
            </div>
          </div>
        )}

        {/* Guest Notice */}
        {currentPlayer?.isGuest && !isSearching && (
          <motion.div
            className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex">
              <ExclamationTriangleIcon className="w-5 h-5 text-yellow-400 mr-2 flex-shrink-0" />
              <div className="text-sm text-yellow-700">
                <strong>Modalità Guest:</strong> Le partite non verranno salvate nel rating permanente.{' '}
                <button className="underline hover:no-underline font-medium">
                  Registrati
                </button>{' '}
                per giocare competitivamente.
              </div>
            </div>
          </motion.div>
        )}

        {/* Error Display */}
        {error && !isSearching && (
          <motion.div
            className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="text-sm text-red-700">
              <strong>Errore:</strong> {error}
            </div>
          </motion.div>
        )}
      </div>

      {/* Matchmaking Section - Appears at bottom when searching */}
      <AnimatePresence>
        {isSearching && (
          <motion.div
            className="border-t border-gray-200 pt-4 mt-4 bg-gray-50 rounded-lg p-4"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <motion.div
                  className="w-4 h-4 border-2 border-blue-300 border-t-blue-600 rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                <span className="text-sm font-medium text-gray-900">Cercando avversario...</span>
              </div>
              <button
                onClick={handleCancelMatchmaking}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded hover:bg-gray-200"
              >
                <XMarkIcon className="w-4 h-4" />
              </button>
            </div>

            {/* Game Info */}
            <div className="flex items-center justify-between mb-3 text-xs text-gray-600">
              <div className="flex items-center space-x-1">
                <ClockIcon className="w-3 h-3" />
                <span className="capitalize">{selectedTimeControl}</span>
                <span>•</span>
                <span>{getTimeControlDisplay(selectedTimeControl)}</span>
              </div>
              <div className="flex items-center space-x-1">
                <UserIcon className="w-3 h-3" />
                <span>{currentPlayer?.rating || 1200}</span>
                {currentPlayer?.isGuest && <span className="text-yellow-600">• Guest</span>}
              </div>
            </div>

            {/* Timer */}
            <div className="text-center mb-3">
              <div className="text-lg font-mono font-semibold text-blue-600">
                {formatTime(elapsed)}
              </div>
              <div className="text-xs text-gray-500">tempo trascorso</div>
            </div>

            {/* Queue Status Simulation */}
            <div className="space-y-2">
              <div className="grid grid-cols-3 gap-3 text-xs">
                <div className="text-center">
                  <div className="text-gray-900 font-medium">#{Math.max(1, Math.floor(Math.random() * 5))}</div>
                  <div className="text-gray-500">in coda</div>
                </div>
                <div className="text-center">
                  <div className="text-gray-900 font-medium">{Math.max(10, 45 - elapsed)}s</div>
                  <div className="text-gray-500">stima</div>
                </div>
                <div className="text-center">
                  <div className="text-gray-900 font-medium">{Math.floor(Math.random() * 50) + 10}</div>
                  <div className="text-gray-500">online</div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-gray-300 rounded-full h-2 mt-3">
                <motion.div
                  className="bg-blue-500 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{
                    width: `${Math.min(100, (elapsed / 45) * 100)}%`
                  }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>

            {/* Cancel Button */}
            <button
              onClick={handleCancelMatchmaking}
              className="w-full mt-3 bg-red-500 hover:bg-red-600 text-white text-sm font-medium py-2 px-3 rounded transition-colors"
            >
              Annulla Ricerca
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};