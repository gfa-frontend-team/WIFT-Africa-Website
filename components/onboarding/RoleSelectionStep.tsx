import { useState } from 'react'
import { Film, Camera, Edit, Users, Music, Briefcase, CheckCircle, Crown, ArrowRight } from 'lucide-react'
import { useOnboarding } from '@/lib/hooks/useOnboarding'

interface RoleSelectionStepProps {
  selectedRoles: string[]
  primaryRole: string
  onRolesChange: (roles: string[]) => void
  onPrimaryRoleChange: (role: string) => void
  onNext: () => void
}

const ROLE_OPTIONS = [
  {
    value: 'PRODUCER',
    label: 'Producer',
    icon: Film,
    description: 'Develop, finance, and oversee film/TV projects',
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
  },
  {
    value: 'DIRECTOR',
    label: 'Director',
    icon: Camera,
    description: 'Lead creative vision and guide production',
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10',
  },
  {
    value: 'WRITER',
    label: 'Writer',
    icon: Edit,
    description: 'Create scripts for TV, film, or both',
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
  },
  {
    value: 'ACTRESS',
    label: 'Actress',
    icon: Users,
    description: 'Perform in films, TV shows, and productions',
    color: 'text-pink-500',
    bgColor: 'bg-pink-500/10',
  },
  {
    value: 'CREW',
    label: 'Crew',
    icon: Music,
    description: 'Technical and creative support roles',
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/10',
  },
  {
    value: 'BUSINESS',
    label: 'Entertainment Business',
    icon: Briefcase,
    description: 'Legal, finance, marketing, and representation',
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
      newErrors.roles = 'Please select at least one role'
    }

    if (selectedRoles.length > 1 && !primaryRole) {
      newErrors.primaryRole = 'Please select a primary role for search prioritization'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    try {
      await submitRoles({
        roles: selectedRoles,
        primaryRole: selectedRoles.length === 1 ? selectedRoles[0] : primaryRole,
      })

      console.log('✅ Roles saved successfully')
      onNext()
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
          What's your role in the industry?
        </h2>
        <p className="text-muted-foreground">
          Select all that apply to your professional work
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
                    {role.label}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {role.description}
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
              Multihyphenate Professional
            </h3>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            You've selected multiple roles! This makes you a multihyphenate professional. 
            Please select your primary role for search prioritization.
          </p>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Primary Role (for search prioritization)
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
              <option value="">Select primary role...</option>
              {selectedRoles.map((roleValue) => {
                const role = ROLE_OPTIONS.find((r) => r.value === roleValue)
                return (
                  <option key={roleValue} value={roleValue}>
                    {role?.label}
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
          {isSaving ? 'Saving...' : 'Continue'}
          {!isSaving && <ArrowRight className="h-5 w-5" />}
        </button>
      </div>
    </div>
  )
}
