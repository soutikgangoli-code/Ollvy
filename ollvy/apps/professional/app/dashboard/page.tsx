'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import { formatPaisa } from '@ollvy/shared'
import type { Professional, Order, RetainerSubscription, ProfessionalBankAccount } from '@/lib/types'

interface DashboardStats {
  activeOrders: number
  retainerClients: number
  thisMonthEarnings: number
  strikeCount: number
}

export default function DashboardPage() {
  const [professional, setProfessional] = useState<Professional | null>(null)
  const [bankAccount, setBankAccount] = useState<ProfessionalBankAccount | null>(null)
  const [stats, setStats] = useState<DashboardStats>({
    activeOrders: 0,
    retainerClients: 0,
    thisMonthEarnings: 0,
    strikeCount: 0,
  })
  const [recentOrders, setRecentOrders] = useState<Order[]>([])
  const [upcomingRetainers, setUpcomingRetainers] = useState<RetainerSubscription[]>([])
  const [isFetching, setIsFetching] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()

      if (!session) return

      // Fetch professional data
      const { data: prof } = await supabase
        .from('professionals')
        .select('*')
        .eq('auth_user_id', session.user.id)
        .single()

      if (!prof) return

      setProfessional(prof)

      // Fetch bank account
      const { data: bank } = await supabase
        .from('professional_bank_accounts')
        .select('*')
        .eq('professional_id', prof.id)
        .single()

      setBankAccount(bank)

      // Fetch stats
      const now = new Date()
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()

      // Active orders count
      const { count: activeCount } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .eq('professional_id', prof.id)
        .in('status', ['pending_assignment', 'in_progress'])

      // Retainer clients count
      const { count: retainerCount } = await supabase
        .from('retainer_subscriptions')
        .select('*', { count: 'exact', head: true })
        .eq('assigned_professional_id', prof.id)
        .eq('status', 'active')

      // This month earnings
      const { data: payouts } = await supabase
        .from('payouts')
        .select('amount_paisa')
        .eq('professional_id', prof.id)
        .gte('created_at', monthStart)

      const thisMonthEarnings = payouts?.reduce((sum, p) => sum + p.amount_paisa, 0) || 0

      setStats({
        activeOrders: activeCount || 0,
        retainerClients: retainerCount || 0,
        thisMonthEarnings,
        strikeCount: prof.strike_count || 0,
      })

      // Fetch recent orders (assigned in last 48h)
      const twoDaysAgo = new Date(now.getTime() - 48 * 60 * 60 * 1000).toISOString()
      const { data: orders } = await supabase
        .from('orders')
        .select(`
          *,
          service_package:service_packages(name),
          order_stage_history(*)
        `)
        .eq('professional_id', prof.id)
        .gte('created_at', twoDaysAgo)
        .in('status', ['pending_assignment', 'in_progress'])
        .order('created_at', { ascending: false })
        .limit(5)

      setRecentOrders(orders || [])

      // Fetch upcoming retainer deadlines (due within 7 days)
      const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString()
      const { data: retainers } = await supabase
        .from('retainer_subscriptions')
        .select(`
          *,
          service_package:service_packages(name),
          user:users(business_type, city)
        `)
        .eq('assigned_professional_id', prof.id)
        .eq('status', 'active')
        .lte('next_billing_date', weekFromNow)
        .order('next_billing_date', { ascending: true })
        .limit(5)

      setUpcomingRetainers(retainers || [])

      setIsFetching(false)
    }

    fetchDashboardData()

    // Set up realtime for orders
    const supabase = createClient()
    const channel = supabase
      .channel('dashboard-orders')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        () => fetchDashboardData()
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const handleAvailabilityToggle = async () => {
    if (!professional) return

    const supabase = createClient()
    const newValue = !professional.is_available

    const { error } = await supabase
      .from('professionals')
      .update({ is_available: newValue })
      .eq('id', professional.id)

    if (!error) {
      setProfessional({ ...professional, is_available: newValue })
    }
  }

  const handleEndLeave = async () => {
    if (!professional) return

    const supabase = createClient()

    const { error } = await supabase
      .from('professional_availability')
      .update({ on_leave_until: null })
      .eq('professional_id', professional.id)

    if (!error) {
      window.location.reload()
    }
  }

  if (isFetching) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-lg p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-body-text">
            Welcome back, {professional?.display_name || professional?.name}
          </h1>
          <p className="text-muted-text">Here's your overview for today</p>
        </div>

        {/* Availability Toggle */}
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-text">
            {professional?.is_available ? 'Accepting orders' : 'Not accepting orders'}
          </span>
          <button
            onClick={handleAvailabilityToggle}
            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              professional?.is_available ? 'bg-green' : 'bg-gray-300'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                professional?.is_available ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Bank Details Banner */}
      {(!bankAccount || !bankAccount.is_verified) && (
        <div className="bg-amber/10 border border-amber rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-amber mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="font-medium text-body-text">Add bank account to receive payments</p>
                <p className="text-sm text-muted-text">
                  {bankAccount ? 'Bank verification pending' : 'You need to add your bank details to receive payouts'}
                </p>
              </div>
            </div>
            <Link
              href="/settings/bank"
              className="px-4 py-2 bg-navy text-white rounded-lg font-medium hover:bg-navy-light transition-colors"
            >
              Add Now
            </Link>
          </div>
        </div>
      )}

      {/* On Leave Banner */}
      {professional && (
        <OnLeaveBanner
          professionalId={professional.id}
          onEndLeave={handleEndLeave}
        />
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-border p-6">
          <p className="text-sm text-muted-text">Active Orders</p>
          <p className="text-3xl font-bold text-navy mt-1">{stats.activeOrders}</p>
        </div>
        <div className="bg-white rounded-lg border border-border p-6">
          <p className="text-sm text-muted-text">Retainer Clients</p>
          <p className="text-3xl font-bold text-navy mt-1">{stats.retainerClients}</p>
        </div>
        <div className="bg-white rounded-lg border border-border p-6">
          <p className="text-sm text-muted-text">This Month</p>
          <p className="text-3xl font-bold text-navy mt-1">{formatPaisa(stats.thisMonthEarnings)}</p>
        </div>
        <div className="bg-white rounded-lg border border-border p-6">
          <p className="text-sm text-muted-text">Strike Count</p>
          <p className={`text-3xl font-bold mt-1 ${stats.strikeCount > 0 ? 'text-red' : 'text-green'}`}>
            {stats.strikeCount}
          </p>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-lg border border-border">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="font-semibold text-body-text">Recent Orders</h2>
          <Link href="/orders" className="text-sm text-navy hover:underline">
            View all
          </Link>
        </div>
        <div className="divide-y divide-border">
          {recentOrders.length === 0 ? (
            <div className="p-8 text-center text-muted-text">
              <p>No recent orders</p>
            </div>
          ) : (
            recentOrders.map((order) => (
              <Link
                key={order.id}
                href={`/orders/${order.id}`}
                className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center">
                  <span className="badge badge-pending_assignment mr-3">New</span>
                  <div>
                    <p className="font-medium text-body-text">
                      {order.service_package?.name || 'Service'}
                    </p>
                    <p className="text-sm text-muted-text">{order.city || 'No city'}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`badge badge-${order.status}`}>
                    {order.status.replace('_', ' ')}
                  </span>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>

      {/* Upcoming Retainer Deadlines */}
      <div className="bg-white rounded-lg border border-border">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="font-semibold text-body-text">Retainers Due This Week</h2>
          <Link href="/retainers" className="text-sm text-navy hover:underline">
            View all
          </Link>
        </div>
        <div className="divide-y divide-border">
          {upcomingRetainers.length === 0 ? (
            <div className="p-8 text-center text-muted-text">
              <p>No upcoming deadlines</p>
            </div>
          ) : (
            upcomingRetainers.map((retainer) => (
              <Link
                key={retainer.id}
                href={`/retainers/${retainer.id}`}
                className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
              >
                <div>
                  <p className="font-medium text-body-text">
                    {retainer.service_package?.name || 'Retainer Service'}
                  </p>
                  <p className="text-sm text-muted-text">
                    {retainer.user?.business_type || 'Business'} • {retainer.billing_cycle}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-text">
                    Due {new Date(retainer.next_billing_date!).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                    })}
                  </p>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Link
          href="/orders"
          className="bg-white rounded-lg border border-border p-4 text-center hover:border-navy transition-colors"
        >
          <svg className="w-8 h-8 mx-auto text-navy mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <p className="text-sm font-medium text-body-text">View Orders</p>
        </Link>
        <Link
          href="/retainers"
          className="bg-white rounded-lg border border-border p-4 text-center hover:border-navy transition-colors"
        >
          <svg className="w-8 h-8 mx-auto text-navy mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <p className="text-sm font-medium text-body-text">Retainers</p>
        </Link>
        <Link
          href="/earnings"
          className="bg-white rounded-lg border border-border p-4 text-center hover:border-navy transition-colors"
        >
          <svg className="w-8 h-8 mx-auto text-navy mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-sm font-medium text-body-text">Earnings</p>
        </Link>
        <Link
          href="/settings/profile"
          className="bg-white rounded-lg border border-border p-4 text-center hover:border-navy transition-colors"
        >
          <svg className="w-8 h-8 mx-auto text-navy mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <p className="text-sm font-medium text-body-text">Profile</p>
        </Link>
      </div>
    </div>
  )
}

// On Leave Banner Component
function OnLeaveBanner({
  professionalId,
  onEndLeave,
}: {
  professionalId: string
  onEndLeave: () => void
}) {
  const [onLeaveUntil, setOnLeaveUntil] = useState<string | null>(null)

  useEffect(() => {
    const fetchLeave = async () => {
      const supabase = createClient()
      const { data } = await supabase
        .from('professional_availability')
        .select('on_leave_until')
        .eq('professional_id', professionalId)
        .single()

      if (data?.on_leave_until) {
        const leaveDate = new Date(data.on_leave_until)
        if (leaveDate > new Date()) {
          setOnLeaveUntil(data.on_leave_until)
        }
      }
    }

    fetchLeave()
  }, [professionalId])

  if (!onLeaveUntil) return null

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <svg className="w-5 h-5 text-blue-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
          </svg>
          <div>
            <p className="font-medium text-body-text">You are on leave</p>
            <p className="text-sm text-muted-text">
              Until {new Date(onLeaveUntil).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}. Orders are paused.
            </p>
          </div>
        </div>
        <button
          onClick={onEndLeave}
          className="px-4 py-2 border border-blue-300 text-blue-700 rounded-lg font-medium hover:bg-blue-100 transition-colors"
        >
          End Leave Early
        </button>
      </div>
    </div>
  )
}
