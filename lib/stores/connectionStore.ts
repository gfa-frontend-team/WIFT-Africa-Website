import { create } from 'zustand'
import { connectionsApi, ConnectionRequest, ConnectionStats } from '@/lib/api/connections'

interface ConnectionState {
  requests: ConnectionRequest[]
  totalRequests: number
  stats: ConnectionStats | null
  isLoading: boolean
  error: string | null
  lastStatsFetch: number
  lastRequestsFetch: Record<string, number>
  
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
  lastStatsFetch: 0,
  lastRequestsFetch: {},

  fetchRequests: async (type = 'all') => {
    const { lastRequestsFetch, isLoading } = get()
    const now = Date.now()
    const lastFetch = lastRequestsFetch[type] || 0
    
    // Throttle: Don't fetch if less than 2 seconds have passed since last fetch for this type
    if (isLoading || (now - lastFetch < 2000)) {
       return
    }

    set({ isLoading: true, error: null })
    try {
      const response = await connectionsApi.getRequests(type)
      set(state => ({ 
        requests: response.requests, 
        totalRequests: response.total, 
        isLoading: false,
        lastRequestsFetch: { ...state.lastRequestsFetch, [type]: now }
      }))
    } catch (error: any) {
      set({ error: error.message || 'Failed to fetch requests', isLoading: false })
    }
  },

  fetchStats: async () => {
    // Throttle to 60 seconds
    const state = get()
    if (state.stats && Date.now() - state.lastStatsFetch < 60000) {
      return
    }

    try {
      const stats = await connectionsApi.getStats()
      set({ stats, lastStatsFetch: Date.now() })
    } catch (error) {
      console.error('Failed to fetch connection stats:', error)
    }
  },

  sendRequest: async (receiverId, message) => {
    set({ isLoading: true, error: null })
    try {
      await connectionsApi.sendRequest(receiverId, message)
      // Force refresh of stats
      set({ lastStatsFetch: 0 }) 
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
      set({ lastStatsFetch: 0 })
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
      set({ lastStatsFetch: 0 })
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
