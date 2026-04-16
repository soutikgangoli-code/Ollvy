import Link from 'next/link';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import { LearnPageConfig } from '@/lib/guides/pages';

export function LearnHero({ page }: { page: LearnPageConfig }) {
  // Determine category label for the mono header
  const categoryLabel = page.severity ? `${page.category}` : 'Guide';

  return (
    <header className="mb-12 text-center">
      {/* Mobile: back arrow */}
      <div className="md:hidden flex items-center justify-center mb-4">
        <Link href="/guides" className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-3.5 w-3.5" />
          <span className="text-foreground">All Guides</span>
        </Link>
      </div>
      {/* Desktop breadcrumb */}
      <nav className="hidden md:flex items-center justify-center gap-2 text-xs text-muted-foreground mb-4" aria-label="Breadcrumb">
        <Link href="/guides" className="hover:text-foreground transition-colors">
          Guides
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-foreground">{page.category}</span>
      </nav>

      <p className="font-mono text-sm uppercase tracking-[0.3em] text-muted-foreground mb-4">
        {categoryLabel}
      </p>

      <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground mb-6 tracking-tight">
        {page.title}
      </h1>

      <p className="text-sm text-muted-foreground">
        Last reviewed: <span className="text-foreground">{page.lastReviewed}</span>
        {' · '}Sourced from official government portals
      </p>
    </header>
  );
}
