Backend API Modules
Summary
Total modules found: 11 Total endpoints found: ~104

Module List
1. Auth
Location: src/modules/auth/auth.routes.ts
Endpoints: 10 endpoints
Description: Handles registration, login (email/password & Google), email verification, password resets, and token refreshing.
2. Onboarding
Location: src/modules/onboarding/onboarding.routes.ts
Endpoints: 6 endpoints
Description: Manages the multi-step user onboarding process including role selection, specializations, chapter selection, and initial profile setup.
3. Users
Location: src/modules/users/users.routes.ts
Endpoints: 14 endpoints
Description: Managing private user data including profile updates, privacy settings, username changes, and CV uploads/downloads.
4. Profiles
Location: src/modules/users/profiles.routes.ts
Endpoints: 1 endpoint
Description: Provides public access to user profiles based on privacy settings.
5. Chapters
Location: src/modules/chapters/chapters.routes.ts
Endpoints: 4 endpoints
Description: Admin-facing routes for managing chapter membership requests and viewing chapter members.
6. Admin
Location: src/modules/admin/admin.routes.ts
Endpoints: 20 endpoints
Description: Extensive administration features for chapter management (create/edit/soft-delete), statistics, verification oversight, and admin assignment.
7. Posts
Location: src/modules/posts/posts.routes.ts
Endpoints: 17 endpoints
Description: Social feed functionality supporting post creation, multimedia, comments, likes, saving, and sharing (with visibility controls).
8. Messages
Location: src/modules/messages/messages.routes.ts
Endpoints: 9 endpoints
Description: Real-time messaging system for direct user-to-user chats and admin-led broadcast announcements.
9. Connections
Location: src/modules/connections/connections.routes.ts
Endpoints: 10 endpoints
Description: Networking features to manage connection requests (send, accept, decline), view connections, and block users.
10. Search & Discovery
Location: src/modules/search/search.routes.ts
Endpoints: 5 endpoints
Description: Advanced user search with filtering (roles, location, skills), skills autocomplete, and connection recommendations.
11. Notifications
Location: src/modules/notifications/notifications.routes.ts
Endpoints: 8 endpoints
Description: Manages user notifications, read states, unread counts, push token registration, and notification preferences.