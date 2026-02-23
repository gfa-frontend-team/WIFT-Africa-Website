'use client'

import Avatar from '@/components/ui/Avatar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Event, EventStatus } from '@/types'
import { User, Users } from 'lucide-react'
import { RSVPControls } from './RSVPControls'
import { EventStatusBanner } from './EventStatusBanner'
import { useEventRSVP } from '@/lib/hooks/useEventRSVP'

interface EventContentProps {
  event: Event
}

export function EventContent({ event }: EventContentProps) {
  const eventId = event.id || event._id || ''
  const { rsvp, cancel, isPending } = useEventRSVP(eventId)
  
  const isCancelled = event.status === EventStatus.CANCELLED || event.isCancelled
  const isCompleted = event.status === EventStatus.COMPLETED
  const canRSVP = !isCancelled && !isCompleted

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
      {/* Main Content */}
      <div className="lg:col-span-2 space-y-8">
        {/* Status Banner */}
        <EventStatusBanner event={event} />
        
        <section>
          <h2 className="text-2xl font-semibold mb-4">About this Event</h2>
          <div className="prose max-w-none text-muted-foreground whitespace-pre-wrap">
            {event.description}
          </div>
        </section>

        {/* RSVP Action - Only show if event is not cancelled/completed */}
        {canRSVP && (
          <div className="p-4 border rounded-lg bg-card shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
               <div className="flex items-center gap-4">
                  <div className="bg-primary/10 p-2.5 rounded-full">
                     <User className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                     <h4 className="font-semibold">Are you attending?</h4>
                     <p className="text-sm text-muted-foreground">
                         {event.currentAttendees || 0} people are going
                     </p>
                  </div>
               </div>
               
               <RSVPControls 
                 event={event}
                 myRSVP={event.myRSVP || null}
                 onRSVP={rsvp}
                 onCancel={cancel}
                 isPending={isPending}
               />
          </div>
        )}
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        {/* Capacity Card */}
        {event.capacity && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Attendance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Going</span>
                <span className="font-medium">
                  {event.currentAttendees || 0} / {event.capacity}
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all"
                  style={{ 
                    width: `${Math.min(((event.currentAttendees || 0) / event.capacity) * 100, 100)}%` 
                  }}
                />
              </div>
              {event.capacity - (event.currentAttendees || 0) > 0 && !isCancelled ? (
                <p className="text-xs text-muted-foreground">
                  {event.capacity - (event.currentAttendees || 0)} spots remaining
                </p>
              ) : !isCancelled && (
                <p className="text-xs text-destructive font-medium">
                  Event is at capacity
                </p>
              )}
            </CardContent>
          </Card>
        )}
        
        {/* Organizer Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Organizer</CardTitle>
          </CardHeader>
          <CardContent>
             <div className="flex items-center gap-3">
                <Avatar 
                    src={event.organizer?.profilePhoto} 
                    name={event.organizer ? `${event.organizer.firstName} ${event.organizer.lastName}` : 'Unknown Organizer'}
                    size="md"
                />
                <div>
                    <div className="font-medium">
                        {event.organizer ? `${event.organizer.firstName} ${event.organizer.lastName}` : 'Unknown Organizer'}
                    </div>
                    {event.chapter && (
                        <div className="text-sm text-muted-foreground">
                            {event.chapter.name}
                        </div>
                    )}
                </div>
             </div>
          </CardContent>
        </Card>

        {/* Tags Card */}
        {event.tags && event.tags.length > 0 && (
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Tags</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap gap-2">
                        {event.tags.map(tag => (
                            <span key={tag} className="px-2.5 py-0.5 rounded-full bg-secondary text-xs font-medium text-secondary-foreground">
                                {tag}
                            </span>
                        ))}
                    </div>
                </CardContent>
            </Card>
        )}
      </div>
    </div>
  )
}
