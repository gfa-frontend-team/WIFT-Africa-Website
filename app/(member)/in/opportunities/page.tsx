'use client'

import { Briefcase } from 'lucide-react'

export default function OpportunitiesPage() {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Opportunities</h1>
        <p className="text-muted-foreground">Discover jobs, grants, and mentorship programs</p>
      </div>

      <div className="bg-card border border-border rounded-xl p-12 text-center">
        <Briefcase className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-foreground mb-2">Coming Soon</h2>
        <p className="text-muted-foreground">
          Opportunities board is currently under development
        </p>
      </div>
    </div>
  )
}
