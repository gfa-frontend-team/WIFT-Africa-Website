import { FileText, Download } from 'lucide-react'
import { type UserProfileResponse } from '@/lib/api/users'
import { useProfile } from '@/lib/hooks/useProfile'

interface PrivateProfileSectionsProps {
  profile: UserProfileResponse
}

export default function PrivateProfileSections({ profile }: PrivateProfileSectionsProps) {
  const { user } = profile
  const { downloadCV } = useProfile()

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
            onClick={downloadCV}
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
