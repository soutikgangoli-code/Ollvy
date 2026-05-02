import { redirect } from 'next/navigation'
import { getUserFast, createServerSupabase, supabaseServer } from '@/lib/supabase-server'
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

interface OrderAddon {
  id: string
  addon_id: string
  addon_name: string
  price_paisa_snapshot: number
  govt_fee_paisa_snapshot: number
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
  const __tStart = performance.now()
  const { id: orderId } = await params
  const user = await getUserFast()
  const __tAuth = performance.now() - __tStart

  if (!user) {
    redirect(`/login?returnUrl=/orders/${orderId}`)
  }

  // Server-side data fetching — all queries in a single parallel batch
  // Queries that only need orderId run alongside the order fetch (no waterfall)
  const __tSetupStart = performance.now()
  const supabase = await createServerSupabase()
  const __tSetup = performance.now() - __tSetupStart

  const __tBatchStart = performance.now()
  const [
    orderResult, stageResult, docsResult, workDocsResult,
    invoiceResult, notificationResult, responsesResult, addonsResult
  ] = await Promise.all([
    // Core order data (RLS verifies user access)
    supabase
      .from('orders')
      .select(`
        *,
        professional:professionals(id, name, email, phone, specializations, avg_rating, total_ratings)
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
      .select('id, order_id, document_key, document_label, stage_key, is_required, uploaded_at, file_url, file_name, verified_at, verified_by, rejection_reason, created_at')
      .eq('order_id', orderId)
      .order('created_at', { ascending: false }),
    supabase
      .from('order_work_documents')
      .select('id, order_id, file_name, file_url, direction, status, tag, round_id, rejection_reason, created_at, updated_at')
      .eq('order_id', orderId)
      .order('created_at', { ascending: false }),
    // These only need orderId — no dependency on order result
    supabase
      .from('invoices')
      .select('id')
      .eq('order_id', orderId)
      .maybeSingle(),
    supabase
      .from('round_notifications')
      .select('id, order_id, round_id, round_title, message, is_dismissed, created_at')
      .eq('order_id', orderId)
      .eq('is_dismissed', false)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase
      .from('order_questionnaire_responses')
      .select('question_key, response_value')
      .eq('order_id', orderId),
    supabase
      .from('order_addons')
      .select('id, addon_id, addon_name, price_paisa_snapshot, govt_fee_paisa_snapshot')
      .eq('order_id', orderId),
  ])
  const __tBatch = performance.now() - __tBatchStart

  // If order not found or error, let client handle it
  if (orderResult.error || !orderResult.data) {
    return <OrderPageClient orderId={orderId} initialData={null} />
  }

  // Service package fetch — needs service_package_id from order result
  // Uses service role client to bypass RLS on inactive packages
  // NOTE: this is a SEQUENTIAL roundtrip after the batch above. Could be folded
  // into the batch with a service_packages join, but that needs RLS analysis
  // (current implementation uses service role specifically to surface inactive
  // packages that the customer-RLS query would hide).
  const __tSpStart = performance.now()
  const servicePackageResult = orderResult.data.service_package_id && supabaseServer
    ? await supabaseServer
        .from('service_packages')
        .select('id, name, slug, sla_working_days, workflow_stages, questionnaire, variants, whats_included')
        .eq('id', orderResult.data.service_package_id)
        .single()
    : { data: null, error: null }
  const __tSp = performance.now() - __tSpStart

  // Extract service package data
  const servicePackageData = servicePackageResult.data || null

  // Attach service_package to order data
  const orderWithServicePackage = {
    ...orderResult.data,
    service_package: servicePackageData
  }

  // Build questionnaire responses with labels
  let questionnaireResponses: QuestionnaireResponse[] = []
  if (responsesResult.data) {
    const questionnaire = (servicePackageData as { questionnaire?: Array<{ key: string; label: string }> } | null)?.questionnaire || []
    const questionLabels = new Map(
      questionnaire.map((q: { key: string; label: string }) => [q.key, q.label])
    )
    questionnaireResponses = (responsesResult.data || []).map((r: { question_key: string; response_value: string | string[] }) => ({
      question_key: r.question_key,
      question_label: questionLabels.get(r.question_key) || r.question_key,
      response_value: r.response_value,
    }))
  }

  const initialData = {
    order: orderWithServicePackage as Order,
    stageHistory: (stageResult.data || []) as OrderStageHistory[],
    documents: (docsResult.data || []) as OrderDocument[],
    workDocuments: (workDocsResult.data || []) as OrderWorkDocument[],
    invoiceId: invoiceResult.data?.id || null,
    roundNotification: (notificationResult.data as RoundNotification | null) || null,
    questionnaireResponses,
    orderAddons: (addonsResult.data || []) as OrderAddon[],
  }

  const __perfTimings = {
    auth: Math.round(__tAuth),
    setup: Math.round(__tSetup),
    batch: Math.round(__tBatch),
    servicePackage: Math.round(__tSp),
    total: Math.round(performance.now() - __tStart),
  }

  return <OrderPageClient orderId={orderId} initialData={initialData} __perfTimings={__perfTimings} />
}
