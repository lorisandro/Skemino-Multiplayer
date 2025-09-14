import { useEffect, useState, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

interface WebSocketState {
  isConnected: boolean;
  error: string | null;
  latency: number;
}

interface UseWebSocketOptions {
  autoConnect?: boolean;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: string) => void;
}

export const useWebSocket = (options: UseWebSocketOptions = {}) => {
  const { autoConnect = true, onConnect, onDisconnect, onError } = options;

  const [state, setState] = useState<WebSocketState>({
    isConnected: false,
    error: null,
    latency: 0,
  });

  const socketRef = useRef<Socket | null>(null);
  const pingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize socket connection
  const connect = () => {
    if (socketRef.current?.connected) return;

    try {
      // Get auth token from localStorage or use guest mode
      const token = localStorage.getItem('auth_token');
      const isGuest = !token;

      const socketUrl = process.env.REACT_APP_WEBSOCKET_URL || 'http://localhost:3001';

      socketRef.current = io(socketUrl, {
        auth: {
          token: token || 'guest_' + Date.now(),
          isGuest,
        },
        transports: ['websocket', 'polling'],
        timeout: 5000,
        forceNew: true,
      });

      setupSocketListeners();
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to connect';
      setState(prev => ({ ...prev, error: errorMsg }));
      onError?.(errorMsg);
    }
  };

  // Setup socket event listeners
  const setupSocketListeners = () => {
    if (!socketRef.current) return;

    const socket = socketRef.current;

    socket.on('connect', () => {
      setState(prev => ({ ...prev, isConnected: true, error: null }));
      onConnect?.();
      startPingInterval();
    });

    socket.on('disconnect', (reason) => {
      setState(prev => ({ ...prev, isConnected: false }));
      onDisconnect?.();
      stopPingInterval();

      // Auto-reconnect unless manually disconnected
      if (reason !== 'io client disconnect') {
        setTimeout(() => {
          if (!socket.connected) {
            socket.connect();
          }
        }, 2000);
      }
    });

    socket.on('connect_error', (error) => {
      const errorMsg = `Connection failed: ${error.message}`;
      setState(prev => ({ ...prev, error: errorMsg, isConnected: false }));
      onError?.(errorMsg);
    });

    socket.on('error', (error) => {
      const errorMsg = typeof error === 'string' ? error : 'Socket error occurred';
      setState(prev => ({ ...prev, error: errorMsg }));
      onError?.(errorMsg);
    });

    // Pong response for latency calculation
    socket.on('pong', () => {
      const now = Date.now();
      const latency = now - (socket as any).lastPingTime;
      setState(prev => ({ ...prev, latency }));
    });
  };

  // Start ping interval for latency monitoring
  const startPingInterval = () => {
    if (pingIntervalRef.current) return;

    pingIntervalRef.current = setInterval(() => {
      if (socketRef.current?.connected) {
        (socketRef.current as any).lastPingTime = Date.now();
        socketRef.current.emit('ping');
      }
    }, 5000); // Ping every 5 seconds
  };

  // Stop ping interval
  const stopPingInterval = () => {
    if (pingIntervalRef.current) {
      clearInterval(pingIntervalRef.current);
      pingIntervalRef.current = null;
    }
  };

  // Disconnect socket
  const disconnect = () => {
    if (socketRef.current) {
      stopPingInterval();
      socketRef.current.disconnect();
      socketRef.current = null;
      setState(prev => ({ ...prev, isConnected: false }));
    }
  };

  // Auto-connect on mount
  useEffect(() => {
    if (autoConnect) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [autoConnect]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopPingInterval();
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  return {
    socket: socketRef.current,
    isConnected: state.isConnected,
    error: state.error,
    latency: state.latency,
    connect,
    disconnect,
  };
};