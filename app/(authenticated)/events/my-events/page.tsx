'use client'

import { useState } from 'react'
import { Calendar, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { EventCard } from '@/components/events/EventCard'
import { EventSkeleton } from '@/components/events/EventSkeleton'
import FeatureGate from '@/components/access/FeatureGate'
import { useEvents } from '@/lib/hooks/useEvents'
import { RSVPStatus } from '@/types'

export default function MyEventsPage() {
  const [filter, setFilter] = useState<'all' | 'going' | 'interested'>('all')
  
  // For now, we'll use the regular events endpoint
  // In a real implementation, this would be a separate endpoint for user's events
  const { events, loading, error } = useEvents({
    // This would be filtered by user's RSVPs on the backend
    limit: 50
  })

  // Filter events based on user's RSVP status
  const filteredEvents = events.filter(event => {
    if (!event.myRSVP) return false
    
    switch (filter) {
      case 'going':
        return event.myRSVP === RSVPStatus.GOING
      case 'interested':
        return event.myRSVP === RSVPStatus.INTERESTED
      default:
        return true
    }
  })

  const goingCount = events.filter(e => e.myRSVP === RSVPStatus.GOING).length
  const interestedCount = events.filter(e => e.myRSVP === RSVPStatus.INTERESTED).length

  return (
    <FeatureGate feature="canViewEvents">
      <div className="max-w-screen-xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <Link href="/events">
            <Button variant="ghost" className="flex items-center gap-2 mb-4">
              <ArrowLeft className="h-4 w-4" />
              Back to All Events
            </Button>
          </Link>
          
          <div>
            <h1 className="text-3xl font-bold text-foreground">My Events</h1>
            <p className="text-muted-foreground mt-1">
              Events you've RSVP'd to and your attendance history
            </p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            onClick={() => setFilter('all')}
          >
            All RSVPs ({goingCount + interestedCount})
          </Button>
          <Button
            variant={filter === 'going' ? 'default' : 'outline'}
            onClick={() => setFilter('going')}
          >
            Going ({goingCount})
          </Button>
          <Button
            variant={filter === 'interested' ? 'default' : 'outline'}
            onClick={() => setFilter('interested')}
          >
            Interested ({interestedCount})
          </Button>
        </div>

        {/* Content */}
        {error ? (
          <div className="bg-card border border-border rounded-lg p-12 text-center">
            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">
              Unable to load your events
            </h2>
            <p className="text-muted-foreground">
              {error}
            </p>
          </div>
        ) : loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <EventSkeleton count={6} />
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="bg-card border border-border rounded-lg p-12 text-center">
            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">
              {filter === 'all' ? 'No events yet' : 
               filter === 'going' ? 'No events you\'re going to' :
               'No events you\'re interested in'}
            </h2>
            <p className="text-muted-foreground mb-4">
              {filter === 'all' 
                ? 'Start exploring events and RSVP to see them here.'
                : 'RSVP to events to see them in this category.'
              }
            </p>
            <Link href="/events">
              <Button>
                Explore Events
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <EventCard 
                key={event.id} 
                event={event}
                showRSVP={true}
              />
            ))}
          </div>
        )}
      </div>
    </FeatureGate>
  )
}