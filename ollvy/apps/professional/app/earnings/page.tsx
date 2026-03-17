'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import { formatPaisa } from '@ollvy/shared'
import type { Payout, ProfessionalBankAccount } from '@/lib/types'

interface EarningsStats {
  thisMonthPending: number
  lastPayoutAmount: number
  totalLifetime: number
}

export default function EarningsPage() {
  const [bankAccount, setBankAccount] = useState<ProfessionalBankAccount | null>(null)
  const [stats, setStats] = useState<EarningsStats>({
    thisMonthPending: 0,
    lastPayoutAmount: 0,
    totalLifetime: 0,
  })
  const [payouts, setPayouts] = useState<Payout[]>([])
  const [payoutBatches, setPayoutBatches] = useState<{ date: string; amount: number; status: string }[]>([])
  const [isFetching, setIsFetching] = useState(true)

  useEffect(() => {
    const fetchEarningsData = async () => {
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

      // Fetch bank account
      const { data: bank } = await supabase
        .from('professional_bank_accounts')
        .select('*')
        .eq('professional_id', professional.id)
        .single()

      setBankAccount(bank)

      // Fetch all payouts
      const { data: allPayouts } = await supabase
        .from('payouts')
        .select(`
          *,
          order:orders(service_package:service_packages(name)),
          retainer:retainer_subscriptions(service_package:service_packages(name))
        `)
        .eq('professional_id', professional.id)
        .order('created_at', { ascending: false })

      setPayouts(allPayouts || [])

      // Calculate stats
      const now = new Date()
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()

      const thisMonthPending = (allPayouts || [])
        .filter((p) => p.status === 'pending' && p.created_at >= monthStart)
        .reduce((sum, p) => sum + p.amount_paisa, 0)

      const paidPayouts = (allPayouts || []).filter((p) => p.status === 'paid')
      const lastPayout = paidPayouts[0]
      const lastPayoutAmount = lastPayout?.amount_paisa || 0

      const totalLifetime = paidPayouts.reduce((sum, p) => sum + p.amount_paisa, 0)

      setStats({
        thisMonthPending,
        lastPayoutAmount,
        totalLifetime,
      })

      // Group paid payouts by batch (by date)
      const batchMap = new Map<string, { amount: number; status: string }>()
      paidPayouts.forEach((p) => {
        const date = p.paid_at?.split('T')[0] || p.created_at.split('T')[0]
        const existing = batchMap.get(date)
        if (existing) {
          existing.amount += p.amount_paisa
        } else {
          batchMap.set(date, { amount: p.amount_paisa, status: p.status })
        }
      })

      const batches = Array.from(batchMap.entries())
        .map(([date, data]) => ({ date, ...data }))
        .slice(0, 4)

      setPayoutBatches(batches)

      setIsFetching(false)
    }

    fetchEarningsData()
  }, [])

  // Calculate next Monday
  const getNextMonday = () => {
    const now = new Date()
    const dayOfWeek = now.getDay()
    const daysUntilMonday = dayOfWeek === 0 ? 1 : 8 - dayOfWeek
    const nextMonday = new Date(now)
    nextMonday.setDate(now.getDate() + daysUntilMonday)
    return nextMonday.toLocaleDateString('en-IN', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    })
  }

  if (isFetching) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 rounded w-32 animate-pulse"></div>
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-lg border border-border p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Bank verification overlay
  if (!bankAccount || !bankAccount.is_verified) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-md w-full p-8 text-center">
          <div className="w-16 h-16 bg-amber/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-amber" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>

          <h2 className="text-xl font-bold text-body-text mb-2">
            Add Bank Account
          </h2>
          <p className="text-muted-text mb-6">
            {bankAccount
              ? 'Your bank account is pending verification. Please wait for approval.'
              : 'Add your bank account details to view earnings and receive payouts.'}
          </p>

          <Link
            href="/settings/bank"
            className="inline-block w-full py-3 rounded-lg font-medium bg-navy text-white hover:bg-navy-light transition-colors"
          >
            {bankAccount ? 'Check Status' : 'Add Now'}
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <h1 className="text-2xl font-bold text-body-text">Earnings</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border border-border p-6">
          <p className="text-sm text-muted-text">Pending This Month</p>
          <p className="text-3xl font-bold text-navy mt-1">{formatPaisa(stats.thisMonthPending)}</p>
          <p className="text-xs text-muted-text mt-2">
            Next payout: {getNextMonday()}
          </p>
        </div>
        <div className="bg-white rounded-lg border border-border p-6">
          <p className="text-sm text-muted-text">Last Payout</p>
          <p className="text-3xl font-bold text-green mt-1">{formatPaisa(stats.lastPayoutAmount)}</p>
        </div>
        <div className="bg-white rounded-lg border border-border p-6">
          <p className="text-sm text-muted-text">Total Lifetime</p>
          <p className="text-3xl font-bold text-body-text mt-1">{formatPaisa(stats.totalLifetime)}</p>
        </div>
      </div>

      {/* Payout History */}
      <div className="bg-white rounded-lg border border-border p-6">
        <h2 className="font-semibold text-body-text mb-4">Recent Payout Batches</h2>

        {payoutBatches.length === 0 ? (
          <p className="text-muted-text">No payouts yet</p>
        ) : (
          <div className="space-y-3">
            {payoutBatches.map((batch, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div>
                  <p className="font-medium text-body-text">
                    {new Date(batch.date).toLocaleDateString('en-IN', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                  <p className="text-sm text-muted-text">
                    •••• {bankAccount.account_number?.slice(-4)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green">{formatPaisa(batch.amount)}</p>
                  <span className="badge badge-paid">Paid</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Earnings Breakdown */}
      <div className="bg-white rounded-lg border border-border overflow-hidden">
        <div className="p-4 border-b border-border">
          <h2 className="font-semibold text-body-text">Earnings Breakdown</h2>
        </div>

        {payouts.length === 0 ? (
          <div className="p-8 text-center text-muted-text">
            <p>No earnings yet. Earnings appear after completing orders.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full table-striped">
              <thead className="bg-gray-50 border-b border-border">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-text uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-text uppercase tracking-wider">
                    Service
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-text uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-text uppercase tracking-wider">
                    Earnings
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-text uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {payouts.slice(0, 20).map((payout) => {
                  const serviceName = payout.type === 'order'
                    ? (payout as any).order?.service_package?.name
                    : payout.type === 'retainer_cycle'
                    ? (payout as any).retainer?.service_package?.name
                    : 'Govt Fee Reimbursement'

                  return (
                    <tr key={payout.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className={`badge ${
                          payout.type === 'order' ? 'bg-blue-100 text-blue-800' :
                          payout.type === 'retainer_cycle' ? 'bg-purple-100 text-purple-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {payout.type === 'order' ? 'Order' :
                           payout.type === 'retainer_cycle' ? 'Retainer' : 'Govt Fee'}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className="text-sm text-body-text">
                          {serviceName || '-'}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className="text-sm text-muted-text">
                          {new Date(payout.created_at).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className="font-medium text-body-text">
                          {formatPaisa(payout.amount_paisa)}
                        </span>
                        {payout.platform_fee_paisa > 0 && (
                          <span className="text-xs text-muted-text ml-2">
                            (-{formatPaisa(payout.platform_fee_paisa)} fee)
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className={`badge badge-${payout.status}`}>
                          {payout.status}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
