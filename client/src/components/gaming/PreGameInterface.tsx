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
import { useGameStore } from '../../store/gameStore';
import { useSocket } from '../../hooks/useSocket';
import type { Player, DistributionState } from '../../types/game';

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

  // Sidebar dark gaming navigation tipo chess.com
  const GameSidebar = () => (
    <motion.div
      className="w-16 lg:w-64 bg-gray-900 border-r border-gray-800 flex flex-col"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
    >
      {/* Main Navigation */}
      <nav className="flex-1 p-2 space-y-1">
        <SidebarItem icon="🎮" label="Gioca" active={true} />
        <SidebarItem icon="📚" label="Impara" />
        <SidebarItem icon="👁" label="Guarda" />
        <SidebarItem icon="🏆" label="Tornei" />
        <SidebarItem icon="📊" label="Statistiche" />
        <SidebarItem icon="👥" label="Social" />
      </nav>

      {/* User Section */}
      <div className="border-t border-gray-800 p-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
            <UserIcon className="w-4 h-4 text-white" />
          </div>
          <div className="hidden lg:block">
            <p className="text-white text-sm font-medium">{currentPlayer.username}</p>
            <p className="text-gray-400 text-xs">Rating: {currentPlayer.rating}</p>
          </div>
        </div>
      </div>

      {/* Connection Status */}
      <div className="border-t border-gray-800 p-3">
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${connected ? 'bg-green-400' : 'bg-red-400'}`} />
          <div className="hidden lg:block">
            <span className="text-gray-300 text-xs">
              {connected ? `Connesso • ${latency}ms` : 'Riconnessione...'}
            </span>
          </div>
        </div>
      </div>

      {/* Settings & Exit */}
      <div className="border-t border-gray-800 p-2 space-y-1">
        {onShowSettings && (
          <button
            onClick={onShowSettings}
            className="w-full flex items-center space-x-3 px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
          >
            <CogIcon className="w-5 h-5" />
            <span className="hidden lg:block text-sm">Impostazioni</span>
          </button>
        )}
        <button
          onClick={onLeaveMatch}
          className="w-full flex items-center space-x-3 px-3 py-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-lg transition-colors"
        >
          <XMarkIcon className="w-5 h-5" />
          <span className="hidden lg:block text-sm">Abbandona</span>
        </button>
      </div>
    </motion.div>
  );

  // Sidebar item component
  const SidebarItem = ({
    icon,
    label,
    active = false
  }: {
    icon: string;
    label: string;
    active?: boolean;
  }) => (
    <button
      className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors ${
        active
          ? 'bg-blue-600 text-white'
          : 'text-gray-300 hover:text-white hover:bg-gray-800'
      }`}
    >
      <span className="text-lg">{icon}</span>
      <span className="hidden lg:block text-sm font-medium">{label}</span>
    </button>
  );

  // Player profile card component - Dark Theme
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
      className={`bg-gray-800 rounded-lg border border-gray-700 p-6 ${className}`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: isOpponent ? 0.2 : 0 }}
    >
      {player ? (
        <div className="text-center">
          {/* Avatar */}
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg">
            <UserIcon className="w-10 h-10 text-white" />
          </div>

          {/* Player Info */}
          <h3 className="font-semibold text-white text-lg mb-1">{player.username}</h3>
          <div className="flex items-center justify-center space-x-1 mb-2">
            <span className="text-gray-300 text-sm">Rating:</span>
            <span className="text-blue-400 font-medium text-sm">{player.rating}</span>
          </div>

          {/* Status Badge */}
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
            isReady
              ? 'bg-green-900/30 text-green-400 border border-green-700'
              : 'bg-yellow-900/30 text-yellow-400 border border-yellow-700'
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
          <div className="mt-3 text-xs text-gray-400">
            {player.isGuest ? '🎭 Guest' : '🔰 Verificato'}
          </div>
        </div>
      ) : (
        <div className="text-center text-gray-500">
          <div className="w-20 h-20 bg-gray-700 rounded-full mx-auto mb-4 flex items-center justify-center">
            <UserIcon className="w-10 h-10 text-gray-400" />
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
          <h2 className="text-2xl font-bold text-white mb-2">{content.title}</h2>
          <p className="text-gray-300">{content.subtitle}</p>
        </div>

        {/* Progress Bar - Dark Theme */}
        {content.showProgress && (
          <div className="space-y-3">
            <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden">
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
              <p className="text-sm text-gray-400">{content.progressText}</p>
            )}
          </div>
        )}

        {/* Timer for match acceptance - Dark Theme */}
        {content.showTimer && (
          <div className="space-y-4">
            <div className="text-lg font-semibold text-orange-400">
              {content.timerText}
            </div>
            <div className="flex space-x-3 justify-center">
              <motion.button
                onClick={onStartGame}
                className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 border border-green-500"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                ✅ Accetta
              </motion.button>
              <motion.button
                onClick={onLeaveMatch}
                className="px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 border border-red-500"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                ❌ Rifiuta
              </motion.button>
            </div>
          </div>
        )}

        {/* Start Game Button - Dark Theme */}
        {content.showStartButton && (
          <motion.button
            onClick={onStartGame}
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-bold text-lg hover:from-blue-700 hover:to-purple-700 flex items-center space-x-2 mx-auto border border-blue-500 shadow-lg"
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

  // Desktop Layout (1024px+) con sidebar tipo chess.com
  if (layout === 'desktop') {
    return (
      <div className={`min-h-screen bg-gray-900 flex ${className}`}>
        <GameSidebar />

        <div className="flex-1 bg-gradient-to-br from-gray-800 to-gray-900 flex">
          {/* Left Side - Current Player */}
          <div className="w-80 p-6 flex flex-col justify-center">
            <PlayerProfile
              player={currentPlayer}
              isReady={gameState === 'ready' || gameState === 'starting'}
              className="mb-6"
            />

            {/* Game Settings Preview - Dark Theme */}
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-4">
              <h4 className="font-semibold text-white mb-3">Impostazioni Partita</h4>
              <div className="space-y-2 text-sm text-gray-300">
                <div className="flex justify-between">
                  <span>Controllo Tempo:</span>
                  <span className="font-medium text-blue-400">Rapid (10+5)</span>
                </div>
                <div className="flex justify-between">
                  <span>Modalità:</span>
                  <span className="font-medium text-purple-400">Ranked</span>
                </div>
                <div className="flex justify-between">
                  <span>Board:</span>
                  <span className="font-medium text-green-400">6×6 Standard</span>
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

            {/* Connection Info - Dark Theme */}
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-4">
              <h4 className="font-semibold text-white mb-3">Connessione</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Status:</span>
                  <span className={`font-medium ${connected ? 'text-green-400' : 'text-red-400'}`}>
                    {connected ? '🟢 Online' : '🔴 Offline'}
                  </span>
                </div>
                {connected && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Latenza:</span>
                    <span className={`font-medium ${latency < 100 ? 'text-green-400' : latency < 200 ? 'text-yellow-400' : 'text-red-400'}`}>
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

  // Mobile/Tablet Layout con sidebar responsive
  return (
    <div className={`min-h-screen bg-gray-900 flex ${className}`}>
      <GameSidebar />

      <div className="flex-1 bg-gradient-to-br from-gray-800 to-gray-900 flex flex-col p-4 space-y-6">
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