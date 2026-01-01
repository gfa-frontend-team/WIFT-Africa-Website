import { useQuery } from '@tanstack/react-query'
import { eventsApi } from '../api/events'
import { eventKeys } from './useEvents'

export function useEvent(id: string) {
  const {
    data: event,
    isLoading,
    isError,
    error,
    refetch
  } = useQuery({
    queryKey: eventKeys.detail(id),
    queryFn: () => eventsApi.getEvent(id),
    enabled: !!id, // Only fetch if ID is present
  })

  return {
    event,
    isLoading,
    isError,
    error,
    refetch,
  }
}
