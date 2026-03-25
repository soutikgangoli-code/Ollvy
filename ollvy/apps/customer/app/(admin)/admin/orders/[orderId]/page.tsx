import { supabaseServer } from '@/lib/supabase-server'
import { getAdminUser } from '@/lib/admin/get-admin-user'
import { OrderViewClient } from '@/components/admin/OrderViewClient'
import { redirect, notFound } from 'next/navigation'

export const metadata = { robots: 'noindex, nofollow' }

interface PageProps {
  params: Promise<{ orderId: string }>
}

export default async function AdminOrderPage({ params }: PageProps) {
  const { orderId } = await params
  const adminUser = await getAdminUser()
  if (!supabaseServer) redirect('/admin/login')

  // Fetch order with joins
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

  // Fetch assigned admin if set
  let assignedAdmin = null
  if (order.assigned_admin_id) {
    const { data } = await supabaseServer
      .from('admin_users')
      .select('id, name, email')
      .eq('id', order.assigned_admin_id)
      .single()
    assignedAdmin = data
  }

  // Fetch rounds with nested data
  const { data: rounds } = await supabaseServer
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
    .order('round_number', { ascending: true })

  // Fetch initial documents (Round 0)
  const { data: initialDocs } = await supabaseServer
    .from('order_documents')
    .select('*')
    .eq('order_id', orderId)
    .eq('stage_key', 'doc_collection')

  // Fetch questionnaire answers
  const { data: questionnaireAnswers } = await supabaseServer
    .from('order_questionnaire_responses')
    .select('question_key, response_value')
    .eq('order_id', orderId)

  // Fetch questionnaire questions
  const { data: questionnaireQuestions } = await supabaseServer
    .from('service_questionnaires')
    .select('question_key, question_label, question_type, options, display_order')
    .eq('service_package_id', order.service_package_id)
    .order('display_order', { ascending: true })

  // Fetch admin notes
  const { data: adminNotes, error: notesError } = await supabaseServer
    .from('order_admin_notes')
    .select('*, admin_users(name)')
    .eq('order_id', orderId)
    .order('created_at', { ascending: false })

  if (notesError) {
    console.error('Admin notes fetch failed:', notesError)
  }

  // Fetch available professionals for assignment
  const { data: professionals } = await supabaseServer
    .from('professionals')
    .select('id, full_name, display_name, email, professional_type')
    .eq('status', 'approved')
    .order('full_name')

  // Fetch admin names for round creators
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
      adminNotes={adminNotes || []}
      professionals={professionals || []}
      adminNamesMap={adminNamesMap}
      assignedAdmin={assignedAdmin}
    />
  )
}
