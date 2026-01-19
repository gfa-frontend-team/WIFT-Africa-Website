import { Camera, MapPin, Users, CheckCircle, Edit3, Loader2 } from 'lucide-react'
import Image from 'next/image'
import { useState, useRef } from 'react'
import { usersApi } from '@/lib/api/users'
// import { User, Profile } from '@/types' // usage replaced by local interfaces
import BadgeDisplay from './BadgeDisplay'
import ProfileStats from './ProfileStats'
import { toast } from 'sonner'

// Flexible interfaces matching the passed data
interface ProfileHeaderUser {
  firstName: string
  lastName: string
  profilePhoto?: string
  bannerUrl?: string
  membershipStatus?: string
  chapter?: {
    name: string
  }
}

interface ProfileHeaderProfile {
  headline?: string
  primaryRole?: string
  roles?: string[]
  location?: string
  bannerUrl?: string
}

interface ProfileHeaderProps {
  user: ProfileHeaderUser
  profile: ProfileHeaderProfile
  isOwner: boolean
  connectionStatus: 'NONE' | 'CONNECTED' | 'PENDING' | 'INCOMING'
  connectionsCount: number
  postsCount: number
  viewsCount?: number
  onConnect?: (message?: string) => void
  onAccept?: () => void
  onDecline?: () => void
  isConnecting?: boolean
  onMessage?: () => void
  onEdit?: () => void
}

export default function ProfileHeader({
  user: initialUser,
  profile: initialProfile,
  isOwner,
  connectionStatus,
  connectionsCount,
  postsCount,
  viewsCount = 0,
  onConnect,
  onAccept,
  onDecline,
  isConnecting = false,
  onMessage,
  onEdit
}: ProfileHeaderProps) {
  const [user, setUser] = useState(initialUser)
  const [profile, setProfile] = useState(initialProfile)
  const [isUploadingBanner, setIsUploadingBanner] = useState(false)
  const bannerInputRef = useRef<HTMLInputElement>(null)

  // Use profile banner first, fallback to user banner (legacy support)
  const bannerUrl = profile.bannerUrl || user.bannerUrl

  // Helper for chapter display
  const chapterName = user.chapter?.name || 'WIFT Africa'
  
  // Helper for roles
  const roles = profile.roles || []
  const primaryRole = profile.primaryRole || roles[0] || 'Member'

  const handleBannerClick = () => {
    bannerInputRef.current?.click()
  }

  const handleBannerUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validation
    const validTypes = ['image/jpeg', 'image/png', 'image/webp']
    if (!validTypes.includes(file.type)) {
      toast.error("Invalid file type", {
        description: "Please upload a JPG, PNG, or WebP image."
      })
      return
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB
      toast.error("File too large", {
        description: "Image must be less than 5MB."
      })
      return
    }

    setIsUploadingBanner(true)
    try {
      const response = await usersApi.uploadProfileBanner(file)
      // Update local state - assuming backend updates the PROFILE bannerUrl
      setProfile(prev => ({ ...prev, bannerUrl: response.photoUrl }))
      // Also update user state just in case of fallback usage
      setUser(prev => ({ ...prev, bannerUrl: response.photoUrl }))
      
      toast.success("Success", {
        description: "Cover photo updated successfully."
      })
    } catch (error) {
      console.error('Failed to upload banner:', error)
      toast.error("Error", {
        description: "Failed to upload cover photo. Please try again."
      })
    } finally {
      setIsUploadingBanner(false)
      // Reset input
      if (bannerInputRef.current) {
        bannerInputRef.current.value = ''
      }
    }
  }

  return (
    <div className="mb-6">
      <input 
        type="file" 
        ref={bannerInputRef}
        onChange={handleBannerUpload}
        className="hidden" 
        accept="image/jpeg,image/png,image/webp"
      />

      {/* Header Banner */}
      <div className="relative bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 rounded-t-2xl h-48 overflow-hidden group">
        {bannerUrl ? (
          <Image 
            src={bannerUrl} 
            alt="Cover Photo" 
            fill 
            className="object-cover"
            priority
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent rounded-t-2xl" />
        )}
        
        {isOwner && (
          <button 
            onClick={handleBannerClick}
            disabled={isUploadingBanner}
            className="absolute top-4 right-4 p-2 bg-white/80 hover:bg-white rounded-full transition-colors backdrop-blur-sm shadow-sm md:opacity-0 md:group-hover:opacity-100"
            title="Update Cover Photo"
          >
            {isUploadingBanner ? (
              <Loader2 className="h-5 w-5 text-primary animate-spin" />
            ) : (
              <Camera className="h-5 w-5 text-gray-700" />
            )}
          </button>
        )}
      </div>

      {/* Profile Info Container */}
      <div className="bg-card border border-border rounded-b-2xl -mt-6 relative shadow-sm">
        <div className="p-8">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Profile Photo - Overlapping */}
            <div className="relative -mt-16 md:-mt-20 flex-shrink-0">
              <div className="border-4 border-card rounded-full bg-background h-32 w-32 overflow-hidden relative">
                 {user.profilePhoto ? (
                    <Image 
                      src={user.profilePhoto} 
                      alt={`${user.firstName} ${user.lastName}`}
                      fill
                      className="object-cover"
                    />
                 ) : (
                    <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary text-4xl font-bold">
                        {user.firstName?.[0]}
                    </div>
                 )}
              </div>
              {isOwner && (
                <button 
                  onClick={onEdit} // In real app, might trigger photo upload modal directly
                  className="absolute bottom-2 right-2 p-2 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors shadow-md"
                  title="Update Profile Photo"
                >
                  <Camera className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Profile Details */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold text-foreground mb-1">
                    {user.firstName} {user.lastName}
                  </h1>
                  <p className="text-xl text-muted-foreground mb-3 font-medium">
                    {profile.headline || primaryRole}
                  </p>
                  
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-muted-foreground mb-4">
                    {profile.location && (
                      <div className="flex items-center gap-1.5">
                        <MapPin className="h-4 w-4" />
                        <span>{profile.location}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-1.5">
                      <Users className="h-4 w-4" />
                      <span>{chapterName}</span>
                      {user.membershipStatus === 'APPROVED' && (
                        <CheckCircle className="h-3 w-3 text-green-500 ml-0.5" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  {isOwner ? (
                    <button 
                      onClick={onEdit}
                      className="flex items-center gap-2 px-4 py-2 bg-background border border-border rounded-lg hover:bg-accent transition-colors font-medium text-sm"
                    >
                      <Edit3 className="h-4 w-4" />
                      <span>Edit Profile</span>
                    </button>
                  ) : (
                    <>
                      {connectionStatus === 'CONNECTED' ? (
                        <button 
                          onClick={onMessage}
                          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium text-sm"
                        >
                          Message
                        </button>
                      ) : connectionStatus === 'PENDING' ? (
                        <button 
                          disabled
                          className="px-4 py-2 bg-muted text-muted-foreground rounded-lg font-medium text-sm cursor-not-allowed"
                        >
                          Request Pending
                        </button>
                      ) : connectionStatus === 'INCOMING' ? (
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => onAccept?.()}
                            disabled={isConnecting}
                            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium text-sm"
                          >
                            Accept Request
                          </button>
                          <button 
                            onClick={() => onDecline?.()}
                            disabled={isConnecting}
                            className="px-4 py-2 bg-background border border-border text-foreground rounded-lg hover:bg-accent transition-colors font-medium text-sm"
                          >
                            Decline
                          </button>
                        </div>
                      ) : (
                        <button 
                          onClick={() => onConnect?.()}
                          disabled={isConnecting}
                          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium text-sm disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                          {isConnecting ? (
                            <>
                              <span className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                              <span>Connecting...</span>
                            </>
                          ) : (
                            <span>Connect</span>
                          )}
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>

               {/* Badges & Stats */}
               <div className="mt-4">
                 <BadgeDisplay />
                 <ProfileStats 
                   connectionsCount={connectionsCount} 
                   postsCount={postsCount}
                   viewsCount={viewsCount}
                   isOwner={isOwner}
                 />
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
