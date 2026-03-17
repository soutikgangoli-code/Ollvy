'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'

interface StatutoryRefProps {
  shortText: string // e.g., "Sec 47, CGST Act"
  fullText: string // e.g., "Section 47 of Central Goods and Services Tax Act, 2017 — Late fee for failure to furnish return"
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
          'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700 cursor-help',
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
        <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-2 rounded-lg bg-gray-900 text-white text-xs shadow-lg">
          {fullText}
          {/* Arrow */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
        </div>
      )}
    </span>
  )
}
