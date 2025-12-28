'use client'

import { useState, useRef } from 'react'
import { Camera, Trash2, Upload } from 'lucide-react'
import { useProfile } from '@/lib/hooks/useProfile'

interface ProfilePhotoUploadProps {
  currentPhotoUrl?: string
  userName: string
  onPhotoUpdated?: (photoUrl: string) => void
  onPhotoDeleted?: () => void
}

export default function ProfilePhotoUpload({
  currentPhotoUrl,
  userName,
  onPhotoUpdated,
  onPhotoDeleted,
}: ProfilePhotoUploadProps) {
  const { 
    uploadPhoto: uploadProfilePhoto, 
    deletePhoto: deleteProfilePhoto, 
    isUploadingPhoto,
    isDeletingPhoto
  } = useProfile()
  
  const isLoading = isUploadingPhoto || isDeletingPhoto
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!validTypes.includes(file.type)) {
      setError('Please upload a JPG, PNG, or WebP image')
      return
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be less than 5MB')
      return
    }

    setError(null)

    // Show preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string)
    }
    reader.readAsDataURL(file)

    // Upload
    try {
      const response = await uploadProfilePhoto(file)
      onPhotoUpdated?.(response.photoUrl)
      setPreviewUrl(null)
    } catch (err) {
      setError('Failed to upload photo. Please try again.')
      setPreviewUrl(null)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete your profile photo?')) return

    try {
      await deleteProfilePhoto()
      onPhotoDeleted?.()
      setPreviewUrl(null)
    } catch (err) {
      setError('Failed to delete photo. Please try again.')
    }
  }

  const photoUrl = previewUrl || currentPhotoUrl
  const initials = userName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Photo Display */}
      <div className="relative">
        <div className="h-32 w-32 rounded-full overflow-hidden bg-primary flex items-center justify-center border-4 border-card shadow-lg">
          {photoUrl ? (
            <img src={photoUrl} alt={userName} className="h-full w-full object-cover" />
          ) : (
            <span className="text-4xl font-bold text-primary-foreground">{initials}</span>
          )}
        </div>

        {/* Upload Button Overlay */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isLoading}
          className="absolute bottom-0 right-0 p-2 bg-primary text-primary-foreground rounded-full shadow-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
          title="Upload photo"
        >
          {isLoading ? (
            <div className="animate-spin h-5 w-5 border-2 border-primary-foreground border-t-transparent rounded-full" />
          ) : (
            <Camera className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          <Upload className="h-4 w-4" />
          {currentPhotoUrl ? 'Change Photo' : 'Upload Photo'}
        </button>

        {currentPhotoUrl && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 text-sm bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-colors disabled:opacity-50"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </button>
        )}
      </div>

      {/* File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Error Message */}
      {error && (
        <div className="text-sm text-destructive bg-destructive/10 px-4 py-2 rounded-lg">
          {error}
        </div>
      )}

      {/* Help Text */}
      <p className="text-xs text-muted-foreground text-center">
        JPG, PNG or WebP. Max size 5MB.
      </p>
    </div>
  )
}
