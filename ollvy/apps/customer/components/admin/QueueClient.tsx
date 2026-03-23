'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { formatPaisa, formatDate } from '@/lib/utils'
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
  days_active: number
  bucket: Bucket
  expected_completion_date?: string
  assigned_admin_id?: string
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

export function QueueClient({ orders, adminUser, adminUsers = [] }: QueueClientProps) {
  const { toast } = useToast()
  const [selectedBucket, setSelectedBucket] = useState<Bucket | 'all'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedAdmin, setSelectedAdmin] = useState<AdminUserWithCount | null>(null)
  const [selectedOrderIds, setSelectedOrderIds] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(false)
  const [assignDropdownOpen, setAssignDropdownOpen] = useState(false)

  const isSuperAdmin = adminUser.role === 'super_admin'

  // Calculate bucket counts
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
    orders.forEach(order => {
      counts[order.bucket]++
    })
    return counts
  }, [orders])

  // Filter orders based on selected bucket and search
  const filteredOrders = useMemo(() => {
    let result = orders

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
  }, [orders, selectedBucket, searchQuery])

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
          {orders.length} active orders
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

      {/* All Active button + Bulk Assign */}
      <div className="flex items-center gap-4">
        <Button
          variant={selectedBucket === 'all' ? 'default' : 'outline'}
          onClick={() => setSelectedBucket('all')}
        >
          All Active ({orders.length})
        </Button>
        <Input
          placeholder="Search by order number, user, or service..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
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
                  className="py-4 flex items-center justify-between gap-4"
                >
                  {/* Checkbox for bulk assignment */}
                  {selectedAdmin && (
                    <Checkbox
                      checked={selectedOrderIds.has(order.id)}
                      onCheckedChange={() => handleToggleOrder(order.id)}
                    />
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-sm font-medium">
                        {order.order_number}
                      </span>
                      <Badge variant={BUCKET_CONFIG[order.bucket].badgeVariant}>
                        {BUCKET_CONFIG[order.bucket].label}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground truncate">
                      {order.service_name}
                    </div>
                    <div className="text-sm text-muted-foreground truncate">
                      {order.user_name}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="font-medium">
                      {formatPaisa(order.total_paisa_snapshot)}
                    </div>
                    <div className={`text-sm ${order.days_active > 3 ? 'text-red-600 font-medium' : 'text-muted-foreground'}`}>
                      {order.days_active} days
                    </div>
                    {order.expected_completion_date && (
                      <div className={`text-xs ${isOverdue(order.expected_completion_date) ? 'text-red-500 font-medium' : 'text-muted-foreground'}`}>
                        Due: {formatDate(order.expected_completion_date)}
                      </div>
                    )}
                  </div>
                  <Link href={`/admin/orders/${order.id}`}>
                    <Button variant="outline" size="sm">
                      Open
                    </Button>
                  </Link>
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
    </div>
  )
}
