'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Search, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { LEARN_PAGES, LearnCategory } from '@/lib/guides/pages'

const CATEGORY_LABELS: Record<LearnCategory, string> = {
  GST: 'GST',
  Incorporation: 'Company Registration',
  Startup: 'Startups',
  Licensing: 'Licensing',
  Tax: 'Tax',
  Compliance: 'Compliance',
  Payroll: 'Payroll',
  Registration: 'Registration',
  'TDS Filing': 'TDS Filing Deadlines',
  'Income Tax Filing': 'Income Tax Filing Deadlines',
  'ROC Filing': 'ROC Filing Deadlines',
  'GST Filing': 'GST Filing Deadlines',
  'GST Notice': 'GST Notices',
  'Income Tax Notice': 'Income Tax Notices',
  'TDS Notice': 'TDS Notices',
  'ROC Notice': 'ROC Notices',
}

// Unique categories that actually have pages, in display order
const FILTER_TAGS = (() => {
  const seen = new Set<LearnCategory>()
  const tags: LearnCategory[] = []
  for (const page of LEARN_PAGES) {
    if (!seen.has(page.category)) {
      seen.add(page.category)
      tags.push(page.category)
    }
  }
  return tags
})()

export function GuidesSearch() {
  const [query, setQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState<LearnCategory | null>(null)

  const filtered = useMemo(() => {
    let pages = LEARN_PAGES

    // Apply category filter
    if (activeFilter) {
      pages = pages.filter(p => p.category === activeFilter)
    }

    // Apply text search
    if (query.trim()) {
      const q = query.toLowerCase()
      pages = pages.filter(
        p =>
          p.title.toLowerCase().includes(q) ||
          p.seoDescription.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      )
    }

    return pages
  }, [query, activeFilter])

  return (
    <div className="max-w-3xl mx-auto">
      {/* Search input */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search guides, notices, deadlines..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 text-sm rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-foreground/30 transition-colors"
        />
      </div>

      {/* Category filter chips */}
      <div className="flex flex-wrap gap-2 mb-10">
        <button
          onClick={() => setActiveFilter(null)}
          className={cn(
            'px-3 py-1.5 rounded-lg text-xs font-medium transition-colors',
            !activeFilter
              ? 'bg-foreground text-background'
              : 'bg-muted text-muted-foreground hover:text-foreground'
          )}
        >
          All
        </button>
        {FILTER_TAGS.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveFilter(activeFilter === cat ? null : cat)}
            className={cn(
              'px-3 py-1.5 rounded-lg text-xs font-medium transition-colors',
              activeFilter === cat
                ? 'bg-foreground text-background'
                : 'bg-muted text-muted-foreground hover:text-foreground'
            )}
          >
            {CATEGORY_LABELS[cat]}
          </button>
        ))}
      </div>

      {/* Results — flat list, no category headers */}
      {filtered.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-8">
          No guides found{query ? ` for "${query}"` : ''}
        </p>
      ) : (
        <div className="space-y-3">
          {filtered.map(page => (
            <Link
              key={page.slug}
              href={`/guides/${page.slug}`}
              className="flex items-center justify-between p-4 sm:p-5 rounded-xl border border-border hover:border-foreground/30 hover:bg-muted/10 transition-colors group"
            >
              <div className="flex-1 min-w-0">
                <h3 className="text-sm sm:text-base font-semibold text-foreground group-hover:text-foreground/90">
                  {page.title}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1 line-clamp-2">
                  {page.seoDescription}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  Last reviewed: {page.lastReviewed}
                  {page.tool && (
                    <span className="ml-2 px-2 py-0.5 rounded-full bg-muted text-xs">
                      Includes {page.tool.type === 'eligibility' ? 'eligibility checker' :
                        page.tool.type === 'penalty' ? 'penalty calculator' :
                        page.tool.type === 'comparison' ? 'decision tool' : 'deadline tracker'}
                    </span>
                  )}
                </p>
              </div>
              <ChevronRight size={18} className="text-muted-foreground group-hover:text-foreground ml-4 shrink-0" />
            </Link>
          ))}
        </div>
      )}

      {/* Bottom CTA */}
      {!query && !activeFilter && (
        <div className="mt-16 text-center">
          <p className="text-sm text-muted-foreground">
            Need help with a specific compliance issue?{' '}
            <Link href="/services" className="text-foreground underline hover:no-underline">
              Browse all services
            </Link>
          </p>
        </div>
      )}
    </div>
  )
}
