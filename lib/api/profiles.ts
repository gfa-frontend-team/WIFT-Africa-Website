import { apiClient } from './client'
import type { User, Profile } from '@/types'
import type { ProfileViewsResponse } from '@/types/analytics'

// ============================================
// PUBLIC PROFILES API
// ============================================

export interface PublicProfileResponse {
  profile: {
    // User fields
    id: string
    _id?: string
    firstName: string
    lastName: string
    username?: string
    profileSlug: string
    profilePhoto?: string
    email?: string
    accountType?: string
    membershipStatus?: string
    
    // Profile fields
    headline?: string
    bio?: string
    primaryRole: string
    roles?: string[]
    availabilityStatus: string
    location?: string
    
    // Specializations
    isMultihyphenate?: boolean
    writerSpecialization?: string
    crewSpecializations?: string[]
    businessSpecializations?: string[]
    
    // Social links
    website?: string
    imdbUrl?: string
    linkedinUrl?: string
    instagramHandle?: string
    twitterHandle?: string
    
    // Chapter
    chapter?: any
    
    // Privacy
    privacySettings?: any

    // Completeness
    completeness?: {
      completionPercentage: number
      missingFields: string[]
      isComplete: boolean
    }

    // Stats
    stats?: {
      postsCount: number
      connectionsCount: number
      viewsCount?: number
    }
  }
}

export const profilesApi = {
  /**
   * Get public profile by username, profileSlug, or user ID
   * @param identifier - Username, profileSlug, or user ID
   */
  getPublicProfile: async (identifier: string): Promise<PublicProfileResponse> => {
    return await apiClient.get<PublicProfileResponse>(`/profiles/${identifier}`)
  },

  /**
   * Get analytics for profile views
   * @param userId - The ID of the profile owner (must be current user)
   * @param lastMonth - If true, return stats for last 30 days, else last 90 days
   */
  getProfileViews: async (userId: string, lastMonth: boolean = false): Promise<ProfileViewsResponse> => {
    const response = await apiClient.get<ProfileViewsResponse>(`/profiles/views/${userId}`, {
      params: { lastMonth },
    })
    return response
  },
}
