'use client'

import { useRouter } from 'next/navigation'
import { formatPaisa } from '@ollvy/shared'

interface AnalyticsClientProps {
  metrics: {
    totalRevenue: number
    completedOrders: number
    totalOrders: number
    activeRetainers: number
    mrr: number
    activeProfessionals: number
    newUsers: number
    openDisputes: number
    revenueByDate: Record<string, number>
    revenueByService: Record<string, number>
  }
  currentTab: string
  currentPeriod: string
}

const TABS = [
  { key: 'overview', label: 'Overview' },
  { key: 'revenue', label: 'Revenue' },
  { key: 'customers', label: 'Customers' },
  { key: 'operations', label: 'Operations' },
  { key: 'professionals', label: 'Professionals' },
  { key: 'growth', label: 'Growth' },
]

const PERIODS = [
  { key: '7d', label: 'Last 7 days' },
  { key: '30d', label: 'Last 30 days' },
  { key: '90d', label: 'Last 90 days' },
]

function formatCurrency(paisa: number): string {
  return formatPaisa(paisa)
}

export default function AnalyticsClient({
  metrics,
  currentTab,
  currentPeriod,
}: AnalyticsClientProps) {
  const router = useRouter()

  const setTab = (tab: string) => {
    router.push(`/analytics?tab=${tab}&period=${currentPeriod}`)
  }

  const setPeriod = (period: string) => {
    router.push(`/analytics?tab=${currentTab}&period=${period}`)
  }

  const completionRate = metrics.totalOrders > 0
    ? ((metrics.completedOrders / metrics.totalOrders) * 100).toFixed(1)
    : '0'

  // Simple bar chart renderer
  const renderBarChart = (data: Record<string, number>, maxItems = 10) => {
    const entries = Object.entries(data)
      .sort((a, b) => b[1] - a[1])
      .slice(0, maxItems)
    const maxValue = Math.max(...entries.map(e => e[1]))

    return (
      <div className="space-y-2">
        {entries.map(([label, value]) => (
          <div key={label} className="flex items-center gap-2">
            <span className="w-32 text-sm text-muted-text truncate">{label}</span>
            <div className="flex-1 h-6 bg-gray-100 rounded overflow-hidden">
              <div
                className="h-full bg-navy"
                style={{ width: `${(value / maxValue) * 100}%` }}
              />
            </div>
            <span className="w-24 text-sm text-right">{formatCurrency(value)}</span>
          </div>
        ))}
      </div>
    )
  }

  return (
    <>
      {/* Period Selector */}
      <div className="flex items-center justify-between">
        <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setTab(tab.key)}
              className={`px-4 py-2 text-sm rounded-md transition-colors ${
                currentTab === tab.key
                  ? 'bg-white text-navy font-medium shadow-sm'
                  : 'text-muted-text hover:text-body-text'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <select
          value={currentPeriod}
          onChange={(e) => setPeriod(e.target.value)}
          className="input text-sm w-auto"
        >
          {PERIODS.map((p) => (
            <option key={p.key} value={p.key}>{p.label}</option>
          ))}
        </select>
      </div>

      {/* Overview Tab */}
      {currentTab === 'overview' && (
        <div className="space-y-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="card p-6">
              <p className="text-sm text-muted-text">Total Revenue</p>
              <p className="text-2xl font-bold text-body-text">{formatCurrency(metrics.totalRevenue)}</p>
            </div>
            <div className="card p-6">
              <p className="text-sm text-muted-text">Orders</p>
              <p className="text-2xl font-bold text-body-text">{metrics.totalOrders}</p>
              <p className="text-xs text-green-600">{completionRate}% completion</p>
            </div>
            <div className="card p-6">
              <p className="text-sm text-muted-text">MRR (Retainers)</p>
              <p className="text-2xl font-bold text-body-text">{formatCurrency(metrics.mrr)}</p>
              <p className="text-xs text-muted-text">{metrics.activeRetainers} active</p>
            </div>
            <div className="card p-6">
              <p className="text-sm text-muted-text">Active Professionals</p>
              <p className="text-2xl font-bold text-body-text">{metrics.activeProfessionals}</p>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="card p-6">
              <h3 className="font-semibold mb-4">Revenue by Date</h3>
              {Object.keys(metrics.revenueByDate).length > 0 ? (
                renderBarChart(metrics.revenueByDate, 14)
              ) : (
                <p className="text-muted-text">No revenue data for this period</p>
              )}
            </div>
            <div className="card p-6">
              <h3 className="font-semibold mb-4">Revenue by Service</h3>
              {Object.keys(metrics.revenueByService).length > 0 ? (
                renderBarChart(metrics.revenueByService)
              ) : (
                <p className="text-muted-text">No service data for this period</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Revenue Tab */}
      {currentTab === 'revenue' && (
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <div className="card p-6">
              <p className="text-sm text-muted-text">Order Revenue</p>
              <p className="text-2xl font-bold text-body-text">{formatCurrency(metrics.totalRevenue)}</p>
            </div>
            <div className="card p-6">
              <p className="text-sm text-muted-text">Recurring (MRR)</p>
              <p className="text-2xl font-bold text-body-text">{formatCurrency(metrics.mrr)}</p>
            </div>
            <div className="card p-6">
              <p className="text-sm text-muted-text">Avg Order Value</p>
              <p className="text-2xl font-bold text-body-text">
                {metrics.totalOrders > 0
                  ? formatCurrency(Math.round(metrics.totalRevenue / metrics.totalOrders))
                  : 'Rs 0'
                }
              </p>
            </div>
          </div>
          <div className="card p-6">
            <h3 className="font-semibold mb-4">Revenue Breakdown by Service</h3>
            {renderBarChart(metrics.revenueByService)}
          </div>
        </div>
      )}

      {/* Customers Tab */}
      {currentTab === 'customers' && (
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <div className="card p-6">
              <p className="text-sm text-muted-text">New Users</p>
              <p className="text-2xl font-bold text-body-text">{metrics.newUsers}</p>
            </div>
            <div className="card p-6">
              <p className="text-sm text-muted-text">Active Retainers</p>
              <p className="text-2xl font-bold text-body-text">{metrics.activeRetainers}</p>
            </div>
            <div className="card p-6">
              <p className="text-sm text-muted-text">Open Disputes</p>
              <p className="text-2xl font-bold text-red-600">{metrics.openDisputes}</p>
            </div>
          </div>
        </div>
      )}

      {/* Operations Tab */}
      {currentTab === 'operations' && (
        <div className="space-y-6">
          <div className="grid grid-cols-4 gap-4">
            <div className="card p-6">
              <p className="text-sm text-muted-text">Total Orders</p>
              <p className="text-2xl font-bold text-body-text">{metrics.totalOrders}</p>
            </div>
            <div className="card p-6">
              <p className="text-sm text-muted-text">Completed</p>
              <p className="text-2xl font-bold text-green-600">{metrics.completedOrders}</p>
            </div>
            <div className="card p-6">
              <p className="text-sm text-muted-text">Completion Rate</p>
              <p className="text-2xl font-bold text-body-text">{completionRate}%</p>
            </div>
            <div className="card p-6">
              <p className="text-sm text-muted-text">Disputes</p>
              <p className="text-2xl font-bold text-red-600">{metrics.openDisputes}</p>
            </div>
          </div>
        </div>
      )}

      {/* Professionals Tab */}
      {currentTab === 'professionals' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="card p-6">
              <p className="text-sm text-muted-text">Active Professionals</p>
              <p className="text-2xl font-bold text-body-text">{metrics.activeProfessionals}</p>
            </div>
            <div className="card p-6">
              <p className="text-sm text-muted-text">Avg Revenue per Professional</p>
              <p className="text-2xl font-bold text-body-text">
                {metrics.activeProfessionals > 0
                  ? formatCurrency(Math.round(metrics.totalRevenue / metrics.activeProfessionals))
                  : 'Rs 0'
                }
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Growth Tab */}
      {currentTab === 'growth' && (
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <div className="card p-6">
              <p className="text-sm text-muted-text">New Users</p>
              <p className="text-2xl font-bold text-body-text">{metrics.newUsers}</p>
            </div>
            <div className="card p-6">
              <p className="text-sm text-muted-text">Retainer Growth (MRR)</p>
              <p className="text-2xl font-bold text-body-text">{formatCurrency(metrics.mrr)}</p>
            </div>
            <div className="card p-6">
              <p className="text-sm text-muted-text">Order Volume</p>
              <p className="text-2xl font-bold text-body-text">{metrics.totalOrders}</p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
