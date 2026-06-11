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
  driver,
  rowClassName,
  labelClassName,
  valueClassName,
}: {
  amountLabel: string // formatted total, e.g. "₹7,999"
  includes: string[]
  driver?: string | null // e.g. "stamp duty" — shown in brackets when the fee scales
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
        className={cn('w-full flex justify-between items-start text-left', expandable && 'cursor-pointer', rowClassName)}
      >
        <span className="flex flex-col items-start">
          <span className={cn('inline-flex items-center gap-1', labelClassName)}>
            Government Fees
            {expandable && (
              <ChevronDown className={cn('h-3 w-3 opacity-50 transition-transform duration-200', open && 'rotate-180')} />
            )}
          </span>
          {driver && (
            <span className="text-[11px] text-muted-foreground/60 mt-0.5">({driver})</span>
          )}
        </span>
        <span className={valueClassName}>{amountLabel}</span>
      </button>

      {expandable && open && (
        <ul className="mt-2 mb-1 ml-0.5 space-y-1.5 border-l border-border/50 pl-3">
          {includes.map((item, i) => (
            <li key={i} className="text-[11px] leading-snug text-muted-foreground/80">
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
