import { supabaseServer } from '@/lib/supabase-server'
import { getAdminUser } from '@/lib/admin/get-admin-user'
import { redirect } from 'next/navigation'
import { OrdersListClient } from '@/components/admin/OrdersListClient'

export const metadata = { robots: 'noindex, nofollow' }

const PAGE_SIZE = 50

const STATUS_FILTERS: Record<string, string[]> = {
  active: ['pending_assignment', 'waitlisted', 'in_progress'],
  needs_attention: ['pending_assignment', 'disputed'],
  completed: ['completed'],
  cancelled: ['cancelled'],
}

interface Props {
  searchParams: Promise<{ page?: string; tab?: string }>
}

export default async function AdminOrdersPage({ searchParams }: Props) {
  const params = await searchParams
  const adminUser = await getAdminUser()
  if (!supabaseServer) redirect('/admin/login')

  const page = Math.max(1, parseInt(params.page || '1', 10) || 1)
  const tab = params.tab || 'all'
  const offset = (page - 1) * PAGE_SIZE

  // Build query with server-side status filter
  let query = supabaseServer
    .from('orders')
    .select(`
      id,
      order_number,
      status,
      paid_at,
      total_paisa_snapshot,
      service_packages (name),
      users (business_name)
    `, { count: 'exact' })
    .order('paid_at', { ascending: false })
    .range(offset, offset + PAGE_SIZE - 1)

  const statusFilter = STATUS_FILTERS[tab]
  if (statusFilter) {
    query = query.in('status', statusFilter)
  }

  const { data: orders, count } = await query
  const totalCount = count || 0

  const formattedOrders = (orders || []).map(order => {
    // Handle both single object and array cases for joins
    const servicePackage = Array.isArray(order.service_packages)
      ? order.service_packages[0]
      : order.service_packages
    const user = Array.isArray(order.users)
      ? order.users[0]
      : order.users
    return {
      id: order.id,
      order_number: order.order_number,
      status: order.status,
      paid_at: order.paid_at,
      total_paisa_snapshot: order.total_paisa_snapshot,
      service_name: servicePackage?.name || 'Unknown Service',
      user_name: user?.business_name || 'Unknown User',
    }
  })

  return (
    <OrdersListClient
      orders={formattedOrders}
      currentPage={page}
      totalCount={totalCount}
      pageSize={PAGE_SIZE}
      activeTab={tab}
    />
  )
}
