import { apiClient } from './client'
import { PostAnalyticsSummary, PostAnalytics } from '@/types/analytics'

export const analyticsApi = {
  /**
   * Get aggregated summary of post analytics
   */
  getPostsSummary: async (): Promise<PostAnalyticsSummary> => {
    const response = await apiClient.get<{ success: boolean; data: PostAnalyticsSummary }>('/analytics/posts/summary')
    return response.data
  },

  /**
   * Get analytics for a specific post
   */
  getPostAnalytics: async (postId: string): Promise<PostAnalytics> => {
    const response = await apiClient.get<{ success: boolean; data: PostAnalytics }>(`/analytics/posts/${postId}`)
    return response.data
  },

  /**
   * Get analytics for user posts (paginated)
   */
  getUserPostsAnalytics: async (page = 1, limit = 10): Promise<{ posts: PostAnalytics[], total: number }> => {
    const response = await apiClient.get<{ success: boolean; data: { posts: PostAnalytics[], total: number } }>(`/analytics/posts?page=${page}&limit=${limit}`)
    return response.data
  },

  /**
   * Record an impression for a post
   */
  recordImpression: async (postId: string, data?: { watchTime?: number }): Promise<void> => {
    return await apiClient.post<void>(`/analytics/posts/${postId}/impression`, data)
  }
}
