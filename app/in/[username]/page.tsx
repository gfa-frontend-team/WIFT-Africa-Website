'use client'

import { useEffect, useMemo } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { isUsernameReserved } from '@/lib/constants/reserved-usernames'
import { useAuth } from '@/lib/hooks/useAuth'
import { useConnections } from '@/lib/hooks/useConnections'
import { usePublicProfile } from '@/lib/hooks/usePublicProfile'
import { useProfile } from '@/lib/hooks/useProfile'
import ProfileLayout from '@/components/layout/ProfileLayout'
import ProfileContent from '@/components/profile/ProfileContent'
import PrivateProfileSections from '@/components/profile/PrivateProfileSections'
import { mapPrivateToPublicProfile } from '@/lib/utils/profile-mapper'
import PublicProfileCTA from '@/components/profile/PublicProfileCTA'

export default function UnifiedProfilePage() {
  const params = useParams()
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()
  const username = params.username as string
  
  const { sendRequest, useRequests, useConnectionStatus, isSending } = useConnections()

  // Determine ownership
  const isOwner = !!(user && (
    (user.username && user.username === username) || 
    user.id === username
  ))

  // 1. Owner Data Query
  const { 
    profile: ownerProfile, 
    user: ownerUser, 
    isLoading: isOwnerLoading,
    isError: isOwnerError
  } = useProfile() 

  // 2. Public Data Query
  const { 
    data: publicProfileData, 
    isLoading: isPublicLoading,
    isError: isPublicError,
    error: publicError
  } = usePublicProfile(username)

  // Handle Reserved Routes
  useEffect(() => {
    if (username && isUsernameReserved(username)) {
      if (username === 'edit') {
        router.replace('/me/edit')
      } else {
        router.replace(`/${username}`)
      }
    }
  }, [username, router])

  // Derived Profile State
  const displayProfile = useMemo(() => {
    if (isOwner && ownerProfile && ownerUser) {
      return mapPrivateToPublicProfile({ user: ownerUser, profile: ownerProfile })
    }
    return publicProfileData
  }, [isOwner, ownerProfile, ownerUser, publicProfileData])

  const isLoading = isOwner ? isOwnerLoading : isPublicLoading
  const isError = isOwner ? isOwnerError : isPublicError

  // Connection Status Logic
  const targetId = displayProfile?.profile.id || displayProfile?.profile._id

  // We unconditionally call hooks, but their query keys/enabled depend on data
  const { data: outgoingRequests } = useRequests('outgoing')
  const { data: connectionStatusData } = useConnectionStatus(targetId)

  const connectionStatus = useMemo(() => {
    if (isOwner || !isAuthenticated || !targetId) return 'NONE'
    
    if (connectionStatusData?.connected) return 'CONNECTED'
    
    // Check pending
    if (outgoingRequests?.requests) {
      const hasPending = outgoingRequests.requests.find(
        r => r.receiver.id === targetId && r.status === 'PENDING'
      )
      if (hasPending) return 'PENDING'
    }
    
    return 'NONE'
  }, [isOwner, isAuthenticated, targetId, connectionStatusData, outgoingRequests])


  // Actions
  const handleConnect = async () => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }

    if (!targetId) return
    try {
       await sendRequest(targetId)
       // React Query invalidation handles UI update
    } catch (error) {
       console.error('Connection request failed', error)
    }
  }

  const handleMessage = () => {
    if (targetId) router.push(`/messages?userId=${targetId}`)
  }

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

  if (isError || !displayProfile) {
    return (
      <ProfileLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-destructive mb-4">Profile not found or validation error.</p>
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
      <ProfileContent
        profile={displayProfile}
        isAuthenticated={isAuthenticated}
        isOwnProfile={isOwner}
        onConnect={handleConnect}
        isConnecting={isSending}
        onMessage={handleMessage}
        connectionStatus={connectionStatus}
      />
      
      {isOwner && ownerProfile && ownerUser && (
        <PrivateProfileSections profile={{ user: ownerUser, profile: ownerProfile }} />
      )}

      {/* Public Profile Call-to-Action */}
      {!isAuthenticated && displayProfile && (
        <PublicProfileCTA firstName={displayProfile.profile.firstName} />
      )}
    </ProfileLayout>
  )
}