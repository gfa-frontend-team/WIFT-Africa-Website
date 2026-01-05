import { apiClient } from './client'
import { User } from '@/types'

export interface ConnectionRequest {
  id: string
  _id?: string
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
  user?: User // For list endpoint
  connectedAt?: string
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
    return await apiClient.post<{ request: ConnectionRequest; message: string }>('/connections/requests', {
      receiverId,
      message,
    })
  },

  /**
   * Get connection requests
   */
  getRequests: async (type: 'incoming' | 'outgoing' | 'all' = 'all', page = 1, limit = 20): Promise<ConnectionsResponse> => {
    const response = await apiClient.get<ConnectionsResponse>(`/connections/requests?type=${type}&page=${page}&limit=${limit}`)
    
    // Map _id to id if needed
    if (response.requests && Array.isArray(response.requests)) {
      response.requests = response.requests.map((req: any) => ({
        ...req,
        id: req.id || req._id
      }))
    }
    
    return response
  },

  /**
   * Get confirmed connections
   */
  getConnections: async (page = 1, limit = 20): Promise<{ connections: Connection[]; total: number; pages: number }> => {
    const response = await apiClient.get<{ connections: Connection[]; total: number; pages: number }>(`/connections?page=${page}&limit=${limit}`)
    
    // Map _id to id if needed
    if (response.connections && Array.isArray(response.connections)) {
      response.connections = response.connections.map((conn: any) => ({
        ...conn,
        id: conn.id || conn._id,
        user: {
          ...conn.user,
          id: conn.user.id || conn.user._id
        }
      }))
    }
    
    return response
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
   * Unblock a user
   */
  unblockUser: async (blockedUserId: string): Promise<{ message: string }> => {
    return await apiClient.delete<{ message: string }>(`/connections/block/${blockedUserId}`)
  },

  /**
   * Get blocked users
   */
  getBlockedUsers: async (page = 1, limit = 20): Promise<{ blockedUsers: any[]; total: number }> => {
    return await apiClient.get<{ blockedUsers: any[]; total: number }>(`/connections/blocked?page=${page}&limit=${limit}`)
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
