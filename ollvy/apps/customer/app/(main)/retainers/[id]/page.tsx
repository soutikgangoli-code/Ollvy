'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { getClient, getEdgeFunctionUrl } from '@/lib/supabase'
import { formatPaisa, formatDate } from '@/lib/utils'
import { useAuthStore } from '@/lib/stores/auth-store'
import type { RetainerSubscription } from '@/lib/types'
import {
  ArrowLeft,
  User,
  Calendar,
  Clock,
  MessageSquare,
  Pause,
  Play,
  RefreshCw,
  X,
  FileText,
  Download,
} from 'lucide-react'

interface BillingHistoryItem {
  id: string
  order_number: string
  status: string
  total_paisa_snapshot: number
  created_at: string
  completed_at: string | null
}

const statusConfig = {
  active: { label: 'Active', className: 'bg-white/10 text-white' },
  paused: { label: 'Paused', className: 'bg-white/10 text-white/60' },
  cancelled: { label: 'Cancelled', className: 'bg-white/10 text-white/40' },
  onboarding: { label: 'Onboarding', className: 'bg-white/10 text-white' },
  payment_failed: { label: 'Payment Failed', className: 'bg-white/10 text-white/60' },
}

export default function RetainerDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { session } = useAuthStore()
  const retainerId = params.id as string

  const [retainer, setRetainer] = useState<RetainerSubscription | null>(null)
  const [billingHistory, setBillingHistory] = useState<BillingHistoryItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  useEffect(() => {
    if (retainerId) {
      fetchRetainer()
    }
  }, [retainerId])

  const fetchRetainer = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const supabase = getClient()

      const { data, error: fetchError } = await supabase
        .from('retainer_subscriptions')
        .select(`
          *,
          service_package:service_packages(*),
          professional:professionals(id, full_name, phone, email, professional_type, avatar_url, bio)
        `)
        .eq('id', retainerId)
        .single()

      if (fetchError) throw fetchError

      setRetainer(data)

      // Fetch billing history (child orders)
      const { data: ordersData } = await supabase
        .from('orders')
        .select(`
          id,
          order_number,
          status,
          total_paisa_snapshot,
          created_at,
          completed_at
        `)
        .eq('retainer_subscription_id', retainerId)
        .order('created_at', { ascending: false })

      setBillingHistory(ordersData || [])
    } catch (err) {
      console.error('Failed to fetch retainer:', err)
      setError('Retainer not found')
    } finally {
      setIsLoading(false)
    }
  }

  const handlePause = async () => {
    setActionLoading('pause')

    try {
      const response = await fetch(getEdgeFunctionUrl('pause-retainer'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({ retainerId }),
      })

      if (!response.ok) throw new Error('Failed to pause retainer')

      await fetchRetainer()
    } catch (err) {
      console.error('Failed to pause retainer:', err)
    } finally {
      setActionLoading(null)
    }
  }

  const handleResume = async () => {
    setActionLoading('resume')

    try {
      const response = await fetch(getEdgeFunctionUrl('resume-retainer'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({ retainerId }),
      })

      if (!response.ok) throw new Error('Failed to resume retainer')

      await fetchRetainer()
    } catch (err) {
      console.error('Failed to resume retainer:', err)
    } finally {
      setActionLoading(null)
    }
  }

  if (isLoading) {
    return (
      <div className="container py-12 max-w-4xl">
        <Skeleton className="h-9 w-32 mb-8" />
        <Skeleton className="h-8 w-64 mb-3" />
        <Skeleton className="h-5 w-48 mb-10" />
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <Skeleton className="h-32 rounded-2xl" />
            <Skeleton className="h-64 rounded-2xl" />
          </div>
          <Skeleton className="h-80 rounded-2xl" />
        </div>
      </div>
    )
  }

  if (error || !retainer) {
    return (
      <div className="container py-20 text-center">
        <h1 className="text-2xl font-semibold text-white mb-4">Retainer Not Found</h1>
        <p className="text-white/40 mb-8">
          The retainer you're looking for doesn't exist or you don't have access to it.
        </p>
        <Link href="/retainers">
          <Button>Back to Retainers</Button>
        </Link>
      </div>
    )
  }

  const status = statusConfig[retainer.status as keyof typeof statusConfig] || statusConfig.active

  return (
    <div className="container py-12 max-w-4xl">
      {/* Back Button */}
      <Link href="/retainers">
        <Button variant="ghost" className="mb-8 gap-2 text-white/50 hover:text-white -ml-4">
          <ArrowLeft className="h-4 w-4" />
          Back to Retainers
        </Button>
      </Link>

      {/* Header */}
      <div className="mb-10">
        <div className="flex items-start gap-4 flex-wrap mb-3">
          <h1 className="text-2xl font-semibold text-white">
            {retainer.service_package?.name || 'Retainer Subscription'}
          </h1>
          <Badge className={status.className}>{status.label}</Badge>
        </div>
        <p className="text-white/40">
          Started {formatDate(retainer.created_at)}
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="md:col-span-2 space-y-6">
          {/* Professional Info */}
          {retainer.professional && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <User className="h-5 w-5 text-white/40" />
                  Your Professional
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white font-medium">
                    {retainer.professional.full_name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-white">{retainer.professional.full_name}</h3>
                    <p className="text-sm text-white/40 capitalize">
                      {retainer.professional.professional_type.replace('_', ' ')}
                    </p>
                    {retainer.professional.bio && (
                      <p className="text-sm text-white/50 mt-2">
                        {retainer.professional.bio}
                      </p>
                    )}
                  </div>
                  <Link href={`/retainers/${retainer.id}/chat`}>
                    <Button variant="outline" size="sm" className="gap-2">
                      <MessageSquare className="h-4 w-4" />
                      Chat
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Billing Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-white/40" />
                Billing Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/[0.02] rounded-xl p-4 border border-white/[0.06]">
                  <p className="text-sm text-white/40 mb-1">Current Cycle</p>
                  <p className="font-medium text-white">
                    {formatDate(retainer.current_cycle_start)} - {formatDate(retainer.current_cycle_end)}
                  </p>
                </div>
                <div className="bg-white/[0.02] rounded-xl p-4 border border-white/[0.06]">
                  <p className="text-sm text-white/40 mb-1">Next Billing</p>
                  <p className="font-medium text-white">
                    {formatDate(retainer.current_cycle_end)}
                  </p>
                </div>
              </div>

              {retainer.hours_per_month && (
                <div className="bg-white/[0.02] rounded-xl p-4 border border-white/[0.06]">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-white/40">Hours Used This Cycle</p>
                    <p className="font-medium text-white">
                      {retainer.hours_used_this_cycle} / {retainer.hours_per_month} hours
                    </p>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-white/30 rounded-full transition-all duration-300"
                      style={{
                        width: `${Math.min((retainer.hours_used_this_cycle / retainer.hours_per_month) * 100, 100)}%`
                      }}
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Billing History */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-white/40" />
                Billing History
              </CardTitle>
            </CardHeader>
            <CardContent>
              {billingHistory.length > 0 ? (
                <div className="space-y-2">
                  {billingHistory.map((order) => (
                    <div
                      key={order.id}
                      className="flex items-center justify-between py-3 border-b border-white/[0.06] last:border-0"
                    >
                      <div>
                        <p className="font-medium text-white">
                          {formatDate(order.created_at)}
                        </p>
                        <p className="text-sm text-white/40">
                          Order #{order.order_number}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-medium text-white">
                          {formatPaisa(order.total_paisa_snapshot)}
                        </span>
                        <Button variant="ghost" size="sm" className="gap-2 text-white/50">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-white/40 text-center py-6">
                  No billing history yet
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <Card className="sticky top-20">
            <CardHeader>
              <CardTitle>Subscription</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-white/50">Monthly Fee</span>
                  <span className="text-white">{formatPaisa(retainer.price_per_month_paisa)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/50">Status</span>
                  <Badge className={status.className}>{status.label}</Badge>
                </div>
              </div>

              {/* Action Buttons */}
              {retainer.status === 'active' && (
                <>
                  <Button
                    variant="outline"
                    className="w-full gap-2"
                    onClick={handlePause}
                    disabled={actionLoading === 'pause'}
                  >
                    {actionLoading === 'pause' ? (
                      <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    ) : (
                      <Pause className="h-4 w-4" />
                    )}
                    Pause Subscription
                  </Button>
                  <Link href={`/retainers/${retainer.id}/change-tier`} className="block">
                    <Button variant="outline" className="w-full gap-2">
                      <RefreshCw className="h-4 w-4" />
                      Change Tier
                    </Button>
                  </Link>
                  <Link href={`/retainers/${retainer.id}/cancel`} className="block">
                    <Button variant="ghost" className="w-full gap-2 text-white/50">
                      <X className="h-4 w-4" />
                      Cancel Subscription
                    </Button>
                  </Link>
                </>
              )}

              {retainer.status === 'paused' && (
                <Button
                  className="w-full gap-2"
                  onClick={handleResume}
                  disabled={actionLoading === 'resume'}
                >
                  {actionLoading === 'resume' ? (
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                  Resume Subscription
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
