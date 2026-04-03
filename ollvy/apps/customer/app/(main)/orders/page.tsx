import { Metadata } from 'next'
import { OrdersPageClient } from './OrdersPageClient'

export const metadata: Metadata = {
  title: 'My Orders | Ollvy',
  robots: 'noindex, nofollow',
}

export default function OrdersPage() {
  return <OrdersPageClient />
}
