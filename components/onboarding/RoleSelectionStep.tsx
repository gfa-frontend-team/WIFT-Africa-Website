import { useTranslation } from 'react-i18next'
import { useState } from 'react'
import { Film, Camera, Edit, Users, Music, Briefcase, CheckCircle, Crown, ArrowRight } from 'lucide-react'
import { useOnboarding } from '@/lib/hooks/useOnboarding'

interface RoleSelectionStepProps {
  selectedRoles: string[]
  primaryRole: string
  onRolesChange: (roles: string[]) => void
  onPrimaryRoleChange: (role: string) => void
  onNext: (nextStep: number) => void
}

const ROLE_OPTIONS = [
  {
    value: 'PRODUCER',
    labelKey: 'onboarding.roles.options.producer',
    icon: Film,
    descriptionKey: 'onboarding.roles.options.producer_desc',
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
  },
  {
    value: 'DIRECTOR',
    labelKey: 'onboarding.roles.options.director',
    icon: Camera,
    descriptionKey: 'onboarding.roles.options.director_desc',
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10',
  },
  {
    value: 'WRITER',
    labelKey: 'onboarding.roles.options.writer',
    icon: Edit,
    descriptionKey: 'onboarding.roles.options.writer_desc',
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
  },
  {
    value: 'ACTRESS',
    labelKey: 'onboarding.roles.options.actress',
    icon: Users,
    descriptionKey: 'onboarding.roles.options.actress_desc',
    color: 'text-pink-500',
    bgColor: 'bg-pink-500/10',
  },
  {
    value: 'CREW',
    labelKey: 'onboarding.roles.options.crew',
    icon: Music,
    descriptionKey: 'onboarding.roles.options.crew_desc',
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/10',
  },
  {
    value: 'BUSINESS',
    labelKey: 'onboarding.roles.options.business',
    icon: Briefcase,
    descriptionKey: 'onboarding.roles.options.business_desc',
    color: 'text-red-500',
    bgColor: 'bg-red-500/10',
  },
]

export default function RoleSelectionStep({
  selectedRoles,
  primaryRole,
  onRolesChange,
  onPrimaryRoleChange,
  onNext,
}: RoleSelectionStepProps) {
  const { t } = useTranslation()
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const { submitRoles, isSubmittingRoles: isSaving } = useOnboarding()

  const handleRoleToggle = (roleValue: string) => {
    const newRoles = selectedRoles.includes(roleValue)
      ? selectedRoles.filter((r) => r !== roleValue)
      : [...selectedRoles, roleValue]

    onRolesChange(newRoles)

    // Clear primary role if it's no longer selected
    if (!newRoles.includes(primaryRole)) {
      onPrimaryRoleChange('')
    }

    // Clear errors
    if (errors.roles) {
      setErrors({})
    }
  }

  const validateAndSubmit = async () => {
    const newErrors: { [key: string]: string } = {}

    if (selectedRoles.length === 0) {
      newErrors.roles = t('onboarding.roles.error_required')
    }

    if (selectedRoles.length > 1 && !primaryRole) {
      newErrors.primaryRole = t('onboarding.roles.error_primary_required')
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    try {
      const response = await submitRoles({
        roles: selectedRoles,
        primaryRole: selectedRoles.length === 1 ? selectedRoles[0] : primaryRole,
      })

      console.log('✅ Roles saved successfully')
      
      // Navigate to the next step returned by backend (handles skipping logic)
      if (response && response.nextStep) {
        onNext(response.nextStep)
      } else {
        // Fallback if no nextStep returned (shouldn't happen with current API)
        onNext(2) 
      }
    } catch (error: any) {
      console.error('❌ Failed to save roles:', error)
      const message = error.response?.data?.error || 'Failed to save roles'
      setErrors({ roles: message })
    }
  }

  const isMultihyphenate = selectedRoles.length > 1

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-foreground mb-2">
          {t('onboarding.roles.title')}
        </h2>
        <p className="text-muted-foreground">
          {t('onboarding.roles.subtitle')}
        </p>
      </div>

      {/* Role Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {ROLE_OPTIONS.map((role) => {
          const Icon = role.icon
          const isSelected = selectedRoles.includes(role.value)

          return (
            <button
              key={role.value}
              type="button"
              onClick={() => handleRoleToggle(role.value)}
              className={`p-6 border rounded-lg text-left transition-all hover:shadow-md ${
                isSelected
                  ? `border-primary ${role.bgColor} ring-2 ring-primary/20`
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-lg ${role.bgColor}`}>
                  <Icon className={`h-6 w-6 ${role.color}`} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground mb-1">
                    {t(role.labelKey)}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {t(role.descriptionKey)}
                  </p>
                </div>
                {isSelected && <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />}
              </div>
            </button>
          )
        })}
      </div>

      {/* Error Message */}
      {errors.roles && (
        <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
          <p className="text-sm text-destructive">{errors.roles}</p>
        </div>
      )}

      {/* Multihyphenate Section */}
      {isMultihyphenate && (
        <div className="p-6 border border-primary/20 rounded-lg bg-primary/5">
          <div className="flex items-center gap-2 mb-4">
            <Crown className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-foreground">
              {t('onboarding.roles.multihyphenate_title')}
            </h3>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            {t('onboarding.roles.multihyphenate_msg')}
          </p>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              {t('onboarding.roles.primary_role_label')}
            </label>
            <select
              value={primaryRole}
              onChange={(e) => {
                onPrimaryRoleChange(e.target.value)
                if (errors.primaryRole) {
                  setErrors({})
                }
              }}
              className="w-full p-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">{t('onboarding.roles.select_primary_placeholder')}</option>
              {selectedRoles.map((roleValue) => {
                const role = ROLE_OPTIONS.find((r) => r.value === roleValue)
                return (
                  <option key={roleValue} value={roleValue}>
                    {role ? t(role.labelKey) : roleValue}
                  </option>
                )
              })}
            </select>
            {errors.primaryRole && (
              <p className="mt-2 text-sm text-destructive">{errors.primaryRole}</p>
            )}
          </div>
        </div>
      )}

      {/* Continue Button */}
      <div className="flex justify-end">
        <button
          onClick={validateAndSubmit}
          disabled={isSaving}
          className="px-6 py-3 bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-medium transition-colors inline-flex items-center gap-2"
        >
          {isSaving ? t('onboarding.common.saving') : t('onboarding.common.continue')}
          {!isSaving && <ArrowRight className="h-5 w-5" />}
        </button>
      </div>
    </div>
  )
}
