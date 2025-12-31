# Messaging Subsystem Analysis

## Overview
The messaging subsystem in the WIFT Africa Backend is a hybrid implementation combining **REST API** for persistence/operations and **Socket.io** for real-time delivery. It supports both **Direct Messages (1-to-1)** and **Broadcast Messages (1-to-Many)**.

## Architecture
- **Frameworks**: Express.js (REST), Socket.io (Real-time).
- **Database**: MongoDB (Mongoose) for storing messages and conversations.
- **Authentication**: JWT-based. Socket connections are authenticated via a `token` in the handshake.
- **Components**:
  - [src/socket/socketServer.ts](file:///Users/khalidsalman-yusuf/Documents/Unleashified/Active/WIFT-Africa-Backend/src/socket/socketServer.ts): Manages real-time connections, rooms, and event emission.
  - [src/modules/messages](file:///Users/khalidsalman-yusuf/Documents/Unleashified/Active/WIFT-Africa-Backend/src/modules/messages): Contains REST API Routes and Controllers.
  - [src/services/message.service.ts](file:///Users/khalidsalman-yusuf/Documents/Unleashified/Active/WIFT-Africa-Backend/src/services/message.service.ts): Core business logic.
  - [src/models/Message.ts](file:///Users/khalidsalman-yusuf/Documents/Unleashified/Active/WIFT-Africa-Backend/src/models/Message.ts) & [src/models/Conversation.ts](file:///Users/khalidsalman-yusuf/Documents/Unleashified/Active/WIFT-Africa-Backend/src/models/Conversation.ts): Data models.

## Real-Time Setup (Socket.io)
### Connection & Authentication
- Clients connect via WebSocket (with polling fallback).
- **Authentication**: Middleware extracting JWT from `auth.token` or `headers.authorization`.
- **User Tracking**: Maps `userId` to a Set of `socketId`s (allowing multi-device support).

### Rooms
- **User Room** (`user:{userId}`): For private notifications and messages targeting specific users.
- **Conversation Room** (`conversation:{conversationId}`): For events within a specific chat context (typing, read receipts).

### Events
| Event Name | Direction | Payload | Description |
|------------|-----------|---------|-------------|
| `connection` | Client -> Server | - | Authenticates and joins `user:{userId}` room. emits `user:status-change`. |
| `typing:start` | Client -> Server | `{ conversationId }` | Broadcasts `user:typing` to conversation room. |
| `typing:stop` | Client -> Server | `{ conversationId }` | Broadcasts `user:stopped-typing`. |
| `conversation:join` | Client -> Server | `conversationId` | Joins the socket to the conversation room. |
| `conversation:leave` | Client -> Server | `conversationId` | Leaves the conversation room. |
| `message:read` | Client -> Server | `{ messageId, conversationId }` | Emits `message:read-by` to conversation. |
| `message:new` | Server -> Client | `Message Object` | Sent to `conversation:{id}` when a new message is created. |
| `notification:new-message` | Server -> Client | `{ message, conversationId }` | Sent to `user:{recipientId}` for push notification UI. |
| `message:broadcast` | Server -> Client | `Message Object` | Sent to `user:{recipientId}` for broadcast messages. |

## Data Models

### Conversation ([Conversation.ts](file:///Users/khalidsalman-yusuf/Documents/Unleashified/Active/WIFT-Africa-Backend/src/models/Conversation.ts))
- **Type**: `DIRECT` or `BROADCAST`.
- **Participants**: Array of User ObjectIds (Sender + Receiver(s)).
- **Last Message**: Reference to the latest [Message](file:///Users/khalidsalman-yusuf/Documents/Unleashified/Active/WIFT-Africa-Backend/src/models/Message.ts#4-24) (for list sorting/preview).
- **Creator**: Stores the admin ID for broadcasts.

### Message ([Message.ts](file:///Users/khalidsalman-yusuf/Documents/Unleashified/Active/WIFT-Africa-Backend/src/models/Message.ts))
- **Sender/Receiver**: User References.
- **Content**: Text content (max 10k chars).
- **Media**: Array of `{ type, url, filename }` (Image, Video, Document).
- **Flags**:
  - `isRead`: Boolean (for direct messages).
  - `readBy`: Array of User IDs (for broadcasts/group contexts).
  - `isBroadcast`: Boolean.
  - `isDeleted`: Soft delete flag.
  - `deletedFor`: Array of User IDs (allows "delete for me" functionality).

## Business Rules

### Direct Messaging
1.  **Creation**: Automatically finds or creates a `DIRECT` conversation between two users.
2.  **Validation**: Cannot send message to self. Receiver must exist.
3.  **Real-time**: Emits to `conversation` room AND recipient's `user` room.
4.  **Notifications**: Triggers `notificationService.notifyNewMessage`.

### Broadcast Messaging
1.  **Permission**: RESTRICTED to **Admins** only (Chapter Admin or Super Admin).
2.  **Recipient Types**:
    - `ALL`: All approved members (Super Admin only).
    - `CHAPTER`: Members of a specific chapter (Chapter Admin restricted to their own chapter).
    - `CUSTOM`: Specific list of user IDs.
3.  **Creation**: Creates a new `BROADCAST` conversation every time.
4.  **Tracking**: Tracks `recipientCount` and `readBy` list for statistics.

### Message Management
- **Read Status**:
    - Direct: Marks all unread messages in conversation as read.
    - Broadcast: Adds user to `readBy` array.
- **Deletion**:
    - Sender can "delete for everyone" (effectively) if it's a broadcast? (Code allows sender to soft-delete broadcast).
    - Direct messages support "Delete for me" (`deletedFor` array). If both delete, `isDeleted` becomes true.
- **Archiving**: Conversations can be archived per user (flag on Conversation model presumably, though service implementation suggests a simple `isArchived` flag which might affect both if not careful - *Note: Service sets `conversation.isArchived = true`, which implies it archives for EVERYONE since it's a single document. This might be a bug/feature depending on requirements.*).

## API Endpoints (`/api/v1/messages`)
- **POST /**: Send direct message.
- **POST /broadcast**: Send broadcast.
- **GET /conversations**: List conversations (pagination supported).
- **GET /conversations/:id**: Get history.
- **DELETE /:messageId**: Delete message.
- **GET /unread-count**: Global unread counter.
- **GET /broadcast/:id/stats**: Get open rates/stats for a broadcast.
