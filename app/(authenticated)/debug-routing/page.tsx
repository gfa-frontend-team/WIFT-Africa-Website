'use client'

import { useAuth } from '@/lib/hooks/useAuth'
import Link from 'next/link'
import { getProfileUrl, getProfileEditUrl } from '@/lib/utils/routes'

export default function DebugRoutingPage() {
  const { user } = useAuth()

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Debug Routing</h1>
        <p>Please login first</p>
      </div>
    )
  }

  const identifier = user.username || user.profileSlug || user.id

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Debug Routing</h1>

      <div className="space-y-6">
        {/* User Info */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Your User Info</h2>
          <div className="space-y-2 text-sm">
            <p><strong>Username:</strong> {user.username || 'Not set'}</p>
            <p><strong>ProfileSlug:</strong> {user.profileSlug || 'Not set'}</p>
            <p><strong>ID:</strong> {user.id}</p>
            <p><strong>Identifier (used for URLs):</strong> {identifier}</p>
          </div>
        </div>

        {/* Profile URLs */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Your Profile URLs</h2>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground mb-1">View Profile:</p>
              <code className="text-sm bg-muted px-2 py-1 rounded">
                {getProfileUrl(identifier)}
              </code>
              <Link 
                href={getProfileUrl(identifier)}
                className="ml-4 text-primary hover:underline text-sm"
              >
                Visit →
              </Link>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Edit Profile:</p>
              <code className="text-sm bg-muted px-2 py-1 rounded">
                {getProfileEditUrl(identifier)}
              </code>
              <Link 
                href={getProfileEditUrl(identifier)}
                className="ml-4 text-primary hover:underline text-sm"
              >
                Visit →
              </Link>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">/me Shortcut:</p>
              <code className="text-sm bg-muted px-2 py-1 rounded">/me</code>
              <Link 
                href="/me"
                className="ml-4 text-primary hover:underline text-sm"
              >
                Visit →
              </Link>
            </div>
          </div>
        </div>

        {/* Test Links */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Test These Links</h2>
          <div className="space-y-2">
            <Link 
              href={`/${identifier}`}
              className="block px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
            >
              View Profile (/{identifier})
            </Link>
            <Link 
              href={`/${identifier}/edit`}
              className="block px-4 py-2 bg-secondary text-secondary-foreground rounded hover:bg-secondary/90"
            >
              Edit Profile (/{identifier}/edit)
            </Link>
            <Link 
              href="/me"
              className="block px-4 py-2 bg-accent text-accent-foreground rounded hover:bg-accent/90"
            >
              My Profile (/me)
            </Link>
          </div>
        </div>

        {/* Current Location */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Current Location</h2>
          <p className="text-sm">
            <strong>Pathname:</strong> {typeof window !== 'undefined' ? window.location.pathname : 'N/A'}
          </p>
          <p className="text-sm">
            <strong>Full URL:</strong> {typeof window !== 'undefined' ? window.location.href : 'N/A'}
          </p>
        </div>

        {/* Instructions */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4 text-yellow-900">Instructions</h2>
          <ol className="list-decimal list-inside space-y-2 text-sm text-yellow-900">
            <li>Click "Edit Profile" button above</li>
            <li>You should see the edit page with "Profile Editor Coming Soon"</li>
            <li>If you see "Unauthorized", check that the identifier matches</li>
            <li>If you get 404, check browser console for errors</li>
          </ol>
        </div>
      </div>
    </div>
  )
}
