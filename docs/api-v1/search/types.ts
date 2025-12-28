// ============================================
// Search API Types
// ============================================

// --------------------------------------------
// Enums
// --------------------------------------------

export enum Role {
  PRODUCER = 'PRODUCER',
  DIRECTOR = 'DIRECTOR',
  WRITER = 'WRITER',
  ACTRESS = 'ACTRESS',
  CREW = 'CREW',
  BUSINESS = 'BUSINESS'
}

export enum AvailabilityStatus {
  AVAILABLE = 'AVAILABLE',
  BUSY = 'BUSY',
  NOT_LOOKING = 'NOT_LOOKING'
}

export type ConnectionStatus = 'connected' | 'pending' | 'none';

export type SortOption = 'relevance' | 'name' | 'recent' | 'connections';

// --------------------------------------------
// Request Types
// --------------------------------------------

export interface SearchUsersParams {
  query?: string;
  role?: Role;
  roles?: Role[]; // Can be passed as array in query
  skills?: string[]; // Can be passed as array in query
  location?: string;
  chapter?: string;
  availability?: AvailabilityStatus;
  isMultihyphenate?: boolean | string; // Query params often come as strings
  excludeConnected?: boolean | string;
  sortBy?: SortOption;
  page?: number | string;
  limit?: number | string;
}

// --------------------------------------------
// Response Types
// --------------------------------------------

export interface SearchUserResult {
  id: string;
  firstName: string;
  lastName: string;
  username?: string;
  headline?: string;
  primaryRole?: Role;
  roles?: Role[];
  location?: string;
  profilePhoto?: string;
  availabilityStatus?: AvailabilityStatus;
  
  chapter?: {
    id: string;
    name: string;
    code: string;
  };
  
  isConnected: boolean;
  connectionStatus: ConnectionStatus;
  matchScore?: number;
}

export interface FilterOptions {
  availableRoles: Role[];
  availableChapters: Array<{
    id: string;
    name: string;
    memberCount: number;
  }>;
  locationSuggestions: string[];
}

export interface SearchResponse {
  users: SearchUserResult[];
  total: number;
  pages: number;
  filters: FilterOptions;
}

export interface RecommendationResult {
  id: string;
  firstName: string;
  lastName: string;
  profilePhoto?: string;
  headline?: string;
  primaryRole?: Role;
  
  recommendationReason: string;
  score: number;
}

export interface RecommendationsResponse {
  recommendations: RecommendationResult[];
  total: number;
}

export interface PopularSkillsResponse {
  skills: string[];
}

// --------------------------------------------
// Error Types
// --------------------------------------------

export interface APIError {
  success: false;
  error: {
    code: string;
    message: string;
  };
}
