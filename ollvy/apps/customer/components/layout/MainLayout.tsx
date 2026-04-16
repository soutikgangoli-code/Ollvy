'use client'

import { usePathname } from 'next/navigation'
import { Navbar } from '@/components/landing/Navbar'
import { Footer } from '@/components/landing/Footer'

// Checkout/questionnaire flows: hide nav links + footer, keep logo/search/theme
const MINIMAL_PATTERNS = ['/checkout/', '/questionnaire']

interface MainLayoutProps {
  children: React.ReactNode
}

/**
 * @deprecated Use MainLayoutClient with navbar prop instead.
 * Kept for backwards compatibility with any remaining imports.
 */
export function MainLayout({ children }: MainLayoutProps) {
  const pathname = usePathname()
  const isMinimal = MINIMAL_PATTERNS.some(p => pathname.includes(p))

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar minimal={isMinimal} />
      <main className="flex-1 pt-16">{children}</main>
      {!isMinimal && <Footer />}
    </div>
  )
}

interface MainLayoutClientProps {
  children: React.ReactNode
  navbar: React.ReactNode
}

export function MainLayoutClient({ children, navbar }: MainLayoutClientProps) {
  const pathname = usePathname()
  const isMinimal = MINIMAL_PATTERNS.some(p => pathname.includes(p))

  return (
    <div className="flex min-h-screen flex-col">
      {navbar}
      <main className="flex-1 pt-16">{children}</main>
      {!isMinimal && <Footer />}
    </div>
  )
}
