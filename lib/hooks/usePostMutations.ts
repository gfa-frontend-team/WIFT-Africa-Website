'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { postsApi, type Post } from '../api/posts'
import { feedKeys } from './useFeed'
import { useFeedStore } from '../stores/feedStore'

export function usePostMutations() {
  const queryClient = useQueryClient()
  const { filters } = useFeedStore()

  const likeMutation = useMutation({
    mutationFn: (postId: string) => postsApi.toggleLike(postId),
    onMutate: async (postId) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: feedKeys.list(filters) })

      // Snapshot previous value
      const previousFeed = queryClient.getQueryData(feedKeys.list(filters))

      // Optimistic update for Feed
      queryClient.setQueryData(feedKeys.list(filters), (old: any) => {
        if (!old) return old

        return {
          ...old,
          pages: old.pages.map((page: any) => ({
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
    onError: (err, newTodo, context) => {
      queryClient.setQueryData(feedKeys.list(filters), context?.previousFeed)
    },
    onSettled: () => {
       // Invalidate to ensure consistency
       queryClient.invalidateQueries({ queryKey: feedKeys.list(filters) })
    },
  })

  const saveMutation = useMutation({
    mutationFn: ({ postId, collectionName }: { postId: string; collectionName?: string }) => 
      postsApi.toggleSave(postId, collectionName),
    onMutate: async ({ postId }) => {
      await queryClient.cancelQueries({ queryKey: feedKeys.list(filters) })
      const previousFeed = queryClient.getQueryData(feedKeys.list(filters))

      queryClient.setQueryData(feedKeys.list(filters), (old: any) => {
        if (!old) return old
        return {
          ...old,
          pages: old.pages.map((page: any) => ({
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
    onError: (err, variables, context) => {
      queryClient.setQueryData(feedKeys.list(filters), context?.previousFeed)
    },
    onSettled: () => {
        queryClient.invalidateQueries({ queryKey: feedKeys.list(filters) })
     },
  })



  const createMutation = useMutation({
    mutationFn: (data: any) => postsApi.createPost(data),
    onSuccess: (response) => {
      // Invalidate feed to show new post
      queryClient.invalidateQueries({ queryKey: feedKeys.list(filters) })
      // Optionally update cache manually if we want instant feedback without refetch
      // queryClient.setQueryData(feedKeys.list(filters), (old: any) => {
      //   if (!old) return old
      //   // Add to first page
      //   const firstPage = old.pages[0]
      //   return {
      //     ...old,
      //     pages: [
      //       { ...firstPage, posts: [response.post, ...firstPage.posts] },
      //       ...old.pages.slice(1)
      //     ]
      //   }
      // })
    }
  })

  return {
    likePost: (postId: string) => likeMutation.mutateAsync(postId),
    savePost: (postId: string) => saveMutation.mutateAsync({ postId }),
    createPost: (data: any) => createMutation.mutateAsync(data),
    isLiking: likeMutation.isPending,
    isSaving: saveMutation.isPending,
    isCreating: createMutation.isPending
  }
}
