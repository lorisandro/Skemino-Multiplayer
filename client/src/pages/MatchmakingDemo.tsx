import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MatchmakingButton } from '../components/gaming/MatchmakingButton';
import { GameInterface } from '../components/gaming/GameInterface';
import { PreGameInterface } from '../components/gaming/PreGameInterface';
import { useGameStore } from '../store/gameStore';
import { useSocket } from '../hooks/useSocket';

export const MatchmakingDemo: React.FC = () => {
  const { gameState, currentPlayer, opponent, distributionState } = useGameStore();
  const { connected, latency } = useSocket();
  const [preGameState, setPreGameState] = useState<'waiting' | 'matched' | 'distributing' | 'ready' | 'starting'>('waiting');

  // Determine the current phase
  const getGamePhase = () => {
    if (!currentPlayer) return 'initial'; // Show landing page
    if (!opponent) return 'waiting'; // Show waiting for opponent
    if (opponent && !gameState) return 'matched'; // Opponent found, need to accept
    if (distributionState.isDistributing) return 'distributing'; // Cards being distributed
    if (gameState && currentPlayer && opponent) return 'active'; // Game is active
    return 'ready'; // Ready to start game
  };

  const currentPhase = getGamePhase();

  // Show game layout only when game is fully active
  const showGameLayout = currentPhase === 'active';

  // Show pre-game interface when we have players but game isn't active yet
  const showPreGameInterface = currentPlayer && ['waiting', 'matched', 'distributing', 'ready', 'starting'].includes(currentPhase);

  // Handlers for pre-game interface
  const handleStartGame = () => {
    // Logic to start the actual game
    console.log('Starting game...');
    // This should trigger the game state initialization
  };

  const handleLeaveMatch = () => {
    // Logic to leave the current match
    console.log('Leaving match...');
    // Reset game store state
  };

  const handleShowSettings = () => {
    console.log('Show settings...');
  };

  return (
    <div className="min-h-screen">
      {/* Landing Page - Initial state when no player */}
      {currentPhase === 'initial' && (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
          <div className="flex flex-col items-center justify-center min-h-screen p-8">
            <motion.div
              className="text-center max-w-2xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Header */}
              <motion.h1
                className="text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-blue-600 bg-clip-text text-transparent mb-4"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                Skèmino
              </motion.h1>

              <motion.p
                className="text-xl text-gray-300 mb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                Strategic Multiplayer Card Game • Real-time Gaming Experience
              </motion.p>

              {/* Features highlight */}
              <motion.div
                className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
                  <div className="text-2xl mb-2">🃏</div>
                  <h3 className="text-lg font-semibold text-white mb-2">39 Unique Cards</h3>
                  <p className="text-sm text-gray-300">
                    Pietra, Forbici, Carta suits with strategic depth
                  </p>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
                  <div className="text-2xl mb-2">🎯</div>
                  <h3 className="text-lg font-semibold text-white mb-2">6×6 Board</h3>
                  <p className="text-sm text-gray-300">
                    Four vertex control for strategic positioning
                  </p>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
                  <div className="text-2xl mb-2">⚡</div>
                  <h3 className="text-lg font-semibold text-white mb-2">Real-time</h3>
                  <p className="text-sm text-gray-300">
                    Sub-100ms latency competitive gaming
                  </p>
                </div>
              </motion.div>

              {/* Matchmaking button */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8, duration: 0.4 }}
              >
                <MatchmakingButton className="mb-8" />
              </motion.div>

              {/* Connection info */}
              <motion.div
                className="flex items-center justify-center gap-6 text-sm text-gray-400"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 0.4 }}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      connected ? 'bg-green-400' : 'bg-red-400'
                    }`}
                  />
                  <span>{connected ? 'Connected' : 'Connecting...'}</span>
                </div>

                {connected && (
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-400" />
                    <span>Latency: {latency}ms</span>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-purple-400" />
                  <span>WebSocket Real-time</span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      )}

      {/* Pre-Game Interface - Matchmaking and preparation phases */}
      {showPreGameInterface && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <PreGameInterface
            gameState={currentPhase as any}
            currentPlayer={currentPlayer}
            opponent={opponent}
            distributionState={distributionState}
            onStartGame={handleStartGame}
            onLeaveMatch={handleLeaveMatch}
            onShowSettings={handleShowSettings}
          />
        </motion.div>
      )}

      {/* Active Game Interface - When game is fully active */}
      {showGameLayout && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <GameInterface />
        </motion.div>
      )}
    </div>
  );
};