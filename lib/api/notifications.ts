import { apiClient } from './client'

export interface NotificationSender {
  id: string
  firstName: string
  lastName?: string
  profilePhoto?: string
}

export interface Notification {
  id: string
  type: 'NEW_MESSAGE' | 'CONNECTION_REQUEST' | 'CONNECTION_ACCEPTED' | 'LIKE' | 'COMMENT' | 'SYSTEM'
  title: string
  message: string
  sender?: NotificationSender
  isRead: boolean
  actionUrl?: string
  createdAt: string
  metadata?: any
}

export interface NotificationsResponse {
  notifications: Notification[]
  total: number
  unreadCount: number
  pages: number
}

export interface NotificationPreferences {
  emailEnabled: boolean
  pushEnabled: boolean
  inAppEnabled: boolean
  postNotifications: boolean
  messageNotifications: boolean
  emailDigestFrequency: 'instant' | 'daily' | 'weekly'
}

export const notificationsApi = {
  /**
   * Get notifications
   */
  getNotifications: async (page = 1, limit = 20, unreadOnly = false): Promise<NotificationsResponse> => {
    return await apiClient.get<NotificationsResponse>(`/notifications?page=${page}&limit=${limit}&unreadOnly=${unreadOnly}`)
  },

  /**
   * Get unread count
   */
  getUnreadCount: async (): Promise<{ count: number }> => {
    return await apiClient.get<{ count: number }>('/notifications/unread-count')
  },

  /**
   * Mark single notification as read
   */
  markAsRead: async (notificationId: string): Promise<{ message: string }> => {
    return await apiClient.patch<{ message: string }>(`/notifications/${notificationId}/read`)
  },

  /**
   * Mark all notifications as read
   */
  markAllAsRead: async (): Promise<{ message: string; count: number }> => {
    return await apiClient.post<{ message: string; count: number }>('/notifications/mark-all-read')
  },

  /**
   * Delete a notification
   */
  deleteNotification: async (notificationId: string): Promise<{ message: string }> => {
    return await apiClient.delete<{ message: string }>(`/notifications/${notificationId}`)
  },

  /**
   * Get preferences
   */
  getPreferences: async (): Promise<{ preferences: NotificationPreferences }> => {
    return await apiClient.get<{ preferences: NotificationPreferences }>('/notifications/preferences')
  },

  /**
   * Update preferences
   */
  updatePreferences: async (preferences: Partial<NotificationPreferences>): Promise<{ message: string; preferences: NotificationPreferences }> => {
    return await apiClient.put<{ message: string; preferences: NotificationPreferences }>('/notifications/preferences', preferences)
  },

  /**
   * Register push token
   */
  registerPushToken: async (token: string, deviceType: 'ios' | 'android' | 'web', deviceId: string): Promise<{ message: string }> => {
    return await apiClient.post<{ message: string }>('/notifications/push-tokens', {
      token,
      deviceType,
      deviceId
    })
  }
}
