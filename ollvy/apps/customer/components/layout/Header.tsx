'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Menu, X, User, LogOut, ShoppingBag, FileText, ChevronDown, Repeat, Bell, Settings, Search, ArrowLeft } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/lib/stores/auth-store'
import { getClient } from '@/lib/supabase'

interface ServiceResult {
  id: string
  name: string
  slug: string
  category_name: string
}

const navItems = [
  { href: '/', label: 'Services' },
  { href: '/orders', label: 'Orders', auth: true },
  { href: '/retainers', label: 'Retainers', auth: true },
]

export function Header() {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<ServiceResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const { user, logout, isLoading } = useAuthStore()

  // Focus search input when mobile search opens
  useEffect(() => {
    if (mobileSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [mobileSearchOpen])

  // Search for services
  useEffect(() => {
    const searchServices = async () => {
      if (searchQuery.trim().length < 2) {
        setSearchResults([])
        return
      }

      setIsSearching(true)
      try {
        const supabase = getClient()
        const { data } = await supabase
          .from('service_packages')
          .select(`
            id,
            name,
            slug,
            service_categories!inner(name)
          `)
          .eq('is_active', true)
          .ilike('name', `%${searchQuery}%`)
          .limit(10)

        if (data) {
          setSearchResults(data.map(s => ({
            id: s.id,
            name: s.name,
            slug: s.slug,
            category_name: (s.service_categories as { name: string }[] | null)?.[0]?.name || '',
          })))
        }
      } catch (error) {
        console.error('Search error:', error)
      } finally {
        setIsSearching(false)
      }
    }

    const debounce = setTimeout(searchServices, 300)
    return () => clearTimeout(debounce)
  }, [searchQuery])

  const handleSearchSelect = (slug: string) => {
    setMobileSearchOpen(false)
    setSearchQuery('')
    setSearchResults([])
    router.push(`/services/${slug}`)
  }

  const handleLogout = async () => {
    await logout()
    window.location.href = '/'
  }

  return (
    <header className="sticky top-0 z-50 w-[100vw] left-0 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <span className="text-xl font-bold tracking-tight text-foreground">ollvy</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => {
            if (item.auth && !user) return null
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'text-sm font-medium transition-colors',
                  isActive
                    ? 'text-foreground'
                    : 'text-muted-foreground hover:text-foreground/80'
                )}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
                  <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center">
                    <User className="h-4 w-4" />
                  </div>
                  <span className="max-w-[100px] truncate text-sm">
                    {user.business_name || user.phone}
                  </span>
                  <ChevronDown className="h-3 w-3 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link href="/profile" className="flex items-center gap-3">
                    <User className="h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link href="/orders" className="flex items-center gap-3">
                    <ShoppingBag className="h-4 w-4" />
                    My Orders
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link href="/retainers" className="flex items-center gap-3">
                    <Repeat className="h-4 w-4" />
                    Retainers
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link href="/compliance" className="flex items-center gap-3">
                    <FileText className="h-4 w-4" />
                    Compliance
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link href="/notifications" className="flex items-center gap-3">
                    <Bell className="h-4 w-4" />
                    Notifications
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link href="/settings" className="flex items-center gap-3">
                    <Settings className="h-4 w-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="cursor-pointer"
                >
                  <LogOut className="h-4 w-4 mr-3" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/login">
              <Button size="sm">Sign in</Button>
            </Link>
          )}
        </div>

        {/* Mobile Actions */}
        <div className="flex items-center gap-1 md:hidden">
          {/* Mobile Search Button */}
          <Button
            variant="ghost"
            size="icon-sm"
            className="text-muted-foreground"
            onClick={() => setMobileSearchOpen(true)}
          >
            <Search className="h-5 w-5" />
          </Button>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon-sm"
            className="text-muted-foreground"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-xl">
          <nav className="container py-6 space-y-1">
            {navItems.map((item) => {
              if (item.auth && !user) return null
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    'block py-3 px-4 rounded-xl text-base font-medium transition-colors',
                    isActive
                      ? 'bg-muted text-foreground'
                      : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                  )}
                >
                  {item.label}
                </Link>
              )
            })}
            <div className="pt-4 mt-4 border-t border-border">
              {user ? (
                <>
                  <Link
                    href="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-3 px-4 rounded-xl text-base font-medium text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                  >
                    Profile
                  </Link>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false)
                      handleLogout()
                    }}
                    className="w-full text-left py-3 px-4 rounded-xl text-base font-medium text-muted-foreground/70 hover:bg-muted/50 hover:text-muted-foreground"
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block"
                >
                  <Button className="w-full">Sign in</Button>
                </Link>
              )}
            </div>
          </nav>
        </div>
      )}

      {/* Mobile Full-Screen Search */}
      {mobileSearchOpen && (
        <div className="fixed inset-0 z-[100] bg-background md:hidden">
          {/* Search Header */}
          <div className="flex items-center gap-3 px-4 h-16 border-b border-border">
            <Button
              variant="ghost"
              size="icon-sm"
              className="text-muted-foreground shrink-0"
              onClick={() => {
                setMobileSearchOpen(false)
                setSearchQuery('')
                setSearchResults([])
              }}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                ref={searchInputRef}
                type="text"
                placeholder="Search services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-10 bg-muted/50 border-0 focus-visible:ring-1"
              />
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery('')
                    setSearchResults([])
                    searchInputRef.current?.focus()
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  <X className="h-4 w-4 text-muted-foreground" />
                </button>
              )}
            </div>
          </div>

          {/* Search Results */}
          <div className="overflow-y-auto h-[calc(100vh-4rem)]">
            {searchQuery.trim().length < 2 ? (
              <div className="p-6 text-center">
                <Search className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-muted-foreground text-sm">
                  Search for services like GST, Company Registration, Trademark...
                </p>
              </div>
            ) : isSearching ? (
              <div className="p-6 text-center">
                <div className="w-6 h-6 border-2 border-muted-foreground/30 border-t-foreground rounded-full animate-spin mx-auto mb-3" />
                <p className="text-muted-foreground text-sm">Searching...</p>
              </div>
            ) : searchResults.length === 0 ? (
              <div className="p-6 text-center">
                <p className="text-muted-foreground text-sm">
                  No services found for "{searchQuery}"
                </p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {searchResults.map((result) => (
                  <button
                    key={result.id}
                    onClick={() => handleSearchSelect(result.slug)}
                    className="w-full flex items-center gap-4 px-4 py-4 text-left hover:bg-muted/50 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate">
                        {result.name}
                      </p>
                      <p className="text-sm text-muted-foreground truncate">
                        {result.category_name}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
