"use client";

import {
  useQuery,
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { messagesApi } from "../api/messages";
import { useEffect, useRef } from "react";
import { getSocket } from "../socket";

export const messageKeys = {
  all: ["messages"] as const,
  conversations: (type?: string) =>
    [...messageKeys.all, "conversations", { type }] as const,
  thread: (conversationId: string) =>
    [...messageKeys.all, "thread", conversationId] as const,
  unreadCount: () => [...messageKeys.all, "unreadCount"] as const,
};

export function useMessages() {
  const queryClient = useQueryClient();

  // Get token from localStorage (matching your apiClient logic)
  const token =
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

  const unreadDebounceRef = useRef<NodeJS.Timeout>(null);
  const lastUnreadInvalidationRef = useRef<number>(0);

  useEffect(() => {
    if (!token) return;

    const socket = getSocket(token);
    if (!socket) return;

    const handleRefresh = (data: any) => {
      // console.log("🔄 Real-time update received:", data);

      // 1. Manually update the Conversation List
      // We essentially want to find the collection and move this conversation to the top
      // queryClient.setQueryData(messageKeys.conversations(), (old: any) => {
      //   if (!old?.conversations) return old;
      //    // Complex logic to move to top - for now, we will just invalidate CONVERSATIONS because
      //    // proper re-sorting locally is error prone without full object.
      //    // But to prevent storm, we could throttle this.
      //   return old;
      // });
      
      // For now, keep invalidating conversations but maybe we can optimize later. 
      // The critical one is the THREAD (infinite query) which loads many messages.
      queryClient.invalidateQueries({ queryKey: messageKeys.conversations() });

      // 2. Manually update the Active Thread (if open)
      // This prevents re-fetching the entire message pages
      const conversationId = data.conversation || data.conversationId;
      
      if (conversationId) {
         const threadKey = messageKeys.thread(conversationId);
         
         // Normalize message ID
         const rawMessage = data.message || data;
         const newMessage = {
            ...rawMessage,
            id: rawMessage.id || rawMessage._id 
         };

         queryClient.setQueryData(threadKey, (oldData: any) => {
            if (!oldData || !oldData.pages) return oldData;
            
            // 1. GLOBAL EXACT DUPLICATE CHECK (Scan all pages)
            let isDuplicate = false;
            oldData.pages.forEach((page: any) => {
                if (page.messages.some((m: any) => {
                    const existingId = m.id || m._id;
                    return existingId === newMessage.id;
                })) {
                    isDuplicate = true;
                }
            });
            
            if (isDuplicate) {
                // console.log('⚠️ Message already exists in cache (Global check). Skipping.');
                return oldData;
            }

            const lastPageIdx = oldData.pages.length - 1;
            const lastPage = oldData.pages[lastPageIdx];

            // 2. Optimistic Match Check (Race Condition Fix)
            // Look for a temp message with same content.
            // We relax the sender check because strict object equality might fail. 
            // Checking content + temp-ID prefix is usually sufficient for a "Just Sent" message.
            const optimisticMatchIndex = lastPage.messages.findIndex((m: any) => 
                m.id && m.id.startsWith('temp-') && 
                m.content === newMessage.content
            );

            // console.log('🔍 Optimistic Match Result:', optimisticMatchIndex, 'for content:', newMessage.content);

            const newPages = [...oldData.pages];
            let newMessages = [...lastPage.messages];

            if (optimisticMatchIndex !== -1) {
                // console.log('✅ REPLACING optimistic message:', newMessages[optimisticMatchIndex].id, 'with real:', newMessage.id);
                // REPLACE optimistic message
                newMessages[optimisticMatchIndex] = newMessage;
            } else {
                // console.log('➕ APPENDING new message:', newMessage.id);
                // APPEND new message
                newMessages.push(newMessage);
            }
            
            newPages[lastPageIdx] = {
                ...lastPage,
                messages: newMessages
            };

            return {
                ...oldData,
                pages: newPages
            };
         });
      }

      // 3. Debounce Unread Count Invalidation
      // Only fetch unread count at most once every 5 seconds, or wait for silence
      const now = Date.now();
      if (now - lastUnreadInvalidationRef.current > 5000) {
          queryClient.invalidateQueries({ queryKey: messageKeys.unreadCount() });
          lastUnreadInvalidationRef.current = now;
      } else {
          if (unreadDebounceRef.current) clearTimeout(unreadDebounceRef.current);
          unreadDebounceRef.current = setTimeout(() => {
             queryClient.invalidateQueries({ queryKey: messageKeys.unreadCount() });
             lastUnreadInvalidationRef.current = Date.now();
          }, 2000);
      }
    };

    // Listen for the events we verified in Postman
    socket.on("message:new", handleRefresh);
    socket.on("notification:new-message", handleRefresh);
    socket.on("message:broadcast", handleRefresh);

    return () => {
      socket.off("message:new");
      socket.off("notification:new-message");
      socket.off("message:broadcast");
      if (unreadDebounceRef.current) clearTimeout(unreadDebounceRef.current);
    };
  }, [token, queryClient]);

  // Conversations List
  const useConversations = (type?: "DIRECT" | "BROADCAST") =>
    useQuery({
      queryKey: messageKeys.conversations(type),
      queryFn: () => messagesApi.getConversations(1, 100, type), // Fetching reasonable limit for now
      staleTime: 1000 * 30, // 30 seconds
      refetchInterval: 1000 * 60, // Poll every minute for update
    });

  // Messages in a Thread (Infinite Scroll)
  const useMessageThread = (conversationId: string, enabled = true) =>
    useInfiniteQuery({
      queryKey: messageKeys.thread(conversationId),
      queryFn: ({ pageParam = 1 }) =>
        messagesApi.getMessages(conversationId, pageParam as number, 20),
      initialPageParam: 1,
      getNextPageParam: (lastPage, allPages) => {
        const loadedMessagesCount = allPages.reduce(
          (acc, page) => acc + page.messages.length,
          0
        );

        if (loadedMessagesCount < lastPage.total) {
          return allPages.length + 1;
        }
        return undefined;
      },
      enabled:
        !!conversationId && !conversationId.startsWith("new_") && enabled,
      staleTime: Infinity, // Manual updates only! Don't refetch on window focus or mount if we have data
    });

  // Unread Count
  const useUnreadMessageCount = () =>
    useQuery({
      queryKey: messageKeys.unreadCount(),
      queryFn: messagesApi.getUnreadCount,
      refetchInterval: 30000,
      staleTime: 30000,
    });

  // Send Message Mutation
  const sendMessageMutation = useMutation({
    mutationFn: ({ receiverId, content, media }: { receiverId: string, content: string, media?: any[] }) =>
      messagesApi.sendMessage(receiverId, content, media),

    onMutate: async ({ content, receiverId }) => {
      // console.log('Optimistic update for message:', content);
      
      // Find the active conversation ID for this receiver
      // This is a bit tricky if we are in "all" view, but usually we send from a thread
      // We'll scan the cache
      
      const conversationsData = queryClient.getQueryData<any>(messageKeys.conversations());
      let activeConversationId = conversationsData?.conversations?.find((c: any) => 
          c.otherParticipant?.id === receiverId || c.otherParticipant?._id === receiverId
      )?.id;

      // If we don't find it, maybe we are in a "new_" state handled by the component, 
      // but for optimistic update we strictly need a thread key. 
      // If it's a new conversation, we can't easily optimistic update the thread because the key doesn't exist on server yet.
      // So we skip optimistic update for brand new conversations.
      if (!activeConversationId) return;

      // Cancel any outgoing refetches so they don't overwrite our optimistic update
      await queryClient.cancelQueries({ queryKey: messageKeys.thread(activeConversationId) });

      // Snapshot the previous value
      const previousMessages = queryClient.getQueryData(messageKeys.thread(activeConversationId));

      const currentUser = queryClient.getQueryData<any>(['auth', 'me']) || { id: 'me' }; 

      const tempMessage = {
        id: `temp-${crypto.randomUUID()}`,
        content,
        sender: currentUser,
        conversationId: activeConversationId,
        isMine: true,
        isReadByMe: true,
        createdAt: new Date().toISOString(),
      };

      queryClient.setQueryData(
        messageKeys.thread(activeConversationId),
        (old: any) => {
          if (!old || !old.pages) return old;

          const newPages = [...old.pages];
          // Determine where add. usually the last page is the "newest" if we append to bottom
          // But check your sort order. Usually APIs return newest last or first?
          // Based on Previous code: flatMap(page => page.messages) ...
          
          // We will append to the START of the last page if order is descending, or END if ascending.
          // MessageThread.tsx maps them in order.
          // Let's assume standard append-to-end.
          
          const lastPageIdx = newPages.length - 1;
          const lastPage = newPages[lastPageIdx];
          
          newPages[lastPageIdx] = {
              ...lastPage,
              messages: [...lastPage.messages, tempMessage]
          };

          return {
            ...old,
            pages: newPages
          };
        }
      );

      return { previousMessages, activeConversationId };
    },

    onError: (err, newTodo, context: any) => {
      if (context?.activeConversationId) {
          queryClient.setQueryData(
             messageKeys.thread(context.activeConversationId), 
             context.previousMessages
          );
      }
      console.error("Failed to send message", err);
    },

    onSuccess: (data, variables, context) => {
      // Replace the temp message with the real one
      // OR just invalidate. 
      // Since we manually updated, we might have a ID mismatch (temp- vs real UUID).
      // Best to update the temp message with real ID if possible, or invalidate.
      
      // Let's manually swap to avoid flicker
      if (context?.activeConversationId) {
          queryClient.setQueryData(messageKeys.thread(context.activeConversationId), (old: any) => {
              if (!old || !old.pages) return old;
              
              const newPages = old.pages.map((page: any) => ({
                  ...page,
                  messages: page.messages.map((m: any) => 
                      m.content === variables.content && m.id.startsWith('temp-') 
                      ? data.message // Swap with real message
                      : m
                  )
              }));
              
              return { ...old, pages: newPages };
          });
      }

      // Also refresh conversations to update snippet
      queryClient.invalidateQueries({ queryKey: messageKeys.conversations() });
    },
  });

  // Mark Read Mutation
  
  
  const markReadMutation = useMutation({
    mutationFn: messagesApi.markAsRead,
    onSuccess: (data, conversationId) => {
      queryClient.invalidateQueries({ queryKey: messageKeys.conversations() });
      queryClient.invalidateQueries({ queryKey: messageKeys.unreadCount() });
    },
  });

  return {
    useConversations,
    useMessageThread,
    useUnreadMessageCount,
    sendMessage: sendMessageMutation.mutateAsync,
    markAsRead: markReadMutation.mutateAsync,
    isSending: sendMessageMutation.isPending,
  };
}
