import { create } from 'zustand'
import { notificationsApi, Notification } from '@/lib/api/notifications'

interface NotificationState {
  notifications: Notification[]
  unreadCount: number
  total: number
  isLoading: boolean
  error: string | null
  lastUnreadFetch: number
  
  fetchNotifications: (page?: number, limit?: number) => Promise<void>
  fetchUnreadCount: () => Promise<void>
  markAsRead: (id: string) => Promise<void>
  markAllAsRead: () => Promise<void>
  addNotification: (notification: Notification) => void // For real-time updates if implemented
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  total: 0,
  isLoading: false,
  error: null,
  lastUnreadFetch: 0,

  fetchNotifications: async (page = 1, limit = 20) => {
    try {
      set({ isLoading: true, error: null })
      const response = await notificationsApi.getNotifications(page, limit)
      
      set((state) => ({
        notifications: page === 1 ? response.notifications : [...state.notifications, ...response.notifications],
        total: response.total,
        unreadCount: response.unreadCount, // Sync count
        isLoading: false
      }))
    } catch (error: any) {
      console.error('Failed to fetch notifications:', error)
      set({ error: error.message, isLoading: false })
    }
  },

  fetchUnreadCount: async () => {
    const state = get()
    // Throttle checks to once every 30 seconds unless force refetch needed
    // (You could add a force param later if needed)
    if (Date.now() - state.lastUnreadFetch < 30000 && state.unreadCount !== undefined) {
      return
    }

    try {
      const { count } = await notificationsApi.getUnreadCount()
      set({ unreadCount: count, lastUnreadFetch: Date.now() })
    } catch (error) {
      console.error('Failed to fetch unread count:', error)
    }
  },

  markAsRead: async (id) => {
    try {
      // Optimistic update
      set((state) => ({
        notifications: state.notifications.map(n => 
          n.id === id ? { ...n, isRead: true } : n
        ),
        unreadCount: Math.max(0, state.unreadCount - 1)
      }))

      await notificationsApi.markAsRead(id)
    } catch (error) {
      console.error('Failed to mark notification as read:', error)
      // Revert if needed, but for 'read' status it's usually fine to ignore or refetch
      get().fetchUnreadCount()
    }
  },

  markAllAsRead: async () => {
    try {
      set((state) => ({
        notifications: state.notifications.map(n => ({ ...n, isRead: true })),
        unreadCount: 0
      }))
      
      await notificationsApi.markAllAsRead()
    } catch (error) {
      console.error('Failed to mark all as read:', error)
      get().fetchUnreadCount()
    }
  },

  addNotification: (notification) => {
    set((state) => ({
      notifications: [notification, ...state.notifications],
      unreadCount: state.unreadCount + 1
    }))
  }
}))
