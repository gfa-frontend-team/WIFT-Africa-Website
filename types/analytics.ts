export interface PostAnalyticsSummary {
  totalImpressions: number
  totalMembersReached: number
  totalEngagement: number
  topPerformingPost?: string
}

export interface ViewerDemography {
  byLocation: Array<{ name: string; count: number }>
  byRole: Array<{ name: string; count: number }>
}

export interface PostAnalytics {
  postId: string
  postType: 'IMAGE' | 'VIDEO'
  timestamp?: string // Added based on docs
  discovery: {
    impressions: number
    membersReached: number
  }
  engagement: {
    likes: number
    comments?: number
    shares?: number
    saves?: number
    totalWatchTime?: number
  }
  viewerDemography?: ViewerDemography
}

export interface AnalyticsResponse {
  summary: PostAnalyticsSummary
}

export interface ProfileView {
  viewerId: string
  firstName: string
  lastName: string
  email: string
  username?: string
  profileSlug?: string
  profilePhoto?: string
  headline?: string
  location?: string
  viewedAt: string
  chapter?: {
    id: string
    name: string
    code: string
    country: string
  }
}

export interface ProfileViewsResponse {
  count: number
  viewers: ProfileView[]
}
