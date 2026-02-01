# Messaging System Study

This document provides a comprehensive analysis of the WIFT Africa Backend messaging architecture, covering data models, service logic, real-time capabilities via Socket.io, and performance considerations.

## 1. Architecture Overview

The messaging system is built on a hybrid architecture combining **MongoDB** for persistent storage and **Socket.io (backed by Redis)** for real-time delivery.

-   **Persistence Layer**: Messages and Conversations are stored in MongoDB.
-   **Real-time Layer**: Socket.io handles instant delivery of messages, typing indicators, and read receipts.
-   **Scalability**: Redis Adapter for Socket.io enables horizontal scaling across multiple server instances.

## 2. Data Models

### Conversation Model ([src/models/Conversation.ts](file:///Users/khalidsalman-yusuf/Documents/Unleashified/Active/WIFT-Africa-Backend/src/models/Conversation.ts))
The [Conversation](file:///Users/khalidsalman-yusuf/Documents/Unleashified/Active/WIFT-Africa-Backend/src/models/Conversation.ts#10-27) model acts as the container for messages.
-   **Types**: `DIRECT`, `GROUP`, `BROADCAST`.
-   **Participants**: Array of User ObjectIds (`participants`).
    -   *Crucial Detail*: For `DIRECT` and `GROUP`, all users are explicitly listed.
    -   *Optimization*: For large `BROADCAST` (e.g., "All Members"), `participants` only contains the creator to avoid arrays with thousands of IDs. Targeting is handled via `metadata` (`targetType`, `targetChapterId`).
-   **Indexing**: Well-indexed for fetching user conversations (`participants`, `lastMessageAt`).

### Message Model ([src/models/Message.ts](file:///Users/khalidsalman-yusuf/Documents/Unleashified/Active/WIFT-Africa-Backend/src/models/Message.ts))
The [Message](file:///Users/khalidsalman-yusuf/Documents/Unleashified/Active/WIFT-Africa-Backend/src/models/Message.ts#4-24) model stores individual interactions.
-   **References**: Links to [Conversation](file:///Users/khalidsalman-yusuf/Documents/Unleashified/Active/WIFT-Africa-Backend/src/models/Conversation.ts#10-27) and [User](file:///Users/khalidsalman-yusuf/Documents/Unleashified/Active/WIFT-Africa-Backend/src/models/User.ts#44-91) (sender/receiver).
-   **Content**: Text content (max 10k chars) and media attachments array.
-   **Status**:
    -   `isRead`/`readAt`/`readBy`: Tracks read status. `readBy` is an array for group/broadcast contexts.
    -   `isDeleted`/`deletedFor`: Supports "soft delete" where a message can be hidden for specific users while remaining for others.
-   **Indexing**: Optimized for conversation retrieval (`conversation`, `createdAt`) and unread counts (`receiver`, `isRead`).

## 3. Core Features & Logic

### Direct Messaging
-   **Flow**: User sends message -> [findOrCreateDirectConversation](file:///Users/khalidsalman-yusuf/Documents/Unleashified/Active/WIFT-Africa-Backend/src/services/message.service.ts#690-711) -> Message created -> Socket emitted -> Notification service triggered.
-   **Safety**: Explicit check to prevent self-messaging.

### Broadcast Messaging (Admin Feature)
-   **Scalability Design**:
    -   Broadcasts do **not** create individual copies of messages for every user (which would be O(N) storage).
    -   Instead, a single [Message](file:///Users/khalidsalman-yusuf/Documents/Unleashified/Active/WIFT-Africa-Backend/src/models/Message.ts#4-24) document is created with `isBroadcast: true`.
    -   **Targeting**: `recipientType` (ALL, CHAPTER, CUSTOM) determines who sees it.
-   **Read Tracking**: Uses `readBy` array on the single message document.
    -   *Potential Limitation*: If 10,000 users read a broadcast, the `readBy` array will grow large (10k ObjectIds is ~120KB, well within 16MB doc limit, but worth monitoring).

### Real-time Socket System
-   **Authentication**: JWT-based handshake ensures secure connections.
-   **Room Structure**:
    -   `user:{userId}`: Personal room for notifications/direct messages.
    -   `conversation:{convId}`: shared room for active chats.
    -   `broadcast:all` / `chapter:{id}`: Pub/Sub rooms for mass broadcasts.
-   **Redis Adapter**: Configured to sync events across multiple server nodes.

## 4. Performance & Scalability Analysis

### Strengths
1.  **Efficient Writes**: sending a broadcast to "All Users" is a single O(1) database write.
2.  **Hybrid Real-time**: Connects users to relevant rooms dynamically, reducing unnecessary event traffic.
3.  **Indexing**: Critical paths (fetching chat history, message lists) are fully covered by compound indexes.

### Weaknesses / Risks
1.  **Unread Count Complexity**:
    -   [getUnreadCount](file:///Users/khalidsalman-yusuf/Documents/Unleashified/Active/WIFT-Africa-Backend/src/services/message.service.ts#524-616) combines a fast direct count with a complex aggregation pipeline for broadcasts (`$lookup`, `$unwind`, `$match`).
    -   *Risk*: As [Message](file:///Users/khalidsalman-yusuf/Documents/Unleashified/Active/WIFT-Africa-Backend/src/models/Message.ts#4-24) collection grows (millions of records), the aggregation for broadcast unread counts will become slow because it scans `isBroadcast: true` messages.
    -   *Fix Proposed*: Denormalize "unread broadcast count" onto the User model or use a separate "UserConversationState" collection for faster lookups.

2.  **Broadcast Read Tracking**:
    -   Storing `readBy` arrays on high-traffic broadcasts might eventually cause document contention or growth issues.
    -   *Mitigation*: For "All User" broadcasts that are very old, we might stop tracking reads or archive them.

3.  **Connection Management**:
    -   Socket server manually tracks `userSockets` in a Map. This memory is local to the process. If a user connects to Node A but Node B needs to check [isUserOnline](file:///Users/khalidsalman-yusuf/Documents/Unleashified/Active/WIFT-Africa-Backend/src/socket/socketServer.ts#324-330), the current implementation might return false positives/negatives if not fully synced via Redis presence (currently it just syncs events).

## 5. Offline Handling
-   **Persistence**: All messages are saved to MongoDB first. If a user is offline, they fetch history ([getMessages](file:///Users/khalidsalman-yusuf/Documents/Unleashified/Active/WIFT-Africa-Backend/src/services/message.service.ts#298-378)) upon reconnection.
-   **Notifications**: The `notificationService` is triggered alongside sockets, creating persistent in-app notifications (and likely Push/Email downstream) ensuring delivery even if the socket event is missed.

## 6. Recommendations
1.  **Optimize Unread Counts**: Refactor [getUnreadCount](file:///Users/khalidsalman-yusuf/Documents/Unleashified/Active/WIFT-Africa-Backend/src/services/message.service.ts#524-616) to avoid heavy aggregations on every page load. Consider caching this value or maintaining a counter on the User profile.
2.  **Presence System**: Upgrade [isUserOnline](file:///Users/khalidsalman-yusuf/Documents/Unleashified/Active/WIFT-Africa-Backend/src/socket/socketServer.ts#324-330) to use Redis keys with TTLs instead of local memory Maps for accurate multi-server presence.
3.  **Message Archival**: Implement an automated job to archive or cold-store messages older than X years to keep working set size small.
