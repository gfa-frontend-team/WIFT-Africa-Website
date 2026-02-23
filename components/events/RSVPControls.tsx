'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Event, RSVPStatus, EventStatus } from '@/types'
import { Check, Star, Calendar, XCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface RSVPControlsProps {
  event: Event
  myRSVP: RSVPStatus | null
  onRSVP: (status: RSVPStatus) => void
  onCancel: () => void
  isPending: boolean
  className?: string
}

export function RSVPControls({ 
  event,
  myRSVP,
  onRSVP,
  onCancel,
  isPending,
  className 
}: RSVPControlsProps) {
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const [pendingAction, setPendingAction] = useState<RSVPStatus | null>(null)
  
  // Check if event is cancelled or completed
  const isEventCancelled = event.status === EventStatus.CANCELLED || event.isCancelled
  const isEventCompleted = event.status === EventStatus.COMPLETED
  const canRSVP = !isEventCancelled && !isEventCompleted
  
  // Check capacity
  const isFull = event.capacity ? (event.currentAttendees || 0) >= event.capacity : false
  const canGoingRSVP = canRSVP && (!isFull || myRSVP === RSVPStatus.GOING)
  
  // Don't show controls if event is cancelled or completed
  if (!canRSVP) {
    return null // Status banner will be shown instead
  }
  
  const handleRSVP = (status: RSVPStatus) => {
    if (myRSVP === status) {
      // Clicking active button triggers cancel confirmation
      setPendingAction(status)
      setShowCancelDialog(true)
    } else {
      onRSVP(status)
    }
  }
  
  const handleConfirmCancel = () => {
    onCancel()
    setShowCancelDialog(false)
    setPendingAction(null)
  }
  
  return (
    <>
      <div className={cn("flex gap-3", className)}>
        <Button
          variant={myRSVP === RSVPStatus.GOING ? 'default' : 'outline'}
          onClick={() => handleRSVP(RSVPStatus.GOING)}
          disabled={!canGoingRSVP || isPending}
          className={cn(
            "flex-1",
            myRSVP === RSVPStatus.GOING && "bg-green-600 hover:bg-green-700"
          )}
        >
          {isFull && myRSVP !== RSVPStatus.GOING ? (
            <>
              <XCircle className="mr-2 h-4 w-4" />
              Event Full
            </>
          ) : myRSVP === RSVPStatus.GOING ? (
            <>
              <Check className="mr-2 h-4 w-4" />
              You're Going
            </>
          ) : (
            <>
              <Calendar className="mr-2 h-4 w-4" />
              Going
            </>
          )}
        </Button>
        
        <Button
          variant={myRSVP === RSVPStatus.INTERESTED ? 'secondary' : 'outline'}
          onClick={() => handleRSVP(RSVPStatus.INTERESTED)}
          disabled={!canRSVP || isPending}
          className="flex-1"
        >
          <Star className={cn(
            "mr-2 h-4 w-4",
            myRSVP === RSVPStatus.INTERESTED && "fill-current"
          )} />
          {myRSVP === RSVPStatus.INTERESTED ? 'Interested' : 'Interested'}
        </Button>
      </div>
      
      {/* Cancel Confirmation Dialog */}
      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel RSVP?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel your RSVP for this event?
              {pendingAction === RSVPStatus.GOING && " This will free up a spot for other members."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setPendingAction(null)}>
              No, keep it
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmCancel}>
              Yes, cancel RSVP
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

