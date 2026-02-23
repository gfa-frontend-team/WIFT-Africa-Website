import { useQuery } from '@tanstack/react-query'
import { fundingApi } from '@/lib/api/funding'
import { TargetRole } from '@/types'

export function useFundingOpportunities(filters?: {
  chapterId?: string
  targetRole?: TargetRole
}) {
  return useQuery({
    queryKey: ['funding-opportunities', filters],
    queryFn: () => fundingApi.getFundingOpportunities(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useFundingOpportunity(id: string) {
  return useQuery({
    queryKey: ['funding-opportunity', id],
    queryFn: () => fundingApi.getFundingOpportunity(id),
    enabled: !!id,
  })
}
