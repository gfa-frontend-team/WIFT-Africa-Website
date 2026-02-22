'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { postsApi, type Post } from '../api/posts'
import { feedKeys } from './useFeed'
import { useFeedStore } from '../stores/feedStore'
import { useSavedPostsStore } from '../stores/savedPostsStore'

export function usePostMutations() {
  const queryClient = useQueryClient()
  const { filters } = useFeedStore()
  const { addSavedPostId, removeSavedPostId } = useSavedPostsStore()

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
      // 1. Cancel related queries
      await queryClient.cancelQueries({ queryKey: feedKeys.list(filters) })
      await queryClient.cancelQueries({ queryKey: ['saved-posts'] })
      // await queryClient.cancelQueries({ queryKey: ['saved-posts-count'] })

      // 2. Snapshot previous values
      const previousFeed = queryClient.getQueryData(feedKeys.list(filters))
      // Note: We can't easily snapshot all saved-posts pages, so we'll rely on invalidation for rollback in worst case
      
      // 3. Optimistic Updates

      // Update Local Store (Instant UI feedback for bookmark icon)
      // Check current state from store or feed to toggle correctly
      const isSaved = useSavedPostsStore.getState().hasSavedPost(postId)
      if (isSaved) {
          removeSavedPostId(postId)
      } else {
          addSavedPostId(postId)
      }

      // Update Main Feed
      queryClient.setQueryData(feedKeys.list(filters), (old: any) => {
        if (!old) return old
        return {
          ...old,
          pages: old.pages.map((page: any) => ({
            ...page,
            posts: page.posts.map((post: Post) => {
              if (post.id === postId) {
                return { ...post, isSaved: !post.isSaved, savesCount: post.isSaved ? post.savesCount - 1 : post.savesCount + 1 }
              }
              return post
            }),
          })),
        }
      })

      // Update Saved Posts List (Optimistic Removal/Addition)
      // This is a bit complex as we don't know the exact page, but we can iterate over all 'saved-posts' queries
      queryClient.setQueriesData({ queryKey: ['saved-posts'] }, (old: any) => {
        if (!old || !old.posts) return old
        
        // If we are un-saving, filter it out
        // If we are saving, we might not have the full post object here easily to add it, 
        // so we'll primarily focus on removal which is the user's request for "optimistic ui" on saved page.
        // For adding, invalidation usually feels fast enough, or we'd need the post object in the mutation input.
        
        // Check if post exists in this list
        const exists = old.posts.some((p: Post) => p.id === postId)
        
        if (exists) {
             // If it exists, update isSaved to false (which effectively removes it from view if filter applies, 
             // but strictly speaking we should filter it out if this is a "saved only" list)
             // However, simply filtering it out gives the "disappear" effect.
             return {
                 ...old,
                 posts: old.posts.filter((p: Post) => p.id !== postId)
             }
        }
        return old
      })

       // Optimistic Count Update
      //  queryClient.setQueryData(['saved-posts-count'], (old: number | undefined) => {
      //      if (typeof old === 'number') {
      //           // Find post in feed to check current state, or assume toggle
      //           // Since we don't have previous state easily here without looking it up,
      //           // we might risk being off by 1 if we guess wrong. 
      //           // A safer bet is to wait for invalidation, but user asked for optimistic.
      //           // We'll trust the feed's previous state if available.
      //           const feed: any = queryClient.getQueryData(feedKeys.list(filters))
      //           let wasSaved = false
      //           feed?.pages?.forEach((p: any) => p.posts?.forEach((post: Post) => {
      //               if (post.id === postId) wasSaved = post.isSaved
      //           }))
      //           return wasSaved ? old - 1 : old + 1
      //      }
      //      return old
      //  })

      return { previousFeed }
    },
    onSuccess: ()=>{
      // queryClient.invalidateQueries({ queryKey: ["saved-posts-count"] });
      queryClient.invalidateQueries({ queryKey: ["saved-posts-count"] });
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(feedKeys.list(filters), context?.previousFeed)
    },
    onSettled: () => {
        // Invalidate everything to ensure eventual consistency
        queryClient.invalidateQueries({ queryKey: feedKeys.list(filters) })
        queryClient.invalidateQueries({ queryKey: ['saved-posts'] })
        // queryClient.invalidateQueries({ queryKey: ['saved-posts-count'] })
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

  const shareMutation = useMutation({
    mutationFn: ({ postId, shareComment, visibility }: { postId: string; shareComment?: string; visibility?: 'PUBLIC' | 'CHAPTER_ONLY' | 'CONNECTIONS_ONLY' }) =>
      postsApi.sharePost(postId, shareComment, visibility),
    onSuccess: (response) => {
      // Invalidate feed to show shared post
      queryClient.invalidateQueries({ queryKey: feedKeys.list(filters) })
      // Invalidating profile posts or other lists might also be needed depending on where the user is
    },
    onError: (error) => {
        console.error("Failed to share post:", error)
    }
  })

  return {
    likePost: (postId: string) => likeMutation.mutateAsync(postId),
    savePost: (postId: string) => saveMutation.mutateAsync({ postId }),
    sharePost: (postId: string, shareComment?: string, visibility?: 'PUBLIC' | 'CHAPTER_ONLY' | 'CONNECTIONS_ONLY') => 
        shareMutation.mutateAsync({ postId, shareComment, visibility }),
    createPost: (data: any) => createMutation.mutateAsync(data),
    isLiking: likeMutation.isPending,
    isSaving: saveMutation.isPending,
    isSharing: shareMutation.isPending,
    isCreating: createMutation.isPending
  }
}
