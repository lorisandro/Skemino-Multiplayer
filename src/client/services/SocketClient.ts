import { io, Socket } from 'socket.io-client';
import {
  GameState,
  Move,
  PlayerColor
} from '../../shared/types/GameTypes';

export interface SocketEvents {
  // Authentication
  'auth:success': (userData: any) => void;
  'auth:error': (error: string) => void;

  // Matchmaking
  'matchmaking:queued': (data: { timeControl: string }) => void;
  'match:found': (data: { gameId: string; color: PlayerColor; opponent: any }) => void;
  'match:declined': (gameId: string) => void;

  // Game events
  'game:state': (gameState: GameState) => void;
  'game:move-result': (result: { success: boolean; error?: string; gameState?: GameState }) => void;
  'game:ended': (result: { result: string; winner?: PlayerColor; victoryCondition?: string; psn: string }) => void;
  'game:draw-offered': (data: { fromPlayer: string; username: string }) => void;
  'game:draw-accepted': () => void;
  'game:draw-declined': (data: { fromPlayer: string }) => void;

  // Real-time updates
  'move:validated': (move: Move) => void;
  'move:invalid': (reason: string) => void;
  'time:update': (timeData: { white: number; black: number }) => void;

  // Player presence
  'player:online': (data: { userId: string; username: string; rating: number }) => void;
  'player:offline': (data: { userId: string; username: string }) => void;
  'player:reconnected': (playerId: string) => void;
  'player:joined': (data: { userId: string; username: string }) => void;

  // Connection management
  'connect': () => void;
  'disconnect': () => void;
  'reconnect': () => void;
  'connect_error': (error: Error) => void;
  'pong': () => void;

  // Error handling
  'error': (error: { code: string; message: string }) => void;
}

export interface SocketClientConfig {
  serverUrl: string;
  authToken: string;
  autoReconnect?: boolean;
  reconnectionDelay?: number;
  maxReconnectionAttempts?: number;
  timeout?: number;
}

export interface ConnectionStatus {
  connected: boolean;
  connecting: boolean;
  reconnecting: boolean;
  authenticated: boolean;
  lastPing: number;
  reconnectionAttempts: number;
}

export type SocketEventHandler<T = any> = (data: T) => void;

export class SocketClient {
  private socket: Socket | null = null;
  private config: SocketClientConfig;
  private eventHandlers: Map<string, Set<SocketEventHandler>> = new Map();
  private connectionStatus: ConnectionStatus = {
    connected: false,
    connecting: false,
    reconnecting: false,
    authenticated: false,
    lastPing: 0,
    reconnectionAttempts: 0
  };

  private pingInterval: NodeJS.Timeout | null = null;
  private readonly PING_INTERVAL = 5000; // 5 seconds
  private readonly MAX_PING_LATENCY = 1000; // 1 second max acceptable latency
  private latencyHistory: number[] = [];

  constructor(config: SocketClientConfig) {
    this.config = {
      autoReconnect: true,
      reconnectionDelay: 1000,
      maxReconnectionAttempts: 5,
      timeout: 20000,
      ...config
    };
  }

  public async connect(): Promise<void> {
    if (this.socket?.connected) {
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      this.connectionStatus.connecting = true;

      // Get token from storage if not provided
      let authToken = this.config.authToken;
      if (!authToken) {
        authToken = localStorage.getItem('skemino_auth_token') ||
                   sessionStorage.getItem('skemino_auth_token') || '';
        console.log('🔑 Retrieved token from storage:', authToken.substring(0, 20) + '...');
      }

      // Validate JWT format before sending to server
      if (authToken && !this.isValidJWTFormat(authToken)) {
        console.error('❌ Invalid JWT format detected, clearing corrupted token');
        this.handleCorruptedTokenError();
        reject(new Error('Invalid JWT format - token cleared'));
        return;
      }

      // Check for known corrupted token patterns
      const knownCorruptedPattern = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9';
      if (authToken && authToken.startsWith(knownCorruptedPattern)) {
        console.error('🚨 Known corrupted token pattern detected, clearing token');
        this.handleCorruptedTokenError();
        reject(new Error('Known corrupted token pattern - token cleared'));
        return;
      }

      // Check if user is guest
      const userData = localStorage.getItem('skemino_user_data') ||
                      sessionStorage.getItem('skemino_user_data');
      const isGuest = userData ? JSON.parse(userData).isGuest : false;

      console.log(`🔌 Connecting to WebSocket - Token: ${!!authToken}, Guest: ${isGuest}, URL: ${this.config.serverUrl}`);

      const socketConfig = {
        auth: {
          token: authToken,
          isGuest: isGuest
        },
        timeout: this.config.timeout,
        forceNew: true,
        transports: ['websocket', 'polling'], // Prefer WebSocket
        reconnection: this.config.autoReconnect,
        reconnectionDelay: this.config.reconnectionDelay,
        reconnectionAttempts: this.config.maxReconnectionAttempts
      };

      this.socket = io(this.config.serverUrl, socketConfig);

      // Connection event handlers
      this.socket.on('connect', () => {
        this.handleConnect();
        resolve();
      });

      this.socket.on('connect_error', (error: Error) => {
        this.handleConnectionError(error);
        if (!this.connectionStatus.connected) {
          reject(error);
        }
      });

      this.socket.on('disconnect', (reason: string) => {
        this.handleDisconnect(reason);
      });

      this.socket.on('reconnect', () => {
        this.handleReconnect();
      });

      this.socket.on('reconnect_error', (error: Error) => {
        this.connectionStatus.reconnectionAttempts++;
        this.emit('connect_error', error);
      });

      this.socket.on('reconnect_failed', () => {
        this.connectionStatus.reconnecting = false;
        this.emit('error', {
          code: 'RECONNECTION_FAILED',
          message: 'Failed to reconnect after maximum attempts'
        });
      });

      // Game event handlers
      this.setupGameEventHandlers();

      // Ping/Pong for latency monitoring
      this.socket.on('pong', () => {
        this.handlePong();
      });

      // Start ping monitoring
      this.startPingMonitoring();

      // Set connection timeout
      setTimeout(() => {
        if (!this.connectionStatus.connected) {
          this.socket?.disconnect();
          reject(new Error('Connection timeout'));
        }
      }, this.config.timeout!);
    });
  }

  public disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }

    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }

    this.connectionStatus = {
      connected: false,
      connecting: false,
      reconnecting: false,
      authenticated: false,
      lastPing: 0,
      reconnectionAttempts: 0
    };
  }

  private handleConnect(): void {
    this.connectionStatus = {
      connected: true,
      connecting: false,
      reconnecting: false,
      authenticated: true, // Assuming token auth succeeded
      lastPing: Date.now(),
      reconnectionAttempts: 0
    };

    this.emit('connect');
    console.log('🔌 Connected to Skèmino server');
  }

  private handleConnectionError(error: Error): void {
    this.connectionStatus.connecting = false;

    // Handle specific JWT authentication errors from server
    if (error.message.includes('JWT_SIGNATURE_INVALID') || error.name === 'JWT_SIGNATURE_INVALID') {
      console.error('🚨 Server detected corrupted JWT token - forcing client token invalidation');
      this.handleCorruptedTokenError();
    } else if (error.message.includes('KNOWN_CORRUPTED_TOKEN') || error.name === 'KNOWN_CORRUPTED_TOKEN') {
      console.error('🚨 Server detected known corrupted token pattern - clearing storage');
      this.handleCorruptedTokenError();
    } else if (error.message.includes('Authentication token expired')) {
      console.error('⏰ Authentication token expired - user needs to re-authenticate');
      this.emit('error', {
        code: 'TOKEN_EXPIRED',
        message: 'Your session has expired. Please login again.'
      });
    } else if (error.message.includes('Authentication token required')) {
      console.error('🔑 No valid authentication token - user needs to login');
      this.emit('error', {
        code: 'AUTH_REQUIRED',
        message: 'Authentication required. Please login to continue.'
      });
    }

    this.emit('connect_error', error);
    console.error('❌ Connection error:', error.message);
  }

  // Handle corrupted token errors by clearing storage and redirecting to auth
  private handleCorruptedTokenError(): void {
    console.log('🧹 Clearing corrupted authentication data from browser storage');

    // Clear all authentication data
    localStorage.removeItem('skemino_auth_token');
    localStorage.removeItem('skemino_user_data');
    localStorage.removeItem('skemino_token_version');
    sessionStorage.removeItem('skemino_auth_token');
    sessionStorage.removeItem('skemino_user_data');
    sessionStorage.removeItem('skemino_token_version');
    sessionStorage.removeItem('skemino_guest_session'); // Legacy cleanup

    // Mark tokens as cleaned
    localStorage.setItem('skemino_corrupted_tokens_cleaned', 'true');

    // Emit specific error for UI to handle (redirect to login)
    this.emit('error', {
      code: 'CORRUPTED_TOKEN',
      message: 'Your authentication data was corrupted and has been cleared. Please login again.'
    });

    // Force disconnect to prevent retry loops
    this.disconnect();
  }

  private handleDisconnect(reason: string): void {
    this.connectionStatus.connected = false;
    this.connectionStatus.authenticated = false;

    if (reason === 'io server disconnect') {
      // Server initiated disconnect - don't auto-reconnect
      this.connectionStatus.reconnecting = false;
    } else {
      // Client or network issue - attempt reconnection
      this.connectionStatus.reconnecting = this.config.autoReconnect!;
    }

    this.emit('disconnect');
    console.log('🔌 Disconnected from server:', reason);
  }

  private handleReconnect(): void {
    this.connectionStatus.connected = true;
    this.connectionStatus.reconnecting = false;
    this.connectionStatus.authenticated = true;
    this.connectionStatus.reconnectionAttempts = 0;

    this.emit('reconnect');
    console.log('🔄 Reconnected to server');
  }

  private setupGameEventHandlers(): void {
    if (!this.socket) return;

    // Forward all game events to registered handlers
    const gameEvents = [
      'matchmaking:queued',
      'match:found',
      'match:declined',
      'game:state',
      'game:move-result',
      'game:ended',
      'game:draw-offered',
      'game:draw-accepted',
      'game:draw-declined',
      'move:validated',
      'move:invalid',
      'time:update',
      'player:online',
      'player:offline',
      'player:reconnected',
      'player:joined',
      'error'
    ];

    gameEvents.forEach(event => {
      this.socket!.on(event, (data: any) => {
        this.emit(event as keyof SocketEvents, data);
      });
    });
  }

  private startPingMonitoring(): void {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
    }

    this.pingInterval = setInterval(() => {
      if (this.socket?.connected) {
        const pingStart = Date.now();
        this.connectionStatus.lastPing = pingStart;
        this.socket.emit('ping');
      }
    }, this.PING_INTERVAL);
  }

  private handlePong(): void {
    const latency = Date.now() - this.connectionStatus.lastPing;
    this.latencyHistory.push(latency);

    // Keep only last 10 latency measurements
    if (this.latencyHistory.length > 10) {
      this.latencyHistory.shift();
    }

    // Emit latency warning if consistently high
    if (latency > this.MAX_PING_LATENCY) {
      this.emit('error', {
        code: 'HIGH_LATENCY',
        message: `High latency detected: ${latency}ms`
      });
    }

    this.emit('pong');
  }

  // Event management
  public on<K extends keyof SocketEvents>(event: K, handler: SocketEvents[K]): void {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, new Set());
    }
    this.eventHandlers.get(event)!.add(handler as SocketEventHandler);
  }

  public off<K extends keyof SocketEvents>(event: K, handler: SocketEvents[K]): void {
    const handlers = this.eventHandlers.get(event);
    if (handlers) {
      handlers.delete(handler as SocketEventHandler);
    }
  }

  public once<K extends keyof SocketEvents>(event: K, handler: SocketEvents[K]): void {
    const onceHandler = (data: any) => {
      handler(data);
      this.off(event, onceHandler as SocketEvents[K]);
    };
    this.on(event, onceHandler as SocketEvents[K]);
  }

  private emit<K extends keyof SocketEvents>(event: K, data?: any): void {
    const handlers = this.eventHandlers.get(event);
    if (handlers) {
      handlers.forEach(handler => {
        try {
          handler(data);
        } catch (error) {
          console.error(`Error in ${event} handler:`, error);
        }
      });
    }
  }

  // Game actions
  public joinMatchmaking(timeControl: string = 'rapid'): void {
    if (!this.socket?.connected) {
      throw new Error('Not connected to server');
    }
    this.socket.emit('matchmaking:join', timeControl);
  }

  public leaveMatchmaking(): void {
    if (!this.socket?.connected) return;
    this.socket.emit('matchmaking:leave');
  }

  public joinGame(gameId: string): void {
    if (!this.socket?.connected) {
      throw new Error('Not connected to server');
    }
    this.socket.emit('game:join', gameId);
  }

  public makeMove(move: Move): void {
    if (!this.socket?.connected) {
      throw new Error('Not connected to server');
    }
    this.socket.emit('game:move', move);
  }

  public resignGame(): void {
    if (!this.socket?.connected) return;
    this.socket.emit('game:resign');
  }

  public offerDraw(): void {
    if (!this.socket?.connected) return;
    this.socket.emit('game:offer-draw');
  }

  public acceptDraw(): void {
    if (!this.socket?.connected) return;
    this.socket.emit('game:accept-draw');
  }

  public declineDraw(): void {
    if (!this.socket?.connected) return;
    this.socket.emit('game:decline-draw');
  }

  // Utility methods
  public isConnected(): boolean {
    return this.connectionStatus.connected;
  }

  public isAuthenticated(): boolean {
    return this.connectionStatus.authenticated;
  }

  public getConnectionStatus(): ConnectionStatus {
    return { ...this.connectionStatus };
  }

  public getAverageLatency(): number {
    if (this.latencyHistory.length === 0) return 0;
    return this.latencyHistory.reduce((sum, lat) => sum + lat, 0) / this.latencyHistory.length;
  }

  public getCurrentLatency(): number {
    return this.latencyHistory[this.latencyHistory.length - 1] || 0;
  }

  public updateAuthToken(token: string): void {
    this.config.authToken = token;
    if (this.socket?.connected) {
      // Force reconnection with new token
      this.socket.disconnect();
      this.connect().catch(error => {
        console.error('Failed to reconnect with new token:', error);
      });
    }
  }

  // Advanced features
  public enableOptimizations(): void {
    if (!this.socket) return;

    // Enable binary transport for better performance
    this.socket.binary(true);

    // Use compression for large payloads
    this.socket.compress(true);
  }

  public getSocketId(): string | null {
    return this.socket?.id || null;
  }

  public forceReconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.connect().catch(error => {
        console.error('Manual reconnection failed:', error);
      });
    }
  }

  // JWT format validation helper
  private isValidJWTFormat(token: string): boolean {
    try {
      if (!token || typeof token !== 'string') return false;

      // JWT should have 3 parts separated by dots
      const parts = token.split('.');
      if (parts.length !== 3) return false;

      // Each part should be base64url encoded
      for (const part of parts) {
        if (!part || part.length === 0) return false;
        // Basic check for base64url characters
        if (!/^[A-Za-z0-9_-]+$/.test(part)) return false;
      }

      return true;
    } catch (error) {
      return false;
    }
  }

  // Debug methods
  public getDebugInfo(): {
    connected: boolean;
    socketId: string | null;
    latency: number;
    avgLatency: number;
    reconnectionAttempts: number;
    transport: string | null;
  } {
    return {
      connected: this.connectionStatus.connected,
      socketId: this.socket?.id || null,
      latency: this.getCurrentLatency(),
      avgLatency: this.getAverageLatency(),
      reconnectionAttempts: this.connectionStatus.reconnectionAttempts,
      transport: this.socket?.io.engine?.transport?.name || null
    };
  }
}

// Factory function for creating configured socket client
export function createSocketClient(authToken: string, serverUrl?: string): SocketClient {
  const config: SocketClientConfig = {
    serverUrl: serverUrl || process.env.REACT_APP_SERVER_URL || 'http://localhost:5000',
    authToken,
    autoReconnect: true,
    reconnectionDelay: 1000,
    maxReconnectionAttempts: 5,
    timeout: 20000
  };

  return new SocketClient(config);
}

// Singleton pattern for global socket client
class SocketClientManager {
  private static instance: SocketClient | null = null;
  private static currentToken: string | null = null;
  private static currentServerUrl: string | null = null;

  public static initialize(authToken: string, serverUrl?: string): SocketClient {
    if (this.instance) {
      this.instance.disconnect();
    }

    this.currentToken = authToken;
    this.currentServerUrl = serverUrl || process.env.REACT_APP_SERVER_URL || 'http://localhost:5000';
    this.instance = createSocketClient(authToken, this.currentServerUrl);
    return this.instance;
  }

  public static getInstance(): SocketClient | null {
    return this.instance;
  }

  public static updateAuthToken(newToken: string): void {
    this.currentToken = newToken;

    // If we have an active instance, reconnect with new token
    if (this.instance) {
      console.log('🔄 Updating socket client with new auth token');
      this.instance.disconnect();
      this.instance = createSocketClient(newToken, this.currentServerUrl || undefined);
      this.instance.connect().catch(error => {
        console.error('Failed to reconnect with new token:', error);
      });
    }
  }

  public static disconnect(): void {
    if (this.instance) {
      this.instance.disconnect();
      this.instance = null;
    }
    this.currentToken = null;
    this.currentServerUrl = null;
  }
}

export { SocketClientManager };