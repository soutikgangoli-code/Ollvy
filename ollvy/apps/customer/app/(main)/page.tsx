'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { SearchBar } from '@/components/services/SearchBar'
import { FilterChips } from '@/components/services/FilterChips'
import { ServiceGrid } from '@/components/services/ServiceGrid'
import { Button } from '@/components/ui/button'
import { getClient } from '@/lib/supabase'
import type { ServicePackage } from '@/lib/types'
import { Skeleton } from '@/components/ui/skeleton'
import { ArrowRight, Shield, Clock, Users } from 'lucide-react'

const QUICK_FILTERS = [
  { id: 'gst', label: 'GST & Tax' },
  { id: 'registration', label: 'Registration' },
  { id: 'compliance', label: 'Compliance' },
  { id: 'legal', label: 'Legal' },
]

export default function HomePage() {
  const [services, setServices] = useState<ServicePackage[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFilters, setSelectedFilters] = useState<string[]>([])

  const fetchServices = useCallback(async () => {
    setIsLoading(true)

    try {
      const supabase = getClient()

      let query = supabase
        .from('service_packages')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true })
        .limit(12)

      if (searchQuery) {
        query = query.or(`name.ilike.%${searchQuery}%,short_description.ilike.%${searchQuery}%`)
      }

      if (selectedFilters.length > 0) {
        query = query.overlaps('situation_tags', selectedFilters)
      }

      const { data, error } = await query

      if (error) {
        console.error('Error fetching services:', error)
        setServices([])
      } else {
        setServices(data || [])
      }
    } catch (err) {
      console.error('Failed to fetch services:', err)
      setServices([])
    } finally {
      setIsLoading(false)
    }
  }, [searchQuery, selectedFilters])

  useEffect(() => {
    fetchServices()
  }, [fetchServices])

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent" />

        <div className="container relative">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-white mb-6 leading-tight">
              Professional services,
              <br />
              <span className="text-white/50">simplified.</span>
            </h1>
            <p className="text-lg text-white/40 max-w-xl mx-auto">
              Connect with verified CAs, Lawyers, and Company Secretaries.
              Get things done without the hassle.
            </p>
          </div>

          {/* Search */}
          <div className="max-w-2xl mx-auto">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="What do you need help with?"
            />
          </div>

          {/* Quick Filters */}
          <div className="flex justify-center mt-6">
            <FilterChips
              filters={QUICK_FILTERS}
              selected={selectedFilters}
              onChange={setSelectedFilters}
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 border-y border-white/[0.06]">
        <div className="container">
          <div className="grid grid-cols-3 gap-8 max-w-3xl mx-auto">
            {[
              { icon: Users, label: 'Verified Experts', value: '500+' },
              { icon: Shield, label: 'Services Completed', value: '10,000+' },
              { icon: Clock, label: 'Avg Response Time', value: '< 2hrs' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <stat.icon className="h-5 w-5 text-white/30 mx-auto mb-3" />
                <p className="text-2xl font-semibold text-white mb-1">{stat.value}</p>
                <p className="text-xs text-white/40">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-semibold text-white mb-2">Popular Services</h2>
              <p className="text-white/40">Get started with our most requested services</p>
            </div>
            <Link href="/services">
              <Button variant="ghost" className="text-white/60 hover:text-white gap-2">
                View all
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-44 rounded-2xl" />
              ))}
            </div>
          ) : (
            <ServiceGrid services={services} isLoading={false} />
          )}

          {services.length > 0 && (
            <div className="text-center mt-12">
              <Link href="/services">
                <Button variant="outline" size="lg" className="gap-2">
                  Browse all services
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 border-t border-white/[0.06]">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-semibold text-white mb-4">
              Ready to get started?
            </h2>
            <p className="text-white/40 mb-8">
              Join thousands of businesses who trust Ollvy for their professional service needs.
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/services">
                <Button size="lg">Explore Services</Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" size="lg">Sign in</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
