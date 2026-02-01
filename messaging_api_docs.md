# Messaging System API Documentation

**Base URL**: `/api/v1/messages`  
**Authentication**: Required (`Authorization: Bearer <token>`)

## 1. Data Models

### User (Public Profile)
```typescript
interface PublicUser {
  _id: string;
  firstName: string;
  lastName: string;
  profilePhoto: string;
}
```

### Message
```typescript
interface Message {
  _id: string;
  conversation: string; // Conversation ID
  sender: PublicUser;
  receiver?: PublicUser; // Only for Direct messages
  content: string;
  media?: Array<{
    type: 'image' | 'video' | 'document';
    url: string;
    filename?: string;
  }>;
  isRead: boolean;
  readAt?: string; // ISO Date
  isBroadcast: boolean;
  isEdited: boolean; // [NEW]
  editedAt?: string; // [NEW] ISO Date
  createdAt: string; // ISO Date
}
```

### Conversation
```typescript
interface Conversation {
  id: string;
  type: 'DIRECT' | 'BROADCAST' | 'GROUP';
  lastMessage?: Message;
  lastMessageAt: string; // ISO Date
  // For Direct:
  otherParticipant?: PublicUser;
  // For Broadcast/Group:
  title?: string;
  description?: string;
  creator?: PublicUser;
  participantCount?: number;
}
```

---

## 2. HTTP Endpoints

### 🟢 Get Conversations
Fetch the list of active conversation threads (Inbox).

- **GET** `/conversations`
- **Query Params**:
  - `page`: number (default 1)
  - `limit`: number (default 20)
  - `type`: 'DIRECT' | 'BROADCAST' (optional)

**Response**:
```json
{
  "conversations": [
    {
      "id": "60d5ec...",
      "type": "DIRECT",
      "otherParticipant": {
        "firstName": "Jane",
        "lastName": "Doe",
        "profilePhoto": "..."
      },
      "lastMessage": { ... },
      "lastMessageAt": "2023-10-27T10:00:00Z"
    }
  ],
  "total": 5
}
```

### 🟢 Get Messages (Chat History)
Fetch messages for a specific conversation.

- **GET** `/conversations/:conversationId`
- **Query Params**:
  - `page`: number (default 1)
  - `limit`: number (default 50)

**Response**:
```json
{
  "messages": [ /* Array of Message objects */ ],
  "total": 150,
  "conversation": {
    "type": "DIRECT",
    "isBroadcast": false
  }
}
```

### 🔵 Send Message (Direct)
Send a one-to-one message.

- **POST** `/`
- **Body**:
```json
{
  "receiverId": "target_user_id",
  "content": "Hello there!",
  "media": [] // Optional
}
```

**Response** (201 Created):
```json
{
  "message": { ... },
  "conversation": { ... }
}
```

### 🟠 Edit Message
Edit a message content (within 15 minutes of sending).

- **PUT** `/:messageId`
- **Body**:
```json
{
  "content": "Updated text content"
}
```

**Response**: `200 OK` with updated Message object, or `400 Bad Request` if time window expired.

### 🔴 Delete Message
Delete a message (Soft delete).

- **DELETE** `/:messageId`

**Response**: `200 OK`

### 🟣 Mark as Read
Mark all messages in a conversation as read.

- **POST** `/conversations/:conversationId/read`

**Response**: `200 OK`

### 🔵 Unread Count
Get global unread badge counts.

- **GET** `/unread-count`

**Response**:
```json
{
  "direct": 5,
  "broadcast": 2,
  "total": 7
}
```

---

## 3. Real-time Events (Socket.io)

### Client -> Server Events
| Event | Payload | Description |
| :--- | :--- | :--- |
| `conversation:join` | `conversationId` | Join a chat room to receive updates (call this when opening a thread) |
| `conversation:leave` | `conversationId` | Leave a chat room |
| `typing:start` | `{ conversationId }` | Notify others that user is typing |
| `typing:stop` | `{ conversationId }` | Notify others that typing stopped |

### Server -> Client Events
| Event | Payload | Description |
| :--- | :--- | :--- |
| `message:new` | [Message](file:///Users/khalidsalman-yusuf/Documents/Unleashified/Active/WIFT-Africa-Backend/src/models/Message.ts#4-26) object | Received a new message in the current conversation room |
| `message:updated` | [Message](file:///Users/khalidsalman-yusuf/Documents/Unleashified/Active/WIFT-Africa-Backend/src/models/Message.ts#4-26) object | A message was edited. Update it in the specific UI bubble. |
| `message:deleted` | `{ messageId, conversationId }` | A message was deleted. Remove/Hide it in UI. |
| `message:read-by` | `{ messageId, userId }` | Update the "Blue ticks" / read receipts for a specific message. |
| `notification:new-message` | `{ message, conversationId }` | Received a message while **NOT** in the conversation room (Global notification). |
