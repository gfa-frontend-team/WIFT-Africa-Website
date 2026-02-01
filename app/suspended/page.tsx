'use client'

import { useAuth } from '@/lib/hooks/useAuth'
import { AlertTriangle, LogOut, Mail } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function SuspendedPage() {
  const { logout, user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // If not authenticated, redirect to login
    if (!isLoading && !isAuthenticated) {
      router.push('/login')
    }

    // If authenticated but NOT suspended, redirect to feed
    if (!isLoading && isAuthenticated && user?.membershipStatus !== 'SUSPENDED') {
      router.push('/feed')
    }
  }, [isLoading, isAuthenticated, user, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-destructive"></div>
      </div>
    )
  }

  // Only render if actually suspended (or while checking in strict mode)
  if (!user || user.membershipStatus !== 'SUSPENDED') {
    return null
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
      <div className="w-full max-w-md text-center space-y-8">
        {/* Logo */}
        <Link href="/" className="inline-block mb-8">
          <img src="/WIFTAFRICA.png" alt="WIFT Africa" className="h-6 w-auto mx-auto" />
        </Link>

        {/* Suspended Card */}
        <div className="bg-card border border-destructive/20 rounded-2xl p-8 shadow-lg">
          <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="h-10 w-10 text-destructive" />
          </div>

          <h1 className="text-2xl font-bold text-foreground mb-4">Account Suspended</h1>

          <div className="space-y-4 text-muted-foreground mb-8">
            <p>
              Your account has been suspended due to a violation of our terms of service or community guidelines.
            </p>
            <p className="text-sm">
              While suspended, you cannot access your profile, dashboard, or interact with other members.
            </p>
          </div>

          <div className="space-y-4">
            <a
              href="mailto:support@wiftafrica.com"
              className="w-full flex items-center justify-center px-4 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              <Mail className="w-4 h-4 mr-2" />
              Contact Support
            </a>

            <button
              onClick={() => logout().then(() => router.push('/login'))}
              className="w-full flex items-center justify-center px-4 py-3 border border-border bg-background hover:bg-accent rounded-lg font-medium transition-colors"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </button>
          </div>
        </div>

        <p className="text-xs text-muted-foreground">
          If you believe this is a mistake, please contact our support team immediately.
        </p>
      </div>
    </div>
  )
}
