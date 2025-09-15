import React from 'react';
import { useNavigate, Link } from 'react-router-dom';

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // TODO: Implement actual logout logic
    console.log('Logout requested');
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
            {/* User Stats */}
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <h2 className="text-xl font-bold text-white mb-4">Le tue Statistiche</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Rating ELO</span>
                  <span className="text-2xl font-bold text-amber-400">1547</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Livello</span>
                  <span className="text-green-400 font-semibold">Intermedio</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Partite Giocate</span>
                  <span className="text-white font-semibold">127</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Vittorie</span>
                  <span className="text-green-400 font-semibold">78 (61%)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Sconfitte</span>
                  <span className="text-red-400 font-semibold">49 (39%)</span>
                </div>
              </div>
            </div>

            {/* Quick Play */}
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <h3 className="text-lg font-bold text-white mb-4">Gioco Rapido</h3>
              <div className="space-y-3">
                <button
                  onClick={handlePlayNow}
                  className="w-full py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200"
                >
                  Trova Partita
                </button>
                <button className="w-full py-3 bg-white/10 border border-white/20 text-white font-bold rounded-lg hover:bg-white/20 transition-all duration-200">
                  Gioca vs Computer
                </button>
                <button className="w-full py-3 bg-white/10 border border-white/20 text-white font-bold rounded-lg hover:bg-white/20 transition-all duration-200">
                  Crea Partita Privata
                </button>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <h3 className="text-lg font-bold text-white mb-4">Attività Recente</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium">vs PlayerXYZ</p>
                    <p className="text-gray-400 text-sm">2 ore fa</p>
                  </div>
                  <span className="text-green-400 font-bold">Vittoria</span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium">vs SkeminoMaster</p>
                    <p className="text-gray-400 text-sm">5 ore fa</p>
                  </div>
                  <span className="text-red-400 font-bold">Sconfitta</span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium">vs ChessLover</p>
                    <p className="text-gray-400 text-sm">1 giorno fa</p>
                  </div>
                  <span className="text-green-400 font-bold">Vittoria</span>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="space-y-6">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-amber-500/20 to-orange-600/20 rounded-2xl p-8 backdrop-blur-xl border border-white/10">
              <h1 className="text-4xl font-bold text-white mb-4">
                Benvenuto su <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-600">Skèmino</span>
              </h1>
              <p className="text-xl text-gray-300 mb-6">
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
                <div className="text-3xl font-bold text-green-400">+5</div>
                <p className="text-gray-400 text-sm">Vittorie consecutive</p>
              </div>

              <div className="bg-black/40 backdrop-blur-xl rounded-xl p-6 border border-white/10">
                <h3 className="text-lg font-semibold text-white mb-2">Tempo Medio</h3>
                <div className="text-3xl font-bold text-blue-400">8:32</div>
                <p className="text-gray-400 text-sm">Per partita</p>
              </div>

              <div className="bg-black/40 backdrop-blur-xl rounded-xl p-6 border border-white/10">
                <h3 className="text-lg font-semibold text-white mb-2">Posizione</h3>
                <div className="text-3xl font-bold text-amber-400">#247</div>
                <p className="text-gray-400 text-sm">Classifica globale</p>
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