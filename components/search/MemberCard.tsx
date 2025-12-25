'use client'

import { SearchUserResult } from '@/lib/api/search'
import { useConnectionStore } from '@/lib/stores/connectionStore'
import { UserPlus, MessageCircle, Check, Clock } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/hooks/useAuth'

interface MemberCardProps {
  user: SearchUserResult
}

export default function MemberCard({ user }: MemberCardProps) {
  const router = useRouter()
  const { user: currentUser } = useAuth() 
  const { sendRequest } = useConnectionStore()
  const [status, setStatus] = useState(user.connectionStatus)
  const [isLoading, setIsLoading] = useState(false)
  
  // Don't show connect button for self
  const isSelf = currentUser?.id === user.id

  const handleConnect = async () => {
    try {
      setIsLoading(true)
      await sendRequest(user.id)
      setStatus('pending')
    } catch (error) {
      console.error('Failed to send request:', error)
      // Ideally show toast
    } finally {
      setIsLoading(false)
    }
  }

  const handleMessage = () => {
    router.push(`/messages?userId=${user.id}`)
  }

  return (
    <div className="bg-card border border-border rounded-lg p-5 flex flex-col items-center text-center transition-all hover:shadow-md">
      <div className="w-20 h-20 rounded-full overflow-hidden bg-muted relative mb-4">
        {user.profilePhoto ? (
          <Image
            src={user.profilePhoto}
            alt={user.firstName}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary text-2xl font-bold">
            {user.firstName[0]}
          </div>
        )}
      </div>

      <Link 
        href={`/in/${user.username || user.id}`}
        className="font-bold text-lg text-foreground hover:underline mb-1 line-clamp-1"
      >
        {user.firstName} {user.lastName}
      </Link>
      
      <p className="text-sm text-muted-foreground mb-3 line-clamp-1 h-5">
        {user.headline || user.primaryRole || 'Member'}
      </p>

      {user.location && (
        <p className="text-xs text-muted-foreground mb-4 flex items-center gap-1">
            <span className="truncate max-w-[150px]">{user.location}</span>
        </p>
      )}

      <div className="mt-auto w-full">
        {isSelf ? (
          <button 
            disabled 
            className="w-full py-2 bg-muted text-muted-foreground rounded-md text-sm font-medium"
          >
            You
          </button>
        ) : status === 'connected' ? (
          <button
            onClick={handleMessage}
            className="w-full py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
          >
            <MessageCircle className="h-4 w-4" />
            Message
          </button>
        ) : status === 'pending' ? (
          <button
            disabled
            className="w-full py-2 bg-muted text-muted-foreground rounded-md text-sm font-medium flex items-center justify-center gap-2 cursor-not-allowed"
          >
            <Clock className="h-4 w-4" />
            Pending
          </button>
        ) : (
          <button
            onClick={handleConnect}
            disabled={isLoading}
            className="w-full py-2 border border-primary text-primary rounded-md text-sm font-medium hover:bg-primary/5 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLoading ? (
              <span className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            ) : (
              <UserPlus className="h-4 w-4" />
            )}
            Connect
          </button>
        )}
      </div>
    </div>
  )
}
