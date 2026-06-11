'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * A "Government Fees" price row that expands on a chevron to reveal what the fee
 * covers (an honest list of the statutory items, no per-item amounts). Collapsed
 * by default. The chevron only appears when there are 2+ items to reveal.
 *
 * Styling is passed in so it can match each surface (checkout summary, service
 * page price card) exactly.
 */
export function GovtFeeRow({
  amountLabel,
  includes,
  rowClassName,
  labelClassName,
  valueClassName,
}: {
  amountLabel: string // formatted total, e.g. "₹7,999"
  includes: string[]
  rowClassName?: string
  labelClassName?: string
  valueClassName?: string
}) {
  const [open, setOpen] = useState(false)
  const expandable = includes.length > 1

  return (
    <div>
      <button
        type="button"
        onClick={(e) => {
          if (!expandable) return
          e.stopPropagation() // don't collapse a parent (e.g. the mobile summary bar)
          setOpen((o) => !o)
        }}
        disabled={!expandable}
        aria-expanded={expandable ? open : undefined}
        className={cn('w-full flex justify-between items-center text-left', expandable && 'cursor-pointer', rowClassName)}
      >
        <span className={cn('inline-flex items-center gap-1', labelClassName)}>
          Government Fees
          {expandable && (
            <ChevronDown className={cn('h-3 w-3 opacity-50 transition-transform duration-200', open && 'rotate-180')} />
          )}
        </span>
        <span className={valueClassName}>{amountLabel}</span>
      </button>

      {expandable && open && (
        <ul className="mt-2 mb-1 space-y-1">
          {includes.map((item, i) => (
            <li key={i} className="flex gap-2 text-xs text-muted-foreground">
              <span className="text-muted-foreground/40">·</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
