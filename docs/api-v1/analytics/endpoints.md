# Analytics Endpoints

## Post Analytics

### Get Aggregated Summary
`GET /api/v1/analytics/posts/summary`

Get high-level stats for all of the authenticated user's posts.

**Response:**
```json
{
  "totalImpressions": 1540,
  "totalMembersReached": 850,
  "totalEngagement": 124,
  "topPerformingPost": "postId..."
}
```

### Get User Posts Analytics
`GET /api/v1/analytics/posts`

Paginated list of analytics for individual posts.

### Get Single Post Analytics
`GET /api/v1/analytics/posts/:postId`

Detailed breakdown for a specific post.
*   **Discovery**: Impressions, Reach.
*   **Engagement**: Likes, Comments, Shares, Saves.
*   **Demography**: Viewer breakdown by Location and Role.

### Record Impression
`POST /api/v1/analytics/posts/:postId/impression`

Track that a user viewed a post.
**Body:**
```json
{
  "watchTime": 15 // Optional (Seconds, for video)
}
```

---

## Connection Analytics (Super Admin)

### Get Platform Overview
`GET /api/v1/analytics/connections`

Comprehensive networking stats:
*   Total connections.
*   Inter-chapter connection flows.
*   Top connected chapters.

### Get Inter-Chapter Details
`GET /api/v1/analytics/connections/chapters/:chapter1Id/:chapter2Id`

Detailed breakdown of connections between two specific chapters.

### Get Total Connections
`GET /api/v1/analytics/connections/total`

Returns the raw count of total connections across the platform.

**Response:**
```json
{
  "total": 1250
}
```
