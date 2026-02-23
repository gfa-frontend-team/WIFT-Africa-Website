'use client'

import { XCircle, CheckCircle } from 'lucide-react'
import { format } from 'date-fns'
import { Event, EventStatus } from '@/types'

interface EventStatusBannerProps {
  event: Event
}

export function EventStatusBanner({ event }: EventStatusBannerProps) {
  if (event.status === EventStatus.CANCELLED || event.isCancelled) {
    return (
      <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <XCircle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-destructive mb-1">
              This event has been cancelled
            </h3>
            {event.cancellationReason && (
              <p className="text-sm text-muted-foreground">
                {event.cancellationReason}
              </p>
            )}
          </div>
        </div>
      </div>
    )
  }
  
  if (event.status === EventStatus.COMPLETED) {
    return (
      <div className="bg-muted border border-border rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <CheckCircle className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-foreground mb-1">
              This event has ended
            </h3>
            <p className="text-sm text-muted-foreground">
              This event took place on {format(new Date(event.startDate), 'MMMM d, yyyy')}
            </p>
          </div>
        </div>
      </div>
    )
  }
  
  return null
}
