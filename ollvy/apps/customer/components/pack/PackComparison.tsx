import { Check, X } from 'lucide-react'

export function PackComparison({
  without,
  with_,
}: {
  without: string[]
  with_: string[]
}) {
  return (
    <div>
      <p className="font-mono uppercase tracking-wider text-xs text-muted-foreground mb-2">
        WHY OLLVY
      </p>
      <h2 className="font-mono uppercase tracking-wider text-2xl text-foreground">
        WE FILE CORRECTLY. NOT JUST ON TIME.
      </h2>
      <p className="text-sm text-muted-foreground mt-2">
        Most agents submit what you give them and hope for the best. Ollvy reviews your documents before filing.
      </p>

      <div className="grid md:grid-cols-2 gap-5 mt-8">
        {/* Without Ollvy */}
        <div className="border border-border rounded-2xl p-6 opacity-60">
          <p className="font-mono uppercase tracking-wider text-xs text-muted-foreground mb-4">
            WITHOUT OLLVY
          </p>
          <div className="space-y-3">
            {without.map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <X size={14} className="text-red-500 shrink-0 mt-0.5" />
                <p className="text-sm text-muted-foreground leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
        </div>

        {/* With Ollvy */}
        <div className="border border-[hsl(var(--ollvy-green))]/30 bg-[hsl(var(--ollvy-green))]/5 rounded-2xl p-6">
          <p className="font-mono uppercase tracking-wider text-xs text-[hsl(var(--ollvy-green))] mb-4">
            WITH OLLVY
          </p>
          <div className="space-y-3">
            {with_.map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <Check size={14} className="text-green-600 dark:text-green-500 shrink-0 mt-0.5" />
                <p className="text-sm text-foreground leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
