'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/hooks/useAuth'
import { useState } from 'react'
import DashboardHeader from '@/components/layout/DashboardHeader'
import MobileBottomNav from '@/components/layout/MobileBottomNav'

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const { user, isAuthenticated, isEmailVerified, onboardingComplete } = useAuth()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    // Check authentication and onboarding status
    const checkAuth = () => {
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

      // All checks passed
      setIsChecking(false)
    }

    checkAuth()
  }, [isAuthenticated, isEmailVerified, onboardingComplete, router])

  // Show loading while checking auth
  if (isChecking) {
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
      
      {/* Main Content */}
      <main className="pt-16 pb-20 md:pb-0">
        {children}
      </main>
      
      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />
    </div>
  )
}
