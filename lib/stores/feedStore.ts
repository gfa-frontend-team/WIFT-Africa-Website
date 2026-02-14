import { create } from 'zustand'

interface FeedFilters {
  type: 'all' | 'posts' | 'admin'
}

interface FeedStore {
  // State
  filters: FeedFilters

  // Actions
  setFilters: (filters: Partial<FeedFilters>) => void
}

export const useFeedStore = create<FeedStore>((set) => ({
  // Initial state
  filters: { type: 'all' },

  // Actions
  setFilters: (newFilters) => {
    set((state) => ({
      filters: { ...state.filters, ...newFilters }
    }))
  },
}))

export default useFeedStore