import React from 'react';
import { useNavigate, Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const handlePlayOnline = () => {
    navigate('/login');
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
              <Link to="/register" className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors">
                Registrati
              </Link>
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

          {/* Right Content - Game Board Image */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-orange-600/20 blur-3xl"></div>
            <div className="relative bg-black/40 backdrop-blur-xl rounded-2xl p-8 border border-white/10">
              <img
                src="/img/Tabellone/tabellone_skemino.webp"
                alt="Skèmino Game Board"
                className="w-full h-auto rounded-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Bot Arena Section */}
      <section className="py-20 bg-gray-950 border-t border-white/10">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
                Affronta i Nostri Bot Intelligenti
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Allenati con AI specializzate in diverse strategie di Skèmino, da principiante a gran maestro
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {/* Bot Novice */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-green-500 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl">
              <div className="text-center">
                <div className="relative mb-4">
                  <div className="w-20 h-20 mx-auto rounded-full border-4 border-green-500 bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                    <span className="text-2xl font-bold text-white">🤖</span>
                  </div>
                  <div className="absolute -top-2 -right-2 bg-green-600 text-white text-xs px-2 py-1 rounded-full">
                    NOVICE
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Apprendista</h3>
                <div className="mb-2">
                  <span className="text-2xl font-bold text-green-400">1200</span>
                  <span className="text-gray-400 ml-1">ELO</span>
                </div>
                <p className="text-sm text-gray-400 mb-4">
                  Mosse base e pattern semplici
                </p>
                <button className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300">
                  SFIDA ORA
                </button>
              </div>
            </div>

            {/* Bot Warrior */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-orange-500 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl">
              <div className="text-center">
                <div className="relative mb-4">
                  <div className="w-20 h-20 mx-auto rounded-full border-4 border-orange-500 bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
                    <span className="text-2xl font-bold text-white">⚔️</span>
                  </div>
                  <div className="absolute -top-2 -right-2 bg-orange-600 text-white text-xs px-2 py-1 rounded-full">
                    WARRIOR
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Guerriero Tattico</h3>
                <div className="mb-2">
                  <span className="text-2xl font-bold text-orange-400">1600</span>
                  <span className="text-gray-400 ml-1">ELO</span>
                </div>
                <p className="text-sm text-gray-400 mb-4">
                  Controllo spazio e combo cards
                </p>
                <button className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300">
                  SFIDA ORA
                </button>
              </div>
            </div>

            {/* Bot Master */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-red-500 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl">
              <div className="text-center">
                <div className="relative mb-4">
                  <div className="w-20 h-20 mx-auto rounded-full border-4 border-red-500 bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center">
                    <span className="text-2xl font-bold text-white">🎯</span>
                  </div>
                  <div className="absolute -top-2 -right-2 bg-red-600 text-white text-xs px-2 py-1 rounded-full">
                    MASTER
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Maestro Strategico</h3>
                <div className="mb-2">
                  <span className="text-2xl font-bold text-red-400">2100</span>
                  <span className="text-gray-400 ml-1">ELO</span>
                </div>
                <p className="text-sm text-gray-400 mb-4">
                  Pattern avanzati e sacrifici
                </p>
                <button className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300">
                  SFIDA ORA
                </button>
              </div>
            </div>

            {/* Bot Sage */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-purple-500 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl">
              <div className="text-center">
                <div className="relative mb-4">
                  <div className="w-20 h-20 mx-auto rounded-full border-4 border-purple-500 bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center">
                    <span className="text-2xl font-bold text-white">🧙</span>
                  </div>
                  <div className="absolute -top-2 -right-2 bg-purple-600 text-white text-xs px-2 py-1 rounded-full">
                    SAGE
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Saggio Supremo</h3>
                <div className="mb-2">
                  <span className="text-2xl font-bold text-purple-400">2500</span>
                  <span className="text-gray-400 ml-1">ELO</span>
                </div>
                <p className="text-sm text-gray-400 mb-4">
                  Calcolo profondo e intuizione
                </p>
                <button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300">
                  SFIDA ORA
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Global Community Section */}
      <section className="py-20 bg-gray-900">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-green-400">
                Entra nella Comunità Globale Skèmino
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Gioca con milioni di strateghi da tutto il mondo in tempo reale
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* World Map */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <div className="relative w-full h-80 bg-gradient-to-br from-gray-700 to-gray-900 rounded-lg overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-green-500/10"></div>

                {/* Simulated world map with connection lines */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl mb-4">🌍</div>
                    <div className="text-white font-bold text-xl mb-2">Connessioni Globali Live</div>
                    <div className="text-blue-400 text-lg">Oltre 100+ Paesi Connessi</div>
                  </div>
                </div>

                {/* Animated connection dots */}
                <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <div className="absolute top-1/3 right-1/4 w-3 h-3 bg-blue-400 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
                <div className="absolute bottom-1/3 left-1/3 w-3 h-3 bg-yellow-400 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
                <div className="absolute bottom-1/4 right-1/3 w-3 h-3 bg-purple-400 rounded-full animate-pulse" style={{animationDelay: '1.5s'}}></div>
                <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-red-400 rounded-full animate-pulse transform -translate-x-1/2 -translate-y-1/2" style={{animationDelay: '2s'}}></div>
              </div>
            </div>

            {/* Live Statistics */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h3 className="text-2xl font-bold text-white mb-6">📊 Statistiche Live</h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-gray-700">
                  <span className="text-gray-300 font-medium">🟢 Giocatori Online</span>
                  <span className="text-green-400 font-bold text-xl">125,847</span>
                </div>

                <div className="flex items-center justify-between py-3 border-b border-gray-700">
                  <span className="text-gray-300 font-medium">👥 Membri Totali</span>
                  <span className="text-blue-400 font-bold text-xl">2,156,924</span>
                </div>

                <div className="flex items-center justify-between py-3 border-b border-gray-700">
                  <span className="text-gray-300 font-medium">🎯 Partite in Corso</span>
                  <span className="text-yellow-400 font-bold text-xl">45,128</span>
                </div>

                <div className="flex items-center justify-between py-3 border-b border-gray-700">
                  <span className="text-gray-300 font-medium">🏆 Tornei Attivi</span>
                  <span className="text-purple-400 font-bold text-xl">1,247</span>
                </div>
              </div>

              <div className="mt-6">
                <h4 className="text-lg font-bold text-white mb-4">🔥 Top Paesi:</h4>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <span className="text-gray-400 font-bold mr-3">1.</span>
                    <span className="text-2xl mr-3">🇮🇹</span>
                    <span className="text-white font-medium">Italia</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-gray-400 font-bold mr-3">2.</span>
                    <span className="text-2xl mr-3">🇺🇸</span>
                    <span className="text-white font-medium">USA</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-gray-400 font-bold mr-3">3.</span>
                    <span className="text-2xl mr-3">🇩🇪</span>
                    <span className="text-white font-medium">Germania</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-gray-400 font-bold mr-3">4.</span>
                    <span className="text-2xl mr-3">🇫🇷</span>
                    <span className="text-white font-medium">Francia</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-gray-400 font-bold mr-3">5.</span>
                    <span className="text-2xl mr-3">🇧🇷</span>
                    <span className="text-white font-medium">Brasile</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Game Analysis Section */}
      <section className="py-20 bg-gray-950">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                Analizza e Migliora il Tuo Gioco
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Coach virtuale e sistema PSN avanzato per eccellere in Skèmino
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Game Review Board */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h3 className="text-xl font-bold text-white mb-4">🎯 Revisione Partita</h3>

              {/* Simulated Skemino Board */}
              <div className="grid grid-cols-6 gap-1 mb-6 bg-amber-100 p-4 rounded-lg">
                {Array.from({ length: 36 }).map((_, i) => {
                  const isVertex = [0, 5, 30, 35].includes(i);
                  const hasCard = [8, 14, 21, 27].includes(i);
                  return (
                    <div
                      key={i}
                      className={`aspect-square rounded flex items-center justify-center text-xs font-bold
                        ${isVertex
                          ? 'bg-amber-400 border-2 border-amber-600 text-amber-900'
                          : 'bg-amber-50 border border-amber-200 text-amber-600'
                        }`}
                    >
                      {hasCard && (
                        <span className="text-blue-700 font-bold">
                          {i === 8 ? 'C4' : i === 14 ? 'P2' : i === 21 ? 'F1' : 'C7'}
                        </span>
                      )}
                      {isVertex && (
                        <span className="text-amber-900 text-xs">
                          {i === 0 ? 'a1' : i === 5 ? 'f1' : i === 30 ? 'a6' : 'f6'}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* PSN Notation */}
              <div className="bg-gray-900 rounded p-4 mb-4">
                <h4 className="text-sm font-bold text-blue-400 mb-2">PSN Notation:</h4>
                <div className="text-gray-300 text-sm font-mono">
                  <div>1.C4:d3 F1:f6*</div>
                  <div>2.P2:a1 F7:e4</div>
                  <div className="text-green-400">3.C7:c2=# 1-0</div>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-between">
                <div className="flex space-x-2">
                  <button className="bg-gray-700 hover:bg-gray-600 text-white p-2 rounded">◀</button>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded">⏯</button>
                  <button className="bg-gray-700 hover:bg-gray-600 text-white p-2 rounded">▶</button>
                </div>
                <div className="text-green-400 font-mono">Valutazione: +1.2</div>
              </div>
            </div>

            {/* Virtual Coach */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-4">
                  <span className="text-2xl">🤖</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Coach Virtuale</h3>
                  <p className="text-gray-400">Maestro Skèmino AI</p>
                </div>
              </div>

              <div className="bg-blue-900 border border-blue-700 rounded-lg p-4 mb-6">
                <p className="text-blue-100 font-medium">
                  "Ottima mossa! Il controllo del vertice a1 ti dà un vantaggio strategico significativo.
                  Ora concentrati sul mantenimento della posizione centrale."
                </p>
              </div>

              <div>
                <h4 className="text-lg font-bold text-white mb-4">📈 Aree di Miglioramento:</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between bg-gray-700 rounded p-3">
                    <span className="text-gray-300">Vertex Control</span>
                    <div className="flex">
                      <div className="w-3 h-3 bg-green-400 rounded-full mr-1"></div>
                      <div className="w-3 h-3 bg-green-400 rounded-full mr-1"></div>
                      <div className="w-3 h-3 bg-green-400 rounded-full mr-1"></div>
                      <div className="w-3 h-3 bg-gray-500 rounded-full mr-1"></div>
                      <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between bg-gray-700 rounded p-3">
                    <span className="text-gray-300">Card Efficiency</span>
                    <div className="flex">
                      <div className="w-3 h-3 bg-yellow-400 rounded-full mr-1"></div>
                      <div className="w-3 h-3 bg-yellow-400 rounded-full mr-1"></div>
                      <div className="w-3 h-3 bg-gray-500 rounded-full mr-1"></div>
                      <div className="w-3 h-3 bg-gray-500 rounded-full mr-1"></div>
                      <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between bg-gray-700 rounded p-3">
                    <span className="text-gray-300">Tactical Vision</span>
                    <div className="flex">
                      <div className="w-3 h-3 bg-red-400 rounded-full mr-1"></div>
                      <div className="w-3 h-3 bg-red-400 rounded-full mr-1"></div>
                      <div className="w-3 h-3 bg-red-400 rounded-full mr-1"></div>
                      <div className="w-3 h-3 bg-red-400 rounded-full mr-1"></div>
                      <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between bg-gray-700 rounded p-3">
                    <span className="text-gray-300">Endgame Technique</span>
                    <div className="flex">
                      <div className="w-3 h-3 bg-purple-400 rounded-full mr-1"></div>
                      <div className="w-3 h-3 bg-purple-400 rounded-full mr-1"></div>
                      <div className="w-3 h-3 bg-purple-400 rounded-full mr-1"></div>
                      <div className="w-3 h-3 bg-gray-500 rounded-full mr-1"></div>
                      <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Strategic Puzzles Section */}
      <section className="py-20 bg-gray-900">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">
                Allena la Tua Mente con Puzzle Quotidiani
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Risolvi scenari strategici complessi e migliora le tue abilità tattiche
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Puzzle Board */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h3 className="text-xl font-bold text-white mb-4">🧩 Puzzle del Giorno</h3>

              {/* Puzzle Board */}
              <div className="grid grid-cols-6 gap-1 mb-6 bg-amber-100 p-4 rounded-lg">
                {Array.from({ length: 36 }).map((_, i) => {
                  const isVertex = [0, 5, 30, 35].includes(i);
                  const hasCard = [8, 12, 16, 20, 24, 28].includes(i);
                  const isHighlight = [14, 20].includes(i);
                  return (
                    <div
                      key={i}
                      className={`aspect-square rounded flex items-center justify-center text-xs font-bold
                        ${isVertex
                          ? 'bg-amber-400 border-2 border-amber-600 text-amber-900'
                          : isHighlight
                          ? 'bg-yellow-300 border-2 border-yellow-500 text-yellow-900'
                          : 'bg-amber-50 border border-amber-200 text-amber-600'
                        }`}
                    >
                      {hasCard && (
                        <span className="text-blue-700 font-bold">
                          {i === 8 ? 'P7' : i === 12 ? 'C3' : i === 16 ? 'F1' : i === 20 ? '?' : i === 24 ? 'P2' : 'C5'}
                        </span>
                      )}
                      {isVertex && (
                        <span className="text-amber-900 text-xs">
                          {i === 0 ? 'a1' : i === 5 ? 'f1' : i === 30 ? 'a6' : 'f6'}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Puzzle Objective */}
              <div className="bg-blue-900 border border-blue-700 rounded-lg p-4 mb-4">
                <p className="text-blue-100 font-medium text-center">
                  <strong>Obiettivo:</strong> Controlla il vertice f6 in 2 mosse
                </p>
              </div>

              {/* Puzzle Controls */}
              <div className="flex justify-between items-center">
                <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg transition-colors">
                  GIOCA SOLUZIONE
                </button>
                <div className="text-yellow-400 font-mono text-lg">
                  Timer: 05:30
                </div>
              </div>
            </div>

            {/* Puzzle Info Panel */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              {/* Daily Challenge */}
              <div className="mb-6 p-4 bg-gradient-to-r from-yellow-900 to-orange-900 rounded-lg">
                <div className="text-yellow-400 font-bold text-lg mb-2">⭐ Puzzle del Giorno</div>
                <div className="flex mb-2">
                  <span className="text-yellow-400 mr-1">⚡</span>
                  <span className="text-yellow-400 mr-1">⚡</span>
                  <span className="text-yellow-400 mr-1">⚡</span>
                  <span className="text-gray-500 mr-1">⚡</span>
                  <span className="text-gray-500">⚡</span>
                </div>
                <div className="text-sm text-gray-300">
                  Rating: 1800 • Risolto da: 1,245 giocatori
                </div>
              </div>

              {/* Streak Counter */}
              <div className="mb-6 p-4 bg-red-900 rounded-lg text-center">
                <div className="text-3xl font-bold text-red-400 mb-1">7</div>
                <div className="text-red-200">🔥 Giorni di Streak Corrente</div>
              </div>

              {/* Puzzle Categories */}
              <div>
                <h4 className="text-lg font-bold text-white mb-4">📊 Categorie Puzzle:</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-2 border-b border-gray-700">
                    <span className="text-white font-medium">• Vertex Control</span>
                    <span className="text-blue-400 text-sm">15/20 risolti</span>
                  </div>

                  <div className="flex items-center justify-between py-2 border-b border-gray-700">
                    <span className="text-white font-medium">• Card Combinations</span>
                    <span className="text-green-400 text-sm">22/30 risolti</span>
                  </div>

                  <div className="flex items-center justify-between py-2 border-b border-gray-700">
                    <span className="text-white font-medium">• Loop Tactics</span>
                    <span className="text-yellow-400 text-sm">8/15 risolti</span>
                  </div>

                  <div className="flex items-center justify-between py-2">
                    <span className="text-white font-medium">• Endgame Patterns</span>
                    <span className="text-purple-400 text-sm">5/12 risolti</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Learning Academy Section */}
      <section className="py-20 bg-gray-950">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-400">
                Padroneggia l'Arte Strategica di Skèmino
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Video tutorial HD e corsi interattivi con i migliori maestri
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Video Tutorial */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h3 className="text-xl font-bold text-white mb-4">🎥 Tutorial in Evidenza</h3>

              {/* Video Thumbnail */}
              <div className="relative bg-gradient-to-br from-gray-700 to-gray-900 rounded-lg overflow-hidden mb-4">
                <div className="aspect-video flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4 cursor-pointer hover:bg-red-700 transition-colors">
                      <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    </div>
                    <div className="text-white font-bold text-lg">Padroneggia il Controllo dei Vertici</div>
                  </div>
                </div>

                {/* Video overlay info */}
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="bg-black/70 rounded p-3">
                    <div className="text-white font-semibold mb-1">
                      "Le strategie fondamentali per dominare i vertici strategici"
                    </div>
                    <div className="flex justify-between text-sm text-gray-300">
                      <span>Durata: 12:45</span>
                      <span>Visto da: 15,420</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center justify-center mb-4">
                <div className="flex text-yellow-400 mr-2">
                  <span>⭐</span>
                  <span>⭐</span>
                  <span>⭐</span>
                  <span>⭐</span>
                  <span>⭐</span>
                </div>
                <span className="text-gray-300 font-medium">(4.8/5)</span>
              </div>

              <button className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition-colors">
                GUARDA TUTORIAL
              </button>
            </div>

            {/* Available Courses */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h3 className="text-xl font-bold text-white mb-6">📚 Corsi Disponibili</h3>

              <div className="space-y-6">
                {/* Beginner Course */}
                <div className="border border-green-500 rounded-lg p-4 bg-green-900/20">
                  <div className="flex items-center mb-3">
                    <div className="text-2xl mr-3">🔰</div>
                    <div>
                      <h4 className="text-green-400 font-bold text-lg">Livello Principiante</h4>
                      <p className="text-gray-300 text-sm">Perfetto per iniziare</p>
                    </div>
                  </div>
                  <div className="text-sm text-gray-300 space-y-1">
                    <div>• Regole Base del Gioco</div>
                    <div>• Setup con i 3 Dadi</div>
                    <div>• Prime Strategie</div>
                    <div>• Morra Cinese Basics</div>
                  </div>
                </div>

                {/* Intermediate Course */}
                <div className="border border-yellow-500 rounded-lg p-4 bg-yellow-900/20">
                  <div className="flex items-center mb-3">
                    <div className="text-2xl mr-3">⚡</div>
                    <div>
                      <h4 className="text-yellow-400 font-bold text-lg">Livello Intermedio</h4>
                      <p className="text-gray-300 text-sm">Approfondisci le tattiche</p>
                    </div>
                  </div>
                  <div className="text-sm text-gray-300 space-y-1">
                    <div>• Controllo dei Vertici</div>
                    <div>• Pattern delle 39 Cards</div>
                    <div>• Tattica Avanzata</div>
                    <div>• Gestione dei Loop</div>
                  </div>
                </div>

                {/* Advanced Course */}
                <div className="border border-purple-500 rounded-lg p-4 bg-purple-900/20">
                  <div className="flex items-center mb-3">
                    <div className="text-2xl mr-3">🏆</div>
                    <div>
                      <h4 className="text-purple-400 font-bold text-lg">Livello Avanzato</h4>
                      <p className="text-gray-300 text-sm">Diventa un maestro</p>
                    </div>
                  </div>
                  <div className="text-sm text-gray-300 space-y-1">
                    <div>• Teoria delle Aperture</div>
                    <div>• Calcolo Profondo</div>
                    <div>• Finali Teorici</div>
                    <div>• Psicologia del Gioco</div>
                  </div>
                </div>
              </div>

              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors mt-6">
                INIZIA PERCORSO FORMATIVO
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Tournament Center Section */}
      <section className="py-20 bg-gray-900">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-red-400">
                Conquista i Tornei Competitivi
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Partecipa ai tornei live e scala le classifiche mondiali
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Live Tournaments */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h3 className="text-xl font-bold text-white mb-6">🏆 Tornei Live</h3>

              {/* Active Tournament */}
              <div className="bg-red-900/30 border border-red-500 rounded-lg p-4 mb-4">
                <div className="flex items-center mb-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse mr-2"></div>
                  <span className="text-red-400 font-bold">LIVE</span>
                </div>
                <h4 className="text-white font-bold text-lg mb-2">Championship Weekly</h4>
                <div className="text-sm text-gray-300 space-y-1">
                  <div>👥 Giocatori: 256/512</div>
                  <div>💰 Prize Pool: €500</div>
                  <div>⏰ Round: 3/7</div>
                  <div>📈 ELO Medio: 1850</div>
                </div>
                <button className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-3 transition-colors">
                  GUARDA LIVE
                </button>
              </div>

              {/* Starting Soon Tournament */}
              <div className="bg-yellow-900/30 border border-yellow-500 rounded-lg p-4 mb-4">
                <div className="flex items-center mb-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                  <span className="text-yellow-400 font-bold">STARTING SOON</span>
                </div>
                <h4 className="text-white font-bold text-lg mb-2">Blitz Arena</h4>
                <div className="text-sm text-gray-300 space-y-1">
                  <div>👥 Iscritti: 64/128</div>
                  <div>⚡ Formato: 3+2</div>
                  <div>⏰ Inizio: 18:30</div>
                  <div>🎯 Entry: 1200+ ELO</div>
                </div>
                <button className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded mt-3 transition-colors">
                  PARTECIPA ORA
                </button>
              </div>

              {/* Upcoming Tournament */}
              <div className="bg-blue-900/30 border border-blue-500 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                  <span className="text-blue-400 font-bold">UPCOMING</span>
                </div>
                <h4 className="text-white font-bold text-lg mb-2">Grand Masters Cup</h4>
                <div className="text-sm text-gray-300 space-y-1">
                  <div>👥 Limite: 32 giocatori</div>
                  <div>💰 Prize Pool: €2,000</div>
                  <div>⏰ Data: 20 Gen 2025</div>
                  <div>🏆 Solo 2000+ ELO</div>
                </div>
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-3 transition-colors">
                  REGISTRATI
                </button>
              </div>
            </div>

            {/* Leaderboards */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h3 className="text-xl font-bold text-white mb-6">🥇 Classifiche Live</h3>

              {/* Top Players */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center bg-gradient-to-r from-yellow-900/50 to-yellow-800/50 rounded-lg p-3 border border-yellow-600">
                  <div className="text-2xl mr-3">👑</div>
                  <div className="flex-1">
                    <div className="text-white font-bold">GrandMaster_IT</div>
                    <div className="text-yellow-400 text-sm">Rating: 2687</div>
                  </div>
                  <div className="text-yellow-400 font-bold">#1</div>
                </div>

                <div className="flex items-center bg-gray-700 rounded-lg p-3">
                  <div className="text-2xl mr-3">🥈</div>
                  <div className="flex-1">
                    <div className="text-white font-bold">StrategistPro_DE</div>
                    <div className="text-gray-400 text-sm">Rating: 2634</div>
                  </div>
                  <div className="text-gray-400 font-bold">#2</div>
                </div>

                <div className="flex items-center bg-gray-700 rounded-lg p-3">
                  <div className="text-2xl mr-3">🥉</div>
                  <div className="flex-1">
                    <div className="text-white font-bold">TacticalMaster_US</div>
                    <div className="text-gray-400 text-sm">Rating: 2598</div>
                  </div>
                  <div className="text-gray-400 font-bold">#3</div>
                </div>
              </div>

              {/* Your Ranking */}
              <div className="bg-blue-900/30 border border-blue-500 rounded-lg p-4 mb-6">
                <h4 className="text-blue-400 font-bold mb-2">🎯 Il Tuo Ranking:</h4>
                <div className="text-white">
                  <div className="font-bold text-lg">#1,247 (1847 ELO)</div>
                  <div className="text-sm text-blue-300">+12 ELO questa settimana</div>
                </div>
              </div>

              {/* Tournament Stats */}
              <div>
                <h4 className="text-white font-bold mb-4">📊 Le Tue Stats Torneo:</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Partecipazioni:</span>
                    <span className="text-white font-bold">23</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Vittorie:</span>
                    <span className="text-green-400 font-bold">8</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Win Rate:</span>
                    <span className="text-yellow-400 font-bold">34.8%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Prize Vinti:</span>
                    <span className="text-purple-400 font-bold">€125</span>
                  </div>
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