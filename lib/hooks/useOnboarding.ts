'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { 
  onboardingApi, 
  RoleSelectionInput, 
  SpecializationInput, 
  ChapterSelectionInput, 
  ProfileSetupInput 
} from '../api/onboarding'
import { useRouter } from 'next/navigation'
import { useUserStore } from '../stores/userStore'

const ONBOARDING_KEYS = {
  all: ['onboarding'] as const,
  progress: () => [...ONBOARDING_KEYS.all, 'progress'] as const,
  chapters: () => [...ONBOARDING_KEYS.all, 'chapters'] as const,
}

export function useOnboarding() {
  const queryClient = useQueryClient()
  const router = useRouter()
  const { setUser, currentUser } = useUserStore()

  // 1. Fetch Onboarding Progress
  const progressQuery = useQuery({
    queryKey: ONBOARDING_KEYS.progress(),
    queryFn: async () => {
      const data = await onboardingApi.getProgress()
      return data
    },
    staleTime: 0, // Always fetch fresh progress to avoid state mismatches
  })

  // 2. Fetch Chapters
  const chaptersQuery = useQuery({
    queryKey: ONBOARDING_KEYS.chapters(),
    queryFn: async () => {
      const data = await onboardingApi.getChapters()
      return data.chapters
    },
    staleTime: 1000 * 60 * 60, // Chapters list rarely changes, cache for 1 hour
    enabled: false // Lazy load, or enable when in Step 3
  })

  // Helper to update progress cache optimisticly or after success
  const updateProgress = (updates: any) => {
    queryClient.setQueryData(ONBOARDING_KEYS.progress(), (old: any) => {
        if (!old) return old
        return {
            ...old,
            ...updates
        }
    })
  }

  // 3. Mutations
  const submitRolesMutation = useMutation({
    mutationFn: (data: RoleSelectionInput) => onboardingApi.submitRoles(data),
    onSuccess: (data) => {
      // Invalidate progress to ensure sync, or manually update cache if we know next step
      queryClient.invalidateQueries({ queryKey: ONBOARDING_KEYS.progress() })
    }
  })

  const submitSpecializationsMutation = useMutation({
    mutationFn: (data: SpecializationInput) => onboardingApi.submitSpecializations(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ONBOARDING_KEYS.progress() })
    }
  })

  const submitChapterMutation = useMutation({
    mutationFn: (data: ChapterSelectionInput) => onboardingApi.submitChapter(data),
    onSuccess: (data) => {
        // If membership status changed, we might want to update user store too
        if (currentUser) {
            setUser({
                ...currentUser,
                membershipStatus: data.membershipStatus as any
            })
        }
        queryClient.invalidateQueries({ queryKey: ONBOARDING_KEYS.progress() })
    }
  })

  const submitProfileMutation = useMutation({
    mutationFn: (data: ProfileSetupInput | FormData) => onboardingApi.submitProfile(data),
  })

  const acceptTermsMutation = useMutation({
    mutationFn: () => onboardingApi.acceptTerms(),
    onSuccess: (data) => {
       if (data.onboardingComplete) {
         // Update user store
         if (currentUser) {
            setUser({
                ...currentUser,
                onboardingComplete: true,
                membershipStatus: data.membershipStatus as any
            })
         }
         // Invalidate user query to ensure fresh data
         queryClient.invalidateQueries({ queryKey: ['auth', 'user'] })
         router.push('/feed')
       }
    }
  })
  
  // Prefetching helper
  const prefetchChapters = () => {
    queryClient.prefetchQuery({
        queryKey: ONBOARDING_KEYS.chapters(),
        queryFn: async () => {
            const data = await onboardingApi.getChapters()
            return data.chapters
        },
        staleTime: 1000 * 60 * 60,
    })
  }

  return {
    // Queries
    progress: progressQuery.data,
    isLoadingProgress: progressQuery.isLoading,
    isErrorProgress: progressQuery.isError,
    
    chapters: chaptersQuery.data,
    isLoadingChapters: chaptersQuery.isLoading,
    
    // Mutations
    submitRoles: submitRolesMutation.mutateAsync,
    isSubmittingRoles: submitRolesMutation.isPending,
    
    submitSpecializations: submitSpecializationsMutation.mutateAsync,
    isSubmittingSpecializations: submitSpecializationsMutation.isPending,
    
    submitChapter: submitChapterMutation.mutateAsync,
    isSubmittingChapter: submitChapterMutation.isPending,
    
    submitProfile: submitProfileMutation.mutateAsync,
    isSubmittingProfile: submitProfileMutation.isPending,
    
    acceptTerms: acceptTermsMutation.mutateAsync,
    isAcceptingTerms: acceptTermsMutation.isPending,
    
    // Utils
    prefetchChapters,
    refetchProgress: progressQuery.refetch
  }
}
