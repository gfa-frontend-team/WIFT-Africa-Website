'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { profilesApi, type PublicProfileResponse } from '@/lib/api/profiles'
import { usersApi } from '@/lib/api/users'
import { isUsernameReserved } from '@/lib/constants/reserved-usernames'
import { useAuth } from '@/lib/hooks/useAuth'
import { useConnectionStore } from '@/lib/stores/connectionStore'
import ProfileLayout from '@/components/layout/ProfileLayout'
import ProfileContent from '@/components/profile/ProfileContent'
import PrivateProfileSections from '@/components/profile/PrivateProfileSections'
import { mapPrivateToPublicProfile } from '@/lib/utils/profile-mapper'
import type { UserProfileResponse } from '@/lib/api/users'

export default function UnifiedProfilePage() {
  const params = useParams()
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()
  const username = params.username as string
  
  // Connection store actions
  const { checkConnection, sendRequest, requests, fetchRequests } = useConnectionStore()

  // State
  const [profile, setProfile] = useState<PublicProfileResponse | null>(null)
  const [privateProfileData, setPrivateProfileData] = useState<UserProfileResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [connectionStatus, setConnectionStatus] = useState<'NONE' | 'PENDING' | 'CONNECTED'>('NONE')

  // Handle reserved usernames (smart redirect)
  useEffect(() => {
    if (username && isUsernameReserved(username)) {
      if (username === 'edit') {
        router.replace('/me/edit')
      } else {
        router.replace(`/${username}`)
      }
    }
  }, [username, router])

  // Determine ownership
  // We check if the route username matches the logged-in user's username OR ID (in case of fallback links)
  const isOwner = !!(user && (
    (user.username && user.username === username) || 
    user.id === username
  ))

  useEffect(() => {
    const loadProfileData = async () => {
      // If reserved, do nothing (will redirect)
      if (isUsernameReserved(username)) return

      try {
        setIsLoading(true)
        setError(null)

        if (isOwner) {
          // ==============================
          // OWNER VIEW: Fetch Private Data
          // ==============================
          const fullProfile = await usersApi.getProfile()
          console.log('Owner Profile Fetch Result:', fullProfile) // Debug log
          
          if (!fullProfile) throw new Error('Failed to fetch private profile')
          
          setPrivateProfileData(fullProfile)
          
          // Map to public structure for the shared component
          const mappedPublic = mapPrivateToPublicProfile(fullProfile)
          console.log('Mapped Owner Profile:', mappedPublic) // Debug log
          setProfile(mappedPublic)
          
        } else {
          // ==============================
          // VISITOR VIEW: Fetch Public Data
          // ==============================
          const publicData = await profilesApi.getPublicProfile(username)
          console.log('Public Profile Fetch Result:', publicData) // Debug log
          setProfile(publicData)

          // Check if we accidentally fetched our own public profile (e.g. visited via ID or different casing)
          if (user && (publicData.profile.id === user.id || publicData.profile._id === user.id)) {
             console.log('Detected own profile via public fetch, correcting mode...')
             // We can either redirect to proper /in/username or just load private data here.
             // For now, let's lazy load the private data to give the "Owner" experience
             try {
                const fullProfile = await usersApi.getProfile()
                setPrivateProfileData(fullProfile) 
                // We keep the public profile state as is or map it, but adding private data enables the "Owner" UI checks
             } catch (e) {
                console.error('Failed to upgrade to owner view', e)
             }
             return // Stop processing as visitor
          }

          // Check connection status if authenticated visitor
          if (isAuthenticated && user && publicData.profile) {
             const targetId = publicData.profile.id || publicData.profile._id
             
             if (targetId && targetId !== user.id) {
                const isConnected = await checkConnection(targetId)
                if (isConnected) {
                  setConnectionStatus('CONNECTED')
                } else {
                  // Check for pending requests
                  await fetchRequests('outgoing')
                }
             }
          }
        }
      } catch (err: any) {
        console.error('Failed to load profile:', err)
        setError(err.response?.data?.error || 'Profile not found')
      } finally {
        setIsLoading(false)
      }
    }

    if (username) {
      loadProfileData()
    }
  }, [username, isOwner, isAuthenticated, user, checkConnection, fetchRequests])

  // Sync pending status from requests list (for visitors)
  useEffect(() => {
    if (profile && !isOwner && requests.length > 0 && connectionStatus !== 'CONNECTED') {
      const hasPending = requests.find(r => 
        (r.receiver.id === profile.profile.id || r.sender.id === profile.profile.id) && 
        r.status === 'PENDING'
      )
      if (hasPending) {
        setConnectionStatus('PENDING')
      }
    }
  }, [requests, profile, connectionStatus, isOwner])

  // Actions
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
    const targetId = profile.profile.id || profile.profile._id
    if (!targetId) {
      console.error('No ID found for message target')
      return
    }
    router.push(`/messages?userId=${targetId}`)
  }

  // Loading State
  if (isLoading || isUsernameReserved(username)) {
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

  // Error State
  if (error || !profile) {
    return (
      <ProfileLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-destructive mb-4">{error || 'Profile not found'}</p>
            <button
              onClick={() => router.push('/feed')}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
            >
              Go to Feed
            </button>
          </div>
        </div>
      </ProfileLayout>
    )
  }

  return (
    <ProfileLayout>
      {/* Main Profile Content (Shared) */}
      <ProfileContent
        profile={profile}
        isAuthenticated={isAuthenticated}
        isOwnProfile={isOwner || (!!user && !!profile && (user.id === profile.profile.id || user.id === profile.profile._id))}
        onConnect={handleConnect}
        onMessage={handleMessage}
        connectionStatus={connectionStatus}
      />
      
      {/* Owner-Only Private Sections */}
      {(isOwner || (!!user && !!profile && (user.id === profile.profile.id || user.id === profile.profile._id))) && privateProfileData && (
        <PrivateProfileSections profile={privateProfileData} />
      )}
    </ProfileLayout>
  )
}