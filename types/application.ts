import { Job } from './jobs'
import { User } from './index'

export type ApplicationStatus = 'received' | 'shortlisted' | 'rejected' | 'hired';

export interface JobApplication {
  _id: string
  id?: string // alias for frontend helpers
  job: Job
  applicant: string | User // User ID or populated user
  user?: User | string // alias for backward compat if code uses .user instead of .applicant
  jobTitleSnapshot: string
  companyNameSnapshot?: string
  resumeUrl?: string
  resume?: string // alias
  coverLetter?: string
  status: ApplicationStatus
  isWithdrawn: boolean
  joinedAt: string
  createdAt: string
  
  // Legacy fields
  appliedAt?: string
  updatedAt?: string
}

export interface MyApplicationsResponse {
  applications: JobApplication[]
  total: number
  pages: number
}

export type ApplicationsResponse = MyApplicationsResponse; // Alias
export type Application = JobApplication;
