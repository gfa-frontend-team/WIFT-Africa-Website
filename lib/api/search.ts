import { apiClient } from './client'

// Types specific to search
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

export type ConnectionStatus = 'connected' | 'pending' | 'none'
export type SortOption = 'relevance' | 'name' | 'recent' | 'connections'

export interface SearchUsersParams {
  query?: string
  role?: Role
  roles?: Role[]
  skills?: string[]
  location?: string
  chapter?: string
  availability?: AvailabilityStatus
  isMultihyphenate?: boolean
  excludeConnected?: boolean
  sortBy?: SortOption
  page?: number
  limit?: number
}

export interface SearchUserResult {
  id: string
  firstName: string
  lastName: string
  username?: string
  profileSlug: string
  headline?: string
  primaryRole?: string // Assuming string in response, mapped from Role
  roles?: string[]
  location?: string
  profilePhoto?: string
  availabilityStatus?: AvailabilityStatus

  chapter?: {
    id: string
    name: string
    code: string
  }

  isConnected: boolean
  connectionStatus: ConnectionStatus
  matchScore?: number
}

export interface FilterOptions {
  availableRoles: string[]
  availableChapters: Array<{
    id: string
    name: string
    memberCount: number
  }>
  locationSuggestions: string[]
}

export interface SearchResponse {
  users: SearchUserResult[]
  total: number
  pages: number
  filters: FilterOptions
}

export interface RecommendationResult {
  id: string
  firstName: string
  lastName: string
  profilePhoto?: string
  headline?: string
  primaryRole?: string
  recommendationReason: string
  score: number
}

export interface RecommendationsResponse {
  recommendations: RecommendationResult[]
  total: number
}

export interface PopularSkillsResponse {
  skills: string[]
}

export const searchApi = {
  /**
   * Search for members with filters
   */
  searchMembers: async (params: SearchUsersParams): Promise<SearchResponse> => {
    // Convert boolean and array params to query string friendly format if needed
    // apiClient/axios usually handles arrays like roles[]=A&roles[]=B
    return await apiClient.get<SearchResponse>('/search/users', { params })
  },

  /**
   * Get member recommendations
   */
  getRecommendations: async (limit = 10): Promise<RecommendationsResponse> => {
    return await apiClient.get<RecommendationsResponse>(`/search/recommendations?limit=${limit}`)
  },

  /**
   * Get popular skills
   */
  getPopularSkills: async (limit = 20): Promise<PopularSkillsResponse> => {
    return await apiClient.get<PopularSkillsResponse>(`/search/skills?limit=${limit}`)
  },

  /**
   * Get available search filters (facets)
   */
  getFilters: async (): Promise<FilterOptions> => {
    return await apiClient.get<FilterOptions>('/search/filters')
  }
}
