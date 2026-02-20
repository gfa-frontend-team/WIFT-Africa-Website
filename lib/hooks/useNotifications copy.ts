'use client'

import { useInfiniteQuery, useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { notificationsApi, type NotificationsResponse } from '../api/notifications'

// Query keys
export const notificationKeys = {
  all: ['notifications'] as const,
  list: (unreadOnly: boolean) => [...notificationKeys.all, 'list', { unreadOnly }] as const,
  unreadCount: () => [...notificationKeys.all, 'unreadCount'] as const,
}

export function useNotifications() {
  const queryClient = useQueryClient()

  // Infinite Query for Notification List
  const useNotificationsInfinite = (unreadOnly = false) => useInfiniteQuery({
    queryKey: notificationKeys.list(unreadOnly),
    queryFn: ({ pageParam = 1 }) => notificationsApi.getNotifications(pageParam as number, 20, unreadOnly),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      // Assuming pagination: { page: number, pages: number, ... }
      // If API returns current page and total pages
      if (lastPage.pages > (lastPage as any).page) { // Check implementation of Response
        // The API response type definition might need verification, 
        // assuming current page is tracked or calculated
        // Let's rely on standard pagination patterns or check the API response structure again if this fails.
        // Based on previous files, typically: lastPage.pagination.page < lastPage.pagination.totalPages
        // But here NotificationsResponse uses `pages` (total pages?) and specific structure.
        // Let's check api definition again in mental context: "pages: number". 
        // We might need to track current page via pageParam.
        // Actually the response doesn't seem to have "page" property in the interface shown in previous step.
        // Wait, `getNotifications` returns `NotificationsResponse`.
        // Interface: { notifications, total, unreadCount, pages }
        // It implies `pages` is total pages. Typically we need `page` in response to know current.
        // If missing, we infer from previous usage or assume sequential.
        // Let's assume sequential for now using pageParam + 1.
        return undefined; // We'll need to double check how to determine next page
      }
      return undefined
    },
    // Implementing a safer getNextPageParam assuming we pass page in response or calc it.
    // If API doesn't return current page, we can't reliably know next without custom logic. 
    // Let's look at `notificationsApi.getNotifications`: calling `/notifications?page=...`
    // Let's assume standard behavior: if notifications.length === limit, try next.
  })

  // Re-implementing with safer next page logic
  const useNotificationsList = (unreadOnly = false) => useInfiniteQuery({
    queryKey: notificationKeys.list(unreadOnly),
    queryFn: async ({ pageParam = 1 }) => {
      const res = await notificationsApi.getNotifications(pageParam as number, 20, unreadOnly)
      // Attach current page to result for getNextPageParam if missing
      return { ...res, _currentPage: pageParam as number }
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage._currentPage < lastPage.pages) {
        return lastPage._currentPage + 1
      }
      return undefined
    }
  })

  // Unread Count (Polled)
  const useUnreadCount = () => useQuery({
    queryKey: notificationKeys.unreadCount(),
    queryFn: notificationsApi.getUnreadCount,
    refetchInterval: 1000 * 60 * 5, // 5 minutes
    staleTime: 1000 * 60 * 5,
  })

  // Mark as Read
  const markAsReadMutation = useMutation({
    mutationFn: notificationsApi.markAsRead,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: notificationKeys.all })

      // 1. Optimistically update list
      queryClient.setQueriesData({ queryKey: notificationKeys.all }, (oldData: any) => {
        if (!oldData) return oldData
        // Handle both infinite and regular query structures if present
        // For infinite:
        if (oldData.pages) {
          return {
            ...oldData,
            pages: oldData.pages.map((page: any) => ({
              ...page,
              notifications: page.notifications.map((n: any) =>
                n.id === id ? { ...n, isRead: true } : n
              )
            }))
          }
        }
        return oldData
      })

      // 2. Optimistically decrement unread count
      const prevCount = queryClient.getQueryData<{ count: number }>(notificationKeys.unreadCount())
      if (prevCount) {
        queryClient.setQueryData(notificationKeys.unreadCount(), {
          count: Math.max(0, prevCount.count - 1)
        })
      }

      return { prevCount }
    },
    onSuccess: () => {
      // Invalidate to ensure sync
      queryClient.invalidateQueries({ queryKey: notificationKeys.unreadCount() })
      // List invalidation might be too jarring if it removes the item (if filtering by unread)
      // so we might skip invalidating list immediately if just marking read.
    },
    onError: (err, id, context) => {
      if (context?.prevCount) {
        queryClient.setQueryData(notificationKeys.unreadCount(), context.prevCount)
      }
      queryClient.invalidateQueries({ queryKey: notificationKeys.all })
    }
  })

  // Mark All as Read
  const markAllAsReadMutation = useMutation({
    mutationFn: notificationsApi.markAllAsRead,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: notificationKeys.all })

      // Update count to 0
      queryClient.setQueryData(notificationKeys.unreadCount(), { count: 0 })

      // Update all visible lists to read
      queryClient.setQueriesData({ queryKey: notificationKeys.all }, (oldData: any) => {
        if (!oldData?.pages) return oldData
        return {
          ...oldData,
          pages: oldData.pages.map((page: any) => ({
            ...page,
            notifications: page.notifications.map((n: any) => ({ ...n, isRead: true }))
          }))
        }
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all })
    }
  })

  return {
    useNotificationsList,
    useUnreadCount,
    markAsRead: markAsReadMutation.mutateAsync,
    markAllAsRead: markAllAsReadMutation.mutateAsync,
    isMarkingRead: markAsReadMutation.isPending,
    isMarkingAllRead: markAllAsReadMutation.isPending
  }
}
