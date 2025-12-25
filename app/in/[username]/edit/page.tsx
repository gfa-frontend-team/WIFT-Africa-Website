'use client'

import { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/lib/hooks/useAuth'
import { getProfileEditRedirect } from '@/lib/utils/profileRoutes'

export default function EditProfilePage() {
  const params = useParams()
  const router = useRouter()
  const { user, isAuthenticated, isEmailVerified, onboardingComplete } = useAuth()
  const username = params.username as string

  useEffect(() => {
    // Check if user is authenticated and can edit profiles
    if (!isAuthenticated || !isEmailVerified || !onboardingComplete) {
      router.push('/login')
      return
    }

    // Get the appropriate redirect path
    const redirectPath = getProfileEditRedirect(`/${username}/edit`, user?.username)
    
    if (redirectPath !== `/${username}/edit`) {
      router.push(redirectPath)
    }
  }, [isAuthenticated, isEmailVerified, onboardingComplete, user, username, router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Redirecting...</p>
      </div>
    </div>
  )
}