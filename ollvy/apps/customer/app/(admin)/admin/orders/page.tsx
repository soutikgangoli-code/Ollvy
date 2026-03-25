import { supabaseServer } from '@/lib/supabase-server'
import { getAdminUser } from '@/lib/admin/get-admin-user'
import { redirect } from 'next/navigation'
import { OrdersListClient } from '@/components/admin/OrdersListClient'

export const metadata = { robots: 'noindex, nofollow' }

export default async function AdminOrdersPage() {
  const adminUser = await getAdminUser()
  if (!supabaseServer) redirect('/admin/login')

  const { data: orders } = await supabaseServer
    .from('orders')
    .select(`
      id,
      order_number,
      status,
      paid_at,
      total_paisa_snapshot,
      service_packages (name),
      users (business_name)
    `)
    .order('paid_at', { ascending: false })

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

  return <OrdersListClient orders={formattedOrders} />
}
