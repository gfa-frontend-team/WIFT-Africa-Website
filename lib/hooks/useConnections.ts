'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { connectionsApi, type ConnectionRequest, type ConnectionStats } from '../api/connections'
import { useAuth } from './useAuth'

// Query keys
export const connectionKeys = {
  all: ['connections'] as const,
  requests: (type: string) => [...connectionKeys.all, 'requests', type] as const,
  stats: () => [...connectionKeys.all, 'stats'] as const,
  status: (userId: string) => [...connectionKeys.all, 'status', userId] as const,
}

export function useConnections() {
  const queryClient = useQueryClient()

  // Queries
  const useRequests = (type: 'incoming' | 'outgoing' | 'all' = 'all') => useQuery({
    queryKey: connectionKeys.requests(type),
    queryFn: () => connectionsApi.getRequests(type),
    staleTime: 1000 * 60, // 1 minute
    enabled: typeof window !== 'undefined' && !!localStorage.getItem('accessToken'),
  })

  const useStats = () => useQuery({
    queryKey: connectionKeys.stats(),
    queryFn: () => connectionsApi.getStats(),
    staleTime: 1000 * 60, // 1 minute
    refetchInterval: 1000 * 60 * 2, // Auto-refetch every 2 mins
    enabled: typeof window !== 'undefined' && !!localStorage.getItem('accessToken'),
  })

  // Mutations
  const sendRequestMutation = useMutation({
    mutationFn: ({ receiverId, message }: { receiverId: string; message?: string }) =>
      connectionsApi.sendRequest(receiverId, message),
    onSuccess: (data, variables) => {
      // Invalidate outgoing requests and stats
      queryClient.invalidateQueries({ queryKey: connectionKeys.requests('outgoing') })
      queryClient.invalidateQueries({ queryKey: connectionKeys.requests('all') })
      queryClient.invalidateQueries({ queryKey: connectionKeys.stats() })
      // Invalidate status for specific user
      queryClient.invalidateQueries({ queryKey: connectionKeys.status(variables.receiverId) })
      // Invalidate search queries to update connectionStatus in search results
      queryClient.invalidateQueries({ queryKey: ['search'] })
    },
  })

  const respondMutation = useMutation({
    mutationFn: ({ requestId, action, reason }: { requestId: string; action: 'accept' | 'decline' | 'cancel'; reason?: string }) =>
      connectionsApi.respondToRequest(requestId, action, reason),
    onSuccess: () => {
      // Invalidate all requests and stats as counts change
      queryClient.invalidateQueries({ queryKey: connectionKeys.requests('incoming') })
      queryClient.invalidateQueries({ queryKey: connectionKeys.requests('outgoing') })
      queryClient.invalidateQueries({ queryKey: connectionKeys.requests('all') })
      queryClient.invalidateQueries({ queryKey: connectionKeys.stats() })
    },
  })

  const removeConnectionMutation = useMutation({
    mutationFn: (connectionId: string) => connectionsApi.removeConnection(connectionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: connectionKeys.stats() })
      // We might want to invalidate feed or other things too, but definitely stats
    },
  })

  const useConnectionStatus = (userId?: string) => useQuery({
    queryKey: userId ? connectionKeys.status(userId) : [],
    queryFn: () => connectionsApi.checkStatus(userId!),
    enabled: !!userId && typeof window !== 'undefined' && !!localStorage.getItem('accessToken'),
    staleTime: 1000 * 60, // 1 minute
  })

  return {
    // Hooks for components to use
    useRequests,
    useStats,
    useConnectionStatus,
    useMyConnections: (page = 1) => useQuery({
      queryKey: [...connectionKeys.all, 'list', page],
      queryFn: () => connectionsApi.getConnections(page),
      staleTime: 1000 * 60 * 5, // 5 mins
      enabled: typeof window !== 'undefined' && !!localStorage.getItem('accessToken'),
    }),

    // Actions (Mutations)
    sendRequest: (receiverId: string, message?: string) => sendRequestMutation.mutateAsync({ receiverId, message }),
    respondToRequest: (requestId: string, action: 'accept' | 'decline' | 'cancel', reason?: string) =>
      respondMutation.mutateAsync({ requestId, action, reason }),
    removeConnection: (connectionId: string) => removeConnectionMutation.mutateAsync(connectionId),

    // Loading states
    isSending: sendRequestMutation.isPending,
    isResponding: respondMutation.isPending,
    isRemoving: removeConnectionMutation.isPending,
  }
}
