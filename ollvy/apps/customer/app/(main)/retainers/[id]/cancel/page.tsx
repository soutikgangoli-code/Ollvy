'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { getClient, getEdgeFunctionUrl } from '@/lib/supabase'
import { formatDate, addWorkingDays } from '@/lib/utils'
import { useAuthStore } from '@/lib/stores/auth-store'
import type { RetainerSubscription } from '@/lib/types'
import { ArrowLeft, AlertTriangle, Calendar, FileText, Check } from 'lucide-react'

export default function CancelRetainerPage() {
  const params = useParams()
  const router = useRouter()
  const { session } = useAuthStore()
  const retainerId = params.id as string

  const [retainer, setRetainer] = useState<RetainerSubscription | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isCancelling, setIsCancelling] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (retainerId) {
      fetchRetainer()
    }
  }, [retainerId])

  const fetchRetainer = async () => {
    setIsLoading(true)

    try {
      const supabase = getClient()

      const { data, error: fetchError } = await supabase
        .from('retainer_subscriptions')
        .select(`
          *,
          service_package:service_packages(name)
        `)
        .eq('id', retainerId)
        .single()

      if (fetchError) throw fetchError

      setRetainer(data)
    } catch (err) {
      console.error('Failed to fetch retainer:', err)
      setError('Retainer not found')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = async () => {
    setIsCancelling(true)

    try {
      const response = await fetch(getEdgeFunctionUrl('cancel-retainer'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({ retainerId }),
      })

      if (!response.ok) throw new Error('Failed to cancel retainer')

      router.push('/retainers')
    } catch (err) {
      console.error('Failed to cancel retainer:', err)
      setError('Failed to cancel subscription. Please try again.')
    } finally {
      setIsCancelling(false)
    }
  }

  if (isLoading) {
    return (
      <div className="container py-12 max-w-lg">
        <Skeleton className="h-9 w-32 mb-8" />
        <Skeleton className="h-64 rounded-2xl" />
      </div>
    )
  }

  if (error || !retainer) {
    return (
      <div className="container py-20 text-center">
        <h1 className="text-2xl font-semibold text-white mb-4">Retainer Not Found</h1>
        <Link href="/retainers">
          <Button>Back to Retainers</Button>
        </Link>
      </div>
    )
  }

  // Calculate end date and last delivery date
  const endDate = new Date(retainer.current_cycle_end)
  const lastDeliveryDate = new Date(endDate)
  lastDeliveryDate.setDate(lastDeliveryDate.getDate() + 5) // 5 working days after last cycle

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
          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="h-8 w-8 text-white/40" />
          </div>
          <CardTitle className="text-xl">Cancel Subscription</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-center text-white/50">
            Are you sure you want to cancel your{' '}
            <span className="text-white font-medium">
              {retainer.service_package?.name}
            </span>{' '}
            subscription?
          </p>

          {/* What happens */}
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-4 bg-white/[0.02] rounded-xl border border-white/[0.06]">
              <Calendar className="h-5 w-5 text-white/40 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-white">Access Until</p>
                <p className="text-sm text-white/50">
                  {formatDate(endDate)} (end of current billing cycle)
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-white/[0.02] rounded-xl border border-white/[0.06]">
              <FileText className="h-5 w-5 text-white/40 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-white">Final Deliverables</p>
                <p className="text-sm text-white/50">
                  Last documents delivered by {formatDate(lastDeliveryDate)}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-white/[0.02] rounded-xl border border-white/[0.06]">
              <Check className="h-5 w-5 text-white/40 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-white">No Further Charges</p>
                <p className="text-sm text-white/50">
                  You won't be charged after cancellation
                </p>
              </div>
            </div>
          </div>

          {error && (
            <div className="text-sm text-white/70 bg-white/5 border border-white/10 px-4 py-3 rounded-lg text-center">
              {error}
            </div>
          )}

          <div className="space-y-3 pt-4">
            <Button
              variant="destructive"
              className="w-full"
              onClick={handleCancel}
              disabled={isCancelling}
            >
              {isCancelling ? (
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                'Confirm Cancellation'
              )}
            </Button>
            <Link href={`/retainers/${retainerId}`} className="block">
              <Button variant="ghost" className="w-full text-white/50">
                Keep Subscription
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
