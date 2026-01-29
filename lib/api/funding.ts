import { apiClient } from './client'
import { FundingListResponse, FundingDetailResponse } from '@/types'

export const fundingApi = {
    // Get all funding opportunities
    getFundingOpportunities: async (chapterId?: string): Promise<FundingListResponse> => {
        const params = chapterId ? { chapterId } : {}
        return apiClient.get<FundingListResponse>('/funding-opportunities', { params })
    },

    // Get single funding opportunity details
    getFundingOpportunity: async (id: string): Promise<FundingDetailResponse> => {
        return apiClient.get<FundingDetailResponse>(`/funding-opportunities/${id}`)
    }
}
