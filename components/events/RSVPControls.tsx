'use client'

import React, { useState } from 'react'
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

  // Helper function to get status display info
  const getStatusInfo = (status: RSVPStatus) => {
    switch (status) {
      case RSVPStatus.GOING:
        return { icon: Check, label: 'Going', color: 'text-green-600' }
      case RSVPStatus.INTERESTED:
        return { icon: Clock, label: 'Interested', color: 'text-yellow-600' }
      case RSVPStatus.NOT_GOING:
        return { icon: X, label: 'Not Going', color: 'text-red-600' }
    }
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
        <div className={cn('flex items-center gap-1 relative', className)}>
          {rsvpStatus ? (
            <div className="flex items-center gap-1">
              <Button
                variant={rsvpStatus === RSVPStatus.GOING ? 'default' : 'outline'}
                size="sm"
                onClick={() => setShowOptions(!showOptions)}
                disabled={loading}
                className={cn(
                  "relative",
                  rsvpStatus === RSVPStatus.GOING && "bg-green-600 hover:bg-green-700",
                  rsvpStatus === RSVPStatus.INTERESTED && "bg-yellow-600 hover:bg-yellow-700 text-white",
                  rsvpStatus === RSVPStatus.NOT_GOING && "bg-red-600 hover:bg-red-700 text-white"
                )}
              >
                {loading ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <>
                    {rsvpStatus === RSVPStatus.GOING && <Check className="h-3 w-3 mr-1" />}
                    {rsvpStatus === RSVPStatus.INTERESTED && <Clock className="h-3 w-3 mr-1" />}
                    {rsvpStatus === RSVPStatus.NOT_GOING && <X className="h-3 w-3 mr-1" />}
                    {getStatusInfo(rsvpStatus).label}
                  </>
                )}
              </Button>
              
              {showOptions && (
                <div className="absolute z-10 top-full mt-1 bg-white border rounded-md shadow-lg p-1 space-y-1 min-w-[140px]">
                  <div className="px-2 py-1 text-xs text-muted-foreground border-b">
                    Change RSVP
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRSVP(RSVPStatus.GOING)}
                    className={cn(
                      "w-full justify-start",
                      rsvpStatus === RSVPStatus.GOING && "bg-green-50 text-green-700"
                    )}
                    disabled={loading}
                  >
                    <Check className="h-3 w-3 mr-2" />
                    Going
                    {rsvpStatus === RSVPStatus.GOING && <span className="ml-auto text-xs">✓</span>}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRSVP(RSVPStatus.INTERESTED)}
                    className={cn(
                      "w-full justify-start",
                      rsvpStatus === RSVPStatus.INTERESTED && "bg-yellow-50 text-yellow-700"
                    )}
                    disabled={loading}
                  >
                    <Clock className="h-3 w-3 mr-2" />
                    Interested
                    {rsvpStatus === RSVPStatus.INTERESTED && <span className="ml-auto text-xs">✓</span>}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRSVP(RSVPStatus.NOT_GOING)}
                    className={cn(
                      "w-full justify-start",
                      rsvpStatus === RSVPStatus.NOT_GOING && "bg-red-50 text-red-700"
                    )}
                    disabled={loading}
                  >
                    <X className="h-3 w-3 mr-2" />
                    Not Going
                    {rsvpStatus === RSVPStatus.NOT_GOING && <span className="ml-auto text-xs">✓</span>}
                  </Button>
                  <hr />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCancel}
                    className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                    disabled={loading}
                  >
                    {loading ? <Loader2 className="h-3 w-3 mr-2 animate-spin" /> : null}
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
              className="hover:bg-green-50 hover:text-green-700 hover:border-green-300"
            >
              {loading ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : <Check className="h-3 w-3 mr-1" />}
              RSVP
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
        {/* Current RSVP Status Display */}
        {rsvpStatus && (
          <div className="p-3 rounded-lg bg-muted/50 border">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">Your RSVP:</span>
              <div className={cn(
                "flex items-center gap-1 font-medium",
                getStatusInfo(rsvpStatus).color
              )}>
                {React.createElement(getStatusInfo(rsvpStatus).icon, { className: "h-4 w-4" })}
                {getStatusInfo(rsvpStatus).label}
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-2">
          <Button
            variant={rsvpStatus === RSVPStatus.GOING ? 'default' : 'outline'}
            onClick={() => handleRSVP(RSVPStatus.GOING)}
            disabled={loading}
            className={cn(
              "flex-1",
              rsvpStatus === RSVPStatus.GOING && "bg-green-600 hover:bg-green-700"
            )}
          >
            {loading && rsvpStatus === RSVPStatus.GOING ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Check className="h-4 w-4 mr-2" />
            )}
            Going
            {rsvpStatus === RSVPStatus.GOING && <span className="ml-2 text-xs">✓ Current</span>}
          </Button>
          
          <Button
            variant={rsvpStatus === RSVPStatus.INTERESTED ? 'default' : 'outline'}
            onClick={() => handleRSVP(RSVPStatus.INTERESTED)}
            disabled={loading}
            className={cn(
              "flex-1",
              rsvpStatus === RSVPStatus.INTERESTED && "bg-yellow-600 hover:bg-yellow-700 text-white"
            )}
          >
            {loading && rsvpStatus === RSVPStatus.INTERESTED ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Clock className="h-4 w-4 mr-2" />
            )}
            Interested
            {rsvpStatus === RSVPStatus.INTERESTED && <span className="ml-2 text-xs">✓ Current</span>}
          </Button>
          
          <Button
            variant={rsvpStatus === RSVPStatus.NOT_GOING ? 'default' : 'outline'}
            onClick={() => handleRSVP(RSVPStatus.NOT_GOING)}
            disabled={loading}
            className={cn(
              "flex-1",
              rsvpStatus === RSVPStatus.NOT_GOING && "bg-red-600 hover:bg-red-700 text-white"
            )}
          >
            {loading && rsvpStatus === RSVPStatus.NOT_GOING ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <X className="h-4 w-4 mr-2" />
            )}
            Not Going
            {rsvpStatus === RSVPStatus.NOT_GOING && <span className="ml-2 text-xs">✓ Current</span>}
          </Button>
        </div>
        
        {rsvpStatus && (
          <Button
            variant="ghost"
            onClick={handleCancel}
            disabled={loading}
            className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
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