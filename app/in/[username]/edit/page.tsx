'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useAuth } from '@/lib/hooks/useAuth'
import { useProfile } from '@/lib/hooks/useProfile'
import { type UpdateProfileInput } from '@/lib/api/users'
import { 
  User, 
  Upload, 
  Loader2,
  Save,
  ArrowLeft,
  FileText,
  Trash2
} from 'lucide-react'
import Link from 'next/link'
import { AvailabilityStatus } from '@/types'

export default function EditProfilePage() {
  const router = useRouter()
  const params = useParams()
  const { user, isAuthenticated } = useAuth()
  const username = params.username as string
  
  const { 
    profile, 
    user: profileUser, // The user object from the profile response
    isLoading, 
    error: loadError, 
    updateProfile, 
    isUpdating,
    uploadPhoto,
    isUploadingPhoto,
    deletePhoto, // we might want to add delete photo button too
    uploadCV,
    isUploadingCV,
    deleteCV,
    isDeletingCV
  } = useProfile()

  // Form state
  const [formData, setFormData] = useState<UpdateProfileInput>({
    headline: '',
    bio: '',
    location: '',
    website: '',
    imdbUrl: '',
    linkedinUrl: '',
    instagramHandle: '',
    twitterHandle: '',
    availabilityStatus: 'AVAILABLE' as AvailabilityStatus
  })

  // File upload states
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [cvFile, setCvFile] = useState<File | null>(null)
  
  // Local error state for validations
  const [validationError, setValidationError] = useState<string | null>(null)

  // Determine ownership
  const isOwner = !!(user && (
    (user.username && user.username === username) || 
    (user.id === username)
  ))

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated && !isLoading) { // Wait for auth to load? useAuth also has isLoading
       // useAuth isLoading is not destructured here but it's fine
    }
  }, [isAuthenticated, isLoading]) // Simpler check handled by middleware usually or useAuth layout

  // Redirect if not owner
  useEffect(() => {
    if (isAuthenticated && user && !isOwner) {
       router.replace(`/in/${username}`)
    }
  }, [isAuthenticated, user, isOwner, username, router])

  // Populate form when profile loads
  useEffect(() => {
    if (profile && profileUser) {
      setFormData({
        headline: profile.headline || '',
        bio: profile.bio || '',
        location: profile.location || '',
        website: profile.website || '',
        imdbUrl: profile.imdbUrl || '',
        linkedinUrl: profile.linkedinUrl || '',
        instagramHandle: profile.instagramHandle || '',
        twitterHandle: profile.twitterHandle || '',
        availabilityStatus: profile.availabilityStatus || 'AVAILABLE'
      })

      if (profileUser.profilePhoto) {
        setPhotoPreview(profileUser.profilePhoto)
      }
    }
  }, [profile, profileUser])

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setValidationError(null)
  }

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (!file.type.startsWith('image/')) {
        setValidationError('Please select an image file')
        return
      }
      if (file.size > 5 * 1024 * 1024) {
        setValidationError('Image must be less than 5MB')
        return
      }

      setPhotoFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
      setValidationError(null)
    }
  }

  const handleCVChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ]
      if (!allowedTypes.includes(file.type)) {
        setValidationError('Please select a PDF, DOC, or DOCX file')
        return
      }
      if (file.size > 10 * 1024 * 1024) {
        setValidationError('CV must be less than 10MB')
        return
      }

      setCvFile(file)
      setValidationError(null)
    }
  }

  const handleDeleteCV = async () => {
    if (!confirm('Are you sure you want to delete your CV?')) return
    await deleteCV()
  }
  
  // We can add Delete Photo here if we want
  const handleDeletePhoto = async () => {
    if (!confirm('Remove profile photo?')) return
    await deletePhoto()
    setPhotoPreview(null)
    setPhotoFile(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setValidationError(null)

    try {
      // 1. Upload photo if selected
      if (photoFile) {
        await uploadPhoto(photoFile)
        setPhotoFile(null) // Reset file selection on success
      }

      // 2. Upload CV if selected
      if (cvFile) {
        await uploadCV(cvFile)
        setCvFile(null)
      }

      // 3. Update profile data
      await updateProfile(formData)
      
      // Hook handles success toasts
    } catch (err: any) {
        // Hook handles error toasts, but we log here just in case
        console.error('Save failed', err)
    }
  }
  
  const isSaving = isUpdating || isUploadingPhoto || isUploadingCV

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your profile...</p>
        </div>
      </div>
    )
  }

  if (loadError && !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-4">Failed to load profile</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Link
              href={`/in/${username}`}
              className="p-2 hover:bg-accent rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-3xl font-bold text-foreground">Edit Profile</h1>
          </div>
        </div>

        {/* Validation Errors */}
        {validationError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800">{validationError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Photo */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">Profile Photo</h2>
            <div className="flex items-center gap-6">
              {photoPreview ? (
                <div className="relative group">
                    <img
                      src={photoPreview}
                      alt="Profile"
                      className="w-24 h-24 rounded-full object-cover border-4 border-primary/20"
                    />
                    {/* Optional: Add delete button overlay or separate button */}
                </div>
              ) : (
                <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center border-4 border-primary/20">
                  <User className="h-12 w-12 text-primary/50" />
                </div>
              )}
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                    <input
                      type="file"
                      id="photo"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      className="hidden"
                    />
                    <label
                      htmlFor="photo"
                      className="inline-flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-accent cursor-pointer transition-colors"
                    >
                      <Upload className="h-4 w-4" />
                      {photoPreview ? 'Change Photo' : 'Upload Photo'}
                    </label>
                    {photoPreview && (
                        <button 
                            type="button"
                            onClick={handleDeletePhoto}
                            className="px-3 py-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                            title="Remove photo"
                        >
                            <Trash2 className="h-4 w-4" />
                        </button>
                    )}
                </div>
                <p className="text-sm text-muted-foreground">
                  JPG, PNG or WebP. Max size 5MB.
                </p>
                {photoFile && (
                  <p className="text-sm text-primary">
                    Selected: {photoFile.name}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Basic Information */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">Basic Information</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="headline" className="block text-sm font-medium text-foreground mb-2">
                  Professional Headline
                </label>
                <input
                  type="text"
                  id="headline"
                  name="headline"
                  value={formData.headline}
                  onChange={handleInputChange}
                  placeholder="e.g., Award-winning Film Director & Producer"
                  maxLength={100}
                  className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  {formData.headline?.length || 0}/100 characters
                </p>
              </div>

              <div>
                <label htmlFor="bio" className="block text-sm font-medium text-foreground mb-2">
                  Bio
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  placeholder="Tell us about yourself, your experience, and what you're passionate about..."
                  rows={6}
                  maxLength={1000}
                  className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  {formData.bio?.length || 0}/1000 characters
                </p>
              </div>

              <div>
                <label htmlFor="location" className="block text-sm font-medium text-foreground mb-2">
                  Location
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="e.g., Lagos, Nigeria"
                  maxLength={100}
                  className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              <div>
                <label htmlFor="availabilityStatus" className="block text-sm font-medium text-foreground mb-2">
                  Availability Status
                </label>
                <select
                  id="availabilityStatus"
                  name="availabilityStatus"
                  value={formData.availabilityStatus}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="AVAILABLE">Available for work</option>
                  <option value="BUSY">Currently busy</option>
                  <option value="NOT_LOOKING">Not looking for work</option>
                </select>
              </div>
            </div>
          </div>

          {/* Links & Social Media */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">Links & Social Media</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="website" className="block text-sm font-medium text-foreground mb-2">
                  Website
                </label>
                <input
                  type="url"
                  id="website"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  placeholder="https://yourwebsite.com"
                  className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              <div>
                <label htmlFor="imdbUrl" className="block text-sm font-medium text-foreground mb-2">
                  IMDb Profile
                </label>
                <input
                  type="url"
                  id="imdbUrl"
                  name="imdbUrl"
                  value={formData.imdbUrl}
                  onChange={handleInputChange}
                  placeholder="https://www.imdb.com/name/..."
                  className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              <div>
                <label htmlFor="linkedinUrl" className="block text-sm font-medium text-foreground mb-2">
                  LinkedIn Profile
                </label>
                <input
                  type="url"
                  id="linkedinUrl"
                  name="linkedinUrl"
                  value={formData.linkedinUrl}
                  onChange={handleInputChange}
                  placeholder="https://www.linkedin.com/in/..."
                  className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              <div>
                <label htmlFor="instagramHandle" className="block text-sm font-medium text-foreground mb-2">
                  Instagram Handle
                </label>
                <input
                  type="text"
                  id="instagramHandle"
                  name="instagramHandle"
                  value={formData.instagramHandle}
                  onChange={handleInputChange}
                  placeholder="@yourusername"
                  maxLength={50}
                  className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              <div>
                <label htmlFor="twitterHandle" className="block text-sm font-medium text-foreground mb-2">
                  Twitter/X Handle
                </label>
                <input
                  type="text"
                  id="twitterHandle"
                  name="twitterHandle"
                  value={formData.twitterHandle}
                  onChange={handleInputChange}
                  placeholder="@yourusername"
                  maxLength={50}
                  className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>
          </div>

          {/* CV/Resume */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">CV/Resume</h2>
            
            {profileUser?.cvFileName ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-accent rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="h-8 w-8 text-primary" />
                    <div>
                      <p className="font-medium text-foreground">{profileUser.cvFileName}</p>
                      {profileUser.cvUploadedAt && (
                        <p className="text-sm text-muted-foreground">
                          Uploaded {new Date(profileUser.cvUploadedAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleDeleteCV}
                    disabled={isDeletingCV}
                    className="inline-flex items-center gap-2 px-4 py-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors disabled:opacity-50"
                  >
                    {isDeletingCV ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                    Delete
                  </button>
                </div>
                <p className="text-sm text-muted-foreground">
                  Upload a new CV to replace the current one
                </p>
              </div>
            ) : (
              <p className="text-muted-foreground mb-4">No CV uploaded yet</p>
            )}

            <div className="mt-4">
              <input
                type="file"
                id="cv"
                accept=".pdf,.doc,.docx"
                onChange={handleCVChange}
                className="hidden"
              />
              <label
                htmlFor="cv"
                className="inline-flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-accent cursor-pointer transition-colors"
              >
                <Upload className="h-4 w-4" />
                {profileUser?.cvFileName ? 'Upload New CV' : 'Upload CV'}
              </label>
              <p className="text-sm text-muted-foreground mt-2">
                PDF, DOC or DOCX. Max size 10MB.
              </p>
              {cvFile && (
                <p className="text-sm text-primary mt-1">
                  New CV selected: {cvFile.name}
                </p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4">
            <Link
              href={`/in/${username}`}
              className="px-6 py-3 border border-border rounded-lg hover:bg-accent transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}