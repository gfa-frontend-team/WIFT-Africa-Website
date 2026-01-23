import { Mail, Globe, Link as LinkIcon, Edit3 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Profile } from '@/types'


interface ContactSectionProps {
  userEmail: string
  profile: Profile
  isOwner?: boolean
  onEdit?: () => void
}

export default function ContactSection({ userEmail, profile, isOwner, onEdit }: ContactSectionProps) {
  const { t } = useTranslation()
  const hasLinks = profile.website || profile.linkedinUrl || profile.instagramHandle || profile.twitterHandle || profile.imdbUrl

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground">{t('profile.contact.title')}</h2>
        {isOwner && (
          <button 
            onClick={onEdit}
            className="p-2 hover:bg-accent rounded-lg transition-colors text-muted-foreground hover:text-foreground"
          >
            <Edit3 className="h-4 w-4" />
          </button>
        )}
      </div>
      
      <div className="space-y-4">
        {/* Email - Always show if allowed (assumed allowed if reached here) */}
        <div className="flex items-center gap-3">
          <Mail className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm truncate">{userEmail}</span>
        </div>

        {/* Website */}
        {profile.website && (
           <div className="flex items-center gap-3">
             <Globe className="h-4 w-4 text-muted-foreground" />
             <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline truncate">
               {profile.website.replace(/^https?:\/\//, '')}
             </a>
           </div>
        )}

        {/* Social Links */}
        {hasLinks && (
          <div className="pt-2 border-t border-border mt-2 space-y-2">
             {profile.linkedinUrl && (
               <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm text-muted-foreground hover:text-primary transition-colors">
                  <LinkIcon className="h-4 w-4" />
                  <span>{t('profile.contact.linkedin')}</span>
               </a>
             )}
             {profile.imdbUrl && (
               <a href={profile.imdbUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm text-muted-foreground hover:text-primary transition-colors">
                  <LinkIcon className="h-4 w-4" />
                  <span>{t('profile.contact.imdb')}</span>
               </a>
             )}
          </div>
        )}
      </div>
    </div>
  )
}
