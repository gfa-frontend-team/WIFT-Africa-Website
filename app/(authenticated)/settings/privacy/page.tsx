'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/hooks/useAuth'
import { usePrivacySettings } from '@/lib/hooks/useSettings'
import type { PrivacySettings } from '@/lib/api/users'
import { 
  Shield, 
  Eye, 
  EyeOff, 
  Loader2,
  Save,
  ArrowLeft,
  Info
} from 'lucide-react'
import Link from 'next/link'

export default function PrivacySettingsPage() {
  const router = useRouter()
  const { isAuthenticated } = useAuth()
  const { settings, isLoading, isError, updateSettings, isUpdating } = usePrivacySettings()
  const [localSettings, setLocalSettings] = useState<PrivacySettings | null>(null)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, router])

  // Sync local state with fetched settings
  useEffect(() => {
    if (settings) {
      setLocalSettings(settings)
    }
  }, [settings])

  const handleToggle = (key: keyof PrivacySettings) => {
    if (!localSettings) return
    
    setLocalSettings({
      ...localSettings,
      [key]: typeof localSettings[key] === 'boolean' ? !localSettings[key] : localSettings[key]
    })
  }

  const handleVisibilityChange = (visibility: PrivacySettings['profileVisibility']) => {
    if (!localSettings) return
    
    setLocalSettings({
      ...localSettings,
      profileVisibility: visibility
    })
  }

  const handleSave = async () => {
    if (!localSettings) return
    try {
      await updateSettings(localSettings)
    } catch (err) {
      // Toast handled by hook
      console.error('Failed to update privacy settings', err)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading privacy settings...</p>
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-4">Failed to load privacy settings.</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/settings"
            className="p-2 hover:bg-accent rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/10 rounded-full">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Privacy Settings</h1>
              <p className="text-muted-foreground">Control who can see your profile and information</p>
            </div>
          </div>
        </div>

        {/* Profile Visibility */}
        <div className="bg-card border border-border rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">Profile Visibility</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Choose who can view your profile
          </p>

          <div className="space-y-3">
            <label className="flex items-start gap-3 p-4 border border-border rounded-lg cursor-pointer hover:bg-accent transition-colors">
              <input
                type="radio"
                name="visibility"
                checked={localSettings?.profileVisibility === 'PUBLIC'}
                onChange={() => handleVisibilityChange('PUBLIC')}
                className="mt-1"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Eye className="h-4 w-4 text-primary" />
                  <span className="font-medium text-foreground">Public</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Anyone can view your profile, even if they're not logged in
                </p>
              </div>
            </label>

            <label className="flex items-start gap-3 p-4 border border-border rounded-lg cursor-pointer hover:bg-accent transition-colors">
              <input
                type="radio"
                name="visibility"
                checked={localSettings?.profileVisibility === 'CHAPTER_ONLY'}
                onChange={() => handleVisibilityChange('CHAPTER_ONLY')}
                className="mt-1"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Eye className="h-4 w-4 text-primary" />
                  <span className="font-medium text-foreground">Chapter Members Only</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Only members of your chapter can view your profile
                </p>
              </div>
            </label>

            <label className="flex items-start gap-3 p-4 border border-border rounded-lg cursor-pointer hover:bg-accent transition-colors">
              <input
                type="radio"
                name="visibility"
                checked={localSettings?.profileVisibility === 'CONNECTIONS_ONLY'}
                onChange={() => handleVisibilityChange('CONNECTIONS_ONLY')}
                className="mt-1"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Eye className="h-4 w-4 text-primary" />
                  <span className="font-medium text-foreground">Connections Only</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Only your connections can view your profile
                </p>
              </div>
            </label>

            <label className="flex items-start gap-3 p-4 border border-border rounded-lg cursor-pointer hover:bg-accent transition-colors">
              <input
                type="radio"
                name="visibility"
                checked={localSettings?.profileVisibility === 'PRIVATE'}
                onChange={() => handleVisibilityChange('PRIVATE')}
                className="mt-1"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <EyeOff className="h-4 w-4 text-primary" />
                  <span className="font-medium text-foreground">Private</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Only you can view your profile
                </p>
              </div>
            </label>
          </div>
        </div>

        {/* Information Visibility */}
        <div className="bg-card border border-border rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">Information Visibility</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Choose what information to display on your profile
          </p>

          <div className="space-y-4">
            <label className="flex items-center justify-between p-4 border border-border rounded-lg cursor-pointer hover:bg-accent transition-colors">
              <div>
                <span className="font-medium text-foreground">Show Email Address</span>
                <p className="text-sm text-muted-foreground">
                  Display your email on your public profile
                </p>
              </div>
              <input
                type="checkbox"
                checked={localSettings?.showEmail || false}
                onChange={() => handleToggle('showEmail')}
                className="h-5 w-5"
              />
            </label>

            <label className="flex items-center justify-between p-4 border border-border rounded-lg cursor-pointer hover:bg-accent transition-colors">
              <div>
                <span className="font-medium text-foreground">Show Phone Number</span>
                <p className="text-sm text-muted-foreground">
                  Display your phone number on your public profile
                </p>
              </div>
              <input
                type="checkbox"
                checked={localSettings?.showPhone || false}
                onChange={() => handleToggle('showPhone')}
                className="h-5 w-5"
              />
            </label>

            <label className="flex items-center justify-between p-4 border border-border rounded-lg cursor-pointer hover:bg-accent transition-colors">
              <div>
                <span className="font-medium text-foreground">Show Social Links</span>
                <p className="text-sm text-muted-foreground">
                  Display your social media links (LinkedIn, Instagram, etc.)
                </p>
              </div>
              <input
                type="checkbox"
                checked={localSettings?.showSocialLinks || false}
                onChange={() => handleToggle('showSocialLinks')}
                className="h-5 w-5"
              />
            </label>

            <label className="flex items-center justify-between p-4 border border-border rounded-lg cursor-pointer hover:bg-accent transition-colors">
              <div>
                <span className="font-medium text-foreground">Show Chapter</span>
                <p className="text-sm text-muted-foreground">
                  Display your WIFT chapter affiliation
                </p>
              </div>
              <input
                type="checkbox"
                checked={localSettings?.showChapter || false}
                onChange={() => handleToggle('showChapter')}
                className="h-5 w-5"
              />
            </label>

            <label className="flex items-center justify-between p-4 border border-border rounded-lg cursor-pointer hover:bg-accent transition-colors">
              <div>
                <span className="font-medium text-foreground">Show Roles</span>
                <p className="text-sm text-muted-foreground">
                  Display your professional roles and specializations
                </p>
              </div>
              <input
                type="checkbox"
                checked={localSettings?.showRoles || false}
                onChange={() => handleToggle('showRoles')}
                className="h-5 w-5"
              />
            </label>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-accent border border-border rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
            <div className="text-sm text-muted-foreground">
              <p className="font-medium text-foreground mb-1">Privacy Note</p>
              <p>
                These settings control what information is visible on your public profile.
                Your basic information (name and profile photo) will always be visible to
                maintain platform integrity.
              </p>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={isUpdating}
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isUpdating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
