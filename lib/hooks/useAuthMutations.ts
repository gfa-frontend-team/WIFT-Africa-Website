'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { authApi, LoginInput, RegisterInput } from '../api/auth'
import { useRouter } from 'next/navigation'
import { useUserStore } from '../stores/userStore'
import { authKeys } from './useAuthQuery'
import { apiClient } from '../api/client'

export function useAuthMutations() {
  const queryClient = useQueryClient()
  const router = useRouter()
  const { setUser, clearUser } = useUserStore()

  const loginMutation = useMutation({
    mutationFn: (data: LoginInput) => authApi.login(data),
    onSuccess: (data) => {
      // Update store immediately with basic user info
      setUser(data.user)
      
      // Invalidate user query to fetch full profile
      queryClient.invalidateQueries({ queryKey: authKeys.user })
      
      // Determine safe redirect
      const user = data.user
      let redirectPath = '/feed'
      
      if (!user.emailVerified) {
        redirectPath = '/verify-email'
      } else if (!user.onboardingComplete) {
        redirectPath = '/onboarding'
      }
      
      router.push(redirectPath)
    },
  })

  const googleLoginMutation = useMutation({
    mutationFn: (idToken: string) => authApi.googleAuth(idToken),
    onSuccess: (data) => {
       // Update store immediately with basic user info
       setUser(data.user)
      
       // Invalidate user query to fetch full profile
       queryClient.invalidateQueries({ queryKey: authKeys.user })
      
       // Determine safe redirect
       const user = data.user
       let redirectPath = '/feed'
       
       if (!user.emailVerified) {
         redirectPath = '/verify-email'
       } else if (!user.onboardingComplete) {
         redirectPath = '/onboarding'
       }
       
       router.push(redirectPath)
    }
  })

  const registerMutation = useMutation({
    mutationFn: (data: RegisterInput) => authApi.register(data),
    onSuccess: () => {
      router.push('/verify-email')
    },
  })

  const logoutMutation = useMutation({
    mutationFn: async () => {
      const refreshToken = localStorage.getItem('refreshToken')
      if (refreshToken) {
        try {
           await authApi.logout(refreshToken)
        } catch (e) {
          // Ignore logout errors
          console.warn('Logout API failed, clearing local state anyway', e)
        }
      }
      return true
    },
    onSettled: () => {
      // Always clear local state
      apiClient.clearTokens()
      clearUser()
      
      // Clear all queries
      queryClient.clear()
      
      // Redirect
      window.location.href = '/login'
    }
  })

  return {
    loginMutation,
    googleLoginMutation,
    registerMutation,
    logoutMutation
  }
}
