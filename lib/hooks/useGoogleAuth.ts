import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthMutations } from './useAuthMutations'
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
  const { setError } = useUserStore()
  const { googleLoginMutation } = useAuthMutations()
  const [isScriptLoaded, setIsScriptLoaded] = useState(false)

  const initializeGoogleAuth = () => {
    if (typeof window === 'undefined' || !window.google) {
      // console.error('Google Identity Services not loaded')
      return
    }

    try {
      window.google.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        callback: handleGoogleResponse,
        auto_select: false,
        cancel_on_tap_outside: true,
        use_fedcm_for_prompt: false, 
        ux_mode: 'popup', 
        context: 'signin',
      })
      setIsScriptLoaded(true)
    } catch (error) {
      console.error('Failed to initialize Google Auth:', error)
    }
  }

  const handleGoogleResponse = async (response: any) => {
    if (!response.credential) {
      setError('Google authentication failed - no credential received')
      return
    }

    try {
      await googleLoginMutation.mutateAsync(response.credential)
      // Redirect is handled by mutation
    } catch (error: any) {
      console.error('Google auth error:', error)
      const message = error.response?.data?.message || 'Google authentication failed'
      setError(message)
    }
  }

  const signInWithGoogle = () => {
    if (typeof window === 'undefined' || !window.google) {
      setError('Google Identity Services not available')
      return
    }

    try {
      // Cancel any existing prompts
      window.google.accounts.id.cancel()
      
      // Show the prompt with error handling
      window.google.accounts.id.prompt((notification) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          console.log('Google prompt was not displayed or skipped')
        }
      })
    } catch (error) {
      console.error('Error showing Google prompt:', error)
      setError('Failed to show Google sign-in')
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
    isGoogleLoading: googleLoginMutation.isPending,
    isScriptLoaded
  }
}