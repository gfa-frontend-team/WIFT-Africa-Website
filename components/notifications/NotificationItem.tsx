'use client'

import { Notification } from '@/lib/api/notifications'
import { useNotificationStore } from '@/lib/stores/notificationStore'
import { formatDistanceToNow } from 'date-fns'
import Link from 'next/link'
import Image from 'next/image'
import { Bell, MessageCircle, UserPlus, Heart, MessageSquare } from 'lucide-react'

interface NotificationItemProps {
  notification: Notification
}

export default function NotificationItem({ notification }: NotificationItemProps) {
  const { markAsRead } = useNotificationStore()

  const getIcon = () => {
    switch (notification.type) {
      case 'NEW_MESSAGE':
        return <MessageCircle className="h-5 w-5 text-blue-500" />
      case 'CONNECTION_REQUEST':
      case 'CONNECTION_ACCEPTED':
        return <UserPlus className="h-5 w-5 text-green-500" />
      case 'LIKE':
        return <Heart className="h-5 w-5 text-red-500" />
      case 'COMMENT':
        return <MessageSquare className="h-5 w-5 text-purple-500" />
      default:
        return <Bell className="h-5 w-5 text-gray-500" />
    }
  }

  const handleClick = () => {
    if (!notification.isRead) {
      markAsRead(notification.id)
    }
  }

  const Content = (
    <div 
        className={`flex items-start gap-4 p-4 border-b border-border hover:bg-muted/50 transition-colors cursor-pointer ${!notification.isRead ? 'bg-primary/5' : ''}`}
        onClick={handleClick}
    >
      <div className="mt-1">
        {notification.sender?.profilePhoto ? (
            <div className="relative w-10 h-10 rounded-full overflow-hidden">
                <Image 
                    src={notification.sender.profilePhoto} 
                    alt={notification.sender.firstName}
                    fill
                    className="object-cover"
                />
            </div>
        ) : (
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                {getIcon()}
            </div>
        )}
      </div>
      
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground">
          {notification.title}
        </p>
        <p className="text-sm text-muted-foreground truncate">
          {notification.message}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
        </p>
      </div>
      
      {!notification.isRead && (
        <div className="w-2 h-2 rounded-full bg-primary mt-2" />
      )}
    </div>
  )

  if (notification.actionUrl) {
    return <Link href={notification.actionUrl}>{Content}</Link>
  }

  return Content
}
