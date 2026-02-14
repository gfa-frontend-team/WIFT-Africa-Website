'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/hooks/useAuth'
import { onboardingApi, type Chapter } from '@/lib/api/onboarding'
import { MembershipStatus } from '@/types'
import {
  Clock,
  CheckCircle2,
  AlertTriangle,
  MapPin,
  Users,
  Calendar,
  Mail,
  Phone,
  Loader2,
  ExternalLink,
  RefreshCw
} from 'lucide-react'

export default function VerificationProgress() {
  const { user } = useAuth()
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

  if (!user) return null

  const getStatusConfig = () => {
    switch (user.membershipStatus) {
      case MembershipStatus.PENDING:
        return {
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          textColor: 'text-yellow-800',
          iconColor: 'text-yellow-600',
          icon: Clock,
          title: 'Verification in Progress',
          description: 'Your membership application is being reviewed by your chapter administrator.',
          timeline: 'Typically takes 24-48 hours',
          nextSteps: [
            'Chapter administrator will review your application',
            'You\'ll receive an email notification when approved',
            'Full platform access will be automatically enabled'
          ]
        }
      case MembershipStatus.APPROVED:
        return {
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          textColor: 'text-green-800',
          iconColor: 'text-green-600',
          icon: CheckCircle2,
          title: 'Membership Verified',
          description: 'Your membership has been approved and you have full access to all platform features.',
          timeline: null,
          nextSteps: [
            'Complete your profile to increase visibility',
            'Connect with other members in your chapter',
            'Explore opportunities and resources'
          ]
        }
      case MembershipStatus.REJECTED:
        return {
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          textColor: 'text-red-800',
          iconColor: 'text-red-600',
          icon: AlertTriangle,
          title: 'Application Declined',
          description: 'Your membership application was not approved at this time.',
          timeline: null,
          nextSteps: [
            'Contact your chapter administrator for more information',
            'Contact support@wiftafrica.org for further assistance',
            'Review membership requirements',
            'Consider reapplying with additional information'
          ]
        }
      case MembershipStatus.SUSPENDED:
        return {
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
          textColor: 'text-gray-800',
          iconColor: 'text-gray-600',
          icon: AlertTriangle,
          title: 'Membership Suspended',
          description: 'Your membership has been temporarily suspended.',
          timeline: null,
          nextSteps: [
            'Contact your chapter administrator immediately',
            'Contact support@wiftafrica.org for appeals',
            'Review community guidelines',
            'Follow reinstatement procedures if available'
          ]
        }
      default:
        return null
    }
  }

  const statusConfig = getStatusConfig()
  if (!statusConfig) return null

  const StatusIcon = statusConfig.icon

  return (
    <div className={`${statusConfig.bgColor} ${statusConfig.borderColor} border rounded-lg p-6`}>
      {/* Header */}
      <div className="flex items-start gap-4 mb-4">
        <div className={`p-2 rounded-lg bg-white/50 ${statusConfig.iconColor}`}>
          <StatusIcon className="h-6 w-6" />
        </div>
        <div className="flex-1">
          <h3 className={`text-lg font-semibold ${statusConfig.textColor} mb-1`}>
            {statusConfig.title}
          </h3>
          <p className={`text-sm ${statusConfig.textColor} opacity-90`}>
            {statusConfig.description}
          </p>
          {statusConfig.timeline && (
            <div className="flex items-center gap-1 mt-2">
              <Calendar className="h-4 w-4" />
              <span className={`text-sm font-medium ${statusConfig.textColor}`}>
                {statusConfig.timeline}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Chapter Information */}
      {user.chapterId && (
        <div className="mb-4 p-4 bg-white/30 rounded-lg">
          <h4 className={`text-sm font-medium ${statusConfig.textColor} mb-2`}>
            Your Chapter
          </h4>
          {isLoadingChapter ? (
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className={`text-sm ${statusConfig.textColor} opacity-75`}>
                Loading chapter information...
              </span>
            </div>
          ) : chapter ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span className={`text-sm font-medium ${statusConfig.textColor}`}>
                  {chapter.name}
                </span>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  <span className={statusConfig.textColor}>
                    {chapter.city ? `${chapter.city}, ${chapter.country}` : chapter.country}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  <span className={statusConfig.textColor}>
                    {chapter.memberCount.toLocaleString()} members
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <span className={`text-sm ${statusConfig.textColor} opacity-75`}>
              Chapter information unavailable
            </span>
          )}
        </div>
      )}

      {/* Next Steps */}
      <div className="mb-4">
        <h4 className={`text-sm font-medium ${statusConfig.textColor} mb-2`}>
          {user.membershipStatus === MembershipStatus.APPROVED ? 'Recommended Actions' : 'What happens next?'}
        </h4>
        <ul className="space-y-1">
          {statusConfig.nextSteps.map((step, index) => (
            <li key={index} className={`text-sm ${statusConfig.textColor} opacity-90 flex items-start gap-2`}>
              <span className="text-xs mt-1">•</span>
              <span>{step}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-2 border-t border-current/10">
        <a
          href="/settings/account"
          className={`inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${statusConfig.textColor} hover:bg-white/30 border border-current/20`}
        >
          View Account Settings
          <ExternalLink className="h-3 w-3" />
        </a>

        {user.membershipStatus === MembershipStatus.PENDING && (
          <button
            onClick={() => window.location.reload()}
            className={`inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${statusConfig.textColor} hover:bg-white/30 border border-current/20`}
          >
            <RefreshCw className="h-3 w-3" />
            Check Status
          </button>
        )}
      </div>
    </div>
  )
}