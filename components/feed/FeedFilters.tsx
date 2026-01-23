'use client'

import { useTranslation } from 'react-i18next'

import { useFeedStore } from '@/lib/stores/feedStore'

export const FeedFilters = () => {
  const { t } = useTranslation()
  const { filters, setFilters } = useFeedStore()
  
  const filterOptions = [
    { value: 'all' as const, labelKey: 'feed.filters.all' },
    { value: 'posts' as const, labelKey: 'feed.filters.posts' },
    { value: 'admin' as const, labelKey: 'feed.filters.announcements' },
  ]

  return (
    <div className="bg-card border border-border rounded-lg p-3 mb-4">
      <div className="flex items-center gap-2 overflow-x-auto">
        {filterOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => setFilters({ type: option.value })}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
              filters.type === option.value
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            {t(option.labelKey)}
          </button>
        ))}
      </div>
    </div>
  )
}
