// lib/socket.ts - Add online users tracking
import { io, Socket } from 'socket.io-client';
import { useEffect, useState } from 'react';

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

let socket: Socket | null = null;
let activeToken: string | null = null;

// Store online users globally
let globalOnlineUsers = new Set<string>();
const listeners: Set<(users: Set<string>) => void> = new Set();

// Notify all listeners when online users change
const notifyOnlineUsersChange = () => {
  listeners.forEach(listener => listener(globalOnlineUsers));
};

export const getSocket = (token: string) => {
  if (!token) return null;

  // Reconnect if token has changed
  if (socket && activeToken !== token) {
    if (socket.connected) {
      socket.disconnect();
    }
    socket = null;
    activeToken = null;
    globalOnlineUsers.clear();
    notifyOnlineUsersChange();
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
      console.log('✅ Socket connected');
      // Request list of online users when connected
      socket?.emit('online:get-users');
    });

    socket.on('connect_error', (err) => {
      console.error('❌ Socket connection error:', err.message);
    });

    socket.on('disconnect', (reason) => {
      if (reason === 'io server disconnect') {
        socket?.connect();
      }
      console.log('⚠️ Socket disconnected:', reason);
    });

    // 🔥 IMPORTANT: Listen for online users list
    socket.on('online:users-list', (data) => {
      console.log('📋 Online users received:', data);
      globalOnlineUsers.clear();
      data.userIds.forEach((userId: string) => {
        globalOnlineUsers.add(userId);
      });
      notifyOnlineUsersChange();
    });

    // 🔥 IMPORTANT: Listen for real-time status changes
    socket.on('user:status-change', (data) => {
      console.log(`👤 User ${data.userId} is ${data.isOnline ? 'online' : 'offline'}`);
      
      if (data.isOnline) {
        globalOnlineUsers.add(data.userId);
      } else {
        globalOnlineUsers.delete(data.userId);
      }
      notifyOnlineUsersChange();
    });

    // Add ping for connection health
    socket.on('pong', () => {
      // Optional: track latency
    });
  }

  if (!socket.connected) {
    socket.connect();
  }

  return socket;
};

// Hook to get online users
export const useOnlineUsers = () => {
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(globalOnlineUsers);

  useEffect(() => {
    const handleChange = (users: Set<string>) => {
      setOnlineUsers(new Set(users)); // Create new set to trigger re-render
    };

    listeners.add(handleChange);
    
    return () => {
      listeners.delete(handleChange);
    };
  }, []);

  return onlineUsers;
};

// Check if a specific user is online
export const useIsUserOnline = (userId: string) => {
  const onlineUsers = useOnlineUsers();
  return onlineUsers.has(userId);
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
    activeToken = null;
    globalOnlineUsers.clear();
    notifyOnlineUsersChange();
  }
};

/**
 * Hook to manage socket connection with lifecycle handling.
 */
export const useSocket = (token: string | null) => {
  const [socketInstance, setSocketInstance] = useState<Socket | null>(null);

  useEffect(() => {
    if (token) {
      const socket = getSocket(token);
      setSocketInstance(socket);
    }
  }, [token]);

  return socketInstance;
};