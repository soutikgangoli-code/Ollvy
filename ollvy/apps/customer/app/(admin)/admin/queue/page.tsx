import { supabaseServer } from '@/lib/supabase-server'
import { getAdminUser } from '@/lib/admin/get-admin-user'
import { QueueClient } from '@/components/admin/QueueClient'
import { redirect } from 'next/navigation'

export const metadata = { robots: 'noindex, nofollow' }

const PAGE_SIZE = 50

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
  user_email: string
  user_phone: string
  days_active: number
  bucket: Bucket
  expected_completion_date?: string
  assigned_admin_id?: string
  sla_overdue_hours?: number
  is_paid: boolean
}

interface Props {
  searchParams: Promise<{ page?: string }>
}

export default async function AdminQueuePage({ searchParams }: Props) {
  const params = await searchParams
  // getAdminUser is cached - layout already called it, so this returns cached result
  const adminUser = await getAdminUser()
  if (!supabaseServer) redirect('/admin/login')

  const page = Math.max(1, parseInt(params.page || '1', 10) || 1)
  const offset = (page - 1) * PAGE_SIZE

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
      users (business_name, email, phone)
    `, { count: 'exact' })
    .not('status', 'in', '("completed","cancelled")')
    .order('paid_at', { ascending: false })
    .range(offset, offset + PAGE_SIZE - 1)

  // Filter by assigned admin for non-super_admin
  if (!isSuper) {
    ordersQuery = ordersQuery.eq('assigned_admin_id', adminUser.id)
  }

  const { data: ordersRaw, count } = await ordersQuery
  const totalCount = count || 0

  // Fetch rounds and work documents for bucket calculation
  const orderIds = ordersRaw?.map(o => o.id) || []

  let roundsData: { order_id: string; status: string }[] = []
  let workDocsData: { order_id: string; status: string; direction: string; tag: string | null }[] = []
  let questionnaireData: { order_id: string; question_key: string; response_value: string }[] = []
  let adminsData: { id: string; name: string; email: string; is_active: boolean }[] | null = null

  if (orderIds.length > 0) {
    // Parallelize all secondary queries including admin_users for super_admin
    const roundsPromise = supabaseServer
      .from('order_rounds')
      .select('order_id, status')
      .in('order_id', orderIds)

    const workDocsPromise = supabaseServer
      .from('order_work_documents')
      .select('order_id, status, direction, tag')
      .in('order_id', orderIds)

    const questionnairePromise = supabaseServer
      .from('order_questionnaire_responses')
      .select('order_id, question_key, response_value')
      .in('order_id', orderIds)
      .in('question_key', ['company_name', 'proposed_company_name', 'business_name', 'llp_name'])

    // Add admin_users query for super_admin (parallelize instead of sequential)
    const adminsPromise = isSuper
      ? supabaseServer
          .from('admin_users')
          .select('id, name, email, is_active')
          .eq('is_active', true)
          .order('name')
      : null

    const [roundsRes, workDocsRes, questionnaireRes, adminsRes] = await Promise.all([
      roundsPromise,
      workDocsPromise,
      questionnairePromise,
      adminsPromise
    ])

    roundsData = roundsRes.data || []
    workDocsData = workDocsRes.data || []
    questionnaireData = questionnaireRes.data || []
    if (adminsRes) {
      adminsData = adminsRes.data
    }
  } else if (isSuper) {
    // No orders but still need admin users for super_admin
    const { data } = await supabaseServer
      .from('admin_users')
      .select('id, name, email, is_active')
      .eq('is_active', true)
      .order('name')
    adminsData = data
  }

  // Build Maps for O(1) lookups instead of O(n*m) filtering
  const roundsByOrderId = new Map<string, typeof roundsData>()
  for (const r of roundsData) {
    const arr = roundsByOrderId.get(r.order_id) || []
    arr.push(r)
    roundsByOrderId.set(r.order_id, arr)
  }

  const workDocsByOrderId = new Map<string, typeof workDocsData>()
  for (const d of workDocsData) {
    const arr = workDocsByOrderId.get(d.order_id) || []
    arr.push(d)
    workDocsByOrderId.set(d.order_id, arr)
  }

  const questionnaireByOrderId = new Map<string, typeof questionnaireData>()
  for (const q of questionnaireData) {
    const arr = questionnaireByOrderId.get(q.order_id) || []
    arr.push(q)
    questionnaireByOrderId.set(q.order_id, arr)
  }

  // Calculate buckets with O(1) lookups
  const orders: QueueOrder[] = (ordersRaw || []).map(order => {
    const orderRounds = roundsByOrderId.get(order.id) || []
    const orderWorkDocs = workDocsByOrderId.get(order.id) || []
    const orderQuestionnaire = questionnaireByOrderId.get(order.id) || []

    // Handle both single object and array cases for joins
    const servicePackage = Array.isArray(order.service_packages)
      ? order.service_packages[0]
      : order.service_packages
    const user = Array.isArray(order.users)
      ? order.users[0]
      : order.users

    // Calculate days_active - validate date first
    const paidDate = order.paid_at ? new Date(order.paid_at) : null
    const now = new Date()
    const isValidDate = paidDate && !isNaN(paidDate.getTime()) && paidDate.getFullYear() > 2000
    const daysActive = isValidDate
      ? Math.floor((now.getTime() - paidDate.getTime()) / (1000 * 60 * 60 * 24))
      : 0

    // Calculate SLA overdue in hours
    let slaOverdueHours: number | undefined
    if (order.expected_completion_date) {
      const dueDate = new Date(order.expected_completion_date)
      if (now > dueDate) {
        slaOverdueHours = Math.floor((now.getTime() - dueDate.getTime()) / (1000 * 60 * 60))
      }
    }

    // Get company name from questionnaire or user's business_name, fallback to phone
    const companyNameFromQ = orderQuestionnaire.find(q =>
      ['company_name', 'proposed_company_name', 'business_name', 'llp_name'].includes(q.question_key)
    )?.response_value
    const userName = user?.business_name || companyNameFromQ || user?.phone || 'Unknown'

    // Check if order is paid (valid paid_at date)
    const isPaid = isValidDate === true

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
      service_name: servicePackage?.name || 'Unknown Service',
      user_name: userName,
      user_email: user?.email || '',
      user_phone: user?.phone || '',
      days_active: daysActive,
      bucket,
      expected_completion_date: order.expected_completion_date,
      assigned_admin_id: order.assigned_admin_id,
      sla_overdue_hours: slaOverdueHours,
      is_paid: isPaid,
    }
  })

  // Process admin users for bulk assignment (super_admin only) - already fetched in parallel
  let adminUsers: Array<{ id: string; name: string; email: string; activeOrderCount: number }> = []
  if (isSuper && adminsData) {
    // Compute counts from already-fetched orders (no N+1 queries)
    const adminOrderCounts: Record<string, number> = {}
    for (const order of ordersRaw || []) {
      if (order.assigned_admin_id) {
        adminOrderCounts[order.assigned_admin_id] = (adminOrderCounts[order.assigned_admin_id] || 0) + 1
      }
    }

    adminUsers = adminsData.map(admin => ({
      ...admin,
      activeOrderCount: adminOrderCounts[admin.id] || 0,
    }))
    adminUsers.sort((a, b) => a.activeOrderCount - b.activeOrderCount)
  }

  return (
    <QueueClient
      orders={orders}
      adminUser={adminUser}
      adminUsers={adminUsers}
      currentPage={page}
      totalCount={totalCount}
      pageSize={PAGE_SIZE}
    />
  )
}
