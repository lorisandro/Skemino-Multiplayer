import express from "express";
import { createServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3006",
    credentials: true,
  },
  pingTimeout: 20000,
  pingInterval: 10000,
  transports: ["websocket", "polling"],
});

const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3006",
    credentials: true,
  }),
);
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get("/health", (_req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Basic API endpoints
app.get("/api", (_req, res) => {
  res.json({
    message: "Skèmino API Server",
    version: "1.0.0",
    endpoints: {
      health: "/health",
      websocket: "ws://localhost:5000",
    },
  });
});

// WebSocket connection handling
io.on("connection", (socket) => {
  console.log("🎮 New client connected:", socket.id);

  // Ping-pong for latency measurement
  socket.on("ping", () => {
    socket.emit("pong");
  });

  // Game room management
  socket.on("game:join", (data: { roomId: string }) => {
    console.log("Player joining game room:", data.roomId);
    socket.join(data.roomId);
    socket.emit("game:joined", {
      roomId: data.roomId,
      playerId: socket.id,
    });

    // Notify others in room
    socket.to(data.roomId).emit("player:joined", {
      playerId: socket.id,
    });
  });

  // Handle moves
  socket.on("move:make", (data: any) => {
    console.log("Move received from", socket.id, ":", data);

    // For now, just broadcast to room
    if (data.roomId) {
      socket.to(data.roomId).emit("move:made", {
        ...data,
        playerId: socket.id,
        timestamp: Date.now(),
      });
    }
  });

  // Game state request
  socket.on("game:state", (_data: { roomId: string }) => {
    // Send mock game state for now
    socket.emit("game:state", {
      status: "active",
      currentTurn: "white",
      board: Array(36).fill(null),
      whiteCards: 13,
      blackCards: 13,
      turnNumber: 1,
    });
  });

  // Handle resignation
  socket.on("game:resign", (data: { roomId: string }) => {
    console.log("Player resigned:", socket.id);
    io.to(data.roomId).emit("game:over", {
      winner: "opponent",
      reason: "resignation",
      resignedPlayer: socket.id,
    });
  });

  // Handle draw offers
  socket.on("draw:offer", (data: { roomId: string }) => {
    socket.to(data.roomId).emit("draw:offered", {
      offeredBy: socket.id,
    });
  });

  socket.on("draw:response", (data: { roomId: string; accept: boolean }) => {
    if (data.accept) {
      io.to(data.roomId).emit("game:over", {
        result: "draw",
        reason: "agreement",
      });
    } else {
      socket.to(data.roomId).emit("draw:declined");
    }
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
    // Notify rooms this player was in
    socket.rooms.forEach((room) => {
      if (room !== socket.id) {
        socket.to(room).emit("player:disconnected", {
          playerId: socket.id,
        });
      }
    });
  });
});

// Start server
httpServer.listen(PORT, () => {
  console.log(`🎮 Skèmino Server running on http://localhost:${PORT}`);
  console.log(`🌐 WebSocket server ready on ws://localhost:${PORT}`);
  console.log(`📊 Frontend should connect to http://localhost:3006`);
  console.log(`✅ Health check: http://localhost:${PORT}/health`);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down...");
  httpServer.close(() => {
    process.exit(0);
  });
});

process.on("SIGINT", () => {
  console.log("SIGINT received, shutting down...");
  httpServer.close(() => {
    process.exit(0);
  });
});
