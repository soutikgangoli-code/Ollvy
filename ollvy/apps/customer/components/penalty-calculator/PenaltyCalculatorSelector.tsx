'use client'

import { useRouter } from 'next/navigation'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { penaltyCalculators } from './penalty-calculator-data'

interface PenaltyCalculatorSelectorProps {
  currentHref: string
  currentLabel: string
}

export function PenaltyCalculatorSelector({ currentHref, currentLabel }: PenaltyCalculatorSelectorProps) {
  const router = useRouter()

  const handleChange = (value: string) => {
    router.push(value)
  }

  return (
    <Select value={currentHref} onValueChange={handleChange}>
      <SelectTrigger className="w-full max-w-[320px] h-11 bg-card border-border text-sm">
        <SelectValue>
          <span className="text-muted-foreground">Switch calculator:</span>{' '}
          <span className="text-foreground">{currentLabel}</span>
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="max-h-[400px] min-w-[280px] sm:min-w-[320px]">
        {penaltyCalculators.map((calc) => (
          <SelectItem
            key={calc.href}
            value={calc.href}
            className="py-3 cursor-pointer"
          >
            <div className="flex items-center justify-between gap-4 w-full">
              <span>{calc.label}</span>
              <span className="font-mono text-[10px] text-muted-foreground">
                {calc.shortForm}
              </span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
