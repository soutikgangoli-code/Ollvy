'use client'

import { useState, useEffect, useCallback, useMemo, useDeferredValue } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { SearchBar } from '@/components/services/SearchBar'
import { FilterChips } from '@/components/services/FilterChips'
import { ServiceGrid } from '@/components/services/ServiceGrid'
import { getClient } from '@/lib/supabase'
import type { ServicePackage } from '@/lib/types'
import type { ServiceSearchEntry } from './page'

// These match actual situation_tags in the database (plus special filters)
const CATEGORY_FILTERS = [
  { id: 'just_starting_out', label: 'Starting Out' },
  { id: 'filing_taxes', label: 'Tax Filing' },
  { id: 'taking_payments', label: 'GST & Payments' },
  { id: 'have_investors', label: 'Investors' },
  { id: 'importing_exporting', label: 'Import/Export' },
  { id: 'bundles', label: 'Bundles' },
  { id: 'cloud_kitchen', label: 'Cloud Kitchen' },
]

// Special filters that don't use situation_tags
const SPECIAL_FILTERS = ['bundles', 'cloud_kitchen']

interface ServicesClientProps {
  initialServices: ServicePackage[]
  searchIndex: ServiceSearchEntry[]
}

export function ServicesClient({ initialServices, searchIndex }: ServicesClientProps) {
  const searchParams = useSearchParams()
  const router = useRouter()

  const [services, setServices] = useState<ServicePackage[]>(initialServices)
  const [isLoading, setIsLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '')
  const [selectedFilters, setSelectedFilters] = useState<string[]>(
    searchParams.get('filter')?.split(',').filter(Boolean) || []
  )

  // Debounce search (250ms) so we don't re-query / re-URL on every keystroke
  const [debouncedQuery, setDebouncedQuery] = useState(searchQuery)
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(searchQuery), 250)
    return () => clearTimeout(t)
  }, [searchQuery])

  // Snippet computation is non-urgent — let the input update first
  const deferredQuery = useDeferredValue(debouncedQuery)

  // Only fetch when there are active filters or search query
  const hasActiveFilters = debouncedQuery || selectedFilters.length > 0

  const fetchServices = useCallback(async () => {
    // If no filters/search, use initial server-rendered data
    if (!hasActiveFilters) {
      setServices(initialServices)
      return
    }

    setIsLoading(true)

    try {
      const supabase = getClient()

      let query = supabase
        .from('service_packages')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true })

      if (debouncedQuery) {
        query = query.or(`name.ilike.%${debouncedQuery}%,short_description.ilike.%${debouncedQuery}%`)
      }

      // Separate special filters from situation_tag filters
      const tagFilters = selectedFilters.filter((f) => !SPECIAL_FILTERS.includes(f))

      if (tagFilters.length > 0) {
        query = query.overlaps('situation_tags', tagFilters)
      }

      // Handle special filters
      if (selectedFilters.includes('bundles')) {
        query = query.eq('is_bundle', true)
      }
      if (selectedFilters.includes('cloud_kitchen')) {
        query = query.ilike('name', '%cloud kitchen%')
      }

      const { data, error } = await query

      if (error) {
        console.error('Error fetching services:', error)
        setServices(filterServicesLocally(initialServices, debouncedQuery, selectedFilters))
      } else {
        setServices(data || [])
      }
    } catch (err) {
      console.error('Failed to fetch services:', err)
      setServices(filterServicesLocally(initialServices, debouncedQuery, selectedFilters))
    } finally {
      setIsLoading(false)
    }
  }, [debouncedQuery, selectedFilters, hasActiveFilters, initialServices])

  useEffect(() => {
    fetchServices()
  }, [fetchServices])

  useEffect(() => {
    const params = new URLSearchParams()
    if (debouncedQuery) params.set('q', debouncedQuery)
    if (selectedFilters.length > 0) params.set('filter', selectedFilters.join(','))

    const newUrl = params.toString() ? `?${params.toString()}` : '/services'
    router.replace(newUrl, { scroll: false })
  }, [debouncedQuery, selectedFilters, router])

  // Deep search: find snippets from service content for the current query
  const snippetsBySlug = useMemo(() => {
    const map: Record<string, { source: string; snippet: string }> = {}
    if (!deferredQuery.trim()) return map

    const q = deferredQuery.toLowerCase()

    for (const entry of searchIndex) {
      for (const { source, text } of entry.texts) {
        const idx = text.toLowerCase().indexOf(q)
        if (idx !== -1) {
          const start = Math.max(0, idx - 40)
          const end = Math.min(text.length, idx + q.length + 80)
          const snippet = (start > 0 ? '...' : '') + text.slice(start, end).trim() + (end < text.length ? '...' : '')
          map[entry.slug] = { source, snippet }
          break
        }
      }
    }

    return map
  }, [deferredQuery, searchIndex])

  // When searching, also include services matched by deep content search
  const deepMatchSlugs = useMemo(() => {
    if (!deferredQuery.trim()) return new Set<string>()
    return new Set(Object.keys(snippetsBySlug))
  }, [deferredQuery, snippetsBySlug])

  // Merge deep matches into services list (add any that Supabase query missed)
  const mergedServices = useMemo(() => {
    if (!deferredQuery.trim() || deepMatchSlugs.size === 0) return services

    const existingSlugs = new Set(services.map(s => s.slug))
    const extraServices = initialServices.filter(
      s => deepMatchSlugs.has(s.slug) && !existingSlugs.has(s.slug)
    )
    return [...services, ...extraServices]
  }, [services, deepMatchSlugs, deferredQuery, initialServices])

  return (
    <div className="container pb-12">
      {/* Search & Filters */}
      <div className="space-y-6 mb-10">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search for GST filing, company registration..."
        />
        <FilterChips
          filters={CATEGORY_FILTERS}
          selected={selectedFilters}
          onChange={setSelectedFilters}
        />
      </div>

      {/* Results count */}
      <div className="mb-6">
        {!isLoading && (
          <p className="text-sm text-muted-foreground">
            {mergedServices.length} service{mergedServices.length !== 1 ? 's' : ''} found
          </p>
        )}
      </div>

      <ServiceGrid
        services={mergedServices}
        isLoading={isLoading}
        snippets={deferredQuery.trim() ? snippetsBySlug : undefined}
        query={deferredQuery}
      />
    </div>
  )
}

// Filter services locally as fallback
function filterServicesLocally(
  services: ServicePackage[],
  query: string,
  tags: string[]
): ServicePackage[] {
  let filtered = services

  if (query) {
    const lowerQuery = query.toLowerCase()
    filtered = filtered.filter(
      (s) =>
        s.name.toLowerCase().includes(lowerQuery) ||
        s.short_description?.toLowerCase().includes(lowerQuery)
    )
  }

  // Tags filter - check situation_tags if available
  const tagFilters = tags.filter((f) => !SPECIAL_FILTERS.includes(f))
  if (tagFilters.length > 0) {
    filtered = filtered.filter(
      (s) => s.situation_tags && s.situation_tags.some((t) => tagFilters.includes(t))
    )
  }

  return filtered
}
