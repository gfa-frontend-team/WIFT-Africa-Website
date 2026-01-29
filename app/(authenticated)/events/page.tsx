'use client'

import { useState } from 'react'
import { CalendarIcon, Filter, List } from 'lucide-react'
import { format, startOfMonth, endOfMonth, addMonths, eachMonthOfInterval } from 'date-fns'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useEvents } from '@/lib/hooks/useEvents'
import { useOnboarding } from '@/lib/hooks/useOnboarding' // Reusing to fetch chapters
import { EventCard } from '@/components/events/EventCard'
import { EventsGridSkeleton } from '@/components/events/EventSkeleton'
import { CalendarView } from '@/components/events/CalendarView'
import { Event } from '@/types'

export default function EventsPage() {
  const [page, setPage] = useState(1)
  const [view, setView] = useState<'list' | 'calendar'>('list')

  // Filtering
  const [selectedMonth, setSelectedMonth] = useState<Date | null>(new Date()) // Current month by default
  const [selectedChapterId, setSelectedChapterId] = useState<string>('all')

  // Generate next 12 months for the filter
  const monthOptions = eachMonthOfInterval({
    start: new Date(),
    end: addMonths(new Date(), 11)
  })

  // Calculate month and year for filter (if not ALL)
  const month = selectedMonth ? selectedMonth.getMonth() + 1 : undefined
  const year = selectedMonth ? selectedMonth.getFullYear() : undefined

  // Get filter chapters
  const { chapters } = useOnboarding() // Using this existing hook to get chapter list

  const { events, pagination, isLoading, isError, error } = useEvents({
    page,
    limit: 100, // Increase limit to show more events
    status: 'PUBLISHED',
    month,
    year,
    chapterId: selectedChapterId !== 'all' ? selectedChapterId : undefined
  })

  const handlePrevious = () => {
    if (page > 1) setPage(p => p - 1)
  }

  const handleNext = () => {
    if (page < pagination.pages) setPage(p => p + 1)
  }

  const handleMonthChange = (value: string) => {
    if (value === 'all') {
      setSelectedMonth(null)
    } else {
      setSelectedMonth(new Date(value))
    }
    setPage(1) // Reset to first page on month change
  }

  // Group events by chapter
  const groupedEvents = (events as Event[]).reduce<Record<string, Event[]>>((acc, event) => {
    // Check chapter (normalized) or chapterId (raw from API)
    // We cast to any to handle the raw data structure difference
    const chapterName = event.chapter?.name || (event as any).chapterId?.name || 'General Events'
    if (!acc[chapterName]) {
      acc[chapterName] = []
    }
    acc[chapterName].push(event)
    return acc
  }, {})

  // Sort chapter names to ensure consistent order (General Events last if desired, or alphabetical)
  const sortedChapterNames = Object.keys(groupedEvents).sort((a, b) => {
    if (a === 'General Events') return 1
    if (b === 'General Events') return -1
    return a.localeCompare(b)
  })

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header & Controls */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Events</h1>
          <p className="text-muted-foreground mt-1">
            Discover workshops, screenings, and networking opportunities.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          {/* Chapter Filter */}
          <div className="w-full sm:w-[200px]">
            <Select
              value={selectedChapterId}
              onValueChange={setSelectedChapterId}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Chapters" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Chapters</SelectItem>
                {chapters?.map((chapter) => (
                  <SelectItem key={chapter.id} value={chapter.id}>
                    {chapter.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Month Filter */}
          <div className="w-full sm:w-[200px]">
            <Select
              value={selectedMonth ? selectedMonth.toISOString() : 'all'}
              onValueChange={handleMonthChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Month" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Upcoming</SelectItem>
                {monthOptions.map((date) => (
                  <SelectItem key={date.toISOString()} value={date.toISOString()}>
                    {format(date, 'MMMM yyyy')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            variant={view === 'calendar' ? 'default' : 'outline'}
            className="flex-1 sm:flex-none"
            onClick={() => setView(view === 'list' ? 'calendar' : 'list')}
          >
            {view === 'list' ? (
              <>
                <CalendarIcon className="mr-2 h-4 w-4" />
                Calendar View
              </>
            ) : (
              <>
                <List className="mr-2 h-4 w-4" />
                List View
              </>
            )}
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
          <h3 className="text-lg font-semibold">
            {selectedMonth
              ? `No events found for ${format(selectedMonth, 'MMMM yyyy')}`
              : 'No upcoming events found'}
          </h3>
          <p className="text-muted-foreground mt-1">
            There are currently no upcoming events scheduled for this month.
          </p>
        </div>
      ) : view === 'calendar' ? (
        <CalendarView events={events as Event[]} currentMonth={selectedMonth || new Date()} />
      ) : (
        <div className="space-y-12">
          {sortedChapterNames.map((chapterName) => (
            <section key={chapterName} className="space-y-6">
              <div className="flex items-center gap-4">
                <h2 className="text-2xl font-bold text-primary">{chapterName}</h2>
                <div className="h-px bg-border flex-1" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {groupedEvents[chapterName].map((event) => (
                  <EventCard key={event.id || (event as any)._id} event={event} />
                ))}
              </div>
            </section>
          ))}

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8 pt-8 border-t">
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
