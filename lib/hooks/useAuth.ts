import { useUser } from './useAuthQuery'
import { useAuthMutations } from './useAuthMutations'
import { useUserStore, selectIsAuthenticated, selectIsEmailVerified, selectOnboardingComplete } from '../stores/userStore'
import { AccountType } from '@/types'
import { useMutation } from '@tanstack/react-query'
import { authApi } from '../api/auth'

export function useAuth() {
  const { data: user, isLoading: isUserLoading, refetch: refreshUserData } = useUser()
  const { loginMutation, registerMutation, logoutMutation } = useAuthMutations()
  
  // Use store selectors for derived state
  // Even though we have data from RQ, the store is synced via useUser so these selectors work
  const isAuthenticated = useUserStore(selectIsAuthenticated)
  const isEmailVerified = useUserStore(selectIsEmailVerified)
  const onboardingComplete = useUserStore(selectOnboardingComplete)
  const currentUser = useUserStore((state) => state.currentUser)

  // Verify Email Mutation (kept local as it's specific)
  const verifyEmailMutation = useMutation({
    mutationFn: (token: string) => authApi.verifyEmail({ token }),
    onSuccess: (data) => {
      // Refresh user data after verification
      refreshUserData()
    }
  })

  // Role checks
  const isMember = currentUser?.accountType === AccountType.CHAPTER_MEMBER || currentUser?.accountType === AccountType.HQ_MEMBER
  const isChapterAdmin = currentUser?.accountType === AccountType.CHAPTER_ADMIN
  const isSuperAdmin = currentUser?.accountType === AccountType.SUPER_ADMIN
  const isAdmin = isChapterAdmin || isSuperAdmin

  return {
    // State
    user: currentUser, // Prefer store user as it's globally synced
    isAuthenticated,
    isEmailVerified,
    onboardingComplete,
    
    // Roles
    isMember,
    isChapterAdmin,
    isSuperAdmin,
    isAdmin,
    
    // Actions - wrapping mutations to match original interface promise return
    login: (email: string, password: string) => loginMutation.mutateAsync({ email, password }),
    register: (data: { email: string; password: string; firstName: string; lastName: string }) => registerMutation.mutateAsync(data),
    logout: () => logoutMutation.mutateAsync(),
    verifyEmail: (token: string) => verifyEmailMutation.mutateAsync(token),
    
    // Loading states
    isLoading: isUserLoading || loginMutation.isPending || registerMutation.isPending || logoutMutation.isPending,
    
    // Utils
    refreshUserData,
  }
}
