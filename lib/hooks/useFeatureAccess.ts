import { useAuth } from './useAuth'
import { MembershipStatus } from '@/types'

export interface FeatureAccess {
  // Core features
  canViewFeed: boolean
  canSendMessages: boolean
  canViewOpportunities: boolean
  canApplyToOpportunities: boolean
  canViewResources: boolean
  canViewDirectory: boolean
  canViewEvents: boolean
  canRSVPEvents: boolean

  // Profile features
  canEditProfile: boolean
  canUploadCV: boolean
  canChangeUsername: boolean
  canViewOtherProfiles: boolean

  // Networking features
  canConnectWithMembers: boolean
  canJoinGroups: boolean
  canCreateContent: boolean

  // Settings
  canChangePassword: boolean
  canDeleteAccount: boolean
  canManagePrivacy: boolean
}

export interface RestrictedFeature {
  feature: keyof FeatureAccess
  reason: string
  upgradeMessage: string
  actionText: string
  actionHref: string
}

export function useFeatureAccess() {
  const { user } = useAuth()

  if (!user) {
    // Return all false for unauthenticated users
    const noAccess: FeatureAccess = {
      canViewFeed: false,
      canSendMessages: false,
      canViewOpportunities: false,
      canApplyToOpportunities: false,
      canViewResources: false,
      canViewDirectory: false,
      canViewEvents: false,
      canRSVPEvents: false,
      canEditProfile: false,
      canUploadCV: false,
      canChangeUsername: false,
      canViewOtherProfiles: false,
      canConnectWithMembers: false,
      canJoinGroups: false,
      canCreateContent: false,
      canChangePassword: false,
      canDeleteAccount: false,
      canManagePrivacy: false,
    }
    return { access: noAccess, restrictedFeatures: [] }
  }

  const isApproved = user.membershipStatus === MembershipStatus.APPROVED
  const isPending = user.membershipStatus === MembershipStatus.PENDING
  const isRejected = user.membershipStatus === MembershipStatus.REJECTED
  const isSuspended = user.membershipStatus === MembershipStatus.SUSPENDED

  // Define access levels based on membership status
  const access: FeatureAccess = {
    // Core features - limited for unverified members
    canViewFeed: isApproved || isPending, // Pending can view but not interact
    canSendMessages: isApproved,
    canViewOpportunities: isApproved || isPending, // Can view but not apply
    canApplyToOpportunities: isApproved,
    canViewResources: isApproved || isPending,
    canViewDirectory: isApproved || isPending, // Can view but not connect
    canViewEvents: isApproved || isPending,
    canRSVPEvents: isApproved,

    // Profile features - basic editing allowed for all
    canEditProfile: !isSuspended, // Everyone except suspended can edit
    canUploadCV: !isSuspended,
    canChangeUsername: isApproved, // Only approved members
    canViewOtherProfiles: isApproved || isPending,

    // Networking features - approved only
    canConnectWithMembers: isApproved,
    canJoinGroups: isApproved,
    canCreateContent: isApproved,

    // Settings - basic access for all
    canChangePassword: !isSuspended,
    canDeleteAccount: !isSuspended,
    canManagePrivacy: !isSuspended,
  }

  // Generate list of restricted features with explanations
  const restrictedFeatures: RestrictedFeature[] = []

  if (!isApproved) {
    const baseReason = isPending
      ? 'Your membership is pending verification'
      : isRejected
        ? 'Your membership application was declined'
        : 'Your membership is suspended'

    const upgradeMessage = isPending
      ? 'Complete verification to unlock all features'
      : isRejected
        ? 'Contact your chapter administrator or support@wiftafrica.org for assistance'
        : 'Contact your chapter administrator or support@wiftafrica.org to resolve suspension'

    if (!access.canSendMessages) {
      restrictedFeatures.push({
        feature: 'canSendMessages',
        reason: baseReason,
        upgradeMessage,
        actionText: 'View Status',
        actionHref: '/verification'
      })
    }

    if (!access.canApplyToOpportunities) {
      restrictedFeatures.push({
        feature: 'canApplyToOpportunities',
        reason: baseReason,
        upgradeMessage,
        actionText: 'View Status',
        actionHref: '/verification'
      })
    }

    if (!access.canRSVPEvents) {
      restrictedFeatures.push({
        feature: 'canRSVPEvents',
        reason: baseReason,
        upgradeMessage,
        actionText: 'View Status',
        actionHref: '/verification'
      })
    }

    if (!access.canConnectWithMembers) {
      restrictedFeatures.push({
        feature: 'canConnectWithMembers',
        reason: baseReason,
        upgradeMessage,
        actionText: 'View Status',
        actionHref: '/verification'
      })
    }

    if (!access.canChangeUsername) {
      restrictedFeatures.push({
        feature: 'canChangeUsername',
        reason: baseReason,
        upgradeMessage,
        actionText: 'View Status',
        actionHref: '/verification'
      })
    }
  }

  return { access, restrictedFeatures, membershipStatus: user.membershipStatus }
}

// Helper function to get restriction info for a specific feature
export function getFeatureRestriction(
  feature: keyof FeatureAccess,
  restrictedFeatures: RestrictedFeature[]
): RestrictedFeature | null {
  return restrictedFeatures.find(rf => rf.feature === feature) || null
}