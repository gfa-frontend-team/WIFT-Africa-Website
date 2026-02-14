import { apiClient } from './client'
import { Report, ReportInput } from '@/types/reports'

export const reportsApi = {
  // Submit a new report
  createReport: async (data: ReportInput) => {
    const response = await apiClient.post<{ message: string; report: Report }>('/reports', data)
    return response
  },
}
