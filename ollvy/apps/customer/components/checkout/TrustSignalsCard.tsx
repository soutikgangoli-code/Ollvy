'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Shield, Receipt, User, Lock, Clock, BadgeCheck } from 'lucide-react'

interface TrustSignal {
  icon: React.ReactNode
  title: string
  description: string
}

const trustSignals: TrustSignal[] = [
  {
    icon: <Clock className="h-5 w-5" />,
    title: '2-Hour Refund',
    description: 'Cancel within 2 hours for a full refund, no questions asked',
  },
  {
    icon: <Receipt className="h-5 w-5" />,
    title: 'GST Invoice',
    description: 'Compliant invoice generated automatically after payment',
  },
  {
    icon: <User className="h-5 w-5" />,
    title: '24hr Assignment',
    description: 'A verified professional will be assigned within 24 hours',
  },
  {
    icon: <Lock className="h-5 w-5" />,
    title: 'Secure Payment',
    description: 'Payments processed securely via Razorpay',
  },
]

export function TrustSignalsCard() {
  return (
    <Card className="border-border">
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-5">
          <BadgeCheck className="h-5 w-5 text-[hsl(var(--ollvy-green))]" />
          <h3 className="font-medium text-foreground">Your Guarantees</h3>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          {trustSignals.map((signal, index) => (
            <div key={index} className="flex gap-3">
              <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-[hsl(var(--ollvy-green))]/10 flex items-center justify-center text-[hsl(var(--ollvy-green))]">
                {signal.icon}
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">{signal.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{signal.description}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// Mini version for sidebar
export function TrustSignalsMini() {
  return (
    <div className="space-y-2">
      {trustSignals.slice(0, 3).map((signal, index) => (
        <div key={index} className="flex items-center gap-2 text-xs text-muted-foreground">
          <div className="text-[hsl(var(--ollvy-green))]">
            {signal.icon}
          </div>
          <span>{signal.title}</span>
        </div>
      ))}
    </div>
  )
}
