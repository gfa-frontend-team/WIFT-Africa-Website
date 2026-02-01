'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/hooks/useAuth'
import { useState } from 'react'
import dynamic from 'next/dynamic'

const DashboardHeader = dynamic(() => import('@/components/layout/DashboardHeader'))
const MobileBottomNav = dynamic(() => import('@/components/layout/MobileBottomNav'))
const VerificationStatusBanner = dynamic(() => import('@/components/layout/VerificationStatusBanner'))

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const { user, isAuthenticated, isEmailVerified, onboardingComplete, refreshUserData, isLoading } = useAuth()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])



  useEffect(() => {
    // Only check auth when hydration is done
    if (isLoading) return

    const checkAuth = async () => {
      if (!isAuthenticated) {
        router.push('/login')
        return
      }

      if (!isEmailVerified) {
        router.push('/verify-email')
        return
      }

      // Check suspension status BEFORE onboarding check
      // This prevents suspended users from even seeing onboarding if they got banned early
      if (user?.membershipStatus === 'SUSPENDED') {
        router.push('/suspended')
        return
      }

      if (!onboardingComplete) {
        router.push('/onboarding')
        return
      }
    }

    checkAuth()
  }, [isAuthenticated, isEmailVerified, onboardingComplete, router])

  if (!mounted) return null

  // Show loading while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  // Don't render if not authenticated (will redirect)
  // Also block render if suspended to prevent flash of content
  if (!isAuthenticated || !isEmailVerified || !onboardingComplete || !user || user.membershipStatus === 'SUSPENDED') {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Fixed Header */}
      <DashboardHeader user={user} />

      {/* Verification Status Banner */}
      <VerificationStatusBanner />

      {/* Main Content */}
      <main className="pt-16 pb-20 lg:pb-0">
        {children}
      </main>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />
    </div>
  )
}
