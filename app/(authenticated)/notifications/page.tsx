'use client'

import { useEffect } from 'react'
import { useNotifications } from '@/lib/hooks/useNotifications'
import NotificationList from '@/components/notifications/NotificationList'
import { CheckCheck } from 'lucide-react'

export default function NotificationsPage() {
  const { 
    useNotificationsList, 
    useUnreadCount, 
    markAllAsRead,
    isMarkingAllRead
  } = useNotifications()

  const { 
    data, 
    fetchNextPage, 
    hasNextPage, 
    isFetchingNextPage,
    isLoading: isListLoading
  } = useNotificationsList()

  const { data: unreadData } = useUnreadCount()
  const unreadCount = unreadData?.count || 0

  const notifications = data?.pages.flatMap(page => page.notifications) || []
  const isLoading = isListLoading

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
            disabled={isMarkingAllRead}
            className="flex items-center gap-2 px-3 py-1.5 text-sm text-primary hover:bg-primary/10 rounded-md transition-colors disabled:opacity-50"
            >
            <CheckCheck className="h-4 w-4" />
            Mark all as read
            </button>
        )}
      </div>

      <NotificationList notifications={notifications} isLoading={isLoading} />

      {hasNextPage && (
        <div className="mt-6 text-center">
            <button
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                className="px-4 py-2 bg-muted text-muted-foreground hover:text-foreground rounded-md text-sm font-medium transition-colors disabled:opacity-50"
            >
                {isFetchingNextPage ? 'Loading...' : 'Load More'}
            </button>
        </div>
      )}
    </div>
  )
}
