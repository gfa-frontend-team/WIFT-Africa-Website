'use client'

import { useQuery } from '@tanstack/react-query'
import { postsApi } from '../api/posts'

export const useSavedPosts = (page = 1, limit = 10, collection?: string) => {
  return useQuery({
    queryKey: ['saved-posts', page, limit, collection],
    queryFn: () => postsApi.getSavedPosts(page, limit, collection),
    // Keep data fresh but don't refetch too aggressively
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

// Dedicated hook for just the count (fetches minimal data)
export const useSavedPostsCount = () => {
    return useQuery({
        queryKey: ['saved-posts-count'],
        queryFn: async () => {
            const response = await postsApi.getSavedPosts(1, 1)
            // Handle both pagination.total and root total depending on response
            return response?.pagination?.total ?? (response as any)?.total ?? 0
        },
        staleTime: 1000 * 60 * 5,
        retry: false // Don't retry if it fails (e.g. backend error)
    })
}
