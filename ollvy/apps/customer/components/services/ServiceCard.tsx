import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Clock,
  ArrowUpRight,
  Star,
  FileText,
  Scale,
  Building2,
  Shield,
  Briefcase,
  Calculator,
  Users,
  Landmark,
  Receipt,
  FileCheck,
  Check
} from 'lucide-react'
import { formatPaisa } from '@/lib/utils'
import { getGuaranteedDate } from '@/lib/dates'
import type { ServicePackage } from '@/lib/types'

// Map icon names to Lucide components
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  FileText,
  Scale,
  Building2,
  Shield,
  Briefcase,
  Calculator,
  Users,
  Landmark,
  Receipt,
  FileCheck,
}

interface ServiceCardProps {
  service: ServicePackage
}

export function ServiceCard({ service }: ServiceCardProps) {
  const priceDisplay = service.price_varies_by_state
    ? 'Get Quote'
    : `${formatPaisa(service.price_base_paisa)}`

  const billingLabel = service.billing_cycle === 'monthly'
    ? '/mo'
    : service.billing_cycle === 'yearly'
    ? '/yr'
    : ''

  const isUrgent = service.urgency_score >= 80
  const isRetainer = service.billing_cycle === 'monthly' || service.billing_cycle === 'yearly'
  const guaranteedDate = service.sla_working_days > 0 ? getGuaranteedDate(service.sla_working_days) : null

  // Get icon component or default to FileText
  const IconComponent = service.icon_name && iconMap[service.icon_name]
    ? iconMap[service.icon_name]
    : FileText

  // Format govt fee if present
  const govtFee = service.price_govt_fees_paisa ? service.price_govt_fees_paisa / 100 : 0
  const ollvyFee = service.price_base_paisa / 100
  const totalPrice = ollvyFee + govtFee

  return (
    <Link href={`/services/${service.slug}`} className="group">
      <Card className="h-full hover:border-foreground/20 hover:bg-foreground/[0.03] transition-all duration-300 overflow-hidden flex flex-col min-h-[320px]">
        {/* Image or Icon Header */}
        {service.image_url ? (
          <div className="relative h-24 w-full bg-muted flex-shrink-0">
            <Image
              src={service.image_url}
              alt={service.name}
              fill
              className="object-cover opacity-80 group-hover:opacity-100 transition-opacity"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
          </div>
        ) : (
          <div className="h-16 w-full bg-muted/50 flex items-center justify-center border-b border-border flex-shrink-0">
            <IconComponent className="h-6 w-6 text-muted-foreground/50" />
          </div>
        )}

        <CardHeader className="pb-3 flex-shrink-0">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <CardTitle className="text-base font-medium text-foreground group-hover:text-foreground/90 transition-colors line-clamp-1">
                {service.name}
              </CardTitle>
            </div>
            <ArrowUpRight className="h-4 w-4 text-muted-foreground/50 group-hover:text-muted-foreground transition-colors flex-shrink-0 mt-1" />
          </div>
          <CardDescription className="line-clamp-2 mt-2 text-muted-foreground min-h-[40px]">
            {service.short_description}
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-0 flex-1 flex flex-col">
          {/* Price breakdown */}
          <div className="space-y-1 flex-1">
            <div className="flex justify-between items-baseline">
              <span className="text-xs text-muted-foreground">Ollvy fee</span>
              <span className="font-mono text-sm font-semibold text-foreground">
                {service.price_varies_by_state ? 'Quote' : `₹${ollvyFee.toLocaleString('en-IN')}`}
                {!service.price_varies_by_state && billingLabel && (
                  <span className="text-muted-foreground font-normal">{billingLabel}</span>
                )}
              </span>
            </div>
            {govtFee > 0 && (
              <div className="flex justify-between items-baseline">
                <span className="text-xs text-muted-foreground">Govt fee</span>
                <span className="font-mono text-sm text-muted-foreground">
                  ₹{govtFee.toLocaleString('en-IN')}
                </span>
              </div>
            )}
            <div className="flex justify-between items-baseline border-t border-border pt-1 mt-1">
              <span className="text-xs font-medium text-foreground">Total</span>
              <span className="font-mono text-base font-bold text-foreground">
                {service.price_varies_by_state ? 'Get Quote' : `₹${totalPrice.toLocaleString('en-IN')}`}
                {!service.price_varies_by_state && billingLabel && (
                  <span className="text-muted-foreground font-normal">{billingLabel}</span>
                )}
              </span>
            </div>
          </div>

          {/* SLA / Deadline */}
          <div className="mt-3">
            {isRetainer ? (
              <span className="text-xs text-muted-foreground">
                Recurring {service.billing_cycle} service
              </span>
            ) : guaranteedDate ? (
              <Badge
                className="bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20 text-xs"
              >
                <Check className="h-3 w-3 mr-1" />
                Guaranteed by {guaranteedDate}
              </Badge>
            ) : (
              <span className="text-xs text-muted-foreground">
                {service.sla_working_days} working days
              </span>
            )}
          </div>

          {/* Rating & badges */}
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-1">
              {service.avg_rating && service.rating_count > 0 && (
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  {service.avg_rating.toFixed(1)} ({service.rating_count})
                </span>
              )}
            </div>
            <div className="flex gap-1.5">
              {isUrgent && (
                <Badge variant="outline" className="text-[10px] uppercase tracking-wider border-red-400/30 text-red-500 dark:text-red-400">
                  Urgent
                </Badge>
              )}
              {service.tier_label && (
                <Badge variant="secondary" className="text-[10px]">
                  {service.tier_label}
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
