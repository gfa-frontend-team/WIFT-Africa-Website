import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { authApi } from '../api/auth'
import { useUserStore } from '../stores/userStore'

declare global {
  interface Window {
    google: {
      accounts: {
        id: {
          initialize: (config: any) => void
          prompt: (callback?: (notification: any) => void) => void
          renderButton: (element: HTMLElement, config: any) => void
          disableAutoSelect: () => void
          cancel: () => void
        }
      }
    }
  }
}

export function useGoogleAuth() {
  const router = useRouter()
  const { setUser, setLoading, setError } = useUserStore()
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)

  const initializeGoogleAuth = () => {
    if (typeof window === 'undefined' || !window.google) {
      console.error('Google Identity Services not loaded')
      return
    }

    try {
      window.google.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        callback: handleGoogleResponse,
        auto_select: false,
        cancel_on_tap_outside: true,
        use_fedcm_for_prompt: false, // Disable FedCM to avoid the error
        ux_mode: 'popup', // Force popup mode
        context: 'signin',
      })
    } catch (error) {
      console.error('Failed to initialize Google Auth:', error)
    }
  }

  const handleGoogleResponse = async (response: any) => {
    if (!response.credential) {
      setError('Google authentication failed - no credential received')
      setIsGoogleLoading(false)
      return
    }

    setIsGoogleLoading(true)
    setError(null)

    try {
      const result = await authApi.googleAuth(response.credential)
      
      // Set user in store
      setUser(result.user)
      
      // Determine redirect path based on user state
      let redirectPath = '/feed' // Default for fully onboarded users
      
      if (!result.user.emailVerified) {
        redirectPath = '/verify-email'
      } else if (!result.user.onboardingComplete) {
        redirectPath = '/onboarding'
      }
      
      // Redirect to appropriate page
      router.push(redirectPath)
      
      return result
    } catch (error: any) {
      console.error('Google auth error:', error)
      const message = error.response?.data?.message || 'Google authentication failed'
      setError(message)
      throw error
    } finally {
      setIsGoogleLoading(false)
    }
  }

  const signInWithGoogle = () => {
    if (typeof window === 'undefined' || !window.google) {
      setError('Google Identity Services not available')
      return
    }

    setIsGoogleLoading(true)
    
    try {
      // Cancel any existing prompts
      window.google.accounts.id.cancel()
      
      // Show the prompt with error handling
      window.google.accounts.id.prompt((notification) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          console.log('Google prompt was not displayed or skipped')
          setIsGoogleLoading(false)
          // Fallback: you could show a custom error message here
        }
      })
    } catch (error) {
      console.error('Error showing Google prompt:', error)
      setError('Failed to show Google sign-in')
      setIsGoogleLoading(false)
    }
  }

  const renderGoogleButton = (element: HTMLElement, options?: any) => {
    if (typeof window === 'undefined' || !window.google) {
      console.error('Google Identity Services not loaded')
      return
    }

    const defaultOptions = {
      theme: 'outline',
      size: 'large',
      width: '100%',
      text: 'signin_with',
      shape: 'rectangular',
      logo_alignment: 'left',
    }

    try {
      window.google.accounts.id.renderButton(element, { ...defaultOptions, ...options })
    } catch (error) {
      console.error('Failed to render Google button:', error)
    }
  }

  return {
    initializeGoogleAuth,
    signInWithGoogle,
    renderGoogleButton,
    isGoogleLoading,
  }
}