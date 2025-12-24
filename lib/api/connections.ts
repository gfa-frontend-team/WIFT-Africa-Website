import { apiClient } from './client'
import { User } from '@/types'

export interface ConnectionRequest {
  id: string
  sender: User
  receiver: User
  status: 'PENDING' | 'ACCEPTED' | 'DECLINED'
  createdAt: string
  expiresAt: string
}

export interface Connection {
  id: string
  user1: User
  user2: User
  createdAt: string
}

export interface ConnectionStats {
  connectionsCount: number
  pendingIncoming: number
  pendingOutgoing: number
}

export interface ConnectionsResponse {
  requests: ConnectionRequest[]
  total: number
}

export const connectionsApi = {
  /**
   * Send a connection request
   */
  sendRequest: async (receiverId: string, message?: string): Promise<{ request: ConnectionRequest; message: string }> => {
    return await apiClient.post<{ request: ConnectionRequest; message: string }>('/connections/request', {
      receiverId,
      message,
    })
  },

  /**
   * Get connection requests
   */
  getRequests: async (type: 'incoming' | 'outgoing' | 'all' = 'all', page = 1, limit = 20): Promise<ConnectionsResponse> => {
    return await apiClient.get<ConnectionsResponse>(`/connections/requests?type=${type}&page=${page}&limit=${limit}`)
  },

  /**
   * Respond to a connection request
   */
  respondToRequest: async (
    requestId: string,
    action: 'accept' | 'decline' | 'cancel',
    reason?: string
  ): Promise<{ connection?: Connection; message: string }> => {
    return await apiClient.patch<{ connection?: Connection; message: string }>(`/connections/requests/${requestId}/${action}`, {
      reason,
    })
  },

  /**
   * Remove a connection
   */
  removeConnection: async (connectionId: string): Promise<{ message: string }> => {
    return await apiClient.delete<{ message: string }>(`/connections/${connectionId}`)
  },

  /**
   * Block a user
   */
  blockUser: async (userId: string, reason?: string): Promise<{ message: string }> => {
    return await apiClient.post<{ message: string }>('/connections/block', {
      userId,
      reason,
    })
  },

  /**
   * Get connection statistics
   */
  getStats: async (): Promise<ConnectionStats> => {
    return await apiClient.get<ConnectionStats>('/connections/stats')
  },

  /**
   * Check connection status with a specific user
   */
  checkStatus: async (targetUserId: string): Promise<{ connected: boolean }> => {
    return await apiClient.get<{ connected: boolean }>(`/connections/check/${targetUserId}`)
  },
}
