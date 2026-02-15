'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Mail, Lock } from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/lib/hooks/useAuth'
import { useGoogleAuth } from '@/lib/hooks/useGoogleAuth'
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google'
import { Logo } from '@/components/shared/Logo'

export default function LoginPage() {
  const router = useRouter()
  const { login, isAuthenticated, isEmailVerified, onboardingComplete, isLoading: isAuthLoading } = useAuth()
  const { handleGoogleSuccess, handleGoogleError, isGoogleLoading } = useGoogleAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({})
  const [apiError, setApiError] = useState<string | null>(null)
  const [rememberMe, setRememberMe] = useState(false)
  const [isLocalLoading, setIsLocalLoading] = useState(false)

  const isLoading = isAuthLoading || isGoogleLoading || isLocalLoading


  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated && isEmailVerified && onboardingComplete) {
      router.push('/feed')
    }
  }, [isAuthenticated, isEmailVerified, onboardingComplete, router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))

    // Clear errors when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }))
    }
    if (apiError) {
      setApiError(null)
    }
  }

  const validateForm = () => {
    const errors: { [key: string]: string } = {}

    if (!formData.email) {
      errors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email'
    }

    if (!formData.password) {
      errors.password = 'Password is required'
    } else if (formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters'
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLocalLoading(true)
    setApiError(null) // Clear previous API errors

    try {
      await login(formData.email, formData.password)
      // Navigation handled by useAuth hook
    } catch (error: any) {
      // Extract and display error message
      const message = error.response?.data?.error ||
        error.response?.data?.message ||
        'Invalid email or password. Please try again.'
      setApiError(message)
    } finally {
      setIsLocalLoading(false)
    }
  }



  return (
    <>
      <div className="min-h-screen flex">
        {/* Left Side - Form */}
        <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-background">
          <div className="w-full max-w-md space-y-8">
            {/* Header */}
            <div className="text-center">
              <Link href="/" className="inline-block mb-6">
                <Logo className="h-5 w-auto mx-auto" />
              </Link>
              <h1 className="text-3xl font-bold text-foreground">Welcome to WIFT Africa</h1>
              <p className="mt-2 text-muted-foreground">Sign in to your professional account</p>
            </div>

            {/* API Error Alert */}
            {apiError && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-start">
                  <svg className="h-5 w-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-red-800">{apiError}</p>
                  </div>
                  <button
                    onClick={() => setApiError(null)}
                    className="ml-3 text-red-600 hover:text-red-800"
                  >
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            )}

            {/* Google Login */}
            <div className="space-y-4">
              <div className="min-h-[50px] relative flex justify-center">
                {process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ? (
                  <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
                    <GoogleLogin
                      onSuccess={handleGoogleSuccess}
                      onError={handleGoogleError}
                      useOneTap
                      theme="outline"
                      shape="circle"
                      width="100%"
                    />
                  </GoogleOAuthProvider>
                ) : (
                  <div className="text-sm text-red-500">
                    Google Client ID not configured
                  </div>
                )}
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-background text-muted-foreground">
                    Or continue with email
                  </span>
                </div>
              </div>
            </div>

            {/* Email/Password Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                  Email address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring ${formErrors.email ? 'border-destructive' : 'border-border'
                      }`}
                    placeholder="Enter your email"
                  />
                </div>
                {formErrors.email && (
                  <p className="mt-1 text-sm text-destructive">{formErrors.email}</p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-12 py-3 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring ${formErrors.password ? 'border-destructive' : 'border-border'
                      }`}
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
                  </button>
                </div>
                {formErrors.password && (
                  <p className="mt-1 text-sm text-destructive">{formErrors.password}</p>
                )}
              </div>

              {/* Remember me and Forgot password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 text-primary focus:ring-ring border-border rounded"
                  />
                  <span className="ml-2 text-sm text-muted-foreground">Remember me</span>
                </label>
                <Link
                  href="/forgot-password"
                  className="text-sm text-primary hover:text-primary/80"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-medium transition-colors"
              >
                {isLoading ? 'Signing in...' : 'Sign in'}
              </button>
            </form>

            {/* Sign up link */}
            <div className="text-center">
              <p className="text-muted-foreground">
                Don't have an account?{' '}
                <Link
                  href="/register"
                  className="text-primary hover:text-primary/80 font-medium"
                >
                  Join WIFT Africa
                </Link>
              </p>
              <p className="mt-4 text-sm text-muted-foreground">
                Need help? <a href="mailto:support@wiftafrica.org" className="text-primary hover:text-primary/80 font-medium">Contact Support</a>
              </p>
            </div>
          </div>
        </div>

        {/* Right Side - Image */}
        <div className="hidden lg:block lg:w-1/2 relative">
          <img
            src="/WhatsApp Image 2026-02-01 at 4.14.11 PM.jpeg"
            alt="WIFT Africa"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-black/50" />
          <div className="absolute inset-0 flex items-center justify-center p-12">
            <div className="text-white text-center max-w-md">
              <h2 className="text-4xl font-bold mb-4">Welcome!</h2>
              <p className="text-xl text-white/90">
                Continue your journey with Africa's premier network for women in film, television & media.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}