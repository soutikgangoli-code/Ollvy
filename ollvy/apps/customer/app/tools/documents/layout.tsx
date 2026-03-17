'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { cn } from '@/lib/utils'

const documentTabs = [
  { href: '/tools/documents/private-limited-company', label: 'Pvt Ltd' },
  { href: '/tools/documents/llp', label: 'LLP' },
  { href: '/tools/documents/partnership', label: 'Partnership' },
  { href: '/tools/documents/sole-proprietor', label: 'Sole Prop' },
  { href: '/tools/documents/gst-registration', label: 'GST Registration' },
  { href: '/tools/documents/individual-itr', label: 'Personal ITR' },
  { href: '/tools/documents/business-itr', label: 'Business ITR' },
  { href: '/tools/documents/trademark', label: 'Trademark' },
]

export default function DocumentsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  // Don't show tabs on the index page
  if (pathname === '/tools/documents') {
    return <>{children}</>
  }

  return (
    <div className="py-24">
      <div className="container max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3">
            DOCUMENT CHECKLIST
          </p>
          <h1 className="text-3xl md:text-4xl font-semibold text-foreground">
            What Documents Do You Need?
          </h1>
          <p className="text-lg text-muted-foreground mt-4 max-w-2xl mx-auto">
            Complete checklist with explanations. Click on any document to learn more.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8 border-b border-border pb-4">
          {documentTabs.map((tab) => (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                'px-3 py-1.5 rounded-full text-sm font-medium transition-all',
                pathname === tab.href
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground'
              )}
            >
              {tab.label}
            </Link>
          ))}
        </div>

        {/* Content */}
        {children}
      </div>
    </div>
  )
}
