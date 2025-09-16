import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { MatchmakingButton } from '../components/gaming/MatchmakingButton';
import { GameInterface } from '../components/gaming/GameInterface';
import { PreGameInterface } from '../components/gaming/PreGameInterface';
import { useGameStore } from '../store/gameStore';
import { useSocket } from '../hooks/useSocket';
import { useAuthContext } from '../contexts/AuthContext';

export const MatchmakingDemo: React.FC = () => {
  const { gameState, currentPlayer, opponent, distributionState } = useGameStore();
  const { connected, latency, startMatchmaking } = useSocket();
  const { user } = useAuthContext();
  const location = useLocation();
  const [preGameState, setPreGameState] = useState<'waiting' | 'matched' | 'distributing' | 'ready' | 'starting'>('waiting');
  const [autoMatchmakingStarted, setAutoMatchmakingStarted] = useState(false);

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

  // Auto-start matchmaking when coming from dashboard with intent
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const intent = urlParams.get('intent');
    const mode = urlParams.get('mode');

    // Check if we should auto-start matchmaking
    if (intent === 'quickmatch' && connected && !autoMatchmakingStarted && !currentPlayer && user) {
      console.log('Auto-starting matchmaking from dashboard intent');

      // Prepare player data from authenticated user
      const playerData = {
        playerId: user.id || `player_${Math.random().toString(36).substr(2, 9)}`,
        username: user.displayName || user.email?.split('@')[0] || 'Guest',
        rating: user.rating || 1000,
        level: user.level?.name || 'Principiante',
        mode: mode || 'ranked'
      };

      // Start matchmaking automatically
      startMatchmaking(playerData);
      setAutoMatchmakingStarted(true);

      // Save session for recovery
      localStorage.setItem('skemino_matchmaking_session', JSON.stringify({
        playerData,
        intent,
        mode,
        timestamp: Date.now()
      }));
    }
  }, [location.search, connected, autoMatchmakingStarted, currentPlayer, startMatchmaking, user]);

  // Session recovery on reconnect
  useEffect(() => {
    if (connected && !currentPlayer && !autoMatchmakingStarted) {
      const session = localStorage.getItem('skemino_matchmaking_session');
      if (session) {
        try {
          const sessionData = JSON.parse(session);
          const sessionAge = Date.now() - sessionData.timestamp;

          // Resume if session is less than 5 minutes old
          if (sessionAge < 5 * 60 * 1000) {
            console.log('Resuming matchmaking from saved session');
            startMatchmaking(sessionData.playerData);
            setAutoMatchmakingStarted(true);
          } else {
            // Clear expired session
            localStorage.removeItem('skemino_matchmaking_session');
          }
        } catch (error) {
          console.error('Error recovering matchmaking session:', error);
          localStorage.removeItem('skemino_matchmaking_session');
        }
      }
    }
  }, [connected, currentPlayer, autoMatchmakingStarted, startMatchmaking]);

  // Clean up session when match is found
  useEffect(() => {
    if (opponent) {
      localStorage.removeItem('skemino_matchmaking_session');
    }
  }, [opponent]);

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

              {/* Matchmaking button - pass autoMatchmakingStarted to control state */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8, duration: 0.4 }}
              >
                <MatchmakingButton
                  className="mb-8"
                  autoStart={autoMatchmakingStarted}
                />
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