'use client'

import { useState, useEffect, useMemo, Suspense } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import { getClient } from '@/lib/supabase'
import { useAuthStore } from '@/lib/stores/auth-store'
import {
  DashboardOrderCard,
  ComplianceScoreGauge,
  DocumentVaultSection,
  AccountInfoCard,
} from '@/components/profile'
import {
  Building2,
  MapPin,
  Gift,
  Copy,
  Check,
  Loader2,
  Package,
  History,
  ArrowRight,
  Headphones,
  Phone,
} from 'lucide-react'
import Link from 'next/link'
import type { ProfileInitialData } from './page'

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Puducherry', 'Chandigarh',
]

interface OrderData {
  id: string
  order_number: string
  status: string
  total_paisa_snapshot: number
  created_at: string
  questionnaire_completed_at?: string | null
  service_package: {
    name: string
    slug: string
    sla_working_days?: number
    workflow_stages?: Array<{ title: string }>
  }
  documents_pending?: number
  current_stage?: string
  progress?: number
  questionnaire_completed?: boolean
  work_docs_pending?: number
  work_docs_rejected?: number
}

interface RetainerData {
  id: string
  status: string
  monthly_price_paisa: number
  next_billing_date: string
  current_cycle_end?: string
  service_package: {
    name: string
  }
}

interface DocumentGroup {
  orderId: string
  orderNumber: string
  serviceName: string
  documents: Array<{
    id: string
    name: string
    type: 'deliverable' | 'input'
    url: string
    uploadedAt: string
  }>
}

interface ComplianceObligation {
  id: string
  status: string
  due_date: string
}

interface DashboardData {
  active_orders: Array<{
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
      sla_working_days: number
      workflow_stages?: Array<{ title: string }>
    }
  }>
  completed_orders: Array<{
    id: string
    order_number: string
    status: string
    total_paisa_snapshot: number
    created_at: string
    service_package: {
      id: string
      name: string
      slug: string
    }
  }>
  retainers: RetainerData[]
  compliance: ComplianceObligation[]
  doc_counts: Record<string, { total: number; uploaded: number }>
  stage_histories: Record<string, number>
  work_doc_counts: Record<string, { pending: number; rejected: number }>
  document_groups: Array<{
    order_id: string
    order_number: string
    service_name: string
    documents: Array<{
      id: string
      name: string
      type: string
      url: string
      uploaded_at: string
    }>
  }>
}

interface UserData {
  id: string
  business_name?: string
  email?: string
  phone?: string
  business_type?: string
  state?: string
  city?: string
  address?: string
  pan_number?: string
  aadhaar_number?: string
  referral_code?: string
  referral_credit_paisa?: number
  referral_credit_balance_paisa?: number
  gstin?: string
  cin?: string
  din?: string
  tan?: string
  iec?: string
  fssai_number?: string
  udyam_number?: string
  shop_establishment_number?: string
  pt_number?: string
  trademark_number?: string
}

interface ProfilePageClientProps {
  userData: UserData
  isSetup: boolean
  initialData?: ProfileInitialData | null
}

function ProfileContent({ userData, isSetup, initialData }: ProfilePageClientProps) {
  const router = useRouter()
  const { refreshSession, isHydrated, isLoading: authLoading } = useAuthStore()

  const [isSaving, setIsSaving] = useState(false)
  const [copied, setCopied] = useState(false)

  // Only show loading if no initial data was provided from server
  const [isLoading, setIsLoading] = useState(!initialData)

  // Initialize dashboard data with server data if available
  const [dashboardData, setDashboardData] = useState<DashboardData>(() => {
    if (initialData) {
      // Build document groups from server data
      const orderMap = new Map(initialData.vault_orders.map(o => [o.id, o]))
      const docsByOrder: Record<string, typeof initialData.vault_documents> = {}

      initialData.vault_documents.forEach(d => {
        if (orderMap.has(d.order_id)) {
          if (!docsByOrder[d.order_id]) docsByOrder[d.order_id] = []
          docsByOrder[d.order_id].push(d)
        }
      })

      const document_groups = initialData.vault_orders
        .filter(order => docsByOrder[order.id]?.length > 0)
        .map(order => ({
          order_id: order.id,
          order_number: order.order_number,
          service_name: order.service_package?.name || 'Service',
          documents: docsByOrder[order.id].map(d => ({
            id: d.id,
            name: d.document_label || d.file_name || 'Document',
            type: d.verified_at ? 'deliverable' : 'input',
            url: d.file_url!,
            uploaded_at: d.uploaded_at || '',
          })),
        }))

      return {
        active_orders: initialData.active_orders.map(o => ({
          ...o,
          service_package: {
            id: o.service_package?.id || '',
            name: o.service_package?.name || 'Service',
            slug: o.service_package?.slug || '',
            sla_working_days: o.service_package?.sla_working_days || 0,
            workflow_stages: o.service_package?.workflow_stages,
          }
        })) as DashboardData['active_orders'],
        completed_orders: initialData.completed_orders.map(o => ({
          ...o,
          service_package: {
            id: o.service_package?.id || '',
            name: o.service_package?.name || 'Service',
            slug: o.service_package?.slug || '',
          }
        })) as DashboardData['completed_orders'],
        retainers: initialData.retainers.map(r => ({
          ...r,
          service_package: { name: r.service_package?.name || 'Retainer' }
        })),
        compliance: initialData.compliance,
        doc_counts: initialData.doc_counts || {},
        stage_histories: initialData.stage_histories || {},
        work_doc_counts: initialData.work_doc_counts || {},
        document_groups,
      }
    }

    return {
      active_orders: [],
      completed_orders: [],
      retainers: [],
      compliance: [],
      doc_counts: {},
      stage_histories: {},
      work_doc_counts: {},
      document_groups: [],
    }
  })

  // Form state
  const [businessName, setBusinessName] = useState(userData.business_name || '')
  const [email, setEmail] = useState(userData.email || '')
  const [businessType, setBusinessType] = useState(userData.business_type || '')
  const [state, setState] = useState(userData.state || '')
  const [city, setCity] = useState(userData.city || '')
  const [panNumber, setPanNumber] = useState(userData.pan_number || '')
  const [aadhaarNumber, setAadhaarNumber] = useState(userData.aadhaar_number || '')

  // Fetch data client-side only as fallback when server data not available
  useEffect(() => {
    if (!isHydrated || authLoading) return

    // Server already provided all data including dependent queries — no client fetch needed
    if (initialData) {
      setIsLoading(false)
      return
    }

    // Fallback: full client-side fetch
    fetchAllDashboardData()
  }, [isHydrated, authLoading, initialData])

  // Full client-side fetch - only used as fallback when server data not available
  const fetchAllDashboardData = async () => {
    try {
      const supabase = getClient()

      // BATCH 1: Fetch ALL independent queries in parallel
      const [
        activeResult,
        completedResult,
        retainersResult,
        allOrdersResult,
        vaultDocsResult,
        complianceResult
      ] = await Promise.all([
        // Active orders
        supabase.rpc('get_user_orders', {
          p_statuses: ['pending_assignment', 'waitlisted', 'in_progress']
        }),
        // Completed orders
        supabase.rpc('get_user_orders', {
          p_statuses: ['completed']
        }),
        // Retainers - no dependency on orders
        supabase
          .from('retainer_subscriptions')
          .select(`
            id,
            status,
            monthly_price_paisa,
            next_billing_date,
            service_package:service_packages (
              name
            )
          `)
          .neq('status', 'cancelled'),
        // All orders for vault - exclude pending_payment so eager-created
        // orphan orders (from /checkout pre-fetch) don't appear in the user's
        // document vault as empty entries.
        supabase
          .from('orders')
          .select('id, order_number, service_package:service_packages(name)')
          .neq('status', 'pending_payment')
          .order('created_at', { ascending: false })
          .limit(50),
        // Vault documents - no dependency
        supabase
          .from('order_documents')
          .select('id, order_id, document_label, file_name, file_url, uploaded_at, verified_at')
          .not('file_url', 'is', null)
          .order('uploaded_at', { ascending: false })
          .limit(200),
        // Compliance - no dependency
        supabase
          .from('compliance_obligations')
          .select('id, status, due_date')
          .order('due_date', { ascending: true })
      ])

      if (activeResult.error) console.error('Error fetching active orders:', activeResult.error)
      if (completedResult.error) console.error('Error fetching completed orders:', completedResult.error)

      // Transform RPC results to match expected format
      const activeOrders = (Array.isArray(activeResult.data) ? activeResult.data : []).slice(0, 5).map((o: any) => ({
        id: o.id,
        order_number: o.order_number,
        status: o.status,
        total_paisa_snapshot: o.total_paisa_snapshot,
        created_at: o.created_at,
        questionnaire_completed_at: o.questionnaire_completed_at,
        service_package: o.service_package,
      }))

      const completedOrders = (Array.isArray(completedResult.data) ? completedResult.data : []).slice(0, 10).map((o: any) => ({
        id: o.id,
        order_number: o.order_number,
        status: o.status,
        total_paisa_snapshot: o.total_paisa_snapshot,
        created_at: o.created_at,
        service_package: o.service_package,
      }))

      // Get order IDs for dependent queries
      const activeOrderIds = activeOrders.map((o: any) => o.id)

      // BATCH 2: Only queries that NEED activeOrderIds
      let docCountsResult: { data: any; error: any } = { data: null, error: null }
      let stagesResult: { data: any; error: any } = { data: null, error: null }
      let workDocsResult: { data: any; error: any } = { data: null, error: null }

      if (activeOrderIds.length > 0) {
        const [docCounts, stages, workDocs] = await Promise.all([
          // Document counts - needs activeOrderIds
          supabase
            .from('order_documents')
            .select('order_id, uploaded_at')
            .in('order_id', activeOrderIds)
            .eq('is_required', true),
          // Stage history - needs activeOrderIds
          supabase
            .from('order_stage_history')
            .select('order_id, completed_at')
            .in('order_id', activeOrderIds),
          // Work docs - needs activeOrderIds
          supabase
            .from('order_work_documents')
            .select('order_id, status')
            .in('order_id', activeOrderIds)
            .eq('direction', 'from_customer')
        ])
        docCountsResult = docCounts
        stagesResult = stages
        workDocsResult = workDocs
      }

      if (retainersResult.error) console.error('Error fetching retainers:', retainersResult.error)

      // Process document counts
      let docCounts: Record<string, { total: number; uploaded: number }> = {}
      if (docCountsResult.data) {
        docCountsResult.data.forEach((d: any) => {
          if (!docCounts[d.order_id]) {
            docCounts[d.order_id] = { total: 0, uploaded: 0 }
          }
          docCounts[d.order_id].total++
          if (d.uploaded_at) docCounts[d.order_id].uploaded++
        })
      }

      // Process stage histories
      let stageHistories: Record<string, number> = {}
      if (stagesResult.data) {
        stagesResult.data.forEach((s: any) => {
          if (s.completed_at) {
            stageHistories[s.order_id] = (stageHistories[s.order_id] || 0) + 1
          }
        })
      }

      // Process work document counts
      let workDocCounts: Record<string, { pending: number; rejected: number }> = {}
      if (workDocsResult.data) {
        workDocsResult.data.forEach((w: any) => {
          if (!workDocCounts[w.order_id]) {
            workDocCounts[w.order_id] = { pending: 0, rejected: 0 }
          }
          if (w.status === 'pending') workDocCounts[w.order_id].pending++
          if (w.status === 'rejected') workDocCounts[w.order_id].rejected++
        })
      }

      // Process vault documents
      let documentGroups: Array<{
        order_id: string
        order_number: string
        service_name: string
        documents: Array<{
          id: string
          name: string
          type: string
          url: string
          uploaded_at: string
        }>
      }> = []

      const allOrders = allOrdersResult.data
      const vaultDocs = vaultDocsResult.data
      if (allOrders && allOrders.length > 0 && vaultDocs && vaultDocs.length > 0) {
        // Create a map of order IDs to order info for quick lookup
        const orderMap = new Map(allOrders.map(o => [o.id, o]))

        // Group vault docs by order_id, only for orders we know about
        const docsByOrder: Record<string, typeof vaultDocs> = {}
        vaultDocs.forEach(d => {
          if (orderMap.has(d.order_id)) {
            if (!docsByOrder[d.order_id]) docsByOrder[d.order_id] = []
            docsByOrder[d.order_id].push(d)
          }
        })

        allOrders.forEach(order => {
          const orderDocs = docsByOrder[order.id]
          if (orderDocs && orderDocs.length > 0) {
            const sp = Array.isArray(order.service_package) ? order.service_package[0] : order.service_package
            documentGroups.push({
              order_id: order.id,
              order_number: order.order_number,
              service_name: (sp as { name: string })?.name || 'Service',
              documents: orderDocs.map(d => ({
                id: d.id,
                name: d.document_label || d.file_name || 'Document',
                type: d.verified_at ? 'deliverable' : 'input',
                url: d.file_url!,
                uploaded_at: d.uploaded_at || '',
              })),
            })
          }
        })
      }

      // Transform retainers data (Supabase returns joined data as arrays)
      const transformedRetainers = (retainersResult.data || []).map((r: any) => ({
        ...r,
        service_package: Array.isArray(r.service_package) ? r.service_package[0] : r.service_package,
      }))

      // Process compliance obligations
      const complianceObligations: ComplianceObligation[] = complianceResult.data || []

      setDashboardData({
        active_orders: activeOrders as DashboardData['active_orders'],
        completed_orders: completedOrders as DashboardData['completed_orders'],
        retainers: transformedRetainers as DashboardData['retainers'],
        compliance: complianceObligations,
        doc_counts: docCounts,
        stage_histories: stageHistories,
        work_doc_counts: workDocCounts,
        document_groups: documentGroups,
      })
    } catch (err) {
      console.error('Failed to fetch dashboard:', err)
    } finally {
      setIsLoading(false)
    }
  }

  // Process dashboard data (memoized to avoid recalculation on every render)
  const processedData = useMemo(() => {
    const initialDashboardData = dashboardData
    const docCounts = initialDashboardData.doc_counts || {}
    const stageHistories = initialDashboardData.stage_histories || {}
    const workDocCounts = initialDashboardData.work_doc_counts || {}

    // Process active orders with progress calculation
    const activeOrders: OrderData[] = (initialDashboardData.active_orders || []).map(order => {
      const workflowStages = order.service_package?.workflow_stages || []
      const totalStages = workflowStages.length || 1
      const completedStages = stageHistories[order.id] || 0

      // Calculate progress
      let baseProgress = 0
      if (order.status === 'pending_assignment') baseProgress = 5
      else if (order.status === 'in_progress') baseProgress = 10

      const stageProgress = totalStages > 0
        ? Math.round((completedStages / totalStages) * 85)
        : 0

      const progress = Math.min(95, baseProgress + stageProgress)

      // Get current stage name
      const currentStageIndex = Math.min(completedStages, workflowStages.length - 1)
      const currentStage = workflowStages[currentStageIndex]?.title ||
        (order.status === 'pending_assignment' ? 'Assigning Professional' : 'Processing')

      // Calculate pending documents
      const orderDocs = docCounts[order.id] || { total: 0, uploaded: 0 }
      const documentsPending = orderDocs.total - orderDocs.uploaded

      // Calculate work documents status
      const orderWorkDocs = workDocCounts[order.id] || { pending: 0, rejected: 0 }

      return {
        ...order,
        progress,
        current_stage: currentStage,
        documents_pending: documentsPending > 0 ? documentsPending : undefined,
        questionnaire_completed: !!order.questionnaire_completed_at,
        work_docs_pending: orderWorkDocs.pending > 0 ? orderWorkDocs.pending : undefined,
        work_docs_rejected: orderWorkDocs.rejected > 0 ? orderWorkDocs.rejected : undefined,
      }
    })

    // Process completed orders
    const completedOrders: OrderData[] = (initialDashboardData.completed_orders || []).map(o => ({
      ...o,
      progress: 100,
    }))

    // Process retainers
    const retainers: RetainerData[] = initialDashboardData.retainers || []

    // Process document groups for vault
    const documentGroups: DocumentGroup[] = (initialDashboardData.document_groups || [])
      .filter(g => g.documents && g.documents.length > 0)
      .map(g => ({
        orderId: g.order_id,
        orderNumber: g.order_number,
        serviceName: g.service_name,
        documents: g.documents.map(d => ({
          id: d.id,
          name: d.name,
          type: d.type as 'deliverable' | 'input',
          url: d.url,
          uploadedAt: d.uploaded_at || '',
        })),
      }))

    // Process compliance data
    const complianceData = initialDashboardData.compliance || []
    const today = new Date().toISOString().split('T')[0]
    const thirtyDaysFromNow = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

    let complianceScore = 0
    let upcomingDeadlines = 0
    let overdueCount = 0
    let hasComplianceData = false

    if (complianceData.length > 0) {
      hasComplianceData = true

      overdueCount = complianceData.filter(c =>
        c.status !== 'completed' && c.status !== 'waived' && c.due_date < today
      ).length

      upcomingDeadlines = complianceData.filter(c =>
        c.status !== 'completed' && c.status !== 'waived' &&
        c.due_date >= today && c.due_date <= thirtyDaysFromNow
      ).length

      complianceScore = Math.max(0, Math.min(100, 100 - (overdueCount * 15) - (upcomingDeadlines * 2)))
    }

    return {
      activeOrders,
      completedOrders,
      retainers,
      documentGroups,
      complianceScore,
      upcomingDeadlines,
      overdueCount,
      hasComplianceData,
    }
  }, [dashboardData])

  const handleSave = async () => {
    setIsSaving(true)

    try {
      const supabase = getClient()

      const { error } = await supabase
        .from('users')
        .update({
          business_name: businessName,
          email: email || null,
          business_type: businessType || null,
          state,
          city,
          pan_number: panNumber || null,
          aadhaar_number: aadhaarNumber || null,
        })
        .eq('id', userData.id)

      if (error) throw error

      await refreshSession()

      if (isSetup) {
        router.push('/')
      }
    } catch (err) {
      console.error('Failed to save profile:', err)
    } finally {
      setIsSaving(false)
    }
  }

  const copyReferralCode = () => {
    if (!userData.referral_code) return
    navigator.clipboard.writeText(userData.referral_code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Setup mode - show simplified form
  if (isSetup) {
    return (
      <div className="container py-12 max-w-2xl">
        <div className="mb-8">
          <p className="font-mono text-sm uppercase tracking-[0.3em] text-muted-foreground mb-2">
            Get Started
          </p>
          <h1 className="text-3xl md:text-4xl font-semibold text-foreground tracking-tight mb-1">
            Complete Your Profile
          </h1>
          <p className="text-muted-foreground">
            Tell us about your business to get started
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="px-6 py-4 border-b border-border/50">
            <div className="flex items-center gap-3">
              <Building2 className="h-5 w-5 text-muted-foreground" />
              <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
                Business Details
              </span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              This information helps us provide accurate pricing and services
            </p>
          </div>
          <div className="p-6 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="businessName">Business Name</Label>
              <Input
                id="businessName"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="Enter your business name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="businessType">Entity Type</Label>
              <select
                id="businessType"
                value={businessType}
                onChange={(e) => setBusinessType(e.target.value)}
                className="flex h-11 w-full rounded-lg border border-border bg-background px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring appearance-none"
              >
                <option value="">Select entity type</option>
                <option value="sole_proprietorship">Sole Proprietorship</option>
                <option value="partnership">Partnership</option>
                <option value="pvt_ltd">Private Limited</option>
                <option value="llp">LLP</option>
                <option value="opc">One Person Company</option>
                <option value="not_registered">Not Registered</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <select
                  id="state"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="flex h-11 w-full rounded-lg border border-border bg-background pl-11 pr-4 py-2 text-sm text-foreground placeholder:text-muted-foreground transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring appearance-none"
                >
                  <option value="">Select your state</option>
                  {INDIAN_STATES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Enter your city"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="panNumber">PAN Number</Label>
              <Input
                id="panNumber"
                value={panNumber}
                onChange={(e) => setPanNumber(e.target.value.toUpperCase())}
                placeholder="ABCDE1234F"
                maxLength={10}
                className="font-mono"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="aadhaarNumber">Aadhaar Number</Label>
              <Input
                id="aadhaarNumber"
                value={aadhaarNumber}
                onChange={(e) => setAadhaarNumber(e.target.value.replace(/\D/g, ''))}
                placeholder="123456789012"
                maxLength={12}
                className="font-mono"
              />
            </div>

            <Button onClick={handleSave} disabled={isSaving} className="w-full">
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save & Continue'
              )}
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Dashboard mode - show full dashboard
  return (
    <div className="container py-12 max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="font-mono text-sm uppercase tracking-[0.3em] text-muted-foreground mb-2">
            Dashboard
          </p>
          <h1 className="text-3xl md:text-4xl font-semibold text-foreground tracking-tight mb-1">
            Profile
          </h1>
          <p className="text-muted-foreground">Manage your account and view orders</p>
        </div>
      </div>

      {/* Loading state - skeleton that matches page layout */}
      {isLoading && (
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content (2/3) */}
          <div className="lg:col-span-2 space-y-8">
            {/* Active Orders Section */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <Skeleton className="h-4 w-32" />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                {[1, 2].map((i) => (
                  <div key={i} className="rounded-xl border border-border bg-card p-5">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <Skeleton className="h-5 w-32" />
                          <Skeleton className="h-3 w-20" />
                        </div>
                        <Skeleton className="h-5 w-20" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <Skeleton className="h-3 w-24" />
                          <Skeleton className="h-3 w-8" />
                        </div>
                        <Skeleton className="h-2 w-full rounded-full" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Document Vault Section */}
            <section>
              <div className="rounded-xl border border-border bg-card overflow-hidden">
                <div className="px-6 py-4 border-b border-border/50">
                  <Skeleton className="h-3 w-28" />
                </div>
                <div className="p-4 space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center justify-between py-2">
                      <div className="flex items-center gap-3">
                        <Skeleton className="h-10 w-10 rounded-lg" />
                        <div className="space-y-1">
                          <Skeleton className="h-4 w-36" />
                          <Skeleton className="h-3 w-24" />
                        </div>
                      </div>
                      <Skeleton className="h-8 w-8 rounded-md" />
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>

          {/* Sidebar (1/3) */}
          <div className="space-y-6">
            {/* Account Info Card Skeleton */}
            <div className="rounded-xl border border-border bg-card overflow-hidden">
              <div className="px-6 py-4 border-b border-border/50">
                <Skeleton className="h-3 w-32" />
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-14 w-14 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
                {[1, 2, 3].map((i) => (
                  <div key={i} className="space-y-1">
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-5 w-full" />
                  </div>
                ))}
                <Skeleton className="h-9 w-full mt-4" />
              </div>
            </div>

            {/* Help Card Skeleton */}
            <div className="rounded-xl border border-border bg-card overflow-hidden">
              <div className="px-6 py-4 border-b border-border/50">
                <Skeleton className="h-3 w-24" />
              </div>
              <div className="p-6">
                <Skeleton className="h-4 w-36 mb-3" />
                <Skeleton className="h-5 w-32" />
              </div>
            </div>
          </div>
        </div>
      )}

      {!isLoading && (
        <>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content (2/3) */}
        <div className="lg:col-span-2 space-y-8">
          {/* Active Orders */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4 text-muted-foreground" />
                <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
                  Active Orders
                </span>
              </div>
              {processedData.activeOrders.length > 0 && (
                <Link href="/orders">
                  <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground">
                    View All
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              )}
            </div>

            {processedData.activeOrders.length > 0 ? (
              <div className="grid sm:grid-cols-2 gap-4">
                {processedData.activeOrders.map((order) => (
                  <DashboardOrderCard
                    key={order.id}
                    orderId={order.id}
                    orderNumber={order.order_number}
                    serviceName={order.service_package?.name || 'Service'}
                    status={order.status}
                    currentStage={order.current_stage}
                    progress={order.progress || 0}
                    documentsNeeded={order.documents_pending}
                    questionnaireCompleted={order.questionnaire_completed}
                    workDocsPending={order.work_docs_pending}
                    workDocsRejected={order.work_docs_rejected}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-border bg-card p-8 text-center">
                <Package className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground mb-3">No active orders</p>
                <Link href="/services">
                  <Button>Browse Services</Button>
                </Link>
              </div>
            )}
          </section>

          {/* Document Vault */}
          <section>
            <DocumentVaultSection documentGroups={processedData.documentGroups} />
          </section>

          {/* Completed Orders */}
          {processedData.completedOrders.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <History className="h-4 w-4 text-muted-foreground" />
                  <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
                    Completed ({processedData.completedOrders.length})
                  </span>
                </div>
                <Link href="/orders?status=completed">
                  <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground">
                    View All
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              </div>
              <div className="rounded-xl border border-border bg-card overflow-hidden">
                <div className="p-4">
                  <div className="space-y-3">
                    {processedData.completedOrders.slice(0, 3).map((order) => (
                      <Link
                        key={order.id}
                        href={`/orders/${order.id}`}
                        className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/30 transition-colors"
                      >
                        <div>
                          <p className="font-medium text-foreground text-sm">
                            {order.service_package?.name}
                          </p>
                          <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">{order.order_number}</p>
                        </div>
                        <Check className="h-4 w-4 text-[hsl(var(--ollvy-green))]" />
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          )}
        </div>

        {/* Sidebar (1/3) */}
        <div className="space-y-6">
          {/* Account Info */}
          <AccountInfoCard
            businessName={userData.business_name}
            phone={userData.phone || null}
            email={userData.email}
            businessType={userData.business_type as 'sole_proprietorship' | 'partnership' | 'pvt_ltd' | 'llp' | 'opc' | 'not_registered' | undefined}
            state={userData.state}
            city={userData.city}
            address={userData.address}
            panNumber={userData.pan_number}
            aadhaarNumber={userData.aadhaar_number}
            registrationNumbers={{
              gstin: userData.gstin,
              cin: userData.cin,
              din: userData.din,
              tan: userData.tan,
              iec: userData.iec,
              fssaiNumber: userData.fssai_number,
              udyamNumber: userData.udyam_number,
              shopEstablishmentNumber: userData.shop_establishment_number,
              ptNumber: userData.pt_number,
              trademarkNumber: userData.trademark_number,
            }}
            avatarInitial={
              userData.business_name?.charAt(0) || userData.email?.charAt(0) || userData.phone?.charAt(0) || 'U'
            }
            onSave={async (data) => {
              const supabase = getClient()
              const { error } = await supabase
                .from('users')
                .update({
                  business_name: data.businessName,
                  email: data.email || null,
                  business_type: data.businessType || null,
                  state: data.state,
                  city: data.city,
                  address: data.address,
                  pan_number: data.panNumber || null,
                  aadhaar_number: data.aadhaarNumber || null,
                })
                .eq('id', userData.id)

              if (error) throw error

              await refreshSession()
            }}
          />

          {/* Contact Support */}
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="px-6 py-4 border-b border-border/50">
              <div className="flex items-center gap-2">
                <Headphones className="h-4 w-4 text-muted-foreground" />
                <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
                  Need Help?
                </span>
              </div>
            </div>
            <div className="p-6">
              <p className="text-sm text-muted-foreground mb-3">
                Contact us for any issues
              </p>
              <a href="tel:+919217065577" className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors">
                <Phone className="h-4 w-4" />
                +91 92170 65577
              </a>
            </div>
          </div>

          {/* Compliance Score */}
          {processedData.hasComplianceData && (
            <ComplianceScoreGauge
              score={processedData.complianceScore}
              upcomingDeadlines={processedData.upcomingDeadlines}
              overdueCount={processedData.overdueCount}
            />
          )}

          {/* Referral */}
          {userData.referral_code && (
            <div className="rounded-xl border border-border bg-card overflow-hidden">
              <div className="px-6 py-4 border-b border-border/50">
                <div className="flex items-center gap-2">
                  <Gift className="h-4 w-4 text-muted-foreground" />
                  <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
                    Referral Program
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Share your code and earn credits
                </p>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-muted rounded-lg px-4 py-3 font-mono text-lg text-foreground">
                    {userData.referral_code}
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={copyReferralCode}
                    className="h-12 w-12"
                  >
                    {copied ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      <Copy className="h-5 w-5" />
                    )}
                  </Button>
                </div>
                {((userData.referral_credit_paisa ?? 0) > 0 || (userData.referral_credit_balance_paisa ?? 0) > 0) && (
                  <p className="text-sm text-muted-foreground mt-4">
                    Current balance:{' '}
                    <span className="text-foreground font-medium font-mono">
                      {'\u20B9'}{((userData.referral_credit_paisa || userData.referral_credit_balance_paisa || 0) / 100).toFixed(0)}
                    </span>
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      </>
      )}
    </div>
  )
}

export function ProfilePageClient(props: ProfilePageClientProps) {
  return (
    <Suspense fallback={
      <div className="container py-12 max-w-5xl">
        <Skeleton className="h-10 w-48 mb-8" />
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-64 rounded-2xl" />
            <Skeleton className="h-48 rounded-2xl" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-48 rounded-2xl" />
            <Skeleton className="h-32 rounded-2xl" />
          </div>
        </div>
      </div>
    }>
      <ProfileContent {...props} />
    </Suspense>
  )
}
