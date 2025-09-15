import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  PlayIcon,
  UserIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import { useMatchmaking } from '../../../hooks/useMatchmaking';
import { MatchmakingDialog } from '../Matchmaking/MatchmakingDialog';

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
  const [showMatchmaking, setShowMatchmaking] = useState(false);

  const { joinQueue, leaveQueue, isSearching, error } = useMatchmaking({
    onMatchFound: (data) => {
      setShowMatchmaking(false);
      onMatchFound?.(data.gameId, data.opponent);
    },
    onError: (error) => {
      console.error('Matchmaking error:', error);
      setShowMatchmaking(false);
    },
    isGuest: currentPlayer?.isGuest || false,
    userRating: currentPlayer?.rating || 1200,
  });

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
    const success = await joinQueue(selectedTimeControl);
    if (success) {
      setShowMatchmaking(true);
    }
  };

  const handleTimeControlSelect = (timeControl: string) => {
    setSelectedTimeControl(timeControl);
  };

  const handleCancelMatchmaking = () => {
    leaveQueue();
    setShowMatchmaking(false);
  };

  return (
    <div className="p-4 space-y-4">
      <div>
        <h4 className="font-semibold text-gray-900 mb-4">Nuova Partita</h4>

        {/* Quick Play Button */}
        <motion.button
          onClick={handleQuickPlay}
          disabled={isSearching}
          className={`
            w-full font-semibold py-3 px-4 rounded-lg transition-all duration-200 mb-4
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

        {/* Time Control Selection */}
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


        {/* Guest Notice */}
        {currentPlayer?.isGuest && (
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
        {error && (
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

      {/* Matchmaking Dialog */}
      <MatchmakingDialog
        isOpen={showMatchmaking}
        onClose={() => setShowMatchmaking(false)}
        timeControl={selectedTimeControl}
        isGuest={currentPlayer?.isGuest || false}
        userRating={currentPlayer?.rating || 1200}
        onMatchFound={onMatchFound}
        onCancel={handleCancelMatchmaking}
      />
    </div>
  );
};