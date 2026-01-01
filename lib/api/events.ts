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
  startDate?: string
  endDate?: string
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
  }
}
