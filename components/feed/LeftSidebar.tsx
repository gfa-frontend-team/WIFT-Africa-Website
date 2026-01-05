'use client'

import Link from 'next/link'
import { Eye, Users, TrendingUp, Bookmark, Briefcase, Calendar } from 'lucide-react'
import Avatar from '@/components/ui/Avatar'
import { useAuth } from '@/lib/hooks/useAuth'
import { useSavedPostsCount } from '@/lib/hooks/useSavedPosts'

export default function LeftSidebar() {
  const { user } = useAuth()
  const { data: savedCount } = useSavedPostsCount()

  if (!user) return null

  return (
    <aside className="space-y-4">
      {/* Profile Summary Card */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        {/* Header Banner */}
        <div className="h-16 bg-gradient-to-r from-primary/20 to-primary/10"></div>
        
        {/* Profile Info */}
        <div className="px-4 pb-4">
          <div className="-mt-8 mb-3">
            <Avatar
              src={user.profilePhoto}
              name={`${user.firstName} ${user.lastName}`}
              size="lg"
              className="border-4 border-card"
            />
          </div>
          
          <Link
            href={user.username || user.id ? `/in/${user.username || user.id}` : '#'}
            className="block hover:underline"
          >
            <h3 className="font-semibold text-foreground">
              {user.firstName} {user.lastName}
            </h3>
          </Link>
          <p className="text-sm text-muted-foreground mb-3">
            {/* TODO: Get professional title from profile */}
            WIFT Africa Member
          </p>

          {/* Quick Stats */}
          <div className="space-y-2 py-3 border-t border-border">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground flex items-center gap-2">
                <Eye className="h-4 w-4" />
                Profile views
              </span>
              <span className="font-semibold text-primary">
                {/* TODO: Get from API when available */}
                —
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground flex items-center gap-2">
                <Users className="h-4 w-4" />
                Connections
              </span>
              <span className="font-semibold text-primary">
                {/* TODO: Get from connections API when available */}
                —
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Posts
              </span>
              <span className="font-semibold text-primary">
                {/* TODO: Get user's post count */}
                —
              </span>
            </div>
          </div>

          {/* Membership Status */}
          {user.membershipStatus === 'APPROVED' && (
            <div className="mt-3 p-2 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-xs text-green-800 font-medium">
                ✓ Verified Member
              </p>
            </div>
          )}
          
          {user.membershipStatus === 'PENDING' && (
            <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-xs text-yellow-800 font-medium">
                ⏳ Membership Pending
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Saved Items Card */}
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="flex items-center gap-2 mb-3">
          <Bookmark className="h-4 w-4 text-muted-foreground" />
          <h3 className="font-semibold text-foreground text-sm">Saved Items</h3>
        </div>
        
        <div className="space-y-2">
          <Link
            href="/saved-posts"
            className="flex items-center justify-between text-sm hover:bg-accent p-2 rounded-lg transition-colors"
          >
            <span className="text-muted-foreground flex items-center gap-2">
              <Bookmark className="h-4 w-4" />
              Posts
            </span>
            <span className="font-semibold text-foreground">
              {typeof savedCount === 'number' ? savedCount : '—'}
            </span>
          </Link>
          
          <div className="flex items-center justify-between text-sm p-2 rounded-lg opacity-50">
            <span className="text-muted-foreground flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              Opportunities
            </span>
            <span className="text-xs text-muted-foreground">
              Coming Soon
            </span>
          </div>
          
          <div className="flex items-center justify-between text-sm p-2 rounded-lg opacity-50">
            <span className="text-muted-foreground flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Events
            </span>
            <span className="text-xs text-muted-foreground">
              Coming Soon
            </span>
          </div>
        </div>
      </div>

      {/* Quick Links Card */}
      <div className="bg-card border border-border rounded-lg p-4">
        <h3 className="font-semibold text-foreground text-sm mb-3">
          Quick Links
        </h3>
        
        <div className="space-y-1">
          <Link
            href={user.username || user.id ? `/in/${user.username || user.id}` : '#'}
            className="block text-sm text-muted-foreground hover:text-primary hover:bg-accent p-2 rounded-lg transition-colors"
          >
            My Profile
          </Link>
          <Link
            href="/settings"
            className="block text-sm text-muted-foreground hover:text-primary hover:bg-accent p-2 rounded-lg transition-colors"
          >
            Settings
          </Link>
          <div className="block text-sm text-muted-foreground p-2 rounded-lg opacity-50">
            My Applications
            <span className="text-xs ml-2">Coming Soon</span>
          </div>
          <Link
            href="/opportunities"
            className="block text-sm text-muted-foreground hover:text-primary hover:bg-accent p-2 rounded-lg transition-colors"
          >
            Opportunities
          </Link>
          <div className="block text-sm text-muted-foreground p-2 rounded-lg opacity-50">
            My Events
            <span className="text-xs ml-2">Coming Soon</span>
          </div>
        </div>
      </div>
    </aside>
  )
}