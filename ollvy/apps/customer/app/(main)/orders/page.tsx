import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getUserFast, supabaseServer } from '@/lib/supabase-server'
import { withTimeout, DB_TIMEOUT_MS } from '@/lib/with-timeout'
import { OrdersPageClient } from './OrdersPageClient'
import type { Order } from '@/lib/types'

export const metadata: Metadata = {
  title: 'My Orders | Ollvy',
  robots: 'noindex, nofollow',
}

export default async function OrdersPage() {
  const __tStart = performance.now()
  const user = await getUserFast()
  const __tAuth = performance.now() - __tStart

  if (!user) {
    redirect('/login?returnUrl=/orders')
  }

  // Server-side data fetching using service role client
  // This bypasses RLS, so we explicitly filter by user_id
  let initialData: { active: Order[]; completed: Order[] } | null = null
  let __tQuery = 0
  let __ordersCount = 0

  if (supabaseServer) {
    try {
      // Fetch ALL orders in ONE query (not 2 separate RPCs)
      // Exclude pending_payment at SQL level - these are unpaid abandoned orders
      const __qStart = performance.now()
      const { data: orders, error } = await withTimeout(
        supabaseServer
          .from('orders')
          .select(`
            *,
            service_package:service_packages(
              id,
              name,
              slug,
              sla_working_days
            ),
            professional:professionals(
              id,
              full_name,
              avatar_url
            )
          `)
          .eq('user_id', user.id)
          .neq('status', 'pending_payment')
          .order('created_at', { ascending: false }),
        DB_TIMEOUT_MS,
        'ordersPage.list',
      )
      __tQuery = performance.now() - __qStart

      if (!error && orders) {
        __ordersCount = orders.length
        // Split on server (no extra query)
        const activeStatuses = ['pending_assignment', 'waitlisted', 'in_progress']
        const completedStatuses = ['completed', 'disputed']

        const active = orders.filter(o => activeStatuses.includes(o.status) && (o.paid_at || o.retainer_subscription_id)) as Order[]
        // Only show cancelled orders that were actually paid (not abandoned payment attempts)
        const cancelledPaid = orders.filter(o => o.status === 'cancelled' && o.paid_at !== null)
        const completed = [...orders.filter(o => completedStatuses.includes(o.status)), ...cancelledPaid].slice(0, 20) as Order[]

        initialData = { active, completed }
      }
    } catch (err) {
      console.error('[Orders Page] Server-side fetch error:', err)
      // Fall back to client-side fetching
    }
  }

  const __perfTimings = {
    auth: Math.round(__tAuth),
    query: Math.round(__tQuery),
    total: Math.round(performance.now() - __tStart),
    ordersCount: __ordersCount,
  }

  return <OrdersPageClient initialData={initialData} __perfTimings={__perfTimings} />
}
