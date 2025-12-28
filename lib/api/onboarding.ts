import { apiClient } from './client'

export interface OnboardingProgress {
  currentStep: number
  isComplete: boolean
  emailVerified: boolean
  steps: {
    roleSelection: boolean
    specialization: boolean
    chapterSelection: boolean
    profileSetup: boolean
    termsAccepted: boolean
  }
  data: {
    roles: string[]
    primaryRole?: string
    specializations?: {
      writer?: string
      crew?: string[]      // Backend returns array
      business?: string[]  // Backend returns array
    }
    chapterId?: string
    membershipStatus?: string
  }
}

export interface RoleSelectionInput {
  roles: string[]
  primaryRole: string
}

export interface SpecializationInput {
  writerSpecialization?: string
  crewSpecializations?: string[]      // Changed to array for multiple selections
  businessSpecializations?: string[]  // Changed to array for multiple selections
}

export interface ChapterSelectionInput {
  chapterId: string
  memberType: 'NEW' | 'EXISTING'
  membershipId?: string
  phoneNumber?: string
  additionalInfo?: string
}

export interface ProfileSetupInput {
  headline?: string
  bio?: string
  location?: string
  website?: string
  imdbUrl?: string
  linkedinUrl?: string
  instagramHandle?: string
  twitterHandle?: string
  availabilityStatus?: 'AVAILABLE' | 'BUSY' | 'NOT_LOOKING'
}

export interface Chapter {
  id: string
  name: string
  code: string
  country: string
  city?: string
  description?: string
  memberCount: number
  requiresApproval: boolean
}

export const onboardingApi = {
  // Get onboarding progress
  getProgress: async (): Promise<OnboardingProgress> => {
    const response = await apiClient.get<OnboardingProgress>('/onboarding/progress')
    return response
  },

  // Step 1: Submit roles
  submitRoles: async (data: RoleSelectionInput) => {
    const response = await apiClient.post<{ message: string; nextStep: number }>('/onboarding/roles', data)
    return response
  },

  // Step 2: Submit specializations
  submitSpecializations: async (data: SpecializationInput) => {
    const response = await apiClient.post<{ message: string; nextStep: number }>('/onboarding/specializations', data)
    return response
  },

  // Step 3: Get available chapters
  getChapters: async (): Promise<{ chapters: Chapter[] }> => {
    const response = await apiClient.get<{ chapters: Chapter[] }>('/onboarding/chapters')
    return response
  },

  // Step 3: Submit chapter selection
  submitChapter: async (data: ChapterSelectionInput) => {
    const response = await apiClient.post<{ 
      message: string; 
      nextStep: number;
      requiresApproval: boolean;
      membershipStatus: string;
      expectedReviewDate: string | null;
    }>('/onboarding/chapter', data)
    return response
  },

  // Step 4: Submit profile setup
  submitProfile: async (data: ProfileSetupInput | FormData) => {
    const isFormData = data instanceof FormData
    const response = await apiClient.post<{ message: string; nextStep: number }>(
      '/onboarding/profile', 
      data,
      isFormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : undefined
    )
    return response
  },

  // Step 5: Accept terms
  acceptTerms: async () => {
    const response = await apiClient.post<{ 
      message: string;
      onboardingComplete: boolean;
      membershipStatus: string;
    }>('/onboarding/accept-terms')
    return response
  },
}
