'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/hooks/useAuth'
import { usersApi } from '@/lib/api/users'
import { 
  AtSign, 
  Check, 
  X, 
  Loader2,
  Save,
  ArrowLeft,
  AlertCircle,
  Lightbulb
} from 'lucide-react'
import Link from 'next/link'

export default function UsernameSettingsPage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()
  const [username, setUsername] = useState('')
  const [isChecking, setIsChecking] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [checkTimeout, setCheckTimeout] = useState<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }

    if (user?.username) {
      setUsername(user.username)
    }

    loadSuggestions()
  }, [isAuthenticated, user, router])

  const loadSuggestions = async () => {
    try {
      const data = await usersApi.getUsernameSuggestions()
      setSuggestions(data.suggestions)
    } catch (err) {
      console.error('Failed to load suggestions:', err)
    }
  }

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '')
    setUsername(value)
    setError(null)
    setSuccessMessage(null)
    setIsAvailable(null)

    // Clear previous timeout
    if (checkTimeout) {
      clearTimeout(checkTimeout)
    }

    // Don't check if empty or same as current
    if (!value || value === user?.username) {
      return
    }

    // Validate length
    if (value.length < 3) {
      setError('Username must be at least 3 characters')
      return
    }

    if (value.length > 30) {
      setError('Username must be less than 30 characters')
      return
    }

    // Check availability after 500ms delay
    const timeout = setTimeout(() => {
      checkAvailability(value)
    }, 500)

    setCheckTimeout(timeout)
  }

  const checkAvailability = async (usernameToCheck: string) => {
    try {
      setIsChecking(true)
      const data = await usersApi.checkUsername(usernameToCheck)
      setIsAvailable(data.available)
      if (!data.available) {
        setError('Username is already taken')
      }
    } catch (err: any) {
      console.error('Failed to check username:', err)
      setError(err.response?.data?.error || 'Failed to check username')
    } finally {
      setIsChecking(false)
    }
  }

  const handleSave = async () => {
    if (!username || username === user?.username) {
      setError('Please enter a new username')
      return
    }

    if (username.length < 3 || username.length > 30) {
      setError('Username must be between 3 and 30 characters')
      return
    }

    if (isAvailable === false) {
      setError('Username is not available')
      return
    }

    try {
      setIsSaving(true)
      setError(null)
      setSuccessMessage(null)
      
      await usersApi.updateUsername(username)
      setSuccessMessage('Username updated successfully')
      
      // Reload user data
      window.location.reload()
    } catch (err: any) {
      console.error('Failed to update username:', err)
      setError(err.response?.data?.error || 'Failed to update username')
    } finally {
      setIsSaving(false)
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    setUsername(suggestion)
    checkAvailability(suggestion)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 py-8">
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
              <AtSign className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Username Settings</h1>
              <p className="text-muted-foreground">Set your custom username for your profile URL</p>
            </div>
          </div>
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          </div>
        )}

        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-start gap-3">
              <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-green-800">{successMessage}</p>
            </div>
          </div>
        )}

        {/* Current Username */}
        {user?.username && (
          <div className="bg-card border border-border rounded-lg p-6 mb-6">
            <h2 className="text-lg font-semibold text-foreground mb-2">Current Username</h2>
            <div className="flex items-center gap-2 text-muted-foreground">
              <AtSign className="h-4 w-4" />
              <span className="font-mono">{user.username}</span>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Your profile URL: <span className="text-primary">wiftafrica.org/{user.username}</span>
            </p>
          </div>
        )}

        {/* Username Input */}
        <div className="bg-card border border-border rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            {user?.username ? 'Change Username' : 'Set Username'}
          </h2>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-foreground mb-2">
                Username
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  <AtSign className="h-5 w-5" />
                </div>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={handleUsernameChange}
                  placeholder="your-username"
                  className="w-full pl-10 pr-12 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring font-mono"
                />
                {isChecking && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                  </div>
                )}
                {!isChecking && isAvailable === true && username !== user?.username && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <Check className="h-5 w-5 text-green-600" />
                  </div>
                )}
                {!isChecking && isAvailable === false && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <X className="h-5 w-5 text-red-600" />
                  </div>
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                3-30 characters. Lowercase letters, numbers, and hyphens only.
              </p>
              {username && username !== user?.username && (
                <p className="text-sm text-primary mt-1">
                  Your new profile URL will be: wiftafrica.org/{username}
                </p>
              )}
            </div>

            <button
              onClick={handleSave}
              disabled={isSaving || !username || username === user?.username || isAvailable === false}
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  {user?.username ? 'Update Username' : 'Set Username'}
                </>
              )}
            </button>
          </div>
        </div>

        {/* Suggestions */}
        {suggestions.length > 0 && (
          <div className="bg-card border border-border rounded-lg p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Lightbulb className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold text-foreground">Suggestions</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="px-3 py-1.5 bg-accent hover:bg-accent/80 text-foreground rounded-lg text-sm font-mono transition-colors"
                >
                  @{suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Info Box */}
        <div className="bg-accent border border-border rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
            <div className="text-sm text-muted-foreground">
              <p className="font-medium text-foreground mb-1">Important Notes</p>
              <ul className="space-y-1 list-disc list-inside">
                <li>You can change your username up to 3 times per month</li>
                <li>Your old username will become available for others to use</li>
                <li>Links to your old profile URL will redirect to your new one</li>
                <li>Choose carefully - frequent changes may confuse your connections</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
