'use client'

import { useState } from 'react'
import { Calendar, Grid, List } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { EventCard } from '@/components/events/EventCard'
import { EventFilters } from '@/components/events/EventFilters'
import { EventSkeleton } from '@/components/events/EventSkeleton'
import FeatureGate from '@/components/access/FeatureGate'
import { useEvents } from '@/lib/hooks/useEvents'
import type { EventType } from '@/types'

export default function EventsPage() {
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const [filters, setFilters] = useState<{
    search?: string
    type?: EventType
    chapterId?: string
    startDate?: string
    endDate?: string
    page?: number
  }>({})

  const { events, loading, error, pagination } = useEvents({
    ...filters,
    limit: 12
  })

  return (
    <FeatureGate feature="canViewEvents">
      <div className="max-w-screen-xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Events</h1>
            <p className="text-muted-foreground mt-1">
              Discover networking events, workshops, screenings, and industry gatherings
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant={view === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setView('grid')}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={view === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setView('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6">
          <EventFilters onFiltersChange={setFilters} />
        </div>

        {/* Content */}
        {error ? (
          <div className="bg-card border border-border rounded-lg p-12 text-center">
            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">
              Unable to load events
            </h2>
            <p className="text-muted-foreground">
              {error}
            </p>
          </div>
        ) : loading ? (
          <div className={view === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
            : 'space-y-4'
          }>
            <EventSkeleton count={6} />
          </div>
        ) : events.length === 0 ? (
          <div className="bg-card border border-border rounded-lg p-12 text-center">
            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">
              No events found
            </h2>
            <p className="text-muted-foreground">
              {Object.keys(filters).length > 0 
                ? 'Try adjusting your filters to see more events.'
                : 'Check back soon for upcoming events and activities.'
              }
            </p>
          </div>
        ) : (
          <>
            {/* Events Grid/List */}
            <div className={view === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
              : 'space-y-4'
            }>
              {events.map((event) => (
                <EventCard 
                  key={event.id} 
                  event={event} 
                  compact={view === 'list'}
                />
              ))}
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex justify-center mt-8">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    disabled={pagination.page === 1}
                    onClick={() => setFilters(prev => ({ ...prev, page: pagination.page - 1 }))}
                  >
                    Previous
                  </Button>
                  
                  <span className="text-sm text-muted-foreground px-4">
                    Page {pagination.page} of {pagination.pages}
                  </span>
                  
                  <Button
                    variant="outline"
                    disabled={pagination.page === pagination.pages}
                    onClick={() => setFilters(prev => ({ ...prev, page: pagination.page + 1 }))}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </FeatureGate>
  )
}
