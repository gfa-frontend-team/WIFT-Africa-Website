'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/hooks/useAuth'
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
  CheckCircle2
} from 'lucide-react'
import Link from 'next/link'

export default function AccountSettingsPage() {
  const router = useRouter()
  const { user, isAuthenticated, logout } = useAuth()
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleteConfirmText, setDeleteConfirmText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }
  }, [isAuthenticated, router])

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== 'DELETE') {
      return
    }

    try {
      setIsDeleting(true)
      // TODO: Implement account deletion API
      // await usersApi.deleteAccount()
      alert('Account deletion is not yet implemented')
      setShowDeleteConfirm(false)
    } catch (err: any) {
      console.error('Failed to delete account:', err)
      alert('Failed to delete account')
    } finally {
      setIsDeleting(false)
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
              <div className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <Building2 className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Chapter</p>
                    <p className="font-medium text-foreground">Your Chapter</p>
                  </div>
                </div>
                <button className="text-sm text-primary hover:underline">
                  Request Change
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
                  <p className="text-sm text-muted-foreground">••••••••</p>
                </div>
              </div>
              <button className="text-sm text-primary hover:underline">
                Change Password
              </button>
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
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowDeleteConfirm(false)
                    setDeleteConfirmText('')
                  }}
                  className="px-4 py-2 border border-border rounded-lg hover:bg-accent transition-colors"
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
