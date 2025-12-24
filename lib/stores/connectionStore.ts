import { create } from 'zustand'
import { connectionsApi, ConnectionRequest, ConnectionStats } from '@/lib/api/connections'

interface ConnectionState {
  requests: ConnectionRequest[]
  totalRequests: number
  stats: ConnectionStats | null
  isLoading: boolean
  error: string | null
  
  fetchRequests: (type?: 'incoming' | 'outgoing' | 'all') => Promise<void>
  fetchStats: () => Promise<void>
  sendRequest: (receiverId: string, message?: string) => Promise<void>
  respondToRequest: (requestId: string, action: 'accept' | 'decline' | 'cancel', reason?: string) => Promise<void>
  removeConnection: (connectionId: string) => Promise<void>
  checkConnection: (userId: string) => Promise<boolean>
}

export const useConnectionStore = create<ConnectionState>((set, get) => ({
  requests: [],
  totalRequests: 0,
  stats: null,
  isLoading: false,
  error: null,

  fetchRequests: async (type = 'all') => {
    set({ isLoading: true, error: null })
    try {
      const response = await connectionsApi.getRequests(type)
      set({ requests: response.requests, totalRequests: response.total, isLoading: false })
    } catch (error: any) {
      set({ error: error.message || 'Failed to fetch requests', isLoading: false })
    }
  },

  fetchStats: async () => {
    try {
      const stats = await connectionsApi.getStats()
      set({ stats })
    } catch (error) {
      console.error('Failed to fetch connection stats:', error)
    }
  },

  sendRequest: async (receiverId, message) => {
    set({ isLoading: true, error: null })
    try {
      await connectionsApi.sendRequest(receiverId, message)
      await get().fetchRequests()
      await get().fetchStats()
      set({ isLoading: false })
    } catch (error: any) {
      set({ error: error.message || 'Failed to send request', isLoading: false })
      throw error
    }
  },

  respondToRequest: async (requestId, action, reason) => {
    set({ isLoading: true, error: null })
    try {
      await connectionsApi.respondToRequest(requestId, action, reason)
      await get().fetchRequests()
      await get().fetchStats()
      set({ isLoading: false })
    } catch (error: any) {
      set({ error: error.message || `Failed to ${action} request`, isLoading: false })
      throw error
    }
  },

  removeConnection: async (connectionId) => {
    set({ isLoading: true, error: null })
    try {
      await connectionsApi.removeConnection(connectionId)
      await get().fetchStats()
      set({ isLoading: false })
    } catch (error: any) {
      set({ error: error.message || 'Failed to remove connection', isLoading: false })
      throw error
    }
  },

  checkConnection: async (userId) => {
    try {
      const { connected } = await connectionsApi.checkStatus(userId)
      return connected
    } catch (error) {
      console.error('Failed to check connection status:', error)
      return false
    }
  },
}))
