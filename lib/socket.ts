import { io, Socket } from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

let socket: Socket | null = null;

export const getSocket = (token: string) => {
  if (!socket && token) {
    socket = io(SOCKET_URL, {
      auth: { token }, // This matches your backend check!
      transports: ['websocket'],
    });

    // socket.on('connect', () => console.log('✅ Real-time connected'));
    socket.on('connect_error', (err) => console.error('❌ Socket error:', err.message));
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};