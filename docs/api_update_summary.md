# API Documentation Update Summary

This document summarizes the changes made to the `docs/api-v1` directory to align with the current backend implementation.

## New API Modules Documented

The following modules were identified in the codebase (`src/modules`) but were missing from the documentation. New documentation files have been created for them:

*   **Events**: `docs/api-v1/events/endpoints.md`
    *   Added documentation for listing events, event details, RSVP functionality, and admin event management (create, update, cancel, attendees).
*   **Uploads**: `docs/api-v1/upload/endpoints.md`
    *   Added documentation for generic file uploads (images/docs) and video SAS token generation for Azure Blob Storage.

## Updated Documentation

The following documentation files were updated to include previously undocumented endpoints:

*   **Admin**: `docs/api-v1/admin/endpoints.md`
    *   Added **Chapter Management** endpoints:
        *   `DELETE /chapters/:id` (Deactivate)
        *   `POST /chapters/:id/reactivate` (Reactivate)
        *   `DELETE /chapters/:id/admins/:userId` (Remove Admin)
    *   Added **Verification** endpoints:
        *   `POST /verification/check-delays`
    *   Added **Moderation** endpoints:
        *   `PATCH /posts/:postId/hide`
        *   `PATCH /posts/:postId/unhide`
        *   `GET /posts/moderation-log`
    *   Added **Monitoring** endpoints:
        *   `GET /monitoring/realtime`
        *   `GET /monitoring/system`

*   **Connections**: `docs/api-v1/connections/endpoints.md`
    *   Added `GET /connections/blocked` (Get Blocked Users).

*   **Messages**: `docs/api-v1/messages/endpoints.md`
    *   Added `POST /conversations/:conversationId/archive` (Archive Conversation).
    *   Added `DELETE /:messageId` (Delete Message).

## Verified (Unchanged) Documentation

The following modules were reviewed, and their existing documentation was found to be accurate and up-to-date with the codebase:

*   **Auth**: `docs/api-v1/auth/endpoints.md`
*   **Chapters**: `docs/api-v1/chapters/endpoints.md`
*   **Notifications**: `docs/api-v1/notifications/endpoints.md`
*   **Onboarding**: `docs/api-v1/onboarding/endpoints.md`
*   **Posts**: `docs/api-v1/posts/endpoints.md`
*   **Search**: `docs/api-v1/search/endpoints.md`
*   **Users & Profiles**: `docs/api-v1/users/endpoints.md`, `docs/api-v1/profiles/endpoints.md`
