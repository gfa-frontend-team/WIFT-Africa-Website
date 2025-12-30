'use client'

import { useState } from 'react'
import { Notification } from '@/lib/api/notifications'
import { useNotifications } from '@/lib/hooks/useNotifications'
import { formatDistanceToNow } from 'date-fns'
import Link from 'next/link'
import Image from 'next/image'
import { Bell, MessageCircle, UserPlus, Heart, MessageSquare } from 'lucide-react'
import { Modal } from '@/components/ui/Modal'

interface NotificationItemProps {
  notification: Notification
}

export default function NotificationItem({ notification }: NotificationItemProps) {
  const { markAsRead } = useNotifications()
  const [isModalOpen, setIsModalOpen] = useState(false)

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

  // Sanitize action URL to handle legacy or incorrect routes
  const getSanitizedUrl = (url?: string) => {
    if (!url) return undefined
    
    // Map non-existent dashboard to feed
    if (url === '/dashboard' || url.startsWith('/dashboard/')) {
       return url.replace('/dashboard', '/feed')
    }

    // Map legacy profile routes
    // Backend might match /profile/:id, frontend uses /in/:id
    if (url.startsWith('/profile/')) {
      return url.replace('/profile/', '/in/')
    }

    return url
  }

  const actionUrl = getSanitizedUrl(notification.actionUrl)

  const handleClick = (e?: React.MouseEvent) => {
    // If it's a link click, let it propagate naturally unless we specifically want to intercept
    if (!notification.isRead) {
      markAsRead(notification.id)
    }

    if (!actionUrl) {
       setIsModalOpen(true)
    }
  }

  const ContentInner = (
     <>
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
     </>
  )

  const Content = (
    <div 
        className={`flex items-start gap-4 p-4 border-b border-border hover:bg-muted/50 transition-colors cursor-pointer ${!notification.isRead ? 'bg-primary/5' : ''}`}
        onClick={() => handleClick()}
    >
      {ContentInner}
    </div>
  )

  // Full content for modal
  const ModalContent = (
    <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3 pb-4 border-b border-border/50">
             {notification.sender?.profilePhoto ? (
                <div className="relative w-12 h-12 rounded-full overflow-hidden">
                    <Image 
                        src={notification.sender.profilePhoto} 
                        alt={notification.sender.firstName}
                        fill
                        className="object-cover"
                    />
                </div>
            ) : (
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                    {getIcon()}
                </div>
            )}
            <div>
                <p className="font-semibold text-foreground">
                    {notification.sender ? `${notification.sender.firstName} ${notification.sender.lastName || ''}` : 'System'}
                </p>
                <p className="text-sm text-muted-foreground">
                     {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                </p>
            </div>
        </div>

        <div className="py-2">
             <h3 className="font-medium text-lg mb-2">{notification.title}</h3>
             <p className="text-base text-muted-foreground whitespace-pre-wrap leading-relaxed">
                {notification.message}
             </p>
        </div>

        {/* Display metadata if useful, or actions */}
        {notification.actionUrl && (
            <div className="pt-4 flex justify-end">
                <Link 
                    href={actionUrl || notification.actionUrl}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
                >
                    View Related
                </Link>
            </div>
        )}
    </div>
  )

  if (actionUrl) {
    return (
        <div onClick={(e) => {
             if (!notification.isRead) markAsRead(notification.id)
        }}>
         <Link href={actionUrl}>
            <div className={`flex items-start gap-4 p-4 border-b border-border hover:bg-muted/50 transition-colors cursor-pointer ${!notification.isRead ? 'bg-primary/5' : ''}`}>
               {ContentInner}
            </div>
         </Link>
        </div>
    )
  }

  return (
    <>
      {Content}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title="Notification Details"
      >
        {ModalContent}
      </Modal>
    </>
  )
}
