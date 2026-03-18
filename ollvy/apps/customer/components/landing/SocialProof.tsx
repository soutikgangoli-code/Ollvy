'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

interface PlatformStats {
  orders_completed_total: number
  professionals_count: number
  cities_served: number
}

function StatBlock({
  loading,
  value,
  suffix = '',
  label,
}: {
  loading: boolean
  value: number | null | undefined
  suffix?: string
  label: string
}) {
  if (loading) {
    return (
      <div>
        <Skeleton className="h-14 w-28 mx-auto" />
        <Skeleton className="h-4 w-24 mx-auto mt-2" />
      </div>
    )
  }

  if (value == null || value <= 0) {
    return null
  }

  return (
    <div>
      <div className="text-5xl font-bold font-mono text-foreground">
        {value.toLocaleString('en-IN')}{suffix}
      </div>
      <p className="text-sm text-muted-foreground mt-2">{label}</p>
    </div>
  )
}

export function SocialProof() {
  const [stats, setStats] = useState<PlatformStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/functions/v1/get-public-profile')
        if (!res.ok) throw new Error('Failed to fetch')
        const data = await res.json()
        setStats(data)
      } catch {
        setError(true)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  // If error or no stats, hide Part A entirely but still show trust badges
  const showStats = !error && stats !== null

  return (
    <section className="bg-background py-24">
      <div className="container">
        {/* Section Label */}
        <p className="text-xs uppercase tracking-widest text-muted-foreground text-center mb-3">
          BY THE NUMBERS
        </p>

        {/* Part A - Platform Stats */}
        {(loading || showStats) && (
          <div className="grid grid-cols-3 gap-8 text-center max-w-[720px] mx-auto">
            <StatBlock
              loading={loading}
              value={stats?.orders_completed_total}
              suffix="+"
              label="Services delivered"
            />
            <StatBlock
              loading={loading}
              value={stats?.professionals_count}
              suffix="+"
              label="Verified professionals"
            />
            <StatBlock
              loading={loading}
              value={stats?.cities_served}
              suffix=""
              label="Cities across India"
            />
          </div>
        )}

        {/* Part B - Fallback (always shown since we don't have completion stats endpoint yet) */}
        <Card className="border border-border bg-card p-6 text-center mt-12 max-w-[560px] mx-auto">
          <p className="font-semibold text-foreground">
            Every GST retainer filing delivered before the due date - or we refund that month.
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            We don't have enough orders yet to show a rolling chart. This is what we can say
            instead, and it's the stronger claim.
          </p>
        </Card>

        {/* Part C - Trust Badge Row */}
        <div className="mt-12 flex flex-wrap justify-center gap-3">
          {[
            'GST-Compliant Invoices',
            'Razorpay Payments',
            'Engagement Letters at Checkout',
            'Monthly Proof-of-Work Reports',
            'Data on Supabase',
          ].map((badge) => (
            <span
              key={badge}
              className="border border-border rounded-full px-4 py-1.5 text-xs text-muted-foreground"
            >
              {badge}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
