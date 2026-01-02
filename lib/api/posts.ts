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
  likes?: string[]
  isLiked: boolean
  isSaved: boolean
  isPinned: boolean
  isAdminPost: boolean
  createdAt: string
  updatedAt: string
  // Shared Post Fields
  postType?: 'REGULAR' | 'SHARED' | 'ADMIN_ANNOUNCEMENT'
  isShared?: boolean
  originalPost?: Post
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

// Helper to ensure ID exists (mapping _id to id if needed)
const mapPost = (post: any): Post => {
  if (!post) return post
  return {
    ...post,
    id: post.id || post._id,
    isSaved: post.isSaved || post.saves?.length > 0 || false, // Fallback if isSaved isn't directly boolean
    author: post.author ? {
      ...post.author,
      id: post.author.id || post.author._id
    } : post.author,
    originalPost: post.originalPost ? mapPost(post.originalPost) : undefined
  }
}

const mapComment = (comment: any): Comment => {
  if (!comment) return comment
  return {
    ...comment,
    id: comment.id || comment._id,
    author: comment.author ? {
      ...comment.author,
      id: comment.author.id || comment.author._id
    } : comment.author,
    parentCommentId: comment.parentComment || comment.parentCommentId
  }
}

export const postsApi = {
  // ============================================
  // FEED & POSTS
  // ============================================

  /**
   * Get posts feed with pagination
   */
  getFeed: async (page = 1, limit = 10): Promise<FeedResponse> => {
    try {
      const response = await apiClient.get<FeedResponse>(`/posts/feed?page=${page}&limit=${limit}`)
      
      // Map posts to ensure IDs exist
      if (response && response.posts) {
        response.posts = response.posts.map(mapPost)
      }
      
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
    const response = await apiClient.post<{ post: Post }>('/posts', data)
    if (response && response.post) {
      response.post = mapPost(response.post)
    }
    return response
  },

  /**
   * Get a specific post
   */
  getPost: async (postId: string): Promise<{ post: Post }> => {
    const response = await apiClient.get<{ post: Post }>(`/posts/${postId}`)
    if (response && response.post) {
      response.post = mapPost(response.post)
    }
    return response
  },

  /**
   * Update a post (author only)
   */
  updatePost: async (postId: string, data: Partial<CreatePostInput>): Promise<{ post: Post }> => {
    const response = await apiClient.patch<{ post: Post }>(`/posts/${postId}`, data)
    if (response && response.post) {
      response.post = mapPost(response.post)
    }
    return response
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
    const response = await apiClient.post<{ post: Post; message: string }>(`/posts/${postId}/share`, {
      shareComment,
      visibility
    })
    if (response && response.post) {
      response.post = mapPost(response.post)
    }
    return response
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
    const response = await apiClient.get<CommentsResponse>(`/posts/${postId}/comments?page=${page}&limit=${limit}`)
    if (response && response.comments) {
      response.comments = response.comments.map(mapComment)
    }
    return response
  },

  /**
   * Get replies for a comment
   */
  getReplies: async (commentId: string, page = 1, limit = 10): Promise<CommentsResponse> => {
    const response = await apiClient.get<CommentsResponse>(`/posts/comments/${commentId}/replies?page=${page}&limit=${limit}`)
    if (response && response.comments) {
      response.comments = response.comments.map(mapComment)
    }
    return response
  },

  /**
   * Add a comment to a post
   */
  addComment: async (postId: string, content: string, parentCommentId?: string): Promise<{ comment: Comment }> => {
    const response = await apiClient.post<{ comment: Comment }>(`/posts/${postId}/comments`, {
      content,
      parentCommentId
    })
    if (response && response.comment) {
      response.comment = mapComment(response.comment)
    }
    return response
  },

  /**
   * Delete a comment
   */
  deleteComment: async (commentId: string): Promise<{ message: string }> => {
    return await apiClient.delete<{ message: string }>(`/posts/comments/${commentId}`)
  },

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
    const response = await apiClient.get<SavedPostsResponse>(`/posts/saved?${params}`)
    if (response && response.posts) {
      response.posts = response.posts.map(mapPost)
    }
    return response
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
    const response = await apiClient.post<{ post: Post; message: string }>('/posts/admin', data)
    if (response && response.post) {
      response.post = mapPost(response.post)
    }
    return response
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