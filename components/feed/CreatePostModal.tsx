'use client'

import { useState, useEffect } from 'react'
import { X, Image as ImageIcon, Video, Globe, Users, Lock } from 'lucide-react'
import Avatar from '@/components/ui/Avatar'
import { usePostStore } from '@/lib/stores/postStore'
import { useAuth } from '@/lib/hooks/useAuth'
import { usePostMutations } from '@/lib/hooks/usePostMutations'
import { uploadApi } from '@/lib/api/upload'
import ConfirmationModal from '@/components/ui/ConfirmationModal'

interface CreatePostModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function CreatePostModal({ isOpen, onClose }: CreatePostModalProps) {
  const { user } = useAuth()
  const { draft, saveDraft, clearDraft } = usePostStore()
  const { createPost, isCreating } = usePostMutations()
  const [content, setContent] = useState(draft?.content || '')
  const [visibility, setVisibility] = useState<'PUBLIC' | 'CHAPTER_ONLY' | 'CONNECTIONS_ONLY'>(
    draft?.visibility || 'PUBLIC'
  )
  const [showVisibilityMenu, setShowVisibilityMenu] = useState(false)
  const [mediaFiles, setMediaFiles] = useState<File[]>([])
  const [mediaPreviews, setMediaPreviews] = useState<string[]>([])

  console.log('CreatePostModal render:', { isOpen, draft, isCreating })

  const maxChars = 5000 // Based on API docs
  const charCount = content.length
  const isOverLimit = charCount > maxChars

  useEffect(() => {
    if (isOpen && draft) {
      setContent(draft.content)
      setVisibility(draft.visibility)
    }
  }, [isOpen, draft])

  // Auto-save draft
  useEffect(() => {
    if (content.trim() || mediaFiles.length > 0) {
      const timer = setTimeout(() => {
        saveDraft({
          content,
          visibility,
          // Note: We don't save media files in draft for now
        })
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [content, visibility, mediaFiles, saveDraft])

  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'video') => {
    const files = Array.from(e.target.files || [])
    
    const validFiles = files.filter((file) => {
      const isValidType = type === 'image' 
        ? file.type.startsWith('image/') 
        : file.type.startsWith('video/')
      
      const maxSize = type === 'image' ? 5 * 1024 * 1024 : 100 * 1024 * 1024 // 5MB for images, 100MB for videos
      
      if (!isValidType) {
        alert(`Please select valid ${type} files.`)
        return false
      }
      
      if (file.size > maxSize) {
        alert(`${file.name} is too large. Max size is ${type === 'image' ? '5MB' : '100MB'}.`)
        return false
      }
      
      return true
    })

    if (type === 'video' && validFiles.length > 0) {
      // Only allow one video
      setMediaFiles([validFiles[0]])
      setMediaPreviews([])
      
      const reader = new FileReader()
      reader.onloadend = () => {
        setMediaPreviews([reader.result as string])
      }
      reader.readAsDataURL(validFiles[0])
    } else if (type === 'image') {
      // Allow multiple images but check total count
      if (mediaFiles.length + validFiles.length > 10) {
        alert('You can only upload up to 10 images.')
        return
      }

      setMediaFiles([...mediaFiles, ...validFiles])

      // Create previews
      validFiles.forEach((file) => {
        const reader = new FileReader()
        reader.onloadend = () => {
          setMediaPreviews((prev) => [...prev, reader.result as string])
        }
        reader.readAsDataURL(file)
      })
    }
  }

  const removeMedia = (index: number) => {
    setMediaFiles(mediaFiles.filter((_, i) => i !== index))
    setMediaPreviews(mediaPreviews.filter((_, i) => i !== index))
  }

  const [isUploading, setIsUploading] = useState(false)
  const [showDiscardDialog, setShowDiscardDialog] = useState(false)

  const handleSubmit = async () => {
    if (!content.trim() || isOverLimit || isCreating || isUploading) return

    try {
      setIsUploading(true)
      const media = []

      // Upload files
      for (const file of mediaFiles) {
        if (file.type.startsWith('image/')) {
          const response = await uploadApi.uploadFile(file, 'post')
          media.push({
            type: 'image' as const,
            url: response.url
          })
        } else if (file.type.startsWith('video/')) {
          const response = await uploadApi.uploadVideo(file)
          media.push({
            type: 'video' as const,
            url: response.url
          })
        }
      }

      await createPost({
        content,
        visibility,
        media
      })
      
      // Clear form
      setContent('')
      setMediaFiles([])
      setMediaPreviews([])
      clearDraft()
      onClose()
    } catch (error) {
      console.error('Failed to create post:', error)
      alert('Failed to create post. Please try again.')
    } finally {
      setIsUploading(false)
    }
  }

  const handleClose = () => {
    if (content.trim() || mediaFiles.length > 0) {
      setShowDiscardDialog(true)
    } else {
      onClose()
    }
  }

  const handleDiscard = () => {
    setContent('')
    setMediaFiles([])
    setMediaPreviews([])
    onClose()
  }

  const visibilityOptions = [
    { 
      value: 'PUBLIC' as const, 
      label: 'Public', 
      icon: Globe, 
      description: 'Anyone can see this post' 
    },
    { 
      value: 'CONNECTIONS_ONLY' as const, 
      label: 'Connections', 
      icon: Users, 
      description: 'Only your connections' 
    },
    { 
      value: 'CHAPTER_ONLY' as const, 
      label: 'Chapter', 
      icon: Lock, 
      description: 'Only your chapter members' 
    },
  ]

  const selectedVisibility = visibilityOptions.find((opt) => opt.value === visibility)

  if (!isOpen || !user) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-xl font-semibold text-foreground">Create Post</h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-accent rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* User Info */}
          <div className="flex items-center gap-3 mb-4">
            <Avatar 
              src={user.profilePhoto} 
              name={`${user.firstName} ${user.lastName}`} 
              size="md" 
            />
            <div className="flex-1">
              <p className="font-semibold text-foreground">
                {user.firstName} {user.lastName}
              </p>
              <div className="relative">
                <button
                  onClick={() => setShowVisibilityMenu(!showVisibilityMenu)}
                  className="flex items-center gap-1 px-3 py-1 bg-muted hover:bg-muted/80 rounded-full text-sm transition-colors"
                >
                  {selectedVisibility && <selectedVisibility.icon className="h-3 w-3" />}
                  <span>{selectedVisibility?.label}</span>
                </button>

                {/* Visibility Dropdown */}
                {showVisibilityMenu && (
                  <div className="absolute top-full left-0 mt-1 bg-card border border-border rounded-lg shadow-lg z-10 min-w-[250px]">
                    {visibilityOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setVisibility(option.value)
                          setShowVisibilityMenu(false)
                        }}
                        className="w-full flex items-start gap-3 p-3 hover:bg-accent transition-colors text-left"
                      >
                        <option.icon className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="font-medium text-foreground">{option.label}</p>
                          <p className="text-xs text-muted-foreground">{option.description}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Text Input */}
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={`What's on your mind, ${user.firstName}?`}
            className="w-full min-h-[150px] p-3 bg-transparent border-none focus:outline-none resize-none text-foreground placeholder:text-muted-foreground"
            autoFocus
          />

          {/* Media Previews */}
          {mediaPreviews.length > 0 && (
            <div className={`grid gap-2 mb-4 ${
              mediaPreviews.length === 1 ? 'grid-cols-1' :
              mediaPreviews.length === 2 ? 'grid-cols-2' :
              'grid-cols-3'
            }`}>
              {mediaPreviews.map((preview, index) => {
                const file = mediaFiles[index]
                const isVideo = file?.type.startsWith('video/')
                
                return (
                  <div key={index} className="relative aspect-square rounded-lg overflow-hidden bg-muted">
                    {isVideo ? (
                      <video src={preview} className="w-full h-full object-cover" controls />
                    ) : (
                      <img src={preview} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" />
                    )}
                    <button
                      onClick={() => removeMedia(index)}
                      className="absolute top-2 right-2 p-1 bg-black/60 hover:bg-black/80 rounded-full transition-colors"
                    >
                      <X className="h-4 w-4 text-white" />
                    </button>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-border p-4">
          {/* Media Buttons */}
          <div className="flex items-center gap-2 mb-3">
            <label className="flex items-center gap-2 px-4 py-2 hover:bg-accent rounded-lg cursor-pointer transition-colors">
              <ImageIcon className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium text-foreground">Photo</span>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => handleMediaUpload(e, 'image')}
                className="hidden"
                disabled={mediaFiles.some(f => f.type.startsWith('video/'))}
              />
            </label>

            <label className="flex items-center gap-2 px-4 py-2 hover:bg-accent rounded-lg cursor-pointer transition-colors">
              <Video className="h-5 w-5 text-red-600" />
              <span className="text-sm font-medium text-foreground">Video</span>
              <input
                type="file"
                accept="video/*"
                onChange={(e) => handleMediaUpload(e, 'video')}
                className="hidden"
                disabled={mediaFiles.some(f => f.type.startsWith('image/'))}
              />
            </label>
          </div>

          {/* Character Counter & Submit */}
          <div className="flex items-center justify-between">
            <span className={`text-sm ${
              isOverLimit ? 'text-red-500' : 'text-muted-foreground'
            }`}>
              {charCount} / {maxChars}
            </span>
            <button
              onClick={handleSubmit}
              disabled={!content.trim() || isOverLimit || isCreating || isUploading}
              className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isCreating || isUploading ? 'Posting...' : 'Post'}
            </button>
          </div>
        </div>
      </div>

      <ConfirmationModal
        isOpen={showDiscardDialog}
        onClose={() => setShowDiscardDialog(false)}
        onConfirm={handleDiscard}
        title="Discard Post?"
        message="You have unsaved changes. Are you sure you want to discard them?"
        confirmText="Discard"
        variant="danger"
      />
    </div>
  )
}