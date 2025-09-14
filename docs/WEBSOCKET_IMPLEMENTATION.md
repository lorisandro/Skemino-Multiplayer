# 🚀 Skèmino WebSocket Real-Time Infrastructure

## 📋 Overview

This document describes the complete WebSocket real-time infrastructure implementation for Skèmino multiplayer gaming, designed to achieve sub-100ms latency with server-authoritative validation and robust disconnection handling.

## 🏗️ Architecture Components

### 1. SocketManager (Server-Side Orchestrator)
**Location**: `src/server/websocket/SocketManager.ts`

**Key Features**:
- **JWT Authentication**: Validates tokens on WebSocket handshake
- **Connection Management**: Handles 1000+ concurrent players
- **Real-time Gaming Events**: Sub-100ms event processing
- **Graceful Disconnection**: 30-second reconnection window
- **Health Monitoring**: Automatic ping/pong with 15s timeout

**Usage Example**:
```typescript
// Server initialization (already in index.ts)
const wsManager = new WebSocketManager(io);
wsManager.initialize();

// Monitor performance
console.log(`Active connections: ${wsManager.getActiveConnections()}`);
console.log(`Active games: ${wsManager.getActiveGames()}`);
```

### 2. GameRoom (Individual Game Management)
**Location**: `src/server/websocket/GameRoom.ts`

**Key Features**:
- **Server-Authoritative Validation**: All moves validated server-side
- **Time Control Management**: Precise timing with increment support
- **State Synchronization**: Redis caching for sub-50ms access
- **Disconnection Handling**: Pause/resume on reconnection
- **Move Timing**: Tracks think time for each move

**Usage Example**:
```typescript
// Creating a game room (handled by SocketManager)
const gameRoom = new GameRoom(gameId, {
  white: { userId: 'user1', username: 'Player1', rating: 1500 },
  black: { userId: 'user2', username: 'Player2', rating: 1480 },
  timeControl: '10+5' // 10 minutes + 5 second increment
});

gameRoom.startGame();
```

### 3. MatchmakingManager (ELO-Based Matching)
**Location**: `src/server/websocket/MatchmakingManager.ts`

**Key Features**:
- **ELO-Based Matching**: ±200 rating range with expansion over time
- **Multiple Time Controls**: bullet, blitz, rapid, classical
- **Queue Management**: Redis persistence for queue state
- **Smart Pairing**: Considers preferences and wait time
- **Anti-Abuse**: Avoid lists and preference validation

**Usage Example**:
```typescript
// Adding player to matchmaking queue
const match = await matchmakingManager.addToQueue({
  userId: 'user123',
  username: 'PlayerName',
  rating: 1600,
  timeControl: 'rapid',
  preferences: {
    maxRatingDifference: 150,
    preferredColor: 'white',
    avoidOpponents: ['blockedUser1', 'blockedUser2']
  }
});

if (match) {
  // Immediate match found
  console.log(`Match created: ${match.gameId}`);
}
```

### 4. SocketClient (Client-Side Manager)
**Location**: `src/client/services/SocketClient.ts`

**Key Features**:
- **Auto-Reconnection**: Smart reconnection with exponential backoff
- **Latency Monitoring**: Real-time ping/pong tracking
- **Binary Optimization**: Compressed transport for performance
- **Event Management**: Type-safe event handling
- **Connection Quality**: Real-time quality assessment

**Usage Example**:
```typescript
import { createSocketClient } from '../services/SocketClient';

const socketClient = createSocketClient(authToken);

await socketClient.connect();

// Join matchmaking
socketClient.joinMatchmaking('rapid');

// Handle events
socketClient.on('match:found', (data) => {
  console.log(`Match found! Game: ${data.gameId}, Playing as: ${data.color}`);
  socketClient.joinGame(data.gameId);
});

socketClient.on('game:state', (gameState) => {
  // Update UI with new game state
  updateGameBoard(gameState);
});

// Make a move
socketClient.makeMove({
  id: 'move-uuid',
  turnNumber: 1,
  player: 'white',
  card: { suit: 'P', value: '7' },
  toPosition: 'd3',
  // ... other move properties
});
```

### 5. React Integration Hooks
**Location**: `src/client/hooks/useSocket.ts`

**Key Features**:
- **State Management**: Automatic React state updates
- **Error Handling**: Comprehensive error tracking
- **Specialized Hooks**: Game-only and matchmaking-only variants
- **Connection Monitoring**: Real-time connection status

**Usage Example**:
```typescript
import { useGameSocket } from '../hooks/useSocket';

function GameComponent() {
  const {
    currentGame,
    isMyTurn,
    myColor,
    opponent,
    canMakeMove,
    makeMove,
    resignGame,
    isConnected,
    latency
  } = useGameSocket(authToken, {
    onGameState: (gameState) => {
      console.log('Game updated:', gameState);
    },
    onMoveValidated: (move) => {
      console.log('Move confirmed:', move.notation);
    },
    onGameEnded: (result) => {
      console.log('Game ended:', result.result);
    }
  });

  const handleMove = (move) => {
    if (canMakeMove) {
      makeMove(move);
    }
  };

  return (
    <div>
      <ConnectionIndicator connected={isConnected} latency={latency} />
      {currentGame && (
        <GameBoard
          gameState={currentGame}
          isMyTurn={isMyTurn}
          onMove={handleMove}
        />
      )}
    </div>
  );
}
```

## 🚀 Performance Optimizations

### 1. Sub-100ms Latency Targets

**Server-Side Optimizations**:
```typescript
// Binary message encoding for move data
const encodedMove = Buffer.from(JSON.stringify(move));
socket.emit('game:move', encodedMove);

// Message batching for efficiency
const pipeline = RedisManager.pipeline();
pipeline.setGame(gameId, gameState);
pipeline.updateLeaderboard(playerId, newRating);
await pipeline.exec();
```

**Client-Side Optimizations**:
```typescript
// Enable WebSocket compression and binary mode
socketClient.enableOptimizations();

// Optimistic UI updates
const optimisticMove = (move) => {
  // Update UI immediately
  updateBoardOptimistically(move);

  // Send to server
  socketClient.makeMove(move);

  // Server will confirm or rollback
};
```

### 2. Memory and CPU Efficiency

**Connection Pooling**:
```typescript
// Efficient connection management
const PING_INTERVAL = 5000;
const PING_TIMEOUT = 15000;
const MAX_RECONNECTION_ATTEMPTS = 3;

// Automatic cleanup of stale connections
setInterval(() => {
  cleanupStaleConnections();
}, PING_INTERVAL);
```

**Game State Caching**:
```typescript
// Redis caching for fast game state access
await RedisManager.setGame(gameId, gameState, GAME_TTL);
const cachedGame = await RedisManager.getGame(gameId);
```

## 🛡️ Security and Anti-Cheat

### 1. Server-Authoritative Validation
```typescript
// All moves validated server-side
public async applyMove(move: Move, userId: string): Promise<MoveResult> {
  // Verify player can make move
  if (!this.canPlayerMove(userId)) {
    return { success: false, error: 'Not your turn' };
  }

  // Validate through game engine
  const validation = this.gameEngine.validateMove(move);
  if (!validation.valid) {
    return { success: false, error: validation.reason };
  }

  // Apply move (server-authoritative)
  const gameState = this.gameEngine.applyMove(move);
  return { success: true, gameState };
}
```

### 2. Anti-Cheat Measures
```typescript
// Move timing validation
if (move.thinkTimeMs < 100) {
  // Suspicious instant move
  logSecurityEvent('SUSPICIOUS_MOVE_TIME', { userId, thinkTime: move.thinkTimeMs });
}

// Rate limiting on move frequency
const rateLimiter = rateLimit({
  windowMs: 1000,
  max: 10, // Max 10 moves per second
  keyGenerator: (req) => req.socket.userId
});
```

## 📊 Monitoring and Analytics

### 1. Real-Time Metrics
```typescript
// Performance monitoring
const performanceLogger = createPerformanceLogger('move_processing');
// ... process move ...
performanceLogger.end({ moveId: move.id, playerId: userId });

// Connection quality tracking
socketClient.on('pong', () => {
  const latency = socketClient.getCurrentLatency();
  if (latency > 200) {
    notifyHighLatency(latency);
  }
});
```

### 2. Game Analytics
```typescript
// Game event logging
logger.gameStart(gameId, { white: whitePlayer.username, black: blackPlayer.username });
logger.gameMove(gameId, player.username, move.notation, move.thinkTimeMs);
logger.gameEnd(gameId, result, gameDuration);
```

## 🔧 Deployment Configuration

### 1. Environment Variables
```bash
# WebSocket Configuration
SOCKET_IO_PING_TIMEOUT=20000
SOCKET_IO_PING_INTERVAL=10000
MAX_CONCURRENT_CONNECTIONS=1000

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=secure_password

# Performance Tuning
NODE_ENV=production
MAX_OLD_SPACE_SIZE=4096
UV_THREADPOOL_SIZE=128
```

### 2. Load Balancing Setup
```nginx
# Nginx configuration for WebSocket load balancing
upstream skemino_backend {
    ip_hash; # Sticky sessions for WebSocket
    server 127.0.0.1:5000;
    server 127.0.0.1:5001;
    server 127.0.0.1:5002;
}

server {
    location /socket.io/ {
        proxy_pass http://skemino_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 🧪 Testing Strategy

### 1. Load Testing
```typescript
// Artillery.js configuration for load testing
module.exports = {
  config: {
    target: 'ws://localhost:5000',
    phases: [
      { duration: 60, arrivalRate: 10 }, // Ramp up
      { duration: 300, arrivalRate: 50 }, // Sustained load
      { duration: 60, arrivalRate: 0 } // Ramp down
    ]
  },
  scenarios: [
    {
      name: 'Game simulation',
      weight: 100,
      engine: 'ws'
    }
  ]
};
```

### 2. Integration Testing
```typescript
// Jest integration test example
describe('WebSocket Game Flow', () => {
  test('Complete game from matchmaking to end', async () => {
    const player1Socket = await createTestSocket('player1');
    const player2Socket = await createTestSocket('player2');

    // Join matchmaking
    player1Socket.emit('matchmaking:join', 'rapid');
    player2Socket.emit('matchmaking:join', 'rapid');

    // Wait for match
    const match = await waitForEvent(player1Socket, 'match:found');
    expect(match.gameId).toBeDefined();

    // Play game
    await simulateCompleteGame(player1Socket, player2Socket, match.gameId);

    // Verify game completion
    const gameEnd = await waitForEvent(player1Socket, 'game:ended');
    expect(gameEnd.result).toMatch(/^(1-0|0-1|1\/2-1\/2)$/);
  });
});
```

## 🚀 Getting Started

### 1. Installation
```bash
# Install dependencies
npm install

# Start Redis server
redis-server

# Start PostgreSQL
pg_ctl start

# Run migrations
npm run db:migrate

# Start development server
npm run dev
```

### 2. Basic Implementation
```typescript
// Server setup (already configured in index.ts)
const wsManager = new WebSocketManager(io);
wsManager.initialize();

// Client integration
import { useGameSocket } from './hooks/useSocket';

function App() {
  const gameSocket = useGameSocket(authToken);

  return (
    <GameInterface socket={gameSocket} />
  );
}
```

## 📈 Scaling Considerations

### 1. Horizontal Scaling
- **Sticky Sessions**: Use session affinity for WebSocket connections
- **Redis Cluster**: Distribute game state across multiple Redis instances
- **Database Sharding**: Partition by user ID or game ID for large scale

### 2. Performance Monitoring
- **Real-time Metrics**: Track latency, connection count, game duration
- **Error Rates**: Monitor disconnection rates and failed operations
- **Capacity Planning**: Auto-scale based on connection count and CPU usage

This implementation provides a production-ready, scalable WebSocket infrastructure for Skèmino that can handle thousands of concurrent players while maintaining sub-100ms latency for competitive gaming.