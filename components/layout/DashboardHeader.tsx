'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
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
  UserPlus
} from 'lucide-react';
import { useNotifications } from '@/lib/hooks/useNotifications';
import { useEffect } from 'react';

interface DashboardHeaderProps {
  user: User;
}

const navigationItems = [
  { name: 'Home', href: '/feed', icon: Home, requiredFeature: 'canViewFeed' as const },
  { name: 'Messages', href: '/messages', icon: MessageCircle, requiredFeature: 'canSendMessages' as const },
  { name: 'Opportunities', href: '/opportunities', icon: Briefcase, requiredFeature: 'canViewOpportunities' as const },
  { name: 'Resources', href: '/resources', icon: BookOpen, requiredFeature: 'canViewResources' as const },
  { name: 'Directory', href: '/members', icon: Users, requiredFeature: 'canViewDirectory' as const },
  { name: 'Events', href: '/events', icon: Calendar, requiredFeature: 'canViewEvents' as const },
];

export default function DashboardHeader({ user }: DashboardHeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { logout } = useAuth();
  const { access } = useFeatureAccess();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { useUnreadCount } = useNotifications();
  const { data: unreadData } = useUnreadCount();
  const unreadCount = unreadData?.count || 0;
  


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
        return 'Verification Pending';
      case MembershipStatus.APPROVED:
        return 'Verified Member';
      case MembershipStatus.REJECTED:
        return 'Application Declined';
      case MembershipStatus.SUSPENDED:
        return 'Membership Suspended';
      default:
        return '';
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-card border-b border-border">
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/feed" className="flex items-center space-x-3">
            <img 
              src="/WIFT.png" 
              alt="WIFT Africa" 
              className="h-8 w-auto"
            />
            <span className="text-xl font-bold text-foreground hidden sm:block">
              WIFT Africa
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = isActiveRoute(item.href);
              const hasAccess = access[item.requiredFeature];
              
              return (
                <Link
                  key={item.name}
                  href={hasAccess ? item.href : '/verification'}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive && hasAccess
                      ? 'bg-primary text-primary-foreground'
                      : hasAccess
                        ? 'text-muted-foreground hover:text-foreground hover:bg-accent'
                        : 'text-muted-foreground/50 hover:text-muted-foreground cursor-help'
                  }`}
                  title={!hasAccess ? 'Complete membership verification to access this feature' : undefined}
                >
                  <Icon className={`h-4 w-4 ${!hasAccess ? 'opacity-50' : ''}`} />
                  <span className={!hasAccess ? 'opacity-50' : ''}>{item.name}</span>
                  {!hasAccess && <Lock className="h-3 w-3 ml-1 opacity-50" />}
                </Link>
              );
            })}
          </nav>

          {/* Tablet Navigation (Icons Only) */}
          <nav className="hidden md:flex lg:hidden items-center space-x-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = isActiveRoute(item.href);
              const hasAccess = access[item.requiredFeature];
              
              return (
                <Link
                  key={item.name}
                  href={hasAccess ? item.href : '/verification'}
                  className={`relative p-2 rounded-lg transition-colors ${
                    isActive && hasAccess
                      ? 'bg-primary text-primary-foreground'
                      : hasAccess
                        ? 'text-muted-foreground hover:text-foreground hover:bg-accent'
                        : 'text-muted-foreground/50 hover:text-muted-foreground cursor-help'
                  }`}
                  title={!hasAccess ? `${item.name} - Complete membership verification to access` : item.name}
                >
                  <Icon className={`h-5 w-5 ${!hasAccess ? 'opacity-50' : ''}`} />
                  {!hasAccess && (
                    <Lock className="absolute -top-1 -right-1 h-3 w-3 bg-background rounded-full p-0.5" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Side */}
          <div className="flex items-center space-x-3">
            {/* Search Bar (Hidden on Mobile) */}
            <div className="hidden md:block relative">
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
                    }
                  }}
                  className="pl-10 pr-4 py-2 w-64 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                />
              </div>
            </div>

            {/* Notifications */}
            <div className="relative">
              <Link
                href="/notifications"
                className="relative p-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors block"
              >
                <Bell className="h-5 w-5" />
                {/* Notification Badge */}
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </Link>
            </div>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center space-x-2 p-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors"
              >
                <div className="h-8 w-8 bg-primary rounded-full flex items-center justify-center">
                  {user.profilePhoto ? (
                    <img 
                      src={user.profilePhoto} 
                      alt={user.firstName}
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-sm font-medium text-primary-foreground">
                      {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                    </span>
                  )}
                </div>
                <ChevronDown className="h-4 w-4 hidden sm:block" />
              </button>

              {/* User Dropdown */}
              {isUserMenuOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setIsUserMenuOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-56 bg-card border border-border rounded-lg shadow-lg z-20">
                    <div className="p-4 border-b border-border">
                      <p className="text-sm font-medium text-foreground">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                      {/* Verification Status */}
                      <div className="flex items-center gap-1 mt-1">
                        {getVerificationStatusIcon()}
                        <span className="text-xs text-muted-foreground">
                          {getVerificationStatusText()}
                        </span>
                      </div>
                    </div>
                    <div className="py-2">
                      <Link
                        href={`/in/${user.username || user.id}`}
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-foreground hover:bg-accent"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <UserIcon className="h-4 w-4" />
                        <span>My Profile</span>
                      </Link>
                      <Link
                        href="/connections"
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-foreground hover:bg-accent"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <UserPlus className="h-4 w-4" />
                        <span>Connections</span>
                      </Link>
                      <Link
                        href="/settings"
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-foreground hover:bg-accent"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <Settings className="h-4 w-4" />
                        <span>Settings</span>
                      </Link>
                    </div>
                    <div className="border-t border-border py-2">
                      <button
                        onClick={handleLogout}
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-destructive hover:bg-accent w-full text-left"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Sign out</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
