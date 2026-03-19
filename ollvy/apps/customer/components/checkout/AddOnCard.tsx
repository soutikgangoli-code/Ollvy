'use client'

import { Check, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AddOnCardProps {
  id: string
  name: string
  price: number
  description: string
  whyNow?: string
  required?: boolean
  isSelected: boolean
  onToggle: (id: string) => void
  className?: string
}

function formatPrice(paisa: number): string {
  return '\u20B9' + (paisa / 100).toLocaleString('en-IN')
}

export function AddOnCard({
  id,
  name,
  price,
  description,
  whyNow,
  required,
  isSelected,
  onToggle,
  className,
}: AddOnCardProps) {
  return (
    <div
      className={cn(
        'border rounded-xl p-4 transition-colors',
        isSelected ? 'border-[hsl(var(--ollvy-green))] bg-[hsl(var(--ollvy-green))]/5' : 'border-border',
        required && 'opacity-70',
        className
      )}
    >
      <div className="flex gap-4">
        {/* Left: Info */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-medium text-foreground">{name}</h4>
            <span className="font-mono text-foreground">{formatPrice(price)}</span>
            {required && (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 font-medium">
                Required
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground mb-2">{description}</p>
          {whyNow && (
            <p className="text-sm text-muted-foreground">
              <span className="font-medium">Why now:</span> {whyNow}
            </p>
          )}
        </div>

        {/* Right: Toggle button */}
        <div className="flex-shrink-0">
          <button
            onClick={() => !required && onToggle(id)}
            disabled={required}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded text-sm font-medium transition-colors',
              required && 'cursor-not-allowed',
              isSelected
                ? 'bg-[hsl(var(--ollvy-green))] text-white'
                : 'bg-transparent border border-[hsl(var(--ollvy-green))] text-[hsl(var(--ollvy-green-fg))] hover:bg-[hsl(var(--ollvy-green))]/5'
            )}
          >
            {isSelected ? (
              <>
                <Check className="h-4 w-4" />
                {required ? 'Included' : 'Added'}
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" />
                Add
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

interface AddOnsSectionProps {
  addons: Array<{
    id: string
    name: string
    price: number
    description: string
    whyNow?: string
    required?: boolean
  }>
  selectedIds: string[]
  onToggle: (id: string) => void
  className?: string
}

export function AddOnsSection({ addons, selectedIds, onToggle, className }: AddOnsSectionProps) {
  if (!addons || addons.length === 0) return null

  return (
    <div className={cn('space-y-4', className)}>
      <div>
        <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3 font-mono">ADD-ONS</p>
        <h3 className="text-lg md:text-xl font-semibold text-foreground">Frequently added at this step</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Most founders need at least one of these within 30 days of incorporating
        </p>
      </div>

      <div className="space-y-3">
        {addons.slice(0, 3).map((addon) => (
          <AddOnCard
            key={addon.id}
            {...addon}
            isSelected={selectedIds.includes(addon.id)}
            onToggle={onToggle}
          />
        ))}
      </div>
    </div>
  )
}
