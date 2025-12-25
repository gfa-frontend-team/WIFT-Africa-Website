/**
 * Route utility functions for generating URLs
 */

/**
 * Generate profile URL
 * @param username - User's username or profileSlug
 * @returns Profile URL (e.g., /jane-doe)
 */
export function getProfileUrl(username: string): string {
  return `/in/${username}`
}

export function getProfileEditUrl(username: string): string {
  return `/in/${username}/edit`
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
