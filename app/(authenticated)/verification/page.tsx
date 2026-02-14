'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/hooks/useAuth'
import { ArrowLeft, Shield } from 'lucide-react'
import Link from 'next/link'
import VerificationProgress from '@/components/verification/VerificationProgress'

export default function VerificationPage() {
  const router = useRouter()
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, router])

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/feed"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/10 rounded-full">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Membership Verification</h1>
              <p className="text-muted-foreground">Track your membership status and next steps</p>
            </div>
          </div>
        </div>

        {/* Verification Progress */}
        <VerificationProgress />

        {/* Additional Information */}
        <div className="mt-8 bg-card border border-border rounded-lg p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">About Membership Verification</h2>
          
          <div className="space-y-4 text-sm text-muted-foreground">
            <div>
              <h3 className="font-medium text-foreground mb-2">Why do we verify memberships?</h3>
              <p>
                WIFT Africa maintains high standards for our professional community. Verification ensures that all members 
                are legitimate professionals in the film, television, and digital media industry, creating a trusted 
                environment for networking and collaboration.
              </p>
            </div>

            <div>
              <h3 className="font-medium text-foreground mb-2">What happens during verification?</h3>
              <ul className="space-y-1 ml-4">
                <li>• Your chapter administrator reviews your application and profile</li>
                <li>• Professional credentials and industry involvement are verified</li>
                <li>• Membership eligibility is confirmed based on chapter requirements</li>
                <li>• You receive email notification of the decision</li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium text-foreground mb-2">Need help?</h3>
              <p>
                If you have questions about your verification status or need to update your application, 
                please contact your chapter administrator or reach out to our support team.
              </p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-card border border-border rounded-lg p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              href="/me/edit"
              className="p-4 border border-border rounded-lg hover:bg-accent transition-colors"
            >
              <h3 className="font-medium text-foreground mb-1">Complete Your Profile</h3>
              <p className="text-sm text-muted-foreground">
                Add more details to help with verification
              </p>
            </Link>
            <Link
              href="/settings/account"
              className="p-4 border border-border rounded-lg hover:bg-accent transition-colors"
            >
              <h3 className="font-medium text-foreground mb-1">Account Settings</h3>
              <p className="text-sm text-muted-foreground">
                View detailed account and chapter information
              </p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}