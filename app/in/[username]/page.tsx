'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { profilesApi, type PublicProfileResponse } from '@/lib/api/profiles'
import { isUsernameReserved } from '@/lib/constants/reserved-usernames'
import { useAuth } from '@/lib/hooks/useAuth'
import { useConnectionStore } from '@/lib/stores/connectionStore'
import { useRouter } from 'next/navigation'
import ProfileLayout from '@/components/layout/ProfileLayout'
import ProfileContent from '@/components/profile/ProfileContent'

export default function PublicProfilePage() {
  const params = useParams()
  const { user, isAuthenticated } = useAuth()
  const username = params.username as string
  const router = useRouter()

  // Handle reserved usernames (smart redirect)
  useEffect(() => {
    // Only check if we have a username and it's not a loading state
    if (username && isUsernameReserved(username)) {
      if (username === 'edit') {
        router.replace('/me/edit')
      } else {
        router.replace(`/${username}`)
      }
    }
  }, [username, router])

  // If reserved, show nothing while redirecting
  if (isUsernameReserved(username)) {
    return null
  }
  
  const { checkConnection, sendRequest, requests, fetchRequests } = useConnectionStore()
  
  const [profile, setProfile] = useState<PublicProfileResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [connectionStatus, setConnectionStatus] = useState<'NONE' | 'PENDING' | 'CONNECTED'>('NONE')

  // Check if user is viewing their own profile based on loaded profile data
  const isViewingOwnProfile = !!(profile && user && profile.profile.email === user.email)

  useEffect(() => {
    const loadProfileAndConnection = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        // Load profile first
        const data = await profilesApi.getPublicProfile(username)
        setProfile(data)

        // If authenticated and not own profile, check connection status
        if (isAuthenticated && user && data.profile.id !== user.id) {
            // Check established connection
            const isConnected = await checkConnection(data.profile.id)
            if (isConnected) {
                setConnectionStatus('CONNECTED')
            } else {
                // Check if there is a pending outgoing request
                // We ensure requests are loaded (or we could fetch just outgoing)
                await fetchRequests('outgoing')
                // Note: fetchRequests updates the store, we need to read from store state. 
                // However, we can't read 'requests' from state immediately inside this async function if it's from the hook reference closing over initial state? 
                // Actually 'requests' from useConnectionStore() will update on re-render. 
                // But we can check the *result* if fetchRequests returned it, but it returns void.
                // Better: checkConnectionStore state in a separate effect or use get() in store.
                // For now, let's just optimistically rely on checkStatus and if false, wait for store actions?
                // Actually, let's just use the store's requests list if it's already populated or wait for it.
                // Simple hack: Assume 'NONE' and let the store sync update it? 
                // No, we want to set it correctly.
                // Let's rely on a separate specific check or just the boolean for connected.
                // For pending... we need the list.
                // Let's peek at the store state directly via the hook in the component body
            }
        }
      } catch (err: unknown) {
        console.error('Failed to load profile:', err)
        const error = err as { response?: { data?: { error?: string } } }
        setError(error.response?.data?.error || 'Profile not found')
      } finally {
        setIsLoading(false)
      }
    }
    
    if (username) {
        loadProfileAndConnection()
    }
  }, [username, isAuthenticated, user?.id])

  // Sync pending status from requests list
  useEffect(() => {
    if (profile && requests.length > 0 && connectionStatus !== 'CONNECTED') {
        const hasPending = requests.find(r => 
            (r.receiver.id === profile.profile.id || r.sender.id === profile.profile.id) && 
            r.status === 'PENDING'
        )
        if (hasPending) {
            setConnectionStatus('PENDING')
        }
    }
  }, [requests, profile, connectionStatus])

  const handleConnect = async () => {
    if (!profile) return
    try {
        const targetId = profile.profile.id || profile.profile._id
        if (!targetId) throw new Error('User ID not found')
        await sendRequest(targetId)
        setConnectionStatus('PENDING')
    } catch (error) {
        console.error('Failed to send request:', error)
        alert('Failed to send connection request')
    }
  }

  const handleMessage = () => {
    if (!profile) return
    router.push(`/messages?userId=${profile.profile.id}`)
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
        connectionStatus={connectionStatus}
      />
    </ProfileLayout>
  )
}