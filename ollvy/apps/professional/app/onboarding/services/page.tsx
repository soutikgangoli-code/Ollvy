'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { callFunction } from '@/lib/api'
import { INDIAN_CITIES } from '@/lib/types'

interface ServicePackage {
  id: string
  name: string
  short_description: string
}

export default function OnboardingServicesPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [services, setServices] = useState<ServicePackage[]>([])
  const [selectedServices, setSelectedServices] = useState<string[]>([])
  const [selectedCities, setSelectedCities] = useState<string[]>([])
  const [maxConcurrentOrders, setMaxConcurrentOrders] = useState(5)
  const [citySearch, setCitySearch] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()

      if (!session) return

      // Fetch services
      const { data: servicesData } = await supabase
        .from('service_packages')
        .select('id, name, short_description')
        .eq('is_active', true)
        .order('display_order')

      if (servicesData) {
        setServices(servicesData)
      }

      // Fetch professional data
      const { data: professional } = await supabase
        .from('professionals')
        .select('service_areas, cities, max_concurrent_orders')
        .eq('auth_user_id', session.user.id)
        .single()

      if (professional) {
        setSelectedServices(professional.service_areas || [])
        setSelectedCities(professional.cities || [])
        setMaxConcurrentOrders(professional.max_concurrent_orders || 5)
      }

      setIsFetching(false)
    }

    fetchData()
  }, [])

  const toggleService = (serviceId: string) => {
    setSelectedServices((prev) =>
      prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId]
    )
  }

  const toggleCity = (city: string) => {
    setSelectedCities((prev) =>
      prev.includes(city)
        ? prev.filter((c) => c !== city)
        : [...prev, city]
    )
    setCitySearch('')
  }

  const filteredCities = INDIAN_CITIES.filter(
    (city) =>
      city.toLowerCase().includes(citySearch.toLowerCase()) &&
      !selectedCities.includes(city)
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (selectedServices.length === 0) {
      setError('Please select at least one service area')
      return
    }

    if (selectedCities.length === 0) {
      setError('Please select at least one city')
      return
    }

    setIsLoading(true)

    const { data, error: apiError } = await callFunction('update-professional-profile', {
      step: 2,
      data: {
        service_areas: selectedServices,
        cities: selectedCities,
        max_concurrent_orders: maxConcurrentOrders,
      },
    })

    setIsLoading(false)

    if (apiError) {
      setError(apiError)
      return
    }

    router.push('/onboarding/certifications')
  }

  if (isFetching) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="grid grid-cols-2 gap-3 mt-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-20 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      {/* Progress */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-navy text-white flex items-center justify-center text-sm font-medium">
            2
          </div>
          <span className="ml-2 text-sm font-medium text-body-text">Service Areas</span>
        </div>
        <div className="flex-1 mx-4 h-1 bg-gray-200 rounded">
          <div className="w-2/4 h-full bg-navy rounded"></div>
        </div>
        <span className="text-sm text-muted-text">Step 2 of 4</span>
      </div>

      <h2 className="text-xl font-semibold text-body-text mb-2">
        What services do you offer?
      </h2>
      <p className="text-muted-text mb-6">
        Select all service areas you can handle
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Services Grid */}
        <div>
          <label className="block text-sm font-medium text-body-text mb-3">
            Services <span className="text-red">*</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-64 overflow-y-auto p-1">
            {services.map((service) => (
              <button
                key={service.id}
                type="button"
                onClick={() => toggleService(service.id)}
                className={`p-3 rounded-lg border text-left transition-colors ${
                  selectedServices.includes(service.id)
                    ? 'border-navy bg-navy/5'
                    : 'border-border hover:border-navy/50'
                }`}
              >
                <div className="flex items-start">
                  <div className={`w-5 h-5 rounded border flex-shrink-0 mr-2 flex items-center justify-center ${
                    selectedServices.includes(service.id)
                      ? 'bg-navy border-navy'
                      : 'border-gray-300'
                  }`}>
                    {selectedServices.includes(service.id) && (
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-body-text">{service.name}</p>
                    {service.short_description && (
                      <p className="text-xs text-muted-text mt-0.5 line-clamp-1">
                        {service.short_description}
                      </p>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
          <p className="text-xs text-muted-text mt-2">
            {selectedServices.length} service{selectedServices.length !== 1 ? 's' : ''} selected
          </p>
        </div>

        {/* Cities */}
        <div>
          <label className="block text-sm font-medium text-body-text mb-3">
            Cities Served <span className="text-red">*</span>
          </label>

          {/* Selected cities */}
          {selectedCities.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {selectedCities.map((city) => (
                <span
                  key={city}
                  className="inline-flex items-center px-3 py-1 rounded-full bg-navy/10 text-navy text-sm"
                >
                  {city}
                  <button
                    type="button"
                    onClick={() => toggleCity(city)}
                    className="ml-2 hover:text-red"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* City search */}
          <div className="relative">
            <input
              type="text"
              value={citySearch}
              onChange={(e) => setCitySearch(e.target.value)}
              placeholder="Search and add cities..."
              className="w-full rounded-lg border border-border px-4 py-3 text-body-text"
            />
            {citySearch && filteredCities.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-border rounded-lg shadow-lg max-h-48 overflow-y-auto">
                {filteredCities.slice(0, 10).map((city) => (
                  <button
                    key={city}
                    type="button"
                    onClick={() => toggleCity(city)}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 text-body-text"
                  >
                    {city}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Max Concurrent Orders */}
        <div>
          <label className="block text-sm font-medium text-body-text mb-3">
            Maximum Concurrent Orders
          </label>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min="1"
              max="20"
              value={maxConcurrentOrders}
              onChange={(e) => setMaxConcurrentOrders(parseInt(e.target.value))}
              className="flex-1"
            />
            <span className="text-lg font-medium text-navy w-8 text-center">
              {maxConcurrentOrders}
            </span>
          </div>
          <p className="text-xs text-muted-text mt-1">
            How many orders can you handle simultaneously?
          </p>
        </div>

        {error && (
          <p className="text-red text-sm">{error}</p>
        )}

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => router.push('/onboarding/basics')}
            className="flex-1 py-3 rounded-lg font-medium border border-border text-body-text hover:bg-gray-50 transition-colors"
          >
            Back
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className={`flex-1 py-3 rounded-lg font-medium transition-colors ${
              isLoading
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-navy text-white hover:bg-navy-light'
            }`}
          >
            {isLoading ? 'Saving...' : 'Continue'}
          </button>
        </div>
      </form>
    </div>
  )
}
