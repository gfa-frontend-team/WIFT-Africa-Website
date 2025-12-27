import { create } from 'zustand'
import { SearchUsersParams } from '@/lib/api/search'

interface SearchState {
  // Search Query Params
  currentQuery: string
  activeFilters: Partial<SearchUsersParams>
  
  // Actions
  setQuery: (query: string) => void
  setFilter: (key: keyof SearchUsersParams, value: any) => void
  clearFilters: () => void
}

export const useSearchStore = create<SearchState>((set) => ({
  currentQuery: '',
  activeFilters: {},

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
}))
