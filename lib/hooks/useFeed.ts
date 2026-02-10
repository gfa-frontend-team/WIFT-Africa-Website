'use client'

import { useInfiniteQuery, useMutation, useQueryClient, InfiniteData } from '@tanstack/react-query'
import { postsApi, type Post, type FeedResponse } from '../api/posts'
import { useFeedStore } from '../stores/feedStore'

// Query keys
export const feedKeys = {
  all: ['feed'] as const,
  list: (filters: { type: string }) => [...feedKeys.all, { filters }] as const,
}

export function useFeed() {
  const { filters } = useFeedStore()
  const queryClient = useQueryClient()

  // Infinite Feed Query
  const feedQuery = useInfiniteQuery({
    queryKey: feedKeys.list(filters),
    initialPageParam: 1,
    queryFn: async ({ pageParam = 1 }) => {
      // Pass filters if API supports them (assuming API structure)
      // For now using the existing getFeed signature
      const response = await postsApi.getFeed(pageParam, 10)
      return response
    },
    getNextPageParam: (lastPage, allPages) => {
      // Handle flat pagination structure (current API behavior)
      if (lastPage.pages) {
        const nextPage = allPages.length + 1
        return nextPage <= lastPage.pages ? nextPage : undefined
      }

      // Handle nested pagination structure (interface definition)
      if (lastPage.pagination && lastPage.pagination.hasNext) {
        return lastPage.pagination.page + 1
      }

      return undefined
    },
    staleTime: 60 * 1000, // 1 minute stale time
  })

  // Mutations
  const likeMutation = useMutation({
    mutationFn: (postId: string) => postsApi.toggleLike(postId),
    onMutate: async (postId) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: feedKeys.list(filters) })

      // Snapshot previous value
      const previousFeed = queryClient.getQueryData<InfiniteData<FeedResponse>>(feedKeys.list(filters))

      // Optimistic update
      queryClient.setQueryData<InfiniteData<FeedResponse>>(feedKeys.list(filters), (old) => {
        if (!old) return old

        return {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            posts: page.posts.map((post: Post) => {
              if (post.id === postId) {
                return {
                  ...post,
                  isLiked: !post.isLiked,
                  likesCount: post.isLiked ? post.likesCount - 1 : post.likesCount + 1,
                }
              }
              return post
            }),
          })),
        }
      })

      return { previousFeed }
    },
    onError: (_err, _postId, context) => {
      queryClient.setQueryData(feedKeys.list(filters), context?.previousFeed)
    },
    onSettled: () => {
      // Optionally invalidate to ensure strict consistency
      // queryClient.invalidateQueries({ queryKey: feedKeys.list(filters) })
    },
  })

  const saveMutation = useMutation({
    mutationFn: ({ postId, collectionName }: { postId: string; collectionName?: string }) =>
      postsApi.toggleSave(postId, collectionName),
    onMutate: async ({ postId }) => {
      await queryClient.cancelQueries({ queryKey: feedKeys.list(filters) })
      const previousFeed = queryClient.getQueryData<InfiniteData<FeedResponse>>(feedKeys.list(filters))

      queryClient.setQueryData<InfiniteData<FeedResponse>>(feedKeys.list(filters), (old) => {
        if (!old) return old
        return {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            posts: page.posts.map((post: Post) => {
              if (post.id === postId) {
                return { ...post, isSaved: !post.isSaved }
              }
              return post
            }),
          })),
        }
      })

      return { previousFeed }
    },
    onError: (_err, _variables, context) => {
      queryClient.setQueryData(feedKeys.list(filters), context?.previousFeed)
    },
  })

  return {
    // Data
    posts: feedQuery.data?.pages.flatMap((page) => page?.posts || []) || [],
    isLoading: feedQuery.isLoading,
    isError: feedQuery.isError,
    error: feedQuery.error,
    hasMore: feedQuery.hasNextPage,
    isFetchingNextPage: feedQuery.isFetchingNextPage,

    // Actions
    fetchNextPage: feedQuery.fetchNextPage,
    refetch: feedQuery.refetch,
    likePost: (postId: string) => likeMutation.mutate(postId),
    savePost: (postId: string, collectionName?: string) => saveMutation.mutate({ postId, collectionName }),
  }
}
