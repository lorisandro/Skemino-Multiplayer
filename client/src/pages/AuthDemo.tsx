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

  // Dashboard view - Professional Gaming Dark Layout
  const DashboardView = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header Navigation */}
      <header className="bg-slate-900/80 backdrop-blur-md border-b border-slate-700/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="text-2xl font-bold text-white">⚔️ Skèmino</div>
              <div className="hidden md:block">
                <span className="text-sm text-gray-400">Professional Gaming Platform</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-300">
                {user?.username || 'Giocatore'}
              </div>
              <button
                onClick={handleLogout}
                disabled={isLoading}
                className="px-3 py-2 bg-red-600/20 text-red-400 rounded-md hover:bg-red-600/30 transition-all duration-200 disabled:opacity-50 text-sm"
              >
                {isLoading ? '⏳' : '🚪'} Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Dashboard Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

          {/* Main Content - 3/4 width */}
          <div className="lg:col-span-3 space-y-8">

            {/* Welcome Section */}
            <motion.div
              className="bg-slate-800/50 backdrop-blur-xl rounded-xl border border-slate-700/50 shadow-2xl p-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <motion.div
                className="text-center"
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
                  Benvenuto su Skèmino, {user?.username || 'Giocatore'}! 🎮
                </h1>
                <p className="text-gray-300 text-lg">
                  La tua esperienza di gioco strategico professionale ti aspetta
                </p>
              </motion.div>
            </motion.div>

            {/* Statistics Section - Riorganizzata sotto il benvenuto */}
            {user && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-white mb-2">📊 Le Tue Statistiche</h2>
                  <p className="text-gray-400">Panoramica delle tue performance competitive</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Rating Card - Enhanced */}
                  <div className="bg-slate-800/60 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 hover:border-blue-500/50 transition-all duration-300 group">
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-3xl group-hover:scale-110 transition-transform">🏆</div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-blue-400">{user.rating}</div>
                        <div className="text-xs text-gray-500 uppercase tracking-wide">{user.level.tier}</div>
                      </div>
                    </div>
                    <h3 className="font-semibold text-white mb-1">Rating ELO</h3>
                    <p className="text-gray-400 text-sm">Sistema di classificazione competitivo</p>
                    <div className="mt-3 w-full bg-slate-700 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, ((user.rating - 1000) / 1700) * 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* Games Stats Card - Enhanced */}
                  <div className="bg-slate-800/60 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 hover:border-green-500/50 transition-all duration-300 group">
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-3xl group-hover:scale-110 transition-transform">📈</div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-green-400">{user.statistics.totalGames}</div>
                        <div className="text-xs text-gray-500 uppercase tracking-wide">PARTITE</div>
                      </div>
                    </div>
                    <h3 className="font-semibold text-white mb-1">Record Partite</h3>
                    <div className="flex justify-between text-sm">
                      <span className="text-green-400">🟢 {user.statistics.gamesWon}W</span>
                      <span className="text-red-400">🔴 {user.statistics.gamesLost}L</span>
                      <span className="text-gray-400">⚫ {user.statistics.totalGames - user.statistics.gamesWon - user.statistics.gamesLost}D</span>
                    </div>
                    <div className="mt-3 w-full bg-slate-700 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${user.statistics.totalGames > 0 ? (user.statistics.gamesWon / user.statistics.totalGames) * 100 : 0}%` }}
                      />
                    </div>
                  </div>

                  {/* Win Streak Card - Enhanced */}
                  <div className="bg-slate-800/60 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 hover:border-yellow-500/50 transition-all duration-300 group">
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-3xl group-hover:scale-110 transition-transform">⚡</div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-yellow-400">{user.statistics.currentWinStreak}</div>
                        <div className="text-xs text-gray-500 uppercase tracking-wide">STREAK</div>
                      </div>
                    </div>
                    <h3 className="font-semibold text-white mb-1">Vittorie Consecutive</h3>
                    <p className="text-gray-400 text-sm">
                      {user.statistics.currentWinStreak > 0
                        ? `🔥 Serie attiva di ${user.statistics.currentWinStreak} vittorie!`
                        : 'Inizia una nuova serie vincente'
                      }
                    </p>
                    <div className="mt-3 flex space-x-1">
                      {Array.from({ length: Math.min(10, Math.max(1, user.statistics.currentWinStreak)) }).map((_, i) => (
                        <div key={i} className="h-2 w-2 bg-yellow-400 rounded-full" />
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Quick Actions Section */}
            <motion.div
              className="bg-slate-800/50 backdrop-blur-xl rounded-xl border border-slate-700/50 shadow-2xl p-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">🎮 Azioni Rapide</h2>
                <p className="text-gray-400">Inizia subito la tua esperienza di gioco</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => console.log('Navigating to game...')}
                  className="group relative py-4 px-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  <div className="flex items-center justify-center space-x-3">
                    <span className="text-2xl group-hover:scale-110 transition-transform">🎯</span>
                    <span>Partita Rapida</span>
                  </div>
                  <div className="text-sm text-blue-100 mt-1">Matchmaking automatico</div>
                </button>

                <button
                  onClick={() => console.log('View tournaments...')}
                  className="group relative py-4 px-6 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-xl font-semibold hover:from-orange-700 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  <div className="flex items-center justify-center space-x-3">
                    <span className="text-2xl group-hover:scale-110 transition-transform">🏆</span>
                    <span>Tornei</span>
                  </div>
                  <div className="text-sm text-orange-100 mt-1">Competizioni attive</div>
                </button>

                <button
                  onClick={() => console.log('Practice mode...')}
                  className="group relative py-4 px-6 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  <div className="flex items-center justify-center space-x-3">
                    <span className="text-2xl group-hover:scale-110 transition-transform">🧠</span>
                    <span>Allenamento</span>
                  </div>
                  <div className="text-sm text-green-100 mt-1">Migliora le tue skills</div>
                </button>

                <button
                  onClick={() => console.log('View profile...')}
                  className="group relative py-4 px-6 bg-slate-700/80 text-white rounded-xl font-semibold hover:bg-slate-600/80 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 border border-slate-600/50"
                >
                  <div className="flex items-center justify-center space-x-3">
                    <span className="text-2xl group-hover:scale-110 transition-transform">👤</span>
                    <span>Profilo</span>
                  </div>
                  <div className="text-sm text-gray-300 mt-1">Gestisci account</div>
                </button>
              </div>
            </motion.div>

          </div>

          {/* Sidebar - 1/4 width */}
          <div className="lg:col-span-1 space-y-6">

            {/* Recent Activity */}
            <motion.div
              className="bg-slate-800/50 backdrop-blur-xl rounded-xl border border-slate-700/50 p-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <span className="mr-2">⚡</span>
                Attività Recente
              </h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-sm">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-gray-300">Online ora</span>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span className="text-gray-300">Ultimo accesso oggi</span>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  <span className="text-gray-300">Account verificato</span>
                </div>
              </div>
            </motion.div>

            {/* Quick Stats */}
            <motion.div
              className="bg-slate-800/50 backdrop-blur-xl rounded-xl border border-slate-700/50 p-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.0, duration: 0.5 }}
            >
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <span className="mr-2">📈</span>
                Progressi
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-300">Livello Successivo</span>
                    <span className="text-blue-400">85%</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-300">Obiettivo Mensile</span>
                    <span className="text-green-400">12/20</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full" style={{ width: '60%' }}></div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* System Status */}
            <motion.div
              className="bg-slate-800/50 backdrop-blur-xl rounded-xl border border-slate-700/50 p-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.2, duration: 0.5 }}
            >
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <span className="mr-2">🔧</span>
                Sistema
              </h3>
              <div className="space-y-3 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-400">Server Status</span>
                  <span className="text-green-400">🟢 Online</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Latenza</span>
                  <span className="text-blue-400">23ms</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Giocatori Online</span>
                  <span className="text-yellow-400">1,247</span>
                </div>
              </div>
            </motion.div>

            {/* Debug Info - Moved to sidebar */}
            <motion.details
              className="bg-slate-800/30 backdrop-blur-xl rounded-xl border border-slate-700/30 p-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.4, duration: 0.5 }}
            >
              <summary className="text-gray-400 text-xs cursor-pointer hover:text-gray-300 flex items-center">
                <span className="mr-2">🔧</span>
                Debug Info
              </summary>
              <div className="mt-3 p-3 bg-slate-900/50 rounded-lg border border-slate-700/30">
                <pre className="text-xs text-gray-400 overflow-auto max-h-40">
                  {JSON.stringify(user, null, 2)}
                </pre>
              </div>
            </motion.details>

          </div>

        </div>
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