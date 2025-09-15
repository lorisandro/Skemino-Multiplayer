import express from 'express';
import { createServer } from 'http';
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
import { WebSocketManager } from './websocket/WebSocketManager';
import { DatabaseManager } from './database/DatabaseManager';

dotenv.config();

const app = express();
const httpServer = createServer(app);

const PORT = process.env.PORT || 3005;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3007',
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

    // Initialize WebSocket manager
    new WebSocketManager(httpServer);
    console.log('WebSocket manager initialized');

  } catch (error) {
    console.error('Failed to initialize services:', error);
    process.exit(1);
  }
}

// Start server
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

// Start the server
startServer().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
