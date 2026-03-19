'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { OrderCard } from '@/components/orders/OrderCard'
import { getClient } from '@/lib/supabase'
import { useAuthStore } from '@/lib/stores/auth-store'
import type { Order } from '@/lib/types'
import { Package, ArrowRight } from 'lucide-react'

export default function OrdersPage() {
  const { user } = useAuthStore()
  const [activeOrders, setActiveOrders] = useState<Order[]>([])
  const [completedOrders, setCompletedOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchOrders()
    }
  }, [user])

  const fetchOrders = async () => {
    if (!user) return

    setIsLoading(true)

    try {
      const supabase = getClient()

      const { data: active } = await supabase
        .from('orders')
        .select(`
          *,
          service_package:service_packages(*),
          professional:professionals(id, full_name, phone, email, professional_type, avatar_url)
        `)
        .eq('user_id', user.id)
        .in('status', ['pending_assignment', 'waitlisted', 'in_progress'])
        .order('created_at', { ascending: false })

      const { data: completed } = await supabase
        .from('orders')
        .select(`
          *,
          service_package:service_packages(*),
          professional:professionals(id, full_name, phone, email, professional_type, avatar_url)
        `)
        .eq('user_id', user.id)
        .in('status', ['completed', 'cancelled', 'disputed'])
        .order('created_at', { ascending: false })
        .limit(20)

      setActiveOrders(active || [])
      setCompletedOrders(completed || [])
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
      <h1 className="text-3xl font-semibold text-foreground mb-8">My Orders</h1>

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
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground mb-4">
                  No active orders at the moment.
                </p>
                <Link href="/services">
                  <Button variant="outline">Browse services</Button>
                </Link>
              </CardContent>
            </Card>
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
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">
                  No completed orders yet.
                </p>
              </CardContent>
            </Card>
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
