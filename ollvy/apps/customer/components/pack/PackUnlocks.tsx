import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import type { PackUnlock } from '@/lib/data/packs/cloud-kitchen'

export function PackUnlocks({ unlocks }: { unlocks: PackUnlock[] }) {
  return (
    <div>
      <p className="font-mono uppercase tracking-wider text-xs text-muted-foreground mb-2">
        WHAT THIS UNLOCKS
      </p>
      <h2 className="font-mono uppercase tracking-wider text-2xl text-foreground">
        AFTER YOUR SETUP
      </h2>
      <p className="text-sm text-muted-foreground mt-2">
        Services that become available or mandatory once your cloud kitchen is registered.
      </p>

      <div className="grid md:grid-cols-2 gap-5 mt-8">
        {unlocks.map((unlock, i) => (
          <div
            key={i}
            className="border border-border rounded-2xl p-6 flex items-start gap-4"
          >
            {/* Icon */}
            <div className="w-8 h-8 rounded-full bg-[hsl(var(--ollvy-green))]/10 flex items-center justify-center shrink-0">
              <ArrowRight size={14} className="text-[hsl(var(--ollvy-green))]" />
            </div>

            {/* Content */}
            <div className="flex-1">
              <h3 className="text-sm font-medium text-foreground">
                {unlock.title}
              </h3>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                {unlock.detail}
              </p>
              {unlock.ctaText && unlock.ctaHref && (
                <Link
                  href={unlock.ctaHref}
                  className="inline-flex items-center gap-1 text-xs text-[hsl(var(--ollvy-green))] mt-3 hover:underline"
                >
                  {unlock.ctaText}
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
