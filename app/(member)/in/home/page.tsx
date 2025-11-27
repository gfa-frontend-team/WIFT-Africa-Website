'use client'

import { useAuth } from '@/lib/hooks/useAuth'
import { Sparkles, Users, Briefcase, Calendar, TrendingUp } from 'lucide-react'

export default function HomePage() {
  const { user } = useAuth()

  const stats = [
    { label: 'Members', value: '300+', icon: Users, color: 'text-blue-500' },
    { label: 'Opportunities', value: '45', icon: Briefcase, color: 'text-green-500' },
    { label: 'Upcoming Events', value: '12', icon: Calendar, color: 'text-purple-500' },
    { label: 'Active Projects', value: '28', icon: TrendingUp, color: 'text-orange-500' },
  ]

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-background border border-primary/20 rounded-2xl p-8">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-primary/10 rounded-xl">
            <Sparkles className="h-8 w-8 text-primary" />
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Welcome back, {user?.firstName}! 🎬
            </h1>
            <p className="text-lg text-muted-foreground">
              You're now part of Africa's premier network for women in film, television & media.
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div
              key={stat.label}
              className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <Icon className={`h-8 w-8 ${stat.color}`} />
              </div>
              <p className="text-3xl font-bold text-foreground mb-1">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          )
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h2 className="text-xl font-bold text-foreground mb-4">Recent Activity</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
              <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-medium text-foreground">Welcome to WIFT Africa!</p>
                <p className="text-xs text-muted-foreground">Complete your profile to get started</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-medium text-foreground">Onboarding Complete</p>
                <p className="text-xs text-muted-foreground">You've successfully joined the network</p>
              </div>
            </div>
          </div>
        </div>

        {/* Getting Started */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h2 className="text-xl font-bold text-foreground mb-4">Getting Started</h2>
          <div className="space-y-3">
            <button className="w-full text-left p-3 bg-primary/10 hover:bg-primary/20 border border-primary/20 rounded-lg transition-colors">
              <p className="text-sm font-medium text-foreground">Complete Your Profile</p>
              <p className="text-xs text-muted-foreground">Add your bio, skills, and portfolio</p>
            </button>
            <button className="w-full text-left p-3 bg-muted/50 hover:bg-muted rounded-lg transition-colors">
              <p className="text-sm font-medium text-foreground">Browse Members</p>
              <p className="text-xs text-muted-foreground">Connect with other professionals</p>
            </button>
            <button className="w-full text-left p-3 bg-muted/50 hover:bg-muted rounded-lg transition-colors">
              <p className="text-sm font-medium text-foreground">Explore Opportunities</p>
              <p className="text-xs text-muted-foreground">Find jobs, grants, and mentorship</p>
            </button>
          </div>
        </div>
      </div>

      {/* Upcoming Events */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h2 className="text-xl font-bold text-foreground mb-4">Upcoming Events</h2>
        <div className="text-center py-8">
          <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">No upcoming events at the moment</p>
          <p className="text-sm text-muted-foreground mt-1">Check back soon for exciting events!</p>
        </div>
      </div>
    </div>
  )
}
