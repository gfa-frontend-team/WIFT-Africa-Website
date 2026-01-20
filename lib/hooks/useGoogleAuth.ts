import { useAuthMutations } from './useAuthMutations'
import { useUserStore } from '../stores/userStore'
import { CredentialResponse } from '@react-oauth/google'

export function useGoogleAuth() {
  const { setError } = useUserStore()
  const { googleLoginMutation } = useAuthMutations()

  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    if (!credentialResponse.credential) {
      setError('Google authentication failed - no credential received')
      return
    }

    try {
      await googleLoginMutation.mutateAsync(credentialResponse.credential)
      // Redirect is handled by mutation
    } catch (error: any) {
      console.error('Google auth error:', error)
      const message = error.response?.data?.message || 'Google authentication failed'
      setError(message)
    }
  }

  const handleGoogleError = () => {
    setError('Google Login Failed')
  }

  return {
    handleGoogleSuccess,
    handleGoogleError,
    isGoogleLoading: googleLoginMutation.isPending,
  }
}