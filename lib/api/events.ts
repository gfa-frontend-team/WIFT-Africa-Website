import { apiClient } from './client'
import type { Event, EventRSVP, EventAttendeesResponse, RSVPStatus, EventType, LocationType } from '@/types'

export interface EventsListParams {
  page?: number
  limit?: number
  chapterId?: string
  type?: string
  startDate?: string
  endDate?: string
}

export interface EventsListResponse {
  events: Event[]
  total: number
  pages: number
}

export interface CreateRSVPRequest {
  status: RSVPStatus
}

// Raw API response interfaces
interface RawApiEvent {
  _id: string
  title: string
  description: string
  type: EventType
  chapterId?: {
    _id: string
    name: string
    code: string
  }
  organizer?: {
    _id: string
    firstName: string
    lastName: string
  }
  startDate: string
  endDate: string
  timezone?: string
  location: {
    type: LocationType
    address?: string
    city?: string
    country?: string
    virtualUrl?: string
    instructions?: string
  }
  coverImage?: string
  capacity?: number
  currentAttendees?: number
  tags?: string[]
  myRSVP?: RSVPStatus | null
  status?: string
  isPublished?: boolean
  isCancelled?: boolean
  createdAt: string
  updatedAt: string
  __v?: number
}

interface RawApiResponse {
  events: RawApiEvent[]
  total: number
  pages: number
}

// Utility function to normalize API response to our expected format
function normalizeEvent(apiEvent: RawApiEvent): Event {
  const normalized: Event = {
    ...apiEvent,
    id: apiEvent._id,
    chapter: apiEvent.chapterId ? {
      id: apiEvent.chapterId._id,
      name: apiEvent.chapterId.name
    } : undefined,
    organizer: apiEvent.organizer ? {
      ...apiEvent.organizer,
      id: apiEvent.organizer._id
    } : undefined
  }
  
  // Ensure we always have an id field
  if (!normalized.id) {
    console.error('Event missing ID:', apiEvent)
    throw new Error('Event data is missing required ID field')
  }
  
  return normalized
}

export const eventsApi = {
  // List events with filtering
  listEvents: async (params: EventsListParams = {}): Promise<EventsListResponse> => {
    const response = await apiClient.get('/events', { params }) as RawApiResponse
    return {
      ...response,
      events: response.events.map(normalizeEvent)
    }
  },

  // Get single event details
  getEvent: async (eventId: string): Promise<Event> => {
    const response = await apiClient.get(`/events/${eventId}`) as RawApiEvent
    return normalizeEvent(response)
  },

  // RSVP to event - use the normalized id
  rsvpToEvent: (eventId: string, data: CreateRSVPRequest): Promise<{ message: string; rsvp: EventRSVP }> =>
    apiClient.post(`/events/${eventId}/rsvp`, data),

  // Cancel RSVP - use the normalized id
  cancelRSVP: (eventId: string): Promise<{ message: string }> =>
    apiClient.delete(`/events/${eventId}/rsvp`),

  // Admin: Get event attendees (CORRECTED URL)
  getEventAttendees: (eventId: string): Promise<EventAttendeesResponse> =>
    apiClient.get(`/events/admin/events/${eventId}/attendees`),

  // Admin: Create event (CORRECTED URL)
  createEvent: (data: {
    title: string
    description: string
    type: string
    chapterId: string
    startDate: string
    endDate: string
    timezone: string
    location: {
      type: 'PHYSICAL' | 'VIRTUAL' | 'HYBRID'
      address?: string
      city?: string
      country?: string
      virtualUrl?: string
    }
    capacity?: number
    coverImage?: string
    tags?: string[]
  }): Promise<{ message: string; event: Event }> =>
    apiClient.post('/events/admin/events', data),

  // Admin: Update event (CORRECTED URL)
  updateEvent: (eventId: string, data: Partial<{
    title: string
    description: string
    type: string
    startDate: string
    endDate: string
    timezone: string
    location: {
      type: 'PHYSICAL' | 'VIRTUAL' | 'HYBRID'
      address?: string
      city?: string
      country?: string
      virtualUrl?: string
    }
    capacity?: number
    coverImage?: string
    tags?: string[]
  }>): Promise<{ message: string; event: Event }> =>
    apiClient.patch(`/events/admin/events/${eventId}`, data),

  // Admin: Cancel event (CORRECTED URL)
  cancelEvent: (eventId: string, reason?: string): Promise<{ message: string; notifiedAttendees: number }> =>
    apiClient.delete(`/events/admin/events/${eventId}`, { data: { reason } }),
}