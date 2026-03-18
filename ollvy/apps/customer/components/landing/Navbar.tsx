'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Menu, ChevronDown, Calculator, FileText, Search, ArrowRight, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
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
import { cn } from '@/lib/utils'
import { getClient } from '@/lib/supabase'
import type { ServicePackage } from '@/lib/types'
import { ThemeToggle } from '@/components/ui/theme-toggle'

const navLinks = [
  { href: '/services', label: 'Services', sectionId: null },
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

export function Navbar() {
  const router = useRouter()
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [services, setServices] = useState<ServicePackage[]>([])
  const [isLoadingServices, setIsLoadingServices] = useState(false)
  const activeSection = useActiveSection(navLinks.map((l) => l.sectionId))

  // Fetch active services from Supabase
  const fetchServices = useCallback(async () => {
    setIsLoadingServices(true)
    try {
      const supabase = getClient()
      const { data, error } = await supabase
        .from('service_packages')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true })

      if (error) {
        console.error('Error fetching services:', error)
        return
      }

      setServices(data || [])
    } catch (err) {
      console.error('Failed to fetch services:', err)
    } finally {
      setIsLoadingServices(false)
    }
  }, [])

  // Fetch services when search dialog opens
  useEffect(() => {
    if (searchOpen && services.length === 0) {
      fetchServices()
    }
  }, [searchOpen, services.length, fetchServices])

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

        {/* Theme Toggle + Desktop Search Button */}
        <div className="hidden md:flex items-center gap-2">
          <ThemeToggle />
          <Button
            size="sm"
            variant="outline"
            className="rounded-full gap-2 pl-3 pr-2"
            onClick={() => setSearchOpen(true)}
          >
            <Search className="h-4 w-4" />
            <span>Search Services</span>
            <kbd className="hidden lg:inline-flex h-5 items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
              <span className="text-xs">⌘</span>K
            </kbd>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setMobileMenuOpen(true)}
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Open menu</span>
        </Button>

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
              <div className="flex items-center justify-between px-2 py-1">
                <span className="font-mono text-xs uppercase tracking-wide text-muted-foreground">Theme</span>
                <ThemeToggle />
              </div>
              <Button
                variant="outline"
                className="w-full gap-2 rounded-full font-mono text-sm"
                onClick={() => {
                  setMobileMenuOpen(false)
                  setSearchOpen(true)
                }}
              >
                <Search className="h-4 w-4" />
                Search Services
              </Button>
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="text-center font-mono text-xs text-muted-foreground hover:text-foreground transition-colors py-2"
              >
                Already have an account? <span className="text-foreground font-medium">Sign in</span>
              </Link>
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
              {isLoadingServices ? (
                <div className="px-4 py-8 flex items-center justify-center text-muted-foreground">
                  <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  Loading services...
                </div>
              ) : filteredServices.length === 0 ? (
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
  )
}
