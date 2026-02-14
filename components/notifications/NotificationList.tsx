'use client'

import { Notification } from '@/lib/api/notifications'
import NotificationItem from './NotificationItem'
import { BellOff } from 'lucide-react'

interface NotificationListProps {
  notifications: Notification[]
  isLoading?: boolean
}

export default function NotificationList({ notifications, isLoading }: NotificationListProps) {
  if (isLoading && notifications.length === 0) {
    return (
      <div className="py-20 text-center text-muted-foreground">
        Loading notifications...
      </div>
    )
  }

  if (notifications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="bg-muted p-4 rounded-full mb-4">
            <BellOff className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-2">No notifications</h3>
        <p className="text-muted-foreground">
          You're all caught up! Check back later for updates.
        </p>
      </div>
    )
  }

  return (
    <div className="divide-y divide-border rounded-lg border border-border bg-card overflow-hidden">
      {notifications.map((notification) => (
        <NotificationItem key={notification.id} notification={notification} />
      ))}
    </div>
  )
}
