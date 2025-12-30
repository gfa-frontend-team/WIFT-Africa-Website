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
  Globe,
  Lock
} from 'lucide-react';

const mobileNavItems = [
  { name: 'Home', href: '/feed', icon: Home, requiredFeature: 'canViewFeed' as const },
  { name: 'Chapters', href: '/chapters', icon: Globe, requiredFeature: 'canViewDirectory' as const },
  { name: 'Opps', href: '/opportunities', icon: Briefcase, requiredFeature: 'canViewOpportunities' as const },
  { name: 'Messages', href: '/messages', icon: MessageCircle, requiredFeature: 'canSendMessages' as const },
  { name: 'Profile', href: '/me', icon: User, isProfile: true, requiredFeature: 'canEditProfile' as const },
];

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { user } = useAuth();
  const { access } = useFeatureAccess();

  const isActiveRoute = (href: string, isProfile?: boolean) => {
    if (isProfile && user) {
      // Check if we're on a profile page (matches /username pattern but not reserved routes)
      const reservedRoutes = ['/feed', '/members', '/opportunities', '/events', '/resources', '/messages', '/notifications', '/connections', '/settings', '/me', '/chapters'];
      const isReserved = reservedRoutes.some(route => pathname.startsWith(route));
      return !isReserved && (pathname.match(/^\/[\w-]+/) || pathname.startsWith('/profile/'));
    }
    return pathname === href || pathname.startsWith(href + '/');
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden pb-safe-area">
      {/* Glassmorphism Background Container */}
      <div className="absolute inset-0 bg-background/85 backdrop-blur-xl border-t border-border/50" />
      
      <div className="relative flex items-center justify-around h-16 px-2">
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
              className={`relative flex flex-col items-center justify-center space-y-1 px-1 py-1 rounded-xl transition-all duration-200 min-w-0 flex-1 group ${
                isActive && hasAccess
                  ? 'text-primary'
                  : hasAccess
                    ? 'text-muted-foreground hover:text-foreground'
                    : 'text-muted-foreground/40'
              }`}
            >
              <div className={`relative p-1.5 rounded-full transition-all duration-200 ${
                isActive && hasAccess ? 'bg-primary/10 scale-110' : 'group-active:scale-95'
              }`}>
                <Icon className={`h-5 w-5 ${
                  isActive && hasAccess 
                    ? 'stroke-[2.5px]' 
                    : !hasAccess 
                      ? 'opacity-50' 
                      : 'stroke-2'
                }`} />
                {!hasAccess && (
                  <Lock className="absolute -top-1 -right-1 h-3 w-3 bg-background rounded-full p-0.5 text-muted-foreground" />
                )}
              </div>
              <span className={`text-[10px] font-medium truncate transition-colors ${
                isActive && hasAccess
                  ? 'text-primary font-semibold'
                  : !hasAccess
                    ? 'text-muted-foreground/40'
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
