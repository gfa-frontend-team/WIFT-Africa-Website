import { Camera, MapPin, Users, CheckCircle, Edit3, Loader2 } from 'lucide-react'
import Image from 'next/image'
import { useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'
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
  const { t } = useTranslation()
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
  const primaryRole = profile.primaryRole || roles[0] || t('profile.header.member')

  const handleBannerClick = () => {
    bannerInputRef.current?.click()
  }

  const handleBannerUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validation
    const validTypes = ['image/jpeg', 'image/png', 'image/webp']
    if (!validTypes.includes(file.type)) {
      toast.error(t('profile.header.upload_error_type'), {
        description: t('profile.header.upload_error_type_desc')
      })
      return
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB
      toast.error(t('profile.header.upload_error_size'), {
        description: t('profile.header.upload_error_size_desc')
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

      toast.success(t('profile.header.upload_success'), {
        description: t('profile.header.upload_success_desc')
      })
    } catch (error) {
      console.error('Failed to upload banner:', error)
      toast.error(t('profile.header.upload_error'), {
        description: t('profile.header.upload_error_desc')
      })
    } finally {
      setIsUploadingBanner(false)
      // Reset input
      if (bannerInputRef.current) {
        bannerInputRef.current.value = ''
      }
    }
  }

  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false)
  const photoInputRef = useRef<HTMLInputElement>(null)

  const handlePhotoClick = () => {
    photoInputRef.current?.click()
  }

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validation
    const validTypes = ['image/jpeg', 'image/png', 'image/webp']
    if (!validTypes.includes(file.type)) {
      toast.error(t('profile.header.upload_error_type'))
      return
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB
      toast.error(t('profile.header.upload_error_size'))
      return
    }

    setIsUploadingPhoto(true)
    try {
      const response = await usersApi.uploadProfilePhoto(file)
      setUser(prev => ({ ...prev, profilePhoto: response.photoUrl }))
      toast.success(t('profile.header.upload_success'))
    } catch (error) {
      console.error('Failed to upload photo:', error)
      toast.error(t('profile.header.upload_error'))
    } finally {
      setIsUploadingPhoto(false)
      if (photoInputRef.current) photoInputRef.current.value = ''
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
      <input
        type="file"
        ref={photoInputRef}
        onChange={handlePhotoUpload}
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
            className="absolute top-4 right-4 p-2 bg-background/80 hover:bg-background rounded-full transition-colors backdrop-blur-sm shadow-sm md:opacity-0 md:group-hover:opacity-100"
            title={t('profile.header.update_cover')}
          >
            {isUploadingBanner ? (
              <Loader2 className="h-5 w-5 text-primary animate-spin" />
            ) : (
              <Camera className="h-5 w-5 text-foreground" />
            )}
          </button>
        )}
      </div>

      {/* Profile Info Container */}
      <div className="bg-card border border-border rounded-b-2xl -mt-6 relative shadow-sm">
        <div className="p-8">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Profile Photo Wrapper - Explicit sizing for absolute positioning context */}
            <div className="relative -mt-16 md:-mt-20 flex-shrink-0 h-32 w-32">
              <div className="h-full w-full rounded-full bg-background overflow-hidden border-4 border-card relative z-0">
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
                  onClick={handlePhotoClick}
                  disabled={isUploadingPhoto}
                  className="absolute bottom-1 right-1 p-2 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-all shadow-lg border-[3px] border-card z-10 flex items-center justify-center"
                  title={t('profile.header.update_photo')}
                >
                  {isUploadingPhoto ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Camera className="h-4 w-4" />
                  )}
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
                      <span>{t('profile.header.edit_profile')}</span>
                    </button>
                  ) : (
                    <>
                      {connectionStatus === 'CONNECTED' ? (
                        <button
                          onClick={onMessage}
                          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium text-sm"
                        >
                          {t('profile.header.message')}
                        </button>
                      ) : connectionStatus === 'PENDING' ? (
                        <button
                          disabled
                          className="px-4 py-2 bg-muted text-muted-foreground rounded-lg font-medium text-sm cursor-not-allowed"
                        >
                          {t('profile.header.pending')}
                        </button>
                      ) : connectionStatus === 'INCOMING' ? (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => onAccept?.()}
                            disabled={isConnecting}
                            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium text-sm"
                          >
                            {t('profile.header.accept')}
                          </button>
                          <button
                            onClick={() => onDecline?.()}
                            disabled={isConnecting}
                            className="px-4 py-2 bg-background border border-border text-foreground rounded-lg hover:bg-accent transition-colors font-medium text-sm"
                          >
                            {t('profile.header.decline')}
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
                              <span>{t('profile.header.connecting')}</span>
                            </>
                          ) : (
                            <span>{t('profile.header.connect')}</span>
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
