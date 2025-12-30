import { apiClient } from './client'
import type { User, Profile, AvailabilityStatus } from '@/types'

// ============================================
// REQUEST/RESPONSE TYPES
// ============================================

export interface UserProfileResponse {
  user: User
  profile: Profile
}

export interface UpdateProfileInput {
  bio?: string
  headline?: string
  location?: string
  website?: string
  imdbUrl?: string
  linkedinUrl?: string
  instagramHandle?: string
  twitterHandle?: string
  availabilityStatus?: AvailabilityStatus
}

export interface PrivacySettings {
  profileVisibility: 'PUBLIC' | 'CHAPTER_ONLY' | 'CONNECTIONS_ONLY' | 'PRIVATE'
  showEmail: boolean
  showPhone: boolean
  showSocialLinks: boolean
  showChapter: boolean
  showRoles: boolean
}

export interface ShareLinkResponse {
  url: string
  username: string
  profileSlug: string
}

export interface UsernameCheckResponse {
  available: boolean
  username: string
  error?: string
}

export interface UsernameSuggestionsResponse {
  suggestions: string[]
}

export interface CVUploadResponse {
  message: string
  cvFileName: string
  cvUploadedAt: string
}

// ============================================
// USERS API
// ============================================

export const usersApi = {
  // ============================================
  // PROFILE MANAGEMENT
  // ============================================

  /**
   * Get current user information
   */
  getCurrentUser: async (): Promise<{ user: User }> => {
    const response = await apiClient.get<any>('/users/me')
    // Fix: Map backend userId to frontend id expected by types
    if (response.user) {
      if (response.user.userId && !response.user.id) {
        response.user.id = response.user.userId
      }
      // Ensure other ID mismatches are handled
      if (response.user._id && !response.user.id) {
        response.user.id = response.user._id
      }
    }
    return response as { user: User }
  },

  /**
   * Get complete user profile with roles and specializations
   */
  getProfile: async (): Promise<UserProfileResponse> => {
    return await apiClient.get<UserProfileResponse>('/users/me/profile')
  },

  /**
   * Update user profile
   */
  updateProfile: async (data: UpdateProfileInput): Promise<{ message: string; profile: Profile }> => {
    return await apiClient.patch<{ message: string; profile: Profile }>('/users/me/profile', data)
  },

  // ============================================
  // PROFILE PHOTO MANAGEMENT
  // ============================================

  /**
   * Upload profile photo
   * @param file - Image file (JPG, PNG, WebP, max 5MB)
   */
  uploadProfilePhoto: async (file: File): Promise<{ message: string; photoUrl: string }> => {
    const formData = new FormData()
    formData.append('photo', file)

    return await apiClient.post<{ message: string; photoUrl: string }>(
      '/users/me/profile-photo',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    )
  },

  /**
   * Delete profile photo
   */
  deleteProfilePhoto: async (): Promise<{ message: string }> => {
    return await apiClient.delete<{ message: string }>('/users/me/profile-photo')
  },

  // ============================================
  // USERNAME MANAGEMENT
  // ============================================

  /**
   * Update username (max 3 changes per month)
   * @param username - New username (3-30 chars, lowercase, numbers, hyphens only)
   */
  updateUsername: async (username: string): Promise<{ message: string; username: string }> => {
    return await apiClient.put<{ message: string; username: string }>('/users/me/username', {
      username,
    })
  },

  /**
   * Check if username is available
   */
  checkUsername: async (username: string): Promise<UsernameCheckResponse> => {
    return await apiClient.get<UsernameCheckResponse>(
      `/users/me/username/check?username=${encodeURIComponent(username)}`
    )
  },

  /**
   * Get username suggestions based on user's name
   */
  getUsernameSuggestions: async (): Promise<UsernameSuggestionsResponse> => {
    return await apiClient.get<UsernameSuggestionsResponse>('/users/me/username/suggestions')
  },

  // ============================================
  // PRIVACY SETTINGS
  // ============================================

  /**
   * Get privacy settings
   */
  getPrivacySettings: async (): Promise<{ privacySettings: PrivacySettings }> => {
    return await apiClient.get<{ privacySettings: PrivacySettings }>('/users/me/privacy')
  },

  /**
   * Update privacy settings
   */
  updatePrivacySettings: async (
    settings: Partial<PrivacySettings>
  ): Promise<{ message: string; privacySettings: PrivacySettings }> => {
    return await apiClient.patch<{ message: string; privacySettings: PrivacySettings }>(
      '/users/me/privacy',
      settings
    )
  },

  // ============================================
  // SHARE LINK
  // ============================================

  /**
   * Get shareable profile link
   */
  getShareLink: async (): Promise<ShareLinkResponse> => {
    return await apiClient.get<ShareLinkResponse>('/users/me/share-link')
  },

  // ============================================
  // CV MANAGEMENT
  // ============================================

  /**
   * Upload CV/Resume
   * @param file - CV file (PDF, DOC, DOCX, max 10MB)
   */
  uploadCV: async (file: File): Promise<CVUploadResponse> => {
    const formData = new FormData()
    formData.append('cv', file)

    return await apiClient.post<CVUploadResponse>('/users/me/cv', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },

  /**
   * Delete CV/Resume
   */
  deleteCV: async (): Promise<{ message: string }> => {
    return await apiClient.delete<{ message: string }>('/users/me/cv')
  },

  /**
   * Download CV/Resume
   * Returns a blob that can be downloaded
   */
  downloadCV: async (): Promise<Blob> => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me/cv/download`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
    })

    if (!response.ok) {
      throw new Error('Failed to download CV')
    }

    return await response.blob()
  },

  // ============================================
  // ACCOUNT MANAGEMENT
  // ============================================

  /**
   * Delete user account permanently
   * @param confirmationText - Must be "DELETE" to confirm
   */
  deleteAccount: async (confirmationText: string): Promise<{ message: string }> => {
    return await apiClient.delete<{ message: string }>('/users/me', {
      data: { confirmation: confirmationText }
    })
  },
}
