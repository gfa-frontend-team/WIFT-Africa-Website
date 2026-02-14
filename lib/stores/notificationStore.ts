import { create } from 'zustand'

/**
 * @deprecated This store is deprecated. Use useNotifications hook instead.
 */
export const useNotificationStore = create<any>(() => ({
  notifications: [],
  unreadCount: 0,
  total: 0,
  isLoading: false,
  error: null,
  fetchNotifications: () => console.warn('useNotificationStore.fetchNotifications is deprecated'),
  fetchUnreadCount: () => console.warn('useNotificationStore.fetchUnreadCount is deprecated'),
  markAsRead: () => console.warn('useNotificationStore.markAsRead is deprecated'),
  markAllAsRead: () => console.warn('useNotificationStore.markAllAsRead is deprecated'),
  addNotification: () => console.warn('useNotificationStore.addNotification is deprecated'),
}))
