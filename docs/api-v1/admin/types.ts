// ============================================
// Admin API Types
// ============================================

// --------------------------------------------
// Request Types
// --------------------------------------------

export interface ListChaptersQuery {
  page?: number;
  limit?: number;
  search?: string;
  country?: string;
  isActive?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface CreateChapterRequest {
  name: string;
  code: string;
  country: string;
  city?: string;
  description?: string;
  missionStatement?: string;
  currentPresident?: string;
  presidentEmail?: string;
  presidentPhone?: string;
  email?: string;
  phone?: string;
  address?: string;
  website?: string;
  facebookUrl?: string;
  twitterHandle?: string;
  instagramHandle?: string;
  linkedinUrl?: string;
  foundedDate?: string; // ISO Date
}

export interface UpdateChapterRequest extends Partial<CreateChapterRequest> {
  isActive?: boolean;
}

export interface AddAdminRequest {
  userId: string;
}

// --------------------------------------------
// Response Types
// --------------------------------------------

export interface ChapterStats {
  totalChapters: number;
  activeChapters: number;
  inactiveChapters: number;
  totalMembers: number;
  totalCountries: number;
}

export interface ChapterSummary {
  id: string;
  name: string;
  code: string;
  country: string;
  city?: string;
  isActive: boolean;
  memberCount: number;
}

export interface ListChaptersResponse {
  chapters: ChapterSummary[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface ChapterDetail extends ChapterSummary {
  description?: string;
  missionStatement?: string;
  adminIds: Array<{
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  }>;
  // Contact info fields...
}

export interface GetChapterResponse {
  chapter: ChapterDetail;
  stats: {
    total: number;
    approved: number;
    pending: number;
    rejected: number;
  };
}

export interface CreateChapterResponse {
  message: string;
  chapter: ChapterSummary;
}

export interface UpdateChapterResponse {
  message: string;
  chapter: ChapterSummary;
}

export interface AddAdminResponse {
  message: string;
  chapter: ChapterDetail;
}

export interface VerificationStats {
  total: number;
  notified: number;
  notNotified: number;
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
