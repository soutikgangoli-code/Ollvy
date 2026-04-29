'use client'

import { cn } from '@/lib/utils'
import { ShoppingCart, Check } from 'lucide-react'

export type ServiceToggleState = 'cart' | 'none' | 'done'

interface ServiceToggleProps {
  state: ServiceToggleState
  onChange: (next: ServiceToggleState) => void
  disabled?: boolean
  disabledReason?: string
}

/**
 * Three-position iOS-style toggle.
 *  Left  = Add to cart
 *  Center = Neither (default)
 *  Right = Mark as already done (planning tool; also unlocks dependent services)
 *
 * Clicking left/right cycles to/from that position.
 * Disabled when prerequisite isn't satisfied (and not marked done).
 */
export function ServiceToggle({ state, onChange, disabled, disabledReason }: ServiceToggleProps) {
  const goCart = () => !disabled && onChange(state === 'cart' ? 'none' : 'cart')
  const goDone = () => !disabled && onChange(state === 'done' ? 'none' : 'done')

  return (
    <div
      role="group"
      aria-label="Service selection"
      title={disabled ? disabledReason : undefined}
      className={cn(
        'inline-flex items-center rounded-full border bg-muted/40 p-0.5 select-none',
        disabled ? 'border-border/40 opacity-50 cursor-not-allowed' : 'border-border'
      )}
    >
      <button
        type="button"
        onClick={goCart}
        disabled={disabled}
        aria-pressed={state === 'cart'}
        aria-label="Add to cart"
        className={cn(
          'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all',
          state === 'cart'
            ? 'bg-foreground text-background shadow-sm'
            : 'text-muted-foreground hover:text-foreground'
        )}
      >
        <ShoppingCart size={12} />
        Add
      </button>

      <button
        type="button"
        onClick={goDone}
        disabled={disabled}
        aria-pressed={state === 'done'}
        aria-label="Mark as already done"
        className={cn(
          'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all',
          state === 'done'
            ? 'bg-[hsl(var(--ollvy-green))] text-white shadow-sm'
            : 'text-muted-foreground hover:text-foreground'
        )}
      >
        <Check size={12} />
        Done
      </button>
    </div>
  )
}
