import express from "express";
import { createServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import dotenv from "dotenv";
import { errorHandler } from "./middleware/errorHandler";
import { rateLimiter } from "./middleware/rateLimiter";
import authRouter from "./routes/auth";
import gameRouter from "./routes/games";
import userRouter from "./routes/users";
import tournamentRouter from "./routes/tournaments";
import { WebSocketManager } from "./websocket/socketManager";
import { DatabaseManager } from "./database/DatabaseManager";

dotenv.config();

const app = express();
const httpServer = createServer(app);

const PORT = process.env.PORT || 3005;

// Global reference to WebSocket manager for debugging
let wsManager: WebSocketManager;

// Middleware
app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  }),
);
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("combined"));

// Rate limiting
app.use("/api", rateLimiter);

// Health check endpoint
app.get("/health", (_req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Debug route for matchmaking troubleshooting
app.get("/debug/matchmaking", (_req, res) => {
  if (!wsManager) {
    res.status(503).json({ error: "WebSocket manager not initialized" });
    return;
  }

  try {
    // Log detailed status to server console
    wsManager.logDetailedMatchmakingStatus();

    // Return stats to client
    const stats = wsManager.getMatchmakingStats();
    res.json({
      status: "Debug info logged to server console",
      stats,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to generate debug info" });
  }
});

// Debug route to reset player status
app.post("/debug/reset-status/:userId?", (req, res) => {
  if (!wsManager) {
    res.status(503).json({ error: "WebSocket manager not initialized" });
    return;
  }

  try {
    const userId = req.params.userId;

    if (userId) {
      // Reset specific user
      const result = (wsManager as any).resetPlayerStatus(userId);
      res.json({
        status: result ? "Player status reset" : "Player not found",
        userId,
        timestamp: new Date().toISOString(),
      });
    } else {
      // Reset all non-active game players
      const count = (wsManager as any).resetAllInactivePlayerStatuses();
      res.json({
        status: "All inactive player statuses reset",
        playersReset: count,
        timestamp: new Date().toISOString(),
      });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to reset status" });
  }
});

// Debug route to get all player statuses
app.get("/debug/player-statuses", (_req, res) => {
  if (!wsManager) {
    res.status(503).json({ error: "WebSocket manager not initialized" });
    return;
  }

  try {
    const statuses = (wsManager as any).getAllPlayerStatuses();
    res.json({
      players: statuses,
      count: statuses.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to get player statuses" });
  }
});

// API Routes
app.use("/api/auth", authRouter);
app.use("/api/games", gameRouter);
app.use("/api/users", userRouter);
app.use("/api/tournaments", tournamentRouter);

// Error handling
app.use(errorHandler);

// Initialize services
async function initializeServices(): Promise<void> {
  try {
    // Validate critical environment variables
    console.log("🔧 Validating server configuration...");

    if (!process.env.JWT_SECRET) {
      console.error("❌ CRITICAL: JWT_SECRET environment variable is not set");
      console.error(
        "💡 Make sure your .env file contains: JWT_SECRET=your_secret_key_here",
      );
      process.exit(1);
    }

    if (process.env.JWT_SECRET.length < 32) {
      console.warn(
        "⚠️  WARNING: JWT_SECRET should be at least 32 characters for security",
      );
    }

    console.log(
      `✅ JWT_SECRET loaded (length: ${process.env.JWT_SECRET.length})`,
    );
    console.log(`✅ Environment: ${process.env.NODE_ENV || "development"}`);

    // Initialize Database Manager
    await DatabaseManager.initialize();
    console.log("✅ Database manager initialized");

    // Initialize Socket.IO server with authentication support
    const io = new SocketIOServer(httpServer, {
      cors: {
        origin: process.env.CLIENT_URL || "http://localhost:3000",
        credentials: true,
      },
      // Add connection timeout and auth timeout
      connectTimeout: 45000,
      transports: ["websocket", "polling"],
    });

    // Initialize WebSocket manager with authentication
    wsManager = new WebSocketManager(io);
    wsManager.initialize();
    console.log("✅ WebSocket manager initialized with authentication");
  } catch (error) {
    console.error("❌ Failed to initialize services:", error);
    process.exit(1);
  }
}

// Start server (with authentication fixes)
async function startServer(): Promise<void> {
  await initializeServices();

  httpServer.listen(PORT, () => {
    console.log(`🎮 Skèmino Server running on port ${PORT} `);
    console.log(`🌐 WebSocket server ready`);
    console.log(`📊 Environment: ${process.env.NODE_ENV || "development"}`);
  });
}

// Graceful shutdown
process.on("SIGTERM", async () => {
  console.log("SIGTERM received, shutting down gracefully...");
  httpServer.close(() => {
    process.exit(0);
  });
});

process.on("SIGINT", async () => {
  console.log("SIGINT received, shutting down gracefully...");
  httpServer.close(() => {
    process.exit(0);
  });
});

// Handle uncaught exceptions
process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  process.exit(1);
});

// Start the server with auth fixes and env loaded
startServer().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
