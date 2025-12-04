# Profile Routing - How It Works

## Overview

The WIFT Africa platform uses a clean URL structure for user profiles, similar to LinkedIn or Twitter. Users can access profiles via `wiftafrica.org/username` instead of `wiftafrica.org/profile/username`.

---

## URL Structure

### Public-Facing URLs (What users see):
```
http://localhost:3000/jane-doe          → Jane Doe's profile
http://localhost:3000/john-smith        → John Smith's profile
```

### Internal Routes (How Next.js handles it):
```
/profile/[username]                     → Dynamic route that renders the profile
```

---

## How It Works

### 1. Middleware Rewrite

**File:** `middleware.ts`

When a user visits `/username`, the middleware:

1. Checks if the path matches a reserved route (feed, members, settings, etc.)
2. If NOT reserved, it rewrites `/username` to `/profile/username`
3. The URL in the browser stays as `/username` (user-friendly)
4. Next.js internally routes to `/profile/[username]/page.tsx`

**Reserved Routes (NOT treated as usernames):**
- `/feed`
- `/members`
- `/opportunities`
- `/events`
- `/resources`
- `/messages`
- `/notifications`
- `/connections`
- `/settings`
- `/me`
- `/profile` ← **Important!** Prevents double-rewriting
- `/login`
- `/register`
- `/verify-email`
- `/onboarding`
- `/api`
- `/_next`
- `/favicon.ico`

### 2. Profile Page Component

**File:** `app/(authenticated)/profile/[username]/page.tsx`

The profile page:

1. Extracts `username` from URL params
2. Calls backend API: `GET /api/v1/profiles/:identifier`
3. Backend looks up user by username or profileSlug
4. Backend applies privacy filtering based on viewer relationship
5. Returns filtered profile data
6. Page renders the profile

### 3. Backend API

**Endpoint:** `GET /api/v1/profiles/:identifier`

**File:** `wift-africa-backend/src/modules/users/profiles.routes.ts`

The backend:

1. Receives identifier (username, profileSlug, or user ID)
2. Tries to find user by username first
3. Falls back to user ID if username not found
4. Checks privacy settings
5. Determines viewer relationship (self, same_chapter, authenticated, public)
6. Filters data based on privacy settings
7. Returns public profile data

---

## Privacy Levels

### Profile Visibility Options:

1. **PUBLIC** - Anyone can view (even non-logged-in users)
2. **CHAPTER_ONLY** - Only members of the same chapter can view
3. **CONNECTIONS_ONLY** - Only connections can view (Phase 2)
4. **PRIVATE** - Only the profile owner can view

### Viewer Relationships:

1. **self** - Viewing your own profile (full access)
2. **same_chapter** - Viewer is in the same chapter
3. **authenticated** - Viewer is logged in but different chapter
4. **public** - Not logged in

### Data Filtering:

Based on privacy settings, the backend filters:
- Email address (showEmail)
- Phone number (showPhone)
- Social links (showSocialLinks)
- Chapter affiliation (showChapter)
- Professional roles (showRoles)

---

## Example Flow

### Scenario: User visits `/jane-doe`

1. **Browser:** User types `http://localhost:3000/jane-doe`

2. **Middleware:**
   - Checks if `/jane-doe` is a reserved route → NO
   - Rewrites to `/profile/jane-doe`
   - URL stays as `/jane-doe` in browser

3. **Next.js Router:**
   - Matches `/profile/[username]` route
   - Renders `app/(authenticated)/profile/[username]/page.tsx`
   - Passes `{ username: 'jane-doe' }` as params

4. **Profile Page:**
   - Extracts `username = 'jane-doe'`
   - Calls `profilesApi.getPublicProfile('jane-doe')`

5. **API Client:**
   - Makes request: `GET http://localhost:3001/api/v1/profiles/jane-doe`

6. **Backend:**
   - Finds user with username 'jane-doe'
   - Checks viewer's authentication status
   - Determines relationship (e.g., 'authenticated')
   - Checks privacy settings (e.g., 'PUBLIC')
   - Filters profile data
   - Returns: `{ profile: { firstName, lastName, bio, ... } }`

7. **Profile Page:**
   - Receives profile data
   - Renders profile UI
   - Shows Connect, Message, Share buttons

---

## Share Links

### Backend Generation

**File:** `wift-africa-backend/src/services/user.service.ts`

```typescript
async getShareLink(userId: string) {
  const user = await User.findById(userId);
  const identifier = user.username || user.profileSlug;
  const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  const profileUrl = `${baseUrl}/${identifier}`;  // Clean URL format
  
  return {
    url: profileUrl,
    username: user.username,
    profileSlug: user.profileSlug,
  };
}
```

### Frontend Display

**File:** `app/(authenticated)/me/share/page.tsx`

The share page displays the clean URL:
```
http://localhost:3000/jane-doe
```

NOT:
```
http://localhost:3000/profile/jane-doe  ❌
```

---

## Troubleshooting

### Issue: Profile redirects to feed page

**Possible Causes:**

1. **Authenticated Layout Redirect**
   - The authenticated layout checks if user is logged in, email verified, and onboarding complete
   - If any check fails, it redirects to the appropriate page
   - **Solution:** Ensure you're logged in and have completed onboarding

2. **Username Not Found**
   - The backend returns 404 if username doesn't exist
   - **Solution:** Check that the username exists in the database

3. **Privacy Settings**
   - Profile might be set to PRIVATE
   - **Solution:** Check user's privacy settings

4. **Middleware Issue**
   - `/profile` not in reserved routes list
   - **Solution:** Ensure `/profile` is in the `reservedRoutes` array in `middleware.ts`

### Issue: 404 Not Found

**Possible Causes:**

1. **Username doesn't exist**
   - User hasn't set a custom username
   - **Solution:** Use profileSlug instead (e.g., `jane-doe` auto-generated from name)

2. **Backend not running**
   - API server not started
   - **Solution:** Run `npm run dev` in backend directory

3. **Wrong API URL**
   - Frontend pointing to wrong backend URL
   - **Solution:** Check `.env.local` has correct `NEXT_PUBLIC_API_URL`

### Issue: Profile shows limited data

**Possible Causes:**

1. **Privacy settings**
   - User has restricted visibility
   - **Solution:** This is expected behavior based on privacy settings

2. **Not same chapter**
   - Profile set to CHAPTER_ONLY but viewer is from different chapter
   - **Solution:** This is expected behavior

---

## Testing

### Test Cases:

1. **View own profile:**
   ```
   Visit: /me
   Expected: Full profile with all data
   ```

2. **View another user's public profile:**
   ```
   Visit: /jane-doe
   Expected: Profile with public data only
   ```

3. **View private profile:**
   ```
   Visit: /private-user
   Expected: "This profile is private" error
   ```

4. **View non-existent profile:**
   ```
   Visit: /nonexistent
   Expected: "Profile not found" error
   ```

5. **Share link:**
   ```
   Visit: /me/share
   Copy link: http://localhost:3000/jane-doe
   Open in new tab: Should show profile
   ```

---

## Development Notes

### Adding New Reserved Routes:

If you add a new top-level route (e.g., `/jobs`), add it to the `reservedRoutes` array in `middleware.ts`:

```typescript
const reservedRoutes = [
  // ... existing routes
  '/jobs',  // Add new route here
]
```

### Changing URL Structure:

If you want to change from `/username` to a different format (e.g., `/u/username`):

1. Update middleware rewrite logic
2. Update share link generation in backend
3. Update all internal links in frontend

### Username vs ProfileSlug:

- **username**: Custom username set by user (optional)
- **profileSlug**: Auto-generated from name (always exists)
- Backend tries username first, falls back to profileSlug
- Both work in URLs

---

## API Endpoints Summary

### Public Profile:
```
GET /api/v1/profiles/:identifier
- identifier: username, profileSlug, or user ID
- Optional authentication (uses optionalAuth middleware)
- Returns filtered profile data based on privacy
```

### Share Link:
```
GET /api/v1/users/me/share-link
- Requires authentication
- Returns shareable profile URL
```

### Privacy Settings:
```
GET /api/v1/users/me/privacy
PATCH /api/v1/users/me/privacy
- Requires authentication
- Get/update privacy settings
```

---

## Security Considerations

1. **Privacy Enforcement:**
   - Backend enforces privacy at API level
   - Frontend cannot bypass privacy settings
   - Viewer relationship determined server-side

2. **Authentication:**
   - Public profiles accessible without login (if PUBLIC)
   - Authenticated users see more data (based on relationship)
   - Profile owner sees everything

3. **Rate Limiting:**
   - API has rate limiting (100 requests per 15 minutes)
   - Prevents profile scraping

4. **Data Filtering:**
   - Backend filters data before sending to frontend
   - Frontend never receives private data
   - No client-side privacy logic needed

---

**Last Updated:** December 2024
**Version:** 1.0.0
