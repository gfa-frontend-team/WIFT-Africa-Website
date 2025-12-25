'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/hooks/useAuth'
import { useState } from 'react'
import DashboardHeader from '@/components/layout/DashboardHeader'
import MobileBottomNav from '@/components/layout/MobileBottomNav'
import VerificationStatusBanner from '@/components/layout/VerificationStatusBanner'

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const { user, isAuthenticated, isEmailVerified, onboardingComplete, refreshUserData, isLoading } = useAuth()
  // const [isChecking, setIsChecking] = useState(true) // Removed local state in favor of hook state

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

      if (!onboardingComplete) {
        router.push('/onboarding')
        return
      }

      // If user is missing critical fields, try to refresh user data
      if (user && (!user.membershipStatus || !user.accountType)) {
        console.log('🔄 Authenticated layout: Refreshing user data (missing fields)...')
        try {
          await refreshUserData()
        } catch (error) {
          console.warn('⚠️ Failed to refresh user data in authenticated layout:', error)
        }
      }
    }

    checkAuth()
  }, [isAuthenticated, isEmailVerified, onboardingComplete, user, router, refreshUserData, isLoading])

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
  if (!isAuthenticated || !isEmailVerified || !onboardingComplete || !user) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Fixed Header */}
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
