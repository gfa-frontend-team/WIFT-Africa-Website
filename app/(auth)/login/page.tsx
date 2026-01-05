'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Mail, Lock } from 'lucide-react'
import Link from 'next/link'
import Script from 'next/script'
import { useAuth } from '@/lib/hooks/useAuth'
import { useGoogleAuth } from '@/lib/hooks/useGoogleAuth'

export default function LoginPage() {
  const router = useRouter()
  const { login, isAuthenticated, isEmailVerified, onboardingComplete, isLoading: isAuthLoading } = useAuth()
  const { initializeGoogleAuth, signInWithGoogle, isGoogleLoading, isScriptLoaded } = useGoogleAuth()
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

  // Initialize Google Auth when script loads
  useEffect(() => {
    if (isScriptLoaded) {
      initializeGoogleAuth()
      
      // Try to render the Google button
      setTimeout(() => {
        const buttonContainer = document.getElementById('google-signin-button')
        const fallbackButton = document.getElementById('fallback-google-button')
        
        if (buttonContainer && window.google) {
          try {
            window.google.accounts.id.renderButton(buttonContainer, {
              theme: 'outline',
              size: 'large',
              width: buttonContainer.offsetWidth,
              text: 'signin_with',
              shape: 'rectangular',
              logo_alignment: 'left',
            })
          } catch (error) {
            console.error('Failed to render Google button:', error)
            // Show fallback button
            if (fallbackButton) {
              fallbackButton.style.display = 'flex'
            }
          }
        }
      }, 100)
    }
  }, [isScriptLoaded, initializeGoogleAuth])

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

  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle()
    } catch (error) {
      console.error('Google login failed:', error)
    }
  }

  return (
    <>
      {/* Google Identity Services Script */}
      <Script
        src="https://accounts.google.com/gsi/client"
        onLoad={() => initializeGoogleAuth()}
        strategy="afterInteractive"
      />
      
      <div className="min-h-screen flex">
        {/* Left Side - Form */}
        <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-background">
          <div className="w-full max-w-md space-y-8">
            {/* Header */}
            <div className="text-center">
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
              <div className="min-h-[50px] relative">
                {!isScriptLoaded ? (
                   <div className="w-full h-[50px] bg-accent/20 animate-pulse rounded-lg border border-border flex items-center justify-center">
                     <span className="text-sm text-muted-foreground">Loading secure login...</span>
                   </div>
                ) : (
                   <>
                    {/* Custom Google Button */}
                    <div id="google-signin-button" className="w-full"></div>
                    
                    {/* Fallback Manual Button */}
                    <button
                        onClick={handleGoogleLogin}
                        disabled={isLoading}
                        className="w-full hidden justify-center items-center gap-3 py-3 px-4 border border-border rounded-lg bg-background hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        id="fallback-google-button"
                    >
                        <svg className="h-5 w-5" viewBox="0 0 24 24">
                        <path
                            fill="#4285F4"
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                            fill="#34A853"
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                            fill="#FBBC05"
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                            fill="#EA4335"
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                        </svg>
                        <span className="text-sm font-medium">
                        {isLoading ? 'Signing in...' : 'Continue with Google'}
                        </span>
                    </button>
                   </>
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
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
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
            </div>
          </div>
        </div>

        {/* Right Side - Image */}
        <div className="hidden lg:block lg:w-1/2 relative">
          <img
            src="https://images.unsplash.com/photo-1489599162946-648229b4b4b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
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