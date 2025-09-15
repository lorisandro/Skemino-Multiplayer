import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UserIcon,
  StarIcon,
  ShieldCheckIcon,
  ClockIcon,
  UserPlusIcon,
  ArrowRightOnRectangleIcon,
  Cog6ToothIcon,
  TrophyIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '../../../hooks/useAuth';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';
import { UserProfile } from './UserProfile';

interface AuthSectionProps {
  className?: string;
}

type AuthView = 'profile' | 'login' | 'register';

/**
 * AuthSection - Sezione autenticazione sidebar con dark theme gaming Skèmino
 * Gestisce login, registrazione e profilo utente con design moderno dark-first
 */
export const AuthSection: React.FC<AuthSectionProps> = ({ className = '' }) => {
  const { user, isAuthenticated, isLoading, loginAsGuest, logout } = useAuth();
  const [currentView, setCurrentView] = useState<AuthView>('profile');
  const [showGuestOptions, setShowGuestOptions] = useState(false);

  // Guest login handler
  const handleGuestLogin = async () => {
    const result = await loginAsGuest();
    if (result.success) {
      setShowGuestOptions(false);
    }
  };

  // Loading state per animazioni
  if (isLoading) {
    return (
      <div className={`p-4 bg-skemino-dark-secondary rounded-lg border border-skemino-dark-accent ${className}`}>
        <div className="flex items-center justify-center space-x-3">
          <motion.div
            className="w-6 h-6 border-2 border-suit-forbici-dark border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <span className="text-text-secondary text-sm">Caricamento...</span>
        </div>
      </div>
    );
  }

  // User authenticated - show profile
  if (isAuthenticated && user) {
    return (
      <motion.div
        className={`bg-skemino-dark-secondary rounded-lg border border-skemino-dark-accent overflow-hidden ${className}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <UserProfile
          user={user}
          onLogout={logout}
          onViewChange={setCurrentView}
        />
      </motion.div>
    );
  }

  // User not authenticated - show auth options
  return (
    <motion.div
      className={`bg-skemino-dark-secondary rounded-lg border border-skemino-dark-accent overflow-hidden ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header con benvenuto */}
      <div className="p-4 bg-gradient-to-r from-skemino-dark-secondary to-skemino-dark-tertiary border-b border-skemino-dark-accent">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-suit-forbici-dark/20 rounded-lg">
            <UserIcon className="w-5 h-5 text-suit-forbici-dark" />
          </div>
          <div>
            <h3 className="text-text-primary font-semibold text-sm">Benvenuto in Skèmino</h3>
            <p className="text-text-muted text-xs">Accedi per giocare competitivamente</p>
          </div>
        </div>
      </div>

      {/* Auth Content */}
      <div className="p-4 space-y-4">
        <AnimatePresence mode="wait">
          {currentView === 'login' && (
            <motion.div
              key="login"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <LoginForm
                onSuccess={() => setCurrentView('profile')}
                onSwitchToRegister={() => setCurrentView('register')}
                onBack={() => setCurrentView('profile')}
              />
            </motion.div>
          )}

          {currentView === 'register' && (
            <motion.div
              key="register"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <RegisterForm
                onSuccess={() => setCurrentView('profile')}
                onSwitchToLogin={() => setCurrentView('login')}
                onBack={() => setCurrentView('profile')}
              />
            </motion.div>
          )}

          {currentView === 'profile' && (
            <motion.div
              key="options"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="space-y-3"
            >
              {/* Quick Action Buttons */}
              <div className="grid grid-cols-2 gap-2">
                <motion.button
                  onClick={() => setCurrentView('login')}
                  className="p-3 bg-gradient-to-br from-suit-forbici-dark/20 to-suit-forbici-dark/10
                           border border-suit-forbici-dark/30 rounded-lg text-suit-forbici-dark
                           hover:from-suit-forbici-dark/30 hover:to-suit-forbici-dark/20
                           transition-all duration-200 group"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <ArrowRightOnRectangleIcon className="w-5 h-5 mx-auto mb-1 group-hover:rotate-12 transition-transform" />
                  <span className="text-xs font-medium">Login</span>
                </motion.button>

                <motion.button
                  onClick={() => setCurrentView('register')}
                  className="p-3 bg-gradient-to-br from-suit-carta-dark/20 to-suit-carta-dark/10
                           border border-suit-carta-dark/30 rounded-lg text-suit-carta-dark
                           hover:from-suit-carta-dark/30 hover:to-suit-carta-dark/20
                           transition-all duration-200 group"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <UserPlusIcon className="w-5 h-5 mx-auto mb-1 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-medium">Registrati</span>
                </motion.button>
              </div>

              {/* Guest Option */}
              <div className="relative">
                <motion.button
                  onClick={() => setShowGuestOptions(!showGuestOptions)}
                  className="w-full p-3 bg-gradient-to-r from-skemino-dark-tertiary to-skemino-dark-accent
                           border border-border-dark rounded-lg text-text-secondary
                           hover:text-text-primary hover:border-border-subtle
                           transition-all duration-200 flex items-center justify-between group"
                  whileHover={{ scale: 1.01 }}
                >
                  <div className="flex items-center space-x-2">
                    <UserIcon className="w-4 h-4" />
                    <span className="text-sm font-medium">Gioca come Ospite</span>
                  </div>
                  <motion.div
                    animate={{ rotate: showGuestOptions ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </motion.div>
                </motion.button>

                <AnimatePresence>
                  {showGuestOptions && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="mt-2 p-3 bg-skemino-dark-primary border border-border-subtle rounded-lg"
                    >
                      <div className="space-y-3">
                        <div className="text-xs text-text-muted">
                          <p className="mb-2">Modalità ospite:</p>
                          <ul className="list-disc list-inside space-y-1 text-[10px]">
                            <li>Partite non salvate nel rating</li>
                            <li>Limitazioni funzionalità social</li>
                            <li>Sessione temporanea</li>
                          </ul>
                        </div>

                        <motion.button
                          onClick={handleGuestLogin}
                          disabled={isLoading}
                          className="w-full p-2 bg-gradient-to-r from-suit-pietra-dark/20 to-suit-pietra-dark/10
                                   border border-suit-pietra-dark/30 rounded text-suit-pietra-dark
                                   hover:from-suit-pietra-dark/30 hover:to-suit-pietra-dark/20
                                   disabled:opacity-50 disabled:cursor-not-allowed
                                   transition-all duration-200 text-xs font-medium"
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                        >
                          {isLoading ? 'Creazione...' : 'Inizia Sessione Ospite'}
                        </motion.button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Features Preview */}
              <div className="pt-2 border-t border-border-subtle">
                <h4 className="text-xs font-medium text-text-secondary mb-2">Perché registrarsi?</h4>
                <div className="space-y-2">
                  {[
                    { icon: TrophyIcon, text: 'Rating competitivo', color: 'text-suit-carta-dark' },
                    { icon: StarIcon, text: 'Progressi e achievement', color: 'text-suit-forbici-dark' },
                    { icon: ShieldCheckIcon, text: 'Profilo verificato', color: 'text-success-dark' },
                    { icon: ClockIcon, text: 'Storico partite', color: 'text-suit-pietra-dark' },
                  ].map((feature, index) => (
                    <motion.div
                      key={index}
                      className="flex items-center space-x-2"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <feature.icon className={`w-3 h-3 ${feature.color}`} />
                      <span className="text-xs text-text-muted">{feature.text}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};