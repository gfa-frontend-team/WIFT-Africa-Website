import { apiClient } from './client'
import { Application, ApplicationsResponse } from '@/types/application'

export const applicationApi = {
  /**
   * Get my applications
   */
  getMyApplications: async (page = 1, limit = 20, status?: string): Promise<ApplicationsResponse> => {
    const params: any = { page, limit }
    if (status) params.status = status

    const response = await apiClient.get<ApplicationsResponse>('/job-applications/me', { params })
    
    // Ensure IDs are mapped correctly if backend returns _id
    if (response && response.applications) {
      response.applications = response.applications.map((app: any) => ({
        ...app,
        id: app.id || app._id,
        resume: app.resumeUrl || app.resume, // Map resumeUrl to resume
        // Map nested objects if needed
        job: app.job ? { ...app.job, id: app.job.id || app.job._id } : app.job,
        user: app.user ? (typeof app.user === 'object' ? { ...app.user, id: app.user.id || app.user._id } : app.user) : app.user
      }))
    }
    
    return response
  },

  /**
   * Get application details
   */
  getApplication: async (applicationId: string): Promise<{ application: Application }> => {
    const response = await apiClient.get<{ application: Application }>(`/job-applications/${applicationId}`)
    
    if (response && response.application) {
      const app: any = response.application
      response.application = {
        ...app,
        id: app.id || app._id,
        job: app.job ? { ...app.job, id: app.job.id || app.job._id } : app.job,
        user: app.user ? { ...app.user, id: app.user.id || app.user._id } : app.user
      }
    }
    
    return response
  }
}
