import { useMutation, useQueryClient } from '@tanstack/react-query'
import { eventsApi } from '../api/events'
import { eventKeys } from './useEvents'
import { RSVPStatus, Event } from '@/types'
import { toast } from 'sonner'

export function useEventRSVP(eventId: string) {
  const queryClient = useQueryClient()

  const rsvpMutation = useMutation({
    mutationFn: (status: RSVPStatus) => {
      // Validate status is only GOING or INTERESTED
      if (status !== RSVPStatus.GOING && status !== RSVPStatus.INTERESTED) {
        throw new Error('Invalid RSVP status. Use GOING or INTERESTED.')
      }
      return eventsApi.rsvpEvent(eventId, status)
    },
    onMutate: async (newStatus) => {
      // Cancel refetches to avoid overwriting optimism
      await queryClient.cancelQueries({ queryKey: eventKeys.detail(eventId) })
      await queryClient.cancelQueries({ queryKey: eventKeys.lists() })

      // Snapshot previous data
      const previousEvent = queryClient.getQueryData<Event>(eventKeys.detail(eventId))

      // Optimistic update for single event details
      if (previousEvent) {
        queryClient.setQueryData<Event>(eventKeys.detail(eventId), (old) => {
            if (!old) return old
            
            // Calculate attendance change
            const wasGoing = old.myRSVP === RSVPStatus.GOING
            const isNowGoing = newStatus === RSVPStatus.GOING
            
            let attendeesDelta = 0
            if (wasGoing && !isNowGoing) attendeesDelta = -1  // GOING → INTERESTED
            if (!wasGoing && isNowGoing) attendeesDelta = 1   // INTERESTED → GOING or null → GOING
            
            return {
                ...old,
                myRSVP: newStatus,
                currentAttendees: Math.max(0, (old.currentAttendees || 0) + attendeesDelta)
            }
        })
      }

      return { previousEvent }
    },
    onError: (err, newStatus, context) => {
      // Rollback
      if (context?.previousEvent) {
        queryClient.setQueryData(eventKeys.detail(eventId), context.previousEvent)
      }
      toast.error("Failed to update RSVP. Please try again.")
    },
    onSuccess: (data, newStatus) => {
      const messages = {
        [RSVPStatus.GOING]: "You're going to this event!",
        [RSVPStatus.INTERESTED]: "Added to your interested events."
      }
      toast.success(messages[newStatus] || "RSVP updated successfully")
      
      // Invalidate to ensure sync
      queryClient.invalidateQueries({ queryKey: eventKeys.detail(eventId) })
      queryClient.invalidateQueries({ queryKey: eventKeys.lists() })
      queryClient.invalidateQueries({ queryKey: ['my-events-count'] })
    }
  })

  // Cancel RSVP Mutation
  const cancelRsvpMutation = useMutation({
    mutationFn: () => eventsApi.cancelRsvp(eventId),
    onMutate: async () => {
       await queryClient.cancelQueries({ queryKey: eventKeys.detail(eventId) })
       const previousEvent = queryClient.getQueryData<Event>(eventKeys.detail(eventId))
       
       if (previousEvent) {
         queryClient.setQueryData<Event>(eventKeys.detail(eventId), (old) => {
            if (!old) return old
             const wasGoing = old.myRSVP === RSVPStatus.GOING
             return {
                 ...old,
                 myRSVP: null,
                 currentAttendees: Math.max(0, (old.currentAttendees || 0) - (wasGoing ? 1 : 0))
             }
         })
       }
       return { previousEvent }
    },
    onError: (err, _, context) => {
        if (context?.previousEvent) {
            queryClient.setQueryData(eventKeys.detail(eventId), context.previousEvent)
        }
        toast.error("Failed to cancel RSVP")
    },
    onSuccess: () => {
        toast.success("RSVP cancelled")
        queryClient.invalidateQueries({ queryKey: eventKeys.detail(eventId) })
        queryClient.invalidateQueries({ queryKey: eventKeys.lists() })
        queryClient.invalidateQueries({ queryKey: ['my-events-count'] })
    }
  })

  return {
    rsvp: rsvpMutation.mutate,
    cancel: cancelRsvpMutation.mutate,
    isPending: rsvpMutation.isPending || cancelRsvpMutation.isPending
  }
}
