'use client'

import { SearchUserResult } from '@/lib/api/search'
import { ConnectionRequest } from '@/lib/api/connections'
import { Button } from '@/components/ui/button'
import Avatar from '@/components/ui/Avatar'
import { MapPin, Users, UserPlus, MessageCircle, Clock, UserCheck } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { getProfileUrl } from '@/lib/utils/routes'

interface MemberCardProps {
  member: SearchUserResult
  onConnect: (id: string) => void
  onAccept?: (requestId: string) => void
  incomingRequest?: ConnectionRequest
  isConnecting?: boolean
}

export default function MemberCard({ member, onConnect, onAccept, incomingRequest, isConnecting }: MemberCardProps) {
  const router = useRouter()
  
  // Navigate to profile on click (unless clicking button)
  const handleCardClick = (e: React.MouseEvent) => {
    // Prevent navigation if clicking buttons/links
    if ((e.target as HTMLElement).closest('button') || (e.target as HTMLElement).closest('a')) {
      return
    }
    router.push(getProfileUrl(member))
  }

  const renderActionButton = () => {
    if (member.connectionStatus === 'connected') {
      return (
        <Button 
          variant="outline" 
          className="w-full gap-2 border-primary/20 text-primary hover:bg-primary/5"
          onClick={() => router.push(`/messages?userId=${member.id}`)}
        >
          <MessageCircle size={16} />
          Message
        </Button>
      )
    }

    if (member.connectionStatus === 'pending') {
      return (
        <Button 
          variant="secondary" 
          className="w-full gap-2 bg-muted text-muted-foreground cursor-not-allowed"
          disabled
        >
          <Clock size={16} />
          Pending
        </Button>
      )
    }

    if (incomingRequest && onAccept) {
        return (
            <Button 
              className="w-full gap-2 bg-primary hover:bg-primary/90" 
              onClick={() => onAccept(incomingRequest.id)}
              disabled={isConnecting}
            >
              {isConnecting ? (
                  <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
              ) : (
                  <UserCheck size={16} />
              )}
              Accept Request
            </Button>
        )
    }

    return (
      <Button 
        className="w-full gap-2" 
        onClick={() => onConnect(member.id)}
        disabled={isConnecting}
      >
        {isConnecting ? (
          <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
        ) : (
          <UserPlus size={16} />
        )}
        Connect
      </Button>
    )
  }

  return (
    <div 
      onClick={handleCardClick}
      className="group bg-card hover:bg-accent/5 transition-colors border border-border rounded-xl p-5 flex flex-col items-center text-center cursor-pointer shadow-sm hover:shadow-md"
    >
      <div className="relative mb-4">
        <div className="w-24 h-24 relative">
            <Avatar 
                src={member.profilePhoto} 
                name={`${member.firstName} ${member.lastName}`}
                className="w-24 h-24 text-2xl" 
            />
        </div>
        {/* Availability dot could go here */}
        {member.availabilityStatus === 'AVAILABLE' && (
            <div className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 border-2 border-card rounded-full" title="Available for work" />
        )}
      </div>

      <div className="space-y-1 mb-4 w-full">
        <Link 
            href={getProfileUrl(member)} 
            className="font-bold text-lg text-foreground hover:text-primary hover:underline line-clamp-1"
        >
          {member.firstName} {member.lastName}
        </Link>
        <p className="text-sm text-muted-foreground line-clamp-2 h-10">
          {member.headline || member.primaryRole || 'Member'}
        </p>
      </div>

      <div className="w-full space-y-2 mb-6">
         {/* Role Badge */}
         {member.primaryRole && (
             <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary mb-2">
                 {member.primaryRole}
             </div>
         )}

         {/* Meta Info */}
         <div className="flex flex-col gap-1 text-xs text-muted-foreground items-center">
            {member.location && (
                <div className="flex items-center gap-1.5">
                    <MapPin size={12} />
                    <span className="truncate max-w-[150px]">{member.location}</span>
                </div>
            )}
            {member.chapter && (
                <div className="flex items-center gap-1.5">
                    <Users size={12} />
                    <span className="truncate max-w-[150px]">{member.chapter.name}</span>
                </div>
            )}
         </div>
      </div>

      <div className="mt-auto w-full pt-4 border-t border-border">
        {renderActionButton()}
      </div>
    </div>
  )
}
