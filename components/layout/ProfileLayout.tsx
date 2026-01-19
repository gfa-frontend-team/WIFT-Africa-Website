'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/lib/hooks/useAuth'
import { shouldUseDashboardLayout, isOwnProfile, getUsernameFromPath } from '@/lib/utils/profileRoutes'
import DashboardHeader from './DashboardHeader'
import MobileBottomNav from './MobileBottomNav'
import VerificationStatusBanner from './VerificationStatusBanner'

interface ProfileLayoutProps {
  children: React.ReactNode
}

export default function ProfileLayout({ children }: ProfileLayoutProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { user, isAuthenticated, isEmailVerified, onboardingComplete } = useAuth()
  const [isChecking, setIsChecking] = useState(true)

  // Determine if we should use dashboard layout
  // Refined logic: If authenticated and user data exists, we should show the dashboard header 
  // even if on a "public" route like /in/[username], so logged-in users get the full app experience.
  const useDashboardLayout = isAuthenticated && user || shouldUseDashboardLayout(pathname, isAuthenticated)
  const isViewingOwnProfile = isOwnProfile(pathname, user?.username)

  useEffect(() => {
    // For authenticated users, check if they can access dashboard features
    if (isAuthenticated && useDashboardLayout) {
      // Check authentication and onboarding status for dashboard layout
      if (!isEmailVerified) {
        router.push('/verify-email')
        return
      }

      if (!onboardingComplete) {
        router.push('/onboarding')
        return
      }
    }

    // All checks passed
    setIsChecking(false)
  }, [isAuthenticated, isEmailVerified, onboardingComplete, useDashboardLayout, router])

  // Show loading while checking auth for dashboard layout
  if (isChecking && useDashboardLayout) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  // If authenticated user should use dashboard layout
  if (useDashboardLayout && user) {
    return (
      <div className="min-h-screen bg-background">
        {/* Dashboard Header */}
        <DashboardHeader user={user} />
        
        {/* Verification Status Banner */}
        <VerificationStatusBanner />
        
        {/* Main Content */}
        <main className="pt-16 pb-20 md:pb-0">
          {children}
        </main>
        
        {/* Mobile Bottom Navigation */}
        <MobileBottomNav />
      </div>
    )
  }

  // Public layout for non-authenticated users
  return (
    <div className="min-h-screen bg-background">
      {/* Simple header for public pages */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="text-muted-foreground hover:text-foreground"
            >
              ← Back
            </button>
            <div className="flex items-center space-x-3">
              <img 
                src="/logo.jpg" 
                alt="WIFT Africa" 
                className="h-8 w-auto"
              />
              <span className="text-xl font-bold text-foreground hidden sm:block">
                WIFT Africa
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push('/login')}
              className="px-4 py-2 text-sm border border-border rounded-lg hover:bg-accent"
            >
              Sign In
            </button>
            <button
              onClick={() => router.push('/register')}
              className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
            >
              Join WIFT
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>
    </div>
  )
}