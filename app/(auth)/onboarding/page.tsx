'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/hooks/useAuth'
import OnboardingLayout from '@/components/onboarding/OnboardingLayout'
import RoleSelectionStep from '@/components/onboarding/RoleSelectionStep'
import SpecializationsStep from '@/components/onboarding/SpecializationsStep'
import ChapterSelectionStep from '@/components/onboarding/ChapterSelectionStep'
import ProfileSetupStep from '@/components/onboarding/ProfileSetupStep'
import TermsAcceptanceStep from '@/components/onboarding/TermsAcceptanceStep'
import { onboardingApi } from '@/lib/api/onboarding'

export default function OnboardingPage() {
  const router = useRouter()
  const { user, isAuthenticated, isEmailVerified } = useAuth()
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  // Form data
  const [roles, setRoles] = useState<string[]>([])
  const [primaryRole, setPrimaryRole] = useState<string>('')
  const [writerSpecialization, setWriterSpecialization] = useState<string>('')
  const [crewSpecialization, setCrewSpecialization] = useState<string>('')
  const [businessSpecialization, setBusinessSpecialization] = useState<string>('')

  // Check auth and load progress on mount
  useEffect(() => {
    const checkAuthAndLoadProgress = async () => {
      // Redirect if not authenticated
      if (!isAuthenticated) {
        router.push('/login')
        return
      }

      // Redirect if email not verified
      if (!isEmailVerified) {
        router.push('/verify-email')
        return
      }

      // Redirect if onboarding already complete
      if (user?.onboardingComplete) {
        router.push('/in/home')
        return
      }

      // Load onboarding progress
      try {
        const progress = await onboardingApi.getProgress()
        
        // Set current step from backend
        setCurrentStep(progress.currentStep || 1)
        
        // Load saved data if exists
        if (progress.data) {
          if (progress.data.roles) setRoles(progress.data.roles)
          if (progress.data.primaryRole) setPrimaryRole(progress.data.primaryRole)
          if (progress.data.specializations?.writer) {
            setWriterSpecialization(progress.data.specializations.writer)
          }
          if (progress.data.specializations?.crew) {
            setCrewSpecialization(progress.data.specializations.crew)
          }
          if (progress.data.specializations?.business) {
            setBusinessSpecialization(progress.data.specializations.business)
          }
        }
      } catch (error) {
        console.error('Failed to load onboarding progress:', error)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuthAndLoadProgress()
  }, [isAuthenticated, isEmailVerified, user, router])

  const handleNext = () => {
    setCurrentStep((prev) => prev + 1)
  }

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(1, prev - 1))
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your onboarding progress...</p>
        </div>
      </div>
    )
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
          isSaving={isSaving}
          setIsSaving={setIsSaving}
        />
      )}

      {currentStep === 2 && (
        <SpecializationsStep
          roles={roles}
          writerSpecialization={writerSpecialization}
          crewSpecialization={crewSpecialization}
          businessSpecialization={businessSpecialization}
          onWriterSpecChange={setWriterSpecialization}
          onCrewSpecChange={setCrewSpecialization}
          onBusinessSpecChange={setBusinessSpecialization}
          onNext={handleNext}
          onPrevious={handlePrevious}
          isSaving={isSaving}
          setIsSaving={setIsSaving}
        />
      )}

      {currentStep === 3 && (
        <ChapterSelectionStep
          onNext={handleNext}
          onPrevious={handlePrevious}
          isSaving={isSaving}
          setIsSaving={setIsSaving}
        />
      )}

      {currentStep === 4 && (
        <ProfileSetupStep
          onNext={handleNext}
          onPrevious={handlePrevious}
          isSaving={isSaving}
          setIsSaving={setIsSaving}
        />
      )}

      {currentStep === 5 && (
        <TermsAcceptanceStep
          onPrevious={handlePrevious}
          isSaving={isSaving}
          setIsSaving={setIsSaving}
        />
      )}
    </OnboardingLayout>
  )
}
