import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { postsApi, type CreatePostInput } from '../api/posts'
import { useFeedStore } from './feedStore'

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
  isCreating: boolean
  error: string | null

  // Actions
  saveDraft: (draft: PostDraft) => void
  clearDraft: () => void
  createPost: (data: CreatePostInput) => Promise<void>
  clearError: () => void
}

export const usePostStore = create<PostStore>()(
  persist(
    (set, get) => ({
      // Initial state
      draft: null,
      isCreating: false,
      error: null,

      // Actions
      saveDraft: (draft: PostDraft) => {
        set({ draft })
      },

      clearDraft: () => {
        set({ draft: null })
      },

      createPost: async (data: CreatePostInput) => {
        try {
          set({ isCreating: true, error: null })

          const response = await postsApi.createPost(data)

          // Add the new post to the feed
          useFeedStore.getState().addPost(response.post)

          // Clear draft and reset state
          set({
            draft: null,
            isCreating: false
          })

          console.log('✅ Post created successfully:', response.post.id)
        } catch (error: any) {
          console.error('❌ Failed to create post:', error)
          set({
            error: error.response?.data?.error || 'Failed to create post',
            isCreating: false
          })
          throw error
        }
      },

      clearError: () => {
        set({ error: null })
      }
    }),
    {
      name: 'post-storage',
      partialize: (state) => ({ draft: state.draft }) // Only persist draft
    }
  )
)

export default usePostStore