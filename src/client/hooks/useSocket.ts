import { useEffect, useState, useCallback, useRef } from 'react';
import { SocketClient, SocketClientManager, SocketEvents, ConnectionStatus } from '../services/SocketClient';
import { GameState, Move, PlayerColor } from '../../shared/types/GameTypes';

export interface UseSocketOptions {
  autoConnect?: boolean;
  onConnectionChange?: (connected: boolean) => void;
  onLatencyChange?: (latency: number) => void;
  onError?: (error: { code: string; message: string }) => void;
}

export interface SocketState {
  connected: boolean;
  connecting: boolean;
  authenticated: boolean;
  latency: number;
  reconnectionAttempts: number;
}

export interface GameEvents {
  onGameState?: (gameState: GameState) => void;
  onMoveValidated?: (move: Move) => void;
  onMoveInvalid?: (reason: string) => void;
  onGameEnded?: (result: { result: string; winner?: PlayerColor; victoryCondition?: string; psn: string }) => void;
  onPlayerJoined?: (data: { userId: string; username: string }) => void;
  onPlayerOffline?: (data: { userId: string; username: string }) => void;
  onPlayerReconnected?: (playerId: string) => void;
  onTimeUpdate?: (timeData: { white: number; black: number }) => void;
  onDrawOffered?: (data: { fromPlayer: string; username: string }) => void;
  onDrawAccepted?: () => void;
  onDrawDeclined?: (data: { fromPlayer: string }) => void;
}

export interface MatchmakingEvents {
  onMatchmakingQueued?: (data: { timeControl: string }) => void;
  onMatchFound?: (data: { gameId: string; color: PlayerColor; opponent: any }) => void;
  onMatchDeclined?: (gameId: string) => void;
}

export function useSocket(
  authToken: string,
  options: UseSocketOptions = {},
  gameEvents: GameEvents = {},
  matchmakingEvents: MatchmakingEvents = {}
) {
  const [socketState, setSocketState] = useState<SocketState>({
    connected: false,
    connecting: false,
    authenticated: false,
    latency: 0,
    reconnectionAttempts: 0
  });

  const [currentGame, setCurrentGame] = useState<GameState | null>(null);
  const [inMatchmaking, setInMatchmaking] = useState(false);
  const [errors, setErrors] = useState<Array<{ code: string; message: string; timestamp: number }>>([]);

  const socketRef = useRef<SocketClient | null>(null);
  const eventsSetupRef = useRef(false);

  // Initialize socket client
  useEffect(() => {
    if (!authToken) return;

    try {
      const client = SocketClientManager.initialize(authToken);
      socketRef.current = client;

      if (options.autoConnect !== false) {
        client.connect().catch(error => {
          console.error('Failed to connect to socket:', error);
          addError('CONNECTION_FAILED', error.message);
        });
      }

      return () => {
        SocketClientManager.disconnect();
        socketRef.current = null;
      };
    } catch (error) {
      console.error('Failed to initialize socket:', error);
      addError('INITIALIZATION_FAILED', error instanceof Error ? error.message : 'Unknown error');
    }
  }, [authToken, options.autoConnect]);

  // Add error to state
  const addError = useCallback((code: string, message: string) => {
    const error = { code, message, timestamp: Date.now() };
    setErrors(prev => [...prev.slice(-9), error]); // Keep last 10 errors
    options.onError?.(error);
  }, [options]);

  // Setup event listeners
  useEffect(() => {
    const client = socketRef.current;
    if (!client || eventsSetupRef.current) return;

    // Connection events
    client.on('connect', () => {
      setSocketState(prev => ({
        ...prev,
        connected: true,
        connecting: false,
        authenticated: true,
        reconnectionAttempts: 0
      }));
      options.onConnectionChange?.(true);
    });

    client.on('disconnect', () => {
      setSocketState(prev => ({
        ...prev,
        connected: false,
        authenticated: false
      }));
      options.onConnectionChange?.(false);
    });

    client.on('reconnect', () => {
      setSocketState(prev => ({
        ...prev,
        connected: true,
        authenticated: true,
        reconnectionAttempts: 0
      }));
    });

    client.on('connect_error', (error: Error) => {
      setSocketState(prev => ({
        ...prev,
        connecting: false,
        reconnectionAttempts: prev.reconnectionAttempts + 1
      }));
      addError('CONNECTION_ERROR', error.message);
    });

    client.on('pong', () => {
      const latency = client.getCurrentLatency();
      setSocketState(prev => ({ ...prev, latency }));
      options.onLatencyChange?.(latency);
    });

    // Error handling
    client.on('error', (error: { code: string; message: string }) => {
      addError(error.code, error.message);
    });

    // Game events
    client.on('game:state', (gameState: GameState) => {
      setCurrentGame(gameState);
      gameEvents.onGameState?.(gameState);
    });

    client.on('move:validated', (move: Move) => {
      gameEvents.onMoveValidated?.(move);
    });

    client.on('move:invalid', (reason: string) => {
      gameEvents.onMoveInvalid?.(reason);
    });

    client.on('game:ended', (result) => {
      setCurrentGame(null);
      gameEvents.onGameEnded?.(result);
    });

    client.on('player:joined', gameEvents.onPlayerJoined || (() => {}));
    client.on('player:offline', gameEvents.onPlayerOffline || (() => {}));
    client.on('player:reconnected', gameEvents.onPlayerReconnected || (() => {}));
    client.on('time:update', gameEvents.onTimeUpdate || (() => {}));
    client.on('game:draw-offered', gameEvents.onDrawOffered || (() => {}));
    client.on('game:draw-accepted', gameEvents.onDrawAccepted || (() => {}));
    client.on('game:draw-declined', gameEvents.onDrawDeclined || (() => {}));

    // Matchmaking events
    client.on('matchmaking:queued', (data) => {
      setInMatchmaking(true);
      matchmakingEvents.onMatchmakingQueued?.(data);
    });

    client.on('match:found', (data) => {
      setInMatchmaking(false);
      matchmakingEvents.onMatchFound?.(data);
    });

    client.on('match:declined', (gameId) => {
      setInMatchmaking(false);
      matchmakingEvents.onMatchDeclined?.(gameId);
    });

    eventsSetupRef.current = true;

    return () => {
      eventsSetupRef.current = false;
    };
  }, [options, gameEvents, matchmakingEvents, addError]);

  // Socket actions
  const actions = {
    // Connection management
    connect: useCallback(async () => {
      if (!socketRef.current) return false;

      try {
        setSocketState(prev => ({ ...prev, connecting: true }));
        await socketRef.current.connect();
        return true;
      } catch (error) {
        setSocketState(prev => ({ ...prev, connecting: false }));
        addError('MANUAL_CONNECTION_FAILED', error instanceof Error ? error.message : 'Unknown error');
        return false;
      }
    }, [addError]),

    disconnect: useCallback(() => {
      socketRef.current?.disconnect();
    }, []),

    forceReconnect: useCallback(() => {
      socketRef.current?.forceReconnect();
    }, []),

    // Matchmaking actions
    joinMatchmaking: useCallback((timeControl: string = 'rapid') => {
      try {
        socketRef.current?.joinMatchmaking(timeControl);
        setInMatchmaking(true);
      } catch (error) {
        addError('MATCHMAKING_JOIN_FAILED', error instanceof Error ? error.message : 'Unknown error');
      }
    }, [addError]),

    leaveMatchmaking: useCallback(() => {
      socketRef.current?.leaveMatchmaking();
      setInMatchmaking(false);
    }, []),

    // Game actions
    joinGame: useCallback((gameId: string) => {
      try {
        socketRef.current?.joinGame(gameId);
      } catch (error) {
        addError('JOIN_GAME_FAILED', error instanceof Error ? error.message : 'Unknown error');
      }
    }, [addError]),

    makeMove: useCallback((move: Move) => {
      try {
        socketRef.current?.makeMove(move);
      } catch (error) {
        addError('MAKE_MOVE_FAILED', error instanceof Error ? error.message : 'Unknown error');
      }
    }, [addError]),

    resignGame: useCallback(() => {
      socketRef.current?.resignGame();
      setCurrentGame(null);
    }, []),

    offerDraw: useCallback(() => {
      socketRef.current?.offerDraw();
    }, []),

    acceptDraw: useCallback(() => {
      socketRef.current?.acceptDraw();
    }, []),

    declineDraw: useCallback(() => {
      socketRef.current?.declineDraw();
    }, []),

    // Utility actions
    updateAuthToken: useCallback((newToken: string) => {
      socketRef.current?.updateAuthToken(newToken);
    }, []),

    clearErrors: useCallback(() => {
      setErrors([]);
    }, []),

    getDebugInfo: useCallback(() => {
      return socketRef.current?.getDebugInfo() || null;
    }, [])
  };

  // Computed values
  const isConnected = socketState.connected;
  const isConnecting = socketState.connecting;
  const latency = socketState.latency;
  const hasErrors = errors.length > 0;
  const lastError = errors[errors.length - 1] || null;
  const isInGame = currentGame !== null;
  const connectionQuality = latency < 50 ? 'excellent' : latency < 100 ? 'good' : latency < 200 ? 'fair' : 'poor';

  return {
    // State
    socketState,
    currentGame,
    inMatchmaking,
    errors,

    // Computed values
    isConnected,
    isConnecting,
    latency,
    hasErrors,
    lastError,
    isInGame,
    connectionQuality,

    // Actions
    ...actions
  };
}

// Specialized hook for game-only functionality
export function useGameSocket(
  authToken: string,
  gameEvents: GameEvents = {},
  options: UseSocketOptions = {}
) {
  const socket = useSocket(authToken, options, gameEvents);

  // Game-specific computed values
  const isMyTurn = socket.currentGame ?
    (socket.currentGame.currentTurn === 'white' && socket.currentGame.players.white.id === authToken) ||
    (socket.currentGame.currentTurn === 'black' && socket.currentGame.players.black.id === authToken)
    : false;

  const myColor: PlayerColor | null = socket.currentGame ?
    socket.currentGame.players.white.id === authToken ? 'white' :
    socket.currentGame.players.black.id === authToken ? 'black' : null
    : null;

  const opponent = socket.currentGame && myColor ?
    socket.currentGame.players[myColor === 'white' ? 'black' : 'white']
    : null;

  const gameStatus = socket.currentGame?.status || null;
  const canMakeMove = isMyTurn && gameStatus === 'active';

  return {
    ...socket,

    // Game-specific state
    isMyTurn,
    myColor,
    opponent,
    gameStatus,
    canMakeMove,

    // Game-specific actions (no matchmaking)
    joinGame: socket.joinGame,
    makeMove: socket.makeMove,
    resignGame: socket.resignGame,
    offerDraw: socket.offerDraw,
    acceptDraw: socket.acceptDraw,
    declineDraw: socket.declineDraw
  };
}

// Specialized hook for matchmaking-only functionality
export function useMatchmakingSocket(
  authToken: string,
  matchmakingEvents: MatchmakingEvents = {},
  options: UseSocketOptions = {}
) {
  const socket = useSocket(authToken, options, {}, matchmakingEvents);

  return {
    // Connection state
    isConnected: socket.isConnected,
    isConnecting: socket.isConnecting,
    connectionQuality: socket.connectionQuality,
    latency: socket.latency,

    // Matchmaking state
    inMatchmaking: socket.inMatchmaking,

    // Error handling
    errors: socket.errors,
    hasErrors: socket.hasErrors,
    lastError: socket.lastError,
    clearErrors: socket.clearErrors,

    // Matchmaking actions
    joinMatchmaking: socket.joinMatchmaking,
    leaveMatchmaking: socket.leaveMatchmaking,

    // Connection management
    connect: socket.connect,
    disconnect: socket.disconnect,
    forceReconnect: socket.forceReconnect
  };
}

export default useSocket;