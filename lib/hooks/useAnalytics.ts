import { useQuery, useMutation } from '@tanstack/react-query'
import { analyticsApi } from '@/lib/api/analytics'

export const analyticsKeys = {
  all: ['analytics'] as const,
  summary: () => [...analyticsKeys.all, 'summary'] as const,
  post: (postId: string) => [...analyticsKeys.all, 'post', postId] as const,
  userPosts: (page: number, limit: number) => [...analyticsKeys.all, 'userPosts', page, limit] as const,
}

export function useAnalytics() {
  const useSummary = () => useQuery({
    queryKey: analyticsKeys.summary(),
    queryFn: () => analyticsApi.getPostsSummary(),
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: false // Don't retry if it fails (e.g. 404 if no data yet)
  })

  const usePostAnalytics = (postId: string) => useQuery({
    queryKey: analyticsKeys.post(postId),
    queryFn: () => analyticsApi.getPostAnalytics(postId),
    enabled: !!postId,
  })

  // Defaults to page 1, limit 1 just to get the total count efficiently
  const useUserPostsStats = () => useQuery({
    queryKey: analyticsKeys.userPosts(1, 1),
    queryFn: () => analyticsApi.getUserPostsAnalytics(1, 1),
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: false
  })

  const recordImpression = useMutation({
    mutationFn: ({ postId, watchTime }: { postId: string, watchTime?: number }) => 
      analyticsApi.recordImpression(postId, { watchTime })
  })

  return {
    useSummary,
    usePostAnalytics,
    useUserPostsStats,
    recordImpression
  }
}
