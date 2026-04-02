import { redirect } from 'next/navigation'
import { getUser } from '@/lib/supabase-server'
import { OrderPageClient } from './OrderPageClient'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function OrderDetailPage({ params }: PageProps) {
  const { id: orderId } = await params
  const user = await getUser()

  if (!user) {
    redirect(`/login?returnUrl=/orders/${orderId}`)
  }

  // Don't call RPC here - auth.uid() doesn't work server-side
  // Pass orderId to client component which will fetch data client-side
  return <OrderPageClient orderId={orderId} />
}
