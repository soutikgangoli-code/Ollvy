'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Switch } from '@/components/ui/switch'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Calendar } from '@/components/ui/calendar'
import { CalendarIcon } from 'lucide-react'
import { format } from 'date-fns'
import { formatPaisa, formatDate } from '@/lib/utils'
import type { DateRange } from 'react-day-picker'
import { useToast } from '@/lib/hooks/use-toast'
import { bulkAssignOrders } from '@/app/(admin)/admin/queue/actions'
import type { AdminUser } from '@/lib/admin/get-admin-user'

type Bucket = 'needs_assignment' | 'disputed' | 'awaiting_user' | 'docs_to_review' | 'in_progress' | 'awaiting_government' | 'ready_to_deliver' | 'other'

interface QueueOrder {
  id: string
  order_number: string
  status: string
  paid_at: string
  total_paisa_snapshot: number
  service_name: string
  user_name: string
  user_phone: string
  days_active: number
  bucket: Bucket
  expected_completion_date?: string
  assigned_admin_id?: string
  sla_overdue_hours?: number
  is_paid: boolean
}

interface AdminUserWithCount {
  id: string
  name: string
  email: string
  activeOrderCount: number
}

interface QueueClientProps {
  orders: QueueOrder[]
  adminUser: AdminUser
  adminUsers?: AdminUserWithCount[]
}

const BUCKET_CONFIG: Record<Bucket, { label: string; color: string; badgeVariant: 'default' | 'destructive' | 'secondary' | 'outline' }> = {
  needs_assignment: { label: 'Needs Assignment', color: 'bg-yellow-100 border-yellow-300', badgeVariant: 'default' },
  disputed: { label: 'Disputed', color: 'bg-red-100 border-red-300', badgeVariant: 'destructive' },
  awaiting_user: { label: 'Awaiting User', color: 'bg-orange-100 border-orange-300', badgeVariant: 'secondary' },
  docs_to_review: { label: 'Docs to Review', color: 'bg-blue-100 border-blue-300', badgeVariant: 'default' },
  in_progress: { label: 'In Progress', color: 'bg-indigo-100 border-indigo-300', badgeVariant: 'outline' },
  awaiting_government: { label: 'Awaiting Government', color: 'bg-purple-100 border-purple-300', badgeVariant: 'outline' },
  ready_to_deliver: { label: 'Ready to Deliver', color: 'bg-teal-100 border-teal-300', badgeVariant: 'default' },
  other: { label: 'Other', color: 'bg-gray-100 border-gray-300', badgeVariant: 'outline' },
}

const BUCKET_ORDER: Bucket[] = [
  'needs_assignment',
  'disputed',
  'awaiting_user',
  'docs_to_review',
  'in_progress',
  'awaiting_government',
  'ready_to_deliver',
  'other',
]

// SLA thresholds in hours
const SLA_ASSIGNMENT_HOURS = 4 // Must be assigned within 4 hours of payment
const SLA_RESPONSE_HOURS = 24 // Assigned person must respond within 24 hours

// Issue #4: Waitlist escalation thresholds in days
const ESCALATION_WARNING_DAYS = 1 // 24 hours
const ESCALATION_URGENT_DAYS = 2 // 48 hours
const ESCALATION_CRITICAL_DAYS = 3 // 72 hours

// Helper to get escalation status for waitlisted orders
type EscalationLevel = 'warning' | 'urgent' | 'critical' | null
const getEscalationStatus = (order: QueueOrder): { level: EscalationLevel; label: string; daysWaiting: number } | null => {
  // Only show escalation for needs_assignment bucket
  if (order.bucket !== 'needs_assignment') return null
  if (!order.is_paid || !order.paid_at) return null

  const daysWaiting = order.days_active

  if (daysWaiting >= ESCALATION_CRITICAL_DAYS) {
    return { level: 'critical', label: `CRITICAL: ${daysWaiting}d waiting`, daysWaiting }
  } else if (daysWaiting >= ESCALATION_URGENT_DAYS) {
    return { level: 'urgent', label: `URGENT: ${daysWaiting}d waiting`, daysWaiting }
  } else if (daysWaiting >= ESCALATION_WARNING_DAYS) {
    return { level: 'warning', label: `${daysWaiting}d waiting`, daysWaiting }
  }

  return null
}

// Quick date range presets
const DATE_PRESETS = [
  { label: 'Today', getValue: () => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return { from: today, to: new Date() }
  }},
  { label: 'Last 7 days', getValue: () => {
    const to = new Date()
    const from = new Date()
    from.setDate(from.getDate() - 7)
    from.setHours(0, 0, 0, 0)
    return { from, to }
  }},
  { label: 'Last 30 days', getValue: () => {
    const to = new Date()
    const from = new Date()
    from.setDate(from.getDate() - 30)
    from.setHours(0, 0, 0, 0)
    return { from, to }
  }},
  { label: 'Last 3 months', getValue: () => {
    const to = new Date()
    const from = new Date()
    from.setMonth(from.getMonth() - 3)
    from.setHours(0, 0, 0, 0)
    return { from, to }
  }},
]

export function QueueClient({ orders, adminUser, adminUsers = [] }: QueueClientProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [selectedBucket, setSelectedBucket] = useState<Bucket | 'all'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [hideUnpaid, setHideUnpaid] = useState(true) // Hide test/unpaid orders by default
  const [selectedServiceType, setSelectedServiceType] = useState<string>('all')
  const [selectedBucketFilter, setSelectedBucketFilter] = useState<Bucket | 'all'>('all')
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined)
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false)
  const [datePickerOpen, setDatePickerOpen] = useState(false)
  const [selectedAdmin, setSelectedAdmin] = useState<AdminUserWithCount | null>(null)
  const [selectedOrderIds, setSelectedOrderIds] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(false)
  const [assignDropdownOpen, setAssignDropdownOpen] = useState(false)
  const [assignedToFilter, setAssignedToFilter] = useState<Set<string>>(new Set()) // empty = all, 'unassigned' or admin_ids
  const [assignedToDropdownOpen, setAssignedToDropdownOpen] = useState(false)

  const isSuperAdmin = adminUser.role === 'super_admin'

  // Get unique service types from orders (dynamic)
  const serviceTypes = useMemo(() => {
    const types = new Set<string>()
    orders.forEach(order => {
      if (order.service_name) types.add(order.service_name)
    })
    return Array.from(types).sort()
  }, [orders])

  // Helper to calculate SLA breach status
  const getSlaBreachTags = (order: QueueOrder): { type: 'not_assigned' | 'no_response'; label: string }[] => {
    const tags: { type: 'not_assigned' | 'no_response'; label: string }[] = []

    if (!order.is_paid || !order.paid_at) return tags

    const paidDate = new Date(order.paid_at)
    if (paidDate.getFullYear() < 2000) return tags // Invalid date

    const now = new Date()
    const hoursSincePaid = (now.getTime() - paidDate.getTime()) / (1000 * 60 * 60)

    // SLA: Not Assigned - order not assigned within threshold
    if (!order.assigned_admin_id && hoursSincePaid > SLA_ASSIGNMENT_HOURS) {
      tags.push({ type: 'not_assigned', label: 'SLA: Not Assigned' })
    }

    // SLA: No Response - assigned but still in needs_assignment bucket after threshold
    if (order.assigned_admin_id && order.bucket === 'needs_assignment' && hoursSincePaid > SLA_RESPONSE_HOURS) {
      tags.push({ type: 'no_response', label: 'SLA: No Response' })
    }

    return tags
  }

  // Filter orders based on all criteria
  const visibleOrders = useMemo(() => {
    let result = orders

    // Filter by paid status
    if (hideUnpaid) {
      result = result.filter(order => order.is_paid)
    }

    // Filter by service type
    if (selectedServiceType !== 'all') {
      result = result.filter(order => order.service_name === selectedServiceType)
    }

    // Filter by bucket/status
    if (selectedBucketFilter !== 'all') {
      result = result.filter(order => order.bucket === selectedBucketFilter)
    }

    // Filter by date range
    if (dateRange?.from) {
      result = result.filter(order => {
        if (!order.paid_at) return false
        const paidDate = new Date(order.paid_at)
        if (dateRange.from && paidDate < dateRange.from) return false
        if (dateRange.to) {
          const endOfDay = new Date(dateRange.to)
          endOfDay.setHours(23, 59, 59, 999)
          if (paidDate > endOfDay) return false
        }
        return true
      })
    }

    // Filter by assigned admin (multi-select)
    if (assignedToFilter.size > 0) {
      result = result.filter(order => {
        if (assignedToFilter.has('unassigned') && !order.assigned_admin_id) return true
        if (order.assigned_admin_id && assignedToFilter.has(order.assigned_admin_id)) return true
        return false
      })
    }

    return result
  }, [orders, hideUnpaid, selectedServiceType, selectedBucketFilter, dateRange, assignedToFilter])

  // Count active filters
  const activeFilterCount = useMemo(() => {
    let count = 0
    if (hideUnpaid) count++
    if (selectedServiceType !== 'all') count++
    if (selectedBucketFilter !== 'all') count++
    if (dateRange?.from) count++
    if (assignedToFilter.size > 0) count++
    return count
  }, [hideUnpaid, selectedServiceType, selectedBucketFilter, dateRange, assignedToFilter])

  // Reset all filters
  const resetFilters = () => {
    setHideUnpaid(true)
    setSelectedServiceType('all')
    setSelectedBucketFilter('all')
    setDateRange(undefined)
    setAssignedToFilter(new Set())
  }

  // Calculate bucket counts based on visible orders
  const bucketCounts = useMemo(() => {
    const counts: Record<Bucket, number> = {
      needs_assignment: 0,
      disputed: 0,
      awaiting_user: 0,
      docs_to_review: 0,
      in_progress: 0,
      awaiting_government: 0,
      ready_to_deliver: 0,
      other: 0,
    }
    visibleOrders.forEach(order => {
      counts[order.bucket]++
    })
    return counts
  }, [visibleOrders])

  // Filter orders based on selected bucket and search
  const filteredOrders = useMemo(() => {
    let result = visibleOrders

    if (selectedBucket !== 'all') {
      result = result.filter(order => order.bucket === selectedBucket)
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      result = result.filter(order =>
        order.order_number.toLowerCase().includes(query) ||
        order.user_name.toLowerCase().includes(query) ||
        order.service_name.toLowerCase().includes(query)
      )
    }

    // Sort: highest days_active first for filtered views, newest paid_at for All Active
    if (selectedBucket === 'all') {
      return result.sort((a, b) => new Date(b.paid_at).getTime() - new Date(a.paid_at).getTime())
    }
    return result.sort((a, b) => b.days_active - a.days_active)
  }, [visibleOrders, selectedBucket, searchQuery])

  const handleSelectAdmin = (admin: AdminUserWithCount) => {
    setSelectedAdmin(admin)
    setSelectedOrderIds(new Set())
    setAssignDropdownOpen(false)
  }

  const handleToggleOrder = (orderId: string) => {
    setSelectedOrderIds(prev => {
      const next = new Set(prev)
      if (next.has(orderId)) {
        next.delete(orderId)
      } else {
        next.add(orderId)
      }
      return next
    })
  }

  const handleSelectAll = () => {
    if (selectedOrderIds.size === filteredOrders.length) {
      setSelectedOrderIds(new Set())
    } else {
      setSelectedOrderIds(new Set(filteredOrders.map(o => o.id)))
    }
  }

  const handleCancel = () => {
    setSelectedAdmin(null)
    setSelectedOrderIds(new Set())
  }

  const handleBulkAssign = async () => {
    if (!selectedAdmin || selectedOrderIds.size === 0) return
    setLoading(true)
    try {
      await bulkAssignOrders(
        Array.from(selectedOrderIds),
        selectedAdmin.id,
        selectedAdmin.name
      )
      toast({
        title: `${selectedOrderIds.size} order${selectedOrderIds.size !== 1 ? 's' : ''} assigned to ${selectedAdmin.name}`,
      })
      setSelectedAdmin(null)
      setSelectedOrderIds(new Set())
    } catch (err) {
      toast({ title: 'Failed to assign orders', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  const isOverdue = (date?: string) => {
    if (!date) return false
    return new Date(date) < new Date()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Work Queue</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {visibleOrders.length} active orders{hideUnpaid && orders.length > visibleOrders.length && ` (${orders.length - visibleOrders.length} test hidden)`}
        </p>
      </div>

      {/* Bucket Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {BUCKET_ORDER.map(bucket => {
          const config = BUCKET_CONFIG[bucket]
          const count = bucketCounts[bucket]
          return (
            <button
              key={bucket}
              onClick={() => setSelectedBucket(bucket === selectedBucket ? 'all' : bucket)}
              className={`p-4 rounded-lg border-2 text-left transition-all ${
                selectedBucket === bucket
                  ? 'ring-2 ring-primary ring-offset-2'
                  : ''
              } ${config.color}`}
            >
              <div className="text-2xl font-bold text-foreground">{count}</div>
              <div className="text-sm text-muted-foreground">{config.label}</div>
            </button>
          )
        })}
      </div>

      {/* All Active button + Filters + Bulk Assign */}
      <div className="flex items-center gap-4 flex-wrap">
        <Button
          variant={selectedBucket === 'all' ? 'default' : 'outline'}
          onClick={() => setSelectedBucket('all')}
          className="min-w-[140px]"
        >
          All Active ({visibleOrders.length})
        </Button>
        <Input
          placeholder="Search by order number, user, or service..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />

        {/* Filter Dropdown */}
        <Popover open={filterDropdownOpen} onOpenChange={setFilterDropdownOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
              </svg>
              Filters
              {activeFilterCount > 0 && (
                <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 flex items-center justify-center text-xs">
                  {activeFilterCount}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[340px] p-4" align="start">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-sm">Filters</h4>
                {activeFilterCount > 0 && (
                  <Button variant="ghost" size="sm" className="h-auto p-0 text-xs text-muted-foreground" onClick={resetFilters}>
                    Reset all
                  </Button>
                )}
              </div>

              {/* Test Orders Toggle */}
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">Test Orders</label>
                <div className="flex items-center gap-2">
                  <Switch
                    id="hide-unpaid-filter"
                    checked={hideUnpaid}
                    onCheckedChange={setHideUnpaid}
                  />
                  <label htmlFor="hide-unpaid-filter" className="text-sm cursor-pointer">
                    Hide test/unpaid orders
                  </label>
                </div>
              </div>

              {/* Service Type Filter */}
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">Service Type</label>
                <Select value={selectedServiceType} onValueChange={setSelectedServiceType}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="All services" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All services</SelectItem>
                    {serviceTypes.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Status/Bucket Filter */}
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">Status</label>
                <Select value={selectedBucketFilter} onValueChange={(v) => setSelectedBucketFilter(v as Bucket | 'all')}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="All statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All statuses</SelectItem>
                    {BUCKET_ORDER.map(bucket => (
                      <SelectItem key={bucket} value={bucket}>
                        {BUCKET_CONFIG[bucket].label} ({bucketCounts[bucket]})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Date Filter */}
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">Date Range</label>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                  onClick={() => setDatePickerOpen(true)}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange?.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "MMM d")} - {format(dateRange.to, "MMM d, yyyy")}
                      </>
                    ) : (
                      format(dateRange.from, "MMM d, yyyy")
                    )
                  ) : (
                    <span className="text-muted-foreground">All time</span>
                  )}
                </Button>
              </div>

              {/* Active Filters Summary */}
              {activeFilterCount > 0 && (
                <div className="pt-2 border-t">
                  <p className="text-xs text-muted-foreground">
                    Showing {visibleOrders.length} of {orders.length} orders
                  </p>
                </div>
              )}
            </div>
          </PopoverContent>
        </Popover>

        {/* Assigned To Filter (Multi-select) */}
        {isSuperAdmin && adminUsers.length > 0 && (
          <Popover open={assignedToDropdownOpen} onOpenChange={setAssignedToDropdownOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
                {assignedToFilter.size === 0
                  ? 'Assigned To'
                  : assignedToFilter.size === 1
                  ? assignedToFilter.has('unassigned')
                    ? 'Unassigned'
                    : adminUsers.find(a => assignedToFilter.has(a.id))?.name || 'Assigned To'
                  : `${assignedToFilter.size} selected`}
                {assignedToFilter.size > 0 && (
                  <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 flex items-center justify-center text-xs">
                    {assignedToFilter.size}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-72 p-2" align="start">
              <div className="space-y-1">
                <div className="flex items-center justify-between px-2 py-1">
                  <p className="text-xs text-muted-foreground">
                    Filter by assigned team member
                  </p>
                  {assignedToFilter.size > 0 && (
                    <button
                      onClick={() => setAssignedToFilter(new Set())}
                      className="text-xs text-muted-foreground hover:text-foreground"
                    >
                      Clear
                    </button>
                  )}
                </div>
                <label
                  className={`w-full flex items-center gap-2 px-2 py-2 rounded hover:bg-muted cursor-pointer ${assignedToFilter.has('unassigned') ? 'bg-muted' : ''}`}
                >
                  <Checkbox
                    checked={assignedToFilter.has('unassigned')}
                    onCheckedChange={(checked) => {
                      setAssignedToFilter(prev => {
                        const next = new Set(prev)
                        if (checked) next.add('unassigned')
                        else next.delete('unassigned')
                        return next
                      })
                    }}
                  />
                  <span className="text-sm font-medium flex-1">Unassigned</span>
                  <span className="text-xs text-muted-foreground">
                    {orders.filter(o => !o.assigned_admin_id && (hideUnpaid ? o.is_paid : true)).length}
                  </span>
                </label>
                <div className="border-t my-1" />
                {adminUsers.map(admin => (
                  <label
                    key={admin.id}
                    className={`w-full flex items-center gap-2 px-2 py-2 rounded hover:bg-muted cursor-pointer ${assignedToFilter.has(admin.id) ? 'bg-muted' : ''}`}
                  >
                    <Checkbox
                      checked={assignedToFilter.has(admin.id)}
                      onCheckedChange={(checked) => {
                        setAssignedToFilter(prev => {
                          const next = new Set(prev)
                          if (checked) next.add(admin.id)
                          else next.delete(admin.id)
                          return next
                        })
                      }}
                    />
                    <span className="text-sm font-medium flex-1">{admin.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {admin.activeOrderCount} active
                    </span>
                  </label>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        )}

        {/* Bulk Assign */}
        {isSuperAdmin && adminUsers.length > 0 && (
          <Popover open={assignDropdownOpen} onOpenChange={setAssignDropdownOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline">
                {selectedAdmin ? `Assigning to: ${selectedAdmin.name}` : 'Bulk assign'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-72 p-2" align="start">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground px-2 py-1">
                  Select a team member to assign orders to
                </p>
                {adminUsers.map(admin => (
                  <button
                    key={admin.id}
                    onClick={() => handleSelectAdmin(admin)}
                    className="w-full flex items-center justify-between px-2 py-2 rounded hover:bg-muted text-left"
                  >
                    <span className="text-sm font-medium">{admin.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {admin.activeOrderCount} active order{admin.activeOrderCount !== 1 ? 's' : ''}
                    </span>
                  </button>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        )}
        {selectedAdmin && (
          <Button variant="ghost" size="sm" onClick={handleCancel}>
            Cancel
          </Button>
        )}
      </div>

      {/* Orders List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {selectedBucket === 'all' ? 'All Active Orders' : BUCKET_CONFIG[selectedBucket].label}
            <span className="text-muted-foreground font-normal ml-2">
              ({filteredOrders.length})
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Select All checkbox when in bulk mode */}
          {selectedAdmin && filteredOrders.length > 0 && (
            <div className="flex items-center gap-2 pb-3 border-b border-border">
              <Checkbox
                checked={selectedOrderIds.size === filteredOrders.length}
                onCheckedChange={handleSelectAll}
              />
              <span className="text-sm text-muted-foreground">
                Select all ({filteredOrders.length})
              </span>
            </div>
          )}

          {filteredOrders.length === 0 ? (
            <p className="text-sm text-muted-foreground py-8 text-center">
              No orders found
            </p>
          ) : (
            <div className="divide-y divide-border">
              {filteredOrders.map(order => (
                <div
                  key={order.id}
                  className="py-4 flex items-center justify-between gap-4 cursor-pointer hover:bg-muted/50 transition-colors -mx-4 px-4"
                  onClick={() => router.push(`/admin/orders/${order.id}`)}
                >
                  {/* Checkbox for bulk assignment */}
                  {selectedAdmin && (
                    <Checkbox
                      checked={selectedOrderIds.has(order.id)}
                      onCheckedChange={() => handleToggleOrder(order.id)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  )}

                  {/* Left: Order info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="font-mono text-sm font-medium">
                        {order.order_number}
                      </span>
                      <Badge variant={BUCKET_CONFIG[order.bucket].badgeVariant}>
                        {BUCKET_CONFIG[order.bucket].label}
                      </Badge>
                      {/* SLA Breach Tags */}
                      {getSlaBreachTags(order).map(tag => (
                        <Badge key={tag.type} variant="destructive" className="bg-red-600 text-white">
                          {tag.label}
                        </Badge>
                      ))}
                      {/* SLA overdue tag */}
                      {order.sla_overdue_hours !== undefined && order.sla_overdue_hours > 0 && (
                        <Badge variant="destructive" className="bg-red-600 text-white">
                          SLA: {order.sla_overdue_hours >= 24
                            ? `${Math.floor(order.sla_overdue_hours / 24)}d ${order.sla_overdue_hours % 24}h Overdue`
                            : `${order.sla_overdue_hours}h Overdue`}
                        </Badge>
                      )}
                      {/* Issue #4: Waitlist Escalation Badge */}
                      {(() => {
                        const escalation = getEscalationStatus(order)
                        if (!escalation) return null
                        return (
                          <Badge
                            variant="outline"
                            className={
                              escalation.level === 'critical'
                                ? 'bg-red-100 border-red-500 text-red-700 dark:bg-red-950 dark:border-red-500 dark:text-red-300'
                                : escalation.level === 'urgent'
                                ? 'bg-orange-100 border-orange-500 text-orange-700 dark:bg-orange-950 dark:border-orange-500 dark:text-orange-300'
                                : 'bg-amber-100 border-amber-500 text-amber-700 dark:bg-amber-950 dark:border-amber-500 dark:text-amber-300'
                            }
                          >
                            {escalation.label}
                          </Badge>
                        )
                      })()}
                    </div>
                    <div className="text-sm text-muted-foreground truncate">
                      {order.service_name}
                    </div>
                    <div className="text-sm text-muted-foreground truncate">
                      {order.user_name}
                      {order.user_phone && order.user_name !== order.user_phone && (
                        <span className="ml-2 text-xs">({order.user_phone})</span>
                      )}
                    </div>
                  </div>

                  {/* Center: Dates */}
                  <div className="hidden sm:flex flex-col items-center gap-1 px-4 min-w-[160px]">
                    <div className="text-xs text-muted-foreground text-center">
                      {order.paid_at && new Date(order.paid_at).getFullYear() > 2000 ? (
                        <>
                          <span className="font-medium text-foreground">Paid:</span>{' '}
                          {format(new Date(order.paid_at), "d MMM yyyy, h:mm a")}
                        </>
                      ) : (
                        <span className="text-amber-600 dark:text-amber-400 font-medium">Unpaid</span>
                      )}
                    </div>
                    {order.expected_completion_date && (
                      <div className="text-xs text-muted-foreground text-center">
                        <span className="font-medium text-foreground">Due:</span>{' '}
                        {format(new Date(order.expected_completion_date), "d MMM yyyy")}
                      </div>
                    )}
                  </div>

                  {/* Right: Amount */}
                  <div className="text-right shrink-0">
                    <div className="font-medium">
                      {formatPaisa(order.total_paisa_snapshot)}
                    </div>
                    {/* Show dates on mobile only */}
                    <div className="sm:hidden text-xs text-muted-foreground">
                      {order.paid_at && new Date(order.paid_at).getFullYear() > 2000
                        ? format(new Date(order.paid_at), "d MMM, h:mm a")
                        : 'Unpaid'}
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      router.push(`/admin/orders/${order.id}`)
                    }}
                  >
                    Open
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Floating confirmation bar for bulk assignment */}
      {selectedAdmin && selectedOrderIds.size > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-4 flex items-center justify-between shadow-lg z-50">
          <span className="text-sm font-medium">
            {selectedOrderIds.size} order{selectedOrderIds.size !== 1 ? 's' : ''} selected
            to assign to {selectedAdmin.name}
          </span>
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleCancel} disabled={loading}>
              Cancel
            </Button>
            <Button onClick={handleBulkAssign} disabled={loading}>
              {loading ? 'Assigning...' : `Assign ${selectedOrderIds.size} order${selectedOrderIds.size !== 1 ? 's' : ''}`}
            </Button>
          </div>
        </div>
      )}

      {/* Date Range Picker Dialog */}
      <Dialog open={datePickerOpen} onOpenChange={setDatePickerOpen}>
        <DialogContent className="max-w-fit p-0">
          <DialogHeader className="px-6 pt-6 pb-2">
            <DialogTitle>Select Date Range</DialogTitle>
          </DialogHeader>
          <div className="px-6 pb-2">
            <div className="flex flex-wrap gap-2">
              {DATE_PRESETS.map(preset => (
                <Button
                  key={preset.label}
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setDateRange(preset.getValue())
                    setDatePickerOpen(false)
                  }}
                >
                  {preset.label}
                </Button>
              ))}
              {dateRange?.from && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground"
                  onClick={() => {
                    setDateRange(undefined)
                  }}
                >
                  Clear
                </Button>
              )}
            </div>
          </div>
          <div className="px-6 pb-6">
            <Calendar
              mode="range"
              selected={dateRange}
              onSelect={setDateRange}
              numberOfMonths={2}
              disabled={{ after: new Date() }}
              className="rounded-md border"
            />
          </div>
          <div className="flex justify-between items-center px-6 pb-6">
            <div className="text-sm text-muted-foreground">
              {dateRange?.from && dateRange?.to ? (
                <>Selected: {format(dateRange.from, "MMM d, yyyy")} - {format(dateRange.to, "MMM d, yyyy")}</>
              ) : dateRange?.from ? (
                <>Start: {format(dateRange.from, "MMM d, yyyy")} - Select end date</>
              ) : (
                'Click a date to start selecting'
              )}
            </div>
            <Button onClick={() => setDatePickerOpen(false)}>
              Done
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
