'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { 
  User, 
  MapPin, 
  Link as LinkIcon, 
  Briefcase, 
  MessageCircle,
  UserPlus,
  Share2,
  Edit
} from 'lucide-react'
import type { PublicProfileResponse } from '@/lib/api/profiles'

interface ProfileContentProps {
  profile: PublicProfileResponse
  isAuthenticated: boolean
  isOwnProfile?: boolean
  onConnect?: () => void
  onMessage?: () => void
  onShare?: () => void
  connectionStatus?: 'NONE' | 'PENDING' | 'CONNECTED'
}

export default function ProfileContent({ 
  profile, 
  isAuthenticated, 
  isOwnProfile = false,
  onConnect,
  onMessage,
  onShare,
  connectionStatus = 'NONE'
}: ProfileContentProps) {
  const router = useRouter()
  const { profile: profileData } = profile

  const handleConnect = () => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }
    onConnect?.()
  }

  const handleMessage = () => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }
    onMessage?.()
  }

  const handleShare = async () => {
    if (onShare) {
      onShare()
      return
    }

    // Default share implementation
    const url = window.location.href
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${profileData.firstName} ${profileData.lastName} - WIFT Africa`,
          text: `Check out ${profileData.firstName}'s profile on WIFT Africa`,
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

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Profile Header */}
      <div className="bg-card border border-border rounded-lg p-8 mb-6">
        <div className="flex items-start gap-6">
          {/* Profile Photo */}
          <div className="flex-shrink-0">
            {profileData.profilePhoto ? (
              <Image
                src={profileData.profilePhoto}
                alt={`${profileData.firstName} ${profileData.lastName}`}
                width={128}
                height={128}
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
              {isOwnProfile ? (
                // Own profile: Show Edit and Share buttons
                <>
                  <button
                    onClick={() => router.push(`/in/${profileData.username || profileData.id}/edit`)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    <Edit className="h-4 w-4" />
                    Edit Profile
                  </button>
                  <button
                    onClick={handleShare}
                    className="inline-flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-accent transition-colors"
                  >
                    <Share2 className="h-4 w-4" />
                    Share Profile
                  </button>
                </>
              ) : (
                // Others' profiles: Show Connect, Message, Share buttons
                <>
                    {connectionStatus === 'CONNECTED' ? (
                      <button
                        onClick={handleMessage}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                      >
                        <MessageCircle className="h-4 w-4" />
                        Message
                      </button>
                    ) : connectionStatus === 'PENDING' ? (
                      <button
                        disabled
                        className="inline-flex items-center gap-2 px-4 py-2 bg-muted text-muted-foreground rounded-lg cursor-not-allowed"
                      >
                        <UserPlus className="h-4 w-4" />
                        Pending
                      </button>
                    ) : (
                      <button
                        onClick={handleConnect}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                      >
                        <UserPlus className="h-4 w-4" />
                        {isAuthenticated ? 'Connect' : 'Sign in to Connect'}
                      </button>
                    )}
                    {/* Only show secondary message button if NOT connected (e.g. cold message if allowed, or just remove it) 
                        For now, removing duplicate Message button since it's merged into the primary action for connected users. 
                        If we want to allow messaging non-connections, we can keep it. 
                        Let's keep it simple: Connect -> Connected -> Message. 
                    */}
                  <button
                    onClick={handleShare}
                    className="inline-flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-accent transition-colors"
                  >
                    <Share2 className="h-4 w-4" />
                    Share
                  </button>
                </>
              )}
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
        <div className="bg-card border border-border rounded-lg p-6 mb-6">
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

      {/* Call to Action for non-authenticated users */}
      {!isAuthenticated && (
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-6 mt-8 text-center">
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Connect with {profileData.firstName} and thousands of other film professionals
          </h3>
          <p className="text-muted-foreground mb-4">
            Join WIFT Africa to build your network and advance your career in film and television.
          </p>
          <div className="flex justify-center gap-3">
            <button
              onClick={() => router.push('/register')}
              className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
            >
              Join WIFT Africa
            </button>
            <button
              onClick={() => router.push('/login')}
              className="px-6 py-2 border border-border rounded-lg hover:bg-accent"
            >
              Sign In
            </button>
          </div>
        </div>
      )}
    </div>
  )
}