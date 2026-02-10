import { apiClient } from './client'
import {
    ConnectionRecommendationResponse,
    TrendingPostsResponse,
    UpcomingEventsResponse,
    OpportunitiesResponse
} from '@/types/recommendations'

const BASE_URL = '/recommendations'

export const recommendationsApi = {
    getSuggestedConnections: async (limit = 10): Promise<ConnectionRecommendationResponse> => {
        return apiClient.get(`${BASE_URL}/connections`, { params: { limit } })
    },

    getTrendingPosts: async (limit = 5): Promise<TrendingPostsResponse> => {
        return apiClient.get(`${BASE_URL}/posts`, { params: { limit } })
    },

    getUpcomingEvents: async (limit = 5): Promise<UpcomingEventsResponse> => {
        return apiClient.get(`${BASE_URL}/events`, { params: { limit } })
    },

    getLatestOpportunities: async (limit = 5): Promise<OpportunitiesResponse> => {
        return apiClient.get(`${BASE_URL}/opportunities`, { params: { limit } })
    }
}
