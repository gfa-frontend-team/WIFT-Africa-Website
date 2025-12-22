'use client'

import { useAuth } from '@/lib/hooks/useAuth'
import { useFeatureAccess } from '@/lib/hooks/useFeatureAccess'
import { MembershipStatus } from '@/types'
import { RestrictedFeatureBanner } from '@/components/access/RestrictedFeatureMessage'
import FeatureGate, { FeatureButton } from '@/components/access/FeatureGate'
import { 
  MessageCircle, 
  Users, 
  Briefcase, 
  Calendar,
  Eye,
  UserPlus,
  TrendingUp,
  Clock
} from 'lucide-react'

export default function HomePage() {
  const { user } = useAuth()
  const { access, membershipStatus } = useFeatureAccess()

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  const isApproved = membershipStatus === MembershipStatus.APPROVED
  const isPending = membershipStatus === MembershipStatus.PENDING

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-6">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Welcome back, {user.firstName}! 👋
        </h1>
        <p className="text-muted-foreground">
          {isApproved 
            ? "Here's what's happening in your WIFT Africa community today."
            : isPending
              ? "Your membership is being verified. You have limited access while we review your application."
              : "Complete your membership verification to access all features."
          }
        </p>
      </div>

      {/* Limited Access Banner for Pending Users */}
      {isPending && (
        <div className="mb-6">
          <RestrictedFeatureBanner
            title="Limited Access Mode"
            description="Some features are restricted while your membership is being verified. You can view content but cannot interact until approved."
            membershipStatus={membershipStatus}
            actionText="Check Status"
            actionHref="/verification"
          />
        </div>
      )}

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <MessageCircle className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Messages</h3>
              <p className="text-xs text-muted-foreground">Connect with members</p>
            </div>
          </div>
          <FeatureButton
            feature="canSendMessages"
            className="w-full py-2 px-3 text-sm bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed rounded-md transition-colors"
          >
            {access.canSendMessages ? 'Send Message' : 'Verification Required'}
          </FeatureButton>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Users className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Directory</h3>
              <p className="text-xs text-muted-foreground">Browse members</p>
            </div>
          </div>
          <FeatureButton
            feature="canConnectWithMembers"
            className="w-full py-2 px-3 text-sm bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed rounded-md transition-colors"
          >
            {access.canConnectWithMembers ? 'Connect' : 'View Only'}
          </FeatureButton>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Briefcase className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Opportunities</h3>
              <p className="text-xs text-muted-foreground">Find jobs & projects</p>
            </div>
          </div>
          <FeatureButton
            feature="canApplyToOpportunities"
            className="w-full py-2 px-3 text-sm bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed rounded-md transition-colors"
          >
            {access.canApplyToOpportunities ? 'Apply Now' : 'View Only'}
          </FeatureButton>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Calendar className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Events</h3>
              <p className="text-xs text-muted-foreground">Industry events</p>
            </div>
          </div>
          <FeatureButton
            feature="canRSVPEvents"
            className="w-full py-2 px-3 text-sm bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed rounded-md transition-colors"
          >
            {access.canRSVPEvents ? 'RSVP' : 'View Only'}
          </FeatureButton>
        </div>
      </div>

      {/* Dashboard Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <Eye className="h-6 w-6 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">Profile Views</h3>
          </div>
          <div className="text-3xl font-bold text-foreground mb-2">
            {isApproved ? '0' : '—'}
          </div>
          <p className="text-sm text-muted-foreground">
            {isApproved ? 'This week' : 'Available after verification'}
          </p>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <UserPlus className="h-6 w-6 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">Connections</h3>
          </div>
          <div className="text-3xl font-bold text-foreground mb-2">
            {isApproved ? '0' : '—'}
          </div>
          <p className="text-sm text-muted-foreground">
            {isApproved ? 'Total connections' : 'Available after verification'}
          </p>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="h-6 w-6 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">Opportunities</h3>
          </div>
          <div className="text-3xl font-bold text-foreground mb-2">
            {access.canViewOpportunities ? '0' : '—'}
          </div>
          <p className="text-sm text-muted-foreground">
            {access.canViewOpportunities ? 'Applications sent' : 'Available after verification'}
          </p>
        </div>
      </div>

      {/* Coming Soon Section */}
      <FeatureGate 
        feature="canViewFeed"
        showRestrictionMessage={false}
        fallback={
          <div className="bg-card border border-border rounded-lg p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Clock className="h-10 w-10 text-gray-400" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-3">
                Dashboard Access Restricted
              </h2>
              <p className="text-muted-foreground mb-6">
                Complete your membership verification to access the full dashboard experience with community updates, networking features, and more.
              </p>
              <a
                href="/verification"
                className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg font-medium transition-colors"
              >
                Check Verification Status
              </a>
            </div>
          </div>
        }
      >
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
                <p className="text-sm font-medium text-foreground">Community Feed</p>
                <p className="text-xs text-muted-foreground">Coming soon</p>
              </div>
              <div className="px-4 py-2 bg-accent rounded-lg">
                <p className="text-sm font-medium text-foreground">Networking</p>
                <p className="text-xs text-muted-foreground">Coming soon</p>
              </div>
              <div className="px-4 py-2 bg-accent rounded-lg">
                <p className="text-sm font-medium text-foreground">Analytics</p>
                <p className="text-xs text-muted-foreground">Coming soon</p>
              </div>
            </div>
          </div>
        </div>
      </FeatureGate>
    </div>
  )
}
