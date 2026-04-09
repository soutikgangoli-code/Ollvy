import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getUserFast, supabaseServer } from '@/lib/supabase-server'
import { ProfilePageClient } from './ProfilePageClient'

export const metadata: Metadata = {
  title: 'Profile | Ollvy',
  robots: 'noindex, nofollow',
}

interface PageProps {
  searchParams: Promise<{ setup?: string }>
}

// Types for server-side data
interface ServerOrderData {
  id: string
  order_number: string
  status: string
  total_paisa_snapshot: number
  created_at: string
  questionnaire_completed_at?: string | null
  service_package: {
    id: string
    name: string
    slug: string
    sla_working_days?: number
    workflow_stages?: Array<{ title: string }>
  } | null
}

interface ServerRetainerData {
  id: string
  status: string
  monthly_price_paisa: number
  next_billing_date: string
  current_cycle_end?: string
  service_package: { name: string } | null
}

interface ServerComplianceData {
  id: string
  status: string
  due_date: string
}

interface ServerVaultDocument {
  id: string
  order_id: string
  document_label: string
  file_name: string
  file_url: string | null
  uploaded_at: string
  verified_at: string | null
}

interface ServerVaultOrder {
  id: string
  order_number: string
  service_package: { name: string } | null
}

export interface ProfileInitialData {
  active_orders: ServerOrderData[]
  completed_orders: ServerOrderData[]
  retainers: ServerRetainerData[]
  compliance: ServerComplianceData[]
  vault_orders: ServerVaultOrder[]
  vault_documents: ServerVaultDocument[]
  doc_counts: Record<string, { total: number; uploaded: number }>
  stage_histories: Record<string, number>
  work_doc_counts: Record<string, { pending: number; rejected: number }>
}

export default async function ProfilePage({ searchParams }: PageProps) {
  const params = await searchParams
  const isSetup = params.setup === 'true'

  const user = await getUserFast()

  if (!user) {
    redirect('/login?returnUrl=/profile')
  }

  // Server-side data fetching using service role client
  // This bypasses RLS, so we explicitly filter by user_id
  let initialData: ProfileInitialData | null = null

  if (supabaseServer) {
    try {
      // Parallel server-side fetches (service role bypasses RLS)
      // Single orders query — used for both active/completed tabs AND vault
      const [ordersResult, retainersResult, complianceResult] = await Promise.all([
        supabaseServer
          .from('orders')
          .select(`
            id,
            order_number,
            status,
            total_paisa_snapshot,
            created_at,
            questionnaire_completed_at,
            service_package:service_packages(
              id,
              name,
              slug,
              sla_working_days,
              workflow_stages
            )
          `)
          .eq('user_id', user.id)
          .neq('status', 'pending_payment')
          .order('created_at', { ascending: false })
          .limit(50),

        // Retainer subscriptions
        supabaseServer
          .from('retainer_subscriptions')
          .select(`
            id,
            status,
            monthly_price_paisa,
            next_billing_date,
            current_cycle_end,
            service_package:service_packages(name)
          `)
          .eq('user_id', user.id)
          .neq('status', 'cancelled'),

        // Compliance obligations
        supabaseServer
          .from('compliance_obligations')
          .select('id, status, due_date')
          .eq('user_id', user.id)
          .order('due_date', { ascending: true }),
      ])

      const orders = ordersResult.data || []
      const orderIds = orders.map(o => o.id)

      // BATCH 2: Queries that depend on order IDs — run in parallel
      const activeStatuses = ['pending_assignment', 'waitlisted', 'in_progress']
      const activeOrderIds = orders.filter(o => activeStatuses.includes(o.status)).map(o => o.id)

      const [vaultDocsResult, docCountsResult, stagesResult, workDocsResult] = await Promise.all([
        // Vault documents — filtered to user's orders only (not full table scan)
        orderIds.length > 0
          ? supabaseServer
              .from('order_documents')
              .select('id, order_id, document_label, file_name, file_url, uploaded_at, verified_at')
              .in('order_id', orderIds)
              .not('file_url', 'is', null)
              .order('uploaded_at', { ascending: false })
              .limit(200)
          : Promise.resolve({ data: [], error: null }),
        // Document counts for active orders (moved from client)
        activeOrderIds.length > 0
          ? supabaseServer
              .from('order_documents')
              .select('order_id, uploaded_at')
              .in('order_id', activeOrderIds)
              .eq('is_required', true)
          : Promise.resolve({ data: [], error: null }),
        // Stage history for active orders (moved from client)
        activeOrderIds.length > 0
          ? supabaseServer
              .from('order_stage_history')
              .select('order_id, completed_at')
              .in('order_id', activeOrderIds)
          : Promise.resolve({ data: [], error: null }),
        // Work doc counts for active orders (moved from client)
        activeOrderIds.length > 0
          ? supabaseServer
              .from('order_work_documents')
              .select('order_id, status')
              .in('order_id', activeOrderIds)
              .eq('direction', 'from_customer')
          : Promise.resolve({ data: [], error: null }),
      ])

      // Transform service_package arrays to single objects (Supabase returns arrays for joins)
      const transformOrder = (o: any): ServerOrderData => ({
        ...o,
        service_package: Array.isArray(o.service_package) ? o.service_package[0] : o.service_package
      })

      const active_orders = orders
        .filter(o => activeStatuses.includes(o.status))
        .slice(0, 5)
        .map(transformOrder)

      const completed_orders = orders
        .filter(o => o.status === 'completed')
        .slice(0, 10)
        .map(transformOrder)

      // Transform retainers
      const retainers: ServerRetainerData[] = (retainersResult.data || []).map((r: any) => ({
        ...r,
        service_package: Array.isArray(r.service_package) ? r.service_package[0] : r.service_package
      }))

      // Vault orders reuse the same orders query (no second DB call)
      const vault_orders: ServerVaultOrder[] = orders.map((o: any) => ({
        id: o.id,
        order_number: o.order_number,
        service_package: Array.isArray(o.service_package) ? o.service_package[0] : o.service_package
      }))

      // Vault docs already filtered by user's order IDs at DB level
      const vault_documents: ServerVaultDocument[] = (vaultDocsResult.data || []) as ServerVaultDocument[]

      // Process dependent data server-side (eliminates client-side waterfall)
      const doc_counts: Record<string, { total: number; uploaded: number }> = {}
      if (docCountsResult.data) {
        (docCountsResult.data as any[]).forEach((d: any) => {
          if (!doc_counts[d.order_id]) doc_counts[d.order_id] = { total: 0, uploaded: 0 }
          doc_counts[d.order_id].total++
          if (d.uploaded_at) doc_counts[d.order_id].uploaded++
        })
      }

      const stage_histories: Record<string, number> = {}
      if (stagesResult.data) {
        (stagesResult.data as any[]).forEach((s: any) => {
          if (s.completed_at) stage_histories[s.order_id] = (stage_histories[s.order_id] || 0) + 1
        })
      }

      const work_doc_counts: Record<string, { pending: number; rejected: number }> = {}
      if (workDocsResult.data) {
        (workDocsResult.data as any[]).forEach((w: any) => {
          if (!work_doc_counts[w.order_id]) work_doc_counts[w.order_id] = { pending: 0, rejected: 0 }
          if (w.status === 'pending') work_doc_counts[w.order_id].pending++
          if (w.status === 'rejected') work_doc_counts[w.order_id].rejected++
        })
      }

      initialData = {
        active_orders,
        completed_orders,
        retainers,
        compliance: complianceResult.data || [],
        vault_orders,
        vault_documents,
        doc_counts,
        stage_histories,
        work_doc_counts,
      }
    } catch (err) {
      console.error('[Profile Page] Server-side fetch error:', err)
      // Fall back to client-side fetching
    }
  }

  return (
    <ProfilePageClient
      userData={user}
      isSetup={isSetup}
      initialData={initialData}
    />
  )
}
