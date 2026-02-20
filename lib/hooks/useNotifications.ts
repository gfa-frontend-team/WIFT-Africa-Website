// lib/hooks/useNotifications.ts
import {
  useQuery,
  useMutation,
  useInfiniteQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { useSocket } from "@/lib/socket"; // Your existing socket hook
import { playNotificationSound } from "@/lib/utils/sound";
import { toast } from "sonner"; // or your toast library
import { notificationsApi } from "../api/notifications";

// Query keys
export const notificationKeys = {
  all: ["notifications"] as const,
  list: (unreadOnly: boolean) =>
    [...notificationKeys.all, "list", { unreadOnly }] as const,
  unreadCount: () => [...notificationKeys.all, "unreadCount"] as const,
};
interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  sender?: {
    id: string;
    firstName: string;
    lastName: string;
    profilePhoto?: string;
  };
  actionUrl?: string;
}

export const useNotifications = () => {
  const queryClient = useQueryClient();
  const socket = useSocket(); // Get socket from your context
  const hasInitialized = useRef(false);

  // 🔥 NEW: Listen for real-time notifications
  useEffect(() => {
    if (!socket || !socket.connected || hasInitialized.current) return;

    hasInitialized.current = true;

    // Listen for new notifications
    socket.on("notification:new", (notification: Notification) => {
      // console.log('🔔 New notification received:', notification);

      // Play sound
      playNotificationSound();

      // Show toast notification
      toast(notification.title, {
        description: notification.message,
        action: notification.actionUrl
          ? {
              label: "View",
              onClick: () => {
                if (notification.actionUrl) {
                  window.location.href = notification.actionUrl;
                }
              },
            }
          : undefined,
      });

      // Update the notifications list in the cache
      queryClient.setQueryData(["notifications"], (oldData: any) => {
        if (!oldData) return oldData;

        // Add new notification to the beginning of the list
        const newPages = oldData.pages.map((page: any, index: number) => {
          if (index === 0) {
            return {
              ...page,
              notifications: [notification, ...page.notifications],
              total: page.total + 1,
              unreadCount: page.unreadCount + 1,
            };
          }
          return page;
        });

        return {
          ...oldData,
          pages: newPages,
        };
      });

      // Update unread count query
      queryClient.setQueryData(["unreadCount"], (oldData: any) => ({
        count: (oldData?.count || 0) + 1,
      }));
    });

    // Listen for notification read updates
    socket.on("notification:read", (data: { notificationId: string }) => {
      console.log("📖 Notification marked as read:", data);

      // Update the notification in the list
      queryClient.setQueryData(["notifications"], (oldData: any) => {
        if (!oldData) return oldData;

        const newPages = oldData.pages.map((page: any) => ({
          ...page,
          notifications: page.notifications.map((n: Notification) =>
            n.id === data.notificationId ? { ...n, isRead: true } : n,
          ),
        }));

        return {
          ...oldData,
          pages: newPages,
        };
      });

      // Update unread count
      queryClient.setQueryData(["unreadCount"], (oldData: any) => ({
        count: Math.max((oldData?.count || 0) - 1, 0),
      }));
    });

    // Listen for all notifications read
    socket.on("notification:all-read", () => {
      // console.log('📚 All notifications marked as read');

      // Mark all notifications as read in the cache
      queryClient.setQueryData(["notifications"], (oldData: any) => {
        if (!oldData) return oldData;

        const newPages = oldData.pages.map((page: any) => ({
          ...page,
          notifications: page.notifications.map((n: Notification) => ({
            ...n,
            isRead: true,
          })),
          unreadCount: 0,
        }));

        return {
          ...oldData,
          pages: newPages,
        };
      });

      // Reset unread count
      queryClient.setQueryData(["unreadCount"], { count: 0 });
    });

    // Listen for notification count updates
    socket.on("notifications:count", (data: { count: number }) => {
      // console.log('🔢 Unread count updated:', data.count);
      queryClient.setQueryData(["unreadCount"], { count: data.count });
    });

    // Request initial unread count when connected
    socket.emit("notifications:request-count");

    return () => {
      // Clean up listeners
      socket.off("notification:new");
      socket.off("notification:read");
      socket.off("notification:all-read");
      socket.off("notifications:count");
      hasInitialized.current = false;
    };
  }, [socket, socket?.connected, queryClient]);

  // 🔥 NEW: Request count manually (useful for page focus)
  useEffect(() => {
    const handleFocus = () => {
      if (socket && socket?.connected) {
        socket.emit("notifications:request-count");
      }
    };

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [socket, socket?.connected]);

  // Re-implementing with safer next page logic
  const useNotificationsList = (unreadOnly = false) =>
    useInfiniteQuery({
      queryKey: notificationKeys.list(unreadOnly),
      queryFn: async ({ pageParam = 1 }) => {
        const res = await notificationsApi.getNotifications(
          pageParam as number,
          20,
          unreadOnly,
        );
        // Attach current page to result for getNextPageParam if missing
        return { ...res, _currentPage: pageParam as number };
      },
      initialPageParam: 1,
      getNextPageParam: (lastPage) => {
        if (lastPage._currentPage < lastPage.pages) {
          return lastPage._currentPage + 1;
        }
        return undefined;
      },
    });
  // const useUnreadCount = () => {
  //   return useQuery({
  //     queryKey: ['unreadCount'],
  //     queryFn: async () => {
  //       const response = await fetch('/api/notifications/unread-count');
  //       return response.json();
  //     },
  //     refetchInterval: 30000, // Fallback: refetch every 30 seconds
  //   });
  // };
  // Unread Count (Polled)
  const useUnreadCount = () =>
    useQuery({
      queryKey: ["unreadCount"],
      queryFn: notificationsApi.getUnreadCount,
      refetchInterval: 1000 * 60 * 5, // 5 minutes
      staleTime: 1000 * 60 * 5,
    });

  const markAsRead = useMutation({
    mutationFn: notificationsApi.markAsRead,
    onSuccess: (_, notificationId) => {
      // Optimistically update the cache
      queryClient.setQueryData(["notifications"], (oldData: any) => {
        if (!oldData) return oldData;

        const newPages = oldData.pages.map((page: any) => ({
          ...page,
          notifications: page.notifications.map((n: Notification) =>
            n.id === notificationId ? { ...n, isRead: true } : n,
          ),
        }));

        return {
          ...oldData,
          pages: newPages,
        };
      });

      // Update unread count
      queryClient.setQueryData(["unreadCount"], (oldData: any) => ({
        count: Math.max((oldData?.count || 0) - 1, 0),
      }));
    },
  });

  // Mark All as Read
  const markAllAsReadMutation = useMutation({
    mutationFn: notificationsApi.markAllAsRead,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: notificationKeys.all });

      // Update count to 0
      queryClient.setQueryData(notificationKeys.unreadCount(), { count: 0 });

      // Update all visible lists to read
      queryClient.setQueriesData(
        { queryKey: notificationKeys.all },
        (oldData: any) => {
          if (!oldData?.pages) return oldData;
          return {
            ...oldData,
            pages: oldData.pages.map((page: any) => ({
              ...page,
              notifications: page.notifications.map((n: any) => ({
                ...n,
                isRead: true,
              })),
            })),
          };
        },
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });

  return {
    useNotificationsList,
    useUnreadCount,
    markAsRead: markAsRead.mutate,
    isMarkingAsRead: markAsRead.isPending,
    markAllAsRead: markAllAsReadMutation.mutateAsync,
    isMarkingAllRead: markAllAsReadMutation.isPending,
  };
};
