'use client'

import { usePathname } from 'next/navigation'
import { Navbar } from '@/components/landing/Navbar'
import { Footer } from '@/components/landing/Footer'

// Hide footer on focused conversion flows
const NO_FOOTER_PATTERNS = ['/checkout/', '/questionnaire']

interface MainLayoutProps {
  children: React.ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  const pathname = usePathname()
  const hideFooter = NO_FOOTER_PATTERNS.some(p => pathname.includes(p))

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 pt-16">{children}</main>
      {!hideFooter && <Footer />}
    </div>
  )
}
