import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UserIcon,
  ClockIcon,
  WifiIcon,
  CheckCircleIcon,
  PlayIcon,
  XMarkIcon,
  CogIcon,
} from '@heroicons/react/24/outline';
import { useGameStore } from '../../../store/gameStore';
import { useSocket } from '../../../hooks/useSocket';
import type { Player, DistributionState } from '../../../types/game';

export interface PreGameInterfaceProps {
  gameState: 'waiting' | 'matched' | 'distributing' | 'ready' | 'starting';
  currentPlayer: Player;
  opponent?: Player | null;
  distributionState: DistributionState;
  onStartGame: () => void;
  onLeaveMatch: () => void;
  onShowSettings?: () => void;
  className?: string;
}

/**
 * PreGameInterface - Interfaccia dedicata alla fase pre-partita/matchmaking
 * Ottimizzata per gaming competitivo con layout intuitivo tipo chess.com
 */
export const PreGameInterface: React.FC<PreGameInterfaceProps> = ({
  gameState,
  currentPlayer,
  opponent,
  distributionState,
  onStartGame,
  onLeaveMatch,
  onShowSettings,
  className = '',
}) => {
  const { connected, latency } = useSocket();
  const [layout, setLayout] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
  const [acceptanceTimer, setAcceptanceTimer] = useState<number>(30);

  // Responsive layout detection
  useEffect(() => {
    const updateLayout = () => {
      const width = window.innerWidth;
      if (width < 768) setLayout('mobile');
      else if (width < 1024) setLayout('tablet');
      else setLayout('desktop');
    };

    updateLayout();
    window.addEventListener('resize', updateLayout);
    return () => window.removeEventListener('resize', updateLayout);
  }, []);

  // Countdown timer for match acceptance
  useEffect(() => {
    if (gameState === 'matched') {
      const timer = setInterval(() => {
        setAcceptanceTimer((prev) => {
          if (prev <= 1) {
            onLeaveMatch(); // Auto-decline after timeout
            return 30;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    } else {
      setAcceptanceTimer(30);
    }
  }, [gameState, onLeaveMatch]);

  // Header component with connection status
  const PreGameHeader = () => (
    <motion.div
      className="bg-white border-b border-gray-200 px-6 py-4"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Skèmino
          </h1>
          <div className="hidden md:flex items-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <div className={`w-2 h-2 rounded-full ${connected ? 'bg-green-400' : 'bg-red-400'}`} />
              <span>{connected ? 'Connesso' : 'Riconnessione...'}</span>
            </div>
            {connected && (
              <div className="flex items-center space-x-1">
                <WifiIcon className="w-4 h-4" />
                <span>{latency}ms</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {onShowSettings && (
            <button
              onClick={onShowSettings}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
            >
              <CogIcon className="w-5 h-5" />
            </button>
          )}
          <button
            onClick={onLeaveMatch}
            className="px-4 py-2 text-red-600 hover:text-red-700 font-medium text-sm hover:bg-red-50 rounded-lg"
          >
            Abbandona
          </button>
        </div>
      </div>
    </motion.div>
  );

  // Player profile card component
  const PlayerProfile = ({
    player,
    isOpponent = false,
    isReady = false,
    className = ''
  }: {
    player?: Player | null;
    isOpponent?: boolean;
    isReady?: boolean;
    className?: string;
  }) => (
    <motion.div
      className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: isOpponent ? 0.2 : 0 }}
    >
      {player ? (
        <div className="text-center">
          {/* Avatar */}
          <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center">
            <UserIcon className="w-10 h-10 text-white" />
          </div>

          {/* Player Info */}
          <h3 className="font-semibold text-gray-900 text-lg mb-1">{player.username}</h3>
          <p className="text-gray-600 text-sm mb-2">Rating: {player.rating}</p>

          {/* Status Badge */}
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
            isReady
              ? 'bg-green-100 text-green-800'
              : 'bg-yellow-100 text-yellow-800'
          }`}>
            {isReady ? (
              <>
                <CheckCircleIcon className="w-4 h-4 mr-1" />
                Pronto
              </>
            ) : (
              <>
                <ClockIcon className="w-4 h-4 mr-1" />
                In preparazione
              </>
            )}
          </div>

          {/* Player Level Badge */}
          <div className="mt-3 text-xs text-gray-500">
            {player.isGuest ? '🎭 Guest' : '🔰 Verificato'}
          </div>
        </div>
      ) : (
        <div className="text-center text-gray-400">
          <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
            <UserIcon className="w-10 h-10" />
          </div>
          <p className="text-sm">In attesa avversario...</p>
        </div>
      )}
    </motion.div>
  );

  // Central preparation area
  const PreparationArea = () => {
    const getContent = () => {
      switch (gameState) {
        case 'waiting':
          return {
            title: 'Ricerca Avversario',
            subtitle: 'Trovando il miglior match per il tuo livello...',
            icon: '🔍',
            showProgress: true,
            progressText: 'Ricerca in corso...',
          };

        case 'matched':
          return {
            title: 'Avversario Trovato!',
            subtitle: `Match con ${opponent?.username} (${opponent?.rating})`,
            icon: '🎯',
            showTimer: true,
            timerText: `Accetta entro ${acceptanceTimer}s`,
          };

        case 'distributing':
          return {
            title: distributionState.phase === 'shuffling' ? 'Mischiando Carte' :
                   distributionState.phase === 'dealing' ? 'Distribuendo Carte' : 'Avvio Partita',
            subtitle: 'Preparazione in corso...',
            icon: distributionState.phase === 'shuffling' ? '🔀' :
                  distributionState.phase === 'dealing' ? '🎴' : '🚀',
            showProgress: true,
            progressText: distributionState.phase === 'dealing'
              ? `Carta ${distributionState.currentCard} di 10`
              : 'Sincronizzazione in corso...',
            progress: distributionState.animationProgress,
          };

        case 'ready':
          return {
            title: 'Tutto Pronto!',
            subtitle: 'Entrambi i giocatori sono pronti per iniziare',
            icon: '✅',
            showStartButton: true,
          };

        case 'starting':
          return {
            title: 'Avvio Partita...',
            subtitle: 'Caricamento tabellone di gioco',
            icon: '🎮',
            showProgress: true,
            progressText: 'Inizializzazione...',
          };

        default:
          return {
            title: 'Preparazione',
            subtitle: 'Configurazione partita...',
            icon: '⚙️',
          };
      }
    };

    const content = getContent();

    return (
      <motion.div
        className="text-center space-y-6"
        key={gameState}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.4 }}
      >
        {/* Icon */}
        <motion.div
          className="text-6xl"
          animate={{
            scale: [1, 1.1, 1],
            rotate: gameState === 'distributing' ? [0, 5, -5, 0] : 0
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          {content.icon}
        </motion.div>

        {/* Title */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{content.title}</h2>
          <p className="text-gray-600">{content.subtitle}</p>
        </div>

        {/* Progress Bar */}
        {content.showProgress && (
          <div className="space-y-3">
            <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                animate={{
                  width: content.progress ? `${content.progress}%` : ['0%', '100%', '0%']
                }}
                transition={content.progress ? { duration: 0.3 } : {
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </div>
            {content.progressText && (
              <p className="text-sm text-gray-500">{content.progressText}</p>
            )}
          </div>
        )}

        {/* Timer for match acceptance */}
        {content.showTimer && (
          <div className="space-y-4">
            <div className="text-lg font-semibold text-orange-600">
              {content.timerText}
            </div>
            <div className="flex space-x-3 justify-center">
              <motion.button
                onClick={onStartGame}
                className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                ✅ Accetta
              </motion.button>
              <motion.button
                onClick={onLeaveMatch}
                className="px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                ❌ Rifiuta
              </motion.button>
            </div>
          </div>
        )}

        {/* Start Game Button */}
        {content.showStartButton && (
          <motion.button
            onClick={onStartGame}
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-bold text-lg hover:from-blue-700 hover:to-purple-700 flex items-center space-x-2 mx-auto"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <PlayIcon className="w-6 h-6" />
            <span>INIZIA PARTITA</span>
          </motion.button>
        )}
      </motion.div>
    );
  };

  // Desktop Layout (1024px+)
  if (layout === 'desktop') {
    return (
      <div className={`min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col ${className}`}>
        <PreGameHeader />

        <div className="flex-1 flex">
          {/* Left Side - Current Player */}
          <div className="w-80 p-6 flex flex-col justify-center">
            <PlayerProfile
              player={currentPlayer}
              isReady={gameState === 'ready' || gameState === 'starting'}
              className="mb-6"
            />

            {/* Game Settings Preview */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h4 className="font-semibold text-gray-900 mb-3">Impostazioni Partita</h4>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Controllo Tempo:</span>
                  <span className="font-medium">Rapid (10+5)</span>
                </div>
                <div className="flex justify-between">
                  <span>Modalità:</span>
                  <span className="font-medium">Ranked</span>
                </div>
                <div className="flex justify-between">
                  <span>Board:</span>
                  <span className="font-medium">6×6 Standard</span>
                </div>
              </div>
            </div>
          </div>

          {/* Center - Preparation Area */}
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="max-w-lg w-full">
              <AnimatePresence mode="wait">
                <PreparationArea />
              </AnimatePresence>
            </div>
          </div>

          {/* Right Side - Opponent */}
          <div className="w-80 p-6 flex flex-col justify-center">
            <PlayerProfile
              player={opponent}
              isOpponent={true}
              isReady={gameState === 'ready' || gameState === 'starting'}
              className="mb-6"
            />

            {/* Connection Info */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h4 className="font-semibold text-gray-900 mb-3">Connessione</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className={`font-medium ${connected ? 'text-green-600' : 'text-red-600'}`}>
                    {connected ? '🟢 Online' : '🔴 Offline'}
                  </span>
                </div>
                {connected && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Latenza:</span>
                    <span className={`font-medium ${latency < 100 ? 'text-green-600' : latency < 200 ? 'text-yellow-600' : 'text-red-600'}`}>
                      {latency}ms
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Mobile/Tablet Layout
  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col ${className}`}>
      <PreGameHeader />

      <div className="flex-1 flex flex-col p-4 space-y-6">
        {/* Opponent Profile */}
        {opponent && (
          <PlayerProfile
            player={opponent}
            isOpponent={true}
            isReady={gameState === 'ready' || gameState === 'starting'}
          />
        )}

        {/* Central Preparation Area */}
        <div className="flex-1 flex items-center justify-center">
          <AnimatePresence mode="wait">
            <PreparationArea />
          </AnimatePresence>
        </div>

        {/* Current Player Profile */}
        <PlayerProfile
          player={currentPlayer}
          isReady={gameState === 'ready' || gameState === 'starting'}
        />
      </div>
    </div>
  );
};