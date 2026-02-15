'use client'

import { useState, useEffect, useMemo } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { isUsernameReserved } from '@/lib/constants/reserved-usernames'
import { useAuth } from '@/lib/hooks/useAuth'
import { useConnections } from '@/lib/hooks/useConnections'
import ConnectModal from '@/components/connections/ConnectModal'
import { usePublicProfile } from '@/lib/hooks/usePublicProfile'
import { useProfile } from '@/lib/hooks/useProfile'
import { useQuery } from '@tanstack/react-query'
import { profilesApi } from '@/lib/api/profiles'
import ProfileLayout from '@/components/layout/ProfileLayout'
import ProfileContent from '@/components/profile/ProfileContent'
import PrivateProfileSections from '@/components/profile/PrivateProfileSections'
import { mapPrivateToPublicProfile } from '@/lib/utils/profile-mapper'
import PublicProfileCTA from '@/components/profile/PublicProfileCTA'
import { useAnalytics } from '@/lib/hooks/useAnalytics'
import { useRecordProfileView } from '@/lib/hooks/useProfileAnalytics'

export default function UnifiedProfilePage() {
  const params = useParams()
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()
  const username = params.username as string
  
  const { sendRequest, respondToRequest, useConnectionStatus, useStats, isSending, isResponding } = useConnections()

  // Determine ownership
  const isOwner = !!(user && (
    (user.username && user.username === username) || 
    user.id === username
  ))

  // Local state for optimistic updates
  const [localConnectionStatus, setLocalConnectionStatus] = useState<'PENDING' | null>(null)

  // Reset local state when profile changes
  useEffect(() => {
    setLocalConnectionStatus(null)
  }, [username]) // username or targetId, but targetId is derived later. using username or moving targetId up. catch: targetId is derived at line 77.

  // 1. Owner Data Query
  const { 
    profile: ownerProfile, 
    user: ownerUser, 
    isLoading: isOwnerLoading,
    isError: isOwnerError
  } = useProfile() 

const { mutate } = useRecordProfileView()
  
  // 2. Public Data Query
  const { 
    data: publicProfileData, 
    isLoading: isPublicLoading,
    isError: isPublicError,
    error: publicError
  } = usePublicProfile(username, { 
    enabled: !isUsernameReserved(username) 
  })
  
  // console.log(publicProfileData,"publicProfileData",isOwnerError)

  useEffect(() => {
  if (!publicProfileData?.profile?.id) return
  if (isOwner) return

  mutate(publicProfileData?.profile?.id)
}, [publicProfileData?.profile?.id,isOwner])

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
  const { data: connectionStatusData, refetch: refetchStatus } = useConnectionStatus(targetId)
  
  // Stats for Owner
  const { data: myStats } = useStats()

  // Fetch Views for Owner (align with Analytics page default of 90 days)
  const { data: profileViews } = useQuery({
    queryKey: ['profile-views', user?.id, '90days'],
    queryFn: () => profilesApi.getProfileViews(user!.id, false),
    enabled: !!isOwner && !!user?.id,
  })
  
  const { useUserPostsStats } = useAnalytics()
  const { data: myPostsStats } = useUserPostsStats()
  
  const connectionsCount = isOwner ? (myStats?.connectionsCount || 0) : (displayProfile?.profile?.stats?.connectionsCount || 0)
  const postsCount = isOwner ? (myPostsStats?.total || 0) : (displayProfile?.profile?.stats?.postsCount || 0) 


  


  const connectionStatus = useMemo(() => {
    if (isOwner || !isAuthenticated || !targetId) return 'NONE'
    
    // Optimistic update
    if (localConnectionStatus === 'PENDING') return 'PENDING'

    // Status from backend
    if (connectionStatusData) {
        if (connectionStatusData.status === 'CONNECTED') return 'CONNECTED'
        if (connectionStatusData.status === 'PENDING_INCOMING') return 'INCOMING'
        if (connectionStatusData.status === 'PENDING_OUTGOING') return 'PENDING'
    }
    
    return 'NONE'
  }, [isOwner, isAuthenticated, targetId, connectionStatusData, localConnectionStatus])


  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false)


  // Actions
  const handleConnect = async (message?: string) => {
    if (!isAuthenticated) {
      router.push('/login')
      return;
    }

    if (!targetId) return;
    
    // If we have a message, it's a confirmed send from the modal
    if (message !== undefined) {
        try {
            await sendRequest(targetId, message)
            setLocalConnectionStatus('PENDING')
            setIsConnectModalOpen(false)
            toast.success('Connection request sent')
        } catch (error) {
            console.error('Connection request failed', error)
            toast.error('Failed to send connection request')
        }
        return
    }

    // Otherwise open modal
    setIsConnectModalOpen(true)
  }

  const handleAccept = async () => {
      const requestId = connectionStatusData?.requestId
      if (!requestId) return

      try {
          await respondToRequest(requestId, 'accept')
          toast.success('Connection accepted')
          refetchStatus()
      } catch (error) {
          console.error('Failed to accept request', error)
          toast.error('Failed to accept connection request')
      }
  }

  const handleDecline = async () => {
      const requestId = connectionStatusData?.requestId
      if (!requestId) return

      try {
          await respondToRequest(requestId, 'decline')
          toast.success('Connection request declined')
          refetchStatus()
      } catch (error) {
          console.error('Failed to decline request', error)
          toast.error('Failed to decline connection request')
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
        onAccept={handleAccept}
        onDecline={handleDecline}
        isConnecting={isSending || isResponding}
        onMessage={handleMessage}
        connectionStatus={connectionStatus}
        connectionsCount={connectionsCount}
        postsCount={postsCount}
        viewsCount={isOwner ? (profileViews?.count || 0) : undefined}
      />
      
      {targetId && (
        <ConnectModal
          isOpen={isConnectModalOpen}
          onClose={() => setIsConnectModalOpen(false)}
          onConfirm={handleConnect}
          recipientName={displayProfile?.profile.firstName || 'User'}
          isSending={isSending}
        />
      )}
      

      
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