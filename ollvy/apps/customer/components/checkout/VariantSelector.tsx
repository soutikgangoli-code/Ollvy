'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Settings2, Info } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Variant {
  id: string
  label: string
  sublabel: string
  priceAdjustment?: number
  govtFeeAdjustment?: number
  tooltip?: string
}

interface VariantSelectorProps {
  variants: Variant[]
  selectedVariant: string
  onVariantChange: (variantId: string) => void
  title?: string
  subtitle?: string
}

export function VariantSelector({
  variants,
  selectedVariant,
  onVariantChange,
  title = 'Select Your Option',
  subtitle,
}: VariantSelectorProps) {
  const [expandedTooltip, setExpandedTooltip] = useState<string | null>(null)

  if (!variants || variants.length === 0) {
    return null
  }

  return (
    <Card className="border-amber-500/20 bg-amber-500/5 dark:bg-amber-500/10">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-3 text-base">
          <Settings2 className="h-5 w-5 text-amber-600 dark:text-amber-400" />
          <span className="text-amber-700 dark:text-amber-300">{title}</span>
        </CardTitle>
        {subtitle && (
          <p className="text-sm text-amber-600/80 dark:text-amber-400/80">{subtitle}</p>
        )}
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid grid-cols-2 gap-3">
          {variants.map((variant) => (
            <div key={variant.id} className="flex flex-col">
              <button
                type="button"
                onClick={() => onVariantChange(variant.id)}
                className={cn(
                  'border rounded-xl p-4 text-left transition-all',
                  selectedVariant === variant.id
                    ? 'border-[hsl(var(--ollvy-green))] bg-[hsl(var(--ollvy-green))]/5'
                    : 'border-border hover:border-border/80 bg-card'
                )}
              >
                <div className="flex items-start justify-between gap-1">
                  <p className="text-sm font-medium text-foreground">{variant.label}</p>
                  {variant.tooltip && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        setExpandedTooltip(expandedTooltip === variant.id ? null : variant.id)
                      }}
                      className="shrink-0 text-muted-foreground hover:text-foreground transition-colors"
                      aria-label={`More info about ${variant.label}`}
                    >
                      <Info size={14} />
                    </button>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1">{variant.sublabel}</p>
              </button>
              {variant.tooltip && expandedTooltip === variant.id && (
                <p className="text-xs text-muted-foreground bg-muted/50 rounded-lg px-3 py-2 mt-1.5">
                  {variant.tooltip}
                </p>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
