'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import { formatPaisa } from '@ollvy/shared'
import type { Order, OrderStageHistory } from '@/lib/types'

export default function OrderCompletePage() {
  const params = useParams()
  const router = useRouter()
  const orderId = params.id as string

  const [order, setOrder] = useState<Order | null>(null)
  const [isFetching, setIsFetching] = useState(true)

  useEffect(() => {
    const fetchOrder = async () => {
      const supabase = createClient()

      const { data } = await supabase
        .from('orders')
        .select(`
          *,
          service_package:service_packages(name, workflow_stages),
          order_stage_history(*)
        `)
        .eq('id', orderId)
        .single()

      if (!data || data.status !== 'completed') {
        router.push(`/orders/${orderId}`)
        return
      }

      setOrder(data)
      setIsFetching(false)
    }

    fetchOrder()
  }, [orderId, router])

  if (isFetching) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-navy"></div>
      </div>
    )
  }

  if (!order) {
    return <div>Order not found</div>
  }

  const professionalPayout = Math.round(order.price_base_paisa_snapshot * 0.8)
  const completedStages = order.order_stage_history?.filter((s) => s.completed_at) || []

  return (
    <div className="max-w-2xl mx-auto">
      {/* Success Card */}
      <div className="bg-white rounded-xl shadow-lg p-8 text-center">
        <div className="w-20 h-20 bg-green/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-body-text mb-2">
          Order Completed!
        </h1>
        <p className="text-muted-text mb-8">
          Great work! The client has been notified.
        </p>

        {/* Order Summary */}
        <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
          <h2 className="font-semibold text-body-text mb-4">Order Summary</h2>

          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-text">Service</span>
              <span className="font-medium text-body-text">{order.service_package?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-text">Order ID</span>
              <span className="font-mono text-body-text">{order.id.slice(0, 8)}...</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-text">Completed On</span>
              <span className="text-body-text">
                {order.completed_at && new Date(order.completed_at).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </span>
            </div>
            <div className="flex justify-between border-t border-border pt-3 mt-3">
              <span className="font-medium text-body-text">Your Payout</span>
              <span className="font-bold text-navy text-lg">{formatPaisa(professionalPayout)}</span>
            </div>
            {order.govt_fees_paid_paisa && order.govt_fees_paid_paisa > 0 && (
              <div className="flex justify-between">
                <span className="text-muted-text">+ Govt Fee Reimbursement</span>
                <span className="text-green">{formatPaisa(order.govt_fees_paid_paisa)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Completed Stages */}
        <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
          <h2 className="font-semibold text-body-text mb-4">Work Completed</h2>
          <div className="space-y-3">
            {completedStages.map((stage, index) => (
              <div key={stage.id} className="flex items-center">
                <div className="w-6 h-6 rounded-full bg-green text-white flex items-center justify-center text-xs mr-3">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-body-text">{stage.stage_name}</p>
                  <p className="text-xs text-muted-text">
                    Completed {new Date(stage.completed_at!).toLocaleDateString('en-IN')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payout Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
          <div className="flex items-start">
            <svg className="w-5 h-5 text-blue-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <p className="text-sm text-blue-800">
              Your payout will be processed on the next Monday payout batch. Check your Earnings page for details.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/orders"
            className="flex-1 py-3 px-4 rounded-lg font-medium border border-border text-body-text hover:bg-gray-50 transition-colors text-center"
          >
            Back to Orders
          </Link>
          <Link
            href="/dashboard"
            className="flex-1 py-3 px-4 rounded-lg font-medium bg-navy text-white hover:bg-navy-light transition-colors text-center"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}
