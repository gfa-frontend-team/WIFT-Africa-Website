// ============================================
// Posts API Types
// ============================================

// --------------------------------------------
// Enums
// --------------------------------------------

export enum PostVisibility {
  PUBLIC = 'PUBLIC',
  CHAPTER_ONLY = 'CHAPTER_ONLY',
  CONNECTIONS_ONLY = 'CONNECTIONS_ONLY'
}

export enum PostType {
  REGULAR = 'REGULAR',
  ADMIN_ANNOUNCEMENT = 'ADMIN_ANNOUNCEMENT',
  SHARED = 'SHARED'
}

export type MediaType = 'image' | 'video';

// --------------------------------------------
// Request Types
// --------------------------------------------

export interface CreatePostRequest {
  content: string;
  visibility?: PostVisibility;
  media?: Array<{
    type: MediaType;
    url: string;
  }>;
}

export interface CreateAdminPostRequest {
  content: string;
  targetChapters?: string[];
  isPinned?: boolean;
  media?: Array<{
    type: MediaType;
    url: string;
  }>;
}

export interface UpdatePostRequest {
  content?: string;
  visibility?: PostVisibility;
}

export interface CreateCommentRequest {
  content: string;
  parentCommentId?: string;
}

export interface SharePostRequest {
  shareComment?: string;
  visibility?: PostVisibility;
}

export interface SavePostRequest {
  collection?: string;
}

// --------------------------------------------
// Response Types
// --------------------------------------------

export interface PostMedia {
  type: MediaType;
  url: string;
}

export interface AuthorSummary {
  id: string;
  firstName: string;
  lastName: string;
  profilePhoto?: string;
  accountType?: string;
}

export interface Post {
  id: string;
  content: string;
  author: AuthorSummary;
  visibility: PostVisibility;
  postType: PostType;
  media: PostMedia[];
  
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  savesCount: number;
  
  // Interaction state (often null unless specifically requested/populated)
  likes?: string[]; 
  
  // Admin fields
  isAdminPost: boolean;
  isPinned: boolean;
  targetChapters?: Array<{ name: string; code: string }>;

  // Share fields
  isShared: boolean;
  originalPost?: Post; // Recursive structure for shared posts
  sharedBy?: string; // ID of sharer if applicable

  createdAt: string;
  updatedAt: string;
}

export interface FeedResponse {
  posts: Post[];
  total: number;
  pages: number;
}

export interface CreatePostResponse {
  post: Post;
}

export interface AdminPostResponse {
  post: Post;
  message: string;
}

export interface Comment {
  id: string;
  post: string;
  author: AuthorSummary;
  content: string;
  
  parentComment?: string | null;
  repliesCount: number;
  
  createdAt: string;
}

export interface GetCommentsResponse {
  comments: Comment[];
  total: number;
}

export interface CreateCommentResponse {
  comment: Comment;
}

export interface ToggleLikeResponse {
  liked: boolean;
}

export interface ToggleSaveResponse {
  saved: boolean;
  message: string;
}

export interface SharePostResponse {
  message: string;
  post: Post;
}

// --------------------------------------------
// Error Types
// --------------------------------------------

export interface APIError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: ErrorDetail[];
  };
}

export interface ErrorDetail {
  field: string;
  message: string;
}
