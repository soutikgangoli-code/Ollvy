import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { OrderStatusBadge } from './OrderStatusBadge'
import { formatPaisa, formatDate } from '@/lib/utils'
import type { Order } from '@/lib/types'
import { ArrowUpRight, User } from 'lucide-react'

interface OrderCardProps {
  order: Order
}

export function OrderCard({ order }: OrderCardProps) {
  return (
    <Link href={`/orders/${order.id}`} className="group block">
      <Card className="hover:border-white/20 hover:bg-white/[0.03] transition-all duration-300">
        <CardContent className="p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="font-medium text-white truncate group-hover:text-white/90 transition-colors">
                  {order.service_package?.name || 'Service'}
                </h3>
                <OrderStatusBadge status={order.status} />
              </div>

              <p className="text-sm text-white/40 mb-3">
                Order #{order.order_number}
              </p>

              <div className="flex items-center gap-5 text-sm">
                <span className="font-medium text-white">
                  {formatPaisa(order.total_paisa_snapshot)}
                </span>
                <span className="text-white/30">
                  {formatDate(order.created_at)}
                </span>
              </div>

              {order.professional && (
                <div className="flex items-center gap-2 mt-3 text-sm text-white/40">
                  <User className="h-3.5 w-3.5" />
                  <span>{order.professional.full_name}</span>
                </div>
              )}
            </div>

            <ArrowUpRight className="h-5 w-5 text-white/20 group-hover:text-white/50 transition-colors flex-shrink-0" />
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
