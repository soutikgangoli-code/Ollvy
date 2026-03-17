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
        'flex gap-3 p-4 rounded-lg border bg-blue-50 border-blue-200 text-blue-900',
        className
      )}
    >
      <Info className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
      <div>
        {title && <p className="font-semibold text-sm">{title}</p>}
        <p className={cn('text-sm', title && 'mt-1')}>{body}</p>
      </div>
    </div>
  )
}
