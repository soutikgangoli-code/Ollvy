// Penalty calculator navigation data - sorted by monthly search volume (India)
// This file is intentionally NOT a client component so it can be imported by server components

export interface PenaltyCalculatorItem {
  href: string
  label: string
  shortForm: string
}

export const penaltyCalculators: PenaltyCalculatorItem[] = [
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
