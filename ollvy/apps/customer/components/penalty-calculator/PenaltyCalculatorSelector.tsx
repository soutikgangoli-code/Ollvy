'use client'

import { useRouter } from 'next/navigation'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

// Sorted by monthly search volume (India)
export const penaltyCalculators = [
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

interface PenaltyCalculatorSelectorProps {
  currentHref: string
  currentLabel: string
}

export function PenaltyCalculatorSelector({ currentHref, currentLabel }: PenaltyCalculatorSelectorProps) {
  const router = useRouter()

  const handleChange = (value: string) => {
    router.push(value)
  }

  return (
    <Select value={currentHref} onValueChange={handleChange}>
      <SelectTrigger className="w-[320px] h-11 bg-card border-border text-sm">
        <SelectValue>
          <span className="text-muted-foreground">Switch calculator:</span>{' '}
          <span className="text-foreground">{currentLabel}</span>
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
  )
}
