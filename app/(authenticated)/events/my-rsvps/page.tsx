'use client'

import { useState } from 'react'
import { Calendar, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useMyEvents } from '@/lib/hooks/useMyEvents'
import { EventCard } from '@/components/events/EventCard'
import { EventsGridSkeleton } from '@/components/events/EventSkeleton'
import { RSVPStatus } from '@/types'
import Link from 'next/link'

export default function MyRSVPsPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'going' | 'interested'>('all')
  
  // Fetch based on active tab
  const statusFilter = activeTab === 'all' ? undefined : activeTab === 'going' ? RSVPStatus.GOING : RSVPStatus.INTERESTED
  const { data, isLoading, isError, error } = useMyEvents(statusFilter)

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col gap-6 mb-8">
        <Link href="/events">
          <Button variant="ghost" className="-ml-2">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to All Events
          </Button>
        </Link>
        
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Events</h1>
          <p className="text-muted-foreground mt-1">
            Events you've RSVP'd to
          </p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)} className="mb-8">
        <TabsList>
          <TabsTrigger value="all">
            All ({data?.total ?? 0})
          </TabsTrigger>
          <TabsTrigger value="going">
            Going ({data?.going ?? 0})
          </TabsTrigger>
          <TabsTrigger value="interested">
            Interested ({data?.interested ?? 0})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {/* Loading State */}
          {isLoading && <EventsGridSkeleton />}

          {/* Error State */}
          {isError && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="bg-destructive/10 p-4 rounded-full mb-4">
                <Calendar className="h-8 w-8 text-destructive" />
              </div>
              <h3 className="text-lg font-semibold">Error loading events</h3>
              <p className="text-muted-foreground my-2 max-w-md">
                {error instanceof Error ? error.message : "Something went wrong while fetching your events."}
              </p>
              <Button onClick={() => window.location.reload()}>Retry</Button>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && !isError && (!data?.events || data.events.length === 0) && (
            <div className="flex flex-col items-center justify-center py-16 text-center border rounded-lg bg-muted/20">
              <Calendar className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-semibold">
                {activeTab === 'all' && "No RSVP'd events yet"}
                {activeTab === 'going' && "No events you're going to"}
                {activeTab === 'interested' && "No events you're interested in"}
              </h3>
              <p className="text-muted-foreground mt-1 mb-4">
                Browse events and RSVP to see them here
              </p>
              <Link href="/events">
                <Button>Browse Events</Button>
              </Link>
            </div>
          )}

          {/* Events Grid */}
          {!isLoading && !isError && data?.events && data.events.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.events.map((event) => (
                <EventCard key={event.id || event._id} event={event} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
