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
        'flex gap-3 p-3 rounded-lg border',
        isYellow
          ? 'bg-amber-500/5 border-amber-500/10'
          : 'bg-red-500/5 border-red-500/10',
        className
      )}
    >
      {isYellow ? (
        <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
      ) : (
        <AlertCircle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
      )}
      <div className="min-w-0">
        <p className={cn(
          'text-sm font-medium mb-0.5',
          isYellow ? 'text-amber-600 dark:text-amber-400' : 'text-red-600 dark:text-red-400'
        )}>
          {title}
        </p>
        <p className={cn(
          'text-xs leading-relaxed',
          isYellow ? 'text-amber-700/80 dark:text-amber-300/80' : 'text-red-700/80 dark:text-red-300/80'
        )}>
          {body}
        </p>
      </div>
    </div>
  )
}
