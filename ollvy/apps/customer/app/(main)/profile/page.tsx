'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { getClient } from '@/lib/supabase'
import { useAuthStore } from '@/lib/stores/auth-store'
import {
  DashboardOrderCard,
  ComplianceScoreGauge,
  DocumentVaultSection,
  RetainerStatusCard,
  AccountInfoCard,
} from '@/components/profile'
import {
  User,
  Building2,
  MapPin,
  Gift,
  Copy,
  Check,
  Loader2,
  Crown,
  Package,
  History,
  ArrowRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import Link from 'next/link'

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
  service_package: {
    name: string
    slug: string
    sla_working_days: number
  }
  documents_pending?: number
  current_stage?: string
  progress?: number
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

function ProfileContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const isSetup = searchParams.get('setup') === 'true'
  const { user, isHydrated, isLoading: authLoading, refreshSession } = useAuthStore()

  const [isSaving, setIsSaving] = useState(false)
  const [copied, setCopied] = useState(false)

  // Form state
  const [businessName, setBusinessName] = useState('')
  const [state, setState] = useState('')
  const [city, setCity] = useState('')
  const [gstin, setGstin] = useState('')

  // Dashboard data
  const [activeOrders, setActiveOrders] = useState<OrderData[]>([])
  const [completedOrders, setCompletedOrders] = useState<OrderData[]>([])
  const [retainers, setRetainers] = useState<RetainerData[]>([])
  const [documentGroups, setDocumentGroups] = useState<DocumentGroup[]>([])
  const [isLoadingDashboard, setIsLoadingDashboard] = useState(true)

  // Compliance data
  const [complianceScore, setComplianceScore] = useState(0)
  const [upcomingDeadlines, setUpcomingDeadlines] = useState(0)
  const [overdueCount, setOverdueCount] = useState(0)
  const [hasComplianceData, setHasComplianceData] = useState(false)

  useEffect(() => {
    // Wait for auth to fully hydrate and load
    if (!isHydrated || authLoading) return

    if (!user) {
      router.push('/login?returnUrl=/profile')
      return
    }

    // Populate form with existing data
    setBusinessName(user.business_name || '')
    setState(user.state || '')
    setCity(user.city || '')
    setGstin(user.gstin || '')

    // Fetch dashboard data
    fetchDashboardData()
  }, [user, isHydrated, authLoading, router])

  const fetchDashboardData = async () => {
    if (!user) return

    setIsLoadingDashboard(true)
    try {
      const supabase = getClient()

      // Ensure session is set for RLS
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        await supabase.auth.setSession({
          access_token: session.access_token,
          refresh_token: session.refresh_token,
        })
      }

      // Use RPC function to bypass RLS chain issues
      const { data: ordersRpcData, error: ordersError } = await supabase
        .rpc('get_user_orders', {
          p_statuses: ['pending_assignment', 'in_progress', 'waitlisted']
        })

      if (ordersError) {
        console.error('[Profile] Error fetching orders:', ordersError)
      }

      // RPC returns JSON array
      const ordersData = Array.isArray(ordersRpcData) ? ordersRpcData.slice(0, 5) : []
      console.log('[Profile] Active orders found:', ordersData?.length || 0)

      // Fetch document counts for active orders
      const orderIds = (ordersData || []).map(o => o.id)
      let docCounts: Record<string, { total: number; uploaded: number }> = {}

      if (orderIds.length > 0) {
        const { data: docsData } = await supabase
          .from('order_documents')
          .select('order_id, uploaded_at, is_required')
          .in('order_id', orderIds)
          .eq('is_required', true)

        // Count documents per order
        ;(docsData || []).forEach(doc => {
          if (!docCounts[doc.order_id]) {
            docCounts[doc.order_id] = { total: 0, uploaded: 0 }
          }
          docCounts[doc.order_id].total++
          if (doc.uploaded_at) docCounts[doc.order_id].uploaded++
        })
      }

      // Fetch stage history for progress calculation
      let stageHistories: Record<string, number> = {}
      if (orderIds.length > 0) {
        const { data: historyData } = await supabase
          .from('order_stage_history')
          .select('order_id, completed_at')
          .in('order_id', orderIds)

        ;(historyData || []).forEach(h => {
          if (!stageHistories[h.order_id]) stageHistories[h.order_id] = 0
          if (h.completed_at) stageHistories[h.order_id]++
        })
      }

      // Fetch completed orders using RPC
      const { data: completedRpcData } = await supabase
        .rpc('get_user_orders', {
          p_statuses: ['completed']
        })

      // RPC returns JSON array
      const completedData = Array.isArray(completedRpcData) ? completedRpcData.slice(0, 10) : []

      // Fetch retainers
      const { data: retainersData } = await supabase
        .from('retainer_subscriptions')
        .select(`
          id,
          status,
          monthly_price_paisa,
          next_billing_date,
          service_package:service_packages(name)
        `)
        .eq('user_id', user.id)
        .neq('status', 'cancelled')

      // Process orders with actual progress calculation
      const processedOrders = (ordersData || []).map(order => {
        const workflowStages = (order.service_package as any)?.workflow_stages || []
        const totalStages = workflowStages.length || 1
        const completedStages = stageHistories[order.id] || 0

        // Calculate progress based on stage completion + base status progress
        let baseProgress = 0
        if (order.status === 'pending_assignment') baseProgress = 5
        else if (order.status === 'in_progress') baseProgress = 10

        const stageProgress = totalStages > 0
          ? Math.round((completedStages / totalStages) * 85)
          : 0

        const progress = Math.min(95, baseProgress + stageProgress)

        // Get current stage name
        const currentStageIndex = Math.min(completedStages, workflowStages.length - 1)
        const currentStage = workflowStages[currentStageIndex]?.stage_name ||
          (order.status === 'pending_assignment' ? 'Assigning Professional' : 'Processing')

        // Calculate pending documents
        const orderDocs = docCounts[order.id] || { total: 0, uploaded: 0 }
        const documentsPending = orderDocs.total - orderDocs.uploaded

        return {
          ...order,
          service_package: order.service_package as any,
          progress,
          current_stage: currentStage,
          documents_pending: documentsPending > 0 ? documentsPending : undefined,
        }
      })

      setActiveOrders(processedOrders)
      setCompletedOrders((completedData || []).map(o => ({
        ...o,
        service_package: o.service_package as any,
        progress: 100,
      })))
      setRetainers((retainersData || []).map(r => ({
        ...r,
        service_package: r.service_package as any,
      })))

      // Build document groups from ALL orders (active + completed)
      const allOrders = [...(ordersData || []), ...(completedData || [])]
      const allOrderIds = allOrders.map(o => o.id)
      const docGroups: DocumentGroup[] = []

      if (allOrderIds.length > 0) {
        const { data: allDocs } = await supabase
          .from('order_documents')
          .select('id, order_id, document_label, file_url, file_name, uploaded_at, verified_at')
          .in('order_id', allOrderIds)
          .not('file_url', 'is', null) // Only documents with uploads
          .order('uploaded_at', { ascending: false })

        // Group by order
        type DocType = NonNullable<typeof allDocs>[0]
        const groupedDocs: Record<string, DocType[]> = {}
        ;(allDocs || []).forEach(doc => {
          if (!groupedDocs[doc.order_id]) groupedDocs[doc.order_id] = []
          groupedDocs[doc.order_id].push(doc)
        })

        // Build groups from all orders
        allOrders.forEach(order => {
          const docs = groupedDocs[order.id]
          if (docs && docs.length > 0) {
            docGroups.push({
              orderId: order.id,
              orderNumber: order.order_number,
              serviceName: (order.service_package as any)?.name || 'Service',
              documents: docs.map(d => ({
                id: d.id,
                name: d.document_label || d.file_name || 'Document',
                type: d.verified_at ? 'deliverable' : 'input',
                url: d.file_url!,
                uploadedAt: d.uploaded_at || '',
              })),
            })
          }
        })
      }

      setDocumentGroups(docGroups)

      // Fetch compliance obligations for score calculation
      const today = new Date().toISOString().split('T')[0]
      const thirtyDaysFromNow = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

      const { data: complianceData } = await supabase
        .from('compliance_obligations')
        .select('id, status, due_date')
        .eq('user_id', user.id)

      if (complianceData && complianceData.length > 0) {
        setHasComplianceData(true)

        // Count overdue
        const overdue = complianceData.filter(c =>
          c.status !== 'completed' && c.status !== 'waived' && c.due_date < today
        ).length

        // Count upcoming (due within 30 days, not overdue)
        const upcoming = complianceData.filter(c =>
          c.status !== 'completed' && c.status !== 'waived' &&
          c.due_date >= today && c.due_date <= thirtyDaysFromNow
        ).length

        // Calculate score: 100 - (overdue * 15) - (upcoming * 2)
        // Each overdue item reduces score by 15, each upcoming by 2
        const calculatedScore = Math.max(0, Math.min(100, 100 - (overdue * 15) - (upcoming * 2)))

        setComplianceScore(calculatedScore)
        setUpcomingDeadlines(upcoming)
        setOverdueCount(overdue)
      } else {
        // No obligations - hide compliance section
        setHasComplianceData(false)
        setComplianceScore(0)
        setUpcomingDeadlines(0)
        setOverdueCount(0)
      }
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err)
    } finally {
      setIsLoadingDashboard(false)
    }
  }

  const handleSave = async () => {
    if (!user) return

    setIsSaving(true)

    try {
      const supabase = getClient()

      const { error } = await supabase
        .from('users')
        .update({
          business_name: businessName,
          state,
          city,
          gstin,
        })
        .eq('id', user.id)

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
    if (!user?.referral_code) return
    navigator.clipboard.writeText(user.referral_code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Calculate profile completeness
  const calculateProfileScore = () => {
    let score = 0
    if (businessName) score += 30
    if (state) score += 25
    if (city) score += 20
    if (gstin) score += 25
    return score
  }

  if (!user) {
    return (
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
    )
  }

  // Setup mode - show simplified form
  if (isSetup) {
    return (
      <div className="container py-12 max-w-2xl">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-foreground mb-1">
            Complete Your Profile
          </h1>
          <p className="text-muted-foreground">
            Tell us about your business to get started
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Building2 className="h-5 w-5 text-muted-foreground" />
              Business Details
            </CardTitle>
            <CardDescription>
              This information helps us provide accurate pricing and services
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
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
              <Label htmlFor="gstin">GSTIN (Optional)</Label>
              <Input
                id="gstin"
                value={gstin}
                onChange={(e) => setGstin(e.target.value.toUpperCase())}
                placeholder="22AAAAA0000A1Z5"
                maxLength={15}
              />
              <p className="text-xs text-muted-foreground">
                For businesses registered under GST
              </p>
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
          </CardContent>
        </Card>
      </div>
    )
  }

  // Dashboard mode - show full dashboard
  return (
    <div className="container py-12 max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-foreground mb-1">Profile</h1>
          <p className="text-muted-foreground">Manage your account and view orders</p>
        </div>
        {user.subscription_tier === 'pro' && (
          <Badge variant="default" className="gap-1.5">
            <Crown className="h-3 w-3" />
            Pro
          </Badge>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content (2/3) */}
        <div className="lg:col-span-2 space-y-8">
          {/* Active Orders */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-foreground flex items-center gap-2">
                <Package className="h-5 w-5 text-muted-foreground" />
                Active Orders
              </h2>
              {activeOrders.length > 0 && (
                <Link href="/orders">
                  <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground">
                    View All
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              )}
            </div>

            {isLoadingDashboard ? (
              <div className="space-y-4">
                <Skeleton className="h-40 rounded-xl" />
                <Skeleton className="h-40 rounded-xl" />
              </div>
            ) : activeOrders.length > 0 ? (
              <div className="grid sm:grid-cols-2 gap-4">
                {activeOrders.map((order) => (
                  <DashboardOrderCard
                    key={order.id}
                    orderId={order.id}
                    orderNumber={order.order_number}
                    serviceName={order.service_package?.name || 'Service'}
                    status={order.status}
                    currentStage={order.current_stage}
                    progress={order.progress || 0}
                    documentsNeeded={order.documents_pending}
                  />
                ))}
              </div>
            ) : (
              <Card className="border-dashed">
                <CardContent className="p-8 text-center">
                  <Package className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground mb-3">No active orders</p>
                  <Link href="/services">
                    <Button>Browse Services</Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </section>

          {/* Retainers */}
          {retainers.length > 0 && (
            <section>
              <h2 className="text-lg font-medium text-foreground mb-4">Active Retainers</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {retainers.map((retainer) => (
                  <RetainerStatusCard
                    key={retainer.id}
                    retainerId={retainer.id}
                    serviceName={retainer.service_package?.name || 'Retainer'}
                    status={retainer.status as any}
                    currentCycleEnd={retainer.current_cycle_end || ''}
                    nextBillingDate={retainer.next_billing_date || ''}
                    monthlyPrice={retainer.monthly_price_paisa}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Document Vault */}
          <section>
            <h2 className="text-lg font-medium text-foreground mb-4">Document Vault</h2>
            <DocumentVaultSection documentGroups={documentGroups} />
          </section>

          {/* Completed Orders */}
          {completedOrders.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium text-foreground flex items-center gap-2">
                  <History className="h-5 w-5 text-muted-foreground" />
                  Completed ({completedOrders.length})
                </h2>
                <Link href="/orders?status=completed">
                  <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground">
                    View All
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              </div>
              <Card>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    {completedOrders.slice(0, 3).map((order) => (
                      <Link
                        key={order.id}
                        href={`/orders/${order.id}`}
                        className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div>
                          <p className="font-medium text-foreground text-sm">
                            {order.service_package?.name}
                          </p>
                          <p className="text-xs text-muted-foreground font-mono">{order.order_number}</p>
                        </div>
                        <Check className="h-4 w-4 text-[hsl(var(--ollvy-green))]" />
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </section>
          )}
        </div>

        {/* Sidebar (1/3) */}
        <div className="space-y-6">
          {/* Account Info */}
          <AccountInfoCard
            businessName={user.business_name}
            phone={user.phone}
            state={user.state}
            city={user.city}
            isProUser={user.subscription_tier === 'pro'}
            avatarInitial={
              user.business_name?.charAt(0) || user.phone?.charAt(0) || 'U'
            }
            onSave={async (data) => {
              const supabase = getClient()
              const { error } = await supabase
                .from('users')
                .update({
                  business_name: data.businessName,
                  state: data.state,
                  city: data.city,
                })
                .eq('id', user.id)

              if (error) throw error

              // Refresh user data in auth store
              await refreshSession()
            }}
          />

          {/* Compliance Score - Only show when there are compliance obligations */}
          {hasComplianceData && (
            <ComplianceScoreGauge
              score={complianceScore}
              upcomingDeadlines={upcomingDeadlines}
              overdueCount={overdueCount}
            />
          )}

          {/* Referral */}
          {user.referral_code && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-3 text-base">
                  <Gift className="h-5 w-5 text-muted-foreground" />
                  Referral Program
                </CardTitle>
                <CardDescription>
                  Share your code and earn credits
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-muted rounded-lg px-4 py-3 font-mono text-lg text-foreground">
                    {user.referral_code}
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
                {((user.referral_credit_paisa ?? 0) > 0 || (user.referral_credit_balance_paisa ?? 0) > 0) && (
                  <p className="text-sm text-muted-foreground mt-4">
                    Current balance:{' '}
                    <span className="text-foreground font-medium font-mono">
                      {'\u20B9'}{((user.referral_credit_paisa || user.referral_credit_balance_paisa || 0) / 100).toFixed(0)}
                    </span>
                  </p>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

export default function ProfilePage() {
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
      <ProfileContent />
    </Suspense>
  )
}
