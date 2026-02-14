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

// Helper to ensure ID exists (mapping _id to id if needed)
const mapNotification = (notification: any): Notification => {
  if (!notification) return notification
  return {
    ...notification,
    id: notification.id || notification._id,
    sender: notification.sender ? {
      ...notification.sender,
      id: notification.sender.id || notification.sender._id
    } : notification.sender
  }
}

export const notificationsApi = {
  /**
   * Get notifications
   */
  getNotifications: async (page = 1, limit = 20, unreadOnly = false): Promise<NotificationsResponse> => {
    const response = await apiClient.get<NotificationsResponse>(`/notifications?page=${page}&limit=${limit}&unreadOnly=${unreadOnly}`)
    
    if (response && response.notifications) {
      response.notifications = response.notifications.map(mapNotification)
    }
    
    return response
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
  },

  /**
   * Unregister push token
   */
  unregisterPushToken: async (token: string): Promise<{ message: string }> => {
    return await apiClient.delete<{ message: string }>(`/notifications/push-tokens/${token}`)
  }
}
