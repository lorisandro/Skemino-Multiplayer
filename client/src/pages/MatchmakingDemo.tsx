import React from 'react';
import { motion } from 'framer-motion';
import { MatchmakingButton } from '../components/gaming/MatchmakingButton';
import { GameLayout } from '../components/gaming/GameLayout';
import { useGameStore } from '../store/gameStore';
import { useSocket } from '../hooks/useSocket';

export const MatchmakingDemo: React.FC = () => {
  const { gameState, currentPlayer, opponent, distributionState } = useGameStore();
  const { connected, latency } = useSocket();

  // Show game layout if we have both players and game state
  const showGameLayout = currentPlayer && opponent && gameState;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {!showGameLayout ? (
        // Matchmaking/waiting screen
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

            {/* Distribution status */}
            {distributionState.isDistributing && (
              <motion.div
                className="mt-8 bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h3 className="text-lg font-semibold text-white mb-4">
                  {distributionState.phase === 'shuffling' && '🔀 Shuffling Cards...'}
                  {distributionState.phase === 'dealing' && '🎴 Dealing Cards...'}
                  {distributionState.phase === 'starting' && '🚀 Starting Game...'}
                </h3>

                <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden mb-4">
                  <motion.div
                    className="h-full bg-gradient-to-r from-blue-400 to-purple-500"
                    animate={{ width: `${distributionState.animationProgress}%` }}
                    transition={{ duration: 0.2 }}
                  />
                </div>

                {distributionState.phase === 'dealing' && (
                  <p className="text-sm text-gray-300">
                    Card {distributionState.currentCard} of 10 • Real-time sync
                  </p>
                )}
              </motion.div>
            )}
          </motion.div>
        </div>
      ) : (
        // Game layout when ready
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <GameLayout
            gameId="demo-game"
            onMakeMove={(card, to) => {
              console.log('Move made:', card, 'to', to);
            }}
            onResign={() => {
              console.log('Player resigned');
            }}
            onOfferDraw={() => {
              console.log('Draw offered');
            }}
          />
        </motion.div>
      )}
    </div>
  );
};