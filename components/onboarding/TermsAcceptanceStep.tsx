import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ArrowLeft, CheckCircle, Briefcase, Users, Clock } from 'lucide-react'
import { useOnboarding } from '@/lib/hooks/useOnboarding'

interface TermsAcceptanceStepProps {
  onPrevious: () => void
}

export default function TermsAcceptanceStep({
  onPrevious,
}: TermsAcceptanceStepProps) {
  const { t } = useTranslation()
  const { acceptTerms, isAcceptingTerms: isSaving } = useOnboarding()
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  const handleSubmit = async () => {
    if (!termsAccepted) {
      setErrors({ terms: 'You must accept the terms and guidelines to continue' })
      return
    }

    try {
      await acceptTerms()
      console.log('✅ Terms accepted - Onboarding complete!')
      
      // Redirect handled by hook
    } catch (error: any) {
      console.error('❌ Failed to accept terms:', error)
      alert(error.response?.data?.error || 'Failed to complete onboarding')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-foreground mb-2">
          {t('onboarding.terms.title')}
        </h2>
        <p className="text-muted-foreground">
          {t('onboarding.terms.subtitle')}
        </p>
      </div>

      {/* Guidelines Sections */}
      <div className="space-y-6">
        {/* Verification Process */}
        <div className="p-6 border border-border rounded-lg">
          <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-primary" />
            {t('onboarding.terms.sections.verification')}
          </h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Profile verification completed within 24 hours</li>
            <li>• Chapter membership confirmed by local administrators</li>
            <li>• Professional credentials reviewed for accuracy</li>
            <li>• Verified members receive priority visibility</li>
          </ul>
        </div>

        {/* Job Posting Guidelines */}
        <div className="p-6 border border-border rounded-lg">
          <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-primary" />
            {t('onboarding.terms.sections.jobs')}
          </h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Opportunity postings reviewed within 48-72 hours</li>
            <li>• All opportunities must be legitimate and paid (unless clearly marked as volunteer)</li>
            <li>• Clear descriptions and requirements required</li>
            <li>• Equal opportunity and fair compensation promoted</li>
          </ul>
        </div>

        {/* Community Standards */}
        <div className="p-6 border border-border rounded-lg">
          <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            {t('onboarding.terms.sections.community')}
          </h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Respectful and professional communication</li>
            <li>• No harassment, discrimination, or inappropriate content</li>
            <li>• Accurate representation of skills and experience</li>
            <li>• Support and mentorship encouraged</li>
            <li>• Collaboration and networking promoted</li>
          </ul>
        </div>

        {/* Membership Timeline */}
        <div className="p-6 border border-border rounded-lg">
          <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            {t('onboarding.terms.sections.timeline')}
          </h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Your chapter administrator will review your application</li>
            <li>• Verification typically takes 24-48 hours</li>
            <li>• You'll receive an email notification when approved</li>
            <li>• Full platform access will be automatically enabled</li>
            <li>• You can start building your profile in the meantime</li>
          </ul>
        </div>

        {/* Terms Acceptance */}
        <div className="p-6 border border-primary/20 rounded-lg bg-primary/5">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={termsAccepted}
              onChange={(e) => {
                setTermsAccepted(e.target.checked)
                if (errors.terms) {
                  setErrors({})
                }
              }}
              className="mt-1 h-4 w-4 text-primary focus:ring-ring border-border rounded cursor-pointer"
            />
            <span className="text-sm text-foreground">
              {t('onboarding.terms.checkbox_label')}
            </span>
          </label>
          {errors.terms && (
            <p className="mt-2 text-sm text-destructive">{errors.terms}</p>
          )}
        </div>

        {/* Final Note */}
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-800">
            {t('onboarding.terms.final_note')}
          </p>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={onPrevious}
          disabled={isSaving}
          className="px-6 py-3 border border-border hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-medium transition-colors inline-flex items-center gap-2"
        >
          <ArrowLeft className="h-5 w-5" />
          {t('onboarding.common.back')}
        </button>
        <button
          onClick={handleSubmit}
          disabled={isSaving || !termsAccepted}
          className="px-6 py-3 bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-medium transition-colors inline-flex items-center gap-2"
        >
          {isSaving ? t('onboarding.terms.completing_btn') : t('onboarding.terms.complete_btn')}
          {!isSaving && <CheckCircle className="h-5 w-5" />}
        </button>
      </div>
    </div>
  )
}
