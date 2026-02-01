'use client';

import { useTranslation } from 'react-i18next';
import Link from 'next/link'
import { CheckCircle } from 'lucide-react'

interface OnboardingLayoutProps {
  currentStep: number
  totalSteps: number
  children: React.ReactNode
}

export default function OnboardingLayout({
  currentStep,
  totalSteps,
  children,
}: OnboardingLayoutProps) {
  const { t } = useTranslation()
  const progress = (currentStep / totalSteps) * 100

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="inline-block">
              <img src="/WIFTAFRICA.png" alt="WIFT Africa" className="h-5 w-auto" />
            </Link>
            <div className="text-sm text-muted-foreground">
              {t('onboarding.common.step_count', { current: currentStep, total: totalSteps })}
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
              <div key={step} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${step < currentStep
                        ? 'bg-primary text-primary-foreground'
                        : step === currentStep
                          ? 'bg-primary text-primary-foreground ring-4 ring-primary/20'
                          : 'bg-muted text-muted-foreground'
                      }`}
                  >
                    {step < currentStep ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      step
                    )}
                  </div>
                  <div className="mt-2 text-xs text-center hidden sm:block">
                    {step === 1 && t('onboarding.steps.roles')}
                    {step === 2 && t('onboarding.steps.specialization')}
                    {step === 3 && t('onboarding.steps.chapter')}
                    {step === 4 && t('onboarding.steps.profile')}
                    {step === 5 && t('onboarding.steps.terms')}
                  </div>
                </div>
                {step < totalSteps && (
                  <div
                    className={`h-0.5 flex-1 transition-colors ${step < currentStep ? 'bg-primary' : 'bg-border'
                      }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">{children}</div>
      </div>
    </div>
  )
}
