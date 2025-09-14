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
import { authRouter } from './routes/auth';
import { gameRouter } from './routes/games';
import { userRouter } from './routes/users';
import { tournamentRouter } from './routes/tournaments';
import { WebSocketManager } from './websocket/WebSocketManager';
import { DatabaseManager } from './database/DatabaseManager';
import { RedisManager } from './services/RedisManager';
import { logger } from './utils/logger';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true
  },
  pingTimeout: 20000,
  pingInterval: 10000,
  upgradeTimeout: 10000,
  maxHttpBufferSize: 1e6,
  transports: ['websocket', 'polling']
});

const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));

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
    // Initialize database connection
    await DatabaseManager.initialize();
    logger.info('Database connected successfully');

    // Initialize Redis
    await RedisManager.initialize();
    logger.info('Redis connected successfully');

    // Initialize WebSocket manager
    const wsManager = new WebSocketManager(io);
    wsManager.initialize();
    logger.info('WebSocket manager initialized');

  } catch (error) {
    logger.error('Failed to initialize services:', error);
    process.exit(1);
  }
}

// Start server
async function startServer(): Promise<void> {
  await initializeServices();

  httpServer.listen(PORT, () => {
    logger.info(`🎮 Skèmino Server running on port ${PORT}`);
    logger.info(`🌐 WebSocket server ready`);
    logger.info(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  });
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, shutting down gracefully...');
  httpServer.close(() => {
    DatabaseManager.close();
    RedisManager.close();
    process.exit(0);
  });
});

process.on('SIGINT', async () => {
  logger.info('SIGINT received, shutting down gracefully...');
  httpServer.close(() => {
    DatabaseManager.close();
    RedisManager.close();
    process.exit(0);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Start the server
startServer().catch((error) => {
  logger.error('Failed to start server:', error);
  process.exit(1);
});