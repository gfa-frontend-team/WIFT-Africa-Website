"use client";

import {
  useQuery,
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { messagesApi } from "../api/messages";
import { useEffect } from "react";
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

  useEffect(() => {
    if (!token) return;

    const socket = getSocket(token);
    if (!socket) return;

    const handleRefresh = (data: any) => {
      console.log("🔄 Real-time update received:", data);
      // Invalidate the cache - this triggers the "Refresh" without the user clicking anything
      queryClient.invalidateQueries({ queryKey: messageKeys.conversations() });
      queryClient.invalidateQueries({
        queryKey: messageKeys.thread(data?.conversation),
      });
      queryClient.invalidateQueries({ queryKey: messageKeys.unreadCount() });
    };

    // Listen for the events we verified in Postman
    socket.on("message:new", handleRefresh);
    socket.on("notification:new-message", handleRefresh);
    socket.on("message:broadcast", handleRefresh);

    return () => {
      socket.off("message:new");
      socket.off("notification:new-message");
      socket.off("message:broadcast");
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
      staleTime: 0, // Always fetch latest when opening thread, reliance on cache for history
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
    mutationFn: ({
      receiverId,
      content,
      media,
    }: {
      receiverId: string;
      content: string;
      media?: any[];
    }) => messagesApi.sendMessage(receiverId, content, media),
    onSuccess: (data) => {
      console.log("Message sent successfully:", data);
      // 1. Force refresh the sidebar (Conversations)
      queryClient.invalidateQueries({ queryKey: messageKeys.conversations() });

      // 2. Immediately update the message thread for the sender
      // Note: 'data.conversation.id' must match your state's activeConversationId
      queryClient.invalidateQueries({
        queryKey: messageKeys.thread(data.conversation.id),
      });

      // OPTIONAL: Manually refetch so it's instant
      queryClient.refetchQueries({
        queryKey: messageKeys.thread(data.conversation.id),
      });
    },
  });

  //   const sendMessageMutation = useMutation({
  //   mutationFn: ({ receiverId, content, media }: { receiverId: string, content: string, media?: any[] }) =>
  //     messagesApi.sendMessage(receiverId, content, media),

  //   // 🔥 THIS GOES HERE
  //   onMutate: async ({ content }) => {

  //     console.log('Optimistic update for message:', content);
  //     const activeConversationId =
  //       queryClient
  //         .getQueryData<any>(messageKeys.conversations())
  //         ?.conversations
  //         ?.find((c: any) => c.otherParticipant?.id === receiverId)?.id;

  //     if (!activeConversationId) return;

  //     const currentUser = queryClient.getQueryData(['auth', 'me']); // or wherever you store it

  //     const tempMessage = {
  //       id: crypto.randomUUID(),
  //       content,
  //       sender: currentUser,
  //       conversationId: activeConversationId,
  //       isMine: true,
  //       isReadByMe: true,
  //       createdAt: new Date().toISOString(),
  //     };

  //     queryClient.setQueryData(
  //       messageKeys.thread(activeConversationId),
  //       (old: any) => {
  //         if (!old) return old;

  //         return {
  //           ...old,
  //           pages: [
  //             {
  //               ...old.pages[0],
  //               messages: [...old.pages[0].messages, tempMessage],
  //             },
  //             ...old.pages.slice(1),
  //           ],
  //         };
  //       }
  //     );

  //     return { activeConversationId };
  //   },

  //   // 🧹 reconcile with server
  //   onSuccess: (data) => {
  //     queryClient.invalidateQueries({
  //       queryKey: messageKeys.thread(data.conversation.id),
  //     });
  //     queryClient.invalidateQueries({
  //       queryKey: messageKeys.conversations(),
  //     });
  //   },
  // });

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
