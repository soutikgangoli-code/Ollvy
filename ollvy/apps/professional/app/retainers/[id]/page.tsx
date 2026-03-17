'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import { callFunction } from '@/lib/api'
import { formatPaisa } from '@ollvy/shared'
import type { RetainerSubscription, Order, Payout } from '@/lib/types'

interface KeyNumbersSchema {
  liability_paisa?: number
  input_credit_paisa?: number
  net_payable_paisa?: number
  employee_count?: number
  total_ctc_paisa?: number
  amount_deducted_paisa?: number
  challans_filed?: number
  summary_text?: string
}

export default function RetainerDetailPage() {
  const params = useParams()
  const router = useRouter()
  const retainerId = params.id as string

  const [retainer, setRetainer] = useState<RetainerSubscription | null>(null)
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null)
  const [billingHistory, setBillingHistory] = useState<Payout[]>([])
  const [keyNumbers, setKeyNumbers] = useState<KeyNumbersSchema>({})
  const [isFetching, setIsFetching] = useState(true)
  const [isSavingKeyNumbers, setIsSavingKeyNumbers] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient()

      // Fetch retainer
      const { data: retainerData } = await supabase
        .from('retainer_subscriptions')
        .select(`
          *,
          service_package:service_packages(*),
          user:users(business_type, city)
        `)
        .eq('id', retainerId)
        .single()

      if (!retainerData) {
        router.push('/retainers')
        return
      }

      setRetainer(retainerData)

      // Fetch current cycle order
      const now = new Date()
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()

      const { data: orders } = await supabase
        .from('orders')
        .select(`
          *,
          service_package:service_packages(name, workflow_stages),
          order_stage_history(*)
        `)
        .eq('retainer_subscription_id', retainerId)
        .gte('created_at', monthStart)
        .order('created_at', { ascending: false })
        .limit(1)

      if (orders && orders.length > 0) {
        setCurrentOrder(orders[0])
      }

      // Fetch billing history (payouts)
      const { data: payouts } = await supabase
        .from('payouts')
        .select('*')
        .eq('retainer_subscription_id', retainerId)
        .order('created_at', { ascending: false })
        .limit(12)

      setBillingHistory(payouts || [])

      // Fetch existing key numbers for current period
      const currentPeriod = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
      const { data: digest } = await supabase
        .from('retainer_digests')
        .select('key_numbers')
        .eq('retainer_subscription_id', retainerId)
        .eq('billing_period', currentPeriod)
        .single()

      if (digest?.key_numbers) {
        setKeyNumbers(digest.key_numbers)
      }

      setIsFetching(false)
    }

    fetchData()
  }, [retainerId, router])

  const handleSaveKeyNumbers = async () => {
    setIsSavingKeyNumbers(true)
    setError(null)

    const now = new Date()
    const currentPeriod = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`

    const { error: apiError } = await callFunction('update-digest-key-numbers', {
      retainer_subscription_id: retainerId,
      billing_period: currentPeriod,
      key_numbers: keyNumbers,
    })

    setIsSavingKeyNumbers(false)

    if (apiError) {
      setError(apiError)
    }
  }

  const getKeyNumberFields = () => {
    const serviceName = retainer?.service_package?.name?.toLowerCase() || ''

    if (serviceName.includes('gst')) {
      return [
        { key: 'liability_paisa', label: 'GST Liability (Rs)', type: 'currency' },
        { key: 'input_credit_paisa', label: 'Input Credit (Rs)', type: 'currency' },
        { key: 'net_payable_paisa', label: 'Net Payable (Rs)', type: 'currency' },
      ]
    } else if (serviceName.includes('payroll')) {
      return [
        { key: 'employee_count', label: 'Employee Count', type: 'number' },
        { key: 'total_ctc_paisa', label: 'Total CTC (Rs)', type: 'currency' },
      ]
    } else if (serviceName.includes('tds')) {
      return [
        { key: 'amount_deducted_paisa', label: 'TDS Deducted (Rs)', type: 'currency' },
        { key: 'challans_filed', label: 'Challans Filed', type: 'number' },
      ]
    } else {
      return [
        { key: 'summary_text', label: 'Summary', type: 'text' },
      ]
    }
  }

  if (isFetching) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 rounded w-48 animate-pulse"></div>
        <div className="bg-white rounded-lg border border-border p-6 animate-pulse">
          <div className="space-y-4">
            <div className="h-6 bg-gray-200 rounded w-1/3"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!retainer) {
    return <div>Retainer not found</div>
  }

  const keyNumberFields = getKeyNumberFields()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/retainers" className="text-muted-text hover:text-body-text">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-body-text">
            {retainer.service_package?.name}
          </h1>
          <p className="text-muted-text">
            {retainer.user?.business_type} • {retainer.user?.city}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Current Cycle Order */}
          <div className="bg-white rounded-lg border border-border p-6">
            <h2 className="font-semibold text-body-text mb-4">Current Cycle</h2>

            {currentOrder ? (
              <Link
                href={`/orders/${currentOrder.id}`}
                className="block p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`badge badge-${currentOrder.status}`}>
                    {currentOrder.status.replace('_', ' ')}
                  </span>
                  <span className="text-sm text-muted-text">
                    {new Date(currentOrder.created_at).toLocaleDateString('en-IN', {
                      month: 'long',
                      year: 'numeric',
                    })}
                  </span>
                </div>
                <p className="text-sm text-body-text">
                  Click to view order details and advance stages
                </p>
              </Link>
            ) : (
              <p className="text-muted-text">No order for current cycle yet</p>
            )}
          </div>

          {/* Key Numbers */}
          <div className="bg-white rounded-lg border border-border p-6">
            <h2 className="font-semibold text-body-text mb-4">Key Numbers for Digest</h2>
            <p className="text-sm text-muted-text mb-4">
              Enter compliance data for this month's digest report
            </p>

            <div className="space-y-4">
              {keyNumberFields.map((field) => (
                <div key={field.key}>
                  <label className="block text-sm font-medium text-body-text mb-1">
                    {field.label}
                  </label>
                  {field.type === 'text' ? (
                    <textarea
                      value={(keyNumbers as any)[field.key] || ''}
                      onChange={(e) =>
                        setKeyNumbers({ ...keyNumbers, [field.key]: e.target.value })
                      }
                      rows={3}
                      className="w-full rounded-lg border border-border px-4 py-2 text-body-text"
                    />
                  ) : (
                    <input
                      type="number"
                      value={
                        field.type === 'currency'
                          ? ((keyNumbers as any)[field.key] || 0) / 100
                          : (keyNumbers as any)[field.key] || ''
                      }
                      onChange={(e) =>
                        setKeyNumbers({
                          ...keyNumbers,
                          [field.key]: field.type === 'currency'
                            ? Math.round(parseFloat(e.target.value || '0') * 100)
                            : parseInt(e.target.value || '0'),
                        })
                      }
                      className="w-full rounded-lg border border-border px-4 py-2 text-body-text"
                    />
                  )}
                </div>
              ))}

              {error && <p className="text-red text-sm">{error}</p>}

              <button
                onClick={handleSaveKeyNumbers}
                disabled={isSavingKeyNumbers}
                className={`w-full py-2 rounded-lg font-medium transition-colors ${
                  isSavingKeyNumbers
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-navy text-white hover:bg-navy-light'
                }`}
              >
                {isSavingKeyNumbers ? 'Saving...' : 'Save Key Numbers'}
              </button>
            </div>
          </div>

          {/* Billing History */}
          <div className="bg-white rounded-lg border border-border p-6">
            <h2 className="font-semibold text-body-text mb-4">Billing History</h2>

            {billingHistory.length === 0 ? (
              <p className="text-muted-text">No billing history yet</p>
            ) : (
              <div className="space-y-3">
                {billingHistory.map((payout) => (
                  <div
                    key={payout.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-body-text">
                        {payout.billing_period || 'Payout'}
                      </p>
                      <p className="text-xs text-muted-text">
                        {new Date(payout.created_at).toLocaleDateString('en-IN')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-navy">{formatPaisa(payout.amount_paisa)}</p>
                      <span className={`badge badge-${payout.status} text-[10px]`}>
                        {payout.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Retainer Info */}
          <div className="bg-white rounded-lg border border-border p-6">
            <h2 className="font-semibold text-body-text mb-4">Retainer Details</h2>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-text">Status</span>
                <span className={`badge badge-${retainer.status}`}>
                  {retainer.status}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-text">Billing Cycle</span>
                <span className="text-body-text capitalize">{retainer.billing_cycle}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-text">Monthly Rate</span>
                <span className="font-medium text-navy">{formatPaisa(retainer.monthly_price_paisa)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-text">Your Payout</span>
                <span className="font-medium text-green">
                  {formatPaisa(Math.round(retainer.monthly_price_paisa * 0.8))}
                </span>
              </div>
              <div className="flex justify-between">
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
              <div className="flex justify-between">
                <span className="text-muted-text">Started</span>
                <span className="text-body-text">
                  {retainer.started_at
                    ? new Date(retainer.started_at).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })
                    : '-'}
                </span>
              </div>
            </div>
          </div>

          {/* Chat Link */}
          <div className="bg-white rounded-lg border border-border p-6">
            <h2 className="font-semibold text-body-text mb-4">Communication</h2>
            <p className="text-sm text-muted-text mb-4">
              Use the retainer chat for ongoing communication with this client
            </p>
            <button
              disabled
              className="w-full py-2 px-4 bg-gray-100 text-muted-text rounded-lg font-medium cursor-not-allowed"
            >
              Chat Coming Soon
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
