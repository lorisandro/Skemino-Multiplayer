import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  XMarkIcon,
  UserIcon,
  ClockIcon,
  StarIcon,
  WifiIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import { useMatchmaking } from '../../../hooks/useMatchmaking';

interface MatchmakingDialogProps {
  isOpen: boolean;
  onClose: () => void;
  timeControl: string;
  isGuest?: boolean;
  userRating?: number;
  onMatchFound?: (gameId: string, opponent: any) => void;
  onCancel?: () => void;
}

interface QueueStatus {
  position: number;
  estimatedWait: number;
  playersInQueue: number;
  averageRating: number;
}

export const MatchmakingDialog: React.FC<MatchmakingDialogProps> = ({
  isOpen,
  onClose,
  timeControl,
  isGuest = false,
  userRating = 1200,
  onMatchFound,
  onCancel,
}) => {
  const [status, setStatus] = useState<'searching' | 'found' | 'error' | 'cancelled'>('searching');
  const [queueStatus, setQueueStatus] = useState<QueueStatus | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [opponent, setOpponent] = useState<any>(null);

  // Use real matchmaking hook
  const matchmaking = useMatchmaking({
    isGuest,
    userRating,
    onMatchFound: (data) => {
      console.log('🎯 Match found in dialog:', data);
      setOpponent(data.opponent);
      setStatus('found');

      setTimeout(() => {
        onMatchFound?.(data.gameId, data.opponent);
      }, 3000);
    },
    onError: (error) => {
      console.error('❌ Matchmaking error in dialog:', error);
      setStatus('error');
      setQueueStatus(null);
    }
  });

  // Timer for elapsed time
  useEffect(() => {
    if (!isOpen || status !== 'searching') return;

    const interval = setInterval(() => {
      setElapsed(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen, status]);

  // Real matchmaking integration
  useEffect(() => {
    if (!isOpen) return;

    // Start matchmaking when dialog opens
    if (status === 'searching') {
      matchmaking.joinQueue(timeControl);
    }

    // Mock queue status updates for UI (until we have real queue position API)
    const statusInterval = setInterval(() => {
      if (matchmaking.isSearching) {
        setQueueStatus({
          position: Math.max(1, Math.floor(Math.random() * 5)),
          estimatedWait: Math.floor(Math.random() * 60) + 30,
          playersInQueue: Math.floor(Math.random() * 50) + 10,
          averageRating: userRating + (Math.random() - 0.5) * 400,
        });
      }
    }, 2000);

    return () => {
      clearInterval(statusInterval);
    };
  }, [isOpen, timeControl, status, matchmaking, userRating]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimeControlDisplay = (timeControl: string) => {
    const controls: { [key: string]: string } = {
      'bullet': '1+0 • 2+1',
      'blitz': '3+2 • 5+3',
      'rapid': '10+5 • 15+10',
      'classical': '30+30 • 60+30',
    };
    return controls[timeControl] || timeControl;
  };

  const handleCancel = () => {
    setStatus('cancelled');
    matchmaking.leaveQueue(); // Leave real matchmaking queue
    onCancel?.();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-white rounded-lg shadow-2xl w-full max-w-md mx-4"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {status === 'searching' && 'Cercando Avversario...'}
                {status === 'found' && 'Avversario Trovato!'}
                {status === 'error' && 'Errore'}
                {status === 'cancelled' && 'Ricerca Annullata'}
              </h3>
              <p className="text-sm text-gray-600 capitalize">
                {timeControl} • {getTimeControlDisplay(timeControl)}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {status === 'searching' && (
              <div className="space-y-6">
                {/* Searching Animation */}
                <div className="text-center">
                  <motion.div
                    className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full mx-auto mb-4"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                  <div className="text-sm text-gray-600">
                    Tempo trascorso: <span className="font-mono font-medium">{formatTime(elapsed)}</span>
                  </div>
                </div>

                {/* Queue Status */}
                {queueStatus && (
                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Posizione in coda:</span>
                      <span className="font-medium">#{queueStatus.position}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Attesa stimata:</span>
                      <span className="font-medium">{queueStatus.estimatedWait}s</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Giocatori in coda:</span>
                      <span className="font-medium">{queueStatus.playersInQueue}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Rating medio:</span>
                      <span className="font-medium">{Math.round(queueStatus.averageRating)}</span>
                    </div>
                  </div>
                )}

                {/* Player Info */}
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-200 rounded-full flex items-center justify-center">
                      <UserIcon className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        {isGuest ? 'Guest Player' : 'Giocatore Registrato'}
                      </div>
                      <div className="text-sm text-gray-600">
                        Rating: {userRating} •
                        <span className="ml-1">
                          {isGuest ? '🎭 Guest' : '🔰 Verificato'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Guest Notice */}
                {isGuest && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <div className="flex">
                      <ExclamationTriangleIcon className="w-5 h-5 text-yellow-400 mr-2 flex-shrink-0" />
                      <div className="text-sm text-yellow-700">
                        <strong>Modalità Guest:</strong> Le partite non verranno salvate nel rating permanente.
                        <a href="#" className="ml-1 underline hover:no-underline">Registrati</a> per giocare competitivamente.
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {status === 'found' && opponent && (
              <div className="space-y-6">
                {/* Match Found Animation */}
                <motion.div
                  className="text-center"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <motion.span
                      className="text-2xl"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 0.6, repeat: Infinity }}
                    >
                      ✨
                    </motion.span>
                  </div>
                  <h4 className="text-lg font-semibold text-green-600 mb-2">Avversario Trovato!</h4>
                  <p className="text-sm text-gray-600">Preparazione della partita...</p>
                </motion.div>

                {/* Opponent Info */}
                <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-4">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gray-300 rounded-full mx-auto mb-3 flex items-center justify-center">
                      <span className="text-lg font-bold">
                        {opponent.username.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="font-semibold text-gray-900">{opponent.username}</div>
                    <div className="text-sm text-gray-600">
                      Rating: {opponent.rating} •
                      <span className="ml-1">
                        {opponent.isGuest ? '🎭 Guest' : '🔰 Verificato'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Match Details */}
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="bg-white border border-gray-200 rounded-lg p-3">
                    <StarIcon className="w-5 h-5 text-yellow-500 mx-auto mb-1" />
                    <div className="text-xs text-gray-600">Differenza Rating</div>
                    <div className="font-medium">±{Math.abs(userRating - opponent.rating)}</div>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-lg p-3">
                    <ClockIcon className="w-5 h-5 text-blue-500 mx-auto mb-1" />
                    <div className="text-xs text-gray-600">Controllo Tempo</div>
                    <div className="font-medium capitalize">{timeControl}</div>
                  </div>
                </div>

                {/* Loading Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Caricamento partita...</span>
                    <span>3s</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <motion.div
                      className="bg-green-500 h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 3 }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 pb-6">
            {status === 'searching' && (
              <button
                onClick={handleCancel}
                className="w-full bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Annulla Ricerca
              </button>
            )}
            {status === 'found' && (
              <div className="text-center text-sm text-gray-500">
                La partita inizierà automaticamente...
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};