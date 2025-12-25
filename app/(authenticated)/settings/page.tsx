'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/hooks/useAuth'
import { 
  User, 
  Shield, 
  AtSign, 
  Bell, 
  ChevronRight,
  Settings as SettingsIcon,
  Lock,
  Monitor,
  CheckCircle2
} from 'lucide-react'
import Link from 'next/link'

export default function SettingsPage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, router])

  const settingsSections = [
    {
      title: 'Profile Settings',
      description: 'Edit your professional profile and information',
      icon: User,
      href: '/me/edit',
      color: 'text-blue-600 bg-blue-100'
    },
    {
      title: 'Verification Status',
      description: 'View your membership verification status and progress',
      icon: CheckCircle2,
      href: '/verification',
      color: 'text-emerald-600 bg-emerald-100'
    },
    {
      title: 'Privacy Settings',
      description: 'Control who can see your profile and information',
      icon: Shield,
      href: '/settings/privacy',
      color: 'text-green-600 bg-green-100'
    },
    {
      title: 'Username',
      description: 'Set or change your custom username',
      icon: AtSign,
      href: '/settings/username',
      color: 'text-purple-600 bg-purple-100'
    },
    {
      title: 'Account Settings',
      description: 'Manage your account, email, and security',
      icon: User,
      href: '/settings/account',
      color: 'text-orange-600 bg-orange-100'
    },
    {
      title: 'Notifications',
      description: 'Manage your notification preferences',
      icon: Bell,
      href: '/settings/notifications',
      color: 'text-pink-600 bg-pink-100',
      comingSoon: true
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-primary/10 rounded-full">
            <SettingsIcon className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Settings</h1>
            <p className="text-muted-foreground">Manage your account and preferences</p>
          </div>
        </div>

        {/* Settings Grid */}
        <div className="grid gap-4">
          {settingsSections.map((section) => {
            const Icon = section.icon
            
            if (section.comingSoon) {
              return (
                <div
                  key={section.href}
                  className="bg-card border border-border rounded-lg p-6 opacity-60 cursor-not-allowed"
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-lg ${section.color}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h2 className="text-lg font-semibold text-foreground">{section.title}</h2>
                        <span className="px-2 py-0.5 bg-accent text-accent-foreground text-xs rounded-full">
                          Coming Soon
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{section.description}</p>
                    </div>
                  </div>
                </div>
              )
            }

            return (
              <Link
                key={section.href}
                href={section.href}
                className="bg-card border border-border rounded-lg p-6 hover:bg-accent transition-colors group"
              >
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-lg ${section.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                      {section.title}
                    </h2>
                    <p className="text-sm text-muted-foreground">{section.description}</p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              </Link>
            )
          })}
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-card border border-border rounded-lg p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <Link
                href={user?.username ? `/in/${user.username}` : '#'}
                className="block text-primary hover:underline text-sm"
              >
                View My Profile
              </Link>
              <Link
                href="/me/share"
                className="block text-primary hover:underline text-sm"
              >
                Share My Profile
              </Link>
              <Link
                href="/me/edit"
                className="block text-primary hover:underline text-sm"
              >
                Edit Profile
              </Link>
            </div>
            <div className="space-y-3">
              <Link
                href="/settings/password"
                className="flex items-center gap-2 text-primary hover:underline text-sm"
              >
                <Lock className="h-4 w-4" />
                Change Password
              </Link>
              <Link
                href="/settings/sessions"
                className="flex items-center gap-2 text-primary hover:underline text-sm"
              >
                <Monitor className="h-4 w-4" />
                Manage Sessions
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
