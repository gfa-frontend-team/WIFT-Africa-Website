import { useState, useEffect } from 'react'
import { eventsApi, type EventsListParams } from '@/lib/api/events'
import type { Event, EventsListResponse } from '@/types'

export function useEvents(params: EventsListParams = {}) {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState({
    page: 1,
    total: 0,
    pages: 0
  })

  const fetchEvents = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await eventsApi.listEvents(params)
      setEvents(response.events)
      setPagination({
        page: params.page || 1,
        total: response.total,
        pages: response.pages
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch events')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEvents()
  }, [JSON.stringify(params)])

  return {
    events,
    loading,
    error,
    pagination,
    refetch: fetchEvents
  }
}