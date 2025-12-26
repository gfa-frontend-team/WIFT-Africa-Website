import { create } from 'zustand'
import { messagesApi, Conversation, Message } from '@/lib/api/messages'
import { User } from '@/types'

interface MessageState {
  conversations: Conversation[]
  messages: Record<string, Message[]> // Keyed by conversationId
  activeConversation: Conversation | null
  unreadCount: { direct: number; broadcast: number; total: number }
  isLoading: boolean
  error: string | null
  lastUnreadFetch: number

  fetchConversations: (type?: 'DIRECT' | 'BROADCAST') => Promise<void>
  fetchMessages: (conversationId: string) => Promise<void>
  selectConversation: (conversationId: string) => Promise<void>
  startDirectConversation: (user: User) => void
  sendMessage: (receiverId: string, content: string, media?: any[]) => Promise<void>
  getUnreadCount: () => Promise<void>
  addMessage: (conversationId: string, message: Message) => void
}

export const useMessageStore = create<MessageState>((set, get) => ({
  conversations: [],
  messages: {},
  activeConversation: null,
  unreadCount: { direct: 0, broadcast: 0, total: 0 },
  isLoading: false,
  error: null,
  lastUnreadFetch: 0,

  fetchConversations: async (type) => {
    set({ isLoading: true, error: null })
    try {
      const response = await messagesApi.getConversations(1, 20, type)
      set({ conversations: response.conversations, isLoading: false })
    } catch (error: any) {
      set({ error: error.message || 'Failed to fetch conversations', isLoading: false })
    }
  },

  fetchMessages: async (conversationId) => {
    // Don't fetch for temporary new conversations
    if (conversationId.startsWith('new_')) return
    
    try {
      const response = await messagesApi.getMessages(conversationId)
      
      set((state) => ({
        messages: {
          ...state.messages,
          [conversationId]: response.messages.reverse() // Store oldest first for chat UI
        }
      }))

      // Mark as read if active
      await messagesApi.markAsRead(conversationId)
      get().getUnreadCount()
      
    } catch (error: any) {
      console.error('Failed to fetch messages:', error)
    }
  },

  selectConversation: async (conversationId: string) => {
    const conversation = get().conversations.find(c => c.id === conversationId)
    if (conversation) {
      set({ activeConversation: conversation })
      await get().fetchMessages(conversationId)
    }
  },

  startDirectConversation: (user: User) => {
    const state = get()
    // Check if existing conversation exists
    const existing = state.conversations.find(c => 
      c.type === 'DIRECT' && c.otherParticipant?.id === user.id
    )

    if (existing) {
      state.selectConversation(existing.id)
      return
    }

    // Create temporary conversation
    const tempId = `new_${user.id}`
    const tempConversation: Conversation = {
      id: tempId,
      type: 'DIRECT',
      otherParticipant: user,
      unreadCount: 0,
      updatedAt: new Date().toISOString()
    }

    set((state) => ({
      activeConversation: tempConversation,
      messages: {
        ...state.messages,
        [tempId]: []
      }
    }))
  },

  sendMessage: async (receiverId, content, media) => {
    try {
      const response = await messagesApi.sendMessage(receiverId, content, media)
      const { message, conversation } = response

      // If we were in a temporary conversation, switch to the real one
      const currentActive = get().activeConversation
      if (currentActive && currentActive.id.startsWith('new_')) {
          // Construct the full conversation object based on what we know + backend ID
          const realConversation: Conversation = {
              ...currentActive,
              id: conversation.id,
              lastMessage: message,
              unreadCount: 0
          }
           set((state) => ({
              activeConversation: realConversation,
              // Move messages if we had any optimistically? (Usually startDirectConversation creates empty)
              // But we can just direct the new message to the new ID
          }))
      }

      // Add message to store immediately (using real ID)
      get().addMessage(conversation.id, {
        ...message,
        isMine: true
      })

      // Refresh conversations to update last message
      await get().fetchConversations()
      
      // Ensure we are selected on the real conversation if we aren't already
      if (get().activeConversation?.id !== conversation.id) {
          get().selectConversation(conversation.id)
      }

    } catch (error: any) {
      set({ error: error.message || 'Failed to send message' })
      throw error
    }
  },

  getUnreadCount: async () => {
    // Throttle to 30s
    const state = get()
    if (Date.now() - state.lastUnreadFetch < 30000) {
      return
    }

    try {
      const counts = await messagesApi.getUnreadCount()
      set({ unreadCount: counts, lastUnreadFetch: Date.now() })
    } catch (error) {
      console.error('Failed to fetch unread count:', error)
    }
  },

  addMessage: (conversationId, message) => {
    set((state) => ({
      messages: {
        ...state.messages,
        [conversationId]: [...(state.messages[conversationId] || []), message]
      }
    }))
  }
}))

export default useMessageStore
