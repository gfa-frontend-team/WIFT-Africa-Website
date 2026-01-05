# Frontend Implementation Plan (Member-Focused)

## Summary
- **Total Modules Reviewed:** 16
- **Fully Implemented (Member Side):** 11 (Auth, Chapters, Events, Jobs, Onboarding, Posts, Profiles, Reports, Search, Upload, Users)
- **Partially Implemented:** 3 (Connections, Messages, Notifications)
- **Completely Missing:** 1 (Application)
- **Excluded:** Admin Module (Separate Codebase)

## Module: Application
### Overview
Manages job applications for the authenticated user.
### Status
- ❌ **Missing**
### Implementation Details
#### Missing Implementation
- **Endpoints:**
    - `GET /api/v1/application/me` (My Applications)
    - `GET /api/v1/application/:applicationId` (Details)
#### Implementation Steps
1.  **Create API Service (`lib/api/application.ts`):** Implement user-facing application endpoints.
2.  **Define Types (`types/application.ts`):** Define `Application` interface and `ApplicationStatus` enum.
3.  **Hooks:** Create `useMyApplications` and `useApplication` React Query hooks.
4.  **UI:** Create a "My Applications" page or section in the Jobs area.
#### Priority: High
#### Complexity: Medium

---

## Module: Connections
### Overview
User networking and connection management.
### Status
- ⚠️ **Needs Update**
### Implementation Details
#### Already Implemented
- List, Send, Accept/Reject, Remove, Block (Create), Stats, Check Status.
#### Missing Implementation
- `DELETE /api/v1/connections/block/:blockedUserId` (Unblock)
- `GET /api/v1/connections/blocked` (List Blocked Users)
#### Implementation Steps
1.  **Update API Service (`lib/api/connections.ts`):** Add `unblockUser` and `getBlockedUsers`.
2.  **UI:** Add a "Blocked Users" settings page or modal to manage/unblock users.
#### Priority: Medium
#### Complexity: Simple

---

## Module: Messages
### Overview
Direct messaging for members.
### Status
- ⚠️ **Needs Update**
### Implementation Details
#### Already Implemented
- Conversations, Messages, Send DM, Mark Read, Unread Count.
#### Missing Implementation
- **Endpoints:**
    - `POST /api/v1/messages/conversations/:conversationId/archive`
    - `DELETE /api/v1/messages/:messageId`
#### Implementation Steps
1.  **Update API Service (`lib/api/messages.ts`):** Add `archiveConversation` and `deleteMessage`.
2.  **UI:** Add "Archive" option to conversation list actions and "Delete" option to message bubbles.
#### Priority: Medium
#### Complexity: Simple

---

## Module: Notifications
### Overview
User notifications.
### Status
- ⚠️ **Needs Update**
### Implementation Details
#### Already Implemented
- List, Count, Mark Read, Preferences, Register Push.
#### Missing Implementation
- `DELETE /api/v1/notifications/push-tokens/:token` (Unregister)
#### Implementation Steps
1.  **Update API Service (`lib/api/notifications.ts`):** Add `unregisterPushToken`.
2.  **Logic:** Call this on Logout.
#### Priority: Low
#### Complexity: Simple

---

## Modules Fully Implemented for Members
The following modules appear to have all *documented member-facing* features implemented:

- **Auth:** Complete.
- **Chapters:** Public list and details are done. Joining is handled in Onboarding.
- **Events:** List, Details, RSVP currently implemented.
- **Jobs:** List, Details, Apply currently implemented.
- **Onboarding:** Complete.
- **Posts:** Feed, Create, Interactions, Comments complete.
- **Profiles:** Public profile view complete.
- **Reports:** Create report complete.
- **Search:** Users, Skills, Recommendations complete.
- **Upload:** File/Video upload complete.
- **Users:** Profile management, Settings, CV complete.
