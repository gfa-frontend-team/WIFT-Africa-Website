'use client'

import { useQuery, useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { messagesApi, type Message } from '../api/messages'
import { useCallback } from 'react'

export const messageKeys = {
  all: ['messages'] as const,
  conversations: (type?: string) => [...messageKeys.all, 'conversations', { type }] as const,
  thread: (conversationId: string) => [...messageKeys.all, 'thread', conversationId] as const,
  unreadCount: () => [...messageKeys.all, 'unreadCount'] as const,
}

export function useMessages() {
  const queryClient = useQueryClient()

  // Conversations List
  const useConversations = (type?: 'DIRECT' | 'BROADCAST') => useQuery({
    queryKey: messageKeys.conversations(type),
    queryFn: () => messagesApi.getConversations(1, 100, type), // Fetching reasonable limit for now
    staleTime: 1000 * 30, // 30 seconds
    refetchInterval: 1000 * 60, // Poll every minute for update
  })

  // Messages in a Thread (Infinite Scroll)
  const useMessageThread = (conversationId: string, enabled = true) => useInfiniteQuery({
    queryKey: messageKeys.thread(conversationId),
    queryFn: ({ pageParam = 1 }) => messagesApi.getMessages(conversationId, pageParam as number, 50),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      // Assuming pages logic similar to notifications/search
      // If messages.length === limit (50), likely more
      if (lastPage.messages.length === 50) return (lastPage as any)._pageParam + 1 // We need to track page param
      // Better: Use total count if available
      return undefined // Need verify pagination logic in API response
    },
    enabled: !!conversationId && !conversationId.startsWith('new_') && enabled,
  })

  // Safe wrapper for message thread with proper page tracking if needed
  // Using simplified approach: assumes standard pagination if not fully specified
  
  // Unread Count
  const useUnreadMessageCount = () => useQuery({
    queryKey: messageKeys.unreadCount(),
    queryFn: messagesApi.getUnreadCount,
    refetchInterval: 30000, 
    staleTime: 30000,
  })

  // Send Message Mutation
  const sendMessageMutation = useMutation({
    mutationFn: ({ receiverId, content, media }: { receiverId: string, content: string, media?: any[] }) => 
      messagesApi.sendMessage(receiverId, content, media),
    onSuccess: (data) => {
        // Invalidate conversations to show new last message
        queryClient.invalidateQueries({ queryKey: messageKeys.conversations() })
        // Invalidate specific thread
        queryClient.invalidateQueries({ queryKey: messageKeys.thread(data.conversation.id) })
    }
  })

  // Mark Read Mutation
  const markReadMutation = useMutation({
    mutationFn: messagesApi.markAsRead,
    onSuccess: (data, conversationId) => {
        queryClient.invalidateQueries({ queryKey: messageKeys.conversations() })
        queryClient.invalidateQueries({ queryKey: messageKeys.unreadCount() })
    }
  })

  return {
    useConversations,
    useMessageThread,
    useUnreadMessageCount,
    sendMessage: sendMessageMutation.mutateAsync,
    markAsRead: markReadMutation.mutateAsync,
    isSending: sendMessageMutation.isPending
  }
}
