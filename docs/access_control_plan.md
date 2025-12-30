# Membership Access Control Analysis & Implementation Plan

## 1. Current State Assessment

The codebase currently has a solid foundation for access control but lacks consistent enforcement at the **Route/Page level**.

### What's Working
- **[useFeatureAccess](file:///Users/khalidsalman-yusuf/Documents/Unleashified/Active/wift-africa-member-frontend/lib/hooks/useFeatureAccess.ts#40-171) Hook**: This is the "Decision Engine". It correctly maps [MembershipStatus](file:///Users/khalidsalman-yusuf/Documents/Unleashified/Active/wift-africa-member-frontend/lib/stores/userStore.ts#64-65) (PENDING, SUSPENDED, APPROVED) to specific booleans like `canSendMessages`, `canRSVPEvents`.
- **[DashboardHeader](file:///Users/khalidsalman-yusuf/Documents/Unleashified/Active/wift-africa-member-frontend/components/layout/DashboardHeader.tsx#47-303)**: Correctly hides navigation links based on permissions.
- **[FeatureGate](file:///Users/khalidsalman-yusuf/Documents/Unleashified/Active/wift-africa-member-frontend/components/access/FeatureGate.tsx#19-106) Component**: A reusable wrapper to block UI sections and show "Restricted" banners.

### The Gaps (What's Missing)
- **Route Protection**: Pages like `/messages`, `/opportunities`, and `/connections` do **not** verify permissions when loaded.
    - *Example*: A `PENDING` user is hidden from the "Messages" link in the nav, but if they type `/messages` in the URL, the page loads fully.
- **Micro-Interaction Gates**: Some buttons (like "Connect" on a profile card) might rely on the backend to fail rather than the frontend UI disabling the button.

---

## 2. Proposed Restriction Matrix

Based on your [MembershipStatus](file:///Users/khalidsalman-yusuf/Documents/Unleashified/Active/wift-africa-member-frontend/lib/stores/userStore.ts#64-65) enum, here is the recommended Permission Matrix.

| Feature / Action | APPROVED | PENDING | SUSPENDED | REJECTED |
| :--- | :---: | :---: | :---: | :---: |
| **View Feed** | ✅ | ✅ | ❌ | ❌ |
| **View Resources & Events** | ✅ | ✅ | ❌ | ❌ |
| **View Public Directory** | ✅ | ✅ | ❌ | ❌ |
| **RSVP to Events** | ✅ | ❌ | ❌ | ❌ |
| **Apply for Opportunities** | ✅ | ❌ | ❌ | ❌ |
| **Send Messages (DM/Group)** | ✅ | ❌ | ❌ | ❌ |
| **Connect / Follow Members** | ✅ | ❌ | ❌ | ❌ |
| **Edit Profile Information** | ✅ | ✅ | ❌ | ❌ |
| **Change Username** | ✅ | ❌ | ❌ | ❌ |
| **Upload CV/Portfolio** | ✅ | ✅ | ❌ | ❌ |

> **Key Rule**: `PENDING` users are "Look but don't Touch". They can view content to see value, but cannot interact or take space until approved.

---

## 3. Implementation Plan: "The Route Guard"

To better follow the rules, we need to move enforcement **up** to the page level.

### Step 1: Create a `RouteGuard` Component
Instead of checking in every single [page.tsx](file:///Users/khalidsalman-yusuf/Documents/Unleashified/Active/wift-africa-member-frontend/app/page.tsx), we create a high-order component (HOC) or layout wrapper.

```tsx
// components/access/RouteGuard.tsx
'use client'
import { useRouter } from 'next/navigation'
import { useFeatureAccess } from '@/lib/hooks/useFeatureAccess'
import { useEffect } from 'react'

export default function RouteGuard({ children, feature }: { children: React.ReactNode, feature: keyof FeatureAccess }) {
  const { access, isLoading } = useFeatureAccess()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !access[feature]) {
       router.replace('/verification?reason=restricted')
    }
  }, [access, isLoading, feature, router])

  if (!access[feature]) return null // or a loading spinner
  
  return <>{children}</>
}
```

### Step 2: Protect Key Routes
We will wrap the page content of restricted areas.

**Target Files to Modify:**
1.  **[app/(authenticated)/messages/page.tsx](file:///Users/khalidsalman-yusuf/Documents/Unleashified/Active/wift-africa-member-frontend/app/%28authenticated%29/messages/page.tsx)**
    -   **Action**: Wrap content in `<RouteGuard feature="canSendMessages">`.
2.  **[app/(authenticated)/connections/page.tsx](file:///Users/khalidsalman-yusuf/Documents/Unleashified/Active/wift-africa-member-frontend/app/%28authenticated%29/connections/page.tsx)**
    -   **Action**: Wrap content in `<RouteGuard feature="canConnectWithMembers">`.
3.  **`app/(authenticated)/onboarding/page.tsx`**
    -   **Action**: Ensure only `PENDING` or `NEW` (if that status existed) can access.

### Step 3: Enhance [FeatureGate](file:///Users/khalidsalman-yusuf/Documents/Unleashified/Active/wift-africa-member-frontend/components/access/FeatureGate.tsx#19-106) Usage
We need to "gray out" interaction points for PENDING users instead of hiding them completely, to drive conversion.

-   **Events Page**: Show the "RSVP" button but make it **disabled** with a tooltip "Verification Required".
-   **Opportunities Page**: Show "Apply Now" as disabled for Pending users.

## 4. Verification Plan

### Automated Tests
-   Verify that [useFeatureAccess](file:///Users/khalidsalman-yusuf/Documents/Unleashified/Active/wift-africa-member-frontend/lib/hooks/useFeatureAccess.ts#40-171) returns correct `false` values for `PENDING` status.

### Manual Verification
1.  **Simulate PENDING User**:
    -   Temporarily hardcode `useUserStore` to return a `PENDING` user.
    -   **Test**: Click "Messages" in nav -> Should be hidden.
    -   **Test**: Manually go to `/messages` -> Should redirect to `/verification`.
    -   **Test**: Go to `/events` -> Should see events.
    -   **Test**: Try to RSVP -> Button should be disabled/show restriction modal.
2.  **Simulate SUSPENDED User**:
    -   **Test**: Login -> Should be redirected away from Feed or see a "Suspended" wall.
