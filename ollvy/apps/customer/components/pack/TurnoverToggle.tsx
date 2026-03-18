'use client'
import { AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

export function TurnoverToggle({
  value,
  onChange,
}: {
  value: 'basic' | 'state'
  onChange: (v: 'basic' | 'state') => void
}) {
  return (
    <div className="border border-amber-500/20 bg-amber-500/5 rounded-2xl p-6">
      <div className="flex items-start gap-4">
        <AlertCircle size={20} className="text-amber-600 dark:text-amber-500 shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="font-mono uppercase tracking-wider text-xs text-amber-600 dark:text-amber-500">
            ONE QUESTION BEFORE YOU BOOK
          </p>
          <p className="text-sm font-medium text-foreground mt-2">
            What is your expected annual revenue from the cloud kitchen?
          </p>
          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
            This determines whether you need FSSAI Basic Registration or FSSAI State License. Both include the same Ollvy service.
          </p>

          <div className="grid grid-cols-2 gap-3 mt-4">
            {([
              {
                v: 'basic' as const,
                label: 'UNDER ₹12 LAKH / YEAR',
                sub: 'FSSAI Basic Registration',
                govtFee: 'Govt fee: ₹100/yr',
              },
              {
                v: 'state' as const,
                label: '₹12 LAKH - ₹20 CRORE / YEAR',
                sub: 'FSSAI State License',
                govtFee: 'Govt fee: ₹2,000/yr',
              },
            ] as const).map(({ v, label, sub, govtFee }) => (
              <button
                key={v}
                onClick={() => onChange(v)}
                className={cn(
                  'border rounded-2xl p-4 text-left transition-all duration-200',
                  value === v
                    ? 'border-[hsl(var(--ollvy-green))] bg-[hsl(var(--ollvy-green))]/5'
                    : 'border-border bg-transparent hover:border-foreground/20'
                )}
              >
                <p className={cn(
                  'font-mono uppercase tracking-wider text-xs',
                  value === v ? 'text-[hsl(var(--ollvy-green))]' : 'text-muted-foreground'
                )}>
                  {label}
                </p>
                <p className="text-xs text-muted-foreground mt-1">{sub}</p>
                <p className="text-xs font-mono text-foreground mt-2">{govtFee}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
