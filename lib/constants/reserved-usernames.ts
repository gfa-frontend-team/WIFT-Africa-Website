/**
 * Reserved usernames that cannot be used by members
 * These match route names to prevent conflicts
 */
export const RESERVED_USERNAMES = [
  // Main routes
  'feed',
  'members',
  'opportunities',
  'events',
  'resources',
  'chapters',
  'messages',
  'notifications',
  'connections',
  'settings',
  'me',
  'profile',
  
  // Auth routes
  'login',
  'register',
  'verify-email',
  'forgot-password',
  'reset-password',
  'onboarding',
  
  // API & Internal
  'api',
  'admin',
  '_next',
  'public',
  
  // Generic reserved
  'help',
  'support',
  'about',
  'contact',
  'terms',
  'privacy',
  'wift',
  'wiftafrica',
  'root',
  'system',
  'null',
  'undefined',
  'test',
  'demo',
]

/**
 * Check if a username is reserved
 */
export function isUsernameReserved(username: string): boolean {
  return RESERVED_USERNAMES.includes(username.toLowerCase())
}

/**
 * Validate username format and availability
 */
export function validateUsername(username: string): { valid: boolean; error?: string } {
  // Check length
  if (username.length < 3) {
    return { valid: false, error: 'Username must be at least 3 characters' }
  }
  if (username.length > 30) {
    return { valid: false, error: 'Username must be 30 characters or less' }
  }

  // Check format (lowercase, alphanumeric + hyphens)
  const usernameRegex = /^[a-z0-9-]+$/
  if (!usernameRegex.test(username)) {
    return {
      valid: false,
      error: 'Username can only contain lowercase letters, numbers, and hyphens',
    }
  }

  // Check for consecutive hyphens
  if (username.includes('--')) {
    return { valid: false, error: 'Username cannot contain consecutive hyphens' }
  }

  // Check if starts or ends with hyphen
  if (username.startsWith('-') || username.endsWith('-')) {
    return { valid: false, error: 'Username cannot start or end with a hyphen' }
  }

  // Check reserved words
  if (isUsernameReserved(username)) {
    return { valid: false, error: 'This username is reserved and cannot be used' }
  }

  return { valid: true }
}
