'use client'

import { Clock } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import dynamic from 'next/dynamic'
import { useNavbar } from '@/hooks/NavbarContext'
import { ScrollArea } from '../ui/scroll-area'

// Dynamically import widgets to reduce initial bundle size
const UpcomingEventsWidget = dynamic(() => import('./widgets/UpcomingEventsWidget'), { ssr: false })
const TrendingPostsWidget = dynamic(() => import('./widgets/TrendingPostsWidget'), { ssr: false })
const LatestOpportunitiesWidget = dynamic(() => import('./widgets/LatestOpportunitiesWidget'), { ssr: false })
const SuggestedConnectionsWidget = dynamic(() => import('./widgets/SuggestedConnectionsWidget'), { ssr: false })

export default function RightSidebar() {
  const { t } = useTranslation()

  const {
    size: { height: navbarHeight },
  } = useNavbar();

  // Define the calculated height for reuse
  const sidebarHeight = `calc(100dvh - ${navbarHeight + 40}px)`;


  return (
    <aside
      className="hidden md:block md:col-span-4 lg:col-span-3 sticky min-w-0"
      style={{
        height: sidebarHeight,
        top: `${navbarHeight + 10}px`,
      }}
    >
      <ScrollArea className="h-full w-full">

        <div className="space-y-4 min-w-0 w-full">
          {/* 1. Upcoming Events */}
          <UpcomingEventsWidget />

          {/* 2. Trending Posts */}
          <TrendingPostsWidget />

          {/* 3. Latest Opportunities */}
          <LatestOpportunitiesWidget />

          {/* 4. Suggested Connections */}
          <SuggestedConnectionsWidget />

          {/* Available Now - Recent Activity */}
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <h3 className="font-semibold text-foreground text-sm">
                {t('sidebar.recent_activity')}
              </h3>
            </div>

            <div className="space-y-2 text-sm text-muted-foreground">
              <p className="break-words">{t('sidebar.welcome_msg')}</p>
              <p className="break-words">{t('sidebar.first_post_msg')}</p>
              <p className="break-words">{t('sidebar.explore_msg')}</p>
            </div>
          </div>

          {/* Footer Links */}
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
              <a href="/about" className="hover:text-primary">{t('sidebar.footer.about')}</a>
              <span>•</span>
              <a href="/help" className="hover:text-primary">{t('sidebar.footer.help')}</a>
              <span>•</span>
              <a href="/privacy" className="hover:text-primary">{t('sidebar.footer.privacy')}</a>
              <span>•</span>
              <a href="/terms" className="hover:text-primary">{t('sidebar.footer.terms')}</a>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              © {new Date().getFullYear()} WIFT Africa
            </p>
          </div>
        </div>
      </ScrollArea>

    </aside>
  )
}