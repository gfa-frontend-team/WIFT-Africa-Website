'use client'

import { useTranslation } from 'react-i18next'
import { useAuth } from '@/lib/hooks/useAuth'
import Avatar from '@/components/ui/Avatar'

interface CreatePostTriggerProps {
  onOpenModal: () => void
}

export const CreatePostTrigger = ({ onOpenModal }: CreatePostTriggerProps) => {
  const { t } = useTranslation()
  const { user } = useAuth()
  
  if (!user) return null
  
  return (
    <div className="bg-card border border-border rounded-lg p-4 mb-4">
      <div className="flex items-center gap-3">
        <Avatar 
          src={user.profilePhoto} 
          name={`${user.firstName} ${user.lastName}`} 
          size="md" 
        />
        <button
          onClick={onOpenModal}
          className="flex-1 text-left px-4 py-3 bg-muted hover:bg-muted/80 rounded-full text-muted-foreground transition-colors"
        >
          {t('feed.create_post.trigger_placeholder', { name: user.firstName })}
        </button>
      </div>
    </div>
  )
}
