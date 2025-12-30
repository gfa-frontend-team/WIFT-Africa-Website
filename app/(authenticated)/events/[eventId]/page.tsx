'use client'

import { useParams } from 'next/navigation'
import { Calendar, MapPin, Users, Clock, ArrowLeft, Share2, ExternalLink } from 'lucide-react'
import { format } from 'date-fns'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { EventTypeBadge } from '@/components/events/EventTypeBadge'
import { RSVPControls } from '@/components/events/RSVPControls'
import FeatureGate from '@/components/access/FeatureGate'
import { useEvent } from '@/lib/hooks/useEvent'
import { LocationType } from '@/types'

export default function EventDetailsPage() {
  const params = useParams()
  const eventId = params.eventId as string
  const { event, loading, error } = useEvent(eventId)

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-32 bg-muted rounded" />
          <div className="aspect-video w-full bg-muted rounded-lg" />
          <div className="space-y-4">
            <div className="h-8 w-3/4 bg-muted rounded" />
            <div className="h-4 w-1/2 bg-muted rounded" />
            <div className="h-20 w-full bg-muted rounded" />
          </div>
        </div>
      </div>
    )
  }

  if (error || !event) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="bg-card border border-border rounded-lg p-12 text-center">
          <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-foreground mb-2">
            Event not found
          </h2>
          <p className="text-muted-foreground mb-4">
            {error || 'The event you\'re looking for doesn\'t exist or has been removed.'}
          </p>
          <Link href="/events">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Events
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const startDate = new Date(event.startDate)
  const endDate = new Date(event.endDate)
  const isMultiDay = format(startDate, 'yyyy-MM-dd') !== format(endDate, 'yyyy-MM-dd')

  return (
    <FeatureGate feature="canViewEvents">
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Back Button */}
        <div className="mb-6">
          <Link href="/events">
            <Button variant="ghost" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Events
            </Button>
          </Link>
        </div>

        {/* Event Header */}
        <div className="space-y-6">
          {/* Cover Image */}
          {event.coverImage && (
            <div className="aspect-video w-full overflow-hidden rounded-lg">
              <img
                src={event.coverImage}
                alt={event.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Title and Meta */}
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-3">
                  <EventTypeBadge type={event.type} />
                  <span className="text-muted-foreground">
                    {event.chapter.name}
                  </span>
                </div>
                
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  {event.title}
                </h1>
                
                <p className="text-muted-foreground">
                  Organized by {event.organizer.firstName} {event.organizer.lastName}
                </p>
              </div>
              
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>

            {/* Event Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column - Event Info */}
              <div className="space-y-6">
                <Card className="p-6">
                  <h3 className="font-semibold mb-4">Event Details</h3>
                  <div className="space-y-4">
                    {/* Date & Time */}
                    <div className="flex items-start gap-3">
                      <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <div className="font-medium">
                          {format(startDate, 'EEEE, MMMM d, yyyy')}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {format(startDate, 'h:mm a')} - {format(endDate, 'h:mm a')}
                          {isMultiDay && ` (ends ${format(endDate, 'MMM d')})`}
                        </div>
                        {event.timezone && (
                          <div className="text-xs text-muted-foreground">
                            {event.timezone}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Location */}
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <div className="font-medium">
                          {event.location.type === LocationType.VIRTUAL ? 'Virtual Event' :
                           event.location.type === LocationType.HYBRID ? 'Hybrid Event' :
                           'In-Person Event'}
                        </div>
                        {event.location.address && (
                          <div className="text-sm text-muted-foreground">
                            {event.location.address}
                          </div>
                        )}
                        {event.location.city && (
                          <div className="text-sm text-muted-foreground">
                            {event.location.city}, {event.location.country}
                          </div>
                        )}
                        {event.location.virtualLink && (
                          <div className="mt-2">
                            <Button variant="outline" size="sm" asChild>
                              <a href={event.location.virtualLink} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-3 w-3 mr-2" />
                                Join Virtual Event
                              </a>
                            </Button>
                          </div>
                        )}
                        {event.location.instructions && (
                          <div className="text-sm text-muted-foreground mt-1">
                            {event.location.instructions}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Capacity */}
                    {event.capacity && (
                      <div className="flex items-center gap-3">
                        <Users className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <div className="font-medium">
                            {event.currentAttendees} / {event.capacity} attending
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {event.capacity - event.currentAttendees} spots remaining
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </Card>

                {/* Tags */}
                {event.tags && event.tags.length > 0 && (
                  <Card className="p-6">
                    <h3 className="font-semibold mb-3">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {event.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-muted text-muted-foreground text-sm rounded-md"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </Card>
                )}
              </div>

              {/* Right Column - Description & RSVP */}
              <div className="space-y-6">
                <Card className="p-6">
                  <h3 className="font-semibold mb-4">About This Event</h3>
                  <div className="prose prose-sm max-w-none">
                    <p className="text-muted-foreground whitespace-pre-wrap">
                      {event.description}
                    </p>
                  </div>
                </Card>

                {/* RSVP Controls */}
                <Card className="p-6">
                  <h3 className="font-semibold mb-4">RSVP</h3>
                  <RSVPControls 
                    eventId={event.id} 
                    currentRSVP={event.myRSVP}
                  />
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </FeatureGate>
  )
}