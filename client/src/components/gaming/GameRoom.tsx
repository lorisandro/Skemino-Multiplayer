import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GameInterface } from './GameInterface';
import { useSocket } from '../../hooks/useSocket';
import { useGameStore } from '../../store/gameStore';
import { useAuthContext } from '../../contexts/AuthContext';

interface LocationState {
  matchData?: {
    gameId: string;
    color: 'white' | 'black';
    opponent: {
      userId: string;
      username: string;
      rating: number;
      isGuest?: boolean;
    };
    timeControl: string;
  };
  fromMatchmaking?: boolean;
}

export const GameRoom: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const { connected, socket, joinGame, leaveGame } = useSocket();
  const { gameState, currentPlayer, opponent, setPlayers, setGameState } = useGameStore();
  const [isJoining, setIsJoining] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get match data from navigation state or reconstruct from params
  const locationState = location.state as LocationState;
  const matchData = locationState?.matchData;
  const fromMatchmaking = locationState?.fromMatchmaking;

  useEffect(() => {
    if (!roomId) {
      console.error('No room ID provided');
      setError('Invalid game room');
      return;
    }

    // Convert URL-safe ID back to original format (game-123456789 -> game/123456789)
    const gameId = roomId.replace('-', '/');
    console.log(`🎮 Entering game room: ${gameId}`);

    // If we have match data from navigation, set up players immediately
    if (matchData && fromMatchmaking) {
      console.log('📦 Setting up game from matchmaking data:', matchData);

      // Set up current player
      const currentPlayerData = {
        id: user?.id || `player_${Math.random().toString(36).substr(2, 9)}`,
        username: user?.displayName || user?.email?.split('@')[0] || 'You',
        rating: user?.rating || 1000,
        color: matchData.color,
        level: user?.level?.name || 'Principiante'
      };

      // Set up opponent
      const opponentData = {
        id: matchData.opponent.userId,
        username: matchData.opponent.username,
        rating: matchData.opponent.rating,
        color: matchData.color === 'white' ? 'black' : 'white',
        level: 'Unknown' // We'll get this from server
      };

      setPlayers(currentPlayerData, opponentData);
    }

    // Join the game room via WebSocket
    const joinGameRoom = async () => {
      if (!connected || !socket) {
        console.log('⏳ Waiting for socket connection...');
        return;
      }

      try {
        setIsJoining(true);
        console.log(`🚪 Joining game room: ${gameId}`);

        // Join the specific game room
        joinGame(gameId);

        // Listen for game state updates
        socket.on('game:state', (state: any) => {
          console.log('📊 Received game state:', state);
          setGameState(state);
          setIsJoining(false);
        });

        // Listen for game errors
        socket.on('game:error', (error: { message: string }) => {
          console.error('❌ Game error:', error);
          setError(error.message);
          setIsJoining(false);
        });

        // Request initial game state
        socket.emit('game:request-state', { gameId });

      } catch (err) {
        console.error('Failed to join game room:', err);
        setError('Failed to join game room');
        setIsJoining(false);
      }
    };

    // Join game room when socket is ready
    if (connected && socket) {
      joinGameRoom();
    }

    // Cleanup on unmount
    return () => {
      if (socket) {
        console.log(`🚪 Leaving game room: ${gameId}`);
        leaveGame();
        socket.off('game:state');
        socket.off('game:error');
      }
    };
  }, [roomId, connected, socket, matchData, fromMatchmaking, user]);

  // Handle connection status
  useEffect(() => {
    if (connected) {
      console.log('✅ Socket connected in game room');
    } else {
      console.log('⚠️ Socket disconnected in game room');
    }
  }, [connected]);

  // Show loading state while joining
  if (isJoining) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">Joining Game Room</h2>
          <p className="text-gray-400">Setting up your game...</p>
        </motion.div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <motion.div
          className="text-center max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-red-400 mb-4">Game Room Error</h2>
            <p className="text-white mb-6">{error}</p>
            <button
              onClick={() => navigate('/game')}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
            >
              Back to Matchmaking
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // Show game interface when ready
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen"
    >
      <GameInterface />

      {/* Room Info Overlay (development) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed top-4 left-4 bg-black/50 backdrop-blur-sm rounded-lg p-3 text-xs text-gray-300">
          <div>Room: {roomId}</div>
          <div>Connected: {connected ? '✅' : '❌'}</div>
          <div>Color: {currentPlayer?.color || 'Unknown'}</div>
        </div>
      )}
    </motion.div>
  );
};