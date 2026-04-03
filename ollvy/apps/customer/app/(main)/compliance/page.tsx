import { Metadata } from 'next'
import { CompliancePageClient } from './CompliancePageClient'

export const metadata: Metadata = {
  title: 'Compliance Calendar | Ollvy',
  robots: 'noindex, nofollow',
}

export default function CompliancePage() {
  return <CompliancePageClient />
}
