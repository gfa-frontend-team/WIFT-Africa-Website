'use client'

import { MessageSquare } from 'lucide-react'

export default function MessagesPage() {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Messages</h1>
        <p className="text-muted-foreground">Connect with other members</p>
      </div>

      <div className="bg-card border border-border rounded-xl p-12 text-center">
        <MessageSquare className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-foreground mb-2">Coming Soon</h2>
        <p className="text-muted-foreground">
          Messaging system is currently under development
        </p>
      </div>
    </div>
  )
}
