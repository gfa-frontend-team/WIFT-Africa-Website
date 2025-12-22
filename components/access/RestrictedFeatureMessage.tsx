'use client'

import { Lock, AlertTriangle, Clock, ExternalLink } from 'lucide-react'
import { MembershipStatus } from '@/types'
import Link from 'next/link'

interface RestrictedFeatureMessageProps {
  title: string
  description: string
  membershipStatus: MembershipStatus
  actionText?: string
  actionHref?: string
  size?: 'sm' | 'md' | 'lg'
  variant?: 'card' | 'banner' | 'inline'
}

export default function RestrictedFeatureMessage({
  title,
  description,
  membershipStatus,
  actionText = 'View Status',
  actionHref = '/verification',
  size = 'md',
  variant = 'card'
}: RestrictedFeatureMessageProps) {
  
  const getStatusConfig = () => {
    switch (membershipStatus) {
      case MembershipStatus.PENDING:
        return {
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          textColor: 'text-yellow-800',
          iconColor: 'text-yellow-600',
          icon: Clock,
          statusText: 'Verification Pending'
        }
      case MembershipStatus.REJECTED:
        return {
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          textColor: 'text-red-800',
          iconColor: 'text-red-600',
          icon: AlertTriangle,
          statusText: 'Application Declined'
        }
      case MembershipStatus.SUSPENDED:
        return {
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
          textColor: 'text-gray-800',
          iconColor: 'text-gray-600',
          icon: AlertTriangle,
          statusText: 'Membership Suspended'
        }
      default:
        return {
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
          textColor: 'text-gray-800',
          iconColor: 'text-gray-600',
          icon: Lock,
          statusText: 'Access Restricted'
        }
    }
  }

  const statusConfig = getStatusConfig()
  const StatusIcon = statusConfig.icon

  const sizeClasses = {
    sm: {
      padding: 'p-3',
      iconSize: 'h-4 w-4',
      titleSize: 'text-sm font-medium',
      descSize: 'text-xs',
      buttonSize: 'px-2 py-1 text-xs'
    },
    md: {
      padding: 'p-4',
      iconSize: 'h-5 w-5',
      titleSize: 'text-base font-semibold',
      descSize: 'text-sm',
      buttonSize: 'px-3 py-1.5 text-sm'
    },
    lg: {
      padding: 'p-6',
      iconSize: 'h-6 w-6',
      titleSize: 'text-lg font-semibold',
      descSize: 'text-base',
      buttonSize: 'px-4 py-2 text-sm'
    }
  }

  const variantClasses = {
    card: `${statusConfig.bgColor} ${statusConfig.borderColor} border rounded-lg`,
    banner: `${statusConfig.bgColor} ${statusConfig.borderColor} border-l-4 border-r-0 border-t-0 border-b-0`,
    inline: `${statusConfig.bgColor} rounded-md`
  }

  const currentSize = sizeClasses[size]
  const currentVariant = variantClasses[variant]

  return (
    <div className={`${currentVariant} ${currentSize.padding}`}>
      <div className="flex items-start gap-3">
        {/* Status Icon */}
        <div className="flex-shrink-0 mt-0.5">
          <StatusIcon className={`${currentSize.iconSize} ${statusConfig.iconColor}`} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h3 className={`${currentSize.titleSize} ${statusConfig.textColor} mb-1`}>
                {title}
              </h3>
              <p className={`${currentSize.descSize} ${statusConfig.textColor} opacity-90 mb-2`}>
                {description}
              </p>
              <div className="flex items-center gap-1 mb-3">
                <span className={`${currentSize.descSize} font-medium ${statusConfig.textColor}`}>
                  Status: {statusConfig.statusText}
                </span>
              </div>
            </div>

            {/* Action Button */}
            <div className="flex-shrink-0">
              <Link
                href={actionHref}
                className={`inline-flex items-center gap-1 ${currentSize.buttonSize} font-medium rounded-md transition-colors ${statusConfig.textColor} hover:bg-black/5 border border-current/20`}
              >
                {actionText}
                <ExternalLink className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Preset components for common use cases
export function RestrictedFeatureBanner({ 
  title, 
  description, 
  membershipStatus, 
  actionText, 
  actionHref 
}: Omit<RestrictedFeatureMessageProps, 'size' | 'variant'>) {
  return (
    <RestrictedFeatureMessage
      title={title}
      description={description}
      membershipStatus={membershipStatus}
      actionText={actionText}
      actionHref={actionHref}
      size="sm"
      variant="banner"
    />
  )
}

export function RestrictedFeatureCard({ 
  title, 
  description, 
  membershipStatus, 
  actionText, 
  actionHref 
}: Omit<RestrictedFeatureMessageProps, 'size' | 'variant'>) {
  return (
    <RestrictedFeatureMessage
      title={title}
      description={description}
      membershipStatus={membershipStatus}
      actionText={actionText}
      actionHref={actionHref}
      size="lg"
      variant="card"
    />
  )
}