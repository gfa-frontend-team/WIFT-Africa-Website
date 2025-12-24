import { apiClient } from './client'
import { User } from '@/types'

export interface Message {
  id: string
  content: string
  sender: User
  conversationId: string
  isReadByMe: boolean
  isMine?: boolean
  media?: any[]
  createdAt: string
}

export interface Conversation {
  id: string
  type: 'DIRECT' | 'BROADCAST'
  otherParticipant?: User // For DIRECT
  title?: string // For BROADCAST
  description?: string
  lastMessage?: Message
  unreadCount: number
  updatedAt: string
}

export interface ConversationsResponse {
  conversations: Conversation[]
  total: number
}

export interface MessagesResponse {
  conversation: {
    type: 'DIRECT' | 'BROADCAST'
    isBroadcast: boolean
  }
  messages: Message[]
  total: number
}

export interface UnreadCountResponse {
  direct: number
  broadcast: number
  total: number
}

export const messagesApi = {
  /**
   * Get list of conversations
   */
  getConversations: async (page = 1, limit = 20, type?: 'DIRECT' | 'BROADCAST'): Promise<ConversationsResponse> => {
    const typeParam = type ? `&type=${type}` : ''
    return await apiClient.get<ConversationsResponse>(`/messages/conversations?page=${page}&limit=${limit}${typeParam}`)
  },

  /**
   * Get messages for a specific conversation
   */
  getMessages: async (conversationId: string, page = 1, limit = 50): Promise<MessagesResponse> => {
    return await apiClient.get<MessagesResponse>(`/messages/conversations/${conversationId}?page=${page}&limit=${limit}`)
  },

  /**
   * Send a direct message
   */
  sendMessage: async (receiverId: string, content: string, media?: any[]): Promise<{ message: Message; conversation: { id: string } }> => {
    return await apiClient.post<{ message: Message; conversation: { id: string } }>('/messages', {
      receiverId,
      content,
      media,
    })
  },

  /**
   * Mark conversation as read
   */
  markAsRead: async (conversationId: string): Promise<{ message: string }> => {
    return await apiClient.post<{ message: string }>(`/messages/conversations/${conversationId}/read`)
  },

  /**
   * Get total unread count
   */
  getUnreadCount: async (): Promise<UnreadCountResponse> => {
    return await apiClient.get<UnreadCountResponse>('/messages/unread-count')
  },
}
