import { Job } from './jobs'
import { User } from './index'

export enum ApplicationStatus {
  RECEIVED = 'RECEIVED',
  SHORTLISTED = 'SHORTLISTED',
  REJECTED = 'REJECTED',
  HIRED = 'HIRED',
}

export interface Application {
  id: string
  job: Job
  user: User // The applicant
  status: ApplicationStatus
  coverLetter: string
  resume?: string // URL to resume
  resumeId?: string
  resumeName?: string
  appliedAt: string
  updatedAt: string
}

export interface ApplicationsResponse {
  applications: Application[]
  total: number
  pages: number
  page: number
  limit: number
}
