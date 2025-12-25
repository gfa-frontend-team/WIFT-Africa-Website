'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/hooks/useAuth';
import { useFeatureAccess } from '@/lib/hooks/useFeatureAccess';
import { 
  Home, 
  User, 
  MessageCircle, 
  Briefcase, 
  Users,
  Lock
} from 'lucide-react';

const mobileNavItems = [
  { name: 'Home', href: '/feed', icon: Home, requiredFeature: 'canViewFeed' as const },
  { name: 'Messages', href: '/messages', icon: MessageCircle, requiredFeature: 'canSendMessages' as const },
  { name: 'Opportunities', href: '/opportunities', icon: Briefcase, requiredFeature: 'canViewOpportunities' as const },
  { name: 'Directory', href: '/members', icon: Users, requiredFeature: 'canViewDirectory' as const },
  { name: 'Profile', href: '/me', icon: User, isProfile: true, requiredFeature: 'canEditProfile' as const },
];

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { user } = useAuth();
  const { access } = useFeatureAccess();

  const isActiveRoute = (href: string, isProfile?: boolean) => {
    if (isProfile && user) {
      // Check if we're on a profile page (matches /username pattern but not reserved routes)
      const reservedRoutes = ['/feed', '/members', '/opportunities', '/events', '/resources', '/messages', '/notifications', '/connections', '/settings', '/me'];
      const isReserved = reservedRoutes.some(route => pathname.startsWith(route));
      return !isReserved && (pathname.match(/^\/[\w-]+/) || pathname.startsWith('/profile/'));
    }
    return pathname === href || pathname.startsWith(href + '/');
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-card border-t border-border md:hidden">
      <div className="flex items-center justify-around h-16 px-2">
        {mobileNavItems.map((item) => {
          const Icon = item.icon;
          const href = item.isProfile && user ? `/in/${user.username || user.id}` : item.href;
          const isActive = isActiveRoute(href, item.isProfile);
          const hasAccess = access[item.requiredFeature];
          const targetHref = hasAccess ? href : '/verification';
          
          return (
            <Link
              key={item.name}
              href={targetHref}
              className={`relative flex flex-col items-center justify-center space-y-1 px-3 py-2 rounded-lg transition-colors min-w-0 flex-1 ${
                isActive && hasAccess
                  ? 'text-primary'
                  : hasAccess
                    ? 'text-muted-foreground hover:text-foreground'
                    : 'text-muted-foreground/50'
              }`}
            >
              <div className="relative">
                <Icon className={`h-5 w-5 ${
                  isActive && hasAccess 
                    ? 'text-primary' 
                    : !hasAccess 
                      ? 'opacity-50' 
                      : ''
                }`} />
                {!hasAccess && (
                  <Lock className="absolute -top-1 -right-1 h-3 w-3 bg-background rounded-full p-0.5" />
                )}
              </div>
              <span className={`text-xs font-medium truncate ${
                isActive && hasAccess
                  ? 'text-primary'
                  : !hasAccess
                    ? 'text-muted-foreground/50'
                    : 'text-muted-foreground'
              }`}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
