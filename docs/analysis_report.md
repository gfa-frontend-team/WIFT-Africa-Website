# Frontend Codebase & Messaging Analysis Report

## 1. Codebase Overview

### Tech Stack
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4, CLSX, Tailwind Merge
- **State Management**: Zustand v5 (specifically `useMessageStore`, though largely deprecated in favor of React Query)
- **Data Fetching**: TanStack Query (React Query) v5
- **Icons**: Lucide React
- **Validation**: Zod
- **Testing**: Vitest, React Testing Library

### Project Structure
- **`app/`**: Contains the application routes.
    - [(auth)](file:///Users/khalidsalman-yusuf/Documents/Unleashified/Active/wift-africa-member-frontend/lib/hooks/useMessages.ts#10-11): Login/Signup routes.
    - [(authenticated)](file:///Users/khalidsalman-yusuf/Documents/Unleashified/Active/wift-africa-member-frontend/lib/hooks/useMessages.ts#10-11): Main protected application routes (Dashboard, Messages, Profile, etc.).
- **`components/`**: Reusable UI components, organized by feature (e.g., `messages`, `layout`, `profile`).
- **[lib/](file:///Users/khalidsalman-yusuf/Documents/Unleashified/Active/wift-africa-member-frontend/lib)**: Core logic and utilities.
    - `api/`: API service functions.
    - `hooks/`: Custom React hooks (e.g., [useMessages](file:///Users/khalidsalman-yusuf/Documents/Unleashified/Active/wift-africa-member-frontend/lib/hooks/useMessages.ts#14-80)).
    - `stores/`: Zustand stores.
- **`docs/`**: Internal documentation, including detailed API V1 specifications.

---

## 2. Messaging Module Analysis

The messaging system is designed to support both **Direct Peer-to-Peer Messaging** and **Admin Broadcasts**.

### Architecture & Setup
- **Page Location**: [app/(authenticated)/messages/page.tsx](file:///Users/khalidsalman-yusuf/Documents/Unleashified/Active/wift-africa-member-frontend/app/%28authenticated%29/messages/page.tsx)
    - Handles routing logic (`?id=` for conversations, `?userId=` for new chats).
    - Manages responsive layout (list vs. thread view on mobile).
- **State Management**:
    - **Primary**: [lib/hooks/useMessages.ts](file:///Users/khalidsalman-yusuf/Documents/Unleashified/Active/wift-africa-member-frontend/lib/hooks/useMessages.ts) uses React Query.
    - **Polling Strategy**:
        - **Conversations List**: Polls every **60 seconds**.
        - **Unread Counts**: Polls every **30 seconds**.
        - **Thread Messages**: No active polling in the code seen; relies on manual refresh or cache invalidation on send. `staleTime` is 0 for threads to ensure freshness on open.
- **Components**:
    - **[ConversationList](file:///Users/khalidsalman-yusuf/Documents/Unleashified/Active/wift-africa-member-frontend/components/messages/ConversationList.tsx#14-110)**: Displays list of active conversations. Handles loading states and "no conversations" empty state.
    - **[MessageThread](file:///Users/khalidsalman-yusuf/Documents/Unleashified/Active/wift-africa-member-frontend/components/messages/MessageThread.tsx#18-235)**: Displays the chat history using **Infinite Scroll** (via `IntersectionObserver`).
    - **[MessageComposer](file:///Users/khalidsalman-yusuf/Documents/Unleashified/Active/wift-africa-member-frontend/components/messages/MessageComposer.tsx#13-91)**: Input area for sending text and attachments (UI groundwork present for attachments).

### API & Data Flow Rules
Based on `docs/api-v1/messages` and the implementation:

1.  **Conversation Types**:
    - `DIRECT`: 1-on-1 chats.
    - `BROADCAST`: One-to-many announcements from Admins.
2.  **New Conversation Flow**:
    - When a user clicks to message someone new, the URL updates to `?userId=XYZ`.
    - A temporary "fake" conversation object is created locally with ID starting with `new_`.
    - The conversation is **not created on the server** until the first message is sent.
    - Upon sending, the `sendMessage` mutation returns the real conversation ID, and the UI redirects to the permanent route.
3.  **Sending rules**:
    - Endpoint: `POST /api/v1/messages`
    - Requires `receiverId` and `content`.
    - `conversationId` is inferred or created by the backend based on the receiver.
4.  **Reading rules**:
    - Messages are marked as read (`POST /api/v1/messages/conversations/:id/read`) automatically when a thread is opened.
    - Unread counts are fetched separately to update badges.

### Documentation Insights (`docs/api-v1/messages`)
- **Key Resources**:
    - `endpoints.md`: Full Swagger-like definition of requests/responses.
    - `types.ts`: TypeScript interfaces mirroring the backend DTOs.
    - `examples.md`: Code snippets for usage.
- **Admin Capabilities**:
    - Admins can broadcast to `ALL`, specific `CHAPTER`s, or `CUSTOM` lists.
    - Admins can view read statistics for broadcasts.

### Key Findings & Recommendations
- **Real-time**: The current implementation relies on **polling** (React Query `refetchInterval`). There is no WebSocket implementation visible in the frontend code analyzed. usage of `setInterval` in documentation examples confirms this pattern.
- **Pagination**: Message threads use cursor/page-based infinite loading.
- **Mobile Responsiveness**: The main page explicitly handles mobile state to toggle between the conversation list and the active thread, ensuring a native-app-like feel.

---

## 3. Conclusion
The frontend is modern and well-structured, leveraging React Query for efficient server state management. The messaging system is robust enough for standard use cases, though it trades real-time instantaneity for simplicity (polling vs. sockets). The code is strongly typed and aligns well with the documentation in `docs/api-v1`.
