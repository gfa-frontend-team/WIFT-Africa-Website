import { create } from 'zustand'

interface SavedPostsState {
  savedPostIds: Set<string>
  isInitialized: boolean
  addSavedPostId: (id: string) => void
  removeSavedPostId: (id: string) => void
  setSavedPostIds: (ids: string[]) => void
  hasSavedPost: (id: string) => boolean
}

export const useSavedPostsStore = create<SavedPostsState>((set, get) => ({
  savedPostIds: new Set(),
  isInitialized: false,
  
  addSavedPostId: (id) => set((state) => {
    const newSet = new Set(state.savedPostIds)
    newSet.add(id)
    return { savedPostIds: newSet }
  }),
  
  removeSavedPostId: (id) => set((state) => {
    const newSet = new Set(state.savedPostIds)
    newSet.delete(id)
    return { savedPostIds: newSet }
  }),
  
  setSavedPostIds: (ids) => set({ 
    savedPostIds: new Set(ids),
    isInitialized: true 
  }),
  
  hasSavedPost: (id) => get().savedPostIds.has(id)
}))
