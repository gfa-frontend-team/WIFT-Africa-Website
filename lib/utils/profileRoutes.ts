/**
 * Utility functions for profile route detection and management
 */

// Reserved routes that should NOT be treated as usernames
const RESERVED_ROUTES = [
  '/feed',
  '/members',
  '/opportunities',
  '/events',
  '/resources',
  '/messages',
  '/notifications',
  '/connections',
  '/settings',
  '/me',
  '/profile',
  '/verification',
  '/login',
  '/register',
  '/verify-email',
  '/onboarding',
  '/landing',
  '/api',
  '/_next',
  '/favicon.ico',
]

/**
 * Check if a pathname is a profile route (/{username} pattern)
 */
export function isProfileRoute(pathname: string): boolean {
  // Check if it's a single-segment path (like /username) and not reserved
  const isReservedRoute = RESERVED_ROUTES.some(route => pathname.startsWith(route))
  return !isReservedRoute && pathname.match(/^\/[\w-]+$/) !== null
}

/**
 * Check if a pathname is a profile edit route (/{username}/edit pattern)
 */
export function isProfileEditRoute(pathname: string): boolean {
  if (!pathname.match(/^\/[\w-]+\/edit$/)) return false
  
  // Check if it's not a reserved route with /edit
  const baseRoute = pathname.replace('/edit', '')
  const isReservedBase = RESERVED_ROUTES.some(route => baseRoute.startsWith(route))
  
  return !isReservedBase
}

/**
 * Extract username from profile route
 */
export function getUsernameFromPath(pathname: string): string | null {
  if (isProfileRoute(pathname)) {
    return pathname.slice(1) // Remove leading slash
  }
  
  if (isProfileEditRoute(pathname)) {
    return pathname.split('/')[1] // Get username part
  }
  
  return null
}

/**
 * Check if user is viewing their own profile
 */
export function isOwnProfile(pathname: string, currentUsername?: string): boolean {
  if (!currentUsername) return false
  
  const usernameFromPath = getUsernameFromPath(pathname)
  return usernameFromPath === currentUsername
}

/**
 * Check if current route should use dashboard layout for authenticated users
 */
export function shouldUseDashboardLayout(pathname: string, isAuthenticated: boolean): boolean {
  // Always use dashboard layout for authenticated users on profile routes
  return isAuthenticated && (isProfileRoute(pathname) || isProfileEditRoute(pathname))
}

/**
 * Get the appropriate redirect path for profile edit routes
 */
export function getProfileEditRedirect(pathname: string, currentUsername?: string): string {
  const usernameFromPath = getUsernameFromPath(pathname)
  
  // If viewing own profile edit, redirect to /me/edit
  if (currentUsername && usernameFromPath === currentUsername) {
    return '/me/edit'
  }
  
  // If not authenticated or not own profile, redirect to login
  return '/login'
}