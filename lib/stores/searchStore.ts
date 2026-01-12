import { create } from 'zustand'
import { SearchUsersParams } from '@/lib/api/search'

interface SearchState {
  // Search Query Params
  currentQuery: string
  activeFilters: Partial<SearchUsersParams>
  
  // New States
  page: number
  limit: number
  sortBy: SearchUsersParams['sortBy']

  // Actions
  setQuery: (query: string) => void
  setFilter: (key: keyof SearchUsersParams, value: any) => void
  setPage: (page: number) => void
  setSortBy: (sort: SearchUsersParams['sortBy']) => void
  clearFilters: () => void
}

export const useSearchStore = create<SearchState>((set) => ({
  currentQuery: '',
  activeFilters: {},
  page: 1,
  limit: 20,
  sortBy: 'relevance',

  setQuery: (query) => {
    // Reset page on new query
    set({ currentQuery: query, page: 1 })
  },

  setFilter: (key, value) => {
    set((state) => ({
      activeFilters: {
        ...state.activeFilters,
        [key]: value
      },
      page: 1 // Reset page on filter change
    }))
  },

  setPage: (page) => {
    set({ page })
  },

  setSortBy: (sortBy) => {
    set({ sortBy, page: 1 })
  },

  clearFilters: () => {
    set({ activeFilters: {}, currentQuery: '', page: 1, sortBy: 'relevance' })
  },
}))
