import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { usersApi, UpdateProfileInput } from '../api/users'
import { useUserStore } from '../stores/userStore'
import { toast } from 'sonner'
import { apiClient } from '../api/client'
import { authKeys } from './useAuthQuery'

export const profileKeys = {
  all: ['profile'] as const,
  me: () => [...profileKeys.all, 'me'] as const,
  cv: () => [...profileKeys.all, 'cv'] as const,
}

export function useProfile() {
  const queryClient = useQueryClient()
  const { setUser, currentUser } = useUserStore()

  // Query: Get full profile
  const profileQuery = useQuery({
    queryKey: profileKeys.me(),
    queryFn: async () => {
      const response = await usersApi.getProfile()
      return response
    },
    // Don't refetch too often, but keep it fresh enough
    staleTime: 1000 * 60 * 5, // 5 minutes
  })

  // Mutation: Update Profile
  const updateProfileMutation = useMutation({
    mutationFn: (data: UpdateProfileInput) => usersApi.updateProfile(data),
    onSuccess: (data) => {
      // Invalidate profile query
      queryClient.invalidateQueries({ queryKey: profileKeys.me() })
      
      // Also update the user store if basic user info changed (though profile update is mostly profile data)
      // The updateProfile response returns { message, profile }
      // We might want to refresh the user object too if we display profile fields in the header/etc
      queryClient.invalidateQueries({ queryKey: authKeys.user })
      
      toast.success('Profile updated successfully')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update profile')
    }
  })

  // Mutation: Upload Profile Photo
  const uploadPhotoMutation = useMutation({
    mutationFn: (file: File) => usersApi.uploadProfilePhoto(file),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: profileKeys.me() })
      queryClient.invalidateQueries({ queryKey: authKeys.user }) // Update user avatar everywhere
      toast.success('Profile photo uploaded')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to upload photo')
    }
  })

  // Mutation: Delete Profile Photo
  const deletePhotoMutation = useMutation({
    mutationFn: () => usersApi.deleteProfilePhoto(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileKeys.me() })
      queryClient.invalidateQueries({ queryKey: authKeys.user })
      toast.success('Profile photo removed')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to remove photo')
    }
  })

  // Mutation: Upload CV
  const uploadCVMutation = useMutation({
    mutationFn: (file: File) => usersApi.uploadCV(file),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: profileKeys.me() })
      toast.success('CV uploaded successfully')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to upload CV')
    }
  })

  // Mutation: Delete CV
  const deleteCVMutation = useMutation({
    mutationFn: () => usersApi.deleteCV(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileKeys.me() })
      toast.success('CV removed')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to remove CV')
    }
  })
  
  // Custom function for downloading CV (since it returns a Blob)
  const downloadCV = async () => {
    try {
      const blob = await usersApi.downloadCV()
      // Create a URL for the blob
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
        
      // Try to get filename from somewhere or default
      // In a real app we might look at headers, but here we'll default
      const filename = `${currentUser?.firstName || 'User'}_CV.pdf`
        
      link.setAttribute('download', filename)
      document.body.appendChild(link)
      link.click()
      link.parentNode?.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Download failed', error)
      toast.error('Failed to download CV')
    }
  }

  return {
    // Queries
    profile: profileQuery.data?.profile,
    user: profileQuery.data?.user,
    isLoading: profileQuery.isLoading,
    isError: profileQuery.isError,
    error: profileQuery.error,
    refetchProfile: profileQuery.refetch,
    
    // Mutations
    updateProfile: updateProfileMutation.mutateAsync,
    isUpdating: updateProfileMutation.isPending,
    
    uploadPhoto: uploadPhotoMutation.mutateAsync,
    isUploadingPhoto: uploadPhotoMutation.isPending,
    
    deletePhoto: deletePhotoMutation.mutateAsync,
    isDeletingPhoto: deletePhotoMutation.isPending,
    
    uploadCV: uploadCVMutation.mutateAsync,
    isUploadingCV: uploadCVMutation.isPending,
    
    deleteCV: deleteCVMutation.mutateAsync,
    isDeletingCV: deleteCVMutation.isPending,
    
    // Utils
    downloadCV,
  }
}
