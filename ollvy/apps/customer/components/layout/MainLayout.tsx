'use client'

import { usePathname } from 'next/navigation'
import { Navbar } from '@/components/landing/Navbar'
import { Footer } from '@/components/landing/Footer'

// Focused conversion flows: logo-only navbar, no footer
const MINIMAL_PATTERNS = ['/checkout/', '/questionnaire']

interface MainLayoutProps {
  children: React.ReactNode
}

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
