import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { ArrowLeft, ArrowRight, MapPin, Users, Crown, AlertCircle, Loader2, CheckCircle } from 'lucide-react'
import ChapterCard from '@/components/shared/ChapterCard'
import { Chapter } from '@/lib/api/onboarding'
import { useOnboarding } from '@/lib/hooks/useOnboarding'
import { getCountryFlagUrl } from '@/lib/utils/countryMapping'

interface ChapterSelectionStepProps {
  onNext: (nextStep: number) => void
  onPrevious: () => void
}

export default function ChapterSelectionStep({
  onNext,
  onPrevious,
}: ChapterSelectionStepProps) {
  const { t } = useTranslation()
  const { chapters: dataChapters, isLoadingChapters, submitChapter, isSubmittingChapter: isSaving } = useOnboarding()
  const [chapters, setChapters] = useState<Chapter[]>([])

  // Sort chapters when data loads
  useEffect(() => {
    if (dataChapters) {
      const sorted = [...dataChapters].sort((a, b) => {
        if (a.code === 'HQ') return 1
        if (b.code === 'HQ') return -1
        return a.country.localeCompare(b.country)
      })
      setChapters(sorted)
    }
  }, [dataChapters])

  const [selectedChapter, setSelectedChapter] = useState<string>('')
  const [memberType, setMemberType] = useState<'NEW' | 'EXISTING' | null>(null)

  const [phoneNumber, setPhoneNumber] = useState('')
  const [additionalInfo, setAdditionalInfo] = useState('')
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [showWelcomeModal, setShowWelcomeModal] = useState(false)

  const getCountryFlag = (countryCode: string, countryName: string) => {
    const flagUrl = getCountryFlagUrl(countryCode, countryName)
    if (flagUrl === 'AFRICA') return '🌍'
    return flagUrl
  }

  const validateAndSubmit = () => {
    const newErrors: { [key: string]: string } = {}

    if (!memberType) {
      newErrors.memberType = 'Please indicate if you are an active member of a chapter'
    }

    if (!selectedChapter) {
      newErrors.chapter = 'Please select a chapter'
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
      const data: any = {
        chapterId: selectedChapter,
        memberType: memberType!,
      }



      if (phoneNumber.trim()) {
        data.phoneNumber = phoneNumber.trim()
      }

      if (additionalInfo.trim()) {
        data.additionalInfo = additionalInfo.trim()
      }

      const response = await submitChapter(data)

      console.log('✅ Chapter selection saved successfully')
      if (response && response.nextStep) {
        onNext(response.nextStep)
      } else {
        onNext(4)
      }
    } catch (error: any) {
      console.error('❌ Failed to save chapter selection:', error)
      alert(error.response?.data?.error || 'Failed to save chapter selection')
    }
  }

  if (isLoadingChapters && chapters.length === 0) {
    // Show loading if we don't have chapters yet and logic is loading
    // But if we have chapters (e.g. from cache), we can show them
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">{t('onboarding.common.loading')}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-foreground mb-2">
          {t('onboarding.chapter.title')}
        </h2>
        <p className="text-muted-foreground max-w-3xl mx-auto">
          {t('onboarding.chapter.subtitle')}
        </p>
      </div>

      {/* Member Status Prompt */}
      <div className="p-6 border border-border rounded-lg bg-card">
        <h3 className="font-semibold text-foreground mb-4 text-center">
          {t('onboarding.chapter.member_status_title')}
          <span className="text-red-500 ml-1">*</span>
        </h3>
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <button
            type="button"
            onClick={() => {
              setMemberType('EXISTING')
              if (errors.memberType) {
                setErrors((prev) => ({ ...prev, memberType: '' }))
              }
            }}
            className={`px-6 py-3 rounded-lg font-medium transition-all text-center ${memberType === 'EXISTING'
              ? 'bg-primary text-primary-foreground'
              : 'border border-border hover:bg-accent'
              }`}
          >
            <div className="font-semibold">{t('onboarding.chapter.btn_existing')}</div>
          </button>
          <button
            type="button"
            onClick={() => {
              setMemberType('NEW')
              setShowWelcomeModal(true)
              if (errors.memberType) {
                setErrors((prev) => ({ ...prev, memberType: '' }))
              }
            }}
            className={`px-6 py-3 rounded-lg font-medium transition-all text-center ${memberType === 'NEW'
              ? 'bg-primary text-primary-foreground'
              : 'border border-border hover:bg-accent'
              }`}
          >
            <div className="font-semibold">{t('onboarding.chapter.btn_new')}</div>
          </button>
        </div>

        {errors.memberType && (
          <p className="mt-2 text-sm text-destructive text-center">{errors.memberType}</p>
        )}

        {memberType === 'EXISTING' && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              {t('onboarding.chapter.note_existing')}
            </p>
          </div>
        )}

        {memberType === 'NEW' && (
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              {t('onboarding.chapter.note_new')}
            </p>
            <p className="text-sm text-yellow-800 mt-2">
              {t('onboarding.chapter.note_new_warning')}
            </p>
          </div>
        )}
      </div>

      {/* Chapter Selection Intro */}
      <div className="p-6 bg-muted/30 border border-border rounded-lg space-y-3">
        <p className="text-sm text-muted-foreground">
          {t('onboarding.chapter.intro_text')}
        </p>
        <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
          <p className="text-sm font-medium text-foreground">
            <strong>{t('onboarding.chapter.no_chapter_title')}</strong>
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            {t('onboarding.chapter.no_chapter_msg')}
          </p>
        </div>
      </div>

      {/* Chapter Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {chapters.map((chapter) => {
          const isSelected = selectedChapter === chapter.id

          return (
            <ChapterCard
              key={chapter.id}
              id={chapter.id}
              name={chapter.name}
              code={chapter.code}
              country={chapter.country}
              city={chapter.city}
              description={chapter.description}
              memberCount={chapter.fixedMemberCount || 0}
              president={chapter.presidentName} // Mapped from provided structure in prompts (though prompt said presidentName, checking existing usage)
              // The user prompt said: "presidentName" for Onboarding vs "currentPresident" for General.
              // However, the interface in `lib/api/onboarding.ts` (implied) or usage in `ChapterSelectionStep` line 298 shows `chapter.currentPresident`.
              // I will stick to `chapter.currentPresident` as it exists in the current file I viewed.
              admin={chapter.adminName}
              isSelected={isSelected}
              onClick={() => {
                if (memberType) {
                  setSelectedChapter(chapter.id)
                  if (errors.chapter) {
                    setErrors((prev) => ({ ...prev, chapter: '' }))
                  }
                }
              }}
              actionLabel={memberType ? (isSelected ? 'Selected' : 'Select Chapter') : 'Select Member Type First'}
            />
          )
        })}
      </div>

      {errors.chapter && (
        <p className="text-sm text-destructive">{errors.chapter}</p>
      )}

      {/* Membership ID for Existing Members */}
      {memberType === 'EXISTING' && selectedChapter && (
        <div className="p-6 border border-border rounded-lg bg-card space-y-4">


          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              {t('onboarding.chapter.phone_label')}
            </label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full p-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder={t('onboarding.chapter.phone_placeholder') as string}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              {t('onboarding.chapter.additional_info_label')}
            </label>
            <textarea
              value={additionalInfo}
              onChange={(e) => setAdditionalInfo(e.target.value)}
              rows={3}
              className="w-full p-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring resize-none"
              placeholder={t('onboarding.chapter.additional_info_placeholder') as string}
            />
          </div>
        </div>
      )}

      {/* Important Information */}
      <div className="p-6 bg-muted/50 border border-border rounded-lg space-y-4">
        <h3 className="font-semibold text-foreground flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-primary" />
          {t('onboarding.chapter.important_info_title')}
        </h3>

        <div className="space-y-4 text-sm">
          <div>
            <h4 className="font-medium text-foreground mb-2">{t('onboarding.chapter.verification_title')}</h4>
            <p className="text-muted-foreground">
              {t('onboarding.chapter.verification_text')}
            </p>
          </div>

          <div>
            <h4 className="font-medium text-foreground mb-2">{t('onboarding.chapter.hq_title')}</h4>
            <p className="text-muted-foreground">
              {t('onboarding.chapter.hq_text')}
            </p>
          </div>
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
          disabled={isSaving}
          className="px-6 py-3 bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-medium transition-colors inline-flex items-center gap-2"
        >
          {isSaving ? t('onboarding.common.saving') : t('onboarding.common.continue')}
          {!isSaving && <ArrowRight className="h-5 w-5" />}
        </button>
      </div>

      {/* Welcome Modal */}
      {showWelcomeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-2xl max-w-lg w-full shadow-2xl">
            <div className="p-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  {t('onboarding.chapter.welcome_modal.title')}
                </h2>
                <p className="text-muted-foreground">
                  {t('onboarding.chapter.welcome_modal.subtitle')}
                </p>
              </div>

              <div className="space-y-4 mb-6 text-sm text-muted-foreground">
                <p>
                  {t('onboarding.chapter.welcome_modal.p1')}
                </p>
                <p>
                  {t('onboarding.chapter.welcome_modal.p2')}
                </p>
                <p className="text-foreground font-medium">
                  {t('onboarding.chapter.welcome_modal.p3')}
                </p>
              </div>

              <div className="flex justify-center">
                <button
                  onClick={() => setShowWelcomeModal(false)}
                  className="px-8 py-3 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg font-medium transition-colors"
                >
                  {t('onboarding.chapter.welcome_modal.btn')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
