'use client'

import { Info } from 'lucide-react'
import { cn } from '@/lib/utils'

interface InfoBannerProps {
  title?: string
  body: string
  className?: string
}

export function InfoBanner({
  title,
  body,
  className,
}: InfoBannerProps) {
  return (
    <div
      className={cn(
        'flex gap-3 p-3 rounded-lg bg-muted/50 border border-border/50',
        className
      )}
    >
      <Info className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
      <div className="min-w-0">
        {title && (
          <p className="text-sm font-medium text-foreground mb-0.5">
            {title}
          </p>
        )}
        <p className="text-xs text-muted-foreground leading-relaxed">
          {body}
        </p>
      </div>
    </div>
  )
}
