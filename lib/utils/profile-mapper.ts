import type { UserProfileResponse } from '@/lib/api/users'
import type { PublicProfileResponse } from '@/lib/api/profiles'

/**
 * Maps a private UserProfileResponse (from /users/me) to a PublicProfileResponse
 * This allows reusing the ProfileContent component which expects the public structure
 */
export function mapPrivateToPublicProfile(privateProfile: any): PublicProfileResponse {
  console.log('Mapping private profile:', privateProfile) // Debug log

  // Handle case where API might return flattened object or unexpected structure
  // If privateProfile has 'user' and 'profile' props, use them.
  // Otherwise, if it has 'firstName' at root, assume it's a flattened user object.
  
  let user = privateProfile.user
  let profile = privateProfile.profile

  if (!user && privateProfile.firstName) {
    console.warn('Handling flattened profile response')
    user = privateProfile
    profile = privateProfile
  }

  // If still no user, we can't map
  if (!user) {
    console.error('Invalid profile structure', privateProfile)
    throw new Error('Invalid profile data structure')
  }

  // Ensure profile object exists if we are in flattened mode or if it was missing
  if (!profile) {
      profile = {}
  }

  return {
    profile: {
      // IDs
      id: user.id || user._id, 
      _id: user.id || user._id, // Ensure compatibility if component checks _id
      
      // User Basic Info
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      profileSlug: user.profileSlug,
      profilePhoto: user.profilePhoto,
      email: user.email,
      accountType: user.accountType,
      membershipStatus: user.membershipStatus,
      
      // Profile Details (try profile first, then user if flattened)
      headline: profile.headline || user.headline,
      bio: profile.bio || user.bio,
      primaryRole: profile.primaryRole || user.primaryRole,
      roles: profile.roles || user.roles,
      availabilityStatus: profile.availabilityStatus || user.availabilityStatus || 'NOT_LOOKING',
      location: profile.location || user.location,
      
      // Specializations
      isMultihyphenate: profile.isMultihyphenate ?? user.isMultihyphenate,
      writerSpecialization: profile.writerSpecialization ?? user.writerSpecialization,
      crewSpecializations: profile.crewSpecializations ?? user.crewSpecializations,
      businessSpecializations: profile.businessSpecializations ?? user.businessSpecializations,
      
      // Social Links
      website: profile.website ?? user.website,
      imdbUrl: profile.imdbUrl ?? user.imdbUrl,
      linkedinUrl: profile.linkedinUrl ?? user.linkedinUrl,
      instagramHandle: profile.instagramHandle ?? user.instagramHandle,
      twitterHandle: profile.twitterHandle ?? user.twitterHandle,
      
      // Extra fields
      chapter: user.chapter, 
      privacySettings: user.privacySettings 
    }
  }
}
