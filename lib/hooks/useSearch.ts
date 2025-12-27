'use client'

import { useQuery } from '@tanstack/react-query'
import { searchApi, type SearchUsersParams } from '../api/search'

// Query keys
export const searchKeys = {
  all: ['search'] as const,
  members: (params: SearchUsersParams) => [...searchKeys.all, 'members', params] as const,
  recommendations: () => [...searchKeys.all, 'recommendations'] as const,
  popularSkills: () => [...searchKeys.all, 'skills'] as const,
  filters: () => [...searchKeys.all, 'filters'] as const,
}

export function useSearch() {
  
  // Search Members
  const useSearchMembers = (params: SearchUsersParams, enabled = true) => useQuery({
    queryKey: searchKeys.members(params),
    queryFn: () => searchApi.searchMembers(params),
    enabled,
    staleTime: 1000 * 60 * 1, // Cache results for 1 minute
    placeholderData: (previousData) => previousData, // Keep previous results while fetching new ones
  })

  // Recommendations
  const useRecommendations = (limit = 3) => useQuery({
    queryKey: searchKeys.recommendations(),
    queryFn: () => searchApi.getRecommendations(limit),
    staleTime: 1000 * 60 * 5, // 5 minutes
  })

  // Popular Skills
  const usePopularSkills = () => useQuery({
    queryKey: searchKeys.popularSkills(),
    queryFn: () => searchApi.getPopularSkills(),
    staleTime: 1000 * 60 * 60, // 1 hour
  })

  // Filters
  const useSearchFilters = () => useQuery({
    queryKey: searchKeys.filters(),
    queryFn: () => searchApi.getFilters(),
    staleTime: 1000 * 60 * 10, // 10 minutes
  })

  return {
    useSearchMembers,
    useRecommendations,
    usePopularSkills,
    useSearchFilters
  }
}
