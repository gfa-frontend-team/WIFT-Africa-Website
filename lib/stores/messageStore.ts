import { create } from 'zustand'

/**
 * @deprecated Use useMessages() hook for data fetching and mutations.
 * This store is kept only for legacy compatibility if needed, 
 * but should be emptied of logic.
 */
interface MessageState {
  unreadCount: { direct: number; broadcast: number; total: number }
  getUnreadCount: () => Promise<void>
}

export const useMessageStore = create<MessageState>(() => ({
  unreadCount: { direct: 0, broadcast: 0, total: 0 },
  getUnreadCount: async () => {
      console.warn("useMessageStore.getUnreadCount is deprecated. Use useMessages hook.")
  }
}))

export default useMessageStore
