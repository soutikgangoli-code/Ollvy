'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import { formatPaisa } from '@ollvy/shared'
import type { RetainerSubscription } from '@/lib/types'

export default function RetainersPage() {
  const [retainers, setRetainers] = useState<RetainerSubscription[]>([])
  const [isFetching, setIsFetching] = useState(true)

  useEffect(() => {
    const fetchRetainers = async () => {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()

      if (!session) return

      // Get professional ID
      const { data: professional } = await supabase
        .from('professionals')
        .select('id')
        .eq('auth_user_id', session.user.id)
        .single()

      if (!professional) return

      // Fetch retainers
      const { data } = await supabase
        .from('retainer_subscriptions')
        .select(`
          *,
          service_package:service_packages(name),
          user:users(business_type, city)
        `)
        .eq('assigned_professional_id', professional.id)
        .order('created_at', { ascending: false })

      setRetainers(data || [])
      setIsFetching(false)
    }

    fetchRetainers()

    // Set up realtime subscription
    const supabase = createClient()
    const channel = supabase
      .channel('retainers-list')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'retainer_subscriptions' },
        () => fetchRetainers()
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  if (isFetching) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-gray-200 rounded w-32 animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-lg border border-border p-6 animate-pulse">
              <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <h1 className="text-2xl font-bold text-body-text">Retainer Clients</h1>

      {/* Retainers Grid */}
      {retainers.length === 0 ? (
        <div className="bg-white rounded-lg border border-border p-12 text-center">
          <svg className="w-12 h-12 mx-auto text-muted-text mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <p className="text-muted-text">
            No retainer clients yet. Retainer assignments will appear here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {retainers.map((retainer) => (
            <Link
              key={retainer.id}
              href={`/retainers/${retainer.id}`}
              className="bg-white rounded-lg border border-border p-6 hover:border-navy transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-body-text">
                    {retainer.service_package?.name}
                  </h3>
                  <p className="text-sm text-muted-text">
                    {retainer.user?.business_type || 'Business'}
                  </p>
                </div>
                <span className={`badge badge-${retainer.status}`}>
                  {retainer.status}
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-text">Billing Cycle</span>
                  <span className="text-body-text capitalize">{retainer.billing_cycle}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-text">Monthly Rate</span>
                  <span className="font-medium text-navy">{formatPaisa(retainer.monthly_price_paisa)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-text">Next Billing</span>
                  <span className="text-body-text">
                    {retainer.next_billing_date
                      ? new Date(retainer.next_billing_date).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                        })
                      : '-'}
                  </span>
                </div>
              </div>

              {retainer.status === 'payment_failed' && (
                <div className="mt-4 p-2 bg-red/10 rounded text-sm text-red">
                  Payment failed - billing paused
                </div>
              )}

              {retainer.is_trial_active && (
                <div className="mt-4 p-2 bg-blue-50 rounded text-sm text-blue-700">
                  Trial period active
                </div>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
