import { Metadata } from 'next'
import { NotificationsPageClient } from './NotificationsPageClient'

export const metadata: Metadata = {
  title: 'Notifications | Ollvy',
  robots: 'noindex, nofollow',
}

export default function NotificationsPage() {
  return <NotificationsPageClient />
}
