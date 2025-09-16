import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import logoSkemino from '../assets/logo-skemino.webp';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  velocity: { x: number; y: number };
}

const HomePage: React.FC = () => {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);

  // Generate floating particles for gaming atmosphere
  useEffect(() => {
    const generateParticles = () => {
      const newParticles: Particle[] = [];
      const particleColors = ['#3B82F6', '#8B5CF6', '#EF4444', '#10B981', '#F59E0B'];

      for (let i = 0; i < 50; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          size: Math.random() * 4 + 1,
          color: particleColors[Math.floor(Math.random() * particleColors.length)],
          velocity: {
            x: (Math.random() - 0.5) * 0.5,
            y: (Math.random() - 0.5) * 0.5
          }
        });
      }
      setParticles(newParticles);
    };

    generateParticles();
    const interval = setInterval(() => {
      setParticles(prev => prev.map(particle => ({
        ...particle,
        x: (particle.x + particle.velocity.x + window.innerWidth) % window.innerWidth,
        y: (particle.y + particle.velocity.y + window.innerHeight) % window.innerHeight
      })));
    }, 50);

    return () => clearInterval(interval);
  }, []);

  // Track mouse for interactive effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
      {/* Animated Background Particles */}
      <div className="fixed inset-0 pointer-events-none">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute rounded-full opacity-30 animate-pulse"
            style={{
              left: `${particle.x}px`,
              top: `${particle.y}px`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              backgroundColor: particle.color,
              boxShadow: `0 0 ${particle.size * 2}px ${particle.color}50`
            }}
          />
        ))}
      </div>

      {/* Navigation Header */}
      <motion.header
        className="fixed top-0 w-full z-50 backdrop-blur-md bg-black/20 border-b border-white/10"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <img
                src={logoSkemino}
                alt="Skèmino"
                className="h-10 w-auto hover:scale-110 transition-transform duration-300"
              />
              <div className="hidden md:block">
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Skèmino
                </h1>
              </div>
            </div>

            <nav className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-300 hover:text-white transition-colors">Caratteristiche</a>
              <a href="#gameplay" className="text-gray-300 hover:text-white transition-colors">Gameplay</a>
              <a href="#tournaments" className="text-gray-300 hover:text-white transition-colors">Tornei</a>
            </nav>

            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="text-gray-300 hover:text-white transition-colors font-medium"
              >
                Accedi
              </Link>
              <Link
                to="/register"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-2 rounded-full font-semibold transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Inizia Ora
              </Link>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Hero Section - Ultra Modern Gaming Design */}
      <section className="relative min-h-screen flex items-center justify-center pt-16">
        <motion.div style={{ y }} className="absolute inset-0 z-0">
          {/* Gradient Orbs Background */}
          <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/30 rounded-full filter blur-3xl animate-pulse" />
          <div className="absolute top-40 right-20 w-96 h-96 bg-purple-500/30 rounded-full filter blur-3xl animate-pulse delay-1000" />
          <div className="absolute bottom-20 left-1/2 w-80 h-80 bg-pink-500/20 rounded-full filter blur-3xl animate-pulse delay-2000" />
        </motion.div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">

            {/* Left Column - Hero Content */}
            <motion.div
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="space-y-8"
            >
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-full px-4 py-2 backdrop-blur-sm"
              >
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm text-blue-300 font-medium">Piattaforma Gaming Competitiva</span>
              </motion.div>

              {/* Main Title - Ultra Impact */}
              <div className="space-y-4">
                <motion.h1
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.8 }}
                  className="text-6xl lg:text-8xl font-black leading-tight"
                >
                  <span className="bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
                    DOMINA
                  </span>
                  <br />
                  <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-pulse">
                    SKÈMINO
                  </span>
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.8 }}
                  className="text-xl lg:text-2xl text-gray-300 leading-relaxed max-w-2xl"
                >
                  Il gioco strategico che sfida la tua mente.
                  <span className="text-blue-400 font-semibold"> 39 carte Chain</span>,
                  <span className="text-purple-400 font-semibold"> tabellone 6×6</span>,
                  <span className="text-pink-400 font-semibold"> infinite possibilità</span>.
                </motion.p>
              </div>

              {/* Stats Row */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
                className="grid grid-cols-3 gap-8 py-6"
              >
                <div className="text-center">
                  <div className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    1000+
                  </div>
                  <div className="text-sm text-gray-400 uppercase tracking-wider">Giocatori Attivi</div>
                </div>
                <div className="text-center border-x border-gray-700">
                  <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    2700+
                  </div>
                  <div className="text-sm text-gray-400 uppercase tracking-wider">Rating Massimo</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-red-400 bg-clip-text text-transparent">
                    24/7
                  </div>
                  <div className="text-sm text-gray-400 uppercase tracking-wider">Matchmaking</div>
                </div>
              </motion.div>

              {/* CTA Buttons - Gaming Style */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0, duration: 0.6 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Link
                  to="/register"
                  className="group relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-2xl font-bold text-lg transform hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-blue-500/50"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 opacity-0 group-hover:opacity-20 transition-opacity" />
                  <div className="relative flex items-center justify-center space-x-3">
                    <span>🚀 INIZIA LA BATTAGLIA</span>
                  </div>
                </Link>

                <Link
                  to="/demo"
                  className="group relative bg-transparent border-2 border-white/20 hover:border-white/40 text-white px-8 py-4 rounded-2xl font-semibold text-lg backdrop-blur-sm transition-all duration-300 hover:bg-white/10"
                >
                  <div className="flex items-center justify-center space-x-3">
                    <span>🎮 Prova Demo</span>
                  </div>
                </Link>
              </motion.div>

              {/* Social Proof */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2, duration: 0.6 }}
                className="flex items-center space-x-6 pt-6"
              >
                <div className="flex items-center space-x-2">
                  <div className="flex -space-x-2">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full border-2 border-gray-800 flex items-center justify-center text-xs font-bold text-white"
                      >
                        {String.fromCharCode(65 + i)}
                      </div>
                    ))}
                  </div>
                  <span className="text-sm text-gray-400">+1,247 giocatori online</span>
                </div>
              </motion.div>
            </motion.div>

            {/* Right Column - Interactive Gaming Board Preview */}
            <motion.div
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 1 }}
              className="relative flex items-center justify-center"
            >
              {/* Main Game Board Preview */}
              <div className="relative">
                {/* Board Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/30 to-purple-500/30 rounded-3xl blur-2xl scale-110" />

                {/* Game Board */}
                <div className="relative bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
                  {/* 6x6 Grid Preview */}
                  <div className="grid grid-cols-6 gap-2 mb-6">
                    {[...Array(36)].map((_, i) => {
                      const row = Math.floor(i / 6);
                      const col = i % 6;
                      const isCorner = (row === 0 && col === 0) || (row === 0 && col === 5) || (row === 5 && col === 0) || (row === 5 && col === 5);
                      const isCenter = (row === 2 && col === 2) || (row === 2 && col === 3) || (row === 3 && col === 2) || (row === 3 && col === 3);
                      const hasCard = Math.random() > 0.7;

                      return (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 1 + (i * 0.02), duration: 0.3 }}
                          className={`
                            aspect-square rounded-lg border-2 flex items-center justify-center text-xs font-bold
                            ${isCorner
                              ? 'bg-gradient-to-br from-blue-500/40 to-purple-500/40 border-blue-400/60'
                              : isCenter
                              ? 'bg-gradient-to-br from-yellow-500/40 to-orange-500/40 border-yellow-400/60'
                              : 'bg-gray-800/60 border-gray-600/40'
                            }
                            ${hasCard ? 'shadow-lg shadow-blue-500/50' : ''}
                            transition-all duration-300 hover:scale-110 cursor-pointer
                          `}
                        >
                          {hasCard && (
                            <motion.div
                              initial={{ scale: 0, rotate: -90 }}
                              animate={{ scale: 1, rotate: 0 }}
                              transition={{ delay: 1.5 + (i * 0.01), duration: 0.4 }}
                              className="w-full h-full bg-gradient-to-br from-white/90 to-gray-200/90 rounded-md flex items-center justify-center text-gray-800 shadow-md"
                            >
                              {Math.random() > 0.5 ? '🗿' : Math.random() > 0.5 ? '✂️' : '📄'}
                            </motion.div>
                          )}
                          <span className="absolute -bottom-5 text-[10px] text-gray-400">
                            {String.fromCharCode(97 + col)}{6 - row}
                          </span>
                        </motion.div>
                      );
                    })}
                  </div>

                  {/* Game Info */}
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
                        <span className="text-green-400 font-medium">Partita Live</span>
                      </div>
                    </div>
                    <div className="text-gray-400">
                      Rating: <span className="text-blue-400 font-semibold">1847</span>
                    </div>
                  </div>
                </div>

                {/* Floating Cards Animation */}
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-12 h-16 bg-gradient-to-br from-white to-gray-200 rounded-lg shadow-xl border border-gray-300"
                    style={{
                      top: `${20 + i * 30}%`,
                      right: `-${20 + i * 10}px`,
                    }}
                    animate={{
                      y: [0, -10, 0],
                      rotate: [0, 5, 0],
                    }}
                    transition={{
                      duration: 2 + i * 0.5,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <div className="w-full h-full flex items-center justify-center text-xl">
                      {i === 0 ? '🗿' : i === 1 ? '✂️' : '📄'}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <div className="flex flex-col items-center space-y-2 text-gray-400">
            <span className="text-sm">Scopri di più</span>
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-6 h-10 border-2 border-gray-400/50 rounded-full flex justify-center"
            >
              <div className="w-1 h-3 bg-gradient-to-b from-blue-400 to-transparent rounded-full mt-2" />
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Features Preview Section */}
      <section id="features" className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-black bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent mb-4">
              Esperienza Gaming Superiore
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Skèmino ridefinisce il gaming strategico con tecnologie avanzate e gameplay innovativo
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: '⚡',
                title: 'Real-Time Multiplayer',
                description: 'Partite istantanee con latenza <100ms. WebSocket per gaming competitivo professionale.',
                gradient: 'from-blue-600 to-purple-600'
              },
              {
                icon: '🏆',
                title: 'Sistema ELO Avanzato',
                description: 'Rating dinamico 1000-2700+ con 10 livelli di skill. Classifiche globali e progressione.',
                gradient: 'from-purple-600 to-pink-600'
              },
              {
                icon: '🧠',
                title: 'Strategia Profonda',
                description: '39 Chain Cards, controllo vertici, loop detection. Ogni partita è unica.',
                gradient: 'from-pink-600 to-red-600'
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                viewport={{ once: true }}
                className="group relative bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-xl rounded-2xl p-8 border border-white/10 hover:border-white/20 transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-300`} />
                <div className="relative">
                  <div className="text-5xl mb-4">{feature.icon}</div>
                  <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;