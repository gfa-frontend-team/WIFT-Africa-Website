import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { usersApi, PrivacySettings } from '../api/users'
import { toast } from 'sonner'
import { profileKeys } from './useProfile'
import { authKeys } from './useAuthQuery'

export const settingsKeys = {
  privacy: ['settings', 'privacy'] as const,
  username: ['settings', 'username'] as const,
  suggestions: ['settings', 'username', 'suggestions'] as const,
  shareLink: ['settings', 'shareLink'] as const,
}

// Privacy Settings Hook
export function usePrivacySettings() {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: settingsKeys.privacy,
    queryFn: async () => {
      const response = await usersApi.getPrivacySettings()
      return response.privacySettings
    },
    staleTime: 1000 * 60 * 5, // 5 mins
  })

  const updateMutation = useMutation({
    mutationFn: (settings: Partial<PrivacySettings>) => usersApi.updatePrivacySettings(settings),
    onSuccess: (data) => {
      // Invalidate privacy query
      queryClient.invalidateQueries({ queryKey: settingsKeys.privacy })
      // Invalidate profile as privacy settings might be part of it (though usually separate)
      queryClient.invalidateQueries({ queryKey: profileKeys.me() })
      
      toast.success(data.message || 'Privacy settings updated')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update privacy settings')
    }
  })

  return {
    settings: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    updateSettings: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
  }
}

// Username Management Hook
export function useUsername() {
  const queryClient = useQueryClient()

  const checkUsernameMutation = useMutation({
    mutationFn: (username: string) => usersApi.checkUsername(username),
  })

  const suggestionsQuery = useQuery({
    queryKey: settingsKeys.suggestions,
    queryFn: async () => {
      const response = await usersApi.getUsernameSuggestions()
      return response.suggestions
    },
    staleTime: 1000 * 60 * 60, // 1 hour (suggestions unlikely to change fast)
  })

  const updateUsernameMutation = useMutation({
    mutationFn: (username: string) => usersApi.updateUsername(username),
    onSuccess: (data) => {
      // Invalidate user query (contains username)
      queryClient.invalidateQueries({ queryKey: authKeys.user })
      // Invalidate profile
      queryClient.invalidateQueries({ queryKey: profileKeys.me() })
      // Invalidate share link as it depends on username
      queryClient.invalidateQueries({ queryKey: settingsKeys.shareLink })
      
      toast.success(data.message || 'Username updated successfully')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update username')
    }
  })

  return {
    checkUsername: checkUsernameMutation.mutateAsync,
    isChecking: checkUsernameMutation.isPending,
    
    suggestions: suggestionsQuery.data || [],
    isLoadingSuggestions: suggestionsQuery.isLoading,
    
    updateUsername: updateUsernameMutation.mutateAsync,
    isUpdating: updateUsernameMutation.isPending,
  }
}

// Share Link Hook
export function useShareLink() {
  const query = useQuery({
    queryKey: settingsKeys.shareLink,
    queryFn: async () => {
      const response = await usersApi.getShareLink()
      return response
    },
    staleTime: Infinity, // Link shouldn't change unless username changes
  })

  return {
    data: query.data,
    isLoading: query.isLoading,
  }
}

// Account Management Hook
export function useAccount() {
  const queryClient = useQueryClient()

  const deleteAccountMutation = useMutation({
    mutationFn: (confirmation: string) => usersApi.deleteAccount(confirmation),
    onSuccess: () => {
      // Clear all queries
      queryClient.clear()
      // Local storage clear and redirect handled by component or should be here?
      // Ideally the component handles the redirect, but the mutation ensures API success.
      toast.success('Account deleted successfully')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete account')
    }
  })

  return {
    deleteAccount: deleteAccountMutation.mutateAsync,
    isDeleting: deleteAccountMutation.isPending,
  }
}
