'use client'

import { BookOpen } from 'lucide-react'

export default function ResourcesPage() {
  return (
    <div className="max-w-screen-xl mx-auto px-4 py-6">
      <div className="bg-card border border-border rounded-lg p-12 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <BookOpen className="h-10 w-10 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-3">
            Resources Coming Soon
          </h2>
          <p className="text-muted-foreground">
            Access industry resources, guides, templates, and educational materials to advance your career.
          </p>
        </div>
      </div>
    </div>
  )
}
