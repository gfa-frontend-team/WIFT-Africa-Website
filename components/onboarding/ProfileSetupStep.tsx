import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ArrowLeft, ArrowRight, Link as LinkIcon, Film, Globe, MapPin, Upload } from 'lucide-react'
import { useOnboarding } from '@/lib/hooks/useOnboarding'

interface ProfileSetupStepProps {
  onNext: (nextStep: number) => void
  onPrevious: () => void
}

export default function ProfileSetupStep({
  onNext,
  onPrevious,
}: ProfileSetupStepProps) {
  const { t } = useTranslation()
  const { submitProfile, isSubmittingProfile: isSaving } = useOnboarding()
  const [headline, setHeadline] = useState('')
  const [bio, setBio] = useState('')
  const [location, setLocation] = useState('')
  const [website, setWebsite] = useState('')
  const [imdbUrl, setImdbUrl] = useState('')
  const [linkedinUrl, setLinkedinUrl] = useState('')
  const [instagramHandle, setInstagramHandle] = useState('')
  const [twitterHandle, setTwitterHandle] = useState('')
  const [availabilityStatus, setAvailabilityStatus] = useState<'AVAILABLE' | 'BUSY' | 'NOT_LOOKING'>('AVAILABLE')
  const [cvFile, setCvFile] = useState<File | null>(null)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  const validateAndSubmit = () => {
    const newErrors: { [key: string]: string } = {}

    // Required fields validation
    if (!headline.trim()) {
      newErrors.headline = t('onboarding.profile.errors.headline_required')
    } else if (headline.length > 255) {
      newErrors.headline = 'Headline must be 255 characters or less'
    }

    if (!location.trim()) {
      newErrors.location = t('onboarding.profile.errors.location_required')
    }

    // Bio validation (optional but has max length)
    if (bio && bio.length > 1000) {
      newErrors.bio = 'Bio must be 1000 characters or less'
    }

    // Professional Links Validation (At least one required)
    const hasProfessionalLink = [
      linkedinUrl,
      imdbUrl,
      website,
      instagramHandle,
      twitterHandle
    ].some(link => link.trim() !== '')

    if (!hasProfessionalLink) {
      newErrors.professionalLinks = t('onboarding.profile.errors.links_required')
    }

    // URL validation
    const urlPattern = /^https?:\/\/.+/
    if (website && !urlPattern.test(website)) {
      newErrors.website = t('onboarding.profile.errors.invalid_url')
    }
    if (imdbUrl && !urlPattern.test(imdbUrl)) {
      newErrors.imdbUrl = t('onboarding.profile.errors.invalid_url')
    }
    if (linkedinUrl && !urlPattern.test(linkedinUrl)) {
      newErrors.linkedinUrl = t('onboarding.profile.errors.invalid_url')
    }

    // CV file validation (optional)
    if (cvFile) {
      const maxSize = 10 * 1024 * 1024 // 10MB
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
      
      if (cvFile.size > maxSize) {
        newErrors.cv = 'CV file must be less than 10MB'
      }
      
      if (!allowedTypes.includes(cvFile.type)) {
        newErrors.cv = 'CV must be a PDF, DOC, or DOCX file'
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      // Scroll to top to show errors if needed
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return false
    }

    return true
  }

  const handleSubmit = async () => {
    if (!validateAndSubmit()) {
      return
    }

    try {
      let response;

      // Use FormData if CV file is present, otherwise use JSON
      if (cvFile) {
        const formData = new FormData()
        
        // Add text fields
        formData.append('availabilityStatus', availabilityStatus)
        if (headline.trim()) formData.append('headline', headline.trim())
        if (bio.trim()) formData.append('bio', bio.trim())
        if (location.trim()) formData.append('location', location.trim())
        if (website.trim()) formData.append('website', website.trim())
        if (imdbUrl.trim()) formData.append('imdbUrl', imdbUrl.trim())
        if (linkedinUrl.trim()) formData.append('linkedinUrl', linkedinUrl.trim())
        if (instagramHandle.trim()) formData.append('instagramHandle', instagramHandle.trim())
        if (twitterHandle.trim()) formData.append('twitterHandle', twitterHandle.trim())
        
        // Add CV file
        formData.append('cv', cvFile)

        response = await submitProfile(formData)
      } else {
        // No CV file, use regular JSON
        const data: any = {
          availabilityStatus,
          headline: headline.trim(), // Required
          location: location.trim(), // Required
        }

        if (bio.trim()) data.bio = bio.trim()
        if (website.trim()) data.website = website.trim()
        if (imdbUrl.trim()) data.imdbUrl = imdbUrl.trim()
        if (linkedinUrl.trim()) data.linkedinUrl = linkedinUrl.trim()
        if (instagramHandle.trim()) data.instagramHandle = instagramHandle.trim()
        if (twitterHandle.trim()) data.twitterHandle = twitterHandle.trim()

        response = await submitProfile(data)
      }

      console.log('✅ Profile setup saved successfully')
      
      if (response && response.nextStep) {
         onNext(response.nextStep)
      } else {
         onNext(5)
      }
    } catch (error: any) {
      console.error('❌ Failed to save profile setup:', error)
      alert(error.response?.data?.error || 'Failed to save profile setup')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-foreground mb-2">
          {t('onboarding.profile.title')}
        </h2>
        <p className="text-muted-foreground">
          {t('onboarding.profile.subtitle')}
        </p>
      </div>

      {/* Global Error Message */}
      {errors.professionalLinks && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center text-red-800">
            <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span className="text-sm font-medium">{errors.professionalLinks}</span>
          </div>
        </div>
      )}

      {/* Professional Info */}
      <div className="space-y-4">
        <h3 className="font-semibold text-foreground">{t('onboarding.profile.professional_info_title')}</h3>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            {t('onboarding.profile.headline_label')} <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={headline}
            onChange={(e) => {
              setHeadline(e.target.value)
              if (errors.headline) {
                setErrors((prev) => ({ ...prev, headline: '' }))
              }
            }}
            maxLength={255}
            className={`w-full p-3 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring ${
              errors.headline ? 'border-destructive' : 'border-border'
            }`}
            placeholder={t('onboarding.profile.headline_placeholder') as string}
          />
          <div className="flex justify-between mt-1">
            <p className="text-xs text-muted-foreground">
              {t('onboarding.profile.headline_hint')}
            </p>
            <p className="text-xs text-muted-foreground">
              {headline.length}/255
            </p>
          </div>
          {errors.headline && (
            <p className="mt-1 text-sm text-destructive">{errors.headline}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            {t('onboarding.profile.bio_label')}
          </label>
          <textarea
            value={bio}
            onChange={(e) => {
              setBio(e.target.value)
              if (errors.bio) {
                setErrors((prev) => ({ ...prev, bio: '' }))
              }
            }}
            maxLength={1000}
            rows={5}
            className="w-full p-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring resize-none"
            placeholder={t('onboarding.profile.bio_placeholder') as string}
          />
          <div className="flex justify-between mt-1">
            <p className="text-xs text-muted-foreground">
              {t('onboarding.profile.bio_hint')}
            </p>
            <p className="text-xs text-muted-foreground">
              {bio.length}/1000
            </p>
          </div>
          {errors.bio && (
            <p className="mt-1 text-sm text-destructive">{errors.bio}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            {t('onboarding.profile.location_label')} <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              value={location}
              onChange={(e) => {
                  setLocation(e.target.value)
                  if (errors.location) {
                    setErrors((prev) => ({ ...prev, location: '' }))
                  }
              }}
              className={`w-full pl-10 pr-4 py-3 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring ${
                errors.location ? 'border-destructive' : 'border-border'
              }`}
              placeholder={t('onboarding.profile.location_placeholder') as string}
            />
          </div>
          {errors.location && (
            <p className="mt-1 text-sm text-destructive">{errors.location}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            {t('onboarding.profile.availability_label')}
          </label>
          <select
            value={availabilityStatus}
            onChange={(e) => setAvailabilityStatus(e.target.value as any)}
            className="w-full p-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="AVAILABLE">{t('onboarding.profile.availability_options.available')}</option>
            <option value="BUSY">{t('onboarding.profile.availability_options.busy')}</option>
            <option value="NOT_LOOKING">{t('onboarding.profile.availability_options.not_looking')}</option>
          </select>
        </div>
      </div>

      {/* Professional Links */}
      <div className="space-y-4">
        <h3 className="font-semibold text-foreground">
            {t('onboarding.profile.social_title')} <span className="text-red-500">*</span>
        </h3>
        <p className="text-sm text-muted-foreground">
          {t('onboarding.profile.social_subtitle')}
        </p>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            {t('onboarding.profile.linkedin_label')}
          </label>
          <div className="relative">
            <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="url"
              value={linkedinUrl}
              onChange={(e) => {
                setLinkedinUrl(e.target.value)
                if (errors.linkedinUrl) {
                  setErrors((prev) => ({ ...prev, linkedinUrl: '' }))
                }
              }}
              className="w-full pl-10 pr-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="https://linkedin.com/in/yourprofile"
            />
          </div>
          {errors.linkedinUrl && (
            <p className="mt-1 text-sm text-destructive">{errors.linkedinUrl}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            {t('onboarding.profile.imdb_label')}
          </label>
          <div className="relative">
            <Film className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="url"
              value={imdbUrl}
              onChange={(e) => {
                setImdbUrl(e.target.value)
                if (errors.imdbUrl) {
                  setErrors((prev) => ({ ...prev, imdbUrl: '' }))
                }
              }}
              className="w-full pl-10 pr-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="https://imdb.com/name/yourprofile"
            />
          </div>
          {errors.imdbUrl && (
            <p className="mt-1 text-sm text-destructive">{errors.imdbUrl}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            {t('onboarding.profile.website_label')}
          </label>
          <div className="relative">
            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="url"
              value={website}
              onChange={(e) => {
                setWebsite(e.target.value)
                if (errors.website) {
                  setErrors((prev) => ({ ...prev, website: '' }))
                }
              }}
              className="w-full pl-10 pr-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="https://yourwebsite.com"
            />
          </div>
          {errors.website && (
            <p className="mt-1 text-sm text-destructive">{errors.website}</p>
          )}
        </div>
      </div>

      {/* Social Media */}
      <div className="space-y-4">
        <h3 className="font-semibold text-foreground">{t('onboarding.profile.social_media_title')}</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              {t('onboarding.profile.instagram_label')}
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">@</span>
              <input
                type="text"
                value={instagramHandle}
                onChange={(e) => setInstagramHandle(e.target.value)}
                className="w-full pl-8 pr-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="username"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              {t('onboarding.profile.twitter_label')}
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">@</span>
              <input
                type="text"
                value={twitterHandle}
                onChange={(e) => setTwitterHandle(e.target.value)}
                className="w-full pl-8 pr-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="username"
              />
            </div>
          </div>
        </div>
      </div>

      {/* CV Upload */}
      <div className="space-y-4">
        <h3 className="font-semibold text-foreground">{t('onboarding.profile.cv_title')}</h3>
        <p className="text-sm text-muted-foreground">
          {t('onboarding.profile.cv_subtitle')}
        </p>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            {t('onboarding.profile.cv_label')}
          </label>
          <div className="relative">
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) => {
                const file = e.target.files?.[0] || null
                setCvFile(file)
                if (errors.cv) {
                  setErrors((prev) => ({ ...prev, cv: '' }))
                }
              }}
              className="w-full p-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 cursor-pointer"
            />
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {t('onboarding.profile.cv_hint')}
          </p>
          {cvFile && (
            <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-2">
                <svg className="h-5 w-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm text-green-800 font-medium">{cvFile.name}</span>
                <span className="text-xs text-green-600">({(cvFile.size / 1024 / 1024).toFixed(2)} MB)</span>
              </div>
              <button
                type="button"
                onClick={() => setCvFile(null)}
                className="text-green-600 hover:text-green-800"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          )}
          {errors.cv && (
            <p className="mt-1 text-sm text-destructive">{errors.cv}</p>
          )}
        </div>
      </div>

      {/* Info Note */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800">
          {t('onboarding.profile.note_update')}
        </p>
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
    </div>
  )
}
