import { useMutation, useQueryClient } from '@tanstack/react-query'
import { eventsApi } from '../api/events'
import { eventKeys } from './useEvents'
import { RSVPStatus, Event } from '@/types'
import { toast } from 'sonner'

export function useEventRSVP(eventId: string) {
  const queryClient = useQueryClient()

  const rsvpMutation = useMutation({
    mutationFn: (status: RSVPStatus) => eventsApi.rsvpEvent(eventId, status),
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
            const isLeaving = newStatus === RSVPStatus.NOT_GOING
            const wasGoing = old.myRSVP === RSVPStatus.GOING
            const isNowGoing = newStatus === RSVPStatus.GOING
            
            let attendeesDelta = 0
            if (wasGoing && !isNowGoing) attendeesDelta = -1
            if (!wasGoing && isNowGoing) attendeesDelta = 1
            
            return {
                ...old,
                myRSVP: newStatus,
                currentAttendees: (old.currentAttendees || 0) + attendeesDelta
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
        [RSVPStatus.INTERESTED]: "Added to your interested events.",
        [RSVPStatus.NOT_GOING]: "RSVP removed."
      }
      toast.success(messages[newStatus] || "RSVP updated successfully")
      
      // Invalidate to ensure sync
      queryClient.invalidateQueries({ queryKey: eventKeys.detail(eventId) })
      queryClient.invalidateQueries({ queryKey: eventKeys.lists() })
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
    }
  })

  return {
    rsvp: rsvpMutation.mutate,
    cancel: cancelRsvpMutation.mutate,
    isPending: rsvpMutation.isPending || cancelRsvpMutation.isPending
  }
}
