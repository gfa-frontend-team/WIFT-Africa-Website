'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/hooks/useAuth'

/**
 * Root page - Redirects based on authentication state
 * - Authenticated users → /feed
 * - Unauthenticated users → /login
 * Only redirects once to prevent loops
 */
export default function RootPage() {
  const router = useRouter()
  const { isAuthenticated } = useAuth()
  const [hasRedirected, setHasRedirected] = useState(false)

  useEffect(() => {
    if (!hasRedirected) {
      if (isAuthenticated) {
        router.replace('/feed')
      } else {
        router.replace('/login')
      }
      setHasRedirected(true)
    }
  }, [isAuthenticated, router, hasRedirected])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  )
}
