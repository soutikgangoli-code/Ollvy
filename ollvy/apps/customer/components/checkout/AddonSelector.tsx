'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Package, Square, CheckSquare } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Addon {
  id: string
  name: string
  description: string
  pricePaisa: number
  govtFeePaisa?: number
  required?: boolean
  defaultSelected?: boolean
}

interface AddonSelectorProps {
  addons: Addon[]
  selectedAddons: string[]
  onAddonsChange: (addonIds: string[]) => void
}

export function AddonSelector({
  addons,
  selectedAddons,
  onAddonsChange,
}: AddonSelectorProps) {
  if (!addons || addons.length === 0) {
    return null
  }

  const toggleAddon = (addonId: string) => {
    const addon = addons.find(a => a.id === addonId)
    if (addon?.required) return // Can't toggle required addons

    const newAddons = selectedAddons.includes(addonId)
      ? selectedAddons.filter(id => id !== addonId)
      : [...selectedAddons, addonId]

    onAddonsChange(newAddons)
  }

  return (
    <Card className="border-border">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-3 text-base">
          <Package className="h-5 w-5 text-muted-foreground" />
          Included Services
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Customize your bundle by selecting the services you need
        </p>
      </CardHeader>
      <CardContent className="pt-0 space-y-2">
        {addons.map((addon) => {
          const isSelected = selectedAddons.includes(addon.id)
          const isRequired = addon.required
          const addonTotalPrice = (addon.pricePaisa + (addon.govtFeePaisa ?? 0)) / 100

          return (
            <button
              key={addon.id}
              type="button"
              onClick={() => toggleAddon(addon.id)}
              disabled={isRequired}
              className={cn(
                'w-full border rounded-xl p-4 text-left transition-all flex items-start gap-3',
                isSelected
                  ? 'border-[hsl(var(--ollvy-green))] bg-[hsl(var(--ollvy-green))]/5'
                  : 'border-border hover:border-border/80 bg-muted/30',
                isRequired && 'cursor-not-allowed opacity-70'
              )}
            >
              <div className="mt-0.5 shrink-0">
                {isSelected ? (
                  <CheckSquare className="w-5 h-5 text-[hsl(var(--ollvy-green))]" />
                ) : (
                  <Square className="w-5 h-5 text-muted-foreground" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-medium text-foreground">{addon.name}</p>
                  <span className="font-mono text-sm text-foreground shrink-0">
                    +{'\u20B9'}{addonTotalPrice.toLocaleString('en-IN')}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                  {addon.description}
                </p>
                {isRequired && (
                  <span className="inline-block mt-2 text-xs text-amber-600 dark:text-amber-400 font-medium px-2 py-0.5 bg-amber-500/10 rounded">
                    Required
                  </span>
                )}
              </div>
            </button>
          )
        })}
      </CardContent>
    </Card>
  )
}
