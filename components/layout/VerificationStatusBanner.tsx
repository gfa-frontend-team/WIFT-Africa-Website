'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/hooks/useAuth'
import { onboardingApi, type Chapter } from '@/lib/api/onboarding'
import { MembershipStatus } from '@/types'
import { 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  X, 
  MapPin, 
  Users,
  ExternalLink,
  Loader2
} from 'lucide-react'

export default function VerificationStatusBanner() {
  const { user } = useAuth()
  const [isDismissed, setIsDismissed] = useState(false)
  const [chapter, setChapter] = useState<Chapter | null>(null)
  const [isLoadingChapter, setIsLoadingChapter] = useState(false)

  // Load chapter information
  useEffect(() => {
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
  }, [user?.chapterId])

  // Don't show banner if dismissed or user is approved
  if (isDismissed || !user || user.membershipStatus === MembershipStatus.APPROVED) {
    return null
  }

  const getStatusConfig = () => {
    switch (user.membershipStatus) {
      case MembershipStatus.PENDING:
        return {
          bgColor: 'bg-yellow-50 border-yellow-200',
          textColor: 'text-yellow-800',
          iconColor: 'text-yellow-600',
          icon: Clock,
          title: 'Membership Verification Pending',
          message: 'Your membership application is being reviewed by your chapter administrator.',
          actionText: 'View Status',
          actionHref: '/verification'
        }
      case MembershipStatus.REJECTED:
        return {
          bgColor: 'bg-red-50 border-red-200',
          textColor: 'text-red-800',
          iconColor: 'text-red-600',
          icon: AlertTriangle,
          title: 'Membership Application Declined',
          message: 'Your membership application was not approved. Contact your chapter administrator for more information.',
          actionText: 'View Details',
          actionHref: '/verification'
        }
      case MembershipStatus.SUSPENDED:
        return {
          bgColor: 'bg-gray-50 border-gray-200',
          textColor: 'text-gray-800',
          iconColor: 'text-gray-600',
          icon: AlertTriangle,
          title: 'Membership Suspended',
          message: 'Your membership has been temporarily suspended. Please contact your chapter administrator.',
          actionText: 'View Details',
          actionHref: '/verification'
        }
      default:
        return null
    }
  }

  const statusConfig = getStatusConfig()
  if (!statusConfig) return null

  const StatusIcon = statusConfig.icon

  return (
    <div className={`border-b ${statusConfig.bgColor}`}>
      <div className="max-w-screen-xl mx-auto px-4 py-3">
        <div className="flex items-start gap-3">
          {/* Status Icon */}
          <div className="flex-shrink-0 mt-0.5">
            <StatusIcon className={`h-5 w-5 ${statusConfig.iconColor}`} />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h3 className={`text-sm font-semibold ${statusConfig.textColor} mb-1`}>
                  {statusConfig.title}
                </h3>
                <p className={`text-sm ${statusConfig.textColor} mb-2`}>
                  {statusConfig.message}
                </p>

                {/* Chapter Information */}
                {user.chapterId && (
                  <div className="flex items-center gap-4 text-xs">
                    {isLoadingChapter ? (
                      <div className="flex items-center gap-1">
                        <Loader2 className="h-3 w-3 animate-spin" />
                        <span className={statusConfig.textColor}>Loading chapter info...</span>
                      </div>
                    ) : chapter ? (
                      <>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          <span className={statusConfig.textColor}>
                            {chapter.name}
                            {chapter.city && `, ${chapter.city}`}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          <span className={statusConfig.textColor}>
                            {chapter.memberCount.toLocaleString()} members
                          </span>
                        </div>
                      </>
                    ) : (
                      <span className={`${statusConfig.textColor} opacity-75`}>
                        Chapter information unavailable
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <a
                  href={statusConfig.actionHref}
                  className={`inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${statusConfig.textColor} hover:bg-black/5 border border-current/20`}
                >
                  {statusConfig.actionText}
                  <ExternalLink className="h-3 w-3" />
                </a>
                <button
                  onClick={() => setIsDismissed(true)}
                  className={`p-1 rounded-md transition-colors ${statusConfig.textColor} hover:bg-black/10`}
                  aria-label="Dismiss notification"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}