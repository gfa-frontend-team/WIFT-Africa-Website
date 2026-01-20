import { useState, useEffect } from 'react'
import { ArrowLeft, ArrowRight, Tv, Clapperboard, Sparkles, Video, Scissors, Music2, Volume2, Palette, Shirt, Paintbrush, Lightbulb, Scale, Radio, DollarSign, Megaphone, Handshake, Newspaper } from 'lucide-react'
import { useOnboarding } from '@/lib/hooks/useOnboarding'

interface SpecializationsStepProps {
  roles: string[]
  writerSpecialization: string
  crewSpecializations: string[]
  businessSpecializations: string[]
  onWriterSpecChange: (spec: string) => void
  onCrewSpecsChange: (specs: string[]) => void
  onBusinessSpecsChange: (specs: string[]) => void
  onNext: (nextStep: number) => void
  onPrevious: () => void
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
  crewSpecializations,
  businessSpecializations,
  onWriterSpecChange,
  onCrewSpecsChange,
  onBusinessSpecsChange,
  onNext,
  onPrevious,
}: SpecializationsStepProps) {
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const { submitSpecializations, isSubmittingSpecializations: isSaving, prefetchChapters } = useOnboarding()

  // Prefetch chapters for the next step
  useEffect(() => {
    prefetchChapters()
  }, [prefetchChapters])

  // Check if specializations are needed
  const needsWriterSpec = roles.includes('WRITER')
  const needsCrewSpec = roles.includes('CREW')
  const needsBusinessSpec = roles.includes('BUSINESS')

  // If no specializations needed, skip to next step automatically
  useEffect(() => {
    if (!needsWriterSpec && !needsCrewSpec && !needsBusinessSpec) {
      // Just call onNext directly if no specs needed, but maybe we should ensure consistency?
      // The original code called handleSubmit -> API. 
      // If we skip API call here, we might miss tracking. 
      // BE likely expects this step if it returns true for needsSpecialization?
      // Actually if !needsSpec, we technically shouldn't be here or we just pass through.
      // Let's call submit with empty data to be safe if that's what the original did.
      handleSubmit()
    }
  }, [needsWriterSpec, needsCrewSpec, needsBusinessSpec])

  const validateAndSubmit = () => {
    const newErrors: { [key: string]: string } = {}

    if (needsWriterSpec && !writerSpecialization) {
      newErrors.writer = 'Please select your writer specialization'
    }

    if (needsCrewSpec && crewSpecializations.length === 0) {
      newErrors.crew = 'Please select at least one crew specialization'
    }

    if (needsBusinessSpec && businessSpecializations.length === 0) {
      newErrors.business = 'Please select at least one business specialization'
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

    try {
      const data: any = {}
      
      if (needsWriterSpec && writerSpecialization) {
        data.writerSpecialization = writerSpecialization
      }
      
      if (needsCrewSpec && crewSpecializations.length > 0) {
        data.crewSpecializations = crewSpecializations
      }
      
      if (needsBusinessSpec && businessSpecializations.length > 0) {
        data.businessSpecializations = businessSpecializations
      }

      const response = await submitSpecializations(data)
// The hook 'submitSpecializations' returns the response directly in this codebase (unlike standard react-query which might return data), 
// but let's double check. `submitSpecializationsMutation.mutateAsync` returns data.
// In `useOnboarding.ts`: `mutationFn: (data) => onboardingApi.submitSpecializations(data)`.
// `onboardingApi` returns response.
// So yes, we get response.

      console.log('✅ Specializations saved successfully')
      
      if (response && response.nextStep) {
        onNext(response.nextStep)
      } else {
        onNext(3) // Fallback
      }
    } catch (error: any) {
      console.error('❌ Failed to save specializations:', error)
      alert(error.response?.data?.error || 'Failed to save specializations')
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

      {/* Crew Specializations (Multi-Select) */}
      {needsCrewSpec && (
        <div>
          <h3 className="font-semibold text-foreground mb-4">
            Crew Specializations
            <span className="text-red-500 ml-1">*</span>
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Select all that apply - you can choose multiple specializations
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {CREW_SPECIALIZATIONS.map((spec) => {
              const Icon = spec.icon
              const isSelected = crewSpecializations.includes(spec.value)

              return (
                <button
                  key={spec.value}
                  type="button"
                  onClick={() => {
                    const newSpecs = isSelected
                      ? crewSpecializations.filter(s => s !== spec.value)
                      : [...crewSpecializations, spec.value]
                    onCrewSpecsChange(newSpecs)
                    if (errors.crew) {
                      setErrors((prev) => ({ ...prev, crew: '' }))
                    }
                  }}
                  className={`p-4 border rounded-lg text-center transition-all hover:shadow-md relative ${
                    isSelected
                      ? 'border-primary bg-primary/10 ring-2 ring-primary/20'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  {isSelected && (
                    <div className="absolute top-2 right-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                  <div className="mb-2">
                    <Icon className={`h-8 w-8 mx-auto ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
                  </div>
                  <span className="text-sm font-medium text-foreground">{spec.label}</span>
                </button>
              )
            })}
          </div>
          {crewSpecializations.length > 0 && (
            <p className="mt-2 text-sm text-primary">
              {crewSpecializations.length} specialization{crewSpecializations.length > 1 ? 's' : ''} selected
            </p>
          )}
          {errors.crew && (
            <p className="mt-2 text-sm text-destructive">{errors.crew}</p>
          )}
        </div>
      )}

      {/* Business Specializations (Multi-Select) */}
      {needsBusinessSpec && (
        <div>
          <h3 className="font-semibold text-foreground mb-4">
            Business Specializations
            <span className="text-red-500 ml-1">*</span>
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Select all that apply - you can choose multiple specializations
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {BUSINESS_SPECIALIZATIONS.map((spec) => {
              const Icon = spec.icon
              const isSelected = businessSpecializations.includes(spec.value)

              return (
                <button
                  key={spec.value}
                  type="button"
                  onClick={() => {
                    const newSpecs = isSelected
                      ? businessSpecializations.filter(s => s !== spec.value)
                      : [...businessSpecializations, spec.value]
                    onBusinessSpecsChange(newSpecs)
                    if (errors.business) {
                      setErrors((prev) => ({ ...prev, business: '' }))
                    }
                  }}
                  className={`p-5 border rounded-lg text-center transition-all hover:shadow-md relative ${
                    isSelected
                      ? 'border-primary bg-primary/10 ring-2 ring-primary/20'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  {isSelected && (
                    <div className="absolute top-2 right-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                  <div className="mb-2">
                    <Icon className={`h-8 w-8 mx-auto ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
                  </div>
                  <span className="font-medium text-foreground">{spec.label}</span>
                </button>
              )
            })}
          </div>
          {businessSpecializations.length > 0 && (
            <p className="mt-2 text-sm text-primary">
              {businessSpecializations.length} specialization{businessSpecializations.length > 1 ? 's' : ''} selected
            </p>
          )}
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
