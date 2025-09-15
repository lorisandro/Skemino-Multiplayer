import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthContext } from '../contexts/AuthContext';

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthContext();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handlePlayNow = () => {
    navigate('/game');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="flex">
        {/* Left Sidebar */}
        <aside className="w-80 bg-black/40 backdrop-blur-xl border-r border-white/10 min-h-screen">
          <div className="p-6 space-y-6">
            {/* Navigation Menu */}
            <nav className="space-y-2">
              {/* Gioca */}
              <button className="w-full flex items-center space-x-3 px-4 py-3 text-left text-white hover:bg-white/10 rounded-lg transition-colors duration-200">
                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M19 10a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-semibold">Gioca</span>
              </button>

              {/* Impara */}
              <button className="w-full flex items-center space-x-3 px-4 py-3 text-left text-white hover:bg-white/10 rounded-lg transition-colors duration-200">
                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <span className="font-semibold">Impara</span>
              </button>

              {/* Classifica */}
              <button className="w-full flex items-center space-x-3 px-4 py-3 text-left text-white hover:bg-white/10 rounded-lg transition-colors duration-200">
                <svg className="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <span className="font-semibold">Classifica</span>
              </button>

              {/* Leghe */}
              <button className="w-full flex items-center space-x-3 px-4 py-3 text-left text-white hover:bg-white/10 rounded-lg transition-colors duration-200">
                <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
                <span className="font-semibold">Leghe</span>
              </button>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="space-y-6">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-amber-500/20 to-orange-600/20 rounded-2xl p-8 backdrop-blur-xl border border-white/10">
              <h1 className="text-4xl font-bold text-white mb-4">
                Benvenuto {user?.displayName && (
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                    {user.displayName}
                  </span>
                )} su <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-600">Skèmino</span>
              </h1>
              <p className="text-xl text-gray-300 mb-6">
                {user?.level && (
                  <span className="inline-flex items-center gap-2 mb-2 px-3 py-1 bg-white/10 rounded-full text-sm font-medium" style={{ color: user.level.color }}>
                    <span>{user.level.icon}</span>
                    {user.level.name} • Rating: {user.rating}
                  </span>
                )}
                <br />
                Sei pronto per la tua prossima sfida strategica? Trova un avversario e dimostra le tue abilità!
              </p>
              <button
                onClick={handlePlayNow}
                className="px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-bold text-lg shadow-2xl hover:shadow-green-500/25 transform hover:scale-105 transition-all duration-200"
              >
                Gioca Online
              </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-black/40 backdrop-blur-xl rounded-xl p-6 border border-white/10">
                <h3 className="text-lg font-semibold text-white mb-2">Streak Attuale</h3>
                <div className="text-3xl font-bold text-green-400">
                  +{user?.statistics?.currentWinStreak || 0}
                </div>
                <p className="text-gray-400 text-sm">Vittorie consecutive</p>
              </div>

              <div className="bg-black/40 backdrop-blur-xl rounded-xl p-6 border border-white/10">
                <h3 className="text-lg font-semibold text-white mb-2">Partite Giocate</h3>
                <div className="text-3xl font-bold text-blue-400">
                  {user?.statistics?.totalGames || 0}
                </div>
                <p className="text-gray-400 text-sm">Totali</p>
              </div>

              <div className="bg-black/40 backdrop-blur-xl rounded-xl p-6 border border-white/10">
                <h3 className="text-lg font-semibold text-white mb-2">Rating</h3>
                <div className="text-3xl font-bold text-amber-400">
                  {user?.rating || 1000}
                </div>
                <p className="text-gray-400 text-sm">{user?.level?.name || 'Non disponibile'}</p>
              </div>
            </div>

            {/* Active Tournaments */}
            <div className="bg-black/40 backdrop-blur-xl rounded-xl p-6 border border-white/10">
              <h2 className="text-2xl font-bold text-white mb-6">Tornei Attivi</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <h4 className="text-lg font-semibold text-white mb-2">Torneo Serale</h4>
                  <p className="text-gray-400 text-sm mb-3">Inizia tra 2 ore • 64 giocatori</p>
                  <button className="w-full py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg transition-colors">
                    Partecipa
                  </button>
                </div>

                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <h4 className="text-lg font-semibold text-white mb-2">Blitz Championship</h4>
                  <p className="text-gray-400 text-sm mb-3">Partite da 3 minuti • 128 giocatori</p>
                  <button className="w-full py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg transition-colors">
                    Partecipa
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;