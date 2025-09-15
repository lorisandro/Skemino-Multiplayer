import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UserIcon,
  StarIcon,
  TrophyIcon,
  ClockIcon,
  ArrowRightOnRectangleIcon,
  Cog6ToothIcon,
  ChevronRightIcon,
  ShieldCheckIcon,
  EyeIcon,
  CalendarDaysIcon,
} from '@heroicons/react/24/outline';
import type { User } from '../../../hooks/useAuth';

interface UserProfileProps {
  user: User;
  onLogout: () => void;
  onViewChange: (view: 'profile' | 'login' | 'register') => void;
}

/**
 * UserProfile - Profilo utente autenticato con dark theme gaming Skèmino
 * Mostra informazioni utente, rating, statistiche e controlli account
 */
export const UserProfile: React.FC<UserProfileProps> = ({
  user,
  onLogout,
  onViewChange,
}) => {
  const [showStats, setShowStats] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Determina il colore del livello basato sul rating
  const getLevelColor = (rating: number) => {
    if (rating >= 2700) return 'text-purple-400';
    if (rating >= 2500) return 'text-yellow-400';
    if (rating >= 2300) return 'text-blue-400';
    if (rating >= 2000) return 'text-green-400';
    if (rating >= 1800) return 'text-cyan-400';
    if (rating >= 1600) return 'text-orange-400';
    if (rating >= 1400) return 'text-pink-400';
    if (rating >= 1200) return 'text-indigo-400';
    return 'text-gray-400';
  };

  // Calcola win rate
  const winRate = user.statistics.totalGames > 0
    ? Math.round((user.statistics.gamesWon / user.statistics.totalGames) * 100)
    : 0;

  // Formatta tempo di gioco
  const formatPlayTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    if (hours < 1) return `${minutes}m`;
    if (hours < 24) return `${hours}h ${minutes % 60}m`;
    const days = Math.floor(hours / 24);
    return `${days}g ${hours % 24}h`;
  };

  // Gestisce logout
  const handleLogout = () => {
    onLogout();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      {/* Header del profilo */}
      <div className="p-4 bg-gradient-to-r from-skemino-dark-secondary to-skemino-dark-tertiary">
        <div className="flex items-center space-x-3">
          {/* Avatar */}
          <div className="relative">
            <div className="w-12 h-12 bg-gradient-to-br from-suit-forbici-dark to-suit-carta-dark rounded-full
                          flex items-center justify-center text-white font-bold text-lg border-2 border-border-dark">
              {user.avatar ? (
                <img src={user.avatar} alt={user.username} className="w-full h-full rounded-full object-cover" />
              ) : (
                user.username.charAt(0).toUpperCase()
              )}
            </div>
            {/* Status online */}
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-success-dark rounded-full border-2 border-skemino-dark-secondary" />
          </div>

          {/* Info utente */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <h3 className="text-text-primary font-semibold text-sm truncate">
                {user.username}
              </h3>
              {user.verified && (
                <ShieldCheckIcon className="w-4 h-4 text-success-dark flex-shrink-0" />
              )}
              {user.isGuest && (
                <span className="px-1.5 py-0.5 bg-warning-dark/20 text-warning-dark text-xs rounded font-medium">
                  Guest
                </span>
              )}
            </div>
            <div className="flex items-center space-x-2 mt-1">
              <span className={`text-xs font-medium ${getLevelColor(user.rating)}`}>
                {user.level}
              </span>
              <span className="text-text-muted text-xs">•</span>
              <span className="text-text-secondary text-xs font-mono">
                {user.rating}
              </span>
            </div>
          </div>

          {/* Menu button */}
          <div className="flex flex-col space-y-1">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-1.5 text-text-muted hover:text-text-primary hover:bg-skemino-dark-tertiary rounded transition-colors"
            >
              <Cog6ToothIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Statistiche rapide */}
      <div className="px-4 space-y-3">
        <button
          onClick={() => setShowStats(!showStats)}
          className="w-full flex items-center justify-between p-3 bg-skemino-dark-primary
                   border border-border-dark rounded hover:border-border-subtle transition-colors"
        >
          <div className="flex items-center space-x-2">
            <TrophyIcon className="w-4 h-4 text-suit-carta-dark" />
            <span className="text-text-primary text-sm font-medium">Statistiche</span>
          </div>
          <motion.div
            animate={{ rotate: showStats ? 90 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronRightIcon className="w-4 h-4 text-text-muted" />
          </motion.div>
        </button>

        <AnimatePresence>
          {showStats && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-2 gap-2"
            >
              <div className="p-2 bg-skemino-dark-primary border border-border-subtle rounded">
                <div className="text-xs text-text-muted">Partite</div>
                <div className="text-sm font-semibold text-text-primary">
                  {user.statistics.totalGames}
                </div>
              </div>
              <div className="p-2 bg-skemino-dark-primary border border-border-subtle rounded">
                <div className="text-xs text-text-muted">Win Rate</div>
                <div className="text-sm font-semibold text-success-dark">
                  {winRate}%
                </div>
              </div>
              <div className="p-2 bg-skemino-dark-primary border border-border-subtle rounded">
                <div className="text-xs text-text-muted">Streak</div>
                <div className="text-sm font-semibold text-info-dark">
                  {user.statistics.currentWinStreak}
                </div>
              </div>
              <div className="p-2 bg-skemino-dark-primary border border-border-subtle rounded">
                <div className="text-xs text-text-muted">Tempo</div>
                <div className="text-sm font-semibold text-text-primary">
                  {formatPlayTime(user.statistics.totalPlayTime)}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Quick stats sempre visibili */}
        <div className="flex items-center justify-between p-2 bg-skemino-dark-primary border border-border-subtle rounded">
          <div className="flex items-center space-x-4">
            <div className="text-center">
              <div className="text-xs text-text-muted">V</div>
              <div className="text-sm font-semibold text-success-dark">
                {user.statistics.gamesWon}
              </div>
            </div>
            <div className="text-center">
              <div className="text-xs text-text-muted">P</div>
              <div className="text-sm font-semibold text-error-dark">
                {user.statistics.gamesLost}
              </div>
            </div>
            <div className="text-center">
              <div className="text-xs text-text-muted">P</div>
              <div className="text-sm font-semibold text-warning-dark">
                {user.statistics.gamesDraw}
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-text-muted">Controllo tempo preferito</div>
            <div className="text-xs font-medium text-text-primary">
              {user.statistics.favoriteTimeControl}
            </div>
          </div>
        </div>

        {/* Settings Panel */}
        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-2"
            >
              {/* Account info */}
              <div className="p-3 bg-skemino-dark-primary border border-border-subtle rounded">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-text-muted">Email</span>
                    <span className="text-xs text-text-primary">
                      {user.email || 'Non fornita'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-text-muted">Membro dal</span>
                    <span className="text-xs text-text-primary">
                      {new Date(user.registrationDate).toLocaleDateString('it-IT')}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-text-muted">Ultimo accesso</span>
                    <span className="text-xs text-text-primary">
                      {user.lastActive.toLocaleDateString('it-IT')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-1">
                <button
                  className="w-full flex items-center justify-between p-2 text-text-secondary
                           hover:text-text-primary hover:bg-skemino-dark-tertiary rounded transition-colors"
                >
                  <div className="flex items-center space-x-2">
                    <EyeIcon className="w-4 h-4" />
                    <span className="text-sm">Vedi profilo completo</span>
                  </div>
                  <ChevronRightIcon className="w-4 h-4" />
                </button>

                <button
                  className="w-full flex items-center justify-between p-2 text-text-secondary
                           hover:text-text-primary hover:bg-skemino-dark-tertiary rounded transition-colors"
                >
                  <div className="flex items-center space-x-2">
                    <Cog6ToothIcon className="w-4 h-4" />
                    <span className="text-sm">Impostazioni</span>
                  </div>
                  <ChevronRightIcon className="w-4 h-4" />
                </button>

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center space-x-2 p-2 mt-3
                           bg-error-dark/20 text-error-dark border border-error-dark/30
                           hover:bg-error-dark/30 rounded transition-colors"
                >
                  <ArrowRightOnRectangleIcon className="w-4 h-4" />
                  <span className="text-sm font-medium">Disconnetti</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Quick actions per guest */}
        {user.isGuest && (
          <div className="p-3 bg-warning-dark/20 border border-warning-dark/30 rounded">
            <div className="text-xs text-warning-dark mb-2">
              <strong>Modalità Ospite:</strong> Le partite non vengono salvate.
            </div>
            <button
              onClick={() => onViewChange('register')}
              className="w-full p-2 bg-suit-carta-dark text-white rounded text-sm font-medium
                       hover:bg-suit-carta-dark/90 transition-colors"
            >
              Crea Account Permanente
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};