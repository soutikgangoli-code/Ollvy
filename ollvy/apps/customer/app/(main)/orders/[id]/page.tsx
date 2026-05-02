import { redirect } from 'next/navigation'
import { getUserFast, supabaseServer } from '@/lib/supabase-server'
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

  // Server-side data fetching — all queries in a single parallel batch.
  // Switched from createServerSupabase() (user-RLS) to supabaseServer
  // (service role) for the order query. The user-RLS client was returning
  // empty for orders the user clearly owns (e.g. those visible on /orders,
  // which uses service role for the same reason), causing this page to
  // fall back to client-side fetching for EVERYTHING on every load —
  // adding several seconds. Service role is the right call here:
  //   1. /orders already uses it for the same listing flow.
  //   2. We manually enforce ownership via .eq('user_id', user.id) below.
  //   3. The service_packages join (needed even for inactive packages) is
  //      now folded into this same request, eliminating the previous
  //      sequential roundtrip.
  const __tSetupStart = performance.now()
  const __tSetup = performance.now() - __tSetupStart

  if (!supabaseServer) {
    // Service role not configured — fall back to client-side fetching
    return <OrderPageClient orderId={orderId} initialData={null} />
  }

  const __tBatchStart = performance.now()
  const [
    orderResult, stageResult, docsResult, workDocsResult,
    invoiceResult, notificationResult, responsesResult, addonsResult
  ] = await Promise.all([
    // Core order data — service role + manual user ownership check.
    // Joins service_packages here so we don't pay a second roundtrip later.
    supabaseServer
      .from('orders')
      .select(`
        *,
        professional:professionals(id, name, email, phone, specializations, avg_rating, total_ratings),
        service_package:service_packages(id, name, slug, sla_working_days, workflow_stages, questionnaire, variants, whats_included)
      `)
      .eq('id', orderId)
      .eq('user_id', user.id)
      .single(),
    supabaseServer
      .from('order_stage_history')
      .select('*')
      .eq('order_id', orderId)
      .order('started_at', { ascending: true }),
    supabaseServer
      .from('order_documents')
      .select('id, order_id, document_key, document_label, stage_key, is_required, uploaded_at, file_url, file_name, verified_at, verified_by, rejection_reason, created_at')
      .eq('order_id', orderId)
      .order('created_at', { ascending: false }),
    supabaseServer
      .from('order_work_documents')
      .select('id, order_id, file_name, file_url, direction, status, tag, round_id, rejection_reason, created_at, updated_at')
      .eq('order_id', orderId)
      .order('created_at', { ascending: false }),
    // These only need orderId — no dependency on order result
    supabaseServer
      .from('invoices')
      .select('id')
      .eq('order_id', orderId)
      .maybeSingle(),
    supabaseServer
      .from('round_notifications')
      .select('id, order_id, round_id, round_title, message, is_dismissed, created_at')
      .eq('order_id', orderId)
      .eq('is_dismissed', false)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabaseServer
      .from('order_questionnaire_responses')
      .select('question_key, response_value')
      .eq('order_id', orderId),
    supabaseServer
      .from('order_addons')
      .select('id, addon_id, addon_name, price_paisa_snapshot, govt_fee_paisa_snapshot')
      .eq('order_id', orderId),
  ])
  const __tBatch = performance.now() - __tBatchStart

  // If order not found or user doesn't own it, let client handle it
  if (orderResult.error || !orderResult.data) {
    return <OrderPageClient orderId={orderId} initialData={null} />
  }

  // Service package now comes joined inside orderResult.data — no second
  // roundtrip needed. Keeping a tiny shim so the rest of the file's data
  // shape doesn't change.
  const __tSp = 0
  const servicePackageResult = {
    data: orderResult.data.service_package
      ? (Array.isArray(orderResult.data.service_package)
          ? orderResult.data.service_package[0]
          : orderResult.data.service_package)
      : null,
    error: null,
  }

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
