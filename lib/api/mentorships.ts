import { apiClient } from './client'
import {
    Mentorship,
    MentorshipListResponse,
    MentorshipDetailResponse,
    MentorshipApplication,
    ApplicationListResponse,
    SavedMentorshipListResponse,
} from '@/types'

export const mentorshipsApi = {
    // ========================================
    // ADMIN ENDPOINTS
    // ========================================

    // Create mentorship (Admin only)
    createMentorship: async (data: Partial<Mentorship>):
        Promise<{ message: string, data: Mentorship }> => {
        return apiClient.post('/mentorships', data)
    },

    // Get list of mentorships (with filters)
    getMentorships: async (params?: {
        search?: string
        chapterId?: string
        format?: string
        role?: string
        expertise?: string
        days?: string
        status?: string
        sortBy?: string
    }): Promise<MentorshipListResponse> => {
        return apiClient.get<MentorshipListResponse>('/mentorships', { params })
    },

    // Get single mentorship details (increments view count)
    getMentorship: async (id: string): Promise<MentorshipDetailResponse> => {
        return apiClient.get<MentorshipDetailResponse>(`/mentorships/${id}`)
    },

    // Update mentorship (Admin only)
    updateMentorship: async (id: string, data: Partial<Mentorship>):
        Promise<{ message: string, data: Mentorship }> => {
        return apiClient.patch(`/mentorships/${id}`, data)
    },

    // Delete mentorship (Admin only)
    deleteMentorship: async (id: string): Promise<{ message: string }> => {
        return apiClient.delete(`/mentorships/${id}`)
    },

    // ========================================
    // APPLICATION MANAGEMENT (Admin)
    // ========================================

    // Get applications for a mentorship (Admin only)
    getMentorshipApplications: async (
        mentorshipId: string,
        status?: string
    ): Promise<ApplicationListResponse> => {
        const params = status ? { status } : {}
        return apiClient.get<ApplicationListResponse>(
            `/mentorships/${mentorshipId}/applications`,
            { params }
        )
    },

    // Accept application (Admin only)
    acceptApplication: async (
        applicationId: string,
        adminResponse?: string
    ): Promise<{ message: string, data: MentorshipApplication }> => {
        return apiClient.patch(
            `/mentorships/applications/${applicationId}/accept`,
            { adminResponse }
        )
    },

    // Reject application (Admin only)
    rejectApplication: async (
        applicationId: string,
        adminResponse?: string
    ): Promise<{ message: string, data: MentorshipApplication }> => {
        return apiClient.patch(
            `/mentorships/applications/${applicationId}/reject`,
            { adminResponse }
        )
    },

    // ========================================
    // MEMBER FEATURES
    // ========================================

    // Apply for Mentorship
    applyForMentorship: async (
        mentorshipId: string,
        data: { coverLetter: string }
    ): Promise<{ message: string, data: MentorshipApplication }> => {
        return apiClient.post(
            `/mentorships/${mentorshipId}/apply`,
            data
        )
    },

    // Get my applications
    getMyApplications: async (status?: string): Promise<ApplicationListResponse> => {
        const params = status ? { status } : {}
        return apiClient.get<ApplicationListResponse>(
            '/mentorships/applications/my',
            { params }
        )
    },

    // Withdraw application
    withdrawApplication: async (applicationId: string):
        Promise<{ message: string, data: MentorshipApplication }> => {
        return apiClient.patch(
            `/mentorships/applications/${applicationId}/withdraw`
        )
    },

    // Save mentorship
    saveMentorship: async (mentorshipId: string):
        Promise<{ message: string }> => {
        return apiClient.post(`/mentorships/${mentorshipId}/save`)
    },

    // Unsave mentorship
    unsaveMentorship: async (mentorshipId: string):
        Promise<{ message: string }> => {
        return apiClient.delete(`/mentorships/${mentorshipId}/unsave`)
    },

    // Get saved mentorships
    getSavedMentorships: async (): Promise<SavedMentorshipListResponse> => {
        return apiClient.get<SavedMentorshipListResponse>('/mentorships/saved')
    },
}
