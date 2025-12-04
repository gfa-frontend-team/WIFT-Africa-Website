'use client'

import { Users } from 'lucide-react'

export default function ConnectionsPage() {
  return (
    <div className="max-w-screen-xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">My Connections</h1>
        <p className="text-muted-foreground">Your professional network</p>
      </div>

      <div className="bg-card border border-border rounded-lg p-12 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Users className="h-10 w-10 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-3">
            Connections Coming Soon
          </h2>
          <p className="text-muted-foreground">
            Connect with other WIFT Africa members, build your network, and collaborate on projects.
          </p>
        </div>
      </div>
    </div>
  )
}
