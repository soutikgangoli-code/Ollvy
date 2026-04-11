import dynamic from 'next/dynamic'
import { supabaseServer } from '@/lib/supabase-server'
import { getAdminUser } from '@/lib/admin/get-admin-user'
import { redirect, notFound } from 'next/navigation'
import { Skeleton } from '@/components/ui/skeleton'

const OrderViewClient = dynamic(
  () => import('@/components/admin/OrderViewClient').then(m => ({ default: m.OrderViewClient })),
  { loading: () => <div className="container py-8 space-y-6"><Skeleton className="h-10 w-64" /><Skeleton className="h-[600px] w-full rounded-xl" /></div> }
)

export const metadata = { robots: 'noindex, nofollow' }

interface PageProps {
  params: Promise<{ orderId: string }>
}

export default async function AdminOrderPage({ params }: PageProps) {
  const { orderId } = await params
  const adminUser = await getAdminUser()
  if (!supabaseServer) redirect('/admin/login')

  // Step 1: Fetch order first (required for service_package_id)
  const { data: order, error: orderError } = await supabaseServer
    .from('orders')
    .select(`
      *,
      service_packages (id, name, slug, sla_working_days),
      users (id, business_name, phone, email),
      professionals (id, full_name, display_name, email, professional_type)
    `)
    .eq('id', orderId)
    .single()

  if (orderError || !order) {
    console.error('Admin order fetch failed:', JSON.stringify({
      orderError,
      orderId,
      hasSupabase: !!supabaseServer
    }, null, 2))
    notFound()
  }

  // Step 2: Run all independent queries in parallel
  const [
    { data: assignedAdmin },
    { data: rounds },
    { data: initialDocs },
    { data: questionnaireAnswers },
    { data: questionnaireQuestions },
    { data: adminNotes, error: notesError },
    { data: professionals },
    { data: activityLog },
  ] = await Promise.all([
    // Fetch assigned admin if set
    order.assigned_admin_id
      ? supabaseServer
          .from('admin_users')
          .select('id, name, email')
          .eq('id', order.assigned_admin_id)
          .single()
      : Promise.resolve({ data: null }),

    // Fetch rounds with nested data
    supabaseServer
      .from('order_rounds')
      .select(`
        id, order_id, round_number, title, status, is_visible_to_user,
        created_by_admin_id, created_at, completed_at,
        round_question_requests (
          id, round_id, question_text, answer_text, answered_at, position, created_at
        ),
        order_work_documents (
          id, order_id, round_id, direction, document_label, description, tag,
          status, file_url, file_name, uploaded_at, uploaded_by_type,
          verified_at, rejection_reason, skipped_at, skip_reason,
          linked_request_id, created_at, updated_at
        )
      `)
      .eq('order_id', orderId)
      .order('round_number', { ascending: true }),

    // Fetch initial documents (Round 0)
    supabaseServer
      .from('order_documents')
      .select('id, order_id, document_key, document_label, stage_key, is_required, uploaded_at, file_url, file_name, verified_at, verified_by, rejection_reason, created_at')
      .eq('order_id', orderId)
      .eq('stage_key', 'doc_collection'),

    // Fetch questionnaire answers
    supabaseServer
      .from('order_questionnaire_responses')
      .select('question_key, response_value')
      .eq('order_id', orderId),

    // Fetch questionnaire questions (uses order.service_package_id)
    supabaseServer
      .from('service_questionnaires')
      .select('question_key, question_label, question_type, options, display_order')
      .eq('service_package_id', order.service_package_id)
      .order('display_order', { ascending: true }),

    // Fetch admin notes
    supabaseServer
      .from('order_admin_notes')
      .select('id, order_id, admin_id, content, created_at, admin_users(name)')
      .eq('order_id', orderId)
      .order('created_at', { ascending: false }),

    // Fetch available professionals for assignment
    supabaseServer
      .from('professionals')
      .select('id, full_name, display_name, email, professional_type')
      .eq('status', 'approved')
      .order('full_name'),

    // Fetch activity log (pre-load for instant display)
    supabaseServer
      .from('order_activity_log')
      .select('id, order_id, action_type, actor_type, actor_id, actor_name, description, metadata, created_at')
      .eq('order_id', orderId)
      .order('created_at', { ascending: false }),
  ])

  if (notesError) {
    console.error('Admin notes fetch failed:', notesError)
  }

  // Step 3: Fetch admin names for round creators (depends on rounds)
  const adminIds = (rounds || [])
    .map(r => r.created_by_admin_id)
    .filter(Boolean)
    .filter((v, i, a) => a.indexOf(v) === i)

  let adminNamesMap: Record<string, string> = {}
  if (adminIds.length > 0) {
    const { data: admins } = await supabaseServer
      .from('admin_users')
      .select('id, name')
      .in('id', adminIds)
    if (admins) {
      adminNamesMap = Object.fromEntries(admins.map(a => [a.id, a.name]))
    }
  }

  return (
    <OrderViewClient
      order={order}
      rounds={rounds || []}
      adminUser={adminUser}
      initialDocs={initialDocs || []}
      questionnaireAnswers={questionnaireAnswers || []}
      questionnaireQuestions={questionnaireQuestions || []}
      adminNotes={(adminNotes || []) as any}
      professionals={professionals || []}
      adminNamesMap={adminNamesMap}
      assignedAdmin={assignedAdmin}
      initialActivityLog={activityLog || []}
    />
  )
}
