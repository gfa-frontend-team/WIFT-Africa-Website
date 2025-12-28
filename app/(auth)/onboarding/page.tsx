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
  const [currentStep, setCurrentStep] = useState(1)

  // Form data
  const [roles, setRoles] = useState<string[]>([])
  const [primaryRole, setPrimaryRole] = useState<string>('')
  const [writerSpecialization, setWriterSpecialization] = useState<string>('')
  const [crewSpecializations, setCrewSpecializations] = useState<string[]>([])
  const [businessSpecializations, setBusinessSpecializations] = useState<string[]>([])

  // Check auth and sync progress data
  useEffect(() => {
    // Auth checks
    if (!isAuthenticated) {
      // Allow time for auth to initialize? 
      // useAuth handles initial loading, so if !isAuthenticated and !isLoading (implied), redirect.
      // But for simplicity let's assume if it is false we redirect effectively.
      // Better to check isLoading from useAuth but sticking to original logic slightly improved.
      // router.push('/login') // Moved this check to be safer, or just rely on middleware/protected route wrapper if exists.
      // The original code did strict checks here.
    }
    
    if (isAuthenticated && !isEmailVerified) {
      router.push('/verify-email')
    } else if (user?.onboardingComplete) {
      router.push('/feed')
    }

    // Sync progress data to local state
    if (progress) {
      setCurrentStep(progress.currentStep || 1)
      
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
  }, [progress, isAuthenticated, isEmailVerified, user, router])

  const handleNext = () => {
    setCurrentStep((prev) => prev + 1)
  }

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(1, prev - 1))
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

  return (
    <OnboardingLayout currentStep={currentStep} totalSteps={5}>
      {currentStep === 1 && (
        <RoleSelectionStep
          selectedRoles={roles}
          primaryRole={primaryRole}
          onRolesChange={setRoles}
          onPrimaryRoleChange={setPrimaryRole}
          onNext={handleNext}
        />
      )}

      {currentStep === 2 && (
        <SpecializationsStep
          roles={roles}
          writerSpecialization={writerSpecialization}
          crewSpecializations={crewSpecializations}
          businessSpecializations={businessSpecializations}
          onWriterSpecChange={setWriterSpecialization}
          onCrewSpecsChange={setCrewSpecializations}
          onBusinessSpecsChange={setBusinessSpecializations}
          onNext={handleNext}
          onPrevious={handlePrevious}
        />
      )}

      {currentStep === 3 && (
        <ChapterSelectionStep
          onNext={handleNext}
          onPrevious={handlePrevious}
        />
      )}

      {currentStep === 4 && (
        <ProfileSetupStep
          onNext={handleNext}
          onPrevious={handlePrevious}
        />
      )}

      {currentStep === 5 && (
        <TermsAcceptanceStep
          onPrevious={handlePrevious}
        />
      )}
    </OnboardingLayout>
  )
}
