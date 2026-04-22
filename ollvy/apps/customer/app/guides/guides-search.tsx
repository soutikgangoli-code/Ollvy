'use client'

import { useState, useMemo, useRef, useEffect } from 'react'
import Link from 'next/link'
import { Search, ArrowRight, SlidersHorizontal, X, FileText, AlertTriangle, Clock, Check } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { LearnCategory } from '@/lib/guides/pages'

// Minimal per-guide entry shipped to the client. Built server-side from
// LEARN_PAGES to keep the full config (~480KB) out of the client bundle.
export interface GuideSearchEntry {
  slug: string
  title: string
  seoDescription: string
  category: LearnCategory
  lastReviewed: string
  toolType?: 'eligibility' | 'penalty' | 'comparison' | 'deadline'
  searchBlocks: { source: string; text: string }[]
}

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

interface GuidesSearchProps {
  entries: GuideSearchEntry[]
}

export function GuidesSearch({ entries }: GuidesSearchProps) {
  const [query, setQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<Set<LearnCategory>>(new Set())
  const [filterOpen, setFilterOpen] = useState(false)

  // Unique categories that actually have entries
  const filterTags = useMemo(() => {
    const seen = new Set<LearnCategory>()
    const tags: LearnCategory[] = []
    for (const entry of entries) {
      if (!seen.has(entry.category)) {
        seen.add(entry.category)
        tags.push(entry.category)
      }
    }
    return tags
  }, [entries])

  const toggleFilter = (cat: LearnCategory) => {
    setActiveFilters(prev => {
      const next = new Set(prev)
      if (next.has(cat)) next.delete(cat)
      else next.add(cat)
      return next
    })
  }
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

  // Search results with matched snippet from within the guide content
  const filtered = useMemo(() => {
    let pages = entries
    if (activeFilters.size > 0) pages = pages.filter(p => activeFilters.has(p.category))

    if (!query.trim()) {
      return pages.map(p => ({ entry: p, snippet: null as string | null, snippetSource: null as string | null }))
    }

    const q = query.toLowerCase()

    return pages
      .map(p => {
        // Check title/description first
        const titleMatch = p.title.toLowerCase().includes(q) || p.seoDescription.toLowerCase().includes(q)

        // Search within pre-built blocks
        let snippet: string | null = null
        let snippetSource: string | null = null

        for (const block of p.searchBlocks) {
          const bodyLower = block.text.toLowerCase()
          const idx = bodyLower.indexOf(q)
          if (idx !== -1) {
            const start = Math.max(0, idx - 40)
            const end = Math.min(block.text.length, idx + q.length + 80)
            snippet = (start > 0 ? '...' : '') + block.text.slice(start, end).trim() + (end < block.text.length ? '...' : '')
            snippetSource = block.source
            break
          }
        }

        const hasMatch = titleMatch || snippet !== null
        return hasMatch ? { entry: p, snippet, snippetSource } : null
      })
      .filter((r): r is NonNullable<typeof r> => r !== null)
  }, [query, activeFilters, entries])

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
              activeFilters.size > 0
                ? 'border-foreground/30 bg-foreground text-background'
                : 'border-border bg-card text-muted-foreground hover:text-foreground hover:border-foreground/30'
            )}
          >
            <SlidersHorizontal className="h-4 w-4" />
            {activeFilters.size > 0 && (
              <span className="text-xs font-mono">{activeFilters.size}</span>
            )}
          </button>

          {filterOpen && (
            <div className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-border bg-card shadow-lg z-50 py-1 max-h-[60vh] overflow-y-auto">
              {filterTags.map(cat => (
                <button
                  key={cat}
                  onClick={() => toggleFilter(cat)}
                  className={cn(
                    'w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center justify-between',
                    activeFilters.has(cat) ? 'text-foreground font-medium bg-muted/50' : 'text-muted-foreground hover:text-foreground hover:bg-muted/30'
                  )}
                >
                  {CATEGORY_LABELS[cat]}
                  {activeFilters.has(cat) && <Check className="h-3.5 w-3.5 text-[hsl(var(--ollvy-green))]" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Active filters + result count */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex flex-wrap gap-2">
          {Array.from(activeFilters).map(cat => (
            <button
              key={cat}
              onClick={() => toggleFilter(cat)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted text-xs font-medium text-foreground hover:bg-muted/80 transition-colors"
            >
              {CATEGORY_LABELS[cat]}
              <X className="h-3 w-3" />
            </button>
          ))}
        </div>
        <p className="text-xs text-muted-foreground font-mono shrink-0">
          {filtered.length} {filtered.length === 1 ? 'guide' : 'guides'}
        </p>
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-sm text-muted-foreground">
            No guides found{query ? ` for "${query}"` : ''}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(result => {
            const entry = result.entry
            const Icon = getCategoryIcon(entry.category)
            const toolBadge = getToolBadge(entry.toolType)

            return (
              <Link key={entry.slug} href={`/guides/${entry.slug}`}>
                <Card className="border border-border hover:border-[hsl(var(--ollvy-green))] transition-colors cursor-pointer group">
                  <CardHeader className="flex flex-row items-start gap-3 py-4 px-4">
                    <div className="p-2 rounded-lg bg-muted shrink-0">
                      <Icon className="h-4 w-4 text-muted-foreground group-hover:text-[hsl(var(--ollvy-green))] transition-colors" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-sm font-medium flex items-center justify-between gap-2 text-foreground/80">
                        <span className="line-clamp-1">{entry.title}</span>
                        <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-[hsl(var(--ollvy-green))] transition-colors shrink-0" />
                      </CardTitle>
                      <CardDescription className="mt-1 text-xs line-clamp-2">
                        {entry.seoDescription}
                      </CardDescription>
                      {/* Matched snippet from within the guide */}
                      {result.snippet && query.trim() && (
                        <div className="mt-2 px-3 py-2 rounded-lg bg-muted/50 border border-border/50">
                          <p className="text-[10px] text-muted-foreground font-mono mb-1">
                            Found in: {result.snippetSource}
                          </p>
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            <HighlightedSnippet text={result.snippet} query={query} />
                          </p>
                        </div>
                      )}
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-[10px] text-muted-foreground font-mono">
                          {entry.lastReviewed}
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
      {!query && activeFilters.size === 0 && (
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

// Highlights matching text within the snippet
function HighlightedSnippet({ text, query }: { text: string; query: string }) {
  if (!query.trim()) return <>{text}</>

  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
  const parts = text.split(regex)

  return (
    <>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <mark key={i} className="bg-[hsl(var(--ollvy-green))]/20 text-foreground rounded-sm px-0.5">{part}</mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  )
}
