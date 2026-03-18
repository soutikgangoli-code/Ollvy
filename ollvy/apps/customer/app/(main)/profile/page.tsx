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
  const { user, refreshSession } = useAuthStore()

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

  useEffect(() => {
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
  }, [user, router])

  const fetchDashboardData = async () => {
    if (!user) return

    setIsLoadingDashboard(true)
    try {
      const supabase = getClient()

      // Fetch active orders
      const { data: ordersData } = await supabase
        .from('orders')
        .select(`
          id,
          order_number,
          status,
          total_paisa_snapshot,
          created_at,
          service_package:service_packages(name, slug, sla_working_days)
        `)
        .eq('user_id', user.id)
        .in('status', ['pending_assignment', 'in_progress', 'waitlisted'])
        .order('created_at', { ascending: false })
        .limit(5)

      // Fetch completed orders
      const { data: completedData } = await supabase
        .from('orders')
        .select(`
          id,
          order_number,
          status,
          total_paisa_snapshot,
          created_at,
          service_package:service_packages(name, slug, sla_working_days)
        `)
        .eq('user_id', user.id)
        .eq('status', 'completed')
        .order('created_at', { ascending: false })
        .limit(10)

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

      // Process orders with progress estimation
      const processedOrders = (ordersData || []).map(order => {
        // Estimate progress based on status
        let progress = 0
        if (order.status === 'pending_assignment') progress = 10
        else if (order.status === 'in_progress') progress = 50
        else if (order.status === 'completed') progress = 100

        return {
          ...order,
          service_package: order.service_package as any,
          progress,
          current_stage: order.status === 'pending_assignment' ? 'Assigning Professional' : 'Processing',
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

      // Build document groups from completed orders
      // In a real app, you'd fetch actual deliverable documents
      const docGroups: DocumentGroup[] = []
      // This would be populated from actual document data

      setDocumentGroups(docGroups)
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
                          <p className="text-xs text-muted-foreground">{order.order_number}</p>
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
          />

          {/* Compliance Score */}
          <ComplianceScoreGauge
            score={user.compliance_health_score || 0}
            upcomingDeadlines={0}
            overdueCount={0}
          />

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
