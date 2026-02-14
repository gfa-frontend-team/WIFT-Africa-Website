'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/hooks/useAuth'
import { Loader2 } from 'lucide-react'

export default function MeEditRedirectPage() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading } = useAuth()

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.replace('/login')
      } else if (user?.username || user?.id) {
        // Prefer username, fallback to ID
        router.replace(`/in/${user.username || user.id}/edit`)
      } else {
        // Fallback for weird state, go to feed
        router.replace('/feed')
      }
    }
  }, [user, isAuthenticated, isLoading, router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
        <p className="text-muted-foreground">Redirecting to profile editor...</p>
      </div>
    </div>
  )
}
