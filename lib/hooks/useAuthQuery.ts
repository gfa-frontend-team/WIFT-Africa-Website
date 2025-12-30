'use client'

import { useQuery } from '@tanstack/react-query'
import { usersApi } from '../api/users'
import { useUserStore } from '../stores/userStore'
import { useEffect } from 'react'

export const authKeys = {
  user: ['auth', 'user'] as const,
}

export function useUser() {
  const { setUser, clearUser } = useUserStore()

  // Check for token existence
  const hasToken = typeof window !== 'undefined' && !!localStorage.getItem('accessToken')

  const query = useQuery({
    queryKey: authKeys.user,
    queryFn: async () => {
      const response = await usersApi.getCurrentUser()
      return response.user
    },
    staleTime: Infinity,
    gcTime: 1000 * 60 * 60 * 24,
    retry: 1,
    enabled: hasToken,
  })

  // Sync with Zustand store for global access
  useEffect(() => {
    if (query.data) {
      setUser(query.data)
    } else if (!hasToken) {
      clearUser()
    }
  }, [query.data, setUser, clearUser, hasToken])

  // Fix for "stuck in loading" issue:
  // If there is no token, useQuery with enabled:false returns status:'pending', fetchStatus:'idle'
  // which is typically interpreted as isLoading:true in old React Query versions or dependent logic.
  // We explicitly return isLoading:false if we know there is no token.
  if (!hasToken) {
    return {
      ...query,
      data: null,
      isLoading: false,
      isPending: false, 
      status: 'success', // Treat "no token" as a settled state (unauthenticated)
    } as unknown as typeof query
  }

  return query
}
