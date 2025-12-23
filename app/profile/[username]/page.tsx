'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { profilesApi, type PublicProfileResponse } from '@/lib/api/profiles'
import { useAuth } from '@/lib/hooks/useAuth'
import ProfileLayout from '@/components/layout/ProfileLayout'
import ProfileContent from '@/components/profile/ProfileContent'

export default function PublicProfilePage() {
  const params = useParams()
  const { user, isAuthenticated } = useAuth()
  const username = params.username as string
  
  const [profile, setProfile] = useState<PublicProfileResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Check if user is viewing their own profile based on loaded profile data
  const isViewingOwnProfile = !!(profile && user && profile.profile.email === user.email)

  useEffect(() => {
    console.log('PublicProfilePage - params:', params)
    console.log('PublicProfilePage - username:', username)
    
    const loadProfile = async () => {
      try {
        setIsLoading(true)
        setError(null)
        console.log('Loading profile for username:', username)
        const data = await profilesApi.getPublicProfile(username)
        console.log('Profile loaded successfully:', data)
        setProfile(data)
      } catch (err: unknown) {
        console.error('Failed to load profile:', err)
        const error = err as { response?: { data?: { error?: string } } }
        console.error('Error response:', error.response)
        setError(error.response?.data?.error || 'Profile not found')
      } finally {
        setIsLoading(false)
      }
    }
    
    if (username) {
      loadProfile()
    }
  }, [username, params])

  const handleConnect = () => {
    // TODO: Implement connection request
    console.log('Connect with user')
  }

  const handleMessage = () => {
    // TODO: Implement messaging
    console.log('Message user')
  }

  if (isLoading) {
    return (
      <ProfileLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Loading profile...</p>
          </div>
        </div>
      </ProfileLayout>
    )
  }

  if (error || !profile) {
    return (
      <ProfileLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-destructive mb-4">{error || 'Profile not found'}</p>
            <button
              onClick={() => window.history.back()}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
            >
              Go Back
            </button>
          </div>
        </div>
      </ProfileLayout>
    )
  }

  return (
    <ProfileLayout>
      <ProfileContent
        profile={profile}
        isAuthenticated={isAuthenticated}
        isOwnProfile={isViewingOwnProfile}
        onConnect={handleConnect}
        onMessage={handleMessage}
      />
    </ProfileLayout>
  )
}