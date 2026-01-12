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
  _id?: string
  job: Job
  user: User | string // string if just ID
  status: ApplicationStatus | string // string because backend sends lowercase
  coverLetter: string
  resume?: string // URL to resume (mapped from resumeUrl)
  resumeUrl?: string
  resumeId?: string
  resumeName?: string
  jobTitleSnapshot?: string
  companyNameSnapshot?: string
  appliedAt?: string
  createdAt?: string // Usually present if appliedAt is missing
  updatedAt: string
}

export interface ApplicationsResponse {
  applications: Application[]
  total: number
  pages: number
  page: number
  limit: number
}
