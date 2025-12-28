'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/hooks/useAuth'
import { useAccount } from '@/lib/hooks/useSettings'
import { onboardingApi, type Chapter } from '@/lib/api/onboarding'
import { 
  User, 
  Mail, 
  Lock, 
  Shield, 
  Trash2, 
  Loader2,
  ArrowLeft,
  AlertTriangle,
  Building2,
  CheckCircle2,
  MapPin,
  Users as UsersIcon,
  ExternalLink
} from 'lucide-react'
import Link from 'next/link'

export default function AccountSettingsPage() {
  const router = useRouter()
  const { user, isAuthenticated, logout } = useAuth()
  const { deleteAccount, isDeleting } = useAccount()
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleteConfirmText, setDeleteConfirmText] = useState('')
  const [deleteError, setDeleteError] = useState<string | null>(null)
  const [chapter, setChapter] = useState<Chapter | null>(null)
  const [isLoadingChapter, setIsLoadingChapter] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }

    // Load chapter information
    const loadChapterInfo = async () => {
      if (!user?.chapterId) return

      try {
        setIsLoadingChapter(true)
        const response = await onboardingApi.getChapters()
        const userChapter = response.chapters.find(c => c.id === user.chapterId)
        if (userChapter) {
          setChapter(userChapter)
        }
      } catch (error) {
        console.error('Failed to load chapter info:', error)
      } finally {
        setIsLoadingChapter(false)
      }
    }

    loadChapterInfo()
  }, [isAuthenticated, router, user?.chapterId])

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== 'DELETE') {
      return
    }

    try {
      setDeleteError(null)
      
      await deleteAccount('DELETE')
      
      // Account deleted successfully, logout and redirect
      await logout()
      router.push('/login?message=Account deleted successfully')
    } catch (err: any) {
      console.error('Failed to delete account:', err)
      const message = err.response?.data?.message || 'Failed to delete account. Please try again.'
      setDeleteError(message)
    }
  }

  const getMembershipStatusBadge = () => {
    if (!user) return null

    const statusConfig = {
      PENDING: {
        color: 'bg-yellow-100 text-yellow-800',
        icon: <Loader2 className="h-4 w-4 animate-spin" />,
        text: 'Pending Approval'
      },
      APPROVED: {
        color: 'bg-green-100 text-green-800',
        icon: <CheckCircle2 className="h-4 w-4" />,
        text: 'Approved'
      },
      REJECTED: {
        color: 'bg-red-100 text-red-800',
        icon: <AlertTriangle className="h-4 w-4" />,
        text: 'Rejected'
      },
      SUSPENDED: {
        color: 'bg-gray-100 text-gray-800',
        icon: <AlertTriangle className="h-4 w-4" />,
        text: 'Suspended'
      }
    }

    const config = statusConfig[user.membershipStatus]
    if (!config) return null

    return (
      <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
        {config.icon}
        {config.text}
      </span>
    )
  }

  const getAccountTypeBadge = () => {
    if (!user) return null

    const typeConfig = {
      CHAPTER_MEMBER: { color: 'bg-blue-100 text-blue-800', text: 'Chapter Member' },
      HQ_MEMBER: { color: 'bg-purple-100 text-purple-800', text: 'HQ Member' },
      CHAPTER_ADMIN: { color: 'bg-orange-100 text-orange-800', text: 'Chapter Admin' },
      SUPER_ADMIN: { color: 'bg-red-100 text-red-800', text: 'Super Admin' }
    }

    const config = typeConfig[user.accountType]
    if (!config) return null

    return (
      <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
        {config.text}
      </span>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
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
              <User className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Account Settings</h1>
              <p className="text-muted-foreground">Manage your account information and security</p>
            </div>
          </div>
        </div>

        {/* Account Information */}
        <div className="bg-card border border-border rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-foreground mb-6">Account Information</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-border">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Email Address</p>
                  <p className="font-medium text-foreground">{user.email}</p>
                </div>
              </div>
              <button className="text-sm text-primary hover:underline">
                Change Email
              </button>
            </div>

            <div className="flex items-center justify-between py-3 border-b border-border">
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Full Name</p>
                  <p className="font-medium text-foreground">
                    {user.firstName} {user.lastName}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between py-3 border-b border-border">
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Account Type</p>
                  <div className="mt-1">
                    {getAccountTypeBadge()}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between py-3 border-b border-border">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Membership Status</p>
                  <div className="mt-1">
                    {getMembershipStatusBadge()}
                  </div>
                </div>
              </div>
            </div>

            {user.chapterId && (
              <div className="flex items-start justify-between py-3">
                <div className="flex items-start gap-3">
                  <Building2 className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Chapter</p>
                    {isLoadingChapter ? (
                      <div className="flex items-center gap-2 mt-1">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="text-sm text-muted-foreground">Loading...</span>
                      </div>
                    ) : chapter ? (
                      <div className="mt-1">
                        <p className="font-medium text-foreground">{chapter.name}</p>
                        <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            <span>
                              {chapter.city ? `${chapter.city}, ${chapter.country}` : chapter.country}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <UsersIcon className="h-3 w-3" />
                            <span>{chapter.memberCount.toLocaleString()} members</span>
                          </div>
                        </div>
                        {chapter.description && (
                          <p className="text-xs text-muted-foreground mt-1 italic">
                            {chapter.description}
                          </p>
                        )}
                      </div>
                    ) : (
                      <p className="font-medium text-foreground mt-1">Chapter information unavailable</p>
                    )}
                  </div>
                </div>
                <button className="text-sm text-primary hover:underline flex items-center gap-1">
                  Request Change
                  <ExternalLink className="h-3 w-3" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Security */}
        <div className="bg-card border border-border rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-foreground mb-6">Security</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-border">
              <div className="flex items-center gap-3">
                <Lock className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium text-foreground">Password</p>
                  <p className="text-sm text-muted-foreground">
                    {user.authProvider === 'GOOGLE' ? 'Managed by Google' : '••••••••'}
                  </p>
                </div>
              </div>
              {user.authProvider === 'GOOGLE' ? (
                <span className="text-sm text-muted-foreground">
                  Google Account
                </span>
              ) : (
                <Link
                  href="/settings/password"
                  className="text-sm text-primary hover:underline"
                >
                  Change Password
                </Link>
              )}
            </div>

            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium text-foreground">Email Verification</p>
                  <p className="text-sm text-muted-foreground">
                    {user.emailVerified ? 'Verified' : 'Not verified'}
                  </p>
                </div>
              </div>
              {user.emailVerified ? (
                <span className="text-sm text-green-600 flex items-center gap-1">
                  <CheckCircle2 className="h-4 w-4" />
                  Verified
                </span>
              ) : (
                <button className="text-sm text-primary hover:underline">
                  Verify Email
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-card border border-red-200 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="h-6 w-6 text-red-600" />
            <h2 className="text-xl font-semibold text-red-600">Danger Zone</h2>
          </div>
          
          <p className="text-sm text-muted-foreground mb-4">
            Once you delete your account, there is no going back. Please be certain.
          </p>

          {!showDeleteConfirm ? (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <Trash2 className="h-4 w-4" />
              Delete Account
            </button>
          ) : (
            <div className="space-y-4">
              {deleteError && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-start">
                    <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-red-800">{deleteError}</p>
                    </div>
                    <button
                      onClick={() => setDeleteError(null)}
                      className="ml-3 text-red-600 hover:text-red-800"
                    >
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-800 mb-3">
                  <strong>Warning:</strong> This action cannot be undone. This will permanently delete
                  your account, profile, and all associated data.
                </p>
                <p className="text-sm text-red-800 mb-3">
                  Type <strong>DELETE</strong> to confirm:
                </p>
                <input
                  type="text"
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                  placeholder="Type DELETE"
                  className="w-full px-4 py-2 border border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  disabled={isDeleting}
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowDeleteConfirm(false)
                    setDeleteConfirmText('')
                    setDeleteError(null)
                  }}
                  disabled={isDeleting}
                  className="px-4 py-2 border border-border rounded-lg hover:bg-accent transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  disabled={deleteConfirmText !== 'DELETE' || isDeleting}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isDeleting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="h-4 w-4" />
                      Delete My Account
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
