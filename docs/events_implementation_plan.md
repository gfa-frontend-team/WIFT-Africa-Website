# WIFT Africa Events Feature Implementation Plan

## Overview

This document outlines the complete implementation plan for the Events feature in the WIFT Africa member platform. The feature will allow members to discover, view, and RSVP to chapter events, while providing admins with event management capabilities.

## API Analysis

Based on the API documentation (`docs/api-v1/events/endpoints.md`), the events system supports:

### Public Endpoints
- `GET /api/v1/events` - List events with filtering (public access)
- `GET /api/v1/events/:eventId` - Get event details (public access)

### Member Endpoints  
- `POST /api/v1/events/:eventId/rsvp` - RSVP to event (authenticated)
- `DELETE /api/v1/events/:eventId/rsvp` - Cancel RSVP (authenticated)

### Admin Endpoints
- `POST /api/v1/admin/events` - Create event (Chapter Admin)
- `PATCH /api/v1/admin/events/:eventId` - Update event (Chapter Admin)
- `DELETE /api/v1/admin/events/:eventId` - Cancel event (Chapter Admin)
- `GET /api/v1/admin/events/:eventId/attendees` - View attendees (Chapter Admin)

## Member User Flow

### 1. Events Discovery
- **Entry Point**: `/events` page
- **Access**: All authenticated users (APPROVED and PENDING can view)
- **Features**:
  - Calendar/list view of upcoming events
  - Filter by event type, chapter, date range
  - Search events by title/description
  - Event cards showing key details

### 2. Event Details
- **Entry Point**: `/events/[eventId]` page
- **Access**: Public (but enhanced for authenticated users)
- **Features**:
  - Full event information
  - RSVP status and controls (if authenticated)
  - Attendee count
  - Event organizer information
  - Location details and directions

### 3. RSVP Management
- **Access**: APPROVED members only (PENDING cannot RSVP)
- **Features**:
  - RSVP with status: GOING, INTERESTED, NOT_GOING
  - Cancel existing RSVP
  - View personal RSVP history
  - Receive notifications about event updates

### 4. Personal Event Dashboard
- **Entry Point**: `/events/my-events` page
- **Access**: Authenticated users
- **Features**:
  - Events user has RSVP'd to
  - Past events attended
  - Upcoming events by RSVP status

## Required Types & Interfaces

```typescript
// Event Types
export enum EventType {
  WORKSHOP = 'WORKSHOP',
  SCREENING = 'SCREENING', 
  NETWORKING = 'NETWORKING',
  MEETUP = 'MEETUP',
  CONFERENCE = 'CONFERENCE',
  OTHER = 'OTHER'
}

export enum LocationType {
  PHYSICAL = 'PHYSICAL',
  VIRTUAL = 'VIRTUAL',
  HYBRID = 'HYBRID'
}

export enum RSVPStatus {
  GOING = 'GOING',
  INTERESTED = 'INTERESTED',
  NOT_GOING = 'NOT_GOING'
}

export interface EventLocation {
  type: LocationType
  address?: string
  city?: string
  country?: string
  virtualLink?: string
  instructions?: string
}

export interface Event {
  id: string
  title: string
  description: string
  type: EventType
  chapter: {
    id: string
    name: string
  }
  startDate: string
  endDate: string
  timezone?: string
  location: EventLocation
  organizer: {
    id: string
    firstName: string
    lastName: string
  }
  coverImage?: string
  capacity?: number
  currentAttendees: number
  tags?: string[]
  myRSVP?: RSVPStatus | null
  createdAt: string
  updatedAt: string
}

export interface EventRSVP {
  eventId: string
  userId: string
  status: RSVPStatus
  rsvpDate: string
}

export interface EventsListResponse {
  events: Event[]
  total: number
  pages: number
}

export interface EventAttendee {
  user: {
    id: string
    firstName: string
    lastName: string
    profilePhoto?: string
  }
  status: RSVPStatus
  rsvpDate: string
}

export interface EventAttendeesResponse {
  attendees: EventAttendee[]
  stats: {
    going: number
    interested: number
    notGoing: number
  }
}
```

## Pages to Create

### 1. Events List Page
**File**: `app/(authenticated)/events/page.tsx` (replace existing)
- Grid/list view of events
- Filtering and search
- Pagination
- Event cards with quick RSVP

### 2. Event Details Page  
**File**: `app/(authenticated)/events/[eventId]/page.tsx`
- Full event information
- RSVP controls
- Attendee information
- Related events

### 3. My Events Page
**File**: `app/(authenticated)/events/my-events/page.tsx`
- Personal RSVP'd events
- Past events
- RSVP history

### 4. Admin Event Management (Future)
**File**: `app/(authenticated)/admin/events/` (if admin features needed)
- Create/edit events
- Manage attendees
- Event analytics

## Components to Create

### Core Event Components

#### 1. Event Cards
**File**: `components/events/EventCard.tsx`
- Compact event display for lists
- Quick RSVP button
- Event type badge
- Date/time display

#### 2. Event Details
**File**: `components/events/EventDetails.tsx`
- Full event information display
- Location details with map integration
- Organizer information

#### 3. RSVP Controls
**File**: `components/events/RSVPControls.tsx`
- RSVP status buttons (Going, Interested, Not Going)
- Cancel RSVP functionality
- Loading states
- Access control integration

#### 4. Event Filters
**File**: `components/events/EventFilters.tsx`
- Filter by event type
- Date range picker
- Chapter filter
- Search input

#### 5. Event Calendar
**File**: `components/events/EventCalendar.tsx`
- Calendar view of events
- Month/week navigation
- Event dots/indicators

### Layout Components

#### 6. Events Layout
**File**: `components/events/EventsLayout.tsx`
- Consistent layout for event pages
- Navigation between event views
- Breadcrumbs

#### 7. Event Header
**File**: `components/events/EventHeader.tsx`
- Page title and actions
- View toggle (calendar/list)
- Create event button (for admins)

### Utility Components

#### 8. Event Type Badge
**File**: `components/events/EventTypeBadge.tsx`
- Colored badges for event types
- Consistent styling

#### 9. Attendee List
**File**: `components/events/AttendeeList.tsx`
- Display event attendees
- Avatar grid
- Attendee count

#### 10. Event Skeleton
**File**: `components/events/EventSkeleton.tsx`
- Loading states for event cards
- Skeleton for event details

## API Integration

### Events API Client
**File**: `lib/api/events.ts`

```typescript
import { apiClient } from './client'
import type { Event, EventsListResponse, EventRSVP, EventAttendeesResponse, RSVPStatus } from '@/types'

export interface EventsListParams {
  page?: number
  limit?: number
  chapterId?: string
  type?: string
  startDate?: string
  endDate?: string
}

export interface CreateRSVPRequest {
  status: RSVPStatus
}

export const eventsApi = {
  // List events with filtering
  listEvents: (params: EventsListParams = {}): Promise<EventsListResponse> =>
    apiClient.get('/events', { params }),

  // Get single event details
  getEvent: (eventId: string): Promise<Event> =>
    apiClient.get(`/events/${eventId}`),

  // RSVP to event
  rsvpToEvent: (eventId: string, data: CreateRSVPRequest): Promise<{ message: string; rsvp: EventRSVP }> =>
    apiClient.post(`/events/${eventId}/rsvp`, data),

  // Cancel RSVP
  cancelRSVP: (eventId: string): Promise<{ message: string }> =>
    apiClient.delete(`/events/${eventId}/rsvp`),

  // Get user's RSVP'd events
  getMyEvents: (): Promise<EventsListResponse> =>
    apiClient.get('/events/my-events'),

  // Admin: Get event attendees
  getEventAttendees: (eventId: string): Promise<EventAttendeesResponse> =>
    apiClient.get(`/admin/events/${eventId}/attendees`),
}
```

## Custom Hooks

### 1. Events Data Hook
**File**: `lib/hooks/useEvents.ts`

```typescript
import { useState, useEffect } from 'react'
import { eventsApi, type EventsListParams } from '@/lib/api/events'
import type { Event, EventsListResponse } from '@/types'

export function useEvents(params: EventsListParams = {}) {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState({
    page: 1,
    total: 0,
    pages: 0
  })

  const fetchEvents = async () => {
    try {
      setLoading(true)
      const response = await eventsApi.listEvents(params)
      setEvents(response.events)
      setPagination({
        page: params.page || 1,
        total: response.total,
        pages: response.pages
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch events')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEvents()
  }, [JSON.stringify(params)])

  return {
    events,
    loading,
    error,
    pagination,
    refetch: fetchEvents
  }
}
```

### 2. Event Details Hook
**File**: `lib/hooks/useEvent.ts`

```typescript
import { useState, useEffect } from 'react'
import { eventsApi } from '@/lib/api/events'
import type { Event } from '@/types'

export function useEvent(eventId: string) {
  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true)
        const eventData = await eventsApi.getEvent(eventId)
        setEvent(eventData)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch event')
      } finally {
        setLoading(false)
      }
    }

    if (eventId) {
      fetchEvent()
    }
  }, [eventId])

  return { event, loading, error }
}
```

### 3. RSVP Management Hook
**File**: `lib/hooks/useEventRSVP.ts`

```typescript
import { useState } from 'react'
import { eventsApi } from '@/lib/api/events'
import { useAuth } from './useAuth'
import { useFeatureAccess } from './useFeatureAccess'
import type { RSVPStatus } from '@/types'
import { toast } from 'sonner'

export function useEventRSVP(eventId: string, currentRSVP?: RSVPStatus | null) {
  const [rsvpStatus, setRsvpStatus] = useState<RSVPStatus | null>(currentRSVP || null)
  const [loading, setLoading] = useState(false)
  const { isAuthenticated } = useAuth()
  const { canRSVPEvents } = useFeatureAccess()

  const rsvp = async (status: RSVPStatus) => {
    if (!isAuthenticated || !canRSVPEvents) {
      toast.error('You need to be an approved member to RSVP to events')
      return
    }

    try {
      setLoading(true)
      await eventsApi.rsvpToEvent(eventId, { status })
      setRsvpStatus(status)
      toast.success(`RSVP updated to ${status.toLowerCase()}`)
    } catch (error) {
      toast.error('Failed to update RSVP')
      console.error('RSVP error:', error)
    } finally {
      setLoading(false)
    }
  }

  const cancelRSVP = async () => {
    if (!isAuthenticated) return

    try {
      setLoading(true)
      await eventsApi.cancelRSVP(eventId)
      setRsvpStatus(null)
      toast.success('RSVP cancelled')
    } catch (error) {
      toast.error('Failed to cancel RSVP')
      console.error('Cancel RSVP error:', error)
    } finally {
      setLoading(false)
    }
  }

  return {
    rsvpStatus,
    loading,
    rsvp,
    cancelRSVP,
    canRSVP: isAuthenticated && canRSVPEvents
  }
}
```

## Access Control Integration

The events feature integrates with the existing access control system:

### Feature Access Rules
- **View Events**: APPROVED and PENDING members can view events
- **RSVP to Events**: Only APPROVED members can RSVP
- **Create Events**: Only Chapter Admins and Super Admins

### Implementation
- Use existing `useFeatureAccess()` hook
- Wrap RSVP controls in `FeatureGate` component
- Show appropriate messaging for restricted users

## Navigation Integration

### Update Navigation
**File**: `components/layout/DashboardHeader.tsx`
- Ensure "Events" link is visible for users with `canViewEvents` permission
- Add active state for events pages

### Update Routes
**File**: `lib/utils/routes.ts`
- Add event route constants
- Update route helpers

## Implementation Priority

### Phase 1: Core Events (High Priority)
1. Add event types to `types/index.ts`
2. Create `lib/api/events.ts`
3. Create basic hooks (`useEvents`, `useEvent`)
4. Replace events page with functional list view
5. Create event details page
6. Implement basic RSVP functionality

### Phase 2: Enhanced UX (Medium Priority)
1. Add event filtering and search
2. Create calendar view
3. Add my events page
4. Implement event notifications
5. Add event sharing

### Phase 3: Admin Features (Low Priority)
1. Event creation/editing for admins
2. Attendee management
3. Event analytics
4. Bulk operations

## Testing Strategy

### Unit Tests
- API client functions
- Custom hooks
- Component rendering
- RSVP logic

### Integration Tests
- Event list filtering
- RSVP flow
- Access control
- Navigation

### E2E Tests
- Complete event discovery flow
- RSVP and cancellation
- Admin event management

## Performance Considerations

### Optimization
- Implement pagination for event lists
- Cache event data with React Query (when enabled)
- Lazy load event images
- Debounce search inputs

### SEO
- Server-side rendering for public event pages
- Meta tags for event sharing
- Structured data for events

## Security Considerations

### Access Control
- Verify RSVP permissions on frontend and backend
- Protect admin routes
- Validate event data

### Data Protection
- Sanitize event descriptions
- Validate file uploads for event images
- Rate limit RSVP actions

## Future Enhancements

### Advanced Features
- Event reminders and notifications
- Calendar integration (Google Calendar, Outlook)
- Event check-in system
- Event feedback and ratings
- Recurring events
- Event waitlists
- Social sharing
- Event recommendations

### Analytics
- Event attendance tracking
- Popular event types
- Member engagement metrics
- Chapter event performance

## Conclusion

This implementation plan provides a comprehensive roadmap for building a robust events feature that integrates seamlessly with the existing WIFT Africa platform architecture. The phased approach allows for iterative development while maintaining code quality and user experience standards.

The feature will enhance member engagement by providing easy access to chapter events and networking opportunities, while giving admins the tools they need to manage successful events.