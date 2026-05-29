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

// Shape returned by the get_admin_order_view RPC.
// The DB function (migrations/20260529120100_get_admin_order_view.sql) returns
// these fields as a single JSONB payload.
interface AdminOrderView {
  order: any
  assigned_admin: { id: string; name: string; email: string } | null
  rounds: any[]
  initial_docs: any[]
  questionnaire_answers: Array<{ question_key: string; response_value: any }>
  questionnaire_questions: Array<{
    question_key: string
    question_label: string
    question_type: string
    options?: Array<{ value: string; label: string }>
    display_order: number
  }>
  admin_notes: any[]
  professionals_available: Array<{ id: string; full_name: string; display_name?: string; email: string; professional_type: string }>
  activity_log: any[]
  admin_names_map: Record<string, string>
}

export default async function AdminOrderPage({ params }: PageProps) {
  const { orderId } = await params
  const adminUser = await getAdminUser()
  if (!supabaseServer) redirect('/admin/login')

  // Single RPC call collapses the previous 9-query / 3-roundtrip waterfall.
  // The function does all the joins, aggregations, and admin-name lookups
  // server-side and returns one JSONB payload.
  const { data, error } = await supabaseServer
    .rpc('get_admin_order_view', { p_order_id: orderId })

  if (error || !data) {
    console.error('Admin order RPC failed:', JSON.stringify({ error, orderId }, null, 2))
    notFound()
  }

  const view = data as AdminOrderView
  if (!view.order) {
    notFound()
  }

  return (
    <OrderViewClient
      order={view.order}
      rounds={view.rounds || []}
      adminUser={adminUser}
      initialDocs={view.initial_docs || []}
      questionnaireAnswers={view.questionnaire_answers || []}
      questionnaireQuestions={view.questionnaire_questions || []}
      adminNotes={(view.admin_notes || []) as any}
      professionals={view.professionals_available || []}
      adminNamesMap={view.admin_names_map || {}}
      assignedAdmin={view.assigned_admin}
      initialActivityLog={view.activity_log || []}
    />
  )
}
