import { Badge } from '@/components/ui/badge'
import type { OrderStatus } from '@/lib/types'

const STATUS_CONFIG: Record<OrderStatus, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning' | 'pending' | 'active' | 'completed' }> = {
  pending_payment: {
    label: 'Awaiting Payment',
    variant: 'warning',
  },
  pending_assignment: {
    label: 'Processing',
    variant: 'pending',
  },
  waitlisted: {
    label: 'Finding Expert',
    variant: 'warning',
  },
  in_progress: {
    label: 'In Progress',
    variant: 'active',
  },
  completed: {
    label: 'Completed',
    variant: 'completed',
  },
  disputed: {
    label: 'Disputed',
    variant: 'destructive',
  },
  cancelled: {
    label: 'Cancelled',
    variant: 'secondary',
  },
}

interface OrderStatusBadgeProps {
  status: OrderStatus
}

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const config = STATUS_CONFIG[status] || { label: status, variant: 'secondary' as const }

  return <Badge variant={config.variant}>{config.label}</Badge>
}
