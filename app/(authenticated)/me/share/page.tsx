'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/hooks/useAuth'
import { usersApi } from '@/lib/api/users'
import { 
  Copy, 
  Check, 
  Share2, 
  Loader2,
  ArrowLeft,
  ExternalLink,
  QrCode
} from 'lucide-react'
import Link from 'next/link'

export default function ShareProfilePage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()
  const [shareLink, setShareLink] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }

    loadShareLink()
  }, [isAuthenticated, router])

  const loadShareLink = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await usersApi.getShareLink()
      setShareLink(data.url)
    } catch (err: any) {
      console.error('Failed to load share link:', err)
      setError(err.response?.data?.error || 'Failed to load share link')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareLink)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${user?.firstName} ${user?.lastName} - WIFT Africa`,
          text: 'Check out my WIFT Africa profile',
          url: shareLink
        })
      } catch (err) {
        console.error('Failed to share:', err)
      }
    } else {
      handleCopyLink()
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading share link...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-4">{error}</p>
          <button
            onClick={loadShareLink}
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
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/me"
            className="p-2 hover:bg-accent rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-3xl font-bold text-foreground">Share Your Profile</h1>
        </div>

        {/* Share Link Card */}
        <div className="bg-card border border-border rounded-lg p-8 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-primary/10 rounded-full">
              <Share2 className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">Your Profile Link</h2>
              <p className="text-sm text-muted-foreground">
                Share this link to showcase your professional profile
              </p>
            </div>
          </div>

          {/* Link Display */}
          <div className="bg-accent rounded-lg p-4 mb-4">
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={shareLink}
                readOnly
                className="flex-1 bg-transparent text-foreground font-mono text-sm focus:outline-none"
              />
              <button
                onClick={handleCopyLink}
                className="flex-shrink-0 inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Copy
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-accent transition-colors"
            >
              <Share2 className="h-4 w-4" />
              Share
            </button>
            <a
              href={shareLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-accent transition-colors"
            >
              <ExternalLink className="h-4 w-4" />
              View Public Profile
            </a>
          </div>
        </div>

        {/* QR Code Section (Placeholder) */}
        <div className="bg-card border border-border rounded-lg p-8 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-primary/10 rounded-full">
              <QrCode className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">QR Code</h2>
              <p className="text-sm text-muted-foreground">
                Coming soon - Share your profile with a QR code
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center h-48 bg-accent rounded-lg">
            <div className="text-center">
              <QrCode className="h-16 w-16 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">QR Code generation coming soon</p>
            </div>
          </div>
        </div>

        {/* Tips */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="font-semibold text-foreground mb-4">Tips for sharing your profile</h3>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">•</span>
              <span>Add your profile link to your email signature</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">•</span>
              <span>Include it in your LinkedIn bio or other social media profiles</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">•</span>
              <span>Share it when networking at film festivals and industry events</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">•</span>
              <span>Use it in job applications to showcase your work</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">•</span>
              <span>
                Make sure your profile is complete and up-to-date before sharing
              </span>
            </li>
          </ul>
        </div>

        {/* Privacy Note */}
        <div className="mt-6 p-4 bg-accent rounded-lg">
          <p className="text-sm text-muted-foreground">
            <strong className="text-foreground">Privacy Note:</strong> Your profile visibility
            is controlled by your{' '}
            <Link href="/settings/privacy" className="text-primary hover:underline">
              privacy settings
            </Link>
            . Make sure to review them before sharing your profile publicly.
          </p>
        </div>
      </div>
    </div>
  )
}
