'use client'

import { FileText, Download } from 'lucide-react'
import { usersApi, type UserProfileResponse } from '@/lib/api/users'

interface PrivateProfileSectionsProps {
  profile: UserProfileResponse
}

export default function PrivateProfileSections({ profile }: PrivateProfileSectionsProps) {
  const { user } = profile

  const handleDownloadCV = async () => {
    try {
      const blob = await usersApi.downloadCV()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = user.cvFileName || 'cv.pdf'
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (err) {
      console.error('Failed to download CV:', err)
      alert('Failed to download CV. Please try again.')
    }
  }

  if (!user.cvFileName) {
    return null
  }

  return (
    <div className="max-w-5xl mx-auto px-4 pb-8">
      <div className="bg-card border border-border rounded-lg p-6">
        <h2 className="text-xl font-semibold text-foreground mb-4">CV/Resume (Private)</h2>
        <div className="flex items-center justify-between p-4 bg-accent/50 rounded-lg">
          <div className="flex items-center gap-3">
            <FileText className="h-8 w-8 text-primary" />
            <div>
              <p className="font-medium text-foreground">{user.cvFileName}</p>
              {user.cvUploadedAt && (
                <p className="text-sm text-muted-foreground">
                  Uploaded {new Date(user.cvUploadedAt).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={handleDownloadCV}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Download className="h-4 w-4" />
            Download
          </button>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          This section is only visible to you.
        </p>
      </div>
    </div>
  )
}
