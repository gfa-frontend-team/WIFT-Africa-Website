import { useQuery } from '@tanstack/react-query'
import { eventsApi } from '../api/events'
import { RSVPStatus } from '@/types'

/**
 * Hook to get count of user's RSVP'd events
 * Uses the optimized backend endpoint for efficient counting
 */
export function useMyEventsCount() {
  return useQuery({
    queryKey: ['my-events-count'],
    queryFn: () => eventsApi.getMyRSVPs(true), // countOnly=true
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  })
}

/**
 * Hook to get user's RSVP'd events (full list)
 * @param status - Optional filter by RSVP status (GOING or INTERESTED)
 */
export function useMyEvents(status?: RSVPStatus) {
  return useQuery({
    queryKey: ['my-events', status],
    queryFn: () => eventsApi.getMyRSVPs(false, status), // countOnly=false
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  })
}
