'use client'

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Mail, CheckCircle, RefreshCw, AlertCircle } from 'lucide-react'
import { useAuth } from '@/lib/hooks/useAuth'
import { authApi } from '@/lib/api/auth'
import { Logo } from '@/components/shared/Logo'

function VerifyEmailContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { verifyEmail } = useAuth()
  const [isVerified, setIsVerified] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [resendCount, setResendCount] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  // Check for token in URL and verify automatically
  useEffect(() => {
    const token = searchParams.get('token')

    if (token && !isVerified && !isVerifying) {
      handleVerification(token)
    }
  }, [searchParams])

  const handleVerification = async (token: string) => {
    setIsVerifying(true)
    setError(null)

    try {
      await verifyEmail(token)
      setIsVerified(true)

      // Clear stored email since verification is complete
      localStorage.removeItem('pendingVerificationEmail')

      // Don't redirect here - let user click "Continue to Onboarding" button
    } catch (err: any) {
      console.error('Verification error:', err)
      setError(err.response?.data?.message || 'Verification failed. The link may be invalid or expired.')
    } finally {
      setIsVerifying(false)
    }
  }

  const handleResendEmail = async () => {
    setIsResending(true)
    setResendCount(prev => prev + 1)
    setError(null)

    try {
      // Get user email from localStorage or use a stored email
      const userEmail = localStorage.getItem('pendingVerificationEmail')

      if (!userEmail) {
        setError('Unable to resend email. Please try registering again.')
        return
      }

      await authApi.resendVerificationEmail(userEmail)

      // Show success message
      setSuccessMessage('Verification email sent! Please check your inbox.')
      setError(null)

      // Clear success message after 5 seconds
      setTimeout(() => {
        setSuccessMessage(null)
      }, 5000)

    } catch (err: any) {
      console.error('Resend error:', err)
      const message = err.response?.data?.message || 'Failed to resend email. Please try again.'
      setError(message)
    } finally {
      setIsResending(false)
    }
  }

  const handleContinue = () => {
    router.push('/onboarding')
  }

  // Verifying state
  if (isVerifying) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-background">
        <div className="w-full max-w-md">
          <Link href="/" className="inline-block mb-6 w-full text-center">
            <Logo className="h-5 w-auto mx-auto" />
          </Link>

          <div className="bg-card border border-border rounded-2xl p-8 text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <RefreshCw className="h-8 w-8 text-primary animate-spin" />
            </div>

            <h1 className="text-2xl font-bold text-foreground mb-2">Verifying your email...</h1>
            <p className="text-muted-foreground">
              Please wait while we verify your email address.
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Success state
  if (isVerified) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-background">
        <div className="w-full max-w-md">
          {/* Logo */}
          <Link href="/" className="inline-block mb-6 w-full text-center">
            <Logo className="h-10 w-auto mx-auto" />
          </Link>

          {/* Success Card */}
          <div className="bg-card border border-border rounded-2xl p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>

            <h1 className="text-2xl font-bold text-foreground mb-2">Email Verified!</h1>
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Welcome to WIFT Africa!
            </h2>

            <p className="text-muted-foreground mb-8">
              Your email has been verified successfully. Let&apos;s complete your onboarding process.
            </p>

            <button
              onClick={handleContinue}
              className="w-full py-3 px-4 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg font-medium transition-colors"
            >
              Continue to Onboarding
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Pending/Error state
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-background">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center">
          <Link href="/" className="inline-block mb-6">
            <Logo className="h-10 w-auto mx-auto" />
          </Link>
          <h1 className="text-3xl font-bold text-foreground">Verify your email</h1>
          <p className="mt-2 text-muted-foreground">
            We sent a verification link to your email address.
          </p>
        </div>

        {/* Verification Card */}
        <div className="bg-card border border-border rounded-2xl p-8 mt-8">
          <div className="text-center">
            <div className={`w-16 h-16 ${error ? 'bg-destructive/10' : 'bg-primary/10'} rounded-full flex items-center justify-center mx-auto mb-6`}>
              {error ? (
                <AlertCircle className="h-8 w-8 text-destructive" />
              ) : (
                <Mail className="h-8 w-8 text-primary" />
              )}
            </div>

            <h1 className="text-2xl font-bold text-foreground mb-2">
              {error ? 'Verification Failed' : 'Check your email'}
            </h1>
            <p className="text-muted-foreground mb-8">
              {error ? (
                error
              ) : (
                "We've sent a verification email to your address. Please check your inbox and click the verification link to continue."
              )}
            </p>

            {/* Error message */}
            {error && (
              <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            {/* Success message */}
            {successMessage && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-800">{successMessage}</p>
              </div>
            )}

            <div className="space-y-4">
              <button
                onClick={handleResendEmail}
                disabled={isResending || resendCount >= 3}
                className="w-full py-3 px-4 border border-border bg-background hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-medium transition-colors inline-flex items-center justify-center"
              >
                {isResending ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Mail className="h-4 w-4 mr-2" />
                    {resendCount > 0 ? `Resend Email (${3 - resendCount} left)` : 'Resend Email'}
                  </>
                )}
              </button>

              {resendCount >= 3 && (
                <p className="text-sm text-muted-foreground">
                  Maximum resend attempts reached. Please contact support if you continue to have issues.
                </p>
              )}
            </div>

            <div className="mt-8 pt-6 border-t border-border">
              <p className="text-sm text-muted-foreground">
                Already verified?{' '}
                <Link href="/onboarding" className="text-primary hover:text-primary/80 font-medium">
                  Continue to onboarding
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Help Text */}
        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Didn&apos;t receive the email? Check your spam folder or{' '}
            <a href="mailto:support@wiftafrica.org" className="text-primary hover:text-primary/80">
              contact support
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center px-4 bg-background">
        <div className="w-full max-w-md">
          <div className="bg-card border border-border rounded-2xl p-8 text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <RefreshCw className="h-8 w-8 text-primary animate-spin" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">Loading...</h1>
          </div>
        </div>
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  )
}
