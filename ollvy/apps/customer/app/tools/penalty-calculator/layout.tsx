'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import Head from 'next/head'
import { cn } from '@/lib/utils'

// Only show live calculators - add more as they're built
// Per spec Section 2.2: "Show only live tabs. Do not show disabled/greyed-out tabs for unbuilt calculators."
const penaltyTabs = [
  { href: '/tools/penalty-calculator/gst-late-filing', label: 'GST Filing' },
  { href: '/tools/penalty-calculator/itr-late-filing', label: 'ITR Filing' },
  { href: '/tools/penalty-calculator/mca-annual-filing', label: 'MCA Filing' },
  { href: '/tools/penalty-calculator/director-kyc', label: 'Director KYC' },
  { href: '/tools/penalty-calculator/tds-late-filing', label: 'TDS Filing' },
  // Calculators 6-10 to be added after 1-5 are live and tested:
  // { href: '/tools/penalty-calculator/pf-esic-penalty', label: 'PF / ESIC' },
  // { href: '/tools/penalty-calculator/professional-tax-penalty', label: 'Professional Tax' },
  // { href: '/tools/penalty-calculator/gst-demand-notice', label: 'GST Demand' },
  // { href: '/tools/penalty-calculator/startup-dpiit-compliance', label: 'Startup / DPIIT' },
  // { href: '/tools/penalty-calculator/shops-establishment-penalty', label: 'Shops & Est.' },
]

export default function PenaltyCalculatorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  // Don't show tabs on the index page
  if (pathname === '/tools/penalty-calculator') {
    return <>{children}</>
  }

  // Find current tab for breadcrumb
  const currentTab = penaltyTabs.find(tab => pathname === tab.href)

  return (
    <>
      {/* Breadcrumb Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://ollvy.com' },
              { '@type': 'ListItem', position: 2, name: 'Tools', item: 'https://ollvy.com/tools' },
              { '@type': 'ListItem', position: 3, name: 'Penalty Calculator', item: 'https://ollvy.com/tools/penalty-calculator' },
              currentTab && { '@type': 'ListItem', position: 4, name: currentTab.label, item: `https://ollvy.com${currentTab.href}` },
            ].filter(Boolean),
          }),
        }}
      />

      <div className="py-24">
        <div className="container max-w-6xl">
          {/* Header */}
          <div className="text-center mb-8">
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3">
              PENALTY CALCULATOR
            </p>
            <h1 className="text-3xl md:text-4xl font-semibold text-foreground">
              What&apos;s the Penalty for Missing a Deadline?
            </h1>
            <p className="text-lg text-muted-foreground mt-4 max-w-2xl mx-auto">
              Real calculations based on Indian compliance law. Configure your business profile to see exact penalties.
            </p>
          </div>

          {/* Tabs - horizontal scroll on mobile */}
          <div className="overflow-x-auto pb-4 mb-8 border-b border-border">
            <div className="flex gap-2 min-w-max justify-center">
              {penaltyTabs.map((tab) => (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className={cn(
                    'px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap',
                    pathname === tab.href
                      ? 'bg-emerald-600 text-white'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground'
                  )}
                >
                  {tab.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Content */}
          {children}
        </div>
      </div>
    </>
  )
}
