import { apiClient } from './client'
import { JobApplication, MyApplicationsResponse } from '@/types/application'

export const applicationApi = {
  /**
   * Get my applications
   */
  getMyApplications: async (page = 1, limit = 20, status?: string): Promise<MyApplicationsResponse> => {
    const params: any = { page, limit }
    if (status) params.status = status

    // Response structure from backend is { applications: [], total, pages }
    const response = await apiClient.get<MyApplicationsResponse>('/job-applications/me', { params })
    
    // Ensure IDs are mapped correctly if backend returns _id
    if (response && response.applications) {
      response.applications = response.applications.map((app: any) => ({
        ...app,
        id: app.id || app._id,
        resume: app.resumeUrl || app.resume, 
        // Map nested objects if needed
        job: app.job ? { ...app.job, id: app.job.id || app.job._id } : app.job,
        user: app.user ? (typeof app.user === 'object' ? { ...app.user, id: app.user.id || app.user._id } : app.user) : app.user,
        applicant: app.applicant || app.user // Ensure applicant field is populated
      }))
    }
    
    return response
  },

  /**
   * Get application details
   */
  getApplication: async (applicationId: string): Promise<{ application: JobApplication }> => {
    const response = await apiClient.get<{ application: JobApplication }>(`/job-applications/${applicationId}`)
    
    if (response && response.application) {
      const app: any = response.application
      response.application = {
        ...app,
        id: app.id || app._id,
        job: app.job ? { ...app.job, id: app.job.id || app.job._id } : app.job,
        user: app.user ? { ...app.user, id: app.user.id || app.user._id } : app.user,
        applicant: app.applicant || app.user
      }
    }
    
    return response
  }
}
