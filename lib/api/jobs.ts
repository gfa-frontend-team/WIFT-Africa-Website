import { apiClient } from './client'
import type { 
  Job, 
  JobFilters, 
  JobListResponse,
  JobDetailResponse,
  JobApplicationInput,
  JobApplication
} from '@/types'

export const jobsApi = {
  /**
   * Get list of jobs with filters
   */
  getJobs: async (filters: JobFilters = {}, page = 1, limit = 20): Promise<JobListResponse> => {
    // Filter out undefined values
    const params = {
      ...Object.fromEntries(
        Object.entries(filters).filter(([_, v]) => v !== undefined && v !== '')
      ),
      page, // Explicitly pass page number
      limit
    }
    
    // According to specs: GET /api/v1/jobs?location=...&role=...&remote=...
    return apiClient.get<JobListResponse>('/jobs', { params })
  },

  /**
   * Get single job details
   */
  getJob: async (id: string): Promise<JobDetailResponse> => {
    return apiClient.get<JobDetailResponse>(`/jobs/${id}`)
  },

  /**
   * Apply for a job
   */
  applyForJob: async (jobId: string, data: JobApplicationInput): Promise<JobApplication> => {
    return apiClient.post<JobApplication>(
      `/jobs/${jobId}/apply`,
      data
    )
  }
}
