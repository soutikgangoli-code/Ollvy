import { supabaseServer } from '@/lib/supabase-server'
import { getAdminUser } from '@/lib/admin/get-admin-user'
import { redirect } from 'next/navigation'
import { UsersClient } from '@/components/admin/UsersClient'

export const metadata = { robots: 'noindex, nofollow' }

export default async function AdminUsersPage() {
  const adminUser = await getAdminUser()
  if (!supabaseServer) redirect('/admin/login')

  // Fetch users with pagination (limit for performance)
  const { data: users } = await supabaseServer
    .from('users')
    .select('id, business_name, phone, business_type, created_at')
    .order('created_at', { ascending: false })
    .limit(500)

  // Get order counts per user using single aggregated query
  const userIds = (users || []).map(u => u.id)
  let orderCounts: Record<string, number> = {}

  if (userIds.length > 0) {
    // Fetch only user_id for counting - minimal data transfer
    const { data: ordersData } = await supabaseServer
      .from('orders')
      .select('user_id', { count: 'exact' })
      .in('user_id', userIds)

    if (ordersData) {
      orderCounts = ordersData.reduce((acc, o) => {
        acc[o.user_id] = (acc[o.user_id] || 0) + 1
        return acc
      }, {} as Record<string, number>)
    }
  }

  const formattedUsers = (users || []).map(user => ({
    id: user.id,
    business_name: user.business_name || 'No name',
    phone: user.phone,
    business_type: user.business_type,
    created_at: user.created_at,
    order_count: orderCounts[user.id] || 0,
  }))

  return <UsersClient users={formattedUsers} />
}
