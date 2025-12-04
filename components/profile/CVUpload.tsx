'use client'

import { useState, useRef } from 'react'
import { FileText, Upload, Trash2, Download } from 'lucide-react'
import { useProfile } from '@/lib/hooks/useProfile'

interface CVUploadProps {
  cvFileName?: string
  cvUploadedAt?: string
  onCVUpdated?: (fileName: string) => void
  onCVDeleted?: () => void
}

export default function CVUpload({
  cvFileName,
  cvUploadedAt,
  onCVUpdated,
  onCVDeleted,
}: CVUploadProps) {
  const { uploadCV, deleteCV, downloadCV, isLoading } = useProfile()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    const validTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ]
    if (!validTypes.includes(file.type)) {
      setError('Please upload a PDF, DOC, or DOCX file')
      return
    }

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('File must be less than 10MB')
      return
    }

    setError(null)
    setSuccess(null)

    try {
      const response = await uploadCV(file)
      setSuccess('CV uploaded successfully!')
      onCVUpdated?.(response.cvFileName)
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      setError('Failed to upload CV. Please try again.')
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete your CV?')) return

    setError(null)
    setSuccess(null)

    try {
      await deleteCV()
      setSuccess('CV deleted successfully!')
      onCVDeleted?.()
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      setError('Failed to delete CV. Please try again.')
    }
  }

  const handleDownload = async () => {
    setError(null)
    
    try {
      await downloadCV()
    } catch (err) {
      setError('Failed to download CV. Please try again.')
    }
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return ''
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <div className="space-y-4">
      {/* CV Status Card */}
      {cvFileName ? (
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <FileText className="h-6 w-6 text-primary" />
            </div>
            
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-foreground mb-1">Current CV/Resume</h4>
              <p className="text-sm text-muted-foreground truncate">{cvFileName}</p>
              {cvUploadedAt && (
                <p className="text-xs text-muted-foreground mt-1">
                  Uploaded on {formatDate(cvUploadedAt)}
                </p>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleDownload}
                disabled={isLoading}
                className="p-2 text-primary hover:bg-accent rounded-lg transition-colors disabled:opacity-50"
                title="Download CV"
              >
                <Download className="h-5 w-5" />
              </button>
              
              <button
                type="button"
                onClick={handleDelete}
                disabled={isLoading}
                className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors disabled:opacity-50"
                title="Delete CV"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-card border border-dashed border-border rounded-lg p-8 text-center">
          <div className="flex flex-col items-center space-y-3">
            <div className="p-4 bg-muted rounded-full">
              <FileText className="h-8 w-8 text-muted-foreground" />
            </div>
            <div>
              <h4 className="font-medium text-foreground mb-1">No CV uploaded</h4>
              <p className="text-sm text-muted-foreground">
                Upload your CV/Resume to share with potential employers
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Upload Button */}
      <div className="flex justify-center">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isLoading}
          className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <div className="animate-spin h-5 w-5 border-2 border-primary-foreground border-t-transparent rounded-full" />
              <span>Uploading...</span>
            </>
          ) : (
            <>
              <Upload className="h-5 w-5" />
              <span>{cvFileName ? 'Replace CV' : 'Upload CV'}</span>
            </>
          )}
        </button>
      </div>

      {/* File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Messages */}
      {error && (
        <div className="text-sm text-destructive bg-destructive/10 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {success && (
        <div className="text-sm text-green-700 bg-green-50 px-4 py-3 rounded-lg border border-green-200">
          {success}
        </div>
      )}

      {/* Help Text */}
      <p className="text-xs text-muted-foreground text-center">
        Accepted formats: PDF, DOC, DOCX. Max size 10MB.
      </p>
    </div>
  )
}
