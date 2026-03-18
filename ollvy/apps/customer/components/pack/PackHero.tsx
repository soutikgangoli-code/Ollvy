import { CheckCircle, Shield, Clock, Users, Tag, Star, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { formatPaisa, CloudKitchenPack } from '@/lib/data/packs'

export function PackHero({
  pack, total, checkoutHref
}: {
  pack: CloudKitchenPack
  total: number
  checkoutHref: string
}) {
  return (
    <section className="max-w-[1200px] mx-auto px-6 pt-16 pb-0">
      <div className="grid lg:grid-cols-[1fr_auto] gap-20 items-start">

        {/* LEFT */}
        <div className="pb-16">

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-8">
            <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
            <ChevronRight size={12} />
            <Link href="/packs" className="hover:text-foreground transition-colors">Packs</Link>
            <ChevronRight size={12} />
            <span className="text-foreground">{pack.name}</span>
          </div>

          {/* H1 */}
          <h1 className="font-mono uppercase tracking-wider text-4xl md:text-5xl lg:text-[3.5rem] text-foreground leading-none whitespace-pre-line">
            {pack.h1}
          </h1>

          {/* Tagline */}
          <p className="text-base text-muted-foreground mt-6 max-w-xl leading-relaxed">
            {pack.tagline}
          </p>

          {/* Guarantee badge */}
          <div className="mt-6 inline-flex items-center gap-2 border border-green-500/30 dark:border-green-500/30 bg-green-500/5 dark:bg-green-500/5 rounded-full px-4 py-2">
            <CheckCircle size={14} className="text-green-600 dark:text-green-500 shrink-0" />
            <span className="text-xs text-green-600 dark:text-green-500">{pack.guaranteeText}</span>
          </div>

          {/* Metadata pills */}
          <div className="flex flex-wrap gap-3 mt-6">
            {[
              'Cloud kitchens - home bakers - dark kitchens',
              '4 services - filed simultaneously',
              'Live on Swiggy in 30-45 days',
            ].map((text) => (
              <span key={text} className="border border-border rounded-full px-4 py-2 text-xs text-muted-foreground">
                {text}
              </span>
            ))}
            <span className="border border-border rounded-full px-4 py-2 text-xs text-muted-foreground flex items-center gap-1.5">
              <Star size={10} className="fill-yellow-400 text-yellow-400" />
              4.8 - 47 reviews
            </span>
          </div>

          {/* Trust signals */}
          <div className="flex flex-wrap items-center gap-x-8 gap-y-3 mt-8 pt-6 border-t border-border">
            {[
              { icon: Shield, text: 'Verified CAs and agents' },
              { icon: Clock, text: 'SLA-guaranteed timelines' },
              { icon: Users, text: '2,400+ FSSAI filings' },
              { icon: Tag, text: 'Fixed pricing - no hidden fees' },
            ].map(({ icon: Icon, text }) => (
              <span key={text} className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
                <Icon size={12} />
                {text}
              </span>
            ))}
          </div>

          {/* Mobile CTA */}
          <div className="mt-8 lg:hidden">
            <a
              href={checkoutHref}
              className="bg-[hsl(var(--ollvy-green))] text-white rounded-lg h-12 w-full font-medium text-sm flex items-center justify-center active:scale-[0.98] transition-all"
            >
              Book Cloud Kitchen Setup - {formatPaisa(total)} →
            </a>
            <p className="text-xs text-muted-foreground text-center mt-2">
              Cancel within 2 hours for full refund
            </p>
          </div>

        </div>

        {/* RIGHT - booking panel placeholder (filled by PackBookingPanel via parent) */}
        {/* Note: PackBookingPanel is rendered in PackPage.tsx as part of the sidebar grid */}

      </div>
    </section>
  )
}
