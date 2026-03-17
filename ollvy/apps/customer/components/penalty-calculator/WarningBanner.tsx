'use client'

import { AlertTriangle, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface WarningBannerProps {
  variant: 'yellow' | 'red'
  title: string
  body: string
  className?: string
}

export function WarningBanner({
  variant,
  title,
  body,
  className,
}: WarningBannerProps) {
  const isYellow = variant === 'yellow'

  return (
    <div
      className={cn(
        'flex gap-3 p-4 rounded-lg border',
        isYellow
          ? 'bg-amber-50 border-amber-200 text-amber-900'
          : 'bg-red-50 border-red-200 text-red-900',
        className
      )}
    >
      {isYellow ? (
        <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
      ) : (
        <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
      )}
      <div>
        <p className="font-semibold text-sm">{title}</p>
        <p className="text-sm mt-1 opacity-90">{body}</p>
      </div>
    </div>
  )
}
