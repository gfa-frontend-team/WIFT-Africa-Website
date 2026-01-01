'use client'

import { useState } from 'react'
import { CalendarIcon, Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useEvents } from '@/lib/hooks/useEvents'
import { EventCard } from '@/components/events/EventCard'
import { EventsGridSkeleton } from '@/components/events/EventSkeleton'

export default function EventsPage() {
  const [page, setPage] = useState(1)
  const { events, pagination, isLoading, isError, error } = useEvents({ 
    page, 
    limit: 12,
    status: 'PUBLISHED' // Only show published events
  })

  const handlePrevious = () => {
    if (page > 1) setPage(p => p - 1)
  }

  const handleNext = () => {
    if (page < pagination.pages) setPage(p => p + 1)
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Events</h1>
          <p className="text-muted-foreground mt-1">
            Discover workshops, screenings, and networking opportunities.
          </p>
        </div>
        <div className="flex items-center gap-2">
           <Button variant="outline" size="sm" className="hidden md:flex">
             <CalendarIcon className="mr-2 h-4 w-4" />
             Calendar View
           </Button>
           <Button variant="outline" size="sm">
             <Filter className="mr-2 h-4 w-4" />
             Filter
           </Button>
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <EventsGridSkeleton />
      ) : isError ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="bg-destructive/10 p-4 rounded-full mb-4">
                <Filter className="h-8 w-8 text-destructive" />
            </div>
            <h3 className="text-lg font-semibold">Error loading events</h3>
            <p className="text-muted-foreground my-2 max-w-md">
                {error?.message || "Something went wrong while fetching events. Please try again later."}
            </p>
            <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      ) : events.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center border rounded-lg bg-muted/20">
            <CalendarIcon className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-semibold">No events found</h3>
            <p className="text-muted-foreground mt-1">
                There are currently no upcoming events found. Check back later!
            </p>
        </div>
      ) : (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
                <EventCard key={event.id} event={event} />
            ))}
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8">
                    <Button 
                        variant="outline" 
                        onClick={handlePrevious} 
                        disabled={page === 1}
                    >
                        Previous
                    </Button>
                    <span className="text-sm font-medium">
                        Page {pagination.page} of {pagination.pages}
                    </span>
                    <Button 
                        variant="outline" 
                        onClick={handleNext} 
                        disabled={page === pagination.pages}
                    >
                        Next
                    </Button>
                </div>
            )}
        </div>
      )}
    </div>
  )
}
