import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { LearnPageConfig } from '@/lib/guides/pages';

export function LearnHero({ page }: { page: LearnPageConfig }) {
  return (
    <section className="border-b border-border bg-background">
      <div className="max-w-[760px] mx-auto px-6 pt-10 pb-8">

        {/* All Guides Link */}
        <Link
          href="/guides"
          className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ChevronLeft className="h-3 w-3" />
          All Guides
        </Link>

        {/* H1 */}
        <h1 className="text-3xl md:text-4xl font-bold text-foreground leading-tight">
          {page.title}
        </h1>

        {/* Last reviewed */}
        <p className="text-xs text-muted-foreground mt-4">
          Last reviewed:{' '}
          <span className="text-foreground">{page.lastReviewed}</span>
          {' · '}
          <span>Sourced from official government portals</span>
        </p>
      </div>
    </section>
  );
}
