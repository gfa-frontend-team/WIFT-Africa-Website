'use client'

import { ReactNode } from 'react'
import { useFeatureAccess, type FeatureAccess, getFeatureRestriction } from '@/lib/hooks/useFeatureAccess'
import { MembershipStatus } from '@/types'
import RestrictedFeatureMessage from './RestrictedFeatureMessage'

interface FeatureGateProps {
  feature: keyof FeatureAccess
  children: ReactNode
  fallback?: ReactNode
  showRestrictionMessage?: boolean
  restrictionTitle?: string
  restrictionDescription?: string
  size?: 'sm' | 'md' | 'lg'
  variant?: 'card' | 'banner' | 'inline'
}

export default function FeatureGate({
  feature,
  children,
  fallback,
  showRestrictionMessage = true,
  restrictionTitle,
  restrictionDescription,
  size = 'md',
  variant = 'card'
}: FeatureGateProps) {
  const { access, restrictedFeatures, membershipStatus } = useFeatureAccess()

  // Check if user has access to this feature
  const hasAccess = access[feature]

  if (hasAccess) {
    return <>{children}</>
  }

  // If custom fallback is provided, use it
  if (fallback) {
    return <>{fallback}</>
  }

  // If restriction message is disabled, return null
  if (!showRestrictionMessage) {
    return null
  }

  // Get restriction info for this feature
  const restriction = getFeatureRestriction(feature, restrictedFeatures)

  // Default titles and descriptions based on feature
  const getDefaultContent = () => {
    switch (feature) {
      case 'canSendMessages':
        return {
          title: 'Messaging Restricted',
          description: 'Complete membership verification to send messages to other members.'
        }
      case 'canApplyToOpportunities':
        return {
          title: 'Applications Restricted',
          description: 'Complete membership verification to apply for opportunities.'
        }
      case 'canRSVPEvents':
        return {
          title: 'Event RSVP Restricted',
          description: 'Complete membership verification to RSVP for events.'
        }
      case 'canConnectWithMembers':
        return {
          title: 'Networking Restricted',
          description: 'Complete membership verification to connect with other members.'
        }
      case 'canChangeUsername':
        return {
          title: 'Username Change Restricted',
          description: 'Complete membership verification to change your username.'
        }
      case 'canCreateContent':
        return {
          title: 'Content Creation Restricted',
          description: 'Complete membership verification to create and share content.'
        }
      default:
        return {
          title: 'Feature Restricted',
          description: 'Complete membership verification to access this feature.'
        }
    }
  }

  const defaultContent = getDefaultContent()

  return (
    <RestrictedFeatureMessage
      title={restrictionTitle || defaultContent.title}
      description={restrictionDescription || restriction?.upgradeMessage || restriction?.reason || defaultContent.description}
      membershipStatus={membershipStatus || MembershipStatus.PENDING}
      actionText={restriction?.actionText}
      actionHref={restriction?.actionHref}
      size={size}
      variant={variant}
    />
  )
}

// Convenience components for common patterns
interface FeatureButtonProps {
  feature: keyof FeatureAccess
  children: ReactNode
  onClick?: () => void
  className?: string
  disabled?: boolean
}

export function FeatureButton({
  feature,
  children,
  onClick,
  className = '',
  disabled = false
}: FeatureButtonProps) {
  const { access } = useFeatureAccess()
  const hasAccess = access[feature]

  return (
    <button
      onClick={hasAccess ? onClick : undefined}
      disabled={disabled || !hasAccess}
      className={`${className} ${!hasAccess ? 'opacity-50 cursor-not-allowed' : ''}`}
      title={!hasAccess ? 'Complete membership verification to access this feature' : undefined}
    >
      {children}
    </button>
  )
}

interface FeatureLinkProps {
  feature: keyof FeatureAccess
  href: string
  children: ReactNode
  className?: string
}

export function FeatureLink({
  feature,
  href,
  children,
  className = ''
}: FeatureLinkProps) {
  const { access } = useFeatureAccess()
  const hasAccess = access[feature]

  if (!hasAccess) {
    return (
      <span
        className={`${className} opacity-50 cursor-not-allowed`}
        title="Complete membership verification to access this feature"
      >
        {children}
      </span>
    )
  }

  return (
    <a href={href} className={className}>
      {children}
    </a>
  )
}