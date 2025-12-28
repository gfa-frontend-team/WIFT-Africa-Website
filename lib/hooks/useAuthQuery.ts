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

  const query = useQuery({
    queryKey: authKeys.user,
    queryFn: async () => {
      const response = await usersApi.getCurrentUser()
      return response.user
    },
    staleTime: Infinity, // User data rarely changes automatically
    gcTime: 1000 * 60 * 60 * 24, // Keep in garbage collection for 24h
    retry: 1, // Don't retry too many times if auth fails
    enabled: typeof window !== 'undefined' && !!localStorage.getItem('accessToken'),
  })

  // Sync with Zustand store for global access
  useEffect(() => {
    if (query.data) {
      setUser(query.data)
    } else if (query.isError) {
      // Only clear user if the error is due to auth failure, 
      // but simpler to just let the API client handle forceLogout for 401s.
      // However, if we mount and fail to fetch user, we might want to ensure store is empty.
      // But let's avoid aggressive clearing here to prevent flashing if it's just a network error.
    }
  }, [query.data, query.isError, setUser])

  return query
}
