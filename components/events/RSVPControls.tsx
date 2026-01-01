'use client'

import { Button } from '@/components/ui/button'
import { RSVPStatus } from '@/types'
import { Check, Star, X } from 'lucide-react'
import { useEventRSVP } from '@/lib/hooks/useEventRSVP'
import { cn } from '@/lib/utils'

interface RSVPControlsProps {
  eventId: string
  currentStatus: RSVPStatus | null
  isCancelled?: boolean
  isFull?: boolean
  className?: string
  layout?: 'row' | 'dropdown' // Future optimization: support dropdown for mobile
}

export function RSVPControls({ 
  eventId, 
  currentStatus, 
  isCancelled, 
  isFull,
  className 
}: RSVPControlsProps) {
  const { rsvp, cancel, isPending } = useEventRSVP(eventId)

  if (isCancelled) {
      return (
          <div className={cn("text-muted-foreground text-sm font-medium", className)}>
              Event Cancelled
          </div>
      )
  }

  const handleGoing = () => {
      if (currentStatus === RSVPStatus.GOING) {
          cancel()
      } else {
          rsvp(RSVPStatus.GOING)
      }
  }

  const handleInterested = () => {
      if (currentStatus === RSVPStatus.INTERESTED) {
          cancel()
      } else {
          rsvp(RSVPStatus.INTERESTED)
      }
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Button 
        variant={currentStatus === RSVPStatus.GOING ? "default" : "outline"}
        size="sm"
        onClick={handleGoing}
        disabled={isPending || (isFull && currentStatus !== RSVPStatus.GOING)}
        className={cn(currentStatus === RSVPStatus.GOING && "bg-green-600 hover:bg-green-700")}
      >
        {currentStatus === RSVPStatus.GOING ? (
            <>
                <Check className="mr-2 h-4 w-4" />
                Going
            </>
        ) : (
            <>
                {isFull ? "Full" : "Going"}
            </>
        )}
      </Button>

      <Button
        variant={currentStatus === RSVPStatus.INTERESTED ? "secondary" : "outline"}
        size="sm"
        onClick={handleInterested}
        disabled={isPending}
      >
        <Star className={cn("mr-2 h-4 w-4", currentStatus === RSVPStatus.INTERESTED && "fill-current")} />
        {currentStatus === RSVPStatus.INTERESTED ? "Interested" : "Interested"}
      </Button>
    </div>
  )
}
