
// Enums
export type JobStatus = 'ACTIVE' | 'CLOSED' | 'ARCHIVED';
export type EmploymentType = 'full-time' | 'part-time' | 'contract' | 'internship' | 'freelance'; // added freelance to be safe as it was in old type
export type ApplicationType = 'INTERNAL' | 'EXTERNAL';

// ------------------------------------------------------------------
// Models
// ------------------------------------------------------------------
export interface SalaryRange {
  min: number;
  max: number;
  currency: string;
}

export interface Job {
  _id: string;
  title: string;
  description: string;
  role?: string; // made optional to be safe, spec said string
  location: string;
  isRemote: boolean;
  companyName?: string;
  applicationLink?: string; // For EXTERNAL jobs
  employmentType: EmploymentType | string; // loose typing for safety
  applicationType: ApplicationType;
  salaryRange?: SalaryRange;
  status: JobStatus;
  createdAt: string;
  updatedAt: string;
  
  // Legacy/UI fields (keeping optional to avoid breakages until UI is fully refactored)
  requirements?: string[];
  responsibilities?: string[];
  applicationCount?: number;
  hasApplied?: boolean;
}

export interface JobFilters {
  role?: string;
  location?: string;
  remote?: boolean; // spec says 'remote' (boolean)
  page?: number;
  limit?: number;
}

export interface JobApplicationInput {
  coverLetter: string;
  resumeUrl: string;
}

// ------------------------------------------------------------------
// API Responses
// ------------------------------------------------------------------
export interface APIResponse<T> {
  status: 'success' | 'error';
  message: string;
  data: T;
}

export interface JobListResponse {
  status: 'success';
  message: string;
  results: number;
  data: Job[];
}

export interface JobDetailResponse {
  status: 'success';
  message: string;
  data: Job;
}

export type JobsResponse = JobListResponse; // Alias for backward compatibility if needed
