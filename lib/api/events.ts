import { apiClient } from './client'
import type {
  Event,
  EventsListResponse,
  EventType,
  EventRSVP,
  RSVPStatus
} from '@/types'

export interface EventFilters {
  page?: number
  limit?: number
  status?: string // 'PUBLISHED' | 'DRAFT' | 'CANCELLED'
  chapterId?: string
  type?: EventType
  month?: number
  year?: number
}

export interface MyRSVPsResponse {
  events?: Event[]
  total: number
  going: number
  interested: number
}

export const eventsApi = {
  // Get list of events with filters
  getEvents: async (filters: EventFilters = {}): Promise<EventsListResponse> => {
    // Filter out undefined values
    const params = Object.fromEntries(
      Object.entries(filters).filter(([_, v]) => v !== undefined && v !== '')
    )

    return apiClient.get<EventsListResponse>('/events', { params })
  },

  // Get single event details
  getEvent: async (id: string): Promise<Event> => {
    return apiClient.get<Event>(`/events/${id}`)
  },

  // RSVP to an event
  rsvpEvent: async (id: string, status: RSVPStatus): Promise<{ message: string, rsvp: EventRSVP }> => {
    return apiClient.post(`/events/${id}/rsvp`, { status })
  },

  // Cancel RSVP
  cancelRsvp: async (id: string): Promise<{ message: string }> => {
    return apiClient.delete(`/events/${id}/rsvp`)
  },

  // Get user's RSVP'd events
  getMyRSVPs: async (countOnly = true, status?: RSVPStatus): Promise<MyRSVPsResponse> => {
    const params = new URLSearchParams()
    if (countOnly) params.append('countOnly', 'true')
    if (status) params.append('status', status)
    
    return apiClient.get<MyRSVPsResponse>(`/events/my-rsvps?${params}`)
  }
}
