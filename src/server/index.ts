import express from 'express';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { errorHandler } from './middleware/errorHandler';
import { rateLimiter } from './middleware/rateLimiter';
import authRouter from './routes/auth';
import gameRouter from './routes/games';
import userRouter from './routes/users';
import tournamentRouter from './routes/tournaments';
import { WebSocketManager } from './websocket/socketManager';
import { DatabaseManager } from './database/DatabaseManager';

dotenv.config();

const app = express();
const httpServer = createServer(app);

const PORT = process.env.PORT || 3005;

// Global reference to WebSocket manager for debugging
let wsManager: WebSocketManager;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('combined'));

// Rate limiting
app.use('/api', rateLimiter);

// Health check endpoint
app.get('/health', (_req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Debug route for matchmaking troubleshooting
app.get('/debug/matchmaking', (_req, res) => {
  if (!wsManager) {
    res.status(503).json({ error: 'WebSocket manager not initialized' });
    return;
  }

  try {
    // Log detailed status to server console
    wsManager.logDetailedMatchmakingStatus();

    // Return stats to client
    const stats = wsManager.getMatchmakingStats();
    res.json({
      status: 'Debug info logged to server console',
      stats,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate debug info' });
  }
});

// API Routes
app.use('/api/auth', authRouter);
app.use('/api/games', gameRouter);
app.use('/api/users', userRouter);
app.use('/api/tournaments', tournamentRouter);

// Error handling
app.use(errorHandler);

// Initialize services
async function initializeServices(): Promise<void> {
  try {
    // Initialize Database Manager
    await DatabaseManager.initialize();
    console.log('Database manager initialized');

    // Initialize Socket.IO server
    const io = new SocketIOServer(httpServer, {
      cors: {
        origin: process.env.CLIENT_URL || 'http://localhost:3000',
        credentials: true
      }
    });

    // Initialize WebSocket manager
    wsManager = new WebSocketManager(io);
    wsManager.initialize();
    console.log('WebSocket manager initialized');

  } catch (error) {
    console.error('Failed to initialize services:', error);
    process.exit(1);
  }
}

// Start server (with authentication fixes)
async function startServer(): Promise<void> {
  await initializeServices();

  httpServer.listen(PORT, () => {
    console.log(`🎮 Skèmino Server running on port ${PORT}`);
    console.log(`🌐 WebSocket server ready`);
    console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  });
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully...');
  httpServer.close(() => {
    process.exit(0);
  });
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, shutting down gracefully...');
  httpServer.close(() => {
    process.exit(0);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Start the server with auth fixes
startServer().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
