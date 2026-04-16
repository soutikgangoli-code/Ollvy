'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Search, ChevronRight } from 'lucide-react'
import { LEARN_PAGES, LearnCategory } from '@/lib/guides/pages'

const CATEGORY_ORDER: LearnCategory[] = [
  'GST', 'Incorporation', 'Startup', 'Licensing', 'Tax', 'Compliance', 'Payroll', 'Registration',
  'TDS Filing', 'Income Tax Filing', 'ROC Filing', 'GST Filing',
  'GST Notice', 'Income Tax Notice', 'TDS Notice', 'ROC Notice',
]

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

export function GuidesSearch() {
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    if (!query.trim()) return LEARN_PAGES
    const q = query.toLowerCase()
    return LEARN_PAGES.filter(
      p =>
        p.title.toLowerCase().includes(q) ||
        p.seoDescription.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
    )
  }, [query])

  const pagesByCategory = useMemo(() => {
    return CATEGORY_ORDER.reduce((acc, category) => {
      const pages = filtered.filter(p => p.category === category)
      if (pages.length > 0) acc[category] = pages
      return acc
    }, {} as Record<LearnCategory, typeof LEARN_PAGES>)
  }, [filtered])

  return (
    <div className="max-w-3xl mx-auto">
      {/* Search input */}
      <div className="relative mb-10">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search guides, notices, deadlines..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 text-sm rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-foreground/30 transition-colors"
        />
      </div>

      {/* Results */}
      {Object.keys(pagesByCategory).length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-8">
          No guides found for "{query}"
        </p>
      ) : (
        Object.entries(pagesByCategory).map(([category, pages]) => (
          <div key={category} className="mb-12">
            <h2 className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-4">
              {CATEGORY_LABELS[category as LearnCategory]}
            </h2>

            <div className="space-y-3">
              {pages.map(page => (
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
          </div>
        ))
      )}

      {/* Bottom CTA */}
      {!query && (
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
