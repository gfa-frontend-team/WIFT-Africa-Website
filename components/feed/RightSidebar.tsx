'use client'

import Link from 'next/link'
import { TrendingUp, Calendar, Briefcase, UserPlus, Newspaper, Clock } from 'lucide-react'
import Avatar from '@/components/ui/Avatar'

export default function RightSidebar() {
  return (
    <aside className="space-y-4">
      {/* Coming Soon - Suggested Connections */}
      <div className="bg-card border border-border rounded-lg p-4 opacity-75">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-foreground text-sm">
            Suggested Connections
          </h3>
          <span className="text-xs text-muted-foreground">Coming Soon</span>
        </div>

        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-start gap-3 opacity-50">
              <div className="w-8 h-8 bg-muted rounded-full"></div>
              <div className="flex-1 min-w-0">
                <div className="h-3 bg-muted rounded w-3/4 mb-1"></div>
                <div className="h-2 bg-muted rounded w-1/2"></div>
              </div>
              <UserPlus className="h-4 w-4 text-muted-foreground" />
            </div>
          ))}
        </div>
      </div>

      {/* Coming Soon - Latest News */}
      <div className="bg-card border border-border rounded-lg p-4 opacity-75">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Newspaper className="h-4 w-4 text-muted-foreground" />
            <h3 className="font-semibold text-foreground text-sm">
              Latest News
            </h3>
          </div>
          <span className="text-xs text-muted-foreground">Coming Soon</span>
        </div>

        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="p-3 border border-border rounded-lg opacity-50">
              <div className="h-3 bg-muted rounded w-full mb-2"></div>
              <div className="h-3 bg-muted rounded w-2/3 mb-2"></div>
              <div className="h-2 bg-muted rounded w-1/3"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Coming Soon - Upcoming Events */}
      <div className="bg-card border border-border rounded-lg p-4 opacity-75">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <h3 className="font-semibold text-foreground text-sm">
              Upcoming Events
            </h3>
          </div>
          <span className="text-xs text-muted-foreground">Coming Soon</span>
        </div>

        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="p-3 border border-border rounded-lg opacity-50">
              <div className="h-3 bg-muted rounded w-3/4 mb-2"></div>
              <div className="h-2 bg-muted rounded w-1/2 mb-2"></div>
              <div className="flex items-center justify-between">
                <div className="h-2 bg-muted rounded w-1/4"></div>
                <div className="h-2 bg-muted rounded w-1/6"></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Coming Soon - Trending Topics */}
      <div className="bg-card border border-border rounded-lg p-4 opacity-75">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
          <h3 className="font-semibold text-foreground text-sm">
            Trending Topics
          </h3>
          <span className="text-xs text-muted-foreground ml-auto">Coming Soon</span>
        </div>

        <div className="space-y-2">
          {['AfricanCinema', 'Nollywood', 'FilmFunding', 'WomenInFilm', 'Cinematography'].map((topic, index) => (
            <div key={topic} className="p-2 hover:bg-accent rounded-lg transition-colors opacity-50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">
                    #{topic}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    — posts
                  </p>
                </div>
                <span className="text-xs text-muted-foreground">
                  {index + 1}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Coming Soon - Latest Opportunities */}
      <div className="bg-card border border-border rounded-lg p-4 opacity-75">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Briefcase className="h-4 w-4 text-muted-foreground" />
            <h3 className="font-semibold text-foreground text-sm">
              Latest Opportunities
            </h3>
          </div>
          <span className="text-xs text-muted-foreground">Coming Soon</span>
        </div>

        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="p-3 border border-border rounded-lg opacity-50">
              <div className="h-3 bg-muted rounded w-full mb-2"></div>
              <div className="h-2 bg-muted rounded w-2/3 mb-2"></div>
              <div className="flex items-center justify-between">
                <div className="h-2 bg-muted rounded w-1/4"></div>
                <div className="h-2 bg-muted rounded w-1/6"></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Available Now - Recent Activity */}
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <h3 className="font-semibold text-foreground text-sm">
            Recent Activity
          </h3>
        </div>

        <div className="space-y-2 text-sm text-muted-foreground">
          <p>Welcome to the WIFT Africa community!</p>
          <p>Start by creating your first post to connect with other members.</p>
          <p>Explore profiles and build your network.</p>
        </div>
      </div>

      {/* Footer Links */}
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
          <a href="/about" className="hover:text-primary">About</a>
          <span>•</span>
          <a href="/help" className="hover:text-primary">Help</a>
          <span>•</span>
          <a href="/privacy" className="hover:text-primary">Privacy</a>
          <span>•</span>
          <a href="/terms" className="hover:text-primary">Terms</a>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          © 2025 WIFT Africa
        </p>
      </div>
    </aside>
  )
}