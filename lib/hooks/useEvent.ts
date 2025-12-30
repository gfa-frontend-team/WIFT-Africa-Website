import { useState, useEffect } from 'react'
import { eventsApi } from '@/lib/api/events'
import type { Event } from '@/types'

export function useEvent(eventId: string) {
  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true)
        setError(null)
        const eventData = await eventsApi.getEvent(eventId)
        setEvent(eventData)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch event')
      } finally {
        setLoading(false)
      }
    }

    if (eventId) {
      fetchEvent()
    }
  }, [eventId])

  const refetch = async () => {
    if (eventId) {
      try {
        setLoading(true)
        const eventData = await eventsApi.getEvent(eventId)
        setEvent(eventData)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch event')
      } finally {
        setLoading(false)
      }
    }
  }

  return { event, loading, error, refetch }
}