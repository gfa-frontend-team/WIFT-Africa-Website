'use client'

import { Calendar } from 'lucide-react'

export default function EventsPage() {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Events</h1>
        <p className="text-muted-foreground">Discover and attend WIFT Africa events</p>
      </div>

      <div className="bg-card border border-border rounded-xl p-12 text-center">
        <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-foreground mb-2">Coming Soon</h2>
        <p className="text-muted-foreground">
          Events calendar is currently under development
        </p>
      </div>
    </div>
  )
}
