'use client'

import { useRouter } from 'next/navigation'
import type { PublicProfileResponse } from '@/lib/api/profiles'
import { User, Profile } from '@/types'
import ProfileHeader from './ProfileHeader'
import ProfileAnalytics from './ProfileAnalytics'
import ProfileStats from './ProfileStats'
import BadgeDisplay from './BadgeDisplay'
import AvailabilityBanner from '../ui/AvailabilityBanner'
import AboutSection from './AboutSection'
import ExperienceSection from './ExperienceSection'
import PortfolioSection from './PortfolioSection'
import ContactSection from './ContactSection'
import SpecializationsSection from './SpecializationsSection'
import ProfileCompleteness from './ProfileCompleteness'

interface ProfileContentProps {
  profile: PublicProfileResponse
  isAuthenticated: boolean
  isOwnProfile?: boolean
  onConnect?: (message?: string) => void
  isConnecting?: boolean
  onMessage?: () => void
  onShare?: () => void
  connectionStatus?: 'NONE' | 'PENDING' | 'CONNECTED'
  connectionsCount?: number
  postsCount?: number
}

export default function ProfileContent({ 
  profile, 
  isAuthenticated, 
  isOwnProfile = false,
  onConnect,
  isConnecting = false,
  onMessage,
  onShare,
  connectionStatus = 'NONE',
  connectionsCount = 0,
  postsCount = 0,
}: ProfileContentProps) {
  const router = useRouter()
  const { profile: data } = profile
  
  // ... (userObj/profileObj mapping) ...
  const userObj = {
    id: data.id || data._id,
    firstName: data.firstName,
    lastName: data.lastName,
    username: data.username,
    profilePhoto: data.profilePhoto,
    email: data.email,
    chapter: data.chapter,
    accountType: data.accountType,
    membershipStatus: data.membershipStatus
  }

  const profileObj = {
    headline: data.headline,
    bio: data.bio,
    location: data.location,
    primaryRole: data.primaryRole,
    roles: data.roles,
    availabilityStatus: data.availabilityStatus,
    writerSpecialization: data.writerSpecialization,
    crewSpecializations: data.crewSpecializations,
    businessSpecializations: data.businessSpecializations,
    website: data.website,
    imdbUrl: data.imdbUrl,
    linkedinUrl: data.linkedinUrl,
    instagramHandle: data.instagramHandle,
    twitterHandle: data.twitterHandle,
    isMultihyphenate: data.isMultihyphenate
  }

  const handleEdit = () => {
    router.push('/me/edit')
  }

  // Get email safely - enforce privacy for guests
  const displayEmail = isAuthenticated ? (data.email || 'Hidden') : 'Hidden'

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* 
        ProfileHeader includes:
        - Banner & Avatar
        - Name, Headline, Location
        - Actions (Connect/Edit)
        - Badges & Stats 
      */}
      <ProfileHeader 
        user={userObj as any}
        profile={profileObj as any}
        isOwner={isOwnProfile}
        connectionStatus={isAuthenticated ? connectionStatus : 'NONE'}
        connectionsCount={connectionsCount}
        postsCount={postsCount}
        onConnect={onConnect} // Always pass onConnect so the parent can handle the redirect behavior
        isConnecting={isConnecting}
        onMessage={onMessage}
        onEdit={() => {}} // Handle edit in parent/header
      />

      {isOwnProfile && isAuthenticated && (
        <div className="px-4 mt-6 max-w-4xl mx-auto w-full">
            <ProfileAnalytics />
        </div>
      )}

      <div className="mt-6">
        <AvailabilityBanner 
          isAvailable={profileObj.availabilityStatus === 'AVAILABLE'}
          status={profileObj.availabilityStatus}
          isOwner={isOwnProfile}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* Main Column (Left) */}
        <div className="lg:col-span-2 space-y-6">
          <AboutSection 
            bio={profileObj.bio} 
            isOwner={isOwnProfile}
            onEdit={handleEdit}
          />
          
          <ExperienceSection isOwner={isOwnProfile} />
          
          <PortfolioSection isOwner={isOwnProfile} />
        </div>

        {/* Sidebar (Right) */}
        <div className="space-y-6">
          <ContactSection 
             userEmail={displayEmail} 
             profile={profileObj as any}
             isOwner={isOwnProfile}
             onEdit={handleEdit}
          />
          
          <SpecializationsSection profile={profileObj as any} />

           {/* Profile Strength / Completion */}
           {data.completeness && isOwnProfile && (
             <ProfileCompleteness completeness={data.completeness} />
           )}
        </div>
      </div>
    </div>
  )
}