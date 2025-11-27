'use client'

import { useState } from 'react'
import { ArrowLeft, ArrowRight, Link as LinkIcon, Film, Globe, MapPin } from 'lucide-react'
import { onboardingApi } from '@/lib/api/onboarding'

interface ProfileSetupStepProps {
  onNext: () => void
  onPrevious: () => void
  isSaving: boolean
  setIsSaving: (saving: boolean) => void
}

export default function ProfileSetupStep({
  onNext,
  onPrevious,
  isSaving,
  setIsSaving,
}: ProfileSetupStepProps) {
  const [headline, setHeadline] = useState('')
  const [bio, setBio] = useState('')
  const [location, setLocation] = useState('')
  const [website, setWebsite] = useState('')
  const [imdbUrl, setImdbUrl] = useState('')
  const [linkedinUrl, setLinkedinUrl] = useState('')
  const [instagramHandle, setInstagramHandle] = useState('')
  const [twitterHandle, setTwitterHandle] = useState('')
  const [availabilityStatus, setAvailabilityStatus] = useState<'AVAILABLE' | 'BUSY' | 'NOT_LOOKING'>('AVAILABLE')
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  const validateAndSubmit = () => {
    const newErrors: { [key: string]: string } = {}

    // Headline validation (optional but has max length)
    if (headline && headline.length > 255) {
      newErrors.headline = 'Headline must be 255 characters or less'
    }

    // Bio validation (optional but has max length)
    if (bio && bio.length > 1000) {
      newErrors.bio = 'Bio must be 1000 characters or less'
    }

    // URL validation (basic)
    const urlPattern = /^https?:\/\/.+/
    if (website && !urlPattern.test(website)) {
      newErrors.website = 'Please enter a valid URL starting with http:// or https://'
    }
    if (imdbUrl && !urlPattern.test(imdbUrl)) {
      newErrors.imdbUrl = 'Please enter a valid URL starting with http:// or https://'
    }
    if (linkedinUrl && !urlPattern.test(linkedinUrl)) {
      newErrors.linkedinUrl = 'Please enter a valid URL starting with http:// or https://'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return false
    }

    return true
  }

  const handleSubmit = async () => {
    if (!validateAndSubmit()) {
      return
    }

    setIsSaving(true)

    try {
      const data: any = {
        availabilityStatus,
      }

      if (headline.trim()) data.headline = headline.trim()
      if (bio.trim()) data.bio = bio.trim()
      if (location.trim()) data.location = location.trim()
      if (website.trim()) data.website = website.trim()
      if (imdbUrl.trim()) data.imdbUrl = imdbUrl.trim()
      if (linkedinUrl.trim()) data.linkedinUrl = linkedinUrl.trim()
      if (instagramHandle.trim()) data.instagramHandle = instagramHandle.trim()
      if (twitterHandle.trim()) data.twitterHandle = twitterHandle.trim()

      await onboardingApi.submitProfile(data)

      console.log('✅ Profile setup saved successfully')
      onNext()
    } catch (error: any) {
      console.error('❌ Failed to save profile setup:', error)
      alert(error.response?.data?.error || 'Failed to save profile setup')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-foreground mb-2">
          Complete Your Professional Profile
        </h2>
        <p className="text-muted-foreground">
          Tell us about yourself and your work (all fields are optional)
        </p>
      </div>

      {/* Professional Info */}
      <div className="space-y-4">
        <h3 className="font-semibold text-foreground">Professional Information</h3>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Professional Headline
          </label>
          <input
            type="text"
            value={headline}
            onChange={(e) => {
              setHeadline(e.target.value)
              if (errors.headline) {
                setErrors((prev) => ({ ...prev, headline: '' }))
              }
            }}
            maxLength={255}
            className="w-full p-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="e.g., Award-winning Film Producer | Storyteller"
          />
          <div className="flex justify-between mt-1">
            <p className="text-xs text-muted-foreground">
              A brief professional tagline
            </p>
            <p className="text-xs text-muted-foreground">
              {headline.length}/255
            </p>
          </div>
          {errors.headline && (
            <p className="mt-1 text-sm text-destructive">{errors.headline}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Bio
          </label>
          <textarea
            value={bio}
            onChange={(e) => {
              setBio(e.target.value)
              if (errors.bio) {
                setErrors((prev) => ({ ...prev, bio: '' }))
              }
            }}
            maxLength={1000}
            rows={5}
            className="w-full p-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring resize-none"
            placeholder="Tell us about your experience, achievements, and what you're passionate about..."
          />
          <div className="flex justify-between mt-1">
            <p className="text-xs text-muted-foreground">
              Share your story and professional journey
            </p>
            <p className="text-xs text-muted-foreground">
              {bio.length}/1000
            </p>
          </div>
          {errors.bio && (
            <p className="mt-1 text-sm text-destructive">{errors.bio}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Location
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="e.g., Lagos, Nigeria"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Availability Status
          </label>
          <select
            value={availabilityStatus}
            onChange={(e) => setAvailabilityStatus(e.target.value as any)}
            className="w-full p-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="AVAILABLE">Available for opportunities</option>
            <option value="BUSY">Currently busy</option>
            <option value="NOT_LOOKING">Not looking</option>
          </select>
        </div>
      </div>

      {/* Professional Links */}
      <div className="space-y-4">
        <h3 className="font-semibold text-foreground">Professional Links</h3>
        <p className="text-sm text-muted-foreground">
          Add your professional profiles to showcase your work
        </p>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            LinkedIn Profile
          </label>
          <div className="relative">
            <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="url"
              value={linkedinUrl}
              onChange={(e) => {
                setLinkedinUrl(e.target.value)
                if (errors.linkedinUrl) {
                  setErrors((prev) => ({ ...prev, linkedinUrl: '' }))
                }
              }}
              className="w-full pl-10 pr-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="https://linkedin.com/in/yourprofile"
            />
          </div>
          {errors.linkedinUrl && (
            <p className="mt-1 text-sm text-destructive">{errors.linkedinUrl}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            IMDb Profile
          </label>
          <div className="relative">
            <Film className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="url"
              value={imdbUrl}
              onChange={(e) => {
                setImdbUrl(e.target.value)
                if (errors.imdbUrl) {
                  setErrors((prev) => ({ ...prev, imdbUrl: '' }))
                }
              }}
              className="w-full pl-10 pr-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="https://imdb.com/name/yourprofile"
            />
          </div>
          {errors.imdbUrl && (
            <p className="mt-1 text-sm text-destructive">{errors.imdbUrl}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Website / Portfolio
          </label>
          <div className="relative">
            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="url"
              value={website}
              onChange={(e) => {
                setWebsite(e.target.value)
                if (errors.website) {
                  setErrors((prev) => ({ ...prev, website: '' }))
                }
              }}
              className="w-full pl-10 pr-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="https://yourwebsite.com"
            />
          </div>
          {errors.website && (
            <p className="mt-1 text-sm text-destructive">{errors.website}</p>
          )}
        </div>
      </div>

      {/* Social Media */}
      <div className="space-y-4">
        <h3 className="font-semibold text-foreground">Social Media</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Instagram Handle
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">@</span>
              <input
                type="text"
                value={instagramHandle}
                onChange={(e) => setInstagramHandle(e.target.value)}
                className="w-full pl-8 pr-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="username"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Twitter Handle
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">@</span>
              <input
                type="text"
                value={twitterHandle}
                onChange={(e) => setTwitterHandle(e.target.value)}
                className="w-full pl-8 pr-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="username"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Info Note */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>Note:</strong> You can always update your profile information later in your account settings. 
          CV upload is available in profile settings after onboarding.
        </p>
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={onPrevious}
          disabled={isSaving}
          className="px-6 py-3 border border-border hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-medium transition-colors inline-flex items-center gap-2"
        >
          <ArrowLeft className="h-5 w-5" />
          Back
        </button>
        <button
          onClick={handleSubmit}
          disabled={isSaving}
          className="px-6 py-3 bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-medium transition-colors inline-flex items-center gap-2"
        >
          {isSaving ? 'Saving...' : 'Continue'}
          {!isSaving && <ArrowRight className="h-5 w-5" />}
        </button>
      </div>
    </div>
  )
}
