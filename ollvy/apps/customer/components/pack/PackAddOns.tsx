import { ArrowRight } from 'lucide-react'
import type { PackAddOn } from '@/lib/data/packs/cloud-kitchen'

export function PackAddOns({ addOns }: { addOns: PackAddOn[] }) {
  return (
    <div>
      <p className="font-mono uppercase tracking-wider text-xs text-muted-foreground mb-2">
        OPTIONAL SERVICES
      </p>
      <h2 className="font-mono uppercase tracking-wider text-2xl text-foreground">
        ADD TO YOUR PACK
      </h2>
      <p className="text-sm text-muted-foreground mt-2">
        These are not required to list on Swiggy and Zomato. Add them if relevant to your situation.
      </p>

      <div className="grid md:grid-cols-3 gap-5 mt-8">
        {addOns.map((addon) => (
          <div
            key={addon.id}
            className="border border-border rounded-2xl p-6 flex flex-col hover:border-foreground/20 hover:bg-foreground/[0.03] transition-all duration-300"
          >
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-base font-medium text-foreground">{addon.name}</h3>
              {addon.badge && (
                <span className="rounded-full text-xs px-2 py-0.5 uppercase tracking-wider border border-border text-muted-foreground shrink-0">
                  {addon.badge}
                </span>
              )}
            </div>

            <p className="text-xs text-muted-foreground mt-2 leading-relaxed flex-1">
              {addon.note}
            </p>

            <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
              <span className="font-mono text-sm font-semibold text-foreground">
                {addon.priceDisplay}
              </span>
              <a
                href={`/services/${addon.id}`}
                className="border border-border rounded-lg h-8 px-3 text-xs text-muted-foreground flex items-center gap-1.5 hover:border-foreground/20 transition-all"
              >
                Add <ArrowRight size={12} />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
