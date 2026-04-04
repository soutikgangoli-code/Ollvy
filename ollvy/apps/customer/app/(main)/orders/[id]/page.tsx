import { redirect } from 'next/navigation'
import { getUser, createServerSupabase } from '@/lib/supabase-server'
import { OrderPageClient } from './OrderPageClient'
import type { Order, OrderStageHistory, OrderWorkDocument } from '@/lib/types'

interface PageProps {
  params: Promise<{ id: string }>
}

interface OrderDocument {
  id: string
  document_key: string
  document_label: string
  stage_key?: string
  is_required: boolean
  uploaded_at?: string
  file_url?: string
  file_name?: string
  verified_at?: string
  verified_by?: string
  rejection_reason?: string
  created_at?: string
}

interface QuestionnaireResponse {
  question_key: string
  question_label: string
  response_value: string | string[]
}

interface RoundNotification {
  id: string
  order_id: string
  round_id: string
  round_title: string
  message: string
  is_dismissed: boolean
  created_at: string
}

export default async function OrderDetailPage({ params }: PageProps) {
  const { id: orderId } = await params
  const user = await getUser()

  if (!user) {
    redirect(`/login?returnUrl=/orders/${orderId}`)
  }

  // Server-side data fetching - much faster than client-side
  const supabase = await createServerSupabase()

  // Fetch all data in parallel server-side
  const [orderResult, stageResult, docsResult, workDocsResult] = await Promise.all([
    supabase
      .from('orders')
      .select(`
        *,
        service_package:service_packages(*),
        professional:professionals(*)
      `)
      .eq('id', orderId)
      .single(),
    supabase
      .from('order_stage_history')
      .select('*')
      .eq('order_id', orderId)
      .order('started_at', { ascending: true }),
    supabase
      .from('order_documents')
      .select('*')
      .eq('order_id', orderId)
      .order('created_at', { ascending: true }),
    supabase
      .from('order_work_documents')
      .select('*')
      .eq('order_id', orderId)
      .order('created_at', { ascending: false })
  ])

  // If order not found or error, let client handle it
  if (orderResult.error || !orderResult.data) {
    return <OrderPageClient orderId={orderId} initialData={null} />
  }

  // Fetch optional data (don't block on these)
  const [invoiceResult, notificationResult, responsesResult] = await Promise.allSettled([
    supabase
      .from('invoices')
      .select('id')
      .eq('order_id', orderId)
      .maybeSingle(),
    supabase
      .from('round_notifications')
      .select('*')
      .eq('order_id', orderId)
      .eq('is_dismissed', false)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase
      .from('order_questionnaire_responses')
      .select('question_key, response_value')
      .eq('order_id', orderId)
  ])

  // Build questionnaire responses with labels
  let questionnaireResponses: QuestionnaireResponse[] = []
  if (responsesResult.status === 'fulfilled' && responsesResult.value.data) {
    // Handle array case - Supabase can return service_package as an array due to join behavior
    const rawServicePackage = orderResult.data.service_package
    const servicePackage = (Array.isArray(rawServicePackage) ? rawServicePackage[0] : rawServicePackage) as { questionnaire?: Array<{ key: string; label: string }> } | undefined
    const questionnaire = servicePackage?.questionnaire || []
    const questionLabels = new Map(
      questionnaire.map((q: { key: string; label: string }) => [q.key, q.label])
    )
    questionnaireResponses = (responsesResult.value.data || []).map((r: { question_key: string; response_value: string | string[] }) => ({
      question_key: r.question_key,
      question_label: questionLabels.get(r.question_key) || r.question_key,
      response_value: r.response_value,
    }))
  }

  const initialData = {
    order: orderResult.data as Order,
    stageHistory: (stageResult.data || []) as OrderStageHistory[],
    documents: (docsResult.data || []) as OrderDocument[],
    workDocuments: (workDocsResult.data || []) as OrderWorkDocument[],
    invoiceId: invoiceResult.status === 'fulfilled' ? invoiceResult.value.data?.id || null : null,
    roundNotification: notificationResult.status === 'fulfilled' ? notificationResult.value.data as RoundNotification | null : null,
    questionnaireResponses,
  }

  return <OrderPageClient orderId={orderId} initialData={initialData} />
}
