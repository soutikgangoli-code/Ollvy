'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { useRouter, usePathname } from 'next/navigation'
import { Menu, ChevronDown, Calculator, FileText, Search, ArrowRight, User, LogOut, ShoppingBag, Repeat, X } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { useAuthStore } from '@/lib/stores/auth-store'
import type { NavbarServiceData } from '@/lib/data/services'
import { fuzzyMatchAny } from '@/lib/fuzzy-match'

// Heavy overlay components - lazy loaded, not needed for initial paint (LCP fix)
const NavbarMobileMenu = dynamic(() => import('./NavbarMobileMenu'), { ssr: false })
const NavbarSearchDialog = dynamic(() => import('./NavbarSearchDialog'), { ssr: false })

interface NavbarProps {
  services?: NavbarServiceData[]
  minimal?: boolean
}

const navLinks = [
  { href: '/services', label: 'Services', sectionId: null },
  { href: '/guides', label: 'Guides', sectionId: null },
  { href: '/about', label: 'About', sectionId: null },
]

// Popular services for crawler-friendly static links (always in DOM)
// IMPORTANT: These must match actual database slugs to avoid 404s
const popularServiceLinks = [
  { href: '/services/pvt-ltd-incorporation', label: 'Private Limited Company Registration' },
  { href: '/services/gst-registration', label: 'GST Registration' },
  { href: '/services/trademark-registration', label: 'Trademark Registration' },
  { href: '/services/llp-incorporation', label: 'LLP Registration' },
  { href: '/services/msme-registration', label: 'MSME Udyam Registration' },
  { href: '/services/business-itr', label: 'Business ITR Filing' },
  { href: '/services/gst-monthly', label: 'GST Monthly Filing' },
  { href: '/services/cloud-kitchen-setup', label: 'Cloud Kitchen Setup' },
]

const toolsItems = [
  {
    href: '/tools/documents/private-limited-company',
    label: 'Document Checklist',
    description: 'What documents you need for registration',
    icon: 'FileText',
  },
  {
    href: '/tools/penalty-calculator/gst-late-filing',
    label: 'Penalty Calculator',
    description: 'Calculate compliance penalties',
    icon: 'Calculator',
  },
]

function useActiveSection(sectionIds: (string | null)[]) {
  const [activeSection, setActiveSection] = useState<string | null>(null)

  useEffect(() => {
    const validIds = sectionIds.filter((id): id is string => id !== null)
    if (validIds.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      },
      { threshold: 0.3, rootMargin: '-80px 0px -50% 0px' }
    )

    validIds.forEach((id) => {
      const element = document.getElementById(id)
      if (element) observer.observe(element)
    })

    return () => observer.disconnect()
  }, [sectionIds])

  return activeSection
}

// Checkout/questionnaire flows: hide nav links + footer, keep logo/search/theme
const MINIMAL_PATTERNS = ['/checkout/', '/questionnaire']

export function Navbar({ services: prefetchedServices = [], minimal: minimalProp }: NavbarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const minimal = minimalProp ?? MINIMAL_PATTERNS.some(p => pathname.includes(p))
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  // Use pre-fetched services from server (no client-side Supabase fetch needed)
  const services = prefetchedServices
  const activeSection = useActiveSection(navLinks.map((l) => l.sectionId))
  const { user, openAuthModal, logout } = useAuthStore()

  const handleLogout = async () => {
    await logout()
    window.location.href = '/'
  }

  // Filter services for mobile inline search
  const filteredServices = useMemo(() => {
    if (!searchQuery.trim()) return services
    return services.filter((service) => fuzzyMatchAny(searchQuery, [service.name, service.short_description]))
  }, [searchQuery, services])

  // Track if heavy overlays have been requested (lazy load on first interaction)
  const [menuLoaded, setMenuLoaded] = useState(false)
  const [searchLoaded, setSearchLoaded] = useState(false)

  // Handle keyboard shortcut (Cmd/Ctrl + K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setSearchLoaded(true)
        setSearchOpen(true)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const handleServiceClick = (slug: string) => {
    setSearchOpen(false)
    setMobileSearchOpen(false)
    setSearchQuery('')
    router.push(`/services/${slug}`)
  }

  useEffect(() => {
    let ticking = false
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setScrolled(window.scrollY > 24)
          ticking = false
        })
        ticking = true
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (href: string) => {
    if (href.startsWith('/#')) {
      const id = href.replace('/#', '')
      const element = document.getElementById(id)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      } else {
        // Element not on current page, navigate to homepage with hash
        router.push(href)
      }
    }
  }

  return (
    <>
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 w-full transition-[height] duration-200 bg-background/80 backdrop-blur-xl',
        'transform-gpu will-change-transform',
        scrolled ? 'h-[52px] border-b border-border' : 'h-16'
      )}
    >
      <div className="container h-full flex items-center justify-between">
        {/* Left side: Logo + Nav */}
        <div className="flex items-center gap-16">
          {/* Logo */}
          <Link href="/" className="font-mono text-xl font-bold text-foreground tracking-tight">
            Ollvy
          </Link>

          {/* Desktop Nav */}
          {!minimal && <nav className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => {
            const isActive = link.sectionId && activeSection === link.sectionId
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={(e) => {
                  if (link.href.startsWith('/#')) {
                    e.preventDefault()
                    scrollToSection(link.href)
                  }
                }}
                className={cn(
                  'text-sm font-medium transition-colors duration-150',
                  isActive
                    ? 'text-foreground font-semibold'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {link.label}
              </Link>
            )
          })}

          {/* Tools Dropdown */}
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-150 outline-none">
              <span>Tools</span>
              <ChevronDown className="h-4 w-4 transition-transform duration-200 data-[state=open]:rotate-180" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuItem asChild>
                <Link href="/tools/documents/private-limited-company" className="cursor-pointer flex items-center gap-3 py-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="font-medium">Document Checklist</div>
                    <div className="text-xs text-muted-foreground">What you need to register</div>
                  </div>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/tools/penalty-calculator/gst-late-filing" className="cursor-pointer flex items-center gap-3 py-2">
                  <Calculator className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="font-medium">Penalty Calculator</div>
                    <div className="text-xs text-muted-foreground">Calculate compliance penalties</div>
                  </div>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>}
        </div>

        {/* Theme Toggle + Desktop Search Button + Profile */}
        <div className="hidden md:flex items-center gap-2">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => { setSearchLoaded(true); setSearchOpen(true) }}
            className="flex items-center gap-2 h-9 pl-3 pr-2 rounded-lg border border-border/60 bg-card hover:border-border hover:bg-muted/30 transition-all text-sm text-muted-foreground"
          >
            <Search className="h-4 w-4" />
            <span className="text-muted-foreground">Search Services</span>
            <kbd className="hidden lg:inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-muted/60 border border-border/50 font-mono text-[10px] text-muted-foreground">
              <span className="text-xs">⌘</span>K
            </kbd>
          </button>

          {user ? (
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground rounded-full">
                  {user.avatar_url ? (
                    <img
                      src={user.avatar_url}
                      alt={user.business_name || user.email || 'User avatar'}
                      className="w-7 h-7 rounded-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center">
                      <User className="h-4 w-4" />
                    </div>
                  )}
                  <span className="max-w-[100px] truncate text-sm">
                    {user.business_name?.split(' ')[0] || user.phone || user.email?.split('@')[0]}
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
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="cursor-pointer text-muted-foreground"
                >
                  <LogOut className="h-4 w-4 mr-3" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <button
              onClick={() => openAuthModal()}
              className="px-3 py-1.5 text-xs font-medium rounded bg-muted/50 text-muted-foreground border border-border hover:bg-muted hover:text-foreground transition-colors"
            >
              Sign in
            </button>
          )}
        </div>

        {/* Mobile Search + Theme + Menu Buttons */}
        <div className="flex items-center gap-1 md:hidden">
          {mobileSearchOpen ? (
            <>
              {/* Expanded search input - expands from right to left */}
              <div className="flex-1 relative origin-right animate-[expandLeft_200ms_ease-out_forwards]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search services..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-9 pl-9 pr-9 rounded-full bg-muted border-0 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => {
                    setMobileSearchOpen(false)
                    setSearchQuery('')
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 focus:outline-none"
                >
                  <X className="h-4 w-4 text-muted-foreground" />
                </button>
              </div>
            </>
          ) : (
            <>
              <ThemeToggle />
              <button
                type="button"
                onClick={() => setMobileSearchOpen(true)}
                className="p-2 rounded-md text-foreground hover:bg-muted active:bg-muted/80 transition-colors focus:outline-none"
              >
                <Search className="h-5 w-5" />
                <span className="sr-only">Search</span>
              </button>
            </>
          )}
          {!minimal && (
            <button
              type="button"
              onClick={() => { setMenuLoaded(true); setMobileMenuOpen(true) }}
              className="p-2 rounded-md text-foreground hover:bg-muted active:bg-muted/80 transition-colors focus:outline-none shrink-0"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Open menu</span>
            </button>
          )}
        </div>

        {/* Mobile Sheet - lazy loaded on first interaction */}
        {!minimal && menuLoaded && (
          <NavbarMobileMenu
            open={mobileMenuOpen}
            onOpenChange={setMobileMenuOpen}
            user={user}
            onLogout={handleLogout}
            onSignIn={() => openAuthModal()}
            navLinks={navLinks}
            scrollToSection={scrollToSection}
          />
        )}

        {/* Search Dialog - lazy loaded on first interaction */}
        {searchLoaded && (
          <NavbarSearchDialog
            open={searchOpen}
            onOpenChange={setSearchOpen}
            services={services}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onServiceClick={handleServiceClick}
          />
        )}

      </div>
    </header>

      {/* Mobile Search Results - Appears below header */}
      {mobileSearchOpen && (
        <div
          className={cn(
            "fixed inset-x-0 bottom-0 z-[100] md:hidden",
            scrolled ? "top-[52px]" : "top-16"
          )}
        >
          {/* Solid background */}
          <div className="absolute inset-0 bg-card" />

          {/* Content container */}
          <div className="relative h-full flex flex-col">

          {/* Search Results */}
          <div className="relative flex-1 overflow-y-auto bg-card">
            {filteredServices.length === 0 ? (
              <div className="px-4 py-12 text-center">
                <Search className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-muted-foreground">
                  {searchQuery ? `No services found for "${searchQuery}"` : 'No active services found'}
                </p>
              </div>
            ) : (
              <div className="py-2">
                <div className="px-4 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {searchQuery ? `${filteredServices.length} results` : `${filteredServices.length} Services`}
                </div>
                {filteredServices.map((service) => (
                  <button
                    key={service.slug}
                    onClick={() => handleServiceClick(service.slug)}
                    className="w-full px-4 py-4 flex items-center gap-3 active:bg-muted text-left border-b border-border/50 bg-card"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-foreground">
                        {service.name}
                      </div>
                      <div className="text-sm text-muted-foreground line-clamp-1">
                        {service.short_description}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full whitespace-nowrap">
                        {service.order_type === 'recurring' ? 'Monthly' : 'One-time'}
                      </span>
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
          </div>
        </div>
      )}

      {/* Custom keyframe for search bar expansion from right to left */}
      <style jsx global>{`
        @keyframes expandLeft {
          from {
            transform: scaleX(0);
            opacity: 0;
          }
          to {
            transform: scaleX(1);
            opacity: 1;
          }
        }
      `}</style>

      {/* Crawler-friendly service links (sr-only but in DOM for SEO) */}
      <nav aria-label="Popular services" className="sr-only">
        {popularServiceLinks.map((link) => (
          <Link key={link.href} href={link.href}>
            {link.label}
          </Link>
        ))}
      </nav>
    </>
  )
}
