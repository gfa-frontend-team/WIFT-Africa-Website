'use client'

import { Briefcase } from 'lucide-react'

export default function OpportunitiesPage() {
  return (
    <div className="max-w-screen-xl mx-auto px-4 py-6">
      <div className="bg-card border border-border rounded-lg p-12 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Briefcase className="h-10 w-10 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-3">
            Opportunities Coming Soon
          </h2>
          <p className="text-muted-foreground">
            Discover jobs, grants, mentorship programs, and collaboration opportunities in the film industry.
          </p>
        </div>
      </div>
    </div>
  )
}
