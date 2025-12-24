import { useUserStore, selectIsAuthenticated, selectIsEmailVerified, selectOnboardingComplete } from '../stores/userStore'
import { authApi } from '../api/auth'
import { usersApi } from '../api/users'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { AccountType } from '@/types'

export function useAuth() {
  const router = useRouter()
  const { currentUser, setUser, clearUser, setLoading, setError } = useUserStore()
  const isAuthenticated = useUserStore(selectIsAuthenticated)
  const isEmailVerified = useUserStore(selectIsEmailVerified)
  const onboardingComplete = useUserStore(selectOnboardingComplete)

  // Check for token state mismatch on mount and when user changes
  useEffect(() => {
    if (currentUser && typeof window !== 'undefined') {
      const accessToken = localStorage.getItem('accessToken')
      const refreshToken = localStorage.getItem('refreshToken')
      
      // If user exists but no tokens, clear user state (force logout)
      if (!accessToken && !refreshToken) {
        console.warn('🔄 Token state mismatch detected: User exists but no tokens found. Logging out...')
        clearUser()
        // Don't redirect here - let the page handle it based on auth requirements
        return
      }

      // If user exists but missing critical fields (membershipStatus, accountType), load full user data
      if (!currentUser.membershipStatus || !currentUser.accountType) {
        loadCurrentUser()
      }
    }
  }, [currentUser, clearUser])

  // Load full user data from /users/me endpoint
  const loadCurrentUser = async () => {
    try {
      const response = await usersApi.getCurrentUser()
      setUser(response.user)
    } catch (error) {
      console.error('❌ Failed to load current user:', error)
      // If we can't load user data, the tokens might be invalid
      clearUser()
    }
  }

  const login = async (email: string, password: string) => {
    try {
      setLoading(true)
      setError(null)
      const response = await authApi.login({ email, password })
      
      // Set basic user data from auth response first
      setUser(response.user)
      
      // Load full user data with membershipStatus and accountType
      try {
        const fullUserResponse = await usersApi.getCurrentUser()
        setUser(fullUserResponse.user)
      } catch (userError) {
        console.warn('⚠️ Failed to load full user data after login, using auth response data:', userError)
        // Continue with basic user data from auth response
      }
      
      // Determine redirect path based on user state
      let redirectPath = '/feed' // Default for fully onboarded users
      
      if (!response.user.emailVerified) {
        redirectPath = '/verify-email'
      } else if (!response.user.onboardingComplete) {
        redirectPath = '/onboarding'
      }
      
      // Always redirect to appropriate page after login
      router.push(redirectPath)
      
      return response
    } catch (error: any) {
      console.error('❌ Login error:', error)
      const message = error.response?.data?.message || 'Login failed'
      setError(message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const register = async (data: { email: string; password: string; firstName: string; lastName: string }) => {
    try {
      setLoading(true)
      setError(null)
      const response = await authApi.register(data)
      router.push('/verify-email')
      return response
    } catch (error: any) {
      const message = error.response?.data?.message || 'Registration failed'
      setError(message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken')
      if (refreshToken) {
        await authApi.logout(refreshToken)
      }
    } catch (error) {
      console.error('Logout error:', error)
      // Even if API call fails, clear local state
    } finally {
      // Clear user state
      clearUser()
      
      // Clear any remaining tokens (belt and suspenders approach)
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      
      // Force redirect to login
      if (typeof window !== 'undefined') {
        window.location.href = '/login'
      }
    }
  }

  const verifyEmail = async (token: string) => {
    try {
      setLoading(true)
      setError(null)
      const response = await authApi.verifyEmail({ token })
      
      // Update user with verified status
      if (currentUser) {
        setUser({ ...currentUser, emailVerified: true })
      }
      
      return response
    } catch (error: unknown) {
      const message = (error as any)?.response?.data?.message || 'Email verification failed'
      setError(message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Role checks
  const isMember = currentUser?.accountType === AccountType.CHAPTER_MEMBER || currentUser?.accountType === AccountType.HQ_MEMBER
  const isChapterAdmin = currentUser?.accountType === AccountType.CHAPTER_ADMIN
  const isSuperAdmin = currentUser?.accountType === AccountType.SUPER_ADMIN
  const isAdmin = isChapterAdmin || isSuperAdmin

  return {
    user: currentUser,
    isAuthenticated,
    isEmailVerified,
    onboardingComplete,
    isMember,
    isChapterAdmin,
    isSuperAdmin,
    isAdmin,
    login,
    register,
    logout,
    verifyEmail,
    refreshUserData: loadCurrentUser,
  }
}
