import { io, Socket } from 'socket.io-client';
import { useEffect, useState } from 'react';

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

let socket: Socket | null = null;
let activeToken: string | null = null;

export const getSocket = (token: string) => {
  if (!token) return null;

  // Reconnect if token has changed (e.g., user switch or token refresh)
  if (socket && activeToken !== token) {
    if (socket.connected) {
      socket.disconnect();
    }
    socket = null;
    activeToken = null;
  }

  if (!socket) {
    activeToken = token;
    socket = io(SOCKET_URL, {
      auth: { token },
      transports: ['polling', 'websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      autoConnect: true,
    });

    socket.on('connect', () => {
      // console.log('✅ Socket connected');
    });

    socket.on('connect_error', (err) => {
      console.error('❌ Socket connection error:', err.message);
    });

    socket.on('disconnect', (reason) => {
      if (reason === 'io server disconnect') {
        // the disconnection was initiated by the server, you need to reconnect manually
        socket?.connect();
      }
      // console.log('⚠️ Socket disconnected:', reason);
    });
  }

  if (!socket.connected) {
    socket.connect();
  }

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
    activeToken = null;
  }
};

/**
 * Hook to manage socket connection with lifecycle handling.
 * Ensures we don't create multiple connections and cleanup is handled if needed.
 */
export const useSocket = (token: string | null) => {
  const [socketInstance, setSocketInstance] = useState<Socket | null>(null);

  useEffect(() => {
    if (token) {
      const socket = getSocket(token);
      setSocketInstance(socket);
    } else {
      // If token is explicitly null (logged out), disconnect?
      // Usually managed by auth state, but we can play safe.
    }
  }, [token]);

  return socketInstance;
};