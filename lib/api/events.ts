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

  // Get user's RSVP'd events (assuming this endpoint exists or will be created)
  getMyEvents: (): Promise<EventsListResponse> =>
    apiClient.get('/events/my-events'),

  // Admin: Get event attendees
  getEventAttendees: (eventId: string): Promise<EventAttendeesResponse> =>
    apiClient.get(`/admin/events/${eventId}/attendees`),
}