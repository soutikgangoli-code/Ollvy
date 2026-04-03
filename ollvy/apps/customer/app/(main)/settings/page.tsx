import { Metadata } from 'next'
import { SettingsPageClient } from './SettingsPageClient'

export const metadata: Metadata = {
  title: 'Settings | Ollvy',
  robots: 'noindex, nofollow',
}

export default function SettingsPage() {
  return <SettingsPageClient />
}
