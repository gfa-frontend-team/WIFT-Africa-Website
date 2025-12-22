'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Monitor, Smartphone, Tablet, Loader2, ArrowLeft, LogOut, AlertTriangle } from 'lucide-react'
import Link from 'next/link'
import { authApi } from '@/lib/api/auth'
import { useAuth } from '@/lib/hooks/useAuth'

interface Session {
  id: string
  deviceInfo: string
  lastActive: string
  current: boolean
}

export default function SessionsPage() {
  const router = useRouter()
  const { isAuthenticated, logout } = useAuth()
  const [sessions, setSessions] = useState<Session[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [logoutingSessionId, setLogoutingSessionId] = useState<string | null>(null)
  const [isLogoutingAll, setIsLogoutingAll] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }
    fetchSessions()
  }, [isAuthenticated, router])

  const fetchSessions = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await authApi.getActiveSessions()
      setSessions(response.sessions)
    } catch (err: unknown) {
      console.error('Failed to fetch sessions:', err)
      const message = err instanceof Error && 'response' in err && err.response && typeof err.response === 'object' && 'data' in err.response && err.response.data && typeof err.response.data === 'object' && 'message' in err.response.data 
        ? String(err.response.data.message) 
        : 'Failed to load sessions'
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogoutSession = async (sessionId: string) => {
    try {
      setLogoutingSessionId(sessionId)
      await authApi.logoutSession(sessionId)
      // Refresh sessions list
      await fetchSessions()
    } catch (err: unknown) {
      console.error('Failed to logout session:', err)
      const message = err instanceof Error && 'response' in err && err.response && typeof err.response === 'object' && 'data' in err.response && err.response.data && typeof err.response.data === 'object' && 'message' in err.response.data 
        ? String(err.response.data.message) 
        : 'Failed to logout session'
      setError(message)
    } finally {
      setLogoutingSessionId(null)
    }
  }

  const handleLogoutAll = async () => {
    if (!confirm('Are you sure you want to logout from all devices? You will need to login again.')) {
      return
    }

    try {
      setIsLogoutingAll(true)
      await authApi.logoutAllDevices()
      // Logout and redirect
      await logout()
      router.push('/login?message=Logged out from all devices')
    } catch (err: unknown) {
      console.error('Failed to logout all:', err)
      const message = err instanceof Error && 'response' in err && err.response && typeof err.response === 'object' && 'data' in err.response && err.response.data && typeof err.response.data === 'object' && 'message' in err.response.data 
        ? String(err.response.data.message) 
        : 'Failed to logout from all devices'
      setError(message)
    } finally {
      setIsLogoutingAll(false)
    }
  }

  const getDeviceIcon = (deviceInfo: string) => {
    const info = deviceInfo.toLowerCase()
    if (info.includes('mobile') || info.includes('android') || info.includes('iphone')) {
      return <Smartphone className="h-5 w-5" />
    }
    if (info.includes('tablet') || info.includes('ipad')) {
      return <Tablet className="h-5 w-5" />
    }
    return <Monitor className="h-5 w-5" />
  }

  const formatLastActive = (lastActive: string) => {
    const date = new Date(lastActive)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
    return date.toLocaleDateString()
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/settings"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Settings
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Active Sessions</h1>
            <p className="text-muted-foreground mt-2">
              Manage your active sessions across all devices
            </p>
          </div>
          {sessions.length > 1 && (
            <button
              onClick={handleLogoutAll}
              disabled={isLogoutingAll}
              className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
            >
              {isLogoutingAll ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Logging out...
                </>
              ) : (
                <>
                  <LogOut className="h-4 w-4" />
                  Logout All Devices
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start">
            <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-red-800">{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="ml-3 text-red-600 hover:text-red-800"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : sessions.length === 0 ? (
        <div className="bg-card border border-border rounded-lg p-8 text-center">
          <Monitor className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No active sessions found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {sessions.map((session) => (
            <div
              key={session.id}
              className={`bg-card border rounded-lg p-6 ${
                session.current ? 'border-primary' : 'border-border'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg ${
                    session.current ? 'bg-primary/10 text-primary' : 'bg-accent text-muted-foreground'
                  }`}>
                    {getDeviceIcon(session.deviceInfo)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-foreground">{session.deviceInfo}</h3>
                      {session.current && (
                        <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full font-medium">
                          Current Device
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Last active: {formatLastActive(session.lastActive)}
                    </p>
                  </div>
                </div>
                {!session.current && (
                  <button
                    onClick={() => handleLogoutSession(session.id)}
                    disabled={logoutingSessionId === session.id}
                    className="inline-flex items-center gap-2 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                  >
                    {logoutingSessionId === session.id ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Logging out...
                      </>
                    ) : (
                      <>
                        <LogOut className="h-4 w-4" />
                        Logout
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Info Box */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-sm font-medium text-blue-900 mb-2">About Sessions</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Each session represents a device where you&apos;re logged in</li>
          <li>• You can logout from individual devices or all devices at once</li>
          <li>• If you see an unfamiliar device, logout immediately and change your password</li>
          <li>• Sessions expire automatically after a period of inactivity</li>
        </ul>
      </div>
    </div>
  )
}
