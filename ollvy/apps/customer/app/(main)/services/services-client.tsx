'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { SearchBar } from '@/components/services/SearchBar'
import { FilterChips } from '@/components/services/FilterChips'
import { ServiceGrid } from '@/components/services/ServiceGrid'
import { getClient } from '@/lib/supabase'
import type { ServicePackage } from '@/lib/types'

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
}

export function ServicesClient({ initialServices }: ServicesClientProps) {
  const searchParams = useSearchParams()
  const router = useRouter()

  const [services, setServices] = useState<ServicePackage[]>(initialServices)
  const [isLoading, setIsLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '')
  const [selectedFilters, setSelectedFilters] = useState<string[]>(
    searchParams.get('filter')?.split(',').filter(Boolean) || []
  )

  // Only fetch when there are active filters or search query
  const hasActiveFilters = searchQuery || selectedFilters.length > 0

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

      if (searchQuery) {
        query = query.or(`name.ilike.%${searchQuery}%,short_description.ilike.%${searchQuery}%`)
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
        // Fall back to filtering initial services locally
        setServices(filterServicesLocally(initialServices, searchQuery, selectedFilters))
      } else {
        setServices(data || [])
      }
    } catch (err) {
      console.error('Failed to fetch services:', err)
      // Fall back to filtering initial services locally
      setServices(filterServicesLocally(initialServices, searchQuery, selectedFilters))
    } finally {
      setIsLoading(false)
    }
  }, [searchQuery, selectedFilters, hasActiveFilters, initialServices])

  useEffect(() => {
    fetchServices()
    // Remove SSR grid once client component hydrates
    document.getElementById('ssr-services-grid')?.remove()
  }, [fetchServices])

  useEffect(() => {
    const params = new URLSearchParams()
    if (searchQuery) params.set('q', searchQuery)
    if (selectedFilters.length > 0) params.set('filter', selectedFilters.join(','))

    const newUrl = params.toString() ? `?${params.toString()}` : '/services'
    router.replace(newUrl, { scroll: false })
  }, [searchQuery, selectedFilters, router])

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
            {services.length} service{services.length !== 1 ? 's' : ''} found
          </p>
        )}
      </div>

      <ServiceGrid services={services} isLoading={isLoading} />
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
