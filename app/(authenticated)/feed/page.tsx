'use client'

import { useAuth } from '@/lib/hooks/useAuth'

export default function HomePage() {
  const { user } = useAuth()

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-6">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Welcome back, {user.firstName}! 👋
        </h1>
        <p className="text-muted-foreground">
          Here's what's happening in your WIFT Africa community today.
        </p>
      </div>

      {/* Coming Soon Card */}
      <div className="bg-card border border-border rounded-lg p-12 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">🚀</span>
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-3">
            Dashboard Coming Soon
          </h2>
          <p className="text-muted-foreground mb-6">
            We're building an amazing dashboard experience for you. Stay tuned for updates on your profile views, connections, opportunities, and more!
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <div className="px-4 py-2 bg-accent rounded-lg">
              <p className="text-sm font-medium text-foreground">Profile Views</p>
              <p className="text-xs text-muted-foreground">Coming soon</p>
            </div>
            <div className="px-4 py-2 bg-accent rounded-lg">
              <p className="text-sm font-medium text-foreground">Connections</p>
              <p className="text-xs text-muted-foreground">Coming soon</p>
            </div>
            <div className="px-4 py-2 bg-accent rounded-lg">
              <p className="text-sm font-medium text-foreground">Feed</p>
              <p className="text-xs text-muted-foreground">Coming soon</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
