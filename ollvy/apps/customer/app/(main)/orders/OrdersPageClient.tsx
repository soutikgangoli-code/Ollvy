'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { OrderCard } from '@/components/orders/OrderCard'
import { getClient } from '@/lib/supabase'
import { useAuthStore } from '@/lib/stores/auth-store'
import type { Order } from '@/lib/types'
import { Package, ArrowRight, ArrowLeft } from 'lucide-react'

interface OrdersPageClientProps {
  initialData?: { active: Order[]; completed: Order[] } | null
  __perfTimings?: {
    auth: number
    query: number
    total: number
    ordersCount: number
  }
}

export function OrdersPageClient({ initialData, __perfTimings }: OrdersPageClientProps) {
  const { session, user, isHydrated, isLoading: authLoading } = useAuthStore()

  // Initialize with server data if available
  const [activeOrders, setActiveOrders] = useState<Order[]>(initialData?.active || [])
  const [completedOrders, setCompletedOrders] = useState<Order[]>(initialData?.completed || [])

  // Only show loading if no initial data provided
  const [isLoading, setIsLoading] = useState(!initialData)

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // Perf instrumentation — see [orders-perf] lines in console.
  // Server timings come from page.tsx; client measures hydration + any
  // fallback fetch.
  useEffect(() => {
    const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined
    const sinceNav = nav ? Math.round(performance.now() - nav.startTime) : Math.round(performance.now())
    const ttfb = nav ? Math.round(nav.responseStart - nav.startTime) : null
    if (__perfTimings) {
      console.log(
        `[orders-perf] server: total=${__perfTimings.total}ms (auth=${__perfTimings.auth}ms, query=${__perfTimings.query}ms, rows=${__perfTimings.ordersCount}) | TTFB=${ttfb}ms | client mount @ ${sinceNav}ms since navigation`
      )
    } else {
      console.log(
        `[orders-perf] server data missing — using client fallback. TTFB=${ttfb}ms | client mount @ ${sinceNav}ms since navigation`
      )
    }
  }, [__perfTimings])

  useEffect(() => {
    // Skip client fetch if server already provided data
    if (initialData) return

    // Wait for auth to fully hydrate and load
    if (!isHydrated || authLoading) return

    // Fetch orders if we have a session (even if user lookup failed)
    // The RPC will handle finding the user by email and linking auth_user_id
    if (session) {
      fetchOrders()
    } else {
      setIsLoading(false)
    }
  }, [session, isHydrated, authLoading, initialData])

  const fetchOrders = async () => {
    if (!session) return

    setIsLoading(true)
    const __t0 = performance.now()
    console.log('[orders-perf] client fallback: starting parallel get_user_orders RPCs')

    try {
      const supabase = getClient()

      // Fetch both active and completed orders in PARALLEL
      const [activeResult, completedResult] = await Promise.all([
        supabase.rpc('get_user_orders', {
          p_statuses: ['pending_assignment', 'waitlisted', 'in_progress']
        }),
        supabase.rpc('get_user_orders', {
          p_statuses: ['completed', 'cancelled', 'disputed']
        })
      ])
      console.log(`[orders-perf] client fallback: RPCs done in ${Math.round(performance.now() - __t0)}ms`)

      if (activeResult.error) {
        console.error('[Orders Page] Error fetching active orders:', activeResult.error)
      }
      if (completedResult.error) {
        console.error('[Orders Page] Error fetching completed orders:', completedResult.error)
      }

      // RPC returns JSON array
      const active = Array.isArray(activeResult.data) ? activeResult.data : []
      const completed = Array.isArray(completedResult.data) ? completedResult.data.slice(0, 20) : []

      setActiveOrders(active as Order[])
      setCompletedOrders(completed as Order[])
    } catch (err) {
      console.error('Failed to fetch orders:', err)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="container py-12 max-w-3xl">
        <Skeleton className="h-10 w-40 mb-8" />
        <Skeleton className="h-11 w-64 mb-8" />
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-2xl" />
          ))}
        </div>
      </div>
    )
  }

  const hasAnyOrders = activeOrders.length > 0 || completedOrders.length > 0

  if (!hasAnyOrders) {
    return (
      <div className="container py-20 text-center max-w-md mx-auto">
        <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-6">
          <Package className="h-8 w-8 text-muted-foreground" />
        </div>
        <h1 className="text-2xl font-semibold text-foreground mb-3">No orders yet</h1>
        <p className="text-muted-foreground mb-8">
          Start by browsing our services and placing your first order.
        </p>
        <Link href="/services">
          <Button size="lg" className="gap-2">
            Browse Services
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="container py-12 max-w-3xl">
      {/* Back to Profile */}
      <Link href="/profile">
        <Button variant="ghost" className="mb-8 gap-2 text-muted-foreground hover:text-foreground -ml-4">
          <ArrowLeft className="h-4 w-4" />
          Go to Profile
        </Button>
      </Link>

      <div className="mb-8">
        <p className="font-mono text-sm uppercase tracking-[0.3em] text-muted-foreground mb-2">
          Dashboard
        </p>
        <h1 className="text-3xl md:text-4xl font-semibold text-foreground tracking-tight">
          My Orders
        </h1>
      </div>

      <Tabs defaultValue="active" className="w-full">
        <TabsList className="mb-8">
          <TabsTrigger value="active" className="gap-2">
            Active
            {activeOrders.length > 0 && (
              <span className="bg-muted px-2 py-0.5 rounded-full text-xs font-mono">
                {activeOrders.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        <TabsContent value="active">
          {activeOrders.length === 0 ? (
            <div className="rounded-xl border border-border bg-card py-12 text-center">
              <p className="text-muted-foreground mb-4">
                No active orders at the moment.
              </p>
              <Link href="/services">
                <Button variant="outline">Browse services</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {activeOrders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="completed">
          {completedOrders.length === 0 ? (
            <div className="rounded-xl border border-border bg-card py-12 text-center">
              <p className="text-muted-foreground">
                No completed orders yet.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {completedOrders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
