'use client'

import { BookOpen } from 'lucide-react'

export default function ResourcesPage() {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Resources</h1>
        <p className="text-muted-foreground">Access guides, templates, and learning materials</p>
      </div>

      <div className="bg-card border border-border rounded-xl p-12 text-center">
        <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-foreground mb-2">Coming Soon</h2>
        <p className="text-muted-foreground">
          Resource library is currently under development
        </p>
      </div>
    </div>
  )
}
