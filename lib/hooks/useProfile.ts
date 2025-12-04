import { useState, useEffect } from 'react'
import { usersApi, type UserProfileResponse, type UpdateProfileInput } from '../api/users'
import { profilesApi, type PublicProfileResponse } from '../api/profiles'

export function useProfile() {
  const [profile, setProfile] = useState<UserProfileResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadProfile = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await usersApi.getProfile()
      setProfile(data)
      return data
    } catch (err: any) {
      const message = err.response?.data?.error || 'Failed to load profile'
      setError(message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const updateProfile = async (data: UpdateProfileInput) => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await usersApi.updateProfile(data)
      
      // Reload profile to get updated data
      await loadProfile()
      
      return response
    } catch (err: any) {
      const message = err.response?.data?.error || 'Failed to update profile'
      setError(message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const uploadProfilePhoto = async (file: File) => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await usersApi.uploadProfilePhoto(file)
      
      // Reload profile to get updated photo
      await loadProfile()
      
      return response
    } catch (err: any) {
      const message = err.response?.data?.error || 'Failed to upload photo'
      setError(message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const deleteProfilePhoto = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await usersApi.deleteProfilePhoto()
      
      // Reload profile to reflect deletion
      await loadProfile()
      
      return response
    } catch (err: any) {
      const message = err.response?.data?.error || 'Failed to delete photo'
      setError(message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const uploadCV = async (file: File) => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await usersApi.uploadCV(file)
      
      // Reload profile to get updated CV info
      await loadProfile()
      
      return response
    } catch (err: any) {
      const message = err.response?.data?.error || 'Failed to upload CV'
      setError(message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const deleteCV = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await usersApi.deleteCV()
      
      // Reload profile to reflect deletion
      await loadProfile()
      
      return response
    } catch (err: any) {
      const message = err.response?.data?.error || 'Failed to delete CV'
      setError(message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const downloadCV = async () => {
    try {
      setError(null)
      return await usersApi.downloadCV()
    } catch (err: any) {
      const message = err.response?.data?.error || 'Failed to download CV'
      setError(message)
      throw err
    }
  }

  return {
    profile,
    isLoading,
    error,
    loadProfile,
    updateProfile,
    uploadProfilePhoto,
    deleteProfilePhoto,
    uploadCV,
    deleteCV,
    downloadCV
  }
}

export function usePublicProfile(identifier: string) {
  const [profile, setProfile] = useState<PublicProfileResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (identifier) {
      loadProfile()
    }
  }, [identifier])

  const loadProfile = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await profilesApi.getPublicProfile(identifier)
      setProfile(data)
      return data
    } catch (err: any) {
      const message = err.response?.data?.error || 'Profile not found'
      setError(message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  return {
    profile,
    isLoading,
    error,
    reload: loadProfile
  }
}
