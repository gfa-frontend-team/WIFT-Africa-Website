import { Post } from '@/lib/api/posts'

// --- Suggested Connections ---
export interface RecommendedUser {
    id: string
    firstName: string
    lastName: string
    username?: string
    profileSlug: string
    profilePhoto?: string
    headline?: string
    primaryRole?: string
    location?: string
    chapter?: {
        id: string
        name: string
        code: string
    }
    recommendationReason: string
    score: number
}

export interface ConnectionRecommendationResponse {
    data: RecommendedUser[]
    meta: {
        total: number
    }
}

// --- Trending Posts ---
// Using Post from existing types, but defining the response wrapper if needed
export type TrendingPostsResponse = Post[]

// --- Upcoming Events ---
export interface IEvent {
    _id: string
    title: string
    description: string
    startDate: string
    endDate: string
    location?: string
    virtualLink?: string
    coverImage?: string
    organizer: {
        _id: string
        firstName: string
        lastName: string
    }
    chapterId?: {
        _id: string
        name: string
        code: string
    } | null
    status: 'PUBLISHED' | 'DRAFT' | 'CANCELLED'
    rsvpCount: number
}

export interface UpcomingEventsResponse {
    data: IEvent[]
    meta: {
        total: number
    }
}

// --- Latest Opportunities ---
export type OpportunityType = 'JOB' | 'FUNDING'

export interface BaseOpportunity {
    _id: string
    type: OpportunityType
    createdAt: string
}

export interface JobOpportunity extends BaseOpportunity {
    type: 'JOB'
    title: string
    company: string
    location: string
    workplaceType: 'REMOTE' | 'ONSITE' | 'HYBRID'
    employmentType: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'FREELANCE'
    description: string
    status: 'ACTIVE' | 'CLOSED'
}

export interface FundingOpportunity extends BaseOpportunity {
    type: 'FUNDING'
    name: string
    fundingType: 'Grant' | 'Fund'
    deadline: string
    region: string
    applicationType: 'Redirect' | 'Internal'
    applicationLink?: string;
    description: string
    status: 'Open' | 'Closed'
}

export type Opportunity = JobOpportunity | FundingOpportunity

export interface OpportunitiesResponse {
    data: Opportunity[]
    meta: {
        total: number
    }
}
