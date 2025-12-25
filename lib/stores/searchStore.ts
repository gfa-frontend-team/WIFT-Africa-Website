import { create } from 'zustand'
import { searchApi, SearchUsersParams, SearchUserResult, FilterOptions, RecommendationResult } from '@/lib/api/search'

interface SearchState {
  // Data
  results: SearchUserResult[]
  totalResults: number
  recommendations: RecommendationResult[]
  filters: FilterOptions | null
  
  // Search Query Params
  currentQuery: string
  activeFilters: Partial<SearchUsersParams>
  
  // UI State
  isLoading: boolean
  isSearching: boolean
  error: string | null
  
  // Actions
  searchMembers: (params?: Partial<SearchUsersParams>) => Promise<void>
  setQuery: (query: string) => void
  setFilter: (key: keyof SearchUsersParams, value: any) => void
  clearFilters: () => void
  fetchRecommendations: () => Promise<void>
  fetchFilters: () => Promise<void>
}

export const useSearchStore = create<SearchState>((set, get) => ({
  results: [],
  totalResults: 0,
  recommendations: [],
  filters: null,
  
  currentQuery: '',
  activeFilters: {},
  
  isLoading: false,
  isSearching: false,
  error: null,

  searchMembers: async (params = {}) => {
    try {
      set({ isSearching: true, error: null })
      const { currentQuery, activeFilters } = get()
      
      // Merge current state with new params
      const searchParams: SearchUsersParams = {
        query: currentQuery,
        ...activeFilters,
        ...params
      }
      
      const response = await searchApi.searchMembers(searchParams)
      
      set({ 
        results: response.users, 
        totalResults: response.total,
        isSearching: false 
      })
    } catch (error: any) {
      console.error('Search failed:', error)
      set({ 
        error: error.message || 'Failed to perform search', 
        isSearching: false 
      })
    }
  },

  setQuery: (query) => {
    set({ currentQuery: query })
  },

  setFilter: (key, value) => {
    set((state) => ({
      activeFilters: {
        ...state.activeFilters,
        [key]: value
      }
    }))
  },

  clearFilters: () => {
    set({ activeFilters: {}, currentQuery: '' })
  },

  fetchRecommendations: async () => {
    try {
      set({ isLoading: true })
      const response = await searchApi.getRecommendations()
      set({ recommendations: response.recommendations, isLoading: false })
    } catch (error: any) {
      console.error('Failed to fetch recommendations:', error)
      set({ isLoading: false })
      // Don't set global error for this, maybe just log it
    }
  },

  fetchFilters: async () => {
    try {
      const filters = await searchApi.getFilters()
      set({ filters })
    } catch (error) {
      console.error('Failed to load filters:', error)
    }
  }
}))
