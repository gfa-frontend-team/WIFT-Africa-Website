'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/hooks/useAuth'
import { useOnboarding } from '@/lib/hooks/useOnboarding'
import OnboardingLayout from '@/components/onboarding/OnboardingLayout'
import RoleSelectionStep from '@/components/onboarding/RoleSelectionStep'
import SpecializationsStep from '@/components/onboarding/SpecializationsStep'
import ChapterSelectionStep from '@/components/onboarding/ChapterSelectionStep'
import ProfileSetupStep from '@/components/onboarding/ProfileSetupStep'
import TermsAcceptanceStep from '@/components/onboarding/TermsAcceptanceStep'

export default function OnboardingPage() {
  const router = useRouter()
  const { user, isAuthenticated, isEmailVerified } = useAuth()
  const { progress, isLoadingProgress } = useOnboarding()
  // Form data
  const [roles, setRoles] = useState<string[]>([])
  const [primaryRole, setPrimaryRole] = useState<string>('')
  const [writerSpecialization, setWriterSpecialization] = useState<string>('')
  const [crewSpecializations, setCrewSpecializations] = useState<string[]>([])
  const [businessSpecializations, setBusinessSpecializations] = useState<string[]>([])

  // State management for navigation
  const [viewStep, setViewStep] = useState<number | null>(null)
  const [maxStep, setMaxStep] = useState<number>(1)

  // Auth checks and progress sync
  useEffect(() => {
    // Auth checks
    if (!isAuthenticated) return // Handled by outer check

    if (isEmailVerified === false) { // Strict check
      router.push('/verify-email')
      return
    } 
    
    if (user?.onboardingComplete) {
      router.push('/feed')
      return
    }

    // Sync progress data
    if (progress) {
      const backendStep = progress.currentStep || 1
      setMaxStep(backendStep)
      
      // Initialize viewStep only once or if not set
      if (viewStep === null) {
        setViewStep(backendStep)
      }

      if (progress.data) {
        if (progress.data.roles) setRoles(progress.data.roles)
        if (progress.data.primaryRole) setPrimaryRole(progress.data.primaryRole)
        if (progress.data.specializations?.writer) {
          setWriterSpecialization(progress.data.specializations.writer)
        }
        if (progress.data.specializations?.crew) {
          setCrewSpecializations(Array.isArray(progress.data.specializations.crew) 
            ? progress.data.specializations.crew 
            : [])
        }
        if (progress.data.specializations?.business) {
          setBusinessSpecializations(Array.isArray(progress.data.specializations.business) 
            ? progress.data.specializations.business 
            : [])
        }
      }
    }
  }, [progress, isAuthenticated, isEmailVerified, user, router, viewStep])

  const handleNext = (nextStepOverride?: number) => {
    if (typeof nextStepOverride === 'number') {
      // Backend dictated a specific jump (e.g. skipping steps)
      setViewStep(nextStepOverride)
      setMaxStep(Math.max(maxStep, nextStepOverride))
    } else {
      // Standard local next
      setViewStep((prev) => {
        const next = (prev || 1) + 1
        setMaxStep(Math.max(maxStep, next))
        return next
      })
    }
  }

  const handlePrevious = () => {
    setViewStep((prev) => {
      const current = prev || 1
      
      // Smart backtracking: If going back from Step 3, check if we need to skip Step 2
      if (current === 3) {
        // Specialization roles are WRITER, CREW, BUSINESS
        // If user does NOT have any of these, they skipped Step 2 when going forward.
        // So going back should also skip Step 2.
        const hasSpecializationRole = roles.some(r => ['WRITER', 'CREW', 'BUSINESS'].includes(r))
        if (!hasSpecializationRole) {
          setMaxStep(Math.max(maxStep, 1)) // Just to be safe
          return 1
        }
      }

      return Math.max(1, current - 1)
    })
  }

  if (isLoadingProgress) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your onboarding progress...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
     // Small flicker protection or redirecting view
     router.push('/login')
     return null
  }

  // Determine effective current step safely
  const effectiveStep = viewStep || 1

  return (
    <OnboardingLayout currentStep={effectiveStep} totalSteps={5}>
      {effectiveStep === 1 && (
        <RoleSelectionStep
          selectedRoles={roles}
          primaryRole={primaryRole}
          onRolesChange={setRoles}
          onPrimaryRoleChange={setPrimaryRole}
          onNext={(nextStep: number) => handleNext(nextStep)}
        />
      )}

      {effectiveStep === 2 && (
        <SpecializationsStep
          roles={roles}
          writerSpecialization={writerSpecialization}
          crewSpecializations={crewSpecializations}
          businessSpecializations={businessSpecializations}
          onWriterSpecChange={setWriterSpecialization}
          onCrewSpecsChange={setCrewSpecializations}
          onBusinessSpecsChange={setBusinessSpecializations}
          onNext={(nextStep: number) => handleNext(nextStep)}
          onPrevious={handlePrevious}
        />
      )}

      {effectiveStep === 3 && (
        <ChapterSelectionStep
          onNext={(nextStep: number) => handleNext(nextStep)}
          onPrevious={handlePrevious}
        />
      )}

      {effectiveStep === 4 && (
        <ProfileSetupStep
          onNext={(nextStep: number) => handleNext(nextStep)}
          onPrevious={handlePrevious}
        />
      )}

      {effectiveStep === 5 && (
        <TermsAcceptanceStep
          onPrevious={handlePrevious}
        />
      )}
    </OnboardingLayout>
  )
}
