import { supabaseServer } from '@/lib/supabase-server'
import { getAdminUser } from '@/lib/admin/get-admin-user'
import { QueueClient } from '@/components/admin/QueueClient'
import { redirect } from 'next/navigation'

export const metadata = { robots: 'noindex, nofollow' }

// Bucket type definition
type Bucket = 'needs_assignment' | 'disputed' | 'awaiting_user' | 'docs_to_review' | 'in_progress' | 'awaiting_government' | 'ready_to_deliver' | 'other'

interface QueueOrder {
  id: string
  order_number: string
  status: string
  paid_at: string
  total_paisa_snapshot: number
  service_name: string
  user_name: string
  days_active: number
  bucket: Bucket
  expected_completion_date?: string
  assigned_admin_id?: string
}

export default async function AdminQueuePage() {
  const adminUser = await getAdminUser()
  if (!supabaseServer) redirect('/admin/login')

  // Non-super_admin can only see their own assigned orders
  const isSuper = adminUser.role === 'super_admin'

  // Fetch orders with bucket calculation
  let ordersQuery = supabaseServer
    .from('orders')
    .select(`
      id,
      order_number,
      status,
      paid_at,
      total_paisa_snapshot,
      expected_completion_date,
      assigned_admin_id,
      service_packages (name),
      users (business_name)
    `)
    .not('status', 'in', '("completed","cancelled")')
    .order('paid_at', { ascending: false })

  // Filter by assigned admin for non-super_admin
  if (!isSuper) {
    ordersQuery = ordersQuery.eq('assigned_admin_id', adminUser.id)
  }

  const { data: ordersRaw } = await ordersQuery

  // Fetch rounds and work documents for bucket calculation
  const orderIds = ordersRaw?.map(o => o.id) || []

  let roundsData: { order_id: string; status: string }[] = []
  let workDocsData: { order_id: string; status: string; direction: string; tag: string | null }[] = []

  if (orderIds.length > 0) {
    const [roundsRes, workDocsRes] = await Promise.all([
      supabaseServer
        .from('order_rounds')
        .select('order_id, status')
        .in('order_id', orderIds),
      supabaseServer
        .from('order_work_documents')
        .select('order_id, status, direction, tag')
        .in('order_id', orderIds)
    ])
    roundsData = roundsRes.data || []
    workDocsData = workDocsRes.data || []
  }

  // Calculate buckets client-side
  const orders: QueueOrder[] = (ordersRaw || []).map(order => {
    const orderRounds = roundsData.filter(r => r.order_id === order.id)
    const orderWorkDocs = workDocsData.filter(d => d.order_id === order.id)

    // Calculate days_active
    const paidDate = new Date(order.paid_at)
    const now = new Date()
    const daysActive = Math.floor((now.getTime() - paidDate.getTime()) / (1000 * 60 * 60 * 24))

    // Calculate bucket
    let bucket: Bucket = 'other'

    if (order.status === 'disputed') {
      bucket = 'disputed'
    } else if (order.status === 'pending_assignment') {
      bucket = 'needs_assignment'
    } else if (orderRounds.some(r => r.status === 'awaiting_user')) {
      bucket = 'awaiting_user'
    } else if (orderWorkDocs.some(d => d.status === 'uploaded' && d.direction === 'from_customer')) {
      bucket = 'docs_to_review'
    } else if (orderWorkDocs.some(d => d.tag === 'final_output') && order.status !== 'completed') {
      bucket = 'ready_to_deliver'
    } else if (orderWorkDocs.some(d => d.tag === 'government_processing')) {
      bucket = 'awaiting_government'
    } else if (order.status === 'in_progress') {
      bucket = 'in_progress'
    }

    return {
      id: order.id,
      order_number: order.order_number,
      status: order.status,
      paid_at: order.paid_at,
      total_paisa_snapshot: order.total_paisa_snapshot,
      service_name: order.service_packages?.name || 'Unknown Service',
      user_name: order.users?.business_name || 'Unknown User',
      days_active: daysActive,
      bucket,
      expected_completion_date: order.expected_completion_date,
      assigned_admin_id: order.assigned_admin_id,
    }
  })

  // Fetch admin users for bulk assignment (super_admin only)
  let adminUsers: Array<{ id: string; name: string; email: string; activeOrderCount: number }> = []
  if (isSuper) {
    const { data: admins } = await supabaseServer
      .from('admin_users')
      .select('id, name, email, is_active')
      .eq('is_active', true)
      .order('name')

    if (admins) {
      // Get counts for each admin
      adminUsers = await Promise.all(
        admins.map(async (admin) => {
          const { count } = await supabaseServer
            .from('orders')
            .select('id', { count: 'exact', head: true })
            .eq('assigned_admin_id', admin.id)
            .not('status', 'in', '(completed,cancelled)')
          return { ...admin, activeOrderCount: count ?? 0 }
        })
      )
      adminUsers.sort((a, b) => a.activeOrderCount - b.activeOrderCount)
    }
  }

  return <QueueClient orders={orders} adminUser={adminUser} adminUsers={adminUsers} />
}
