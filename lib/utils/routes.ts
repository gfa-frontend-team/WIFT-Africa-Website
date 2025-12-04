/**
 * Route utility functions for generating URLs
 */

/**
 * Generate profile URL
 * @param username - User's username or profileSlug
 * @returns Profile URL (e.g., /jane-doe)
 */
export function getProfileUrl(username: string): string {
  return `/${username}`
}

/**
 * Generate profile edit URL
 * @param username - User's username or profileSlug
 * @returns Profile edit URL (e.g., /jane-doe/edit)
 */
export function getProfileEditUrl(username: string): string {
  return `/${username}/edit`
}

/**
 * Generate profile posts URL (future feature)
 * @param username - User's username or profileSlug
 * @returns Profile posts URL (e.g., /jane-doe/posts)
 */
export function getProfilePostsUrl(username: string): string {
  return `/${username}/posts`
}

/**
 * Generate profile connections URL (future feature)
 * @param username - User's username or profileSlug
 * @returns Profile connections URL (e.g., /jane-doe/connections)
 */
export function getProfileConnectionsUrl(username: string): string {
  return `/${username}/connections`
}

/**
 * Generate profile activity URL (future feature)
 * @param username - User's username or profileSlug
 * @returns Profile activity URL (e.g., /jane-doe/activity)
 */
export function getProfileActivityUrl(username: string): string {
  return `/${username}/activity`
}

/**
 * Generate shareable profile URL (full URL with domain)
 * @param username - User's username or profileSlug
 * @param baseUrl - Base URL (defaults to window.location.origin)
 * @returns Full profile URL (e.g., https://members.wiftafrica.org/jane-doe)
 */
export function getShareableProfileUrl(username: string, baseUrl?: string): string {
  const base = baseUrl || (typeof window !== 'undefined' ? window.location.origin : '')
  return `${base}/${username}`
}

/**
 * Extract username from profile URL
 * @param url - Profile URL (e.g., /jane-doe or /profile/jane-doe)
 * @returns Username
 */
export function extractUsernameFromUrl(url: string): string | null {
  // Match /username pattern
  const usernameMatch = url.match(/^\/([\w-]+)/)
  if (usernameMatch) return usernameMatch[1]
  
  // Match /profile/username pattern
  const profileMatch = url.match(/^\/profile\/([\w-]+)/)
  if (profileMatch) return profileMatch[1]
  
  return null
}

/**
 * Check if a URL is a profile URL
 * @param url - URL to check
 * @returns True if URL is a profile URL
 */
export function isProfileUrl(url: string): boolean {
  return /^\/[\w-]+$/.test(url) || /^\/profile\/[\w-]+/.test(url)
}
