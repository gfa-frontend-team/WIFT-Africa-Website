import { apiClient } from './client'
import { Application, ApplicationsResponse } from '@/types/application'

export const applicationApi = {
  /**
   * Get my applications
   */
  getMyApplications: async (page = 1, limit = 20, status?: string): Promise<ApplicationsResponse> => {
    let url = `/application/me?page=${page}&limit=${limit}`
    if (status) {
      url += `&status=${status}`
    }
    const response = await apiClient.get<ApplicationsResponse>(url)
    
    // Ensure IDs are mapped correctly if backend returns _id
    if (response && response.applications) {
      response.applications = response.applications.map((app: any) => ({
        ...app,
        id: app.id || app._id,
        // Map nested objects if needed
        job: app.job ? { ...app.job, id: app.job.id || app.job._id } : app.job,
        user: app.user ? { ...app.user, id: app.user.id || app.user._id } : app.user
      }))
    }
    
    return response
  },

  /**
   * Get application details
   */
  getApplication: async (applicationId: string): Promise<{ application: Application }> => {
    const response = await apiClient.get<{ application: Application }>(`/application/${applicationId}`)
    
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
