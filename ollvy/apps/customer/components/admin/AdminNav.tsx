'use client'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { getClient } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface AdminNavProps {
  adminName: string
  isSuperAdmin: boolean
}

const NAV_LINKS = [
  { label: 'Queue', href: '/admin/queue' },
  { label: 'Orders', href: '/admin/orders' },
  { label: 'Users', href: '/admin/users' },
  { label: 'Analytics', href: '/admin/analytics' },
  { label: 'Reports', href: '/admin/reports' },
]

const SUPER_ADMIN_LINKS = [
  { label: 'Chats', href: '/admin/chats' },
  { label: 'Team', href: '/admin/team' },
]

export function AdminNav({ adminName, isSuperAdmin }: AdminNavProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')

  const handleLogout = async () => {
    const supabase = getClient()
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/admin/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  const links = isSuperAdmin
    ? [...NAV_LINKS, ...SUPER_ADMIN_LINKS]
    : NAV_LINKS

  return (
    <nav className="bg-background border-b border-border px-4 h-14 flex items-center justify-between">
      <div className="flex items-center gap-8">
        <Link href="/admin/queue" className="font-semibold text-sm text-foreground">
          Ollvy Admin
        </Link>
        <div className="flex items-center gap-1">
          {links.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={[
                'px-3 py-1.5 rounded text-sm transition-colors',
                pathname.startsWith(link.href)
                  ? 'bg-muted text-foreground font-medium'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50',
              ].join(' ')}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-4">
        <form onSubmit={handleSearch} className="flex items-center">
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search orders, users..."
            className="h-8 w-48 text-sm"
          />
        </form>
        <span className="text-sm text-muted-foreground">{adminName}</span>
        <Button variant="outline" size="sm" onClick={handleLogout}>
          Log out
        </Button>
      </div>
    </nav>
  )
}
