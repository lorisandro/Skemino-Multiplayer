import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';
import { useAuth } from '../hooks/useAuth';
import type { LoginCredentials, RegisterCredentials } from '../types/auth';

type AuthView = 'login' | 'register' | 'dashboard';

/**
 * AuthDemo - Demo component per testare LoginPage e RegisterPage
 * Mostra l'integrazione completa dell'autenticazione Skèmino
 */
export const AuthDemo: React.FC = () => {
  const [currentView, setCurrentView] = useState<AuthView>('login');
  const {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    socialLogin,
  } = useAuth();

  // Handle login
  const handleLogin = async (credentials: LoginCredentials) => {
    const response = await login(credentials);

    if (response.success) {
      console.log('Login successful:', response.user);
      setCurrentView('dashboard');
    } else {
      console.error('Login failed:', response.message);
      // Error handling is already done in the LoginPage component
    }
  };

  // Handle registration
  const handleRegister = async (credentials: RegisterCredentials) => {
    const response = await register(credentials);

    if (response.success) {
      console.log('Registration successful:', response.user);
      setCurrentView('dashboard');
    } else {
      console.error('Registration failed:', response.message);
      // Error handling is already done in the RegisterPage component
    }
  };

  // Handle social login
  const handleSocialLogin = async (provider: string) => {
    const response = await socialLogin(provider);

    if (response.success) {
      console.log(`${provider} login successful:`, response.user);
      setCurrentView('dashboard');
    } else {
      console.error(`${provider} login failed:`, response.message);
    }
  };

  // Handle logout
  const handleLogout = async () => {
    await logout();
    setCurrentView('login');
  };

  // Navigation functions
  const navigateToRegister = () => setCurrentView('register');
  const navigateToLogin = () => setCurrentView('login');

  // Dashboard view (simple placeholder)
  const DashboardView = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="flex flex-col items-center justify-center min-h-screen p-8">
        <motion.div
          className="max-w-2xl w-full bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl p-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* User Welcome */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-white font-bold text-3xl">
                {user?.username?.[0]?.toUpperCase() || '👤'}
              </span>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Benvenuto, {user?.username || 'Giocatore'}! 🎮
            </h1>
            <p className="text-gray-300">
              Il tuo account Skèmino è attivo e pronto per giocare
            </p>
          </motion.div>

          {/* User Stats */}
          {user && (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                <div className="text-2xl mb-2">🏆</div>
                <h3 className="font-semibold text-white mb-1">Rating</h3>
                <p className="text-blue-400 font-bold text-xl">{user.rating}</p>
                <p className="text-xs text-gray-400">{user.level.tier}</p>
              </div>

              <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                <div className="text-2xl mb-2">📊</div>
                <h3 className="font-semibold text-white mb-1">Partite</h3>
                <p className="text-green-400 font-bold text-xl">{user.statistics.totalGames}</p>
                <p className="text-xs text-gray-400">
                  {user.statistics.gamesWon}W - {user.statistics.gamesLost}L
                </p>
              </div>

              <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                <div className="text-2xl mb-2">⚡</div>
                <h3 className="font-semibold text-white mb-1">Streak</h3>
                <p className="text-yellow-400 font-bold text-xl">{user.statistics.currentWinStreak}</p>
                <p className="text-xs text-gray-400">vittorie consecutive</p>
              </div>
            </motion.div>
          )}

          {/* Action Buttons */}
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <button
              onClick={() => console.log('Navigating to game...')}
              className="w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg"
            >
              🎮 Inizia a Giocare
            </button>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => console.log('View profile...')}
                className="py-2 px-4 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all duration-200"
              >
                👤 Profilo
              </button>
              <button
                onClick={handleLogout}
                disabled={isLoading}
                className="py-2 px-4 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600/30 transition-all duration-200 disabled:opacity-50"
              >
                {isLoading ? '⏳' : '🚪'} Logout
              </button>
            </div>
          </motion.div>

          {/* Debug Info */}
          <motion.details
            className="mt-8 text-left"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            <summary className="text-gray-400 text-sm cursor-pointer hover:text-gray-300">
              🔧 Debug Info (Click to expand)
            </summary>
            <div className="mt-4 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
              <pre className="text-xs text-gray-300 overflow-auto">
                {JSON.stringify(user, null, 2)}
              </pre>
            </div>
          </motion.details>
        </motion.div>
      </div>
    </div>
  );

  // Loading state
  if (isLoading && !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-white text-lg">Caricamento...</p>
        </motion.div>
      </div>
    );
  }

  // Show dashboard if authenticated
  if (isAuthenticated && user) {
    return <DashboardView />;
  }

  // Show auth views
  return (
    <AnimatePresence mode="wait">
      {currentView === 'login' && (
        <motion.div
          key="login"
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 100 }}
          transition={{ duration: 0.3 }}
        >
          <LoginPage
            onLogin={handleLogin}
            onNavigateToRegister={navigateToRegister}
            onSocialLogin={handleSocialLogin}
          />
        </motion.div>
      )}

      {currentView === 'register' && (
        <motion.div
          key="register"
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.3 }}
        >
          <RegisterPage
            onRegister={handleRegister}
            onNavigateToLogin={navigateToLogin}
            onSocialLogin={handleSocialLogin}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AuthDemo;