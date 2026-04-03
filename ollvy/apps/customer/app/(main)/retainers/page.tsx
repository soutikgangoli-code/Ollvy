import { Metadata } from 'next'
import { RetainersPageClient } from './RetainersPageClient'

export const metadata: Metadata = {
  title: 'Retainers | Ollvy',
  robots: 'noindex, nofollow',
}

export default function RetainersPage() {
  return <RetainersPageClient />
}
