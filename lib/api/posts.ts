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
    profileSlug?: string
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
    profileSlug?: string
  }
  likesCount: number
  repliesCount: number
  isLiked: boolean
  parentCommentId?: string
  createdAt: string
}

export interface FeedResponse {
  posts: Post[]
  // Support both nested and flat pagination structures
  pagination?: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
  // Flat pagination structure from some endpoints
  total?: number
  pages?: number
  page?: number
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
const mapPost = (post: Post | null | undefined): Post | null | undefined => {
  if (!post) return post
  const postWithId = post as Post & { _id?: string; saves?: unknown[] }
  return {
    ...post,
    id: post.id || postWithId._id || '',
    isSaved: post.isSaved || (postWithId.saves && postWithId.saves.length > 0) || false,
    author: post.author ? {
      ...post.author,
      id: post.author.id || (post.author as typeof post.author & { _id?: string })._id || ''
    } : post.author,
    originalPost: post.originalPost ? mapPost(post.originalPost) as Post : undefined
  }
}

const mapComment = (comment: Comment | null | undefined): Comment | null | undefined => {
  if (!comment) return comment
  const commentWithId = comment as Comment & { _id?: string; parentComment?: string }
  return {
    ...comment,
    id: comment.id || commentWithId._id || '',
    author: comment.author ? {
      ...comment.author,
      id: comment.author.id || (comment.author as typeof comment.author & { _id?: string })._id || ''
    } : comment.author,
    parentCommentId: commentWithId.parentComment || comment.parentCommentId
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
        response.posts = response.posts.map(mapPost).filter((p): p is Post => p !== null && p !== undefined)
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
      const mapped = mapPost(response.post)
      if (mapped) response.post = mapped
    }
    return response
  },

  /**
   * Get a specific post
   */
  getPost: async (postId: string): Promise<{ post: Post }> => {
    const response = await apiClient.get<{ post: Post }>(`/posts/${postId}`)
    if (response && response.post) {
      const mapped = mapPost(response.post)
      if (mapped) response.post = mapped
    }
    return response
  },

  /**
   * Update a post (author only)
   */
  updatePost: async (postId: string, data: Partial<CreatePostInput>): Promise<{ post: Post }> => {
    const response = await apiClient.patch<{ post: Post }>(`/posts/${postId}`, data)
    if (response && response.post) {
      const mapped = mapPost(response.post)
      if (mapped) response.post = mapped
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
   * Get list of users who liked a post
   */
  getPostLikes: async (postId: string, page = 1, limit = 20): Promise<{
    users: Array<{
      id: string
      firstName: string
      lastName: string
      username: string
      profileSlug?: string
      profilePhoto?: string
      headline?: string
      primaryRole?: string
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
    interface UserWithId {
      id?: string
      _id?: string
      firstName: string
      lastName: string
      username: string
      profileSlug?: string
      profilePhoto?: string
      headline?: string
      primaryRole?: string
    }

    const response = await apiClient.get<{
      users: UserWithId[]
      pagination: {
        page: number
        limit: number
        total: number
        totalPages: number
        hasNext: boolean
        hasPrev: boolean
      }
    }>(`/posts/${postId}/likes?page=${page}&limit=${limit}`)

    if (response && response.users) {
      response.users = response.users.map((user) => ({
        ...user,
        id: user.id || user._id || ''
      }))
    }
    return response as {
      users: Array<{
        id: string
        firstName: string
        lastName: string
        username: string
        profileSlug?: string
        profilePhoto?: string
        headline?: string
        primaryRole?: string
      }>
      pagination: {
        page: number
        limit: number
        total: number
        totalPages: number
        hasNext: boolean
        hasPrev: boolean
      }
    }
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
      const mapped = mapPost(response.post)
      if (mapped) response.post = mapped
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
      response.comments = response.comments.map(mapComment).filter((c): c is Comment => c !== null && c !== undefined)
    }
    return response
  },

  /**
   * Get replies for a comment
   */
  getReplies: async (commentId: string, page = 1, limit = 10): Promise<CommentsResponse> => {
    const response = await apiClient.get<CommentsResponse>(`/posts/comments/${commentId}/replies?page=${page}&limit=${limit}`)
    if (response && response.comments) {
      response.comments = response.comments.map(mapComment).filter((c): c is Comment => c !== null && c !== undefined)
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
      const mapped = mapComment(response.comment)
      if (mapped) response.comment = mapped
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
      response.posts = response.posts.map(mapPost).filter((p): p is Post => p !== null && p !== undefined)
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
      const mapped = mapPost(response.post)
      if (mapped) response.post = mapped
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
        profileSlug?: string
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