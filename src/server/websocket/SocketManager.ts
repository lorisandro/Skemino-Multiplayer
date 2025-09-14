import { Server as SocketIOServer, Socket } from 'socket.io';
import { GameRoom } from './GameRoom';
import { MatchmakingManager } from './MatchmakingManager';
import { RedisManager } from '../services/RedisManager';
import { DatabaseManager } from '../database/DatabaseManager';
import { logger } from '../utils/logger';
import { getGuestUser } from '../routes/auth';
import jwt from 'jsonwebtoken';
import {
  GameState,
  Move,
  PlayerColor,
  GameStatus
} from '../../shared/types/GameTypes';

export interface AuthenticatedSocket extends Socket {
  userId: string;
  username: string;
  rating: number;
  isGuest: boolean;
  gameRoomId?: string;
}

interface PlayerConnection {
  socket: AuthenticatedSocket;
  status: 'online' | 'ingame' | 'disconnected';
  lastPing: number;
  gameRoomId?: string;
  reconnectionAttempts: number;
}

export interface WebSocketEvents {
  // Authentication
  'auth:login': (token: string) => void;
  'auth:logout': () => void;

  // Matchmaking
  'matchmaking:join': (timeControl?: string) => void;
  'matchmaking:join-guest': (options: { timeControl: string; guestRating: number; preferences?: any }) => void;
  'matchmaking:leave': () => void;
  'matchmaking:leave-guest': () => void;
  'match:found': (gameId: string, opponent: any) => void;
  'match:declined': (gameId: string) => void;

  // Game events
  'game:join': (gameId: string) => void;
  'game:leave': (gameId: string) => void;
  'game:state': (gameState: GameState) => void;
  'game:move': (move: Move) => void;
  'game:move-result': (result: { success: boolean; error?: string; gameState?: GameState }) => void;
  'game:resign': () => void;
  'game:offer-draw': () => void;
  'game:accept-draw': () => void;
  'game:decline-draw': () => void;
  'game:ended': (result: any) => void;

  // Player presence
  'player:online': (playerId: string) => void;
  'player:offline': (playerId: string) => void;
  'player:reconnected': (playerId: string) => void;

  // Real-time updates
  'time:update': (timeData: { white: number; black: number }) => void;
  'move:validated': (move: Move) => void;
  'move:invalid': (reason: string) => void;

  // Error handling
  'error': (error: { code: string; message: string }) => void;
  'disconnect': () => void;
  'reconnect': () => void;
}

export class SocketManager {
  private io: SocketIOServer;
  private connections: Map<string, PlayerConnection> = new Map();
  private gameRooms: Map<string, GameRoom> = new Map();
  private matchmakingManager: MatchmakingManager;
  private readonly PING_INTERVAL = 5000; // 5 seconds
  private readonly PING_TIMEOUT = 15000; // 15 seconds
  private readonly MAX_RECONNECTION_ATTEMPTS = 3;

  constructor(io: SocketIOServer) {
    this.io = io;
    this.matchmakingManager = new MatchmakingManager();
  }

  public initialize(): void {
    this.io.use(this.authenticateSocket.bind(this));
    this.io.on('connection', this.handleConnection.bind(this));
    this.startHealthCheck();
    logger.info('🎮 WebSocket Manager initialized with real-time gaming support');
  }

  private async authenticateSocket(socket: Socket, next: (err?: Error) => void): Promise<void> {
    try {
      const token = socket.handshake.auth.token || socket.handshake.headers.authorization;
      const isGuest = socket.handshake.auth.isGuest;

      if (!token) {
        return next(new Error('Authentication required'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;

      if (decoded.isGuest || isGuest) {
        // Handle guest authentication
        const guestUser = getGuestUser(decoded.userId);
        if (!guestUser) {
          return next(new Error('Guest session not found or expired'));
        }

        (socket as AuthenticatedSocket).userId = guestUser.id;
        (socket as AuthenticatedSocket).username = guestUser.username;
        (socket as AuthenticatedSocket).rating = guestUser.rating;
        (socket as AuthenticatedSocket).isGuest = true;

        logger.info(`🎭 Guest authenticated: ${guestUser.username} (${guestUser.id})`);
      } else {
        // Handle registered user authentication
        const user = await DatabaseManager.getUserById(decoded.userId);
        if (!user) {
          return next(new Error('User not found'));
        }

        (socket as AuthenticatedSocket).userId = user.id;
        (socket as AuthenticatedSocket).username = user.username;
        (socket as AuthenticatedSocket).rating = user.rating;
        (socket as AuthenticatedSocket).isGuest = false;

        logger.info(`🔐 User authenticated: ${user.username} (${user.id})`);
      }

      next();
    } catch (error) {
      logger.error('Socket authentication failed:', error);
      next(new Error('Invalid token'));
    }
  }

  private handleConnection(socket: AuthenticatedSocket): void {
    const playerId = socket.userId;
    logger.info(`🔌 Player ${socket.username} connected (ID: ${playerId})`);

    // Handle reconnection
    const existingConnection = this.connections.get(playerId);
    if (existingConnection && existingConnection.status === 'disconnected') {
      this.handleReconnection(socket, existingConnection);
    } else {
      this.createNewConnection(socket);
    }

    this.setupSocketEventHandlers(socket);
    this.notifyPlayerOnline(socket);
  }

  private createNewConnection(socket: AuthenticatedSocket): void {
    const connection: PlayerConnection = {
      socket,
      status: 'online',
      lastPing: Date.now(),
      reconnectionAttempts: 0
    };

    this.connections.set(socket.userId, connection);

    // Join personal room for targeted events
    socket.join(`user:${socket.userId}`);
  }

  private handleReconnection(socket: AuthenticatedSocket, existingConnection: PlayerConnection): void {
    logger.info(`🔄 Player ${socket.username} reconnected`);

    existingConnection.socket = socket;
    existingConnection.status = existingConnection.gameRoomId ? 'ingame' : 'online';
    existingConnection.lastPing = Date.now();
    existingConnection.reconnectionAttempts = 0;

    socket.join(`user:${socket.userId}`);

    // Rejoin game room if in game
    if (existingConnection.gameRoomId) {
      const gameRoom = this.gameRooms.get(existingConnection.gameRoomId);
      if (gameRoom) {
        socket.gameRoomId = existingConnection.gameRoomId;
        socket.join(existingConnection.gameRoomId);

        // Send current game state
        const gameState = gameRoom.getGameState();
        socket.emit('game:state', gameState);

        // Notify opponent of reconnection
        socket.to(existingConnection.gameRoomId).emit('player:reconnected', socket.userId);
      }
    }

    socket.emit('reconnect', { success: true });
  }

  private setupSocketEventHandlers(socket: AuthenticatedSocket): void {
    // Matchmaking events
    socket.on('matchmaking:join', async (timeControl?: string) => {
      await this.handleJoinMatchmaking(socket, timeControl);
    });

    socket.on('matchmaking:join-guest', async (options: { timeControl: string; guestRating: number; preferences?: any }) => {
      await this.handleJoinGuestMatchmaking(socket, options);
    });

    socket.on('matchmaking:leave', () => {
      this.matchmakingManager.removeFromQueue(socket.userId);
    });

    socket.on('matchmaking:leave-guest', () => {
      this.matchmakingManager.removeFromQueue(socket.userId);
    });

    // Game events
    socket.on('game:join', async (gameId: string) => {
      await this.handleJoinGame(socket, gameId);
    });

    socket.on('game:move', async (move: Move) => {
      await this.handleGameMove(socket, move);
    });

    socket.on('game:resign', () => {
      this.handleResignGame(socket);
    });

    socket.on('game:offer-draw', () => {
      this.handleOfferDraw(socket);
    });

    socket.on('game:accept-draw', () => {
      this.handleAcceptDraw(socket);
    });

    socket.on('game:decline-draw', () => {
      this.handleDeclineDraw(socket);
    });

    // Connection management
    socket.on('ping', () => {
      const connection = this.connections.get(socket.userId);
      if (connection) {
        connection.lastPing = Date.now();
      }
      socket.emit('pong');
    });

    socket.on('disconnect', (reason) => {
      this.handleDisconnection(socket, reason);
    });

    socket.on('error', (error) => {
      logger.error(`Socket error for ${socket.username}:`, error);
    });
  }

  private async handleJoinMatchmaking(socket: AuthenticatedSocket, timeControl?: string): Promise<void> {
    try {
      const connection = this.connections.get(socket.userId);
      if (!connection || connection.status === 'ingame') {
        socket.emit('error', { code: 'INVALID_STATE', message: 'Cannot join matchmaking while in game' });
        return;
      }

      const match = await this.matchmakingManager.addToQueue({
        userId: socket.userId,
        username: socket.username,
        rating: socket.rating,
        timeControl: timeControl || 'rapid'
      });

      if (match) {
        // Match found immediately
        await this.createGameFromMatch(match);
      } else {
        socket.emit('matchmaking:queued', { timeControl });
      }
    } catch (error) {
      logger.error('Error joining matchmaking:', error);
      socket.emit('error', { code: 'MATCHMAKING_ERROR', message: 'Failed to join matchmaking' });
    }
  }

  private async handleJoinGuestMatchmaking(
    socket: AuthenticatedSocket,
    options: { timeControl: string; guestRating: number; preferences?: any }
  ): Promise<void> {
    try {
      const connection = this.connections.get(socket.userId);
      if (!connection || connection.status === 'ingame') {
        socket.emit('error', { code: 'INVALID_STATE', message: 'Cannot join matchmaking while in game' });
        return;
      }

      if (!socket.isGuest) {
        socket.emit('error', { code: 'INVALID_REQUEST', message: 'Guest matchmaking only for guest users' });
        return;
      }

      const match = await this.matchmakingManager.addToQueue({
        userId: socket.userId,
        username: socket.username,
        rating: options.guestRating || socket.rating,
        timeControl: options.timeControl,
        preferences: {
          ...options.preferences,
          maxRatingDifference: options.preferences?.maxRatingDifference || 400, // More flexible for guests
        }
      });

      if (match) {
        // Match found immediately
        await this.createGameFromMatch(match);
      } else {
        socket.emit('matchmaking:guest-queued', {
          timeControl: options.timeControl,
          isGuest: true
        });
      }

      logger.info(`🎭 Guest ${socket.username} joined ${options.timeControl} matchmaking queue`);
    } catch (error) {
      logger.error('Error joining guest matchmaking:', error);
      socket.emit('matchmaking:guest-error', {
        code: 'GUEST_MATCHMAKING_ERROR',
        message: 'Failed to join guest matchmaking'
      });
    }
  }

  private async createGameFromMatch(match: any): Promise<void> {
    try {
      const gameRoom = new GameRoom(match.gameId, {
        white: match.white,
        black: match.black,
        timeControl: match.timeControl
      });

      this.gameRooms.set(match.gameId, gameRoom);

      // Notify both players
      const whiteSocket = this.getSocketByUserId(match.white.userId);
      const blackSocket = this.getSocketByUserId(match.black.userId);

      if (whiteSocket) {
        whiteSocket.gameRoomId = match.gameId;
        whiteSocket.join(match.gameId);
        this.updateConnectionStatus(whiteSocket.userId, 'ingame', match.gameId);
        whiteSocket.emit('match:found', {
          gameId: match.gameId,
          color: 'white',
          opponent: match.black
        });
      }

      if (blackSocket) {
        blackSocket.gameRoomId = match.gameId;
        blackSocket.join(match.gameId);
        this.updateConnectionStatus(blackSocket.userId, 'ingame', match.gameId);
        blackSocket.emit('match:found', {
          gameId: match.gameId,
          color: 'black',
          opponent: match.white
        });
      }

      // Start the game
      gameRoom.startGame();

      // Send initial game state
      const gameState = gameRoom.getGameState();
      this.io.to(match.gameId).emit('game:state', gameState);

      logger.info(`🎮 Game created: ${match.gameId} (${match.white.username} vs ${match.black.username})`);
    } catch (error) {
      logger.error('Error creating game from match:', error);
    }
  }

  private async handleJoinGame(socket: AuthenticatedSocket, gameId: string): Promise<void> {
    try {
      const gameRoom = this.gameRooms.get(gameId);
      if (!gameRoom) {
        socket.emit('error', { code: 'GAME_NOT_FOUND', message: 'Game not found' });
        return;
      }

      if (!gameRoom.canPlayerJoin(socket.userId)) {
        socket.emit('error', { code: 'ACCESS_DENIED', message: 'Cannot join this game' });
        return;
      }

      socket.gameRoomId = gameId;
      socket.join(gameId);
      this.updateConnectionStatus(socket.userId, 'ingame', gameId);

      // Send current game state
      const gameState = gameRoom.getGameState();
      socket.emit('game:state', gameState);

      // Notify other player
      socket.to(gameId).emit('player:joined', {
        userId: socket.userId,
        username: socket.username
      });

      logger.info(`Player ${socket.username} joined game ${gameId}`);
    } catch (error) {
      logger.error('Error joining game:', error);
      socket.emit('error', { code: 'JOIN_GAME_ERROR', message: 'Failed to join game' });
    }
  }

  private async handleGameMove(socket: AuthenticatedSocket, move: Move): Promise<void> {
    try {
      if (!socket.gameRoomId) {
        socket.emit('move:invalid', 'Not in a game');
        return;
      }

      const gameRoom = this.gameRooms.get(socket.gameRoomId);
      if (!gameRoom) {
        socket.emit('move:invalid', 'Game room not found');
        return;
      }

      // Validate move timing and player turn
      if (!gameRoom.canPlayerMove(socket.userId)) {
        socket.emit('move:invalid', 'Not your turn or game not active');
        return;
      }

      // Apply move through game room (server-authoritative)
      const result = await gameRoom.applyMove(move, socket.userId);

      if (result.success) {
        // Broadcast validated move to both players
        this.io.to(socket.gameRoomId).emit('move:validated', result.move);
        this.io.to(socket.gameRoomId).emit('game:state', result.gameState);

        // Check if game ended
        if (result.gameState.status === 'completed') {
          await this.handleGameEnd(socket.gameRoomId, result.gameState);
        }

        socket.emit('game:move-result', { success: true, gameState: result.gameState });
      } else {
        socket.emit('game:move-result', { success: false, error: result.error });
        socket.emit('move:invalid', result.error);
      }
    } catch (error) {
      logger.error('Error handling game move:', error);
      socket.emit('game:move-result', { success: false, error: 'Internal server error' });
    }
  }

  private handleResignGame(socket: AuthenticatedSocket): void {
    if (!socket.gameRoomId) return;

    const gameRoom = this.gameRooms.get(socket.gameRoomId);
    if (!gameRoom) return;

    gameRoom.resignGame(socket.userId);
    const gameState = gameRoom.getGameState();

    this.io.to(socket.gameRoomId).emit('game:state', gameState);
    this.handleGameEnd(socket.gameRoomId, gameState);
  }

  private handleOfferDraw(socket: AuthenticatedSocket): void {
    if (!socket.gameRoomId) return;

    socket.to(socket.gameRoomId).emit('game:draw-offered', {
      fromPlayer: socket.userId,
      username: socket.username
    });
  }

  private handleAcceptDraw(socket: AuthenticatedSocket): void {
    if (!socket.gameRoomId) return;

    const gameRoom = this.gameRooms.get(socket.gameRoomId);
    if (!gameRoom) return;

    gameRoom.acceptDraw();
    const gameState = gameRoom.getGameState();

    this.io.to(socket.gameRoomId).emit('game:state', gameState);
    this.handleGameEnd(socket.gameRoomId, gameState);
  }

  private handleDeclineDraw(socket: AuthenticatedSocket): void {
    if (!socket.gameRoomId) return;

    socket.to(socket.gameRoomId).emit('game:draw-declined', {
      fromPlayer: socket.userId
    });
  }

  private async handleGameEnd(gameRoomId: string, gameState: GameState): Promise<void> {
    try {
      const gameRoom = this.gameRooms.get(gameRoomId);
      if (!gameRoom) return;

      // Save game to database
      await gameRoom.saveGameToDatabase();

      // Update player ratings
      await gameRoom.updatePlayerRatings();

      // Notify players
      this.io.to(gameRoomId).emit('game:ended', {
        result: gameState.winner ?
          (gameState.winner === 'white' ? '1-0' : '0-1') : '1/2-1/2',
        winner: gameState.winner,
        victoryCondition: gameState.victoryCondition,
        psn: gameRoom.generatePSN()
      });

      // Clean up connections
      const players = gameRoom.getPlayers();
      players.forEach(playerId => {
        const socket = this.getSocketByUserId(playerId);
        if (socket) {
          socket.leave(gameRoomId);
          socket.gameRoomId = undefined;
          this.updateConnectionStatus(playerId, 'online');
        }
      });

      // Remove game room after delay to allow final data sync
      setTimeout(() => {
        this.gameRooms.delete(gameRoomId);
      }, 5000);

      logger.info(`🏁 Game ${gameRoomId} ended: ${gameState.winner || 'draw'}`);
    } catch (error) {
      logger.error('Error handling game end:', error);
    }
  }

  private handleDisconnection(socket: AuthenticatedSocket, reason: string): void {
    logger.info(`🔌 Player ${socket.username} disconnected: ${reason}`);

    const connection = this.connections.get(socket.userId);
    if (!connection) return;

    connection.status = 'disconnected';
    connection.lastPing = Date.now();

    // If player is in a game, start disconnect timer
    if (socket.gameRoomId) {
      const gameRoom = this.gameRooms.get(socket.gameRoomId);
      if (gameRoom && gameRoom.isActive()) {
        gameRoom.handlePlayerDisconnection(socket.userId);

        // Notify opponent
        socket.to(socket.gameRoomId).emit('player:offline', socket.userId);

        // Start reconnection timer
        setTimeout(() => {
          this.handleReconnectionTimeout(socket.userId);
        }, 30000); // 30 seconds to reconnect
      }
    }

    this.notifyPlayerOffline(socket);
  }

  private handleReconnectionTimeout(playerId: string): void {
    const connection = this.connections.get(playerId);
    if (!connection || connection.status !== 'disconnected') return;

    connection.reconnectionAttempts++;

    if (connection.reconnectionAttempts >= this.MAX_RECONNECTION_ATTEMPTS) {
      // Auto-resign from game
      if (connection.gameRoomId) {
        const gameRoom = this.gameRooms.get(connection.gameRoomId);
        if (gameRoom && gameRoom.isActive()) {
          gameRoom.resignGame(playerId);
          const gameState = gameRoom.getGameState();

          this.io.to(connection.gameRoomId).emit('game:state', gameState);
          this.handleGameEnd(connection.gameRoomId, gameState);
        }
      }

      // Remove connection
      this.connections.delete(playerId);
    }
  }

  private getSocketByUserId(userId: string): AuthenticatedSocket | null {
    const connection = this.connections.get(userId);
    return connection?.status !== 'disconnected' ? connection.socket : null;
  }

  private updateConnectionStatus(userId: string, status: PlayerConnection['status'], gameRoomId?: string): void {
    const connection = this.connections.get(userId);
    if (connection) {
      connection.status = status;
      connection.gameRoomId = gameRoomId;
    }
  }

  private notifyPlayerOnline(socket: AuthenticatedSocket): void {
    socket.broadcast.emit('player:online', {
      userId: socket.userId,
      username: socket.username,
      rating: socket.rating
    });
  }

  private notifyPlayerOffline(socket: AuthenticatedSocket): void {
    socket.broadcast.emit('player:offline', {
      userId: socket.userId,
      username: socket.username
    });
  }

  private startHealthCheck(): void {
    setInterval(() => {
      const now = Date.now();
      const staleConnections: string[] = [];

      this.connections.forEach((connection, userId) => {
        if (now - connection.lastPing > this.PING_TIMEOUT) {
          staleConnections.push(userId);
        }
      });

      // Clean up stale connections
      staleConnections.forEach(userId => {
        const connection = this.connections.get(userId);
        if (connection) {
          connection.socket.disconnect();
          this.connections.delete(userId);
        }
      });

      logger.debug(`🏥 Health check: ${this.connections.size} active connections, ${staleConnections.length} stale removed`);
    }, this.PING_INTERVAL);
  }

  // Public methods for external access
  public getActiveConnections(): number {
    return this.connections.size;
  }

  public getActiveGames(): number {
    return this.gameRooms.size;
  }

  public getPlayerStatus(userId: string): PlayerConnection['status'] | null {
    return this.connections.get(userId)?.status || null;
  }

  public forceDisconnect(userId: string): boolean {
    const connection = this.connections.get(userId);
    if (connection) {
      connection.socket.disconnect();
      this.connections.delete(userId);
      return true;
    }
    return false;
  }
}

// Rename the class to match the import in index.ts
export { SocketManager as WebSocketManager };