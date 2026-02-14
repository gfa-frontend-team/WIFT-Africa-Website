'use client'

import { SearchUserResult } from '@/lib/api/search'
import MemberCard from './MemberCard'
import { useConnections } from '@/lib/hooks/useConnections'
import { toast } from 'sonner'

interface MembersGridProps {
  members: SearchUserResult[]
  isLoading: boolean
  onConnect: (id: string) => void
  connectingId?: string | null
}

export default function MembersGrid({ 
  members, 
  isLoading, 
  onConnect,
  connectingId
}: MembersGridProps) {
  const { useRequests, respondToRequest, isResponding } = useConnections()
  const { data: incomingRequests } = useRequests('incoming')

  const handleAccept = async (requestId: string) => {
    try {
        await respondToRequest(requestId, 'accept')
        toast.success('Connection accepted')
    } catch (error) {
        toast.error('Failed to accept request')
    }
  }
  
  if (isLoading && members.length === 0) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-card border border-border rounded-xl p-6 h-[340px] animate-pulse flex flex-col items-center">
             <div className="w-24 h-24 bg-muted rounded-full mb-4"></div>
             <div className="h-6 w-3/4 bg-muted rounded mb-2"></div>
             <div className="h-4 w-1/2 bg-muted rounded mb-6"></div>
             <div className="w-full mt-auto h-10 bg-muted rounded"></div>
          </div>
        ))}
      </div>
    )
  }

  if (members.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
            <Users size={32} className="text-muted-foreground" />
        </div>
        <h3 className="text-xl font-semibold mb-2">No members found</h3>
        <p className="text-muted-foreground max-w-sm">
          Try adjusting your search or filters to find who you're looking for.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {members.map((member) => (
        <MemberCard 
          key={member.id} 
          member={member} 
          onConnect={onConnect}
          isConnecting={connectingId === member.id || isResponding}
          onAccept={handleAccept}
          incomingRequest={incomingRequests?.requests?.find(
            r => r.sender.id === member.id && r.status === 'PENDING'
          )}
        />
      ))}
    </div>
  )
}

function Users({ size, className }: { size: number, className?: string }) {
    return (
        <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width={size} 
            height={size} 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className={className}
        >
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
    )
}
