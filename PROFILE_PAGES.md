# Profile Management Pages - Implementation Guide

This document outlines all the profile management pages implemented in the WIFT Africa member frontend.

## 📁 Pages Created

### 1. My Profile Page (`/me`)
**File:** `app/(authenticated)/me/page.tsx`

**Purpose:** View your own complete profile

**Features:**
- Display profile photo
- Show headline, bio, location
- Display roles and specializations
- Show availability status
- Display skills
- Show social links and portfolio
- Display CV/Resume with download option
- Quick actions: Edit Profile, Share Profile

**API Endpoints Used:**
- `GET /api/v1/users/me/profile`
- `GET /api/v1/users/me/cv/download` (for CV download)

---

### 2. Edit Profile Page (`/me/edit`)
**File:** `app/(authenticated)/me/edit/page.tsx`

**Purpose:** Comprehensive profile editing interface

**Features:**
- Upload/change profile photo
- Edit headline and bio
- Update location
- Change availability status
- Update social media links (Website, IMDb, LinkedIn, Instagram, Twitter)
- Upload/replace CV/Resume
- Delete CV
- Real-time character count for text fields
- File type and size validation

**API Endpoints Used:**
- `GET /api/v1/users/me/profile`
- `PATCH /api/v1/users/me/profile`
- `POST /api/v1/users/me/profile-photo`
- `POST /api/v1/users/me/cv`
- `DELETE /api/v1/users/me/cv`

**Validation:**
- Profile photo: JPG, PNG, WebP, max 5MB
- CV: PDF, DOC, DOCX, max 10MB
- Headline: max 100 characters
- Bio: max 1000 characters

---

### 3. Share Profile Page (`/me/share`)
**File:** `app/(authenticated)/me/share/page.tsx`

**Purpose:** Get shareable profile link and sharing options

**Features:**
- Display shareable profile URL
- Copy link to clipboard
- Native share API support (mobile)
- View public profile preview
- QR code placeholder (coming soon)
- Sharing tips and best practices
- Privacy settings reminder

**API Endpoints Used:**
- `GET /api/v1/users/me/share-link`

---

### 4. Public Profile View (`/profile/[username]`)
**File:** `app/(authenticated)/profile/[username]/page.tsx`

**Purpose:** View another user's public profile

**Features:**
- Display profile based on privacy settings
- Show profile photo, headline, bio
- Display roles and specializations
- Show availability status
- Display social links (if allowed by privacy)
- Action buttons: Connect, Message, Share
- Respects user's privacy settings

**API Endpoints Used:**
- `GET /api/v1/profiles/:identifier`

**Note:** This page respects the user's privacy settings and only shows information they've allowed to be public.

---

### 5. Privacy Settings Page (`/settings/privacy`)
**File:** `app/(authenticated)/settings/privacy/page.tsx`

**Purpose:** Control profile visibility and information sharing

**Features:**
- Profile visibility options:
  - Public (anyone can view)
  - Chapter Members Only
  - Connections Only
  - Private (only you)
- Toggle individual information visibility:
  - Show email address
  - Show phone number
  - Show social links
  - Show chapter
  - Show roles
- Real-time preview of changes
- Save all settings at once

**API Endpoints Used:**
- `GET /api/v1/users/me/privacy`
- `PATCH /api/v1/users/me/privacy`

---

### 6. Username Settings Page (`/settings/username`)
**File:** `app/(authenticated)/settings/username/page.tsx`

**Purpose:** Set or change custom username

**Features:**
- Display current username
- Real-time username availability check
- Username suggestions based on name
- Preview new profile URL
- Validation (3-30 chars, lowercase, numbers, hyphens)
- Visual feedback (available/taken)
- Change limit warning (3 times per month)

**API Endpoints Used:**
- `PATCH /api/v1/users/me/username`
- `GET /api/v1/users/me/username/check`
- `GET /api/v1/users/me/username/suggestions`

**Validation:**
- 3-30 characters
- Lowercase letters, numbers, and hyphens only
- Must be unique

---

### 7. Account Settings Page (`/settings/account`)
**File:** `app/(authenticated)/settings/account/page.tsx`

**Purpose:** Manage account-level settings and security

**Features:**
- Display account information:
  - Email address
  - Full name
  - Account type badge
  - Membership status badge
  - Chapter affiliation
- Security settings:
  - Change password (placeholder)
  - Email verification status
- Danger zone:
  - Delete account with confirmation
  - Type "DELETE" to confirm

**API Endpoints Used:**
- `GET /api/v1/users/me`
- `DELETE /api/v1/users/me` (not yet implemented)

---

### 8. Settings Hub Page (`/settings`)
**File:** `app/(authenticated)/settings/page.tsx`

**Purpose:** Central hub for all settings

**Features:**
- Grid of all settings sections
- Quick navigation to:
  - Profile Settings
  - Privacy Settings
  - Username Settings
  - Account Settings
  - Notifications (coming soon)
- Quick actions section
- Visual icons for each section

---

## 🎣 Custom Hooks

### `useProfile()`
**File:** `lib/hooks/useProfile.ts`

**Purpose:** Manage user's own profile data and operations

**Methods:**
- `loadProfile()` - Load current user's profile
- `updateProfile(data)` - Update profile information
- `uploadProfilePhoto(file)` - Upload profile photo
- `deleteProfilePhoto()` - Delete profile photo
- `uploadCV(file)` - Upload CV/Resume
- `deleteCV()` - Delete CV
- `downloadCV()` - Download CV as blob

**State:**
- `profile` - Current profile data
- `isLoading` - Loading state
- `error` - Error message

**Usage:**
```typescript
const { profile, isLoading, error, loadProfile, updateProfile } = useProfile()

useEffect(() => {
  loadProfile()
}, [])

const handleUpdate = async (data) => {
  await updateProfile(data)
}
```

---

### `usePublicProfile(identifier)`
**File:** `lib/hooks/useProfile.ts`

**Purpose:** Load and display public profiles

**Parameters:**
- `identifier` - Username, profileSlug, or user ID

**Methods:**
- `reload()` - Reload profile data

**State:**
- `profile` - Public profile data
- `isLoading` - Loading state
- `error` - Error message

**Usage:**
```typescript
const { profile, isLoading, error } = usePublicProfile(username)
```

---

## 🔗 Navigation Structure

```
/me                          → My Profile (view)
/me/edit                     → Edit Profile
/me/share                    → Share Profile

/profile/[username]          → Public Profile View

/settings                    → Settings Hub
/settings/privacy            → Privacy Settings
/settings/username           → Username Settings
/settings/account            → Account Settings
/settings/notifications      → Notifications (coming soon)
```

---

## 🎨 UI Components Used

All pages use consistent UI components:
- **Icons:** Lucide React
- **Loading States:** Spinner with message
- **Error States:** Red alert boxes
- **Success Messages:** Green alert boxes
- **Buttons:** Primary, secondary, destructive variants
- **Forms:** Consistent input styling with validation
- **Cards:** Border, rounded, with padding
- **Badges:** Status indicators with colors

---

## 🔐 Privacy & Security

### Privacy Levels:
1. **PUBLIC** - Anyone can view (even non-logged-in users)
2. **CHAPTER_ONLY** - Only chapter members can view
3. **CONNECTIONS_ONLY** - Only connections can view
4. **PRIVATE** - Only the user can view

### Information Visibility Toggles:
- Email address
- Phone number
- Social links
- Chapter affiliation
- Professional roles

### Security Features:
- File upload validation (type and size)
- Username uniqueness check
- Account deletion confirmation
- Email verification status
- Password change (placeholder)

---

## 📱 Responsive Design

All pages are fully responsive:
- Mobile-first approach
- Flexible layouts
- Touch-friendly buttons
- Readable text sizes
- Proper spacing on all devices

---

## ✅ Testing Checklist

### My Profile Page:
- [ ] Profile loads correctly
- [ ] All sections display properly
- [ ] CV download works
- [ ] Edit and Share buttons navigate correctly

### Edit Profile Page:
- [ ] Form pre-populates with existing data
- [ ] Photo upload works (with validation)
- [ ] CV upload works (with validation)
- [ ] Profile update saves correctly
- [ ] Character counters work
- [ ] Validation messages display

### Share Profile Page:
- [ ] Share link displays correctly
- [ ] Copy to clipboard works
- [ ] Native share API works (mobile)
- [ ] View public profile link works

### Public Profile Page:
- [ ] Profile loads by username
- [ ] Privacy settings are respected
- [ ] Connect/Message buttons work
- [ ] Share button works

### Privacy Settings:
- [ ] Current settings load correctly
- [ ] Visibility options work
- [ ] Toggle switches work
- [ ] Save updates correctly

### Username Settings:
- [ ] Current username displays
- [ ] Availability check works
- [ ] Suggestions load
- [ ] Update saves correctly
- [ ] Validation works

### Account Settings:
- [ ] Account info displays correctly
- [ ] Badges show correct status
- [ ] Delete confirmation works

---

## 🚀 Future Enhancements

### Phase 2:
- [ ] Portfolio/work showcase section
- [ ] Experience timeline
- [ ] Skills endorsements
- [ ] Profile views analytics
- [ ] QR code generation
- [ ] Profile completeness indicator

### Phase 3:
- [ ] Profile themes/customization
- [ ] Video introduction
- [ ] Featured projects
- [ ] Recommendations section
- [ ] Activity feed on profile

---

## 🐛 Known Issues

None currently. Report issues to the development team.

---

## 📚 Related Documentation

- [Backend API Documentation](../wift-africa-backend/docs/API_DOCUMENTATION.md)
- [Backend Architecture](../wift-africa-backend/BACKEND_ARCHITECTURE_SUMMARY.md)
- [Frontend README](./README.md)
- [Theme Documentation](./docs/THEME.md)

---

## 👨‍💻 Development Notes

### Adding New Profile Fields:

1. **Update Backend Model** (`wift-africa-backend/src/models/Profile.ts`)
2. **Update Backend API** (controller and service)
3. **Update Frontend Types** (`types/index.ts`)
4. **Update API Client** (`lib/api/users.ts`)
5. **Update Edit Profile Page** (add form field)
6. **Update My Profile Page** (display field)
7. **Update Public Profile Page** (display field with privacy check)

### Adding New Settings Page:

1. Create page in `app/(authenticated)/settings/[name]/page.tsx`
2. Add route to Settings Hub (`app/(authenticated)/settings/page.tsx`)
3. Create API endpoint if needed
4. Update API client
5. Test thoroughly

---

**Last Updated:** December 2024
**Version:** 1.0.0
