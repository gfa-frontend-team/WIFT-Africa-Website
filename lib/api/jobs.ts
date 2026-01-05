import { apiClient } from './client'
import type { 
  Job, 
  JobFilters, 
  JobsResponse, 
  JobApplicationInput 
} from '@/types'

export const jobsApi = {
  /**
   * Get list of jobs with filters
   */
  getJobs: async (filters: JobFilters = {}): Promise<JobsResponse> => {
    // Filter out undefined values
    const params = Object.fromEntries(
      Object.entries(filters).filter(([_, v]) => v !== undefined && v !== '')
    )
    
    return apiClient.get<JobsResponse>('/jobs', { params })
  },

  /**
   * Get single job details
   */
  getJob: async (id: string): Promise<{ data: Job }> => {
    return apiClient.get<{ data: Job }>(`/jobs/${id}`)
  },

  /**
   * Apply for a job
   */
  applyForJob: async (jobId: string, data: JobApplicationInput): Promise<{ message: string }> => {
    return apiClient.post<{ message: string }>(
      `/jobs/${jobId}/apply`,
      data
    )
  }
}
