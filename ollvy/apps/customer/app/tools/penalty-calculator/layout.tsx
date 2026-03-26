'use client'

import { usePathname, useRouter } from 'next/navigation'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

// Sorted by monthly search volume (India)
const penaltyCalculators = [
  { href: '/tools/penalty-calculator/gst-late-filing', label: 'GST Late Filing', shortForm: 'GSTR-3B' },
  { href: '/tools/penalty-calculator/itr-late-filing', label: 'ITR Late Filing', shortForm: 'ITR' },
  { href: '/tools/penalty-calculator/tds-late-filing', label: 'TDS Late Filing', shortForm: 'TDS' },
  { href: '/tools/penalty-calculator/mca-annual-filing', label: 'MCA Annual Filing', shortForm: 'AOC-4' },
  { href: '/tools/penalty-calculator/pf-esic-penalty', label: 'PF / ESIC Penalty', shortForm: 'EPF' },
  { href: '/tools/penalty-calculator/director-kyc', label: 'Director KYC', shortForm: 'DIR-3' },
  { href: '/tools/penalty-calculator/gst-demand-notice', label: 'GST Demand Notice', shortForm: 'DRC-01' },
  { href: '/tools/penalty-calculator/professional-tax-penalty', label: 'Professional Tax', shortForm: 'PT' },
  { href: '/tools/penalty-calculator/shops-establishment-penalty', label: 'Shops & Establishment', shortForm: 'S&E' },
  { href: '/tools/penalty-calculator/startup-dpiit-compliance', label: 'Startup / DPIIT', shortForm: 'FC-GPR' },
]

export default function PenaltyCalculatorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()

  // Don't show selector on the index page
  if (pathname === '/tools/penalty-calculator') {
    return <>{children}</>
  }

  // Find current calculator
  const currentCalc = penaltyCalculators.find(calc => pathname === calc.href)

  const handleChange = (value: string) => {
    router.push(value)
  }

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
              { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.ollvy.com' },
              { '@type': 'ListItem', position: 2, name: 'Tools', item: 'https://www.ollvy.com/tools' },
              { '@type': 'ListItem', position: 3, name: 'Penalty Calculator', item: 'https://www.ollvy.com/tools/penalty-calculator' },
              currentCalc && { '@type': 'ListItem', position: 4, name: currentCalc.label, item: `https://www.ollvy.com${currentCalc.href}` },
            ].filter(Boolean),
          }),
        }}
      />

      <div className="py-16 md:py-24">
        <div className="container max-w-5xl">
          {/* Header */}
          <div className="mb-16 text-center">
            <p className="font-mono text-sm uppercase tracking-[0.3em] text-muted-foreground mb-4">
              Penalty Calculator
            </p>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground mb-4 tracking-tight">
              {currentCalc?.label || 'Select Calculator'}
            </h1>

            {/* Calculator Selector */}
            <div className="flex justify-center mb-6">
              <Select value={pathname} onValueChange={handleChange}>
                <SelectTrigger className="w-[320px] h-11 bg-card border-border text-sm">
                  <SelectValue>
                    <span className="text-muted-foreground">Switch calculator:</span>{' '}
                    <span className="text-foreground">{currentCalc?.label}</span>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="max-h-[400px] min-w-[320px]">
                  {penaltyCalculators.map((calc) => (
                    <SelectItem
                      key={calc.href}
                      value={calc.href}
                      className="py-3 cursor-pointer"
                    >
                      <div className="flex items-center justify-between gap-4 w-full">
                        <span>{calc.label}</span>
                        <span className="font-mono text-[10px] text-muted-foreground">
                          {calc.shortForm}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Calculate exact penalties based on Indian compliance law
            </p>
          </div>

          {/* Content */}
          {children}
        </div>
      </div>
    </>
  )
}
