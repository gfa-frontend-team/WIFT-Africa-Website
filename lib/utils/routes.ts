/**
 * Route utility functions for generating URLs
 */

import { User } from "@/types"

/**
 * Generate profile URL using username or profileSlug
 * Priority: username > profileSlug > id (for backward compatibility)
 * @param user - User object with username, profileSlug, or id
 * @returns Profile URL (e.g., /in/jane-doe)
 */
export function getProfileUrl(user: {profileSlug?: string; id?: string } | string): string {

  
  // Handle legacy string parameter
  if (typeof user === 'string') {
    return `/in/${user}`
  }
  
  // Prefer username, fallback to profileSlug, then id
  const identifier =user.profileSlug || user.id
  if (!identifier) {
    console.warn('getProfileUrl: No valid identifier found', user)
    return '/feed'
  }
  
  // Warn if falling back to ID (indicates backend data is incomplete)
  if (!user.profileSlug && user.id && isIdBasedUrl(user.id)) {
    console.warn(
      `[Profile URL] Using ID-based URL for user. Backend should include username/profileSlug.`,
      { id: user.id, hasProfileSlug: !!user.profileSlug }
    )
  }
  
  return `/in/${identifier}`
}

/**
 * Check if a URL is using an ID (MongoDB ObjectId) instead of username/slug
 * This helps identify when backend data is missing username/profileSlug
 */
export function isIdBasedUrl(identifier: string): boolean {
  // MongoDB ObjectId is 24 hex characters
  return /^[0-9a-fA-F]{24}$/.test(identifier)
}

export function getProfileEditUrl(username: string): string {
  return `/in/${username}/edit`
}

export function getOwnProfileUrl(user: User | null): string {
  if (!user || !user.username) return '/login'
  return `/in/${user.username}`
}

export function getProfilePostsUrl(username: string): string {
  return `/in/${username}/posts`
}

export function getProfileConnectionsUrl(username: string): string {
  return `/in/${username}/connections`
}

export function getProfileActivityUrl(username: string): string {
  return `/in/${username}/activity`
}

export function getShareableProfileUrl(username: string, baseUrl?: string): string {
  const base = baseUrl || (typeof window !== 'undefined' ? window.location.origin : '')
  return `${base}/in/${username}`
}

export function extractUsernameFromUrl(url: string): string | null {
  // Match /in/username pattern
  const profileMatch = url.match(/^\/in\/([\w-]+)/)
  if (profileMatch) return profileMatch[1]
  
  // Match old /profile/username pattern for backward compatibility if needed, 
  // or just /username if we support root
  const usernameMatch = url.match(/^\/([\w-]+)/)
  if (usernameMatch) return usernameMatch[1]
  
  return null
}

export function isProfileUrl(url: string): boolean {
  return /^\/in\/[\w-]+/.test(url)
}
