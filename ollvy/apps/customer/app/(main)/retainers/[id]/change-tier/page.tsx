'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { getClient, getEdgeFunctionUrl } from '@/lib/supabase'
import { formatPaisa, formatDate, cn } from '@/lib/utils'
import { useAuthStore } from '@/lib/stores/auth-store'
import type { RetainerSubscription, ServicePackage } from '@/lib/types'
import { ArrowLeft, Check, ArrowRight, Calendar } from 'lucide-react'

interface TierOption {
  id: string
  name: string
  tier_label: string
  price_base_paisa: number
  hours_per_month?: number
}

export default function ChangeTierPage() {
  const params = useParams()
  const router = useRouter()
  const { session } = useAuthStore()
  const retainerId = params.id as string

  const [retainer, setRetainer] = useState<RetainerSubscription | null>(null)
  const [tiers, setTiers] = useState<TierOption[]>([])
  const [selectedTierId, setSelectedTierId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isChanging, setIsChanging] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (retainerId) {
      fetchData()
    }
  }, [retainerId])

  const fetchData = async () => {
    setIsLoading(true)

    try {
      const supabase = getClient()

      // Fetch retainer
      const { data: retainerData, error: retainerError } = await supabase
        .from('retainer_subscriptions')
        .select(`
          *,
          service_package:service_packages(*)
        `)
        .eq('id', retainerId)
        .single()

      if (retainerError) throw retainerError

      setRetainer(retainerData)
      setSelectedTierId(retainerData.tier_id)

      // Fetch available tiers from same tier group
      if (retainerData.tier_group_id) {
        const { data: tiersData } = await supabase
          .from('service_packages')
          .select('id, name, tier_label, price_base_paisa')
          .eq('tier_group_id', retainerData.tier_group_id)
          .eq('is_active', true)
          .eq('order_type', 'recurring')
          .order('price_base_paisa', { ascending: true })

        if (tiersData) {
          setTiers(tiersData)
        }
      }
    } catch (err) {
      console.error('Failed to fetch data:', err)
      setError('Failed to load tier options')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChangeTier = async () => {
    if (!selectedTierId || selectedTierId === retainer?.tier_id) return

    setIsChanging(true)
    setError(null)

    try {
      const response = await fetch(getEdgeFunctionUrl('change-retainer-tier'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({
          retainerId,
          newTierId: selectedTierId,
        }),
      })

      if (!response.ok) throw new Error('Failed to change tier')

      router.push(`/retainers/${retainerId}`)
    } catch (err) {
      console.error('Failed to change tier:', err)
      setError('Failed to change tier. Please try again.')
    } finally {
      setIsChanging(false)
    }
  }

  const selectedTier = tiers.find(t => t.id === selectedTierId)
  const currentTier = tiers.find(t => t.id === retainer?.tier_id)
  const isUpgrade = selectedTier && currentTier && selectedTier.price_base_paisa > currentTier.price_base_paisa
  const priceDifference = selectedTier && currentTier
    ? selectedTier.price_base_paisa - currentTier.price_base_paisa
    : 0

  if (isLoading) {
    return (
      <div className="container py-12 max-w-lg">
        <Skeleton className="h-9 w-32 mb-8" />
        <Skeleton className="h-96 rounded-2xl" />
      </div>
    )
  }

  if (error && !retainer) {
    return (
      <div className="container py-20 text-center">
        <h1 className="text-2xl font-semibold text-white mb-4">Unable to Load</h1>
        <p className="text-white/40 mb-8">{error}</p>
        <Link href={`/retainers/${retainerId}`}>
          <Button>Back to Retainer</Button>
        </Link>
      </div>
    )
  }

  if (tiers.length <= 1) {
    return (
      <div className="container py-12 max-w-lg">
        <Link href={`/retainers/${retainerId}`}>
          <Button variant="ghost" className="mb-8 gap-2 text-white/50 hover:text-white -ml-4">
            <ArrowLeft className="h-4 w-4" />
            Back to Retainer
          </Button>
        </Link>

        <Card>
          <CardContent className="py-12 text-center">
            <h2 className="text-xl font-semibold text-white mb-2">No Other Tiers Available</h2>
            <p className="text-white/40">
              This subscription doesn't have alternative tier options.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container py-12 max-w-lg">
      {/* Back Button */}
      <Link href={`/retainers/${retainerId}`}>
        <Button variant="ghost" className="mb-8 gap-2 text-white/50 hover:text-white -ml-4">
          <ArrowLeft className="h-4 w-4" />
          Back to Retainer
        </Button>
      </Link>

      <Card>
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-xl">Change Your Plan</CardTitle>
          <p className="text-sm text-white/40 mt-1">
            Select a new tier for your subscription
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Tier options */}
          <div className="space-y-3">
            {tiers.map((tier) => {
              const isCurrent = tier.id === retainer?.tier_id
              const isSelected = tier.id === selectedTierId

              return (
                <button
                  key={tier.id}
                  onClick={() => setSelectedTierId(tier.id)}
                  disabled={isCurrent}
                  className={cn(
                    'w-full flex items-center justify-between p-4 rounded-xl border transition-all duration-200 text-left',
                    isSelected && !isCurrent
                      ? 'border-white/30 bg-white/5'
                      : isCurrent
                      ? 'border-white/10 bg-white/[0.02] opacity-60 cursor-not-allowed'
                      : 'border-white/10 hover:border-white/20 hover:bg-white/[0.02]'
                  )}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={cn(
                        'w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors',
                        isSelected && !isCurrent
                          ? 'border-white bg-white'
                          : 'border-white/30'
                      )}
                    >
                      {isSelected && !isCurrent && (
                        <Check className="h-3 w-3 text-black" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-white">
                        {tier.tier_label || tier.name}
                        {isCurrent && (
                          <span className="ml-2 text-xs text-white/40">(Current)</span>
                        )}
                      </p>
                    </div>
                  </div>
                  <span className="font-semibold text-white">
                    {formatPaisa(tier.price_base_paisa)}/mo
                  </span>
                </button>
              )
            })}
          </div>

          {/* Change summary */}
          {selectedTierId && selectedTierId !== retainer?.tier_id && (
            <div className="bg-white/[0.02] rounded-xl p-4 border border-white/[0.06] space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/50">Current Plan</span>
                <span className="text-white">
                  {currentTier?.tier_label} - {formatPaisa(currentTier?.price_base_paisa || 0)}/mo
                </span>
              </div>
              <div className="flex items-center justify-center text-white/30">
                <ArrowRight className="h-4 w-4" />
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/50">New Plan</span>
                <span className="text-white">
                  {selectedTier?.tier_label} - {formatPaisa(selectedTier?.price_base_paisa || 0)}/mo
                </span>
              </div>
              <div className="border-t border-white/[0.06] pt-3">
                <div className="flex items-center justify-between">
                  <span className="text-white/50">
                    {isUpgrade ? 'Monthly Increase' : 'Monthly Savings'}
                  </span>
                  <span className={cn('font-medium', isUpgrade ? 'text-white' : 'text-white')}>
                    {isUpgrade ? '+' : '-'}{formatPaisa(Math.abs(priceDifference))}
                  </span>
                </div>
              </div>
              <div className="flex items-start gap-2 pt-2">
                <Calendar className="h-4 w-4 text-white/40 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-white/40">
                  Change takes effect from your next billing cycle on {formatDate(retainer?.current_cycle_end || '')}
                </p>
              </div>
            </div>
          )}

          {error && (
            <div className="text-sm text-white/70 bg-white/5 border border-white/10 px-4 py-3 rounded-lg text-center">
              {error}
            </div>
          )}

          <div className="space-y-3 pt-4">
            <Button
              className="w-full"
              onClick={handleChangeTier}
              disabled={!selectedTierId || selectedTierId === retainer?.tier_id || isChanging}
            >
              {isChanging ? (
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                'Confirm Change'
              )}
            </Button>
            <Link href={`/retainers/${retainerId}`} className="block">
              <Button variant="ghost" className="w-full text-white/50">
                Cancel
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
