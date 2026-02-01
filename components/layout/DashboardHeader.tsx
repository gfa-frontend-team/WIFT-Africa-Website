
import { useTranslation } from 'react-i18next';

import { useState, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/lib/hooks/useAuth';
import { useFeatureAccess } from '@/lib/hooks/useFeatureAccess';
import { MembershipStatus, type User } from '@/types';
import {
  Home,
  User as UserIcon,
  MessageCircle,
  Briefcase,
  BookOpen,
  Users,
  Calendar,
  Search,
  Bell,
  Settings,
  LogOut,
  ChevronDown,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Lock,
  UserPlus,
  Globe
} from 'lucide-react';
import { useNotifications } from '@/lib/hooks/useNotifications';
import LanguageSwitcher from '@/components/shared/LanguageSwitcher';
import { ModeToggle } from '@/components/shared/ModeToggle';
import { useEffect } from 'react';

interface DashboardHeaderProps {
  user: User;
}

const navigationItems = [
  { name: 'nav.home', href: '/feed', icon: Home, requiredFeature: 'canViewFeed' as const },
  { name: 'nav.messages', href: '/messages', icon: MessageCircle, requiredFeature: 'canSendMessages' as const },
  { name: 'nav.opportunities', href: '/opportunities', icon: Briefcase, requiredFeature: 'canViewOpportunities' as const },
  { name: 'nav.resources', href: '/resources', icon: BookOpen, requiredFeature: 'canViewResources' as const },
  { name: 'nav.chapters', href: '/chapters', icon: Globe, requiredFeature: 'canViewDirectory' as const },
  { name: 'nav.directory', href: '/members', icon: Users, requiredFeature: 'canViewDirectory' as const },
  { name: 'nav.events', href: '/events', icon: Calendar, requiredFeature: 'canViewEvents' as const },
];

export default function DashboardHeader({ user }: DashboardHeaderProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();
  const { logout } = useAuth();
  const { access } = useFeatureAccess();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { useUnreadCount } = useNotifications();
  const { data: unreadData } = useUnreadCount();
  const unreadCount = unreadData?.count || 0;

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsUserMenuOpen(false);
        setIsSearchOpen(false);
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    await logout();
  };

  const isActiveRoute = (href: string) => {
    return pathname === href || pathname.startsWith(href + '/');
  };

  const getVerificationStatusIcon = () => {
    switch (user.membershipStatus) {
      case MembershipStatus.PENDING:
        return <Clock className="h-3 w-3 text-yellow-600" />;
      case MembershipStatus.APPROVED:
        return <CheckCircle2 className="h-3 w-3 text-green-600" />;
      case MembershipStatus.REJECTED:
      case MembershipStatus.SUSPENDED:
        return <AlertTriangle className="h-3 w-3 text-red-600" />;
      default:
        return null;
    }
  };

  const getVerificationStatusText = () => {
    switch (user.membershipStatus) {
      case MembershipStatus.PENDING:
        return t('dashboard.header.status.pending');
      case MembershipStatus.APPROVED:
        return t('dashboard.header.status.verified');
      case MembershipStatus.REJECTED:
        return t('dashboard.header.status.declined');
      case MembershipStatus.SUSPENDED:
        return t('dashboard.header.status.suspended');
      default:
        return '';
    }
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/40 transition-all duration-200">
        <div className="max-w-screen-xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/feed" className="flex items-center shrink-0 group mr-4">
              <div className="relative h-10 w-10">
                <div className="absolute inset-0 bg-primary/20 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <Image
                  src="/WIFTAFRICA HEAD.png"
                  alt="WIFT Africa"
                  fill
                  className="object-contain relative z-10 transition-transform duration-300 group-hover:scale-105"
                  priority
                />
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-0.5 xl:space-x-1">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = isActiveRoute(item.href);
                const hasAccess = access[item.requiredFeature];

                return (
                  <Link
                    key={item.name}
                    href={hasAccess ? item.href : '/verification'}
                    className={`relative flex items-center space-x-1.5 px-3 py-2 rounded-full text-sm font-medium transition-all duration-200 group ${isActive && hasAccess
                      ? 'bg-primary/10 text-primary'
                      : hasAccess
                        ? 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                        : 'text-muted-foreground/40 cursor-help'
                      }`}
                    title={!hasAccess ? t('dashboard.header.verification_tooltip') : undefined}
                  >
                    <Icon className={`h-4 w-4 transition-transform duration-200 group-hover:scale-110 ${!hasAccess ? 'opacity-50' : ''}`} />
                    <span className={!hasAccess ? 'opacity-50' : ''}>{t(item.name)}</span>
                    {!hasAccess && <Lock className="h-3 w-3 ml-1 opacity-50" />}
                  </Link>
                );
              })}
            </nav>

            {/* Right Side */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Search Bar (Hidden on Mobile) */}
              <div className="hidden md:block relative group">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <input
                    type="text"
                    placeholder={t('dashboard.header.search_placeholder')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        router.push(`/search?query=${encodeURIComponent(searchQuery)}`)
                      }
                    }}
                    className="pl-10 pr-4 py-2 w-64 bg-accent/30 border border-transparent hover:border-border/50 focus:border-primary/30 focus:bg-background rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                  />
                </div>
              </div>

              {/* Mobile Search Toggle */}
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="md:hidden p-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-full transition-colors"
              >
                <Search className="h-5 w-5" />
              </button>

              {/* Notifications */}
              <div className="relative">
                <Link
                  href="/notifications"
                  className="relative p-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-full transition-colors block"
                >
                  <Bell className="h-5 w-5" />
                  {/* Notification Badge */}
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 h-2.5 w-2.5 bg-destructive rounded-full border-2 border-background animate-pulse" />
                  )}
                </Link>
              </div>

              <div className="relative flex items-center gap-2">
                <ModeToggle />
                <LanguageSwitcher />
              </div>

              {/* User Menu - Hidden on Mobile (in bottom nav) */}
              <div className="relative hidden md:block" ref={dropdownRef}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 pl-2 pr-1 py-1 text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-full transition-all duration-200 border border-transparent hover:border-border"
                >
                  <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center overflow-hidden ring-2 ring-transparent group-hover:ring-primary/20 transition-all">
                    {user.profilePhoto ? (
                      <img
                        src={user.profilePhoto}
                        alt={user.firstName}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="text-sm font-medium text-primary">
                        {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                      </span>
                    )}
                  </div>
                  <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* User Dropdown */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-card/95 backdrop-blur-xl border border-border/50 rounded-2xl shadow-2xl z-20 animate-in fade-in zoom-in-95 duration-200 origin-top-right overflow-hidden">
                    <div className="p-4 bg-accent/20 border-b border-border/50">
                      <p className="text-sm font-semibold text-foreground">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                      {/* Verification Status */}
                      <div className="flex items-center gap-1.5 mt-2 bg-background/50 py-1 px-2 rounded-full w-fit">
                        {getVerificationStatusIcon()}
                        <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
                          {getVerificationStatusText()}
                        </span>
                      </div>
                    </div>
                    <div className="p-2 space-y-0.5">
                      <Link
                        href={`/in/${user.username || user.id}`}
                        className="flex items-center space-x-3 px-3 py-2 text-sm text-foreground hover:bg-primary/10 hover:text-primary rounded-lg transition-colors group"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <UserIcon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                        <span>{t('dashboard.header.menu.profile')}</span>
                      </Link>
                      <Link
                        href="/connections"
                        className="flex items-center space-x-3 px-3 py-2 text-sm text-foreground hover:bg-primary/10 hover:text-primary rounded-lg transition-colors group"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <UserPlus className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                        <span>{t('dashboard.header.menu.connections')}</span>
                      </Link>
                      <Link
                        href="/settings"
                        className="flex items-center space-x-3 px-3 py-2 text-sm text-foreground hover:bg-primary/10 hover:text-primary rounded-lg transition-colors group"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <Settings className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                        <span>{t('dashboard.header.menu.settings')}</span>
                      </Link>
                    </div>
                    <div className="border-t border-border/50 p-2 bg-accent/10">
                      <button
                        onClick={handleLogout}
                        className="flex items-center space-x-3 px-3 py-2 text-sm text-destructive hover:bg-destructive/10 rounded-lg w-full text-left transition-colors"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>{t('dashboard.header.menu.signout')}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Search Overlay */}
        {isSearchOpen && (
          <div className="md:hidden border-t border-border bg-card/95 backdrop-blur-xl px-4 py-4 animate-in slide-in-from-top-2 duration-200 absolute w-full shadow-lg">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    router.push(`/search?query=${encodeURIComponent(searchQuery)}`)
                    setIsSearchOpen(false)
                  }
                }}
                autoFocus
                className="pl-10 pr-4 py-2.5 w-full bg-accent/30 border border-transparent focus:bg-background rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>
        )}
      </header>
    </>
  );
}
