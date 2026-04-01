'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Menu, ChevronDown, Calculator, FileText, Search, ArrowRight, User, LogOut, ShoppingBag, Repeat, X } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from '@/components/ui/sheet'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { useAuthStore } from '@/lib/stores/auth-store'
import type { NavbarServiceData } from '@/lib/data/services'

interface NavbarProps {
  services?: NavbarServiceData[]
}

const navLinks = [
  { href: '/services', label: 'Services', sectionId: null },
  { href: '/guides', label: 'Guides', sectionId: null },
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

export function Navbar({ services: prefetchedServices = [] }: NavbarProps) {
  const router = useRouter()
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

  // Filter services based on search query
  const filteredServices = useMemo(() => {
    if (!searchQuery.trim()) return services
    const query = searchQuery.toLowerCase()
    return services.filter(
      (service) =>
        service.name.toLowerCase().includes(query) ||
        service.short_description?.toLowerCase().includes(query)
    )
  }, [searchQuery, services])

  // Handle keyboard shortcut (Cmd/Ctrl + K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
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
    const handleScroll = () => {
      setScrolled(window.scrollY > 8)
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
        'fixed top-0 left-0 z-50 w-[100vw] transition-all duration-200 bg-background/80 backdrop-blur-xl',
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
          <nav className="hidden md:flex items-center gap-10">
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
        </nav>
        </div>

        {/* Theme Toggle + Desktop Search Button + Profile */}
        <div className="hidden md:flex items-center gap-2">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
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
                      alt=""
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
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 rounded-md text-foreground hover:bg-muted active:bg-muted/80 transition-colors focus:outline-none shrink-0"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Open menu</span>
          </button>
        </div>

        {/* Mobile Sheet */}
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetContent side="right" className="w-full max-w-[320px] p-0 flex flex-col">
            <SheetHeader className="p-6 pb-4">
              <SheetTitle className="text-left font-mono text-xl font-bold tracking-tight">
                Ollvy
              </SheetTitle>
            </SheetHeader>

            <nav className="flex-1 px-4">
              {/* Main Nav */}
              <div className="space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => {
                      setMobileMenuOpen(false)
                      if (link.href.startsWith('/#')) {
                        setTimeout(() => scrollToSection(link.href), 100)
                      }
                    }}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg font-mono text-sm uppercase tracking-wide text-foreground hover:bg-muted transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              {/* Tools Section */}
              <div className="mt-6">
                <p className="px-4 text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-2">Tools</p>
                <div className="space-y-1">
                  <Link
                    href="/tools/documents/private-limited-company"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted transition-colors group"
                  >
                    <div className="w-8 h-8 rounded-md bg-muted flex items-center justify-center group-hover:bg-background transition-colors">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-mono text-sm text-foreground">Document Checklist</p>
                      <p className="font-mono text-[10px] text-muted-foreground">What you need to register</p>
                    </div>
                  </Link>
                  <Link
                    href="/tools/penalty-calculator/gst-late-filing"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted transition-colors group"
                  >
                    <div className="w-8 h-8 rounded-md bg-muted flex items-center justify-center group-hover:bg-background transition-colors">
                      <Calculator className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-mono text-sm text-foreground">Penalty Calculator</p>
                      <p className="font-mono text-[10px] text-muted-foreground">Calculate compliance penalties</p>
                    </div>
                  </Link>
                </div>
              </div>
            </nav>

            <SheetFooter className="p-4 border-t border-border mt-auto flex flex-col gap-3">
              {user ? (
                <div className="space-y-1 pt-2">
                  <Link
                    href="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted transition-colors group"
                  >
                    {user.avatar_url ? (
                      <img
                        src={user.avatar_url}
                        alt=""
                        className="w-8 h-8 rounded-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center group-hover:bg-background transition-colors">
                        <User className="h-4 w-4 text-muted-foreground" />
                      </div>
                    )}
                    <div>
                      <p className="font-mono text-sm text-foreground">Profile</p>
                      <p className="font-mono text-[10px] text-muted-foreground truncate max-w-[180px]">
                        {user.business_name || user.phone || user.email}
                      </p>
                    </div>
                  </Link>
                  <Link
                    href="/orders"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted transition-colors group"
                  >
                    <div className="w-8 h-8 rounded-md bg-muted flex items-center justify-center group-hover:bg-background transition-colors">
                      <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <p className="font-mono text-sm text-foreground">My Orders</p>
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false)
                      handleLogout()
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted transition-colors text-left"
                  >
                    <div className="w-8 h-8 rounded-md bg-muted flex items-center justify-center">
                      <LogOut className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <p className="font-mono text-sm text-muted-foreground">Sign out</p>
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false)
                    openAuthModal()
                  }}
                  className="text-center font-mono text-xs text-muted-foreground hover:text-foreground transition-colors py-2"
                >
                  Already have an account? <span className="text-foreground font-medium">Sign in</span>
                </button>
              )}
            </SheetFooter>
          </SheetContent>
        </Sheet>

        {/* Search Dialog */}
        <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
          <DialogContent className="max-w-lg p-0 gap-0 overflow-hidden">
            <DialogHeader className="px-4 py-3 border-b">
              <DialogTitle className="sr-only">Search Services</DialogTitle>
              <div className="relative">
                <Search className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search GST, incorporation, ITR..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-7 border-0 shadow-none focus-visible:ring-0 text-base"
                  autoFocus
                />
              </div>
            </DialogHeader>
            <div className="max-h-[60vh] overflow-y-auto">
              {filteredServices.length === 0 ? (
                <div className="px-4 py-8 text-center text-muted-foreground">
                  {searchQuery ? `No services found for "${searchQuery}"` : 'No active services found'}
                </div>
              ) : (
                <div className="py-2">
                  <div className="px-4 py-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    {searchQuery ? `${filteredServices.length} results` : `${filteredServices.length} Services`}
                  </div>
                  {filteredServices.map((service) => (
                    <button
                      key={service.slug}
                      onClick={() => handleServiceClick(service.slug)}
                      className="w-full px-4 py-3 flex items-center justify-between hover:bg-muted/50 transition-colors text-left group"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-foreground truncate">
                          {service.name}
                        </div>
                        <div className="text-sm text-muted-foreground truncate">
                          {service.short_description}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-3">
                        <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                          {service.order_type === 'recurring' ? 'Monthly' : 'One-time'}
                        </span>
                        <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="px-4 py-2 border-t bg-muted/30 flex items-center justify-between text-xs text-muted-foreground">
              <span>Press Enter to select</span>
              <span>ESC to close</span>
            </div>
          </DialogContent>
        </Dialog>

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
