'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuthStore } from '@/lib/stores/auth-store'
import { getPhoneLink, SUPPORT_PHONE } from '@/lib/constants'
import {
  Settings,
  User,
  Bell,
  Shield,
  HelpCircle,
  LogOut,
  ChevronRight,
  ExternalLink,
  Phone,
  Mail,
} from 'lucide-react'

export default function SettingsPage() {
  const router = useRouter()
  const { user, logout } = useAuthStore()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    setIsLoggingOut(true)
    await logout()
    router.push('/')
  }

  const settingsSections = [
    {
      title: 'Account',
      items: [
        {
          icon: User,
          label: 'Profile',
          description: 'Manage your business details',
          href: '/profile',
        },
        {
          icon: Bell,
          label: 'Notifications',
          description: 'Configure notification preferences',
          href: '/notifications',
        },
      ],
    },
    {
      title: 'Support',
      items: [
        {
          icon: HelpCircle,
          label: 'Help Center',
          description: 'FAQs and guides',
          href: '#',
          external: true,
        },
        {
          icon: Phone,
          label: 'Contact Support',
          description: 'Get help from our team',
          href: getPhoneLink(),
          external: true,
        },
        {
          icon: Mail,
          label: 'Email Support',
          description: 'support@ollvy.com',
          href: 'mailto:support@ollvy.com',
          external: true,
        },
      ],
    },
    {
      title: 'Legal',
      items: [
        {
          icon: Shield,
          label: 'Privacy Policy',
          description: 'How we handle your data',
          href: '/privacy',
          external: true,
        },
        {
          icon: Shield,
          label: 'Terms of Service',
          description: 'Our terms and conditions',
          href: '/terms',
          external: true,
        },
      ],
    },
  ]

  return (
    <div className="container py-12 max-w-2xl">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
          <Settings className="h-5 w-5 text-white/60" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold text-white">Settings</h1>
          <p className="text-sm text-white/40">Manage your account and preferences</p>
        </div>
      </div>

      {/* User Info Card */}
      {user && (
        <Card className="mb-8 border-white/10 bg-white/[0.02]">
          <CardContent className="p-5">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center text-white text-xl font-medium">
                {user.business_name?.charAt(0) || user.phone?.slice(-2)}
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-white">
                  {user.business_name || 'Your Business'}
                </h3>
                <p className="text-sm text-white/40">+91 {user.phone}</p>
              </div>
              <Link href="/profile">
                <Button variant="outline" size="sm">
                  Edit
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Settings Sections */}
      <div className="space-y-6">
        {settingsSections.map((section) => (
          <Card key={section.title} className="border-white/10 bg-white/[0.02]">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-white/40 font-medium">
                {section.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon
                const isExternal = 'external' in item && item.external

                const content = (
                  <div className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer">
                    <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
                      <Icon className="h-5 w-5 text-white/50" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-white">{item.label}</p>
                      <p className="text-sm text-white/40 truncate">
                        {item.description}
                      </p>
                    </div>
                    {isExternal ? (
                      <ExternalLink className="h-4 w-4 text-white/30" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-white/30" />
                    )}
                  </div>
                )

                if (isExternal) {
                  return (
                    <a
                      key={item.label}
                      href={item.href}
                      target={item.href.startsWith('http') ? '_blank' : undefined}
                      rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    >
                      {content}
                    </a>
                  )
                }

                return (
                  <Link key={item.label} href={item.href}>
                    {content}
                  </Link>
                )
              })}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Logout */}
      <Card className="mt-8 border-white/10 bg-white/[0.02]">
        <CardContent className="p-3">
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="w-full flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors"
          >
            <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
              {isLoggingOut ? (
                <div className="w-5 h-5 border-2 border-white/20 border-t-white/50 rounded-full animate-spin" />
              ) : (
                <LogOut className="h-5 w-5 text-white/50" />
              )}
            </div>
            <div className="flex-1 text-left">
              <p className="font-medium text-white/70">Sign Out</p>
              <p className="text-sm text-white/30">Log out of your account</p>
            </div>
          </button>
        </CardContent>
      </Card>

      {/* App Version */}
      <div className="mt-8 text-center text-sm text-white/20">
        Ollvy v1.0.0
      </div>
    </div>
  )
}
