import { useQuery } from '@tanstack/react-query'
import { eventsApi, EventFilters } from '../api/events'


// Create a query keys file if it keeps getting complex, 
// for now define it here or imported if exists.
// Checking if we should follow existing pattern or make new one.
// Let's create a dedicated keys constant here for now to be safe.

export const eventKeys = {
  all: ['events'] as const,
  lists: () => [...eventKeys.all, 'list'] as const,
  list: (filters: EventFilters) => [...eventKeys.lists(), filters] as const,
  details: () => [...eventKeys.all, 'detail'] as const,
  detail: (id: string) => [...eventKeys.details(), id] as const,
}

export function useEvents(filters: EventFilters = {}) {
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    isFetching
  } = useQuery({
    queryKey: eventKeys.list(filters),
    queryFn: () => eventsApi.getEvents(filters),
    placeholderData: (prev) => prev, // Keep previous data while fetching new page
  })

  // Handle potential nested data structure from API response
  // structure: { data: { events: [], total: number } }
  const responseData = (data as any)?.data || data

  const events = responseData?.events ?? []
  const total = responseData?.total ?? 0
  const limit = filters.limit ?? 12
  const totalPages = Math.ceil(total / limit) || responseData?.pages || 0

  return {
    events,
    pagination: {
      page: filters.page ?? 1,
      total,
      pages: totalPages,
    },
    isLoading,
    isError,
    error,
    refetch,
    isFetching
  }
}
