import { ConnectionRequest } from '@/lib/api/connections'
import { useConnectionStore } from '@/lib/stores/connectionStore'
import { UserCheck, X } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

interface RequestCardProps {
  request: ConnectionRequest
  type: 'incoming' | 'outgoing'
}

export default function RequestCard({ request, type }: RequestCardProps) {
  const { respondToRequest } = useConnectionStore()
  const [isProcessing, setIsProcessing] = useState(false)
  
  const user = type === 'incoming' ? request.sender : request.receiver

  const handleAction = async (action: 'accept' | 'decline' | 'cancel') => {
    setIsProcessing(true)
    try {
      await respondToRequest(request.id, action)
    } catch (error) {
      console.error(`Failed to ${action} request:`, error)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="bg-card border border-border rounded-lg p-4 flex items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <Link href={`/profile/${user.profileSlug || user.username}`}>
          <div className="w-12 h-12 rounded-full overflow-hidden bg-muted relative">
            {user.profilePhoto ? (
              <Image
                src={user.profilePhoto}
                alt={user.firstName}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary font-bold">
                {user.firstName[0]}
              </div>
            )}
          </div>
        </Link>
        <div>
          <Link 
            href={`/in/${user.profileSlug || user.username}`}
            className="font-semibold text-foreground hover:underline"
          >
            {user.firstName} {user.lastName}
          </Link>
          <p className="text-sm text-muted-foreground line-clamp-1">
            {user.accountType ? user.accountType.replace('_', ' ').toLowerCase() : 'Member'}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {type === 'incoming' ? (
          <>
            <button
              onClick={() => handleAction('accept')}
              disabled={isProcessing}
              className="p-2 bg-primary/10 text-primary hover:bg-primary/20 rounded-full transition-colors disabled:opacity-50"
              title="Accept"
            >
              <UserCheck className="h-5 w-5" />
            </button>
            <button
              onClick={() => handleAction('decline')}
              disabled={isProcessing}
              className="p-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-full transition-colors disabled:opacity-50"
              title="Decline"
            >
              <X className="h-5 w-5" />
            </button>
          </>
        ) : (
          <button
            onClick={() => handleAction('cancel')}
            disabled={isProcessing}
            className="px-3 py-1.5 text-sm border border-border rounded-md hover:bg-muted/50 transition-colors disabled:opacity-50"
          >
            Withdraw
          </button>
        )}
      </div>
    </div>
  )
}
