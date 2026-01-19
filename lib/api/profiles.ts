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
    bannerUrl?: string // Added bannerUrl
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

  getProfileViews: async (userId: string, lastMonth: boolean = false): Promise<ProfileViewsResponse> => {
    const response = await apiClient.get<ProfileViewsResponse>(`/profiles/views/${userId}`, {
      params: { lastMonth },
    })
    return response
  },

  /**
   * Get experience list
   */
  getExperience: async (): Promise<any[]> => {
    // Note: The backend returns an array of experience objects
    return await apiClient.get<any[]>('/profiles/experience')
  },

  /**
   * Add experience
   */
  addExperience: async (data: any): Promise<any> => {
    return await apiClient.post<any>('/profiles/experience', data)
  },

  /**
   * Update experience
   */
  updateExperience: async (id: string, data: any): Promise<any> => {
    return await apiClient.put<any>(`/profiles/experience/${id}`, data)
  },

  /**
   * Delete experience
   */
  deleteExperience: async (id: string): Promise<void> => {
    await apiClient.delete(`/profiles/experience/${id}`)
  },
}
