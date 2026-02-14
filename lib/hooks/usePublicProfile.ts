import { useQuery } from '@tanstack/react-query'
import { profilesApi } from '../api/profiles'

export const publicProfileKeys = {
  all: ['publicProfile'] as const,
  byIdentifier: (identifier: string) => [...publicProfileKeys.all, identifier] as const,
}

export function usePublicProfile(identifier: string, options: { enabled?: boolean } = {}) {
  const query = useQuery({
    queryKey: publicProfileKeys.byIdentifier(identifier),
    queryFn: async () => {
      if (!identifier) return null
      return await profilesApi.getPublicProfile(identifier)
    },
    enabled: !!identifier && (options.enabled !== false),
    staleTime: 1000 * 60 * 5, // 5 minutes cache
  })

  return {
    data: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  }
}
