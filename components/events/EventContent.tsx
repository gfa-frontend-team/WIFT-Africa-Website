'use client'

import Avatar from '@/components/ui/Avatar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Event } from '@/types'
import { User } from 'lucide-react'
import { RSVPControls } from './RSVPControls'

interface EventContentProps {
  event: Event
}

export function EventContent({ event }: EventContentProps) {
  const organizerInitials = event.organizer 
    ? `${event.organizer.firstName[0]}${event.organizer.lastName[0]}`
    : 'Or'
  const eventId = event.id || event._id || ''

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
      {/* Main Content */}
      <div className="lg:col-span-2 space-y-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4">About this Event</h2>
          <div className="prose max-w-none text-muted-foreground whitespace-pre-wrap">
            {event.description}
          </div>
        </section>

        {/* RSVP Action */}
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
               eventId={eventId}
               currentStatus={event.myRSVP || null}
               isCancelled={event.status === 'CANCELLED'}
               isFull={event.capacity ? (event.currentAttendees || 0) >= event.capacity : false}
             />
        </div>
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
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
