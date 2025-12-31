'use client'

import { Calendar, MapPin, Users, Clock } from 'lucide-react'
import { format } from 'date-fns'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { EventTypeBadge } from './EventTypeBadge'
import { RSVPControls } from './RSVPControls'
import type { Event } from '@/types'
import Link from 'next/link'

interface EventCardProps {
  event: Event
  showRSVP?: boolean
  compact?: boolean
}

export function EventCard({ event, showRSVP = true, compact = false }: EventCardProps) {
  const startDate = new Date(event.startDate)
  const endDate = new Date(event.endDate)
  
  // Helper function to get RSVP status info
  const getRSVPStatusInfo = () => {
    if (!event.myRSVP) return null
    
    switch (event.myRSVP) {
      case 'GOING':
        return { label: 'Going', color: 'bg-green-100 text-green-800 border-green-200', icon: '✓' }
      case 'INTERESTED':
        return { label: 'Interested', color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: '🕐' }
      case 'NOT_GOING':
        return { label: 'Not Going', color: 'bg-red-100 text-red-800 border-red-200', icon: '✗' }
      default:
        return null
    }
  }

  const rsvpInfo = getRSVPStatusInfo()
  
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow relative">
      {/* RSVP Status Badge */}
      {rsvpInfo && (
        <div className="absolute top-3 right-3 z-10">
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${rsvpInfo.color}`}>
            <span className="mr-1">{rsvpInfo.icon}</span>
            {rsvpInfo.label}
          </span>
        </div>
      )}
      
      {event.coverImage && (
        <div className="aspect-video w-full overflow-hidden">
          <img
            src={event.coverImage}
            alt={event.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      <div className="p-4">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <EventTypeBadge type={event.type} />
              <span className="text-sm text-muted-foreground">
                {event.chapter?.name || 'Unknown Chapter'}
              </span>
            </div>
            
            <Link href={`/events/${event.id}`}>
              <h3 className="font-semibold text-lg leading-tight hover:text-primary transition-colors line-clamp-2">
                {event.title}
              </h3>
            </Link>
          </div>
        </div>

        {!compact && (
          <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
            {event.description}
          </p>
        )}

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>
              {format(startDate, 'MMM d, yyyy')}
              {format(startDate, 'HH:mm') !== '00:00' && (
                <span> at {format(startDate, 'h:mm a')}</span>
              )}
            </span>
          </div>

          {event.startDate !== event.endDate && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>
                Ends {format(endDate, 'MMM d')} at {format(endDate, 'h:mm a')}
              </span>
            </div>
          )}

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>
              {event.location.type === 'VIRTUAL' ? 'Virtual Event' : 
               event.location.city ? `${event.location.city}, ${event.location.country}` :
               event.location.country || 'Location TBD'}
            </span>
          </div>

          {event.capacity && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>
                {event.currentAttendees || 0} / {event.capacity} attending
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            by {event.organizer?.firstName || 'Unknown'} {event.organizer?.lastName || 'Organizer'}
          </div>
          
          {showRSVP && (
            <RSVPControls 
              eventId={event.id || event._id} 
              currentRSVP={event.myRSVP}
              compact={true}
            />
          )}
        </div>
      </div>
    </Card>
  )
}