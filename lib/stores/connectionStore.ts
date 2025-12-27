import { create } from 'zustand'

/**
 * @deprecated This store is deprecated. Use useConnections hook instead.
 */
export const useConnectionStore = create<any>(() => ({
  requests: [],
  stats: null,
  isLoading: false,
  error: null,
  fetchRequests: () => console.warn('useConnectionStore.fetchRequests is deprecated'),
  fetchStats: () => console.warn('useConnectionStore.fetchStats is deprecated'),
  sendRequest: () => console.warn('useConnectionStore.sendRequest is deprecated'),
  respondToRequest: () => console.warn('useConnectionStore.respondToRequest is deprecated'),
  removeConnection: () => console.warn('useConnectionStore.removeConnection is deprecated'),
  checkConnection: () => console.warn('useConnectionStore.checkConnection is deprecated'),
}))
