'use client'

import { useState, useMemo, useRef, useEffect } from 'react'
import Link from 'next/link'
import { Search, ChevronRight, SlidersHorizontal, X } from 'lucide-react'
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
  const [filterOpen, setFilterOpen] = useState(false)
  const filterRef = useRef<HTMLDivElement>(null)

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setFilterOpen(false)
      }
    }
    if (filterOpen) document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [filterOpen])

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
      {/* Search + filter row */}
      <div className="flex gap-2 mb-10">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search guides, notices, deadlines..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 text-sm rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-foreground/30 transition-colors"
          />
        </div>

        {/* Filter button + dropdown */}
        <div className="relative" ref={filterRef}>
          <button
            onClick={() => setFilterOpen(!filterOpen)}
            className={cn(
              'h-full px-3 rounded-xl border text-sm flex items-center gap-2 transition-colors',
              activeFilter
                ? 'border-foreground/30 bg-foreground text-background'
                : 'border-border bg-card text-muted-foreground hover:text-foreground'
            )}
          >
            <SlidersHorizontal className="h-4 w-4" />
            {activeFilter && (
              <span className="text-xs font-medium hidden sm:inline">{CATEGORY_LABELS[activeFilter]}</span>
            )}
          </button>

          {filterOpen && (
            <div className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-border bg-card shadow-lg z-50 py-1">
              <button
                onClick={() => { setActiveFilter(null); setFilterOpen(false) }}
                className={cn(
                  'w-full text-left px-4 py-2.5 text-sm transition-colors',
                  !activeFilter ? 'text-foreground font-medium bg-muted/50' : 'text-muted-foreground hover:text-foreground hover:bg-muted/30'
                )}
              >
                All categories
              </button>
              {FILTER_TAGS.map(cat => (
                <button
                  key={cat}
                  onClick={() => { setActiveFilter(cat); setFilterOpen(false) }}
                  className={cn(
                    'w-full text-left px-4 py-2.5 text-sm transition-colors',
                    activeFilter === cat ? 'text-foreground font-medium bg-muted/50' : 'text-muted-foreground hover:text-foreground hover:bg-muted/30'
                  )}
                >
                  {CATEGORY_LABELS[cat]}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Active filter badge */}
      {activeFilter && (
        <div className="mb-6">
          <button
            onClick={() => setActiveFilter(null)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted text-xs font-medium text-foreground"
          >
            {CATEGORY_LABELS[activeFilter]}
            <X className="h-3 w-3" />
          </button>
        </div>
      )}

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
