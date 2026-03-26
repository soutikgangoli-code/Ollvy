'use client'

import { useState, useEffect, useCallback, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { SearchBar } from '@/components/services/SearchBar'
import { FilterChips } from '@/components/services/FilterChips'
import { ServiceGrid } from '@/components/services/ServiceGrid'
import { getClient } from '@/lib/supabase'
import { SERVICES } from '@/lib/services'
import type { ServicePackage } from '@/lib/types'
import { Skeleton } from '@/components/ui/skeleton'

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

// Convert static services to ServicePackage format for fallback
const STATIC_SERVICES: ServicePackage[] = SERVICES.map((s, index) => ({
  id: s.slug,
  slug: s.slug,
  name: s.name,
  short_description: s.tagline,
  long_description: s.tagline,
  order_type: s.isRetainer ? 'recurring' : 'one_time',
  billing_cycle: s.isRetainer ? 'monthly' : 'one_time',
  price_base_paisa: s.ollvyFee * 100,
  price_govt_fees_paisa: (s.govtFee ?? 0) * 100,
  price_gst_rate: 18,
  price_varies_by_state: false,
  sla_working_days: s.slaDays,
  situation_tags: [],
  workflow_stages: [],
  urgency_score: 50,
  avg_rating: 4.7,
  rating_count: 50,
  display_order: index,
  is_active: true,
  scope_included: s.whatsIncluded.map(w => w.title),
  scope_excluded: [],
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}))

function ServicesContent() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const [services, setServices] = useState<ServicePackage[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '')
  const [selectedFilters, setSelectedFilters] = useState<string[]>(
    searchParams.get('filter')?.split(',').filter(Boolean) || []
  )

  const fetchServices = useCallback(async () => {
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
      const tagFilters = selectedFilters.filter(f => !SPECIAL_FILTERS.includes(f))

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
        // Fall back to static services only on actual errors
        setServices(filterStaticServices(STATIC_SERVICES, searchQuery, selectedFilters))
      } else {
        // Use DB results even if empty (0 results is a valid search outcome)
        setServices(data || [])
      }
    } catch (err) {
      console.error('Failed to fetch services:', err)
      // Fall back to static services on error
      setServices(filterStaticServices(STATIC_SERVICES, searchQuery, selectedFilters))
    } finally {
      setIsLoading(false)
    }
  }, [searchQuery, selectedFilters])

  useEffect(() => {
    fetchServices()
  }, [fetchServices])

  useEffect(() => {
    const params = new URLSearchParams()
    if (searchQuery) params.set('q', searchQuery)
    if (selectedFilters.length > 0) params.set('filter', selectedFilters.join(','))

    const newUrl = params.toString() ? `?${params.toString()}` : '/services'
    router.replace(newUrl, { scroll: false })
  }, [searchQuery, selectedFilters, router])

  // JSON-LD structured data for services listing
  const servicesJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Business Compliance Services',
    description: 'Fixed-price compliance packages for Indian SMEs',
    url: 'https://www.ollvy.com/services',
    numberOfItems: services.length,
    itemListElement: services.map((service, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: service.name,
      url: `https://www.ollvy.com/services/${service.slug}`,
    })),
  }

  return (
    <div className="container py-12">
      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(servicesJsonLd) }}
      />

      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-semibold text-foreground">All Services</h1>
      </div>

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

// Filter static services by search query and tags
function filterStaticServices(
  services: ServicePackage[],
  query: string,
  tags: string[]
): ServicePackage[] {
  let filtered = services

  if (query) {
    const lowerQuery = query.toLowerCase()
    filtered = filtered.filter(
      s =>
        s.name.toLowerCase().includes(lowerQuery) ||
        s.short_description?.toLowerCase().includes(lowerQuery)
    )
  }

  // Tags filter not applicable for static services (no tags defined)
  // Could be extended later if needed

  return filtered
}

function ServicesLoadingSkeleton() {
  return (
    <div className="container py-12">
      <div className="mb-10">
        <Skeleton className="h-9 w-48 mb-3" />
        <Skeleton className="h-6 w-80" />
      </div>
      <div className="space-y-6 mb-10">
        <Skeleton className="h-12 w-full" />
        <div className="flex gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-24 rounded-full" />
          ))}
        </div>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-44 rounded-2xl" />
        ))}
      </div>
    </div>
  )
}

export default function ServicesPage() {
  return (
    <Suspense fallback={<ServicesLoadingSkeleton />}>
      <ServicesContent />
    </Suspense>
  )
}
