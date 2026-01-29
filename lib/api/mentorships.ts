import { apiClient } from './client'
import {
    Mentorship,
    MentorshipListResponse,
    MentorshipDetailResponse,
    MentorshipStatus
} from '@/types'

export const mentorshipsApi = {
    // Create a new mentorship offer
    createMentorship: async (data: Partial<Mentorship>): Promise<{ message: string, data: Mentorship }> => {
        return apiClient.post('/mentorships', data)
    },

    // Get list of mentorships
    getMentorships: async (chapterId?: string): Promise<MentorshipListResponse> => {
        const params = chapterId ? { chapterId } : {}
        return apiClient.get<MentorshipListResponse>('/mentorships', { params })
    },

    // Get single mentorship details
    getMentorship: async (id: string): Promise<MentorshipDetailResponse> => {
        return apiClient.get<MentorshipDetailResponse>(`/mentorships/${id}`)
    },

    // Update mentorship (e.g., status)
    updateMentorship: async (id: string, data: Partial<Mentorship>): Promise<{ message: string, data: Mentorship }> => {
        return apiClient.patch(`/mentorships/${id}`, data)
    },

    // Delete mentorship
    deleteMentorship: async (id: string): Promise<{ message: string }> => {
        return apiClient.delete(`/mentorships/${id}`)
    }
}
