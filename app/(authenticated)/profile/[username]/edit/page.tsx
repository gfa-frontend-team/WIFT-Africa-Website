'use client'

import { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/lib/hooks/useAuth'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

/**
 * Profile Edit Page
 * Only accessible by the profile owner
 * Accessed via /username/edit
 */
export default function EditProfilePage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const username = params.username as string

  // Protect route - only allow editing own profile
  useEffect(() => {
    if (user) {
      if (user.username !== username && user.profileSlug !== username && user.id !== username) {
        // Not your profile, redirect to view-only
        router.replace(`/${username}`)
      }
    }
  }, [user, username, router])

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user || (user.username !== username && user.profileSlug !== username && user.id !== username)) {
    return (
      <div className="max-w-screen-xl mx-auto px-4 py-6">
        <div className="bg-card border border-border rounded-lg p-12 text-center">
          <p className="text-destructive mb-4">Unauthorized</p>
          <p className="text-sm text-muted-foreground mb-4">
            You can only edit your own profile.
          </p>
          <Link href="/feed" className="text-primary hover:underline">
            Go to Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-6">
        <Link
          href={`/${username}`}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Profile
        </Link>
        <h1 className="text-2xl font-bold text-foreground">Edit Profile</h1>
        <p className="text-muted-foreground">Update your profile information</p>
      </div>

      {/* Placeholder Content */}
      <div className="bg-card border border-border rounded-lg p-12 text-center">
        <h2 className="text-xl font-semibold text-foreground mb-3">
          Profile Editor Coming Soon
        </h2>
        <p className="text-muted-foreground mb-6">
          The profile editor is currently under development. You can edit your profile from settings in the meantime.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link
            href="/settings/profile"
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            Go to Settings
          </Link>
          <Link
            href={`/${username}`}
            className="px-4 py-2 bg-accent text-foreground rounded-lg hover:bg-accent/80 transition-colors"
          >
            View Profile
          </Link>
        </div>
      </div>
    </div>
  )
}
