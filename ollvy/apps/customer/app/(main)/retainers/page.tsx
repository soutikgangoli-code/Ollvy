'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'
import { RetainerCard } from '@/components/retainers/RetainerCard'
import { getClient } from '@/lib/supabase'
import { useAuthStore } from '@/lib/stores/auth-store'
import type { RetainerSubscription } from '@/lib/types'
import { Repeat, Plus, FileText } from 'lucide-react'

export default function RetainersPage() {
  const { user } = useAuthStore()
  const [retainers, setRetainers] = useState<RetainerSubscription[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('active')

  useEffect(() => {
    if (user?.id) {
      fetchRetainers()
    }
  }, [user?.id])

  const fetchRetainers = async () => {
    if (!user?.id) return

    setIsLoading(true)

    try {
      const supabase = getClient()

      const { data, error } = await supabase
        .from('retainer_subscriptions')
        .select(`
          *,
          service_package:service_packages(id, name, slug, short_description),
          professional:professionals(id, full_name, avatar_url, professional_type)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error

      setRetainers(data || [])
    } catch (err) {
      console.error('Failed to fetch retainers:', err)
    } finally {
      setIsLoading(false)
    }
  }

  // Subscribe to realtime updates
  useEffect(() => {
    if (!user?.id) return

    const supabase = getClient()

    const channel = supabase
      .channel('retainer-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'retainer_subscriptions',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          fetchRetainers()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user?.id])

  const activeRetainers = retainers.filter((r) => r.status === 'active' || r.status === 'onboarding')
  const pausedRetainers = retainers.filter((r) => r.status === 'paused' || r.status === 'payment_failed')
  const cancelledRetainers = retainers.filter((r) => r.status === 'cancelled')

  if (isLoading) {
    return (
      <div className="container py-12 max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="container py-12 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
            <Repeat className="h-5 w-5 text-white/60" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-white">Retainers</h1>
            <p className="text-sm text-white/40">Manage your monthly subscriptions</p>
          </div>
        </div>
        <Link href="/services?filter=recurring">
          <Button size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            Add Retainer
          </Button>
        </Link>
      </div>

      {retainers.length === 0 ? (
        <div className="text-center py-16 bg-white/[0.02] rounded-2xl border border-white/[0.06]">
          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
            <FileText className="h-8 w-8 text-white/20" />
          </div>
          <h3 className="font-medium text-white mb-2">No Retainers Yet</h3>
          <p className="text-sm text-white/40 max-w-sm mx-auto mb-6">
            Subscribe to monthly services like GST filing, TDS returns, or payroll management.
          </p>
          <Link href="/services?filter=recurring">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Browse Retainer Services
            </Button>
          </Link>
        </div>
      ) : (
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="active">
              Active ({activeRetainers.length})
            </TabsTrigger>
            <TabsTrigger value="paused">
              Paused ({pausedRetainers.length})
            </TabsTrigger>
            <TabsTrigger value="cancelled">
              Cancelled ({cancelledRetainers.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-4">
            {activeRetainers.length > 0 ? (
              activeRetainers.map((retainer) => (
                <RetainerCard key={retainer.id} retainer={retainer} />
              ))
            ) : (
              <div className="text-center py-12 text-white/40">
                No active retainers
              </div>
            )}
          </TabsContent>

          <TabsContent value="paused" className="space-y-4">
            {pausedRetainers.length > 0 ? (
              pausedRetainers.map((retainer) => (
                <RetainerCard key={retainer.id} retainer={retainer} />
              ))
            ) : (
              <div className="text-center py-12 text-white/40">
                No paused retainers
              </div>
            )}
          </TabsContent>

          <TabsContent value="cancelled" className="space-y-4">
            {cancelledRetainers.length > 0 ? (
              cancelledRetainers.map((retainer) => (
                <RetainerCard key={retainer.id} retainer={retainer} />
              ))
            ) : (
              <div className="text-center py-12 text-white/40">
                No cancelled retainers
              </div>
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
