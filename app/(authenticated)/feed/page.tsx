'use client'

import { useEffect, useRef, useCallback, useState } from 'react'
import { useAuth } from '@/lib/hooks/useAuth'
import { useFeatureAccess } from '@/lib/hooks/useFeatureAccess'
import { MembershipStatus } from '@/types'
import { RestrictedFeatureBanner } from '@/components/access/RestrictedFeatureMessage'
import FeatureGate from '@/components/access/FeatureGate'
import { useFeed } from '@/lib/hooks/useFeed'
import { FeedFilters } from '@/components/feed/FeedFilters'
import { CreatePostTrigger } from '@/components/feed/CreatePostTrigger'
import { FeedSkeleton } from '@/components/feed/FeedSkeleton'
import LeftSidebar from '@/components/feed/LeftSidebar'
import RightSidebar from '@/components/feed/RightSidebar'
import PostCard from '@/components/feed/PostCard'
import CreatePostModal from '@/components/feed/CreatePostModal'


const FeedContainer = () => {
  const { posts, isLoading, error, hasMore, fetchNextPage, isFetchingNextPage, refetch } = useFeed()
  const observerTarget = useRef<HTMLDivElement>(null)
  const [pullStartY, setPullStartY] = useState(0)
  const [pullDistance, setPullDistance] = useState(0)

  // Intersection Observer for infinite scroll
  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [target] = entries
      if (target.isIntersecting && hasMore && !isFetchingNextPage) {
        fetchNextPage()
      }
    },
    [hasMore, isFetchingNextPage, fetchNextPage]
  )

  useEffect(() => {
    const element = observerTarget.current
    if (!element) return

    const option = {
      root: null,
      rootMargin: '100px',
      threshold: 0,
    }

    const observer = new IntersectionObserver(handleObserver, option)
    observer.observe(element)

    return () => observer.disconnect()
  }, [handleObserver])

  // Pull-to-refresh for mobile
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (window.scrollY === 0) {
      setPullStartY(e.touches[0].clientY)
    }
  }, [])

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (pullStartY === 0 || window.scrollY > 0) return

      const currentY = e.touches[0].clientY
      const distance = currentY - pullStartY

      if (distance > 0 && distance < 150) {
        setPullDistance(distance)
      }
    },
    [pullStartY]
  )

  const handleTouchEnd = useCallback(async () => {
    if (pullDistance > 80) {
      await refetch()
    }
    setPullStartY(0)
    setPullDistance(0)
  }, [pullDistance, refetch])

  if (isLoading) {
    return <FeedSkeleton />
  }

  // React Query handles errors, we can extract the message
  const errorMessage = error instanceof Error ? error.message : 'Failed to load feed';
  const isRateLimited = errorMessage.includes('429');

  if (error && posts.length === 0) {
    return (
      <div className="bg-card border border-border rounded-lg p-12 text-center">
        <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
          isRateLimited ? 'bg-yellow-100' : 'bg-red-100'
        }`}>
          <span className="text-2xl">{isRateLimited ? '⏳' : '⚠️'}</span>
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">
          {isRateLimited ? 'Server is Busy' : 'Failed to load feed'}
        </h3>
        <p className="text-muted-foreground mb-4">
          {isRateLimited 
            ? 'The server is handling many requests right now. Please wait a moment.'
            : errorMessage
          }
        </p>
        <button
          onClick={() => refetch()}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          Try Again
        </button>
      </div>
    )
  }

  if (posts.length === 0 && !isLoading) {
    return (
      <div className="bg-card border border-border rounded-lg p-12 text-center">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">📝</span>
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">
          No posts yet
        </h3>
        <p className="text-muted-foreground">
          Be the first to share something with the community!
        </p>
      </div>
    )
  }

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Pull-to-refresh indicator */}
      {pullDistance > 0 && (
        <div
          className="flex items-center justify-center py-4 transition-all"
          style={{ transform: `translateY(${Math.min(pullDistance, 80)}px)` }}
        >
          <div className="text-muted-foreground text-sm">
            {pullDistance > 80 ? 'Release to refresh' : 'Pull to refresh'}
          </div>
        </div>
      )}

      <div className="space-y-4">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>

      {/* Infinite scroll trigger */}
      <div ref={observerTarget} className="py-4">
        {isFetchingNextPage && (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        )}
        {!hasMore && posts.length > 0 && (
          <div className="text-center text-muted-foreground text-sm py-4">
            You&apos;ve reached the end of the feed
          </div>
        )}
      </div>
    </div>
  )
}

export default function HomePage() {
  const { user } = useAuth()
  const { access, membershipStatus } = useFeatureAccess()
  const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false)

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
    <div className="min-h-screen bg-background">
      <div className="max-w-screen-xl mx-auto px-4 py-6">
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

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Sidebar - 3 columns on desktop */}
          <div className="lg:col-span-3">
            <LeftSidebar />
          </div>

          {/* Main Feed - 6 columns on desktop */}
          <main className="lg:col-span-6">
            <FeatureGate 
              feature="canViewFeed"
              showRestrictionMessage={false}
              fallback={
                <div className="bg-card border border-border rounded-lg p-12 text-center">
                  <div className="max-w-md mx-auto">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <span className="text-4xl">🔒</span>
                    </div>
                    <h2 className="text-2xl font-bold text-foreground mb-3">
                      Feed Access Restricted
                    </h2>
                    <p className="text-muted-foreground mb-6">
                      Complete your membership verification to access the community feed and start connecting with other members.
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
              <CreatePostTrigger onOpenModal={() => setIsCreatePostModalOpen(true)} />
              <FeedFilters />
              <FeedContainer />
            </FeatureGate>
          </main>

          {/* Right Sidebar - 3 columns on desktop */}
          <div className="lg:col-span-3">
            <RightSidebar />
          </div>
        </div>
      </div>

      {/* Create Post Modal */}
      <CreatePostModal
        isOpen={isCreatePostModalOpen}
        onClose={() => setIsCreatePostModalOpen(false)}
      />
    </div>
  )
}
