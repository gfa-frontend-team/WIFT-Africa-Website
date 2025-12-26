'use client'

import { useEffect } from 'react'
import { useNotificationStore } from '@/lib/stores/notificationStore'
import NotificationList from '@/components/notifications/NotificationList'
import { CheckCheck } from 'lucide-react'

export default function NotificationsPage() {
  const { 
    notifications, 
    fetchNotifications, 
    fetchUnreadCount,
    markAllAsRead, 
    isLoading, 
    total,
    unreadCount
  } = useNotificationStore()

  useEffect(() => {
    fetchNotifications()
    // Also fetch unread count to keep badge in sync
    fetchUnreadCount()
  }, [])

  const handleLoadMore = () => {
    const currentPage = Math.ceil(notifications.length / 20)
    fetchNotifications(currentPage + 1)
  }

  const hasMore = notifications.length < total

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
            <h1 className="text-3xl font-bold text-foreground">Notifications</h1>
            {unreadCount > 0 && (
                <p className="text-sm text-muted-foreground mt-1">
                    You have {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
                </p>
            )}
        </div>
        
        {unreadCount > 0 && (
            <button
            onClick={() => markAllAsRead()}
            className="flex items-center gap-2 px-3 py-1.5 text-sm text-primary hover:bg-primary/10 rounded-md transition-colors"
            >
            <CheckCheck className="h-4 w-4" />
            Mark all as read
            </button>
        )}
      </div>

      <NotificationList notifications={notifications} isLoading={isLoading} />

      {hasMore && (
        <div className="mt-6 text-center">
            <button
                onClick={handleLoadMore}
                disabled={isLoading}
                className="px-4 py-2 bg-muted text-muted-foreground hover:text-foreground rounded-md text-sm font-medium transition-colors disabled:opacity-50"
            >
                {isLoading ? 'Loading...' : 'Load More'}
            </button>
        </div>
      )}
    </div>
  )
}
