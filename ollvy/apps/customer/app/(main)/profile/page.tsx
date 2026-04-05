import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getUser, supabaseServer } from '@/lib/supabase-server'
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
}

export default async function ProfilePage({ searchParams }: PageProps) {
  const params = await searchParams
  const isSetup = params.setup === 'true'

  const user = await getUser()

  if (!user) {
    redirect('/login?returnUrl=/profile')
  }

  // Server-side data fetching using service role client
  // This bypasses RLS, so we explicitly filter by user_id
  let initialData: ProfileInitialData | null = null

  if (supabaseServer) {
    try {
      // Parallel server-side fetches (service role bypasses RLS)
      const [ordersResult, retainersResult, complianceResult, vaultOrdersResult, vaultDocsResult] = await Promise.all([
        // All orders with service package info
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

        // Orders for vault (just id, order_number, service name)
        supabaseServer
          .from('orders')
          .select('id, order_number, service_package:service_packages(name)')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(50),

        // Vault documents
        supabaseServer
          .from('order_documents')
          .select('id, order_id, document_label, file_name, file_url, uploaded_at, verified_at')
          .not('file_url', 'is', null)
          .order('uploaded_at', { ascending: false })
          .limit(200)
      ])

      // Process orders into active/completed
      const orders = ordersResult.data || []
      const activeStatuses = ['pending_assignment', 'waitlisted', 'in_progress']

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

      // Transform vault orders
      const vault_orders: ServerVaultOrder[] = (vaultOrdersResult.data || []).map((o: any) => ({
        ...o,
        service_package: Array.isArray(o.service_package) ? o.service_package[0] : o.service_package
      }))

      // Filter vault documents to only those belonging to user's orders
      const userOrderIds = new Set(vault_orders.map(o => o.id))
      const vault_documents: ServerVaultDocument[] = (vaultDocsResult.data || [])
        .filter((d: any) => userOrderIds.has(d.order_id))

      initialData = {
        active_orders,
        completed_orders,
        retainers,
        compliance: complianceResult.data || [],
        vault_orders,
        vault_documents
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
