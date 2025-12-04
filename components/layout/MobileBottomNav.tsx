'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/hooks/useAuth';
import { 
  Home, 
  User, 
  MessageCircle, 
  Briefcase, 
  Users
} from 'lucide-react';

const mobileNavItems = [
  { name: 'Home', href: '/feed', icon: Home },
  { name: 'Messages', href: '/messages', icon: MessageCircle },
  { name: 'Opportunities', href: '/opportunities', icon: Briefcase },
  { name: 'Directory', href: '/members', icon: Users },
  { name: 'Profile', href: '/profile', icon: User, isProfile: true },
];

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { user } = useAuth();

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
          const href = item.isProfile && user ? `/me` : item.href;
          const isActive = isActiveRoute(href, item.isProfile);
          
          return (
            <Link
              key={item.name}
              href={href}
              className={`flex flex-col items-center justify-center space-y-1 px-3 py-2 rounded-lg transition-colors min-w-0 flex-1 ${
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className={`h-5 w-5 ${isActive ? 'text-primary' : ''}`} />
              <span className={`text-xs font-medium truncate ${
                isActive ? 'text-primary' : 'text-muted-foreground'
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
