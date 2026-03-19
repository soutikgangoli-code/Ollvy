'use client'

import { cn } from '@/lib/utils'
import { UserCheck, Clock, MessageCircle, BadgeCheck, ChevronRight } from 'lucide-react'

interface CAAssignmentCardProps {
  className?: string
}

export function CAAssignmentCard({ className }: CAAssignmentCardProps) {
  return (
    <div className={cn('space-y-4', className)}>
      {/* Section Header */}
      <div>
        <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3 font-mono">YOUR PROFESSIONAL</p>
        <h3 className="text-lg md:text-xl font-semibold text-foreground">Dedicated CA Assignment</h3>
        <p className="text-sm text-muted-foreground mt-1">
          A verified Chartered Accountant will handle your filing end-to-end
        </p>
      </div>

      {/* Main Card */}
      <div className="border border-border rounded-xl overflow-hidden bg-card">
        {/* Header with avatar */}
        <div className="p-4 border-b border-border bg-muted/30">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[hsl(var(--ollvy-green))]/10 border border-[hsl(var(--ollvy-green))]/20 flex items-center justify-center">
              <UserCheck className="h-6 w-6 text-[hsl(var(--ollvy-green))]" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-foreground">Verified Chartered Accountant</p>
              <p className="text-sm text-muted-foreground">Assigned within 24 hours of payment</p>
            </div>
            <div className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-full bg-[hsl(var(--ollvy-green))]/10 border border-[hsl(var(--ollvy-green))]/20">
              <BadgeCheck className="h-3.5 w-3.5 text-[hsl(var(--ollvy-green))]" />
              <span className="text-xs font-medium text-[hsl(var(--ollvy-green-fg))]">ICAI Verified</span>
            </div>
          </div>
        </div>

        {/* Footer note */}
        <div className="p-4 bg-muted/30 border-t border-border">
          <p className="text-sm text-muted-foreground">
            You'll receive their name, registration number, and direct contact after payment.
          </p>
        </div>
      </div>
    </div>
  )
}
