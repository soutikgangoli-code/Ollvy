import Link from 'next/link';
import { LearnPageConfig, LearnCategory } from '@/lib/learn/pages';

const CATEGORY_LABELS: Record<LearnCategory, string> = {
  GST: 'GST',
  Incorporation: 'Company Registration',
  Startup: 'Startups',
  Licensing: 'Licensing',
  Tax: 'Tax',
  Compliance: 'Compliance',
  Payroll: 'Payroll',
};

export function LearnHero({ page }: { page: LearnPageConfig }) {
  return (
    <section className="border-b border-border bg-background">
      <div className="max-w-[760px] mx-auto px-6 pt-10 pb-8">

        {/* Breadcrumb */}
        <p className="text-xs text-muted-foreground mb-4">
          <Link href="/" className="hover:text-foreground transition-colors">Ollvy</Link>
          <span className="mx-1.5">→</span>
          <Link href="/learn" className="hover:text-foreground transition-colors">Guides</Link>
          <span className="mx-1.5">→</span>
          <span className="text-muted-foreground">{CATEGORY_LABELS[page.category]}</span>
        </p>

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
