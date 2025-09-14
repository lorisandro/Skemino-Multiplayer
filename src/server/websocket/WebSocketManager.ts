import { Server as HTTPServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';

interface GameRoom {
  id: string;
  players: Array<{
    socketId: string;
    playerId: string;
    username: string;
    rating: number;
    color: 'white' | 'black';
  }>;
  status: 'waiting' | 'matchmaking' | 'distributing' | 'active' | 'finished';
  gameState?: any;
  createdAt: number;
}

export class WebSocketManager {
  private io: SocketIOServer;
  private gameRooms: Map<string, GameRoom> = new Map();
  private playerSockets: Map<string, string> = new Map(); // socketId -> playerId

  constructor(server: HTTPServer) {
    this.io = new SocketIOServer(server, {
      cors: {
        origin: ['http://localhost:5173', 'http://localhost:3001', 'http://localhost:3007'],
        methods: ['GET', 'POST'],
        credentials: true
      },
      // Gaming-optimized WebSocket settings per skemino-realtime-specialist
      pingTimeout: 60000,
      pingInterval: 25000,
      upgradeTimeout: 30000,
      allowUpgrades: true
    });

    this.setupEventHandlers();
  }

  private setupEventHandlers() {
    this.io.on('connection', (socket) => {
      console.log('New client connected:', socket.id);

      // Real-time gaming connection setup
      socket.emit('connection:established', {
        socketId: socket.id,
        timestamp: Date.now(),
        serverTime: new Date().toISOString()
      });

      // Matchmaking events
      socket.on('matchmaking:start', (data: { playerId: string; username: string; rating: number; gameMode?: string }) => {
        this.handleMatchmakingStart(socket, data);
      });

      socket.on('matchmaking:cancel', () => {
        this.handleMatchmakingCancel(socket);
      });

      // Game lifecycle events
      socket.on('game:join', (data: { roomId: string; playerId?: string }) => {
        this.handleGameJoin(socket, data);
      });

      socket.on('game:leave', (data: { roomId: string }) => {
        this.handleGameLeave(socket, data);
      });

      socket.on('game:ready', (data: { roomId: string }) => {
        this.handlePlayerReady(socket, data);
      });

      // Real-time gaming events
      socket.on('move:make', (data: any) => {
        this.handleMove(socket, data);
      });

      socket.on('game:resign', () => {
        this.handleResign(socket);
      });

      socket.on('draw:offer', () => {
        this.handleDrawOffer(socket);
      });

      socket.on('draw:response', (data: { accept: boolean }) => {
        this.handleDrawResponse(socket, data);
      });

      // Connection health monitoring
      socket.on('ping', () => {
        socket.emit('pong', { timestamp: Date.now() });
      });

      // Disconnection handling
      socket.on('disconnect', (reason) => {
        console.log(`Client disconnected: ${socket.id}, reason: ${reason}`);
        this.handleDisconnection(socket, reason);
      });
    });
  }

  private handleMatchmakingStart(socket: any, data: { playerId: string; username: string; rating: number; gameMode?: string }) {
    console.log(`Matchmaking started for player ${data.playerId}`);

    // Store player socket mapping
    this.playerSockets.set(socket.id, data.playerId);

    // Simple matchmaking logic (da migliorare con rating-based matching)
    const waitingPlayers = Array.from(this.gameRooms.values())
      .filter(room => room.status === 'waiting' && room.players.length === 1);

    if (waitingPlayers.length > 0) {
      // Match found - join existing game
      const gameRoom = waitingPlayers[0];
      this.addPlayerToRoom(socket, gameRoom, data, 'black');

      // Trigger game start sequence
      this.startGameSequence(gameRoom.id);
    } else {
      // Create new game room and wait
      const roomId = this.generateGameId();
      const newRoom: GameRoom = {
        id: roomId,
        players: [],
        status: 'waiting',
        createdAt: Date.now()
      };

      this.gameRooms.set(roomId, newRoom);
      this.addPlayerToRoom(socket, newRoom, data, 'white');

      socket.emit('matchmaking:waiting', {
        roomId,
        position: 1,
        estimatedWait: 30000 // 30 seconds estimate
      });
    }
  }

  private addPlayerToRoom(socket: any, room: GameRoom, playerData: any, color: 'white' | 'black') {
    const player = {
      socketId: socket.id,
      playerId: playerData.playerId,
      username: playerData.username,
      rating: playerData.rating,
      color
    };

    room.players.push(player);
    socket.join(`game:${room.id}`);

    console.log(`Player ${playerData.username} joined room ${room.id} as ${color}`);
  }

  private async startGameSequence(roomId: string) {
    const room = this.gameRooms.get(roomId);
    if (!room || room.players.length !== 2) return;

    console.log(`Starting game sequence for room ${roomId}`);

    // Step 1: Match found notification
    room.status = 'matchmaking';
    this.io.to(`game:${roomId}`).emit('game:found', {
      roomId,
      players: room.players.map(p => ({
        username: p.username,
        rating: p.rating,
        color: p.color
      })),
      timestamp: Date.now()
    });

    // Small delay for UI acknowledgment
    await this.delay(500);

    // Step 2: Game starting notification
    this.io.to(`game:${roomId}`).emit('game:starting', {
      roomId,
      message: 'Preparing game...',
      timestamp: Date.now()
    });

    await this.delay(300);

    // Step 3: Start card distribution sequence
    await this.startCardDistribution(roomId);
  }

  private async startCardDistribution(roomId: string) {
    const room = this.gameRooms.get(roomId);
    if (!room) return;

    console.log(`Starting card distribution for room ${roomId}`);

    room.status = 'distributing';

    // Generate game cards (5 per player)
    const gameCards = this.generateGameCards();

    // Initial distribution notification
    this.io.to(`game:${roomId}`).emit('cards:distribution-start', {
      phase: 'shuffling',
      timestamp: Date.now()
    });

    // Simulate shuffling phase (800ms per skemino-ui timing)
    await this.delay(800);

    // Start dealing phase
    this.io.to(`game:${roomId}`).emit('cards:distribution-phase', {
      phase: 'dealing',
      timestamp: Date.now()
    });

    // Deal cards with timing (200ms delay between cards per skemino-ui)
    const totalCards = 10; // 5 per player
    for (let i = 0; i < totalCards; i++) {
      const cardIndex = Math.floor(i / 2);
      const isWhiteCard = i % 2 === 0;

      // Send individual card distribution event
      this.io.to(`game:${roomId}`).emit('cards:card-dealt', {
        cardNumber: i + 1,
        totalCards: totalCards,
        player: isWhiteCard ? 'white' : 'black',
        cardIndex,
        progress: ((i + 1) / totalCards) * 100,
        timestamp: Date.now()
      });

      await this.delay(200); // 200ms between each card
    }

    // Final delay before activation
    await this.delay(500);

    // Complete distribution and activate game
    room.status = 'active';

    // Initialize game state
    const initialGameState = {
      board: new Map(),
      currentTurn: 'white',
      whiteHand: gameCards.whiteCards,
      blackHand: gameCards.blackCards,
      whiteTime: 300, // 5 minutes
      blackTime: 300,
      moveHistory: [],
      status: 'active'
    };

    room.gameState = initialGameState;

    // Send complete game state to both players
    this.io.to(`game:${roomId}`).emit('cards:distribution-complete', {
      gameState: initialGameState,
      timestamp: Date.now()
    });

    console.log(`Game ${roomId} is now active`);
  }

  private generateGameCards() {
    // Generate demo cards for now
    const suits = ['P', 'F', 'C'] as const;
    const values = ['1', '2', '3', '4', '5'] as const;

    const whiteCards = Array.from({ length: 5 }, (_, i) => ({
      id: `white-${i}`,
      suit: suits[i % 3],
      value: values[i],
      owner: 'white' as const
    }));

    const blackCards = Array.from({ length: 5 }, (_, i) => ({
      id: `black-${i}`,
      suit: suits[(i + 1) % 3],
      value: values[i],
      owner: 'black' as const
    }));

    return { whiteCards, blackCards };
  }

  private handleMatchmakingCancel(socket: any) {
    const playerId = this.playerSockets.get(socket.id);
    if (!playerId) return;

    // Remove from waiting rooms
    for (const [roomId, room] of this.gameRooms.entries()) {
      if (room.status === 'waiting' && room.players.some(p => p.socketId === socket.id)) {
        room.players = room.players.filter(p => p.socketId !== socket.id);
        if (room.players.length === 0) {
          this.gameRooms.delete(roomId);
        }
        socket.leave(`game:${roomId}`);
        break;
      }
    }

    socket.emit('matchmaking:cancelled');
  }

  private handleGameJoin(socket: any, data: { roomId: string }) {
    socket.join(`game:${data.roomId}`);
    console.log(`Socket ${socket.id} joined game ${data.roomId}`);
  }

  private handleGameLeave(socket: any, data: { roomId: string }) {
    socket.leave(`game:${data.roomId}`);
    console.log(`Socket ${socket.id} left game ${data.roomId}`);
  }

  private handlePlayerReady(socket: any, data: { roomId: string }) {
    // Handle player ready state
    socket.to(`game:${data.roomId}`).emit('player:ready', {
      socketId: socket.id,
      timestamp: Date.now()
    });
  }

  private handleMove(socket: any, data: any) {
    // TODO: Implement move validation and broadcast
    console.log('Move received:', data);
  }

  private handleResign(socket: any) {
    // TODO: Implement resign logic
    console.log('Player resigned:', socket.id);
  }

  private handleDrawOffer(socket: any) {
    // TODO: Implement draw offer logic
    console.log('Draw offer from:', socket.id);
  }

  private handleDrawResponse(socket: any, data: { accept: boolean }) {
    // TODO: Implement draw response logic
    console.log('Draw response:', data.accept, 'from:', socket.id);
  }

  private handleDisconnection(socket: any, reason: string) {
    const playerId = this.playerSockets.get(socket.id);
    if (playerId) {
      this.playerSockets.delete(socket.id);

      // Handle game state on disconnection
      for (const [roomId, room] of this.gameRooms.entries()) {
        if (room.players.some(p => p.socketId === socket.id)) {
          if (room.status === 'active') {
            // Pause game and notify opponent
            socket.to(`game:${roomId}`).emit('player:disconnected', {
              reason,
              timestamp: Date.now(),
              grace_period: 60000 // 1 minute to reconnect
            });
          } else if (room.status === 'waiting') {
            // Remove from waiting room
            room.players = room.players.filter(p => p.socketId !== socket.id);
            if (room.players.length === 0) {
              this.gameRooms.delete(roomId);
            }
          }
          break;
        }
      }
    }
  }

  private generateGameId(): string {
    return 'game_' + Math.random().toString(36).substring(2, 15);
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  public getIO(): SocketIOServer {
    return this.io;
  }

  public getGameRooms(): Map<string, GameRoom> {
    return this.gameRooms;
  }
}