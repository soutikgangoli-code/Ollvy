'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import { addWorkingDays } from '@ollvy/shared'
import type { Order } from '@/lib/types'

type OrderStatus = 'all' | 'pending_assignment' | 'in_progress' | 'completed' | 'disputed'

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [statusFilter, setStatusFilter] = useState<OrderStatus>('all')
  const [isFetching, setIsFetching] = useState(true)

  useEffect(() => {
    const fetchOrders = async () => {
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

      // Build query
      let query = supabase
        .from('orders')
        .select(`
          *,
          service_package:service_packages(name, sla_working_days),
          order_stage_history(*)
        `)
        .eq('professional_id', professional.id)
        .order('created_at', { ascending: false })

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter)
      }

      const { data } = await query

      setOrders(data || [])
      setIsFetching(false)
    }

    fetchOrders()

    // Set up realtime subscription
    const supabase = createClient()
    const channel = supabase
      .channel('orders-list')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        () => fetchOrders()
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [statusFilter])

  const getSlaCountdown = (order: Order): { text: string; isUrgent: boolean } => {
    if (order.status === 'completed' || order.status === 'cancelled') {
      return { text: '-', isUrgent: false }
    }

    const currentStage = order.order_stage_history?.find((s) => !s.completed_at)
    if (!currentStage) {
      return { text: '-', isUrgent: false }
    }

    const dueDate = new Date(currentStage.stage_due_date)
    const now = new Date()
    const diffMs = dueDate.getTime() - now.getTime()
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24))

    if (diffDays < 0) {
      return { text: 'Overdue', isUrgent: true }
    } else if (diffDays === 0) {
      return { text: 'Due today', isUrgent: true }
    } else if (diffDays === 1) {
      return { text: '1 day left', isUrgent: true }
    } else {
      return { text: `${diffDays} days left`, isUrgent: diffDays <= 2 }
    }
  }

  const statusOptions: { value: OrderStatus; label: string }[] = [
    { value: 'all', label: 'All Orders' },
    { value: 'pending_assignment', label: 'Assigned' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
    { value: 'disputed', label: 'Disputed' },
  ]

  if (isFetching) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="h-8 bg-gray-200 rounded w-32 animate-pulse"></div>
          <div className="h-10 bg-gray-200 rounded w-40 animate-pulse"></div>
        </div>
        <div className="bg-white rounded-lg border border-border">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="p-4 border-b border-border animate-pulse">
              <div className="flex justify-between">
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-48"></div>
                  <div className="h-3 bg-gray-200 rounded w-32"></div>
                </div>
                <div className="h-6 bg-gray-200 rounded w-20"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-body-text">Orders</h1>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as OrderStatus)}
          className="px-4 py-2 rounded-lg border border-border bg-white text-body-text"
        >
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg border border-border overflow-hidden">
        {orders.length === 0 ? (
          <div className="p-12 text-center">
            <svg className="w-12 h-12 mx-auto text-muted-text mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p className="text-muted-text">
              {statusFilter === 'all'
                ? 'No orders yet. Orders for your service areas will appear here.'
                : 'No orders match this filter.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full table-striped">
              <thead className="bg-gray-50 border-b border-border">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-text uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-text uppercase tracking-wider">
                    Service
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-text uppercase tracking-wider">
                    City
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-text uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-text uppercase tracking-wider">
                    SLA
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-text uppercase tracking-wider">
                    Created
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {orders.map((order) => {
                  const sla = getSlaCountdown(order)
                  const isNew = new Date(order.created_at) > new Date(Date.now() - 48 * 60 * 60 * 1000)

                  return (
                    <tr
                      key={order.id}
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={() => window.location.href = `/orders/${order.id}`}
                    >
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {isNew && (
                            <span className="badge badge-pending_assignment mr-2 text-[10px]">New</span>
                          )}
                          <span className="text-sm font-mono text-body-text">
                            {order.id.slice(0, 8)}...
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className="text-sm text-body-text">
                          {order.service_package?.name || 'Service'}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className="text-sm text-muted-text">
                          {order.city || '-'}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className={`badge badge-${order.status}`}>
                            {order.status.replace('_', ' ')}
                          </span>
                          {order.payment_paused && (
                            <span className="badge bg-yellow-100 text-yellow-800">
                              Payment Paused
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className={`text-sm ${sla.isUrgent ? 'text-red font-medium' : 'text-muted-text'}`}>
                          {sla.text}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className="text-sm text-muted-text">
                          {new Date(order.created_at).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                          })}
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
