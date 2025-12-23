import { create } from 'zustand'
import { postsApi, type Post } from '../api/posts'

interface FeedFilters {
  type: 'all' | 'posts' | 'admin'
}

interface FeedStore {
  // State
  posts: Post[]
  isLoading: boolean
  hasMore: boolean
  error: string | null
  filters: FeedFilters
  currentPage: number
  lastFetchTime: number // Track when we last fetched to avoid rapid requests

  // Actions
  fetchFeed: () => Promise<void>
  loadMore: () => Promise<void>
  refreshFeed: () => Promise<void>
  setFilters: (filters: Partial<FeedFilters>) => void
  likePost: (postId: string) => Promise<void>
  unlikePost: (postId: string) => Promise<void>
  savePost: (postId: string, collectionName?: string) => Promise<void>
  unsavePost: (postId: string) => Promise<void>
  addPost: (post: Post) => void
  updatePost: (postId: string, updates: Partial<Post>) => void
  removePost: (postId: string) => void
  clearError: () => void
}

export const useFeedStore = create<FeedStore>((set, get) => ({
  // Initial state
  posts: [],
  isLoading: false,
  hasMore: true,
  error: null,
  filters: { type: 'all' },
  currentPage: 1,
  lastFetchTime: 0,

  // Actions
  fetchFeed: async () => {
    const { isLoading, lastFetchTime } = get()
    
    // Prevent rapid successive requests (minimum 2 seconds between fetches)
    const now = Date.now()
    if (isLoading || (now - lastFetchTime < 2000)) {
      console.log('🔄 Skipping fetch - too soon since last request')
      return
    }

    try {
      set({ isLoading: true, error: null, lastFetchTime: now })
      
      const response = await postsApi.getFeed(1, 10)
      
      // Handle case where response might be undefined or malformed
      if (!response) {
        throw new Error('No response received from server')
      }

      const posts = response.posts || []
      const pagination = response.pagination || { hasNext: false, hasPrev: false }
      
      set({
        posts,
        hasMore: pagination.hasNext || false,
        currentPage: 1,
        isLoading: false
      })
    } catch (error: unknown) {
      console.error('Failed to fetch feed:', error)
      let errorMessage = 'Failed to load feed'
      
      // Handle rate limiting specifically
      if (error && typeof error === 'object' && 'name' in error && error.name === 'RateLimitError') {
        errorMessage = 'Server is busy. Please wait a moment before refreshing.'
      } else if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: { error?: string }; status?: number }; message?: string }
        if (axiosError.response?.status === 429) {
          errorMessage = 'Too many requests. Please wait a moment before trying again.'
        } else {
          errorMessage = axiosError.response?.data?.error || axiosError.message || errorMessage
        }
      } else if (error instanceof Error) {
        errorMessage = error.message
      }
      
      set({
        error: errorMessage,
        isLoading: false
      })
    }
  },

  loadMore: async () => {
    const { currentPage, hasMore, isLoading } = get()
    
    if (!hasMore || isLoading) return

    try {
      set({ isLoading: true })
      
      const nextPage = currentPage + 1
      const response = await postsApi.getFeed(nextPage, 10)
      
      // Handle case where response might be undefined or malformed
      if (!response) {
        throw new Error('No response received from server')
      }

      const newPosts = response.posts || []
      const pagination = response.pagination || { hasNext: false, hasPrev: false }
      
      set((state) => ({
        posts: [...state.posts, ...newPosts],
        hasMore: pagination.hasNext || false,
        currentPage: nextPage,
        isLoading: false
      }))
    } catch (error: unknown) {
      console.error('Failed to load more posts:', error)
      let errorMessage = 'Failed to load more posts'
      
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: { error?: string } }; message?: string }
        errorMessage = axiosError.response?.data?.error || axiosError.message || errorMessage
      } else if (error instanceof Error) {
        errorMessage = error.message
      }
      
      set({
        error: errorMessage,
        isLoading: false
      })
    }
  },

  refreshFeed: async () => {
    const { isLoading, lastFetchTime } = get()
    
    // Allow refresh but with a shorter cooldown (1 second)
    const now = Date.now()
    if (isLoading || (now - lastFetchTime < 1000)) {
      console.log('🔄 Skipping refresh - too soon since last request')
      return
    }

    try {
      set({ error: null, lastFetchTime: now })
      
      const response = await postsApi.getFeed(1, 10)
      
      // Handle case where response might be undefined or malformed
      if (!response) {
        throw new Error('No response received from server')
      }

      const posts = response.posts || []
      const pagination = response.pagination || { hasNext: false, hasPrev: false }
      
      set({
        posts,
        hasMore: pagination.hasNext || false,
        currentPage: 1,
        isLoading: false
      })
    } catch (error: unknown) {
      console.error('Failed to refresh feed:', error)
      let errorMessage = 'Failed to refresh feed'
      
      // Handle rate limiting specifically
      if (error && typeof error === 'object' && 'name' in error && error.name === 'RateLimitError') {
        errorMessage = 'Server is busy. Please wait a moment before refreshing.'
      } else if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: { error?: string }; status?: number }; message?: string }
        if (axiosError.response?.status === 429) {
          errorMessage = 'Too many requests. Please wait a moment before trying again.'
        } else {
          errorMessage = axiosError.response?.data?.error || axiosError.message || errorMessage
        }
      } else if (error instanceof Error) {
        errorMessage = error.message
      }
      
      set({
        error: errorMessage
      })
    }
  },

  setFilters: (newFilters) => {
    set((state) => ({
      filters: { ...state.filters, ...newFilters }
    }))
    // Refetch feed with new filters
    get().fetchFeed()
  },

  likePost: async (postId: string) => {
    try {
      // Optimistic update
      set((state) => ({
        posts: state.posts.map((post) =>
          post.id === postId
            ? { 
                ...post, 
                isLiked: true, 
                likesCount: post.likesCount + 1 
              }
            : post
        )
      }))

      const response = await postsApi.toggleLike(postId)
      
      // Update with server response
      set((state) => ({
        posts: state.posts.map((post) =>
          post.id === postId
            ? { 
                ...post, 
                isLiked: response.liked, 
                likesCount: response.likesCount 
              }
            : post
        )
      }))
    } catch (error: unknown) {
      console.error('Failed to like post:', error)
      let errorMessage = 'Failed to like post'
      
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: { error?: string } }; message?: string }
        errorMessage = axiosError.response?.data?.error || errorMessage
      } else if (error instanceof Error) {
        errorMessage = error.message
      }
      
      // Revert optimistic update
      set((state) => ({
        posts: state.posts.map((post) =>
          post.id === postId
            ? { 
                ...post, 
                isLiked: false, 
                likesCount: Math.max(0, post.likesCount - 1) 
              }
            : post
        ),
        error: errorMessage
      }))
    }
  },

  unlikePost: async (postId: string) => {
    try {
      // Optimistic update
      set((state) => ({
        posts: state.posts.map((post) =>
          post.id === postId
            ? { 
                ...post, 
                isLiked: false, 
                likesCount: Math.max(0, post.likesCount - 1) 
              }
            : post
        )
      }))

      const response = await postsApi.toggleLike(postId)
      
      // Update with server response
      set((state) => ({
        posts: state.posts.map((post) =>
          post.id === postId
            ? { 
                ...post, 
                isLiked: response.liked, 
                likesCount: response.likesCount 
              }
            : post
        )
      }))
    } catch (error: unknown) {
      console.error('Failed to unlike post:', error)
      let errorMessage = 'Failed to unlike post'
      
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: { error?: string } }; message?: string }
        errorMessage = axiosError.response?.data?.error || errorMessage
      } else if (error instanceof Error) {
        errorMessage = error.message
      }
      
      // Revert optimistic update
      set((state) => ({
        posts: state.posts.map((post) =>
          post.id === postId
            ? { 
                ...post, 
                isLiked: true, 
                likesCount: post.likesCount + 1 
              }
            : post
        ),
        error: errorMessage
      }))
    }
  },

  savePost: async (postId: string, collectionName = 'default') => {
    try {
      // Optimistic update
      set((state) => ({
        posts: state.posts.map((post) =>
          post.id === postId
            ? { ...post, isSaved: true }
            : post
        )
      }))

      await postsApi.toggleSave(postId, collectionName)
    } catch (error: unknown) {
      console.error('Failed to save post:', error)
      let errorMessage = 'Failed to save post'
      
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: { error?: string } }; message?: string }
        errorMessage = axiosError.response?.data?.error || errorMessage
      } else if (error instanceof Error) {
        errorMessage = error.message
      }
      
      // Revert optimistic update
      set((state) => ({
        posts: state.posts.map((post) =>
          post.id === postId
            ? { ...post, isSaved: false }
            : post
        ),
        error: errorMessage
      }))
    }
  },

  unsavePost: async (postId: string) => {
    try {
      // Optimistic update
      set((state) => ({
        posts: state.posts.map((post) =>
          post.id === postId
            ? { ...post, isSaved: false }
            : post
        )
      }))

      await postsApi.toggleSave(postId)
    } catch (error: unknown) {
      console.error('Failed to unsave post:', error)
      let errorMessage = 'Failed to unsave post'
      
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: { error?: string } }; message?: string }
        errorMessage = axiosError.response?.data?.error || errorMessage
      } else if (error instanceof Error) {
        errorMessage = error.message
      }
      
      // Revert optimistic update
      set((state) => ({
        posts: state.posts.map((post) =>
          post.id === postId
            ? { ...post, isSaved: true }
            : post
        ),
        error: errorMessage
      }))
    }
  },

  addPost: (post: Post) => {
    set((state) => ({
      posts: [post, ...state.posts]
    }))
  },

  updatePost: (postId: string, updates: Partial<Post>) => {
    set((state) => ({
      posts: state.posts.map((post) =>
        post.id === postId ? { ...post, ...updates } : post
      )
    }))
  },

  removePost: (postId: string) => {
    set((state) => ({
      posts: state.posts.filter((post) => post.id !== postId)
    }))
  },

  clearError: () => {
    set({ error: null })
  }
}))

export default useFeedStore