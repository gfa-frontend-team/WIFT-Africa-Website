# Frontend Real-Time Messaging Implementation Guide

This guide details the architecture and implementation steps required to integrate the **WIFT Africa Backend** real-time messaging system into the frontend application (React).

## 1. Architecture Overview

To achieve a seamless "Real-Time" experience without performance issues, we must shift from **Polling** (asking for data) to **Event-Driven** (receiving data).

### Core Components
1.  **Socket Singleton**: One single socket connection for the entire app.
2.  **Socket Context**: A React Context to provide the socket instance to any component.
3.  **Chat Hook (`useChat`)**: Encapsulates logic for joining rooms, listening for messages, and sending messages.
4.  **Optimistic UI**: Immediate UI updates before the server responds.

---

## 2. Implementation Steps

### Step 1: Install Dependencies
Ensure you have the client library installed.
```bash
npm install socket.io-client
```

### Step 2: The Socket Context (Global Connection)
Create `src/context/SocketContext.tsx`. This ensures we only have **one** connection that persists as users navigate.

```typescript
import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthContext'; // Assuming you have an AuthContext

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({ socket: null, isConnected: false });

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const { token, user } = useAuth(); // Get your JWT token

  useEffect(() => {
    if (!token) return;

    // 1. Initialize Connection
    const socketInstance = io(process.env.REACT_APP_API_URL || 'http://localhost:3000', {
      auth: { token },
      transports: ['websocket'], // Force WebSocket for better performance
      reconnection: true,
    });

    // 2. Setup Listeners
    socketInstance.on('connect', () => {
      console.log('✅ Socket connected');
      setIsConnected(true);
    });

    socketInstance.on('disconnect', () => {
      console.log('❌ Socket disconnected');
      setIsConnected(false);
    });

    setSocket(socketInstance);

    // 3. Cleanup on logout/unmount
    return () => {
      socketInstance.disconnect();
    };
  }, [token]);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
```

### Step 3: The Chat Hook (`useChat`)
Create `src/hooks/useChat.ts`. This is where the magic happens. It handles joining rooms and managing message state.

```typescript
import { useEffect, useState, useRef } from 'react';
import { useSocket } from '../context/SocketContext';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../services/api'; // Your axios instance

interface Message {
  _id: string; // or id
  content: string;
  sender: { _id: string; firstName: string; profilePhoto: string };
  createdAt: string;
  isSelf?: boolean; // Helper for UI
}

export const useChat = (conversationId: string) => {
  const { socket } = useSocket();
  const queryClient = useQueryClient();
  const [messages, setMessages] = useState<Message[]>([]);
  
  // 1. Initial Load (Fetch History)
  // We use React Query for the initial fetch, but we'll sync state manually for updates
  const { data: history, isLoading } = useQuery({
    queryKey: ['messages', conversationId],
    queryFn: async () => {
      const res = await api.get(`/api/v1/messages/conversations/${conversationId}`);
      return res.data.data; // Adjust based on your API response structure
    },
    onSuccess: (data) => {
      setMessages(data);
    }
  });

  // 2. Real-Time Subscription
  useEffect(() => {
    if (!socket || !conversationId) return;

    // A. JOIN the room
    socket.emit('conversation:join', conversationId);

    // B. LISTEN for new messages
    const handleNewMessage = (newMessage: Message) => {
      // Append only if it doesn't exist (deduplication)
      setMessages((prev) => {
        if (prev.find(m => m._id === newMessage._id)) return prev;
        return [...prev, newMessage];
      });
      
      // Mark as read immediately if window is focused
      if (document.hasFocus()) {
         socket.emit('message:read', { 
           messageId: newMessage._id, 
           conversationId 
         });
      }
    };

    socket.on('message:new', handleNewMessage);

    // C. CLEANUP (Leave room)
    return () => {
      socket.emit('conversation:leave', conversationId);
      socket.off('message:new', handleNewMessage);
    };
  }, [socket, conversationId]);

  // 3. Send Message (Optimistic Update)
  const sendMessage = async (content: string) => {
    const tempId = Date.now().toString();
    const tempMessage: Message = {
      _id: tempId,
      content,
      sender: { 
        _id: 'me', // user.id
        firstName: 'Me',
        profilePhoto: ''
      },
      createdAt: new Date().toISOString(),
      isSelf: true
    };

    // A. Optimistic Append
    setMessages((prev) => [...prev, tempMessage]);

    try {
      // B. API Call
      const res = await api.post('/api/v1/messages', {
        receiverId: '...', // You might need receiverId or just post to conversation endpoint
        conversationId, // If your API supports sending by convId
        content
      });

      // C. Replace Temp Message with Real One
      setMessages((prev) => 
        prev.map(m => m._id === tempId ? res.data.data : m)
      );
    } catch (error) {
      // D. Rollback on failure
      setMessages((prev) => prev.filter(m => m._id !== tempId));
      console.error('Failed to send message');
      // Show toast error
    }
  };

  return { messages, isLoading, sendMessage };
};
```

### Step 4: UI Integration
In your Chat Component (e.g., `ChatRoom.tsx`):

```tsx
import React, { useRef, useEffect } from 'react';
import { useChat } from '../hooks/useChat';

export const ChatRoom = ({ conversationId }) => {
  const { messages, isLoading, sendMessage } = useChat(conversationId);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (isLoading) return <div>Loading chat...</div>;

  return (
    <div className="chat-container">
      <div className="message-list">
        {messages.map((msg) => (
          <div key={msg._id} className={msg.isSelf ? 'msg-own' : 'msg-other'}>
            <p>{msg.content}</p>
            <span>{new Date(msg.createdAt).toLocaleTimeString()}</span>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="input-area">
        <input 
            type="text" 
            onKeyDown={(e) => {
                if (e.key === 'Enter') {
                    sendMessage(e.currentTarget.value);
                    e.currentTarget.value = '';
                }
            }} 
        />
      </div>
    </div>
  );
};
```

## 3. Best Practices Checklist

1.  **Stop Polling**: Ensure `useQuery` for messages has `refetchInterval: false` is set (or default).
2.  **Deduplication**: The `setMessages` updater checks for duplicate IDs. This prevents a "double message" effect if the optimistic update and the socket event arrive close together.
3.  **Connection Management**: The `SocketContext` ensures we don't reconnect every time the user switches pages.
4.  **Typing Indicators**:
    *   Add `socket.emit('typing:start', { conversationId })` on input change.
    *   Listen for `user:typing` in the `useChat` hook to show "User is typing...".

## 4. Handling 429 Errors (Rate Limits)
Even with sockets, initial loads can trigger limits if messed up.
*   **Fix**: Ensure `useQuery` has `retry: 1` or `retry: false` for the `messages` query key so it doesn't hammer the API if it fails.
