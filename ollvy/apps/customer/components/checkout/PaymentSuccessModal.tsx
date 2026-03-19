'use client'

import { useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Check, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PaymentSuccessModalProps {
  isOpen: boolean
  orderNumber: string
  serviceName: string
  orderId: string
  amountPaisa: number
  slaDays: number
  onClose: () => void
}

function formatPrice(paisa: number): string {
  return '\u20B9' + Math.ceil(paisa / 100).toLocaleString('en-IN')
}

function getGuaranteedDate(days: number): string {
  const date = new Date()
  let addedDays = 0
  while (addedDays < days) {
    date.setDate(date.getDate() + 1)
    const dayOfWeek = date.getDay()
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      addedDays++
    }
  }
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

export function PaymentSuccessModal({
  isOpen,
  orderNumber,
  serviceName,
  orderId,
  amountPaisa,
  slaDays,
  onClose,
}: PaymentSuccessModalProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => setMounted(true), 100)
      return () => clearTimeout(timer)
    } else {
      setMounted(false)
    }
  }, [isOpen])

  const handleViewOrder = () => {
    onClose()
  }

  const guaranteedDate = getGuaranteedDate(slaDays)

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleViewOrder()}>
      <DialogContent className="sm:max-w-[400px] border-border bg-card p-0 overflow-hidden gap-0">
        {/* Header with success indicator */}
        <div className="px-6 pt-8 pb-6 text-center">
          {/* Success checkmark */}
          <div
            className={cn(
              'w-14 h-14 rounded-full bg-[hsl(var(--ollvy-green))] flex items-center justify-center mx-auto mb-4 transition-all duration-500',
              mounted ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
            )}
          >
            <Check className="h-7 w-7 text-white stroke-[3]" />
          </div>

          {/* Status label */}
          <p className="text-xs uppercase tracking-widest text-[hsl(var(--ollvy-green))] font-mono mb-3">
            PAYMENT SUCCESSFUL
          </p>

          {/* Amount paid */}
          <p className="font-mono text-3xl font-bold text-foreground">
            {formatPrice(amountPaisa)}
          </p>
        </div>

        {/* Order details */}
        <div className="px-6 pb-6">
          <div className="border border-border rounded-xl divide-y divide-border">
            {/* Service */}
            <div className="px-4 py-3 flex justify-between items-center">
              <span className="text-xs uppercase tracking-widest text-muted-foreground font-mono">
                SERVICE
              </span>
              <span className="text-sm font-medium text-foreground">
                {serviceName}
              </span>
            </div>

            {/* Order ID */}
            <div className="px-4 py-3 flex justify-between items-center">
              <span className="text-xs uppercase tracking-widest text-muted-foreground font-mono">
                ORDER ID
              </span>
              <span className="text-sm font-mono text-foreground">
                {orderNumber}
              </span>
            </div>

            {/* Guaranteed by */}
            <div className="px-4 py-3 flex justify-between items-center">
              <span className="text-xs uppercase tracking-widest text-muted-foreground font-mono">
                GUARANTEED BY
              </span>
              <span className="text-sm font-mono font-medium text-[hsl(var(--ollvy-green))]">
                {guaranteedDate}
              </span>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="px-6 pb-6">
          <Button
            onClick={handleViewOrder}
            className="w-full h-11 text-sm font-medium gap-2"
          >
            Start Setup
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
