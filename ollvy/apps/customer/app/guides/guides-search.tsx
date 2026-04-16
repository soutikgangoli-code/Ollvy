'use client'

import { useState, useMemo, useRef, useEffect } from 'react'
import Link from 'next/link'
import { Search, ArrowRight, SlidersHorizontal, X, FileText, AlertTriangle, Calculator, Clock } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
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

// Icon based on category type
function getCategoryIcon(category: LearnCategory) {
  if (category.includes('Notice')) return AlertTriangle
  if (category.includes('Filing') || category.includes('Deadline')) return Clock
  return FileText
}

// Tool badge text
function getToolBadge(toolType?: string) {
  if (!toolType) return null
  switch (toolType) {
    case 'eligibility': return 'Eligibility Checker'
    case 'penalty': return 'Penalty Calculator'
    case 'comparison': return 'Decision Tool'
    case 'deadline': return 'Deadline Tracker'
    default: return null
  }
}

// Unique categories that actually have pages
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
    if (activeFilter) pages = pages.filter(p => p.category === activeFilter)
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
    <div className="max-w-4xl mx-auto">
      {/* Search + filter */}
      <div className="flex gap-2 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search guides, notices, deadlines..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 text-sm rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-foreground/30 transition-colors"
          />
        </div>

        <div className="relative" ref={filterRef}>
          <button
            onClick={() => setFilterOpen(!filterOpen)}
            className={cn(
              'h-full px-3.5 rounded-xl border text-sm flex items-center gap-2 transition-colors',
              activeFilter
                ? 'border-foreground/30 bg-foreground text-background'
                : 'border-border bg-card text-muted-foreground hover:text-foreground hover:border-foreground/30'
            )}
          >
            <SlidersHorizontal className="h-4 w-4" />
          </button>

          {filterOpen && (
            <div className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-border bg-card shadow-lg z-50 py-1 max-h-[60vh] overflow-y-auto">
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

      {/* Active filter + result count */}
      <div className="flex items-center justify-between mb-8">
        <div>
          {activeFilter && (
            <button
              onClick={() => setActiveFilter(null)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted text-xs font-medium text-foreground hover:bg-muted/80 transition-colors"
            >
              {CATEGORY_LABELS[activeFilter]}
              <X className="h-3 w-3" />
            </button>
          )}
        </div>
        <p className="text-xs text-muted-foreground font-mono">
          {filtered.length} {filtered.length === 1 ? 'guide' : 'guides'}
        </p>
      </div>

      {/* Results — card style matching penalty calculator index */}
      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-sm text-muted-foreground">
            No guides found{query ? ` for "${query}"` : ''}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(page => {
            const Icon = getCategoryIcon(page.category)
            const toolBadge = getToolBadge(page.tool?.type)

            return (
              <Link key={page.slug} href={`/guides/${page.slug}`}>
                <Card className="border border-border hover:border-[hsl(var(--ollvy-green))] transition-colors cursor-pointer group">
                  <CardHeader className="flex flex-row items-start gap-3 py-4 px-4">
                    <div className="p-2 rounded-lg bg-muted shrink-0">
                      <Icon className="h-4 w-4 text-muted-foreground group-hover:text-[hsl(var(--ollvy-green))] transition-colors" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-sm font-medium flex items-center justify-between gap-2 text-foreground/80">
                        <span className="line-clamp-1">{page.title}</span>
                        <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-[hsl(var(--ollvy-green))] transition-colors shrink-0" />
                      </CardTitle>
                      <CardDescription className="mt-1 text-xs line-clamp-2">
                        {page.seoDescription}
                      </CardDescription>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-[10px] text-muted-foreground font-mono">
                          {page.lastReviewed}
                        </span>
                        {toolBadge && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-[hsl(var(--ollvy-green))]/10 text-[hsl(var(--ollvy-green-fg))] font-medium">
                            {toolBadge}
                          </span>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              </Link>
            )
          })}
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
