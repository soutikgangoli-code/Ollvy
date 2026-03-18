import { Check, ArrowRight } from 'lucide-react'
import { formatPaisa } from '@/lib/data/packs'

type RetainerHook = {
  title: string
  body: string
  price: number
  priceLabel: string
  features: string[]
  ctaText: string
  ctaHref: string
}

export function PackRetainerHook({ hook }: { hook: RetainerHook }) {
  return (
    <div className="border border-border rounded-2xl p-6 md:p-8">
      <div className="grid md:grid-cols-[1fr_auto] gap-8 items-center">

        {/* Left */}
        <div>
          <p className="font-mono uppercase tracking-wider text-xs text-muted-foreground mb-2">
            AFTER YOUR SETUP
          </p>
          <h2 className="font-mono uppercase tracking-wider text-xl text-foreground">
            {hook.title}
          </h2>
          <p className="text-sm text-muted-foreground mt-3 leading-relaxed max-w-xl">
            {hook.body}
          </p>

          <div className="flex flex-wrap gap-x-6 gap-y-2 mt-4">
            {hook.features.map((feature) => (
              <span key={feature} className="flex items-center gap-2 text-xs text-foreground">
                <Check size={12} className="text-green-600 dark:text-green-500 shrink-0" />
                {feature}
              </span>
            ))}
          </div>
        </div>

        {/* Right */}
        <div className="flex flex-col items-center md:items-end gap-3">
          <div className="text-right">
            <span className="font-mono text-2xl font-bold text-foreground">
              {formatPaisa(hook.price)}
            </span>
            <span className="text-sm text-muted-foreground ml-1">
              {hook.priceLabel}
            </span>
          </div>
          <a
            href={hook.ctaHref}
            className="bg-[hsl(var(--ollvy-green))] text-white rounded-lg h-10 px-5 text-sm font-medium flex items-center gap-1.5 active:scale-[0.98] transition-all"
          >
            {hook.ctaText}
          </a>
        </div>

      </div>
    </div>
  )
}
