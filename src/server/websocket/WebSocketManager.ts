import { Server as HTTPServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';

export class WebSocketManager {
  private io: SocketIOServer;

  constructor(server: HTTPServer) {
    this.io = new SocketIOServer(server, {
      cors: {
        origin: ['http://localhost:5173', 'http://localhost:3001'],
        methods: ['GET', 'POST'],
        credentials: true
      }
    });

    this.setupEventHandlers();
  }

  private setupEventHandlers() {
    this.io.on('connection', (socket) => {
      console.log('New client connected:', socket.id);

      socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
      });

      socket.on('game:join', (gameId: string) => {
        socket.join(`game:${gameId}`);
        console.log(`Socket ${socket.id} joined game ${gameId}`);
      });

      socket.on('game:leave', (gameId: string) => {
        socket.leave(`game:${gameId}`);
        console.log(`Socket ${socket.id} left game ${gameId}`);
      });
    });
  }

  public getIO(): SocketIOServer {
    return this.io;
  }
}