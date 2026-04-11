import { supabaseServer } from '@/lib/supabase-server'
import { getAdminUser } from '@/lib/admin/get-admin-user'
import { redirect, notFound } from 'next/navigation'
import { UserDetailClient } from '@/components/admin/UserDetailClient'

export const metadata = { robots: 'noindex, nofollow' }

interface PageProps {
  params: Promise<{ userId: string }>
}

export default async function AdminUserDetailPage({ params }: PageProps) {
  const { userId } = await params
  const adminUser = await getAdminUser()
  if (!supabaseServer) redirect('/admin/login')

  // Fetch user
  const { data: user, error: userError } = await supabaseServer
    .from('users')
    .select('id, auth_user_id, business_name, phone, email, business_type, gstin, state, city, address, created_at')
    .eq('id', userId)
    .single()

  if (userError || !user) {
    notFound()
  }

  // Fetch user's orders
  const { data: orders } = await supabaseServer
    .from('orders')
    .select(`
      id,
      order_number,
      status,
      paid_at,
      total_paisa_snapshot,
      service_packages (name)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  const formattedOrders = (orders || []).map(order => {
    const servicePackage = Array.isArray(order.service_packages)
      ? order.service_packages[0]
      : order.service_packages
    return {
      id: order.id,
      order_number: order.order_number,
      status: order.status,
      paid_at: order.paid_at,
      total_paisa_snapshot: order.total_paisa_snapshot,
      service_name: servicePackage?.name || 'Unknown Service',
    }
  })

  return <UserDetailClient user={user} orders={formattedOrders} />
}
