'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'

interface StatutoryRefProps {
  shortText: string // e.g., "Sec 47"
  fullText: string // e.g., "Section 47 of Central Goods and Services Tax Act, 2017"
  className?: string
}

export function StatutoryRef({
  shortText,
  fullText,
  className,
}: StatutoryRefProps) {
  const [showTooltip, setShowTooltip] = useState(false)

  return (
    <span className="relative inline-block">
      <span
        className={cn(
          'inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono tracking-tight',
          'bg-muted/50 text-muted-foreground border border-border/30',
          'cursor-help transition-colors hover:bg-muted hover:text-foreground',
          className
        )}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onFocus={() => setShowTooltip(true)}
        onBlur={() => setShowTooltip(false)}
        tabIndex={0}
      >
        {shortText}
      </span>

      {/* Tooltip */}
      {showTooltip && (
        <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 p-3 rounded-md bg-popover text-popover-foreground text-xs shadow-lg border border-border animate-in fade-in-0 zoom-in-95 duration-100">
          <p className="leading-relaxed">{fullText}</p>
          {/* Arrow */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-[6px] border-transparent border-t-popover" />
        </div>
      )}
    </span>
  )
}
