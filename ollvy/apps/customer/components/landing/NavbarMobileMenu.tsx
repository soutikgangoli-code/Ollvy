'use client'

import Link from 'next/link'
import { Calculator, FileText, User, LogOut, ShoppingBag } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from '@/components/ui/sheet'
import type { NavbarServiceData } from '@/lib/data/services'

interface NavbarMobileMenuProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: { avatar_url?: string | null; business_name?: string | null; phone?: string | null; email?: string | null } | null
  onLogout: () => void
  onSignIn: () => void
  navLinks: { href: string; label: string }[]
  scrollToSection: (href: string) => void
}

export default function NavbarMobileMenu({
  open,
  onOpenChange,
  user,
  onLogout,
  onSignIn,
  navLinks,
  scrollToSection,
}: NavbarMobileMenuProps) {
  const close = () => onOpenChange(false)

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
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
                  close()
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
                onClick={close}
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
                onClick={close}
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
                onClick={close}
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted transition-colors group"
              >
                {user.avatar_url ? (
                  <img
                    src={user.avatar_url}
                    alt={user.business_name || user.email || 'User avatar'}
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
                onClick={close}
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
                  close()
                  onLogout()
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
                close()
                onSignIn()
              }}
              className="text-center font-mono text-xs text-muted-foreground hover:text-foreground transition-colors py-2"
            >
              Already have an account? <span className="text-foreground font-medium">Sign in</span>
            </button>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
