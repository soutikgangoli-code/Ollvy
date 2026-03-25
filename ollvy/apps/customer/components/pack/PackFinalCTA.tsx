import { CheckCircle, Check, MessageCircle } from 'lucide-react'
import { formatPaisa } from '@/lib/data/packs'
import { getWhatsAppLink } from '@/lib/constants'

export function PackFinalCTA({
  total,
  checkoutHref,
  guaranteeText,
}: {
  total: number
  checkoutHref: string
  guaranteeText: string
}) {
  return (
    <div className="bg-card border-t border-border py-24 -mx-6 px-6 mt-24">
      <div className="max-w-2xl mx-auto text-center">
        <p className="font-mono uppercase tracking-wider text-xs text-muted-foreground mb-4">
          GET STARTED
        </p>

        <h2 className="font-mono uppercase tracking-wider text-3xl md:text-4xl text-foreground">
          CLOUD KITCHEN SETUP
        </h2>

        <p className="font-mono text-3xl font-bold text-foreground mt-6">
          {formatPaisa(total)}
        </p>

        {/* Guarantee badge */}
        <div className="mt-6 inline-flex items-center gap-3 border border-green-500/30 dark:border-green-500/30 bg-green-500/5 dark:bg-green-500/5 rounded-2xl px-8 py-4">
          <CheckCircle size={18} className="text-green-600 dark:text-green-500 shrink-0" />
          <span className="text-sm text-green-600 dark:text-green-500">{guaranteeText}</span>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
          <a
            href={checkoutHref}
            className="bg-[hsl(var(--ollvy-green))] text-white rounded-lg h-12 px-8 font-medium text-sm flex items-center justify-center active:scale-[0.98] transition-all"
          >
            Book Now →
          </a>
          <a
            href={getWhatsAppLink('Hi, I have a question about the Cloud Kitchen Setup pack')}
            target="_blank"
            className="border border-border rounded-lg h-12 px-8 text-sm text-muted-foreground flex items-center justify-center gap-2 hover:border-foreground/20 transition-all"
          >
            <MessageCircle size={16} className="text-green-600 dark:text-green-500" />
            Ask a question
          </a>
        </div>

        {/* Trust micro-row */}
        <div className="flex flex-wrap items-center justify-center gap-6 mt-8 pt-6 border-t border-border">
          {[
            'Verified CAs and agents',
            'SLA-guaranteed timelines',
            'Fixed pricing',
            'Cancel within 2 hours',
          ].map((text) => (
            <span key={text} className="flex items-center gap-2 text-xs text-muted-foreground">
              <Check size={12} className="text-green-600 dark:text-green-500 shrink-0" />
              {text}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
