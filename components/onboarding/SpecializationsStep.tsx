'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, ArrowRight, Tv, Clapperboard, Sparkles, Video, Scissors, Music2, Volume2, Palette, Shirt, Paintbrush, Lightbulb, Scale, Radio, DollarSign, Megaphone, Handshake, Newspaper } from 'lucide-react'
import { onboardingApi } from '@/lib/api/onboarding'

interface SpecializationsStepProps {
  roles: string[]
  writerSpecialization: string
  crewSpecialization: string
  businessSpecialization: string
  onWriterSpecChange: (spec: string) => void
  onCrewSpecChange: (spec: string) => void
  onBusinessSpecChange: (spec: string) => void
  onNext: () => void
  onPrevious: () => void
  isSaving: boolean
  setIsSaving: (saving: boolean) => void
}

const WRITER_SPECIALIZATIONS = [
  { value: 'TV', label: 'TV Writing', icon: Tv, description: 'Television series and shows' },
  { value: 'FILM', label: 'Film Writing', icon: Clapperboard, description: 'Feature films and cinema' },
  { value: 'BOTH', label: 'Both TV & Film', icon: Sparkles, description: 'Work across both mediums' },
]

const CREW_SPECIALIZATIONS = [
  { value: 'CINEMATOGRAPHER', label: 'Cinematographer', icon: Video },
  { value: 'EDITOR', label: 'Editor', icon: Scissors },
  { value: 'COMPOSER', label: 'Composer', icon: Music2 },
  { value: 'SOUND_DESIGNER', label: 'Sound Designer', icon: Volume2 },
  { value: 'PRODUCTION_DESIGNER', label: 'Production Designer', icon: Palette },
  { value: 'COSTUME_DESIGNER', label: 'Costume Designer', icon: Shirt },
  { value: 'MAKEUP_ARTIST', label: 'Makeup Artist', icon: Paintbrush },
  { value: 'GAFFER', label: 'Gaffer', icon: Lightbulb },
]

const BUSINESS_SPECIALIZATIONS = [
  { value: 'ENTERTAINMENT_LAW', label: 'Entertainment Law', icon: Scale },
  { value: 'DISTRIBUTION', label: 'Distribution', icon: Radio },
  { value: 'FINANCE', label: 'Finance', icon: DollarSign },
  { value: 'MARKETING', label: 'Marketing', icon: Megaphone },
  { value: 'REPRESENTATION', label: 'Representation', icon: Handshake },
  { value: 'PUBLIC_RELATIONS', label: 'Public Relations', icon: Newspaper },
]

export default function SpecializationsStep({
  roles,
  writerSpecialization,
  crewSpecialization,
  businessSpecialization,
  onWriterSpecChange,
  onCrewSpecChange,
  onBusinessSpecChange,
  onNext,
  onPrevious,
  isSaving,
  setIsSaving,
}: SpecializationsStepProps) {
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  // Check if specializations are needed
  const needsWriterSpec = roles.includes('WRITER')
  const needsCrewSpec = roles.includes('CREW')
  const needsBusinessSpec = roles.includes('BUSINESS')

  // If no specializations needed, skip to next step automatically
  useEffect(() => {
    if (!needsWriterSpec && !needsCrewSpec && !needsBusinessSpec) {
      handleSubmit()
    }
  }, [needsWriterSpec, needsCrewSpec, needsBusinessSpec])

  const validateAndSubmit = () => {
    const newErrors: { [key: string]: string } = {}

    if (needsWriterSpec && !writerSpecialization) {
      newErrors.writer = 'Please select your writer specialization'
    }

    if (needsCrewSpec && !crewSpecialization) {
      newErrors.crew = 'Please select your crew specialization'
    }

    if (needsBusinessSpec && !businessSpecialization) {
      newErrors.business = 'Please select your business specialization'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return false
    }

    return true
  }

  const handleSubmit = async () => {
    if (!validateAndSubmit()) {
      return
    }

    setIsSaving(true)

    try {
      const data: any = {}
      
      if (needsWriterSpec && writerSpecialization) {
        data.writerSpecialization = writerSpecialization
      }
      
      if (needsCrewSpec && crewSpecialization) {
        data.crewSpecialization = crewSpecialization
      }
      
      if (needsBusinessSpec && businessSpecialization) {
        data.businessSpecialization = businessSpecialization
      }

      await onboardingApi.submitSpecializations(data)

      console.log('✅ Specializations saved successfully')
      onNext()
    } catch (error: any) {
      console.error('❌ Failed to save specializations:', error)
      alert(error.response?.data?.error || 'Failed to save specializations')
    } finally {
      setIsSaving(false)
    }
  }

  // If no specializations needed, show loading state
  if (!needsWriterSpec && !needsCrewSpec && !needsBusinessSpec) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Proceeding to next step...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-foreground mb-2">
          Tell us more about your specialization
        </h2>
        <p className="text-muted-foreground">
          This helps us connect you with relevant opportunities
        </p>
      </div>

      {/* Writer Specialization */}
      {needsWriterSpec && (
        <div>
          <h3 className="font-semibold text-foreground mb-4">
            Writer Specialization
            <span className="text-red-500 ml-1">*</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {WRITER_SPECIALIZATIONS.map((spec) => {
              const Icon = spec.icon
              const isSelected = writerSpecialization === spec.value

              return (
                <button
                  key={spec.value}
                  type="button"
                  onClick={() => {
                    onWriterSpecChange(spec.value)
                    if (errors.writer) {
                      setErrors((prev) => ({ ...prev, writer: '' }))
                    }
                  }}
                  className={`p-6 border rounded-lg text-center transition-all hover:shadow-md ${
                    isSelected
                      ? 'border-primary bg-primary/10 ring-2 ring-primary/20'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="mb-3">
                    <Icon className={`h-10 w-10 mx-auto ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
                  </div>
                  <h4 className="font-semibold text-foreground mb-1">{spec.label}</h4>
                  <p className="text-sm text-muted-foreground">{spec.description}</p>
                </button>
              )
            })}
          </div>
          {errors.writer && (
            <p className="mt-2 text-sm text-destructive">{errors.writer}</p>
          )}
        </div>
      )}

      {/* Crew Specialization */}
      {needsCrewSpec && (
        <div>
          <h3 className="font-semibold text-foreground mb-4">
            Crew Specialization
            <span className="text-red-500 ml-1">*</span>
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {CREW_SPECIALIZATIONS.map((spec) => {
              const Icon = spec.icon
              const isSelected = crewSpecialization === spec.value

              return (
                <button
                  key={spec.value}
                  type="button"
                  onClick={() => {
                    onCrewSpecChange(spec.value)
                    if (errors.crew) {
                      setErrors((prev) => ({ ...prev, crew: '' }))
                    }
                  }}
                  className={`p-4 border rounded-lg text-center transition-all hover:shadow-md ${
                    isSelected
                      ? 'border-primary bg-primary/10 ring-2 ring-primary/20'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="mb-2">
                    <Icon className={`h-8 w-8 mx-auto ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
                  </div>
                  <span className="text-sm font-medium text-foreground">{spec.label}</span>
                </button>
              )
            })}
          </div>
          {errors.crew && (
            <p className="mt-2 text-sm text-destructive">{errors.crew}</p>
          )}
        </div>
      )}

      {/* Business Specialization */}
      {needsBusinessSpec && (
        <div>
          <h3 className="font-semibold text-foreground mb-4">
            Business Specialization
            <span className="text-red-500 ml-1">*</span>
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {BUSINESS_SPECIALIZATIONS.map((spec) => {
              const Icon = spec.icon
              const isSelected = businessSpecialization === spec.value

              return (
                <button
                  key={spec.value}
                  type="button"
                  onClick={() => {
                    onBusinessSpecChange(spec.value)
                    if (errors.business) {
                      setErrors((prev) => ({ ...prev, business: '' }))
                    }
                  }}
                  className={`p-5 border rounded-lg text-center transition-all hover:shadow-md ${
                    isSelected
                      ? 'border-primary bg-primary/10 ring-2 ring-primary/20'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="mb-2">
                    <Icon className={`h-8 w-8 mx-auto ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
                  </div>
                  <span className="font-medium text-foreground">{spec.label}</span>
                </button>
              )
            })}
          </div>
          {errors.business && (
            <p className="mt-2 text-sm text-destructive">{errors.business}</p>
          )}
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={onPrevious}
          disabled={isSaving}
          className="px-6 py-3 border border-border hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-medium transition-colors inline-flex items-center gap-2"
        >
          <ArrowLeft className="h-5 w-5" />
          Back
        </button>
        <button
          onClick={handleSubmit}
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
