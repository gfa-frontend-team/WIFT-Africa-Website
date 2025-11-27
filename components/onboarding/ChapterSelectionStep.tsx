'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, ArrowRight, MapPin, Users, Crown, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import { onboardingApi, Chapter } from '@/lib/api/onboarding'

interface ChapterSelectionStepProps {
  onNext: () => void
  onPrevious: () => void
  isSaving: boolean
  setIsSaving: (saving: boolean) => void
}

export default function ChapterSelectionStep({
  onNext,
  onPrevious,
  isSaving,
  setIsSaving,
}: ChapterSelectionStepProps) {
  const [chapters, setChapters] = useState<Chapter[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedChapter, setSelectedChapter] = useState<string>('')
  const [memberType, setMemberType] = useState<'NEW' | 'EXISTING' | null>(null)
  const [membershipId, setMembershipId] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [additionalInfo, setAdditionalInfo] = useState('')
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [showWelcomeModal, setShowWelcomeModal] = useState(false)

  useEffect(() => {
    loadChapters()
  }, [])

  const loadChapters = async () => {
    try {
      const response = await onboardingApi.getChapters()
      // Sort chapters alphabetically by country, with HQ at the end
      const sorted = response.chapters.sort((a, b) => {
        if (a.code === 'HQ') return 1
        if (b.code === 'HQ') return -1
        return a.country.localeCompare(b.country)
      })
      setChapters(sorted)
    } catch (error) {
      console.error('Failed to load chapters:', error)
      alert('Failed to load chapters. Please refresh the page.')
    } finally {
      setIsLoading(false)
    }
  }

  const getCountryFlag = (countryCode: string) => {
    if (countryCode === 'HQ' || countryCode === 'AFRICA') {
      return '🌍'
    }
    // Convert country name to ISO code for flag API
    const countryToCode: { [key: string]: string } = {
      'Egypt': 'EG',
      'Ghana': 'GH',
      'Kenya': 'KE',
      'Morocco': 'MA',
      'Nigeria': 'NG',
      'Senegal': 'SN',
      'South Africa': 'ZA',
      'Tanzania': 'TZ',
      'Uganda': 'UG',
      'Zimbabwe': 'ZW',
    }
    const code = countryToCode[countryCode] || 'ZZ'
    return `https://flagsapi.com/${code}/flat/64.png`
  }

  const validateAndSubmit = () => {
    const newErrors: { [key: string]: string } = {}

    if (!memberType) {
      newErrors.memberType = 'Please indicate if you are an active member of a chapter'
    }

    if (!selectedChapter) {
      newErrors.chapter = 'Please select a chapter'
    }

    if (memberType === 'EXISTING' && !membershipId.trim()) {
      newErrors.membershipId = 'Membership ID is required for existing members'
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
      const data: any = {
        chapterId: selectedChapter,
        memberType: memberType!,
      }

      if (memberType === 'EXISTING' && membershipId.trim()) {
        data.membershipId = membershipId.trim()
      }

      if (phoneNumber.trim()) {
        data.phoneNumber = phoneNumber.trim()
      }

      if (additionalInfo.trim()) {
        data.additionalInfo = additionalInfo.trim()
      }

      await onboardingApi.submitChapter(data)

      console.log('✅ Chapter selection saved successfully')
      onNext()
    } catch (error: any) {
      console.error('❌ Failed to save chapter selection:', error)
      alert(error.response?.data?.error || 'Failed to save chapter selection')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading chapters...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-foreground mb-2">
          Choose your WIFT Chapter
        </h2>
        <p className="text-muted-foreground max-w-3xl mx-auto">
          WIFT Africa is a growing network of women shaping the future of film, television, and digital storytelling across the continent. 
          Connect to your local WIFT chapter or join WIFT Africa HQ.
        </p>
      </div>

      {/* Member Status Prompt */}
      <div className="p-6 border border-border rounded-lg bg-card">
        <h3 className="font-semibold text-foreground mb-4 text-center">
          Are you an active member of a chapter?
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
            className={`px-6 py-3 rounded-lg font-medium transition-all text-center ${
              memberType === 'EXISTING'
                ? 'bg-primary text-primary-foreground'
                : 'border border-border hover:bg-accent'
            }`}
          >
            <div className="font-semibold">I'm already a registered member</div>
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
            className={`px-6 py-3 rounded-lg font-medium transition-all text-center ${
              memberType === 'NEW'
                ? 'bg-primary text-primary-foreground'
                : 'border border-border hover:bg-accent'
            }`}
          >
            <div className="font-semibold">I'm new here</div>
          </button>
        </div>
        
        {errors.memberType && (
          <p className="mt-2 text-sm text-destructive text-center">{errors.memberType}</p>
        )}
        
        {memberType === 'EXISTING' && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              I want to sign up and connect with my chapter
            </p>
          </div>
        )}
        
        {memberType === 'NEW' && (
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              I want to create my profile and find a chapter
            </p>
            <p className="text-sm text-yellow-800 mt-2">
              <strong>Note:</strong> Registration is intended for active chapter members. 
              Users without an affiliated chapter may experience a longer verification period.
            </p>
          </div>
        )}
      </div>

      {/* Chapter Selection Intro */}
      <div className="p-6 bg-muted/30 border border-border rounded-lg space-y-3">
        <p className="text-sm text-muted-foreground">
          Choose the chapter closest to where you live or work. If there isn't one yet, you can join our WIFT Africa HQ network while new chapters form.
        </p>
        <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
          <p className="text-sm font-medium text-foreground">
            <strong>No chapter yet?</strong>
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Join WIFT Africa HQ to connect with members across regions.
          </p>
        </div>
      </div>

      {/* Chapter Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {chapters.map((chapter) => {
          const isSelected = selectedChapter === chapter.id
          const isHQ = chapter.code === 'HQ'
          const flagSrc = getCountryFlag(chapter.country)

          return (
            <button
              key={chapter.id}
              type="button"
              onClick={() => {
                if (memberType) {
                  setSelectedChapter(chapter.id)
                  if (errors.chapter) {
                    setErrors((prev) => ({ ...prev, chapter: '' }))
                  }
                }
              }}
              disabled={!memberType}
              className={`p-6 border rounded-lg text-left transition-all ${
                !memberType 
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'hover:shadow-md cursor-pointer'
              } ${
                isSelected
                  ? 'border-primary bg-primary/10 ring-2 ring-primary/20'
                  : 'border-border hover:border-primary/50'
              } ${isHQ ? 'border-orange-200 bg-orange-50/50' : ''}`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 flex-shrink-0">
                    {typeof flagSrc === 'string' && flagSrc.startsWith('http') ? (
                      <img 
                        src={flagSrc}
                        alt={`${chapter.country} flag`}
                        className="w-10 h-10 rounded object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-xl">
                        {flagSrc}
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground text-lg">
                      {chapter.country}
                    </h3>
                    <p className="text-sm text-primary font-medium">
                      {chapter.name}
                    </p>
                  </div>
                  {isHQ && (
                    <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full font-medium">
                      HQ
                    </span>
                  )}
                </div>
                {isSelected && (
                  <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                )}
              </div>

              <div className="space-y-2 text-sm">
                {chapter.city && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4 flex-shrink-0" />
                    <span>{chapter.city}, {chapter.country}</span>
                  </div>
                )}
                
                <div className="flex items-center gap-2 text-foreground font-medium">
                  <Users className="h-4 w-4 flex-shrink-0" />
                  <span>{chapter.memberCount.toLocaleString()} active members</span>
                </div>

                {chapter.description && (
                  <p className="text-xs text-muted-foreground italic mt-2 pt-2 border-t border-border">
                    {chapter.description}
                  </p>
                )}
              </div>
            </button>
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
              Membership ID
              <span className="text-red-500 ml-1">*</span>
            </label>
            <input
              type="text"
              value={membershipId}
              onChange={(e) => {
                setMembershipId(e.target.value)
                if (errors.membershipId) {
                  setErrors((prev) => ({ ...prev, membershipId: '' }))
                }
              }}
              className="w-full p-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Enter your membership ID"
            />
            {errors.membershipId && (
              <p className="mt-1 text-sm text-destructive">{errors.membershipId}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Phone Number (Optional)
            </label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full p-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="+234 XXX XXX XXXX"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Additional Information (Optional)
            </label>
            <textarea
              value={additionalInfo}
              onChange={(e) => setAdditionalInfo(e.target.value)}
              rows={3}
              className="w-full p-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring resize-none"
              placeholder="Any additional information for verification..."
            />
          </div>
        </div>
      )}

      {/* Important Information */}
      <div className="p-6 bg-muted/50 border border-border rounded-lg space-y-4">
        <h3 className="font-semibold text-foreground flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-primary" />
          Important information:
        </h3>
        
        <div className="space-y-4 text-sm">
          <div>
            <h4 className="font-medium text-foreground mb-2">Verification Process:</h4>
            <p className="text-muted-foreground">
              Chapter membership requires verification by local administrators. You'll receive confirmation within 24-48 hours.
            </p>
          </div>

          <div>
            <h4 className="font-medium text-foreground mb-2">WIFT Africa HQ Registration:</h4>
            <p className="text-muted-foreground">
              HQ registration provides access while verification is complete. Consider joining a local chapter for immediate full access.
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
                  Welcome to WIFT Africa!
                </h2>
                <p className="text-muted-foreground">
                  We're excited to have you join our growing community.
                </p>
              </div>

              <div className="space-y-4 mb-6 text-sm text-muted-foreground">
                <p>
                  As a new member, you will be onboarded through a process managed by your chapter administrator. 
                  All memberships require verification by your local chapter team.
                </p>
                <p>
                  You can expect to receive an onboarding message from your chapter administrator within{' '}
                  <strong className="text-foreground">48 hours</strong>, and your membership will be confirmed on the 
                  WIFT Africa platform within <strong className="text-foreground">24 hours</strong> thereafter.
                </p>
                <p className="text-foreground font-medium">
                  We look forward to welcoming you into the network!
                </p>
              </div>

              <div className="flex justify-center">
                <button
                  onClick={() => setShowWelcomeModal(false)}
                  className="px-8 py-3 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg font-medium transition-colors"
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
