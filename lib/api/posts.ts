import { apiClient } from './client'

// ============================================
// REQUEST/RESPONSE TYPES
// ============================================

export interface CreatePostInput {
  content: string
  visibility?: 'PUBLIC' | 'CHAPTER_ONLY' | 'CONNECTIONS_ONLY'
  media?: Array<{
    type: 'image' | 'video'
    url: string
  }>
}

export interface Post {
  id: string
  content: string
  visibility: 'PUBLIC' | 'CHAPTER_ONLY' | 'CONNECTIONS_ONLY'
  media?: Array<{
    type: 'image' | 'video'
    url: string
  }>
  author: {
    id: string
    firstName: string
    lastName: string
    profilePhoto?: string
    username: string
    primaryRole: string
  }
  likesCount: number
  commentsCount: number
  sharesCount: number
  savesCount: number
  isLiked: boolean
  isSaved: boolean
  isPinned: boolean
  isAdminPost: boolean
  createdAt: string
  updatedAt: string
}

export interface Comment {
  id: string
  content: string
  author: {
    id: string
    firstName: string
    lastName: string
    profilePhoto?: string
    username: string
  }
  likesCount: number
  repliesCount: number
  isLiked: boolean
  parentCommentId?: string
  createdAt: string
}

export interface FeedResponse {
  posts: Post[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

export interface CommentsResponse {
  comments: Comment[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

export interface SavedPostsResponse {
  posts: Post[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

export interface SavedCollectionsResponse {
  collections: Array<{
    name: string
    count: number
    lastSaved: string
  }>
}

// ============================================
// POSTS API
// ============================================

export const postsApi = {
  // ============================================
  // FEED & POSTS
  // ============================================

  /**
   * Get posts feed with pagination
   */
  getFeed: async (page = 1, limit = 10): Promise<FeedResponse> => {
    console.log(`🔄 Fetching feed: page=${page}, limit=${limit}`)
    try {
      const response = await apiClient.get<FeedResponse>(`/posts/feed?page=${page}&limit=${limit}`)
      console.log('✅ Feed response received:', response)
      return response
    } catch (error) {
      console.error('❌ Feed API error:', error)
      throw error
    }
  },

  /**
   * Create a new post
   */
  createPost: async (data: CreatePostInput): Promise<{ post: Post }> => {
    return await apiClient.post<{ post: Post }>('/posts', data)
  },

  /**
   * Get a specific post
   */
  getPost: async (postId: string): Promise<{ post: Post }> => {
    return await apiClient.get<{ post: Post }>(`/posts/${postId}`)
  },

  /**
   * Update a post (author only)
   */
  updatePost: async (postId: string, data: Partial<CreatePostInput>): Promise<{ post: Post }> => {
    return await apiClient.patch<{ post: Post }>(`/posts/${postId}`, data)
  },

  /**
   * Delete a post (author only)
   */
  deletePost: async (postId: string): Promise<{ message: string }> => {
    return await apiClient.delete<{ message: string }>(`/posts/${postId}`)
  },

  // ============================================
  // POST INTERACTIONS
  // ============================================

  /**
   * Like or unlike a post
   */
  toggleLike: async (postId: string): Promise<{ liked: boolean; likesCount: number; message: string }> => {
    return await apiClient.post<{ liked: boolean; likesCount: number; message: string }>(`/posts/${postId}/like`)
  },

  /**
   * Share a post with optional comment
   */
  sharePost: async (postId: string, shareComment?: string, visibility?: 'PUBLIC' | 'CHAPTER_ONLY' | 'CONNECTIONS_ONLY'): Promise<{ post: Post; message: string }> => {
    return await apiClient.post<{ post: Post; message: string }>(`/posts/${postId}/share`, {
      shareComment,
      visibility
    })
  },

  /**
   * Save or unsave a post
   */
  toggleSave: async (postId: string, collectionName = 'default'): Promise<{ saved: boolean; collectionName: string; message: string }> => {
    return await apiClient.post<{ saved: boolean; collectionName: string; message: string }>(`/posts/${postId}/save`, {
      collectionName
    })
  },

  /**
   * Check if post is saved
   */
  isPostSaved: async (postId: string): Promise<{ saved: boolean }> => {
    return await apiClient.get<{ saved: boolean }>(`/posts/${postId}/is-saved`)
  },

  // ============================================
  // COMMENTS
  // ============================================

  /**
   * Get comments for a post
   */
  getComments: async (postId: string, page = 1, limit = 20): Promise<CommentsResponse> => {
    return await apiClient.get<CommentsResponse>(`/posts/${postId}/comments?page=${page}&limit=${limit}`)
  },

  /**
   * Add a comment to a post
   */
  addComment: async (postId: string, content: string, parentCommentId?: string): Promise<{ comment: Comment }> => {
    return await apiClient.post<{ comment: Comment }>(`/posts/${postId}/comments`, {
      content,
      parentCommentId
    })
  },

  /**
   * Delete a comment
   */
  deleteComment: async (commentId: string): Promise<{ message: string }> => {
    return await apiClient.delete<{ message: string }>(`/posts/comments/${commentId}`)
  },

  // ============================================
  // SAVED POSTS
  // ============================================

  /**
   * Get saved posts
   */
  getSavedPosts: async (page = 1, limit = 10, collection?: string): Promise<SavedPostsResponse> => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString()
    })
    if (collection) {
      params.append('collection', collection)
    }
    return await apiClient.get<SavedPostsResponse>(`/posts/saved?${params}`)
  },

  /**
   * Get saved collections
   */
  getSavedCollections: async (): Promise<SavedCollectionsResponse> => {
    return await apiClient.get<SavedCollectionsResponse>('/posts/saved/collections')
  },

  // ============================================
  // ADMIN FEATURES
  // ============================================

  /**
   * Create admin announcement post
   */
  createAdminPost: async (data: CreatePostInput & { 
    targetChapters?: string[]
    isPinned?: boolean 
  }): Promise<{ post: Post; message: string }> => {
    return await apiClient.post<{ post: Post; message: string }>('/posts/admin', data)
  },

  /**
   * Pin or unpin a post (admin only)
   */
  togglePin: async (postId: string): Promise<{ pinned: boolean; message: string }> => {
    return await apiClient.post<{ pinned: boolean; message: string }>(`/posts/${postId}/pin`)
  },

  // ============================================
  // ANALYTICS
  // ============================================

  /**
   * Get post shares
   */
  getPostShares: async (postId: string, page = 1, limit = 20): Promise<{
    shares: Array<{
      id: string
      shareComment?: string
      sharedBy: {
        id: string
        firstName: string
        lastName: string
        profilePhoto?: string
        username: string
      }
      sharedAt: string
    }>
    pagination: {
      page: number
      limit: number
      total: number
      totalPages: number
      hasNext: boolean
      hasPrev: boolean
    }
  }> => {
    return await apiClient.get(`/posts/${postId}/shares?page=${page}&limit=${limit}`)
  }
}