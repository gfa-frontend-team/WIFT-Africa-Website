'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/hooks/useAuth'
import { usersApi } from '@/lib/api/users'
import { 
  User, 
  Mail, 
  MapPin, 
  Link as LinkIcon, 
  Briefcase, 
  Edit, 
  Share2,
  FileText,
  Download,
  Loader2
} from 'lucide-react'
import Link from 'next/link'
import type { UserProfileResponse } from '@/lib/api/users'

export default function MyProfilePage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()
  const [profile, setProfile] = useState<UserProfileResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }

    loadProfile()
  }, [isAuthenticated, router])

  const loadProfile = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await usersApi.getProfile()
      setProfile(data)
    } catch (err: any) {
      console.error('Failed to load profile:', err)
      setError(err.response?.data?.error || 'Failed to load profile')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDownloadCV = async () => {
    try {
      const blob = await usersApi.downloadCV()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = profile?.user.cvFileName || 'cv.pdf'
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (err) {
      console.error('Failed to download CV:', err)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your profile...</p>
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
            onClick={loadProfile}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  const { user: userData, profile: profileData } = profile

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header Actions */}
        <div className="flex justify-end gap-3 mb-6">
          <Link
            href="/me/share"
            className="inline-flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-accent transition-colors"
          >
            <Share2 className="h-4 w-4" />
            Share Profile
          </Link>
          <Link
            href="/me/edit"
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Edit className="h-4 w-4" />
            Edit Profile
          </Link>
        </div>

        {/* Profile Header */}
        <div className="bg-card border border-border rounded-lg p-8 mb-6">
          <div className="flex items-start gap-6">
            {/* Profile Photo */}
            <div className="flex-shrink-0">
              {userData.profilePhoto ? (
                <img
                  src={userData.profilePhoto}
                  alt={`${userData.firstName} ${userData.lastName}`}
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
                {userData.firstName} {userData.lastName}
              </h1>
              
              {profileData.headline && (
                <p className="text-xl text-muted-foreground mb-4">{profileData.headline}</p>
              )}

              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                {profileData.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    {profileData.location}
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  {userData.email}
                </div>
                {profileData.primaryRole && (
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4" />
                    {profileData.primaryRole}
                  </div>
                )}
              </div>

              {/* Roles */}
              {profileData.roles && profileData.roles.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
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
                <div className="mt-4">
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

        {/* Skills */}
        {profileData.skills && profileData.skills.length > 0 && (
          <div className="bg-card border border-border rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {profileData.skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-accent text-accent-foreground rounded-lg text-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Links & Social */}
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

        {/* CV Section */}
        {userData.cvFileName && (
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">CV/Resume</h2>
            <div className="flex items-center justify-between p-4 bg-accent rounded-lg">
              <div className="flex items-center gap-3">
                <FileText className="h-8 w-8 text-primary" />
                <div>
                  <p className="font-medium text-foreground">{userData.cvFileName}</p>
                  {userData.cvUploadedAt && (
                    <p className="text-sm text-muted-foreground">
                      Uploaded {new Date(userData.cvUploadedAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
              <button
                onClick={handleDownloadCV}
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                <Download className="h-4 w-4" />
                Download
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
