import { apiClient } from './client'
import { FundingListResponse, FundingDetailResponse, TargetRole } from '@/types'

export const fundingApi = {
    // Get all funding opportunities with optional filters
    getFundingOpportunities: async (filters?: {
        chapterId?: string
        targetRole?: TargetRole
    }): Promise<FundingListResponse> => {
        const params: Record<string, string> = {}
        if (filters?.chapterId) params.chapterId = filters.chapterId
        if (filters?.targetRole) params.targetRole = filters.targetRole
        
        return apiClient.get<FundingListResponse>('/funding-opportunities', { params })
    },

    // Get single funding opportunity details
    getFundingOpportunity: async (id: string): Promise<FundingDetailResponse> => {
        return apiClient.get<FundingDetailResponse>(`/funding-opportunities/${id}`)
    }
}
