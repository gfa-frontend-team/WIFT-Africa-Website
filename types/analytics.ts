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
