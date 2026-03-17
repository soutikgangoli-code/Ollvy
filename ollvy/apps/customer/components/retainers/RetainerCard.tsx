'use client'

import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn, formatPaisa, formatDate } from '@/lib/utils'
import type { RetainerSubscription } from '@/lib/types'
import { Calendar, Clock, Repeat } from 'lucide-react'

interface RetainerCardProps {
  retainer: RetainerSubscription
}

const statusConfig = {
  active: { label: 'Active', className: 'bg-white/10 text-white' },
  paused: { label: 'Paused', className: 'bg-white/10 text-white/60' },
  cancelled: { label: 'Cancelled', className: 'bg-white/10 text-white/40' },
  onboarding: { label: 'Onboarding', className: 'bg-white/10 text-white' },
  payment_failed: { label: 'Payment Failed', className: 'bg-white/10 text-white/60' },
}

export function RetainerCard({ retainer }: RetainerCardProps) {
  const status = statusConfig[retainer.status as keyof typeof statusConfig] || statusConfig.active

  return (
    <Link href={`/retainers/${retainer.id}`}>
      <Card className="border-white/10 bg-white/[0.02] hover:border-white/20 transition-all duration-200 cursor-pointer">
        <CardContent className="p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="font-medium text-white truncate">
                  {retainer.service_package?.name || 'Retainer Subscription'}
                </h3>
                <Badge className={status.className}>{status.label}</Badge>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-sm text-white/40">
                <div className="flex items-center gap-1.5">
                  <Repeat className="h-4 w-4" />
                  <span>{formatPaisa(retainer.price_per_month_paisa)}/month</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  <span>Next billing: {formatDate(retainer.current_cycle_end)}</span>
                </div>
                {retainer.hours_per_month && (
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4" />
                    <span>{retainer.hours_used_this_cycle}/{retainer.hours_per_month} hrs used</span>
                  </div>
                )}
              </div>
            </div>

            {/* Professional info */}
            {retainer.professional && (
              <div className="flex items-center gap-2 flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white text-sm font-medium">
                  {retainer.professional.full_name.charAt(0)}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
