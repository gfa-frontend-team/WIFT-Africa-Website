import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { postsApi, type CreatePostInput } from '../api/posts'

interface PostDraft {
  content: string
  visibility: 'PUBLIC' | 'CHAPTER_ONLY' | 'CONNECTIONS_ONLY'
  media?: Array<{
    type: 'image' | 'video'
    url: string
  }>
}

interface PostStore {
  // State
  draft: PostDraft | null

  // Actions
  saveDraft: (draft: PostDraft) => void
  clearDraft: () => void
}

export const usePostStore = create<PostStore>()(
  persist(
    (set, get) => ({
      // Initial state
      draft: null,

      // Actions
      saveDraft: (draft: PostDraft) => {
        set({ draft })
      },

      clearDraft: () => {
        set({ draft: null })
      },
      
      // Removed createPost as it is handled by React Query mutation
      // We keep the store logic for draft management only
    }),
    {
      name: 'post-storage',
      partialize: (state) => ({ draft: state.draft }) // Only persist draft
    }
  )
)

export default usePostStore