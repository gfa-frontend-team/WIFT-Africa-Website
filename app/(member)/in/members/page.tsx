'use client'

import { Users } from 'lucide-react'

export default function MembersPage() {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Members Directory</h1>
        <p className="text-muted-foreground">Connect with professionals across the network</p>
      </div>

      <div className="bg-card border border-border rounded-xl p-12 text-center">
        <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-foreground mb-2">Coming Soon</h2>
        <p className="text-muted-foreground">
          The members directory is currently under development
        </p>
      </div>
    </div>
  )
}
