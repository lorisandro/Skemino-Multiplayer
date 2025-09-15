import React from 'react';
import { useNavigate, Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const handlePlayOnline = () => {
    navigate('/game');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Navigation Header */}
      <header className="bg-black/30 backdrop-blur-md border-b border-white/10">
        <nav className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">S</span>
              </div>
              <span className="text-2xl font-bold text-white">Skèmino</span>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <a href="#" className="text-gray-300 hover:text-white transition-colors">Gioca</a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">Impara</a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">Tornei</a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">Classifiche</a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">Community</a>
            </div>

            <div className="flex items-center space-x-4">
              <Link to="/login" className="text-gray-300 hover:text-white transition-colors">
                Accedi
              </Link>
              <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors">
                Registrati
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-6xl font-bold text-white leading-tight">
                Gioca a <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-600">Skèmino</span> Online
              </h1>
              <p className="text-xl text-gray-300">
                Il gioco strategico che combina tattica, controllo del territorio e mosse calcolate.
                Sfida giocatori da tutto il mondo con le 39 Chain Cards e conquista la tavola 6x6.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handlePlayOnline}
                className="group relative px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-bold text-lg shadow-2xl hover:shadow-green-500/25 transform hover:scale-105 transition-all duration-200"
              >
                <span className="flex items-center justify-center space-x-2">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Gioca Online</span>
                </span>
              </button>

              <button className="px-8 py-4 bg-white/10 backdrop-blur border border-white/20 text-white rounded-xl font-bold text-lg hover:bg-white/20 transition-all duration-200">
                <span className="flex items-center justify-center space-x-2">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>Gioca vs Computer</span>
                </span>
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-amber-400">10M+</div>
                <div className="text-sm text-gray-400">Partite Giocate</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-amber-400">500K+</div>
                <div className="text-sm text-gray-400">Giocatori Attivi</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-amber-400">39</div>
                <div className="text-sm text-gray-400">Chain Cards</div>
              </div>
            </div>
          </div>

          {/* Right Content - Game Preview */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-orange-600/20 blur-3xl"></div>
            <div className="relative bg-black/40 backdrop-blur-xl rounded-2xl p-8 border border-white/10">
              {/* Mini Board Preview */}
              <div className="grid grid-cols-6 gap-1 mb-6">
                {Array.from({ length: 36 }).map((_, i) => (
                  <div
                    key={i}
                    className={`aspect-square rounded ${
                      [0, 5, 30, 35].includes(i)
                        ? 'bg-amber-500/30 border-2 border-amber-500'
                        : 'bg-white/5 border border-white/10'
                    }`}
                  />
                ))}
              </div>

              {/* Card Display */}
              <div className="flex justify-center space-x-2">
                <div className="w-16 h-24 bg-gradient-to-br from-red-500 to-red-700 rounded-lg flex items-center justify-center text-white font-bold">
                  P7
                </div>
                <div className="w-16 h-24 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center text-white font-bold">
                  C3
                </div>
                <div className="w-16 h-24 bg-gradient-to-br from-green-500 to-green-700 rounded-lg flex items-center justify-center text-white font-bold">
                  F11
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-6 py-20 border-t border-white/10">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white">Partite Rapide</h3>
            <p className="text-gray-400">Partite blitz da 3 minuti o classiche da 15 minuti</p>
          </div>

          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white">Sistema ELO</h3>
            <p className="text-gray-400">Scala le classifiche da Principiante a Gran Maestro</p>
          </div>

          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white">Tornei</h3>
            <p className="text-gray-400">Partecipa a tornei giornalieri e vinci premi</p>
          </div>

          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white">Impara</h3>
            <p className="text-gray-400">Tutorial interattivi e analisi delle partite</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="bg-gradient-to-r from-amber-500/20 to-orange-600/20 rounded-3xl p-12 text-center backdrop-blur-xl border border-white/10">
          <h2 className="text-4xl font-bold text-white mb-4">
            Pronto a Dominare la Tavola?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Unisciti a migliaia di giocatori e diventa un maestro di Skèmino.
            Registrazione gratuita, partite illimitate!
          </p>
          <button
            onClick={handlePlayOnline}
            className="px-12 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-bold text-lg shadow-2xl hover:shadow-green-500/25 transform hover:scale-105 transition-all duration-200"
          >
            Inizia a Giocare Gratis
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 mt-20">
        <div className="container mx-auto px-6 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h4 className="text-white font-bold mb-4">Gioca</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Gioca Online</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Gioca vs Computer</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Tornei</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Eventi Live</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-4">Impara</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Tutorial</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Regole</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Strategie</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Analisi Partite</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-4">Community</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Forum</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Club</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Streamer</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Discord</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-4">Supporto</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Centro Assistenza</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contattaci</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Termini</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 mt-12 pt-8 text-center">
            <p className="text-gray-400">
              © 2025 Skèmino. Tutti i diritti riservati. Un gioco di strategia e controllo del territorio.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;