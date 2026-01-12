
export interface Job {
  _id: string
  title: string
  companyName: string
  location: string
  employmentType: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'FREELANCE' | 'INTERNSHIP' | string
  type?: string // Keeping for backward compatibility if needed, but API returns employmentType
  description: string
  requirements?: string[]
  responsibilities?: string[]
  salaryRange?: {
    min: number
    max: number
    currency: string
  }
  isRemote: boolean
  createdAt: string
  postedAt?: string
  applicationCount: number
  hasApplied?: boolean
}

export interface JobFilters {
  role?: string
  location?: string
  isRemote?: boolean
  page?: number
  limit?: number
}

export interface JobApplicationInput {
  coverLetter: string
  resumeUrl: string
}

export interface JobsResponse {
  status: string
  message: string
  results: number
  data: Job[]
}
