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

  return {
    events: data?.events ?? [],
    pagination: {
      page: filters.page ?? 1,
      total: data?.total ?? 0,
      pages: data?.pages ?? 0,
    },
    isLoading,
    isError,
    error,
    refetch,
    isFetching
  }
}
