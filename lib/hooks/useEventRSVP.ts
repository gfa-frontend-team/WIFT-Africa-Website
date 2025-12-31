import { useState } from 'react'
import { eventsApi } from '@/lib/api/events'
import { useAuth } from './useAuth'
import { useFeatureAccess } from './useFeatureAccess'
import type { RSVPStatus } from '@/types'
import { toast } from 'sonner'

export function useEventRSVP(eventId: string, currentRSVP?: RSVPStatus | null) {
  const [rsvpStatus, setRsvpStatus] = useState<RSVPStatus | null>(currentRSVP || null)
  const [loading, setLoading] = useState(false)
  const { isAuthenticated } = useAuth()
  const { access } = useFeatureAccess()

  const rsvp = async (status: RSVPStatus) => {
    if (!isAuthenticated || !access.canRSVPEvents) {
      toast.error('You need to be an approved member to RSVP to events')
      return
    }

    try {
      setLoading(true)
      await eventsApi.rsvpToEvent(eventId, { status })
      setRsvpStatus(status)
      toast.success(`RSVP updated to ${status.toLowerCase()}`)
    } catch (error) {
      toast.error('Failed to update RSVP')
      console.error('RSVP error:', error)
    } finally {
      setLoading(false)
    }
  }

  const cancelRSVP = async () => {
    if (!isAuthenticated) return

    try {
      setLoading(true)
      await eventsApi.cancelRSVP(eventId)
      setRsvpStatus(null)
      toast.success('RSVP cancelled')
    } catch (error) {
      toast.error('Failed to cancel RSVP')
      console.error('Cancel RSVP error:', error)
    } finally {
      setLoading(false)
    }
  }

  return {
    rsvpStatus,
    loading,
    rsvp,
    cancelRSVP,
    canRSVP: isAuthenticated && access.canRSVPEvents
  }
}