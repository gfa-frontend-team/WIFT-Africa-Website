import { useUserStore, selectIsAuthenticated, selectIsEmailVerified, selectOnboardingComplete } from '../stores/userStore'
import { authApi } from '../api/auth'
import { useRouter } from 'next/navigation'
import { AccountType } from '@/types'

export function useAuth() {
  const router = useRouter()
  const { currentUser, setUser, clearUser, setLoading, setError } = useUserStore()
  const isAuthenticated = useUserStore(selectIsAuthenticated)
  const isEmailVerified = useUserStore(selectIsEmailVerified)
  const onboardingComplete = useUserStore(selectOnboardingComplete)

  const login = async (email: string, password: string) => {
    try {
      setLoading(true)
      setError(null)
      const response = await authApi.login({ email, password })
      
      // Set user in store first
      setUser(response.user)
      
      // Determine redirect path based on user state
      let redirectPath = '/in/home' // Default for fully onboarded users
      
      if (!response.user.emailVerified) {
        redirectPath = '/verify-email'
      } else if (!response.user.onboardingComplete) {
        redirectPath = '/onboarding'
      }
      
      // Use Next.js router for client-side navigation (no page reload)
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
    } finally {
      clearUser()
      router.push('/login')
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
  }
}
