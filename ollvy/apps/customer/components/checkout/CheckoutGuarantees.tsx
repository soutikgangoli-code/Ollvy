'use client'

import { Clock, User, Shield, TrendingUp, Star, CheckCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CheckoutGuaranteesProps {
  className?: string
}

const guarantees = [
  {
    icon: <Clock className="h-5 w-5" />,
    title: '2-Hour Refund',
    description: 'Cancel within 2 hours for full refund',
  },
  {
    icon: <User className="h-5 w-5" />,
    title: '24hr CA Assignment',
    description: 'Verified professional assigned quickly',
  },
  {
    icon: <Shield className="h-5 w-5" />,
    title: 'Secure Payment',
    description: 'Bank-grade encryption via Razorpay',
  },
]

const stats = [
  {
    icon: <TrendingUp className="h-4 w-4" />,
    value: '98%',
    label: 'on-time completion',
  },
  {
    icon: <CheckCircle className="h-4 w-4" />,
    value: '500+',
    label: 'orders this month',
  },
  {
    icon: <Star className="h-4 w-4" />,
    value: '4.8',
    label: 'from 127 reviews',
  },
]

export function CheckoutGuarantees({ className }: CheckoutGuaranteesProps) {
  return (
    <div className={cn('py-8', className)}>
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Guarantees Section */}
        <div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground font-mono mb-4">
            Your Guarantees
          </p>
          <div className="grid gap-4">
            {guarantees.map((guarantee, index) => (
              <div key={index} className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-[hsl(var(--ollvy-green))]/10 flex items-center justify-center text-[hsl(var(--ollvy-green))]">
                  {guarantee.icon}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {guarantee.title}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {guarantee.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground font-mono mb-4">
            Our Track Record
          </p>
          <div className="grid gap-4">
            {stats.map((stat, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="text-[hsl(var(--ollvy-green))]">
                  {stat.icon}
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="font-mono text-lg font-semibold text-foreground">
                    {stat.value}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {stat.label}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
