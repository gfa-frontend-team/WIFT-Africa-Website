'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { profilesApi, type PublicProfileResponse } from '@/lib/api/profiles'
import { 
  User, 
  MapPin, 
  Link as LinkIcon, 
  Briefcase, 
  Loader2,
  MessageCircle,
  UserPlus,
  Share2
} from 'lucide-react'

export default function PublicProfilePage() {
  const params = useParams()
  const router = useRouter()
  const username = params.username as string
  
  const [profile, setProfile] = useState<PublicProfileResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    console.log('PublicProfilePage - params:', params)
    console.log('PublicProfilePage - username:', username)
    
    if (username) {
      loadProfile()
    }
  }, [username])

  const loadProfile = async () => {
    try {
      setIsLoading(true)
      setError(null)
      console.log('Loading profile for username:', username)
      const data = await profilesApi.getPublicProfile(username)
      console.log('Profile loaded successfully:', data)
      setProfile(data)
    } catch (err: any) {
      console.error('Failed to load profile:', err)
      console.error('Error response:', err.response)
      setError(err.response?.data?.error || 'Profile not found')
    } finally {
      setIsLoading(false)
    }
  }

  const handleConnect = () => {
    // TODO: Implement connection request
    console.log('Connect with user')
  }

  const handleMessage = () => {
    // TODO: Implement messaging
    console.log('Message user')
  }

  const handleShare = async () => {
    const url = window.location.href
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${profile?.profile.firstName} ${profile?.profile.lastName} - WIFT Africa`,
          text: `Check out ${profile?.profile.firstName}'s profile on WIFT Africa`,
          url
        })
      } catch (err) {
        console.error('Failed to share:', err)
      }
    } else {
      try {
        await navigator.clipboard.writeText(url)
        alert('Profile link copied to clipboard!')
      } catch (err) {
        console.error('Failed to copy:', err)
      }
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-4">{error || 'Profile not found'}</p>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  const { profile: profileData } = profile

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="bg-card border border-border rounded-lg p-8 mb-6">
          <div className="flex items-start gap-6">
            {/* Profile Photo */}
            <div className="flex-shrink-0">
              {profileData.profilePhoto ? (
                <img
                  src={profileData.profilePhoto}
                  alt={`${profileData.firstName} ${profileData.lastName}`}
                  className="w-32 h-32 rounded-full object-cover border-4 border-primary/20"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-primary/10 flex items-center justify-center border-4 border-primary/20">
                  <User className="h-16 w-16 text-primary/50" />
                </div>
              )}
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-foreground mb-2">
                {profileData.firstName} {profileData.lastName}
              </h1>
              
              {profileData.headline && (
                <p className="text-xl text-muted-foreground mb-4">{profileData.headline}</p>
              )}

              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                {profileData.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    {profileData.location}
                  </div>
                )}
                {profileData.primaryRole && (
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4" />
                    {profileData.primaryRole}
                  </div>
                )}
              </div>

              {/* Roles */}
              {profileData.roles && profileData.roles.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {profileData.roles.map((role) => (
                    <span
                      key={role}
                      className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium"
                    >
                      {role}
                    </span>
                  ))}
                  {profileData.isMultihyphenate && (
                    <span className="px-3 py-1 bg-accent text-accent-foreground rounded-full text-sm font-medium">
                      Multihyphenate
                    </span>
                  )}
                </div>
              )}

              {/* Availability Status */}
              {profileData.availabilityStatus && (
                <div className="mb-4">
                  <span
                    className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                      profileData.availabilityStatus === 'AVAILABLE'
                        ? 'bg-green-100 text-green-800'
                        : profileData.availabilityStatus === 'BUSY'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${
                        profileData.availabilityStatus === 'AVAILABLE'
                          ? 'bg-green-600'
                          : profileData.availabilityStatus === 'BUSY'
                          ? 'bg-yellow-600'
                          : 'bg-gray-600'
                      }`}
                    />
                    {profileData.availabilityStatus === 'AVAILABLE'
                      ? 'Available for work'
                      : profileData.availabilityStatus === 'BUSY'
                      ? 'Currently busy'
                      : 'Not looking for work'}
                  </span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handleConnect}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  <UserPlus className="h-4 w-4" />
                  Connect
                </button>
                <button
                  onClick={handleMessage}
                  className="inline-flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-accent transition-colors"
                >
                  <MessageCircle className="h-4 w-4" />
                  Message
                </button>
                <button
                  onClick={handleShare}
                  className="inline-flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-accent transition-colors"
                >
                  <Share2 className="h-4 w-4" />
                  Share
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bio Section */}
        {profileData.bio && (
          <div className="bg-card border border-border rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">About</h2>
            <p className="text-muted-foreground whitespace-pre-wrap">{profileData.bio}</p>
          </div>
        )}

        {/* Specializations */}
        {(profileData.writerSpecialization ||
          (profileData.crewSpecializations && profileData.crewSpecializations.length > 0) ||
          (profileData.businessSpecializations && profileData.businessSpecializations.length > 0)) && (
          <div className="bg-card border border-border rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">Specializations</h2>
            <div className="space-y-3">
              {profileData.writerSpecialization && (
                <div>
                  <span className="font-medium text-foreground">Writer: </span>
                  <span className="text-muted-foreground">{profileData.writerSpecialization}</span>
                </div>
              )}
              {profileData.crewSpecializations && profileData.crewSpecializations.length > 0 && (
                <div>
                  <span className="font-medium text-foreground">Crew: </span>
                  <span className="text-muted-foreground">
                    {profileData.crewSpecializations.join(', ')}
                  </span>
                </div>
              )}
              {profileData.businessSpecializations &&
                profileData.businessSpecializations.length > 0 && (
                  <div>
                    <span className="font-medium text-foreground">Business: </span>
                    <span className="text-muted-foreground">
                      {profileData.businessSpecializations.join(', ')}
                    </span>
                  </div>
                )}
            </div>
          </div>
        )}

        {/* Links & Social (if privacy allows) */}
        {(profileData.website ||
          profileData.imdbUrl ||
          profileData.linkedinUrl ||
          profileData.instagramHandle ||
          profileData.twitterHandle) && (
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">Links</h2>
            <div className="space-y-3">
              {profileData.website && (
                <a
                  href={profileData.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-primary hover:underline"
                >
                  <LinkIcon className="h-4 w-4" />
                  Website
                </a>
              )}
              {profileData.imdbUrl && (
                <a
                  href={profileData.imdbUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-primary hover:underline"
                >
                  <LinkIcon className="h-4 w-4" />
                  IMDb Profile
                </a>
              )}
              {profileData.linkedinUrl && (
                <a
                  href={profileData.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-primary hover:underline"
                >
                  <LinkIcon className="h-4 w-4" />
                  LinkedIn
                </a>
              )}
              {profileData.instagramHandle && (
                <a
                  href={`https://instagram.com/${profileData.instagramHandle.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-primary hover:underline"
                >
                  <LinkIcon className="h-4 w-4" />
                  @{profileData.instagramHandle.replace('@', '')}
                </a>
              )}
              {profileData.twitterHandle && (
                <a
                  href={`https://twitter.com/${profileData.twitterHandle.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-primary hover:underline"
                >
                  <LinkIcon className="h-4 w-4" />
                  @{profileData.twitterHandle.replace('@', '')}
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
