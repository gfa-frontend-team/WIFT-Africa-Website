import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { profilesApi } from '@/lib/api/profiles'
import { analyticsApi } from '@/lib/api/analytics'
import { useAuth } from '@/lib/hooks/useAuth'

export function useProfileAnalytics() {
  const { user } = useAuth()
  const [timeframe, setTimeframe] = useState<'30days' | '90days'>('90days')
  
  // Profile Views Query
  const { 
    data: profileViews, 
    isLoading: isLoadingViews,
    isError: isErrorViews
  } = useQuery({
    queryKey: ['profile-views', user?.id, timeframe],
    queryFn: () => profilesApi.getProfileViews(user!.id, timeframe === '30days'),
    enabled: !!user?.id,
  })

  // Post Stats Query (Summary)
  const {
    data: postStats,
    isLoading: isLoadingStats,
    isError: isErrorStats
  } = useQuery({
    queryKey: ['post-stats-summary', user?.id],
    queryFn: () => analyticsApi.getPostsSummary(),
    enabled: !!user?.id,
  })

  return {
    timeframe,
    setTimeframe,
    profileViews,
    postStats,
    isLoading: isLoadingViews || isLoadingStats,
    isError: isErrorViews || isErrorStats
  }
}
