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
              { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://ollvy.com' },
              { '@type': 'ListItem', position: 2, name: 'Tools', item: 'https://ollvy.com/tools' },
              { '@type': 'ListItem', position: 3, name: 'Penalty Calculator', item: 'https://ollvy.com/tools/penalty-calculator' },
              currentCalc && { '@type': 'ListItem', position: 4, name: currentCalc.label, item: `https://ollvy.com${currentCalc.href}` },
            ].filter(Boolean),
          }),
        }}
      />

      <div className="py-16 md:py-24">
        <div className="container max-w-5xl">
          {/* Header */}
          <div className="mb-10">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-4">
              Penalty Calculator
            </p>

            {/* Calculator Selector */}
            <div className="flex items-center gap-3">
              <Select value={pathname} onValueChange={handleChange} modal={false}>
                <SelectTrigger className="w-[320px] h-12 bg-background border-border/50 font-medium text-base">
                  <SelectValue>
                    {currentCalc?.label || 'Select calculator'}
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

            <p className="text-sm text-muted-foreground mt-4 max-w-xl">
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
