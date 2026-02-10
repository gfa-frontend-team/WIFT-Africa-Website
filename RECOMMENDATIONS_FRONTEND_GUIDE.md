
# Recommendations API - Frontend Guide

## Overview

This guide details the new recommendation endpoints for Suggested Connections, Trending Posts, Upcoming Events, and Latest Opportunities. These endpoints are designed to populate the user's dashboard and discovery feeds.

**Base URL:** `/api/v1/recommendations`  
**Authentication:** Required (`Bearer <token>`)

---

## 1. Suggested Connections

Fetch users that the current user might want to connect with. Suggestions are based on shared chapter, similar roles, and location.

### Endpoint
`GET /recommendations/connections`

### Query Parameters
| Param | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `limit` | `number` | `10` | Number of suggestions to return. |

### Response Interface
```typescript
interface ConnectionRecommendationResponse {
  data: RecommendedUser[];
  meta: {
    total: number;
  };
}

interface RecommendedUser {
  id: string; // User ID
  firstName: string;
  lastName: string;
  username?: string;
  profileSlug: string;
  profilePhoto?: string; // URL
  headline?: string;
  primaryRole?: Role; // e.g., 'Director', 'Producer'
  roles?: Role[];
  location?: string;
  chapter?: {
    id: string;
    name: string;
    code: string;
  };
  recommendationReason: string; // e.g., 'Same chapter', 'Similar role'
  score: number; // Relevance score (higher is better)
}
```

### Example Usage (React/Axios)
```typescript
const { data } = await axios.get('/recommendations/connections?limit=5');
// Render logic...
```

---

## 2. Trending Posts

Fetch posts that have high engagement (likes, comments, shares) from the last 7 days. Respects visibility (Public, Chapter, Connections Only).

### Endpoint
`GET /recommendations/posts`

### Query Parameters
| Param | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `limit` | `number` | `5` | Number of posts to return. |

### Response Interface
Returns an array of `IPost` objects (same structure as Feed API).

```typescript
type TrendingPostsResponse = IPost[];

// Key fields in IPost for rendering:
interface IPost {
  _id: string;
  content: string;
  media?: string[]; // Array of media URLs
  author: {
    _id: string;
    firstName: string;
    lastName: string;
    profilePhoto?: string;
    // ...other user fields
  };
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  createdAt: string; // ISO Date
  // ...
}
```

---

## 3. Upcoming Events

Fetch upcoming events, sorted by start date (soonest first). Includes Global events and events from the user's Chapter.

### Endpoint
`GET /recommendations/events`

### Query Parameters
| Param | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `limit` | `number` | `5` | Number of events to return. |

### Response Interface
```typescript
interface UpcomingEventsResponse {
  data: IEvent[];
  meta: {
    total: number;
  };
}

interface IEvent {
  _id: string;
  title: string;
  description: string;
  startDate: string; // ISO Date
  endDate: string; // ISO Date
  location?: string;
  virtualLink?: string;
  coverImage?: string; // URL
  organizer: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  chapterId?: {
    _id: string;
    name: string;
    code: string;
  } | null; // Null if Global event
  status: 'PUBLISHED' | 'DRAFT' | 'CANCELLED';
  rsvpCount: number;
}
```

---

## 4. Latest Opportunities

Fetch a mixed list of the latest **Jobs** and **Funding Opportunities**. Sorted by creation date (newest first).

### Endpoint
`GET /recommendations/opportunities`

### Query Parameters
| Param | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `limit` | `number` | `5` | Total number of items to return. |

### Response Interface
The response contains a mix of Jobs and Funding Opportunities. Distinguish them using the `type` field.

```typescript
interface OpportunitiesResponse {
  data: (JobOpportunity | FundingOpportunity)[];
  meta: {
    total: number;
  };
}

type OpportunityType = 'JOB' | 'FUNDING';

interface BaseOpportunity {
  _id: string;
  type: OpportunityType; // Discriminator
  createdAt: string; // ISO Date
}

interface JobOpportunity extends BaseOpportunity {
  type: 'JOB';
  title: string;
  company: string;
  location: string;
  workplaceType: 'REMOTE' | 'ONSITE' | 'HYBRID';
  employmentType: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'FREELANCE';
  description: string;
  status: 'ACTIVE' | 'CLOSED';
}

interface FundingOpportunity extends BaseOpportunity {
  type: 'FUNDING';
  name: string; // Title
  fundingType: 'Grant' | 'Fund';
  deadline: string; // ISO Date
  region: string;
  applicationType: 'Redirect' | 'Internal';
  applicationLink?: string;
  description: string;
  status: 'Open' | 'Closed';
}
```

## Implementation Notes

-   **Skeleton Loading:** All endpoints involve database queries. Use skeleton loaders in the UI while fetching data.
-   **Error Handling:** Handle `401 Unauthorized` (redirect to login) and general `500` errors gracefully.
-   **Empty States:** Handle cases where `data` arrays are empty (e.g., "No upcoming events found").
-   **Navigation:**
    -   Clicking a **User** -> Go to Profile (`/in/:profileSlug` or `/member/:id`)
    -   Clicking a **Post** -> Go to Post Detail (`/feed/:postId`)
    -   Clicking an **Event** -> Go to Event Detail (`/events/:eventId`)
    -   Clicking an **Opportunity** -> Go to Job/Funding Detail (`/opportunities/:id` or similar)
