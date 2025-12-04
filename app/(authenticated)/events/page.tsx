'use client'

import { Calendar } from 'lucide-react'

export default function EventsPage() {
  return (
    <div className="max-w-screen-xl mx-auto px-4 py-6">
      <div className="bg-card border border-border rounded-lg p-12 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Calendar className="h-10 w-10 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-3">
            Events Coming Soon
          </h2>
          <p className="text-muted-foreground">
            Discover and RSVP to networking events, workshops, screenings, and industry gatherings.
          </p>
        </div>
      </div>
    </div>
  )
}
