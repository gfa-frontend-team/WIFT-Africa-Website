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
import PostCard from '@/components/feed/PostCard'
import dynamic from 'next/dynamic'


const LeftSidebar = dynamic(() => import('@/components/feed/LeftSidebar'))
const RightSidebar = dynamic(() => import('@/components/feed/RightSidebar'))
const CreatePostModal = dynamic(() => import('@/components/feed/CreatePostModal'))

const FeedContainer = () => {
  const { posts, isLoading, error, hasMore, fetchNextPage, isFetchingNextPage, refetch } = useFeed()
  const [isRefreshing, setIsRefreshing] = useState(false)
  const observerTarget = useRef<HTMLDivElement>(null)

  // Infinite scroll trigger
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isFetchingNextPage) {
          fetchNextPage()
        }
      },
      { threshold: 0.1 }
    )

    if (observerTarget.current) {
      observer.observe(observerTarget.current)
    }

    return () => observer.disconnect()
  }, [hasMore, isFetchingNextPage, fetchNextPage])

  // Pull-to-refresh logic
  const pullStartY = useRef(0)
  const pullDistance = useRef(0)
  const pullIndicatorRef = useRef<HTMLDivElement>(null)

  // Optimized Pull-to-refresh for mobile
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (window.scrollY === 0) {
      pullStartY.current = e.touches[0].clientY
    }
  }, [])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (pullStartY.current === 0 || window.scrollY > 0) return

    const currentY = e.touches[0].clientY
    const distance = currentY - pullStartY.current
    const dampedDistance = Math.min(distance * 0.5, 150)

    if (dampedDistance > 0 && pullIndicatorRef.current) {
      pullDistance.current = dampedDistance
      pullIndicatorRef.current.style.transform = `translateY(${dampedDistance}px)`
      pullIndicatorRef.current.style.opacity = String(Math.min(dampedDistance / 80, 1))

      const textElement = pullIndicatorRef.current.querySelector('.pull-text')
      if (textElement) {
        textElement.textContent = dampedDistance > 80 ? 'Release to refresh' : 'Pull to refresh'
      }
    }
  }, [])

  const handleTouchEnd = useCallback(async () => {
    if (pullDistance.current > 80) {
      setIsRefreshing(true)
      if (pullIndicatorRef.current) {
        pullIndicatorRef.current.style.transition = 'transform 0.3s'
        pullIndicatorRef.current.style.transform = 'translateY(60px)'
      }

      try {
        await refetch()
      } finally {
        setIsRefreshing(false)
        if (pullIndicatorRef.current) {
          pullIndicatorRef.current.style.transform = 'translateY(0)'
          setTimeout(() => {
            if (pullIndicatorRef.current) {
              pullIndicatorRef.current.style.transition = ''
              pullIndicatorRef.current.style.opacity = '0'
            }
          }, 300)
        }
      }
    } else {
      if (pullIndicatorRef.current) {
        pullIndicatorRef.current.style.transition = 'transform 0.3s'
        pullIndicatorRef.current.style.transform = 'translateY(0)'
        pullIndicatorRef.current.style.opacity = '0'
        setTimeout(() => {
          if (pullIndicatorRef.current) {
            pullIndicatorRef.current.style.transition = ''
          }
        }, 300)
      }
    }
    pullStartY.current = 0
    pullDistance.current = 0
  }, [refetch])


  if (isLoading && !isRefreshing) {
    return <FeedSkeleton />
  }

  const errorMessage = error instanceof Error ? error.message : 'Failed to load feed';
  const isRateLimited = errorMessage.includes('429');

  if (error && posts.length === 0) {
    return (
      <div className="bg-card border border-border rounded-lg p-12 text-center">
        <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${isRateLimited ? 'bg-yellow-100' : 'bg-red-100'}`}>
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

  if (posts.length === 0 && !isLoading && !isRefreshing) {
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
      className="relative min-h-screen"
    >
      {/* Pull-to-refresh indicator */}
      <div
        ref={pullIndicatorRef}
        className="fixed top-20 left-0 right-0 z-50 flex items-center justify-center pointer-events-none opacity-0"
        style={{ willChange: 'transform, opacity' }}
      >
        <div className="bg-background/80 backdrop-blur-sm shadow-md rounded-full px-4 py-2 flex items-center gap-2 border border-border">
          {isRefreshing ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
          ) : (
            <span className="text-primary text-lg">↓</span>
          )}
          <span className="pull-text text-sm font-medium text-foreground">
            {isRefreshing ? 'Refreshing...' : 'Pull to refresh'}
          </span>
        </div>
      </div>

      {/* Feed List */}
      <div className="space-y-4 pb-4">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>

      {/* Infinite scroll loader */}
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
  
    if (!user) return null;
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
      <div className="max-w-7xl mx-auto px-4 py-6">
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
          {/* <div className=""> */}
            <LeftSidebar />
          {/* </div> */}

          {/* Main Feed - 6 columns on desktop */}
          <main className="lg:col-span-6 max-w-2xl mx-auto lg:max-w-none lg:mx-0 w-full">
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
          <div className="hidden lg:block lg:col-span-3">
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
