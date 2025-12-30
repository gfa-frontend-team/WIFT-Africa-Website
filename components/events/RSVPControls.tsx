'use client'

import { useState } from 'react'
import { Check, Clock, X, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import FeatureGate from '@/components/access/FeatureGate'
import { useEventRSVP } from '@/lib/hooks/useEventRSVP'
import { RSVPStatus } from '@/types'
import { cn } from '@/lib/utils'

interface RSVPControlsProps {
  eventId: string
  currentRSVP?: RSVPStatus | null
  compact?: boolean
  className?: string
}

export function RSVPControls({ eventId, currentRSVP, compact = false, className }: RSVPControlsProps) {
  const { rsvpStatus, loading, rsvp, cancelRSVP, canRSVP } = useEventRSVP(eventId, currentRSVP)
  const [showOptions, setShowOptions] = useState(false)

  const handleRSVP = async (status: RSVPStatus) => {
    await rsvp(status)
    setShowOptions(false)
  }

  const handleCancel = async () => {
    await cancelRSVP()
    setShowOptions(false)
  }

  if (compact) {
    return (
      <FeatureGate 
        feature="canRSVPEvents"
        fallback={
          <Button variant="outline" size="sm" disabled>
            RSVP
          </Button>
        }
      >
        <div className={cn('flex items-center gap-1', className)}>
          {rsvpStatus ? (
            <div className="flex items-center gap-1">
              <Button
                variant={rsvpStatus === RSVPStatus.GOING ? 'default' : 'outline'}
                size="sm"
                onClick={() => setShowOptions(!showOptions)}
                disabled={loading}
                className="relative"
              >
                {loading ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <>
                    {rsvpStatus === RSVPStatus.GOING && <Check className="h-3 w-3 mr-1" />}
                    {rsvpStatus === RSVPStatus.INTERESTED && <Clock className="h-3 w-3 mr-1" />}
                    {rsvpStatus === RSVPStatus.NOT_GOING && <X className="h-3 w-3 mr-1" />}
                    {rsvpStatus === RSVPStatus.GOING && 'Going'}
                    {rsvpStatus === RSVPStatus.INTERESTED && 'Interested'}
                    {rsvpStatus === RSVPStatus.NOT_GOING && 'Not Going'}
                  </>
                )}
              </Button>
              
              {showOptions && (
                <div className="absolute z-10 mt-1 bg-white border rounded-md shadow-lg p-1 space-y-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRSVP(RSVPStatus.GOING)}
                    className="w-full justify-start"
                  >
                    <Check className="h-3 w-3 mr-2" />
                    Going
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRSVP(RSVPStatus.INTERESTED)}
                    className="w-full justify-start"
                  >
                    <Clock className="h-3 w-3 mr-2" />
                    Interested
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRSVP(RSVPStatus.NOT_GOING)}
                    className="w-full justify-start"
                  >
                    <X className="h-3 w-3 mr-2" />
                    Not Going
                  </Button>
                  <hr />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCancel}
                    className="w-full justify-start text-red-600"
                  >
                    Cancel RSVP
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleRSVP(RSVPStatus.GOING)}
              disabled={loading}
            >
              {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : 'RSVP'}
            </Button>
          )}
        </div>
      </FeatureGate>
    )
  }

  // Full controls for event details page
  return (
    <FeatureGate 
      feature="canRSVPEvents"
      fallback={
        <div className="text-center p-4 bg-muted rounded-lg">
          <p className="text-muted-foreground">
            You need to be an approved member to RSVP to events
          </p>
        </div>
      }
    >
      <div className={cn('space-y-3', className)}>
        <div className="flex gap-2">
          <Button
            variant={rsvpStatus === RSVPStatus.GOING ? 'default' : 'outline'}
            onClick={() => handleRSVP(RSVPStatus.GOING)}
            disabled={loading}
            className="flex-1"
          >
            {loading && rsvpStatus === RSVPStatus.GOING ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Check className="h-4 w-4 mr-2" />
            )}
            Going
          </Button>
          
          <Button
            variant={rsvpStatus === RSVPStatus.INTERESTED ? 'default' : 'outline'}
            onClick={() => handleRSVP(RSVPStatus.INTERESTED)}
            disabled={loading}
            className="flex-1"
          >
            {loading && rsvpStatus === RSVPStatus.INTERESTED ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Clock className="h-4 w-4 mr-2" />
            )}
            Interested
          </Button>
          
          <Button
            variant={rsvpStatus === RSVPStatus.NOT_GOING ? 'default' : 'outline'}
            onClick={() => handleRSVP(RSVPStatus.NOT_GOING)}
            disabled={loading}
            className="flex-1"
          >
            {loading && rsvpStatus === RSVPStatus.NOT_GOING ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <X className="h-4 w-4 mr-2" />
            )}
            Not Going
          </Button>
        </div>
        
        {rsvpStatus && (
          <Button
            variant="ghost"
            onClick={handleCancel}
            disabled={loading}
            className="w-full text-red-600 hover:text-red-700"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : null}
            Cancel RSVP
          </Button>
        )}
      </div>
    </FeatureGate>
  )
}