import { Edit3 } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface AboutSectionProps {
  bio?: string
  isOwner?: boolean
  onEdit?: () => void
}

export default function AboutSection({ bio, isOwner, onEdit }: AboutSectionProps) {
  const { t } = useTranslation()
  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-foreground">{t('profile.about.title')}</h2>
        {isOwner && (
          <button 
            onClick={onEdit}
            className="p-2 hover:bg-accent rounded-lg transition-colors text-muted-foreground hover:text-foreground"
            title={t('profile.about.edit_title')}
          >
            <Edit3 className="h-4 w-4" />
          </button>
        )}
      </div>
      <div className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
        {bio || (
          <span className="italic opacity-60">
            {isOwner ? t('profile.about.placeholder_owner') : t('profile.about.placeholder_visitor')}
          </span>
        )}
      </div>
    </div>
  )
}
