import { apiClient } from './client'
import { Resource, ResourceListResponse, ResourceDetailResponse } from '@/types'

export const resourcesApi = {
    // Get all resources
    getResources: async (): Promise<ResourceListResponse> => {
        return apiClient.get<ResourceListResponse>('/resources')
    },

    // Get single resource details
    getResource: async (id: string): Promise<ResourceDetailResponse> => {
        return apiClient.get<ResourceDetailResponse>(`/resources/${id}`)
    }
}
