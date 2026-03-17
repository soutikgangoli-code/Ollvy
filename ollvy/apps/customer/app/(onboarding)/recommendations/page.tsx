'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { cn, formatPaisa } from '@/lib/utils'
import { getClient } from '@/lib/supabase'
import { useAuthStore } from '@/lib/stores/auth-store'
import type { ServicePackage } from '@/lib/types'
import { ArrowRight, Check, Clock, FileText, Scale, Building2, Shield, Calculator, Users, Landmark, Sparkles } from 'lucide-react'

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  FileText,
  Scale,
  Building2,
  Shield,
  Calculator,
  Users,
  Landmark,
}

const SITUATION_REASONS: Record<string, string> = {
  just_starting_out: 'Essential for new businesses',
  need_to_hire: 'Required for hiring employees',
  taking_payments: 'Mandatory for accepting payments',
  selling_food_beverages: 'Food business licensing requirement',
  importing_exporting: 'International trade compliance',
  have_investors: 'Investor compliance requirement',
  protect_my_brand: 'Brand protection essential',
  filing_taxes: 'Tax compliance deadline approaching',
  regulated_industry: 'Industry-specific requirement',
}

export default function RecommendationsPage() {
  const router = useRouter()
  const { user, refreshSession } = useAuthStore()
  const [services, setServices] = useState<ServicePackage[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)

  useEffect(() => {
    fetchRecommendations()
  }, [])

  const fetchRecommendations = async () => {
    setIsLoading(true)

    try {
      // Get onboarding data from session storage
      const situationsStr = sessionStorage.getItem('onboarding_situations')
      const businessType = sessionStorage.getItem('onboarding_business_type')
      const state = sessionStorage.getItem('onboarding_state')

      const situations: string[] = situationsStr ? JSON.parse(situationsStr) : []

      const supabase = getClient()

      // Query services that match the situations
      let query = supabase
        .from('service_packages')
        .select('*')
        .eq('is_active', true)
        .order('urgency_score', { ascending: false })
        .limit(5)

      // If we have situations, filter by them
      if (situations.length > 0) {
        query = query.overlaps('situation_tags', situations)
      }

      const { data, error } = await query

      if (error) {
        console.error('Error fetching recommendations:', error)
      }

      setServices(data || [])
    } catch (err) {
      console.error('Failed to fetch recommendations:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleComplete = async () => {
    setIsUpdating(true)

    try {
      const supabase = getClient()
      const businessType = sessionStorage.getItem('onboarding_business_type')
      const state = sessionStorage.getItem('onboarding_state')

      // Update user profile with onboarding data
      if (user?.id) {
        await supabase
          .from('users')
          .update({
            business_type: businessType,
            state: state,
          })
          .eq('id', user.id)

        // Refresh session to get updated user data
        await refreshSession()
      }

      // Clear session storage
      sessionStorage.removeItem('onboarding_situations')
      sessionStorage.removeItem('onboarding_business_type')
      sessionStorage.removeItem('onboarding_state')

      // Navigate to main app
      router.push('/services')
    } catch (err) {
      console.error('Failed to complete onboarding:', err)
    } finally {
      setIsUpdating(false)
    }
  }

  const getReasonForService = (service: ServicePackage): string => {
    const situationsStr = sessionStorage.getItem('onboarding_situations')
    const situations: string[] = situationsStr ? JSON.parse(situationsStr) : []

    // Find matching situation
    for (const tag of service.situation_tags || []) {
      if (situations.includes(tag) && SITUATION_REASONS[tag]) {
        return SITUATION_REASONS[tag]
      }
    }

    // Default reasons based on urgency
    if (service.urgency_score >= 90) return 'High priority compliance item'
    if (service.urgency_score >= 70) return 'Recommended for your business'
    return 'May be relevant for you'
  }

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="text-center space-y-3">
          <p className="text-white/40 text-sm uppercase tracking-wider">Step 4 of 4</p>
          <h1 className="text-2xl font-semibold text-white">Your Recommendations</h1>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="text-center space-y-3">
        <p className="text-white/40 text-sm uppercase tracking-wider">Step 4 of 4</p>
        <h1 className="text-2xl font-semibold text-white">Your Recommendations</h1>
        <p className="text-white/50">
          Based on your situation, here's what we recommend.
        </p>
      </div>

      {services.length > 0 ? (
        <div className="space-y-4">
          {services.map((service, index) => {
            const IconComponent = service.icon_name && iconMap[service.icon_name]
              ? iconMap[service.icon_name]
              : FileText

            return (
              <Link key={service.id} href={`/services/${service.slug}`}>
                <Card className="border-white/10 bg-white/[0.02] hover:border-white/20 transition-all duration-200 cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-white/5 flex-shrink-0">
                        {index === 0 ? (
                          <Sparkles className="h-6 w-6 text-white/60" />
                        ) : (
                          <IconComponent className="h-6 w-6 text-white/40" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h3 className="font-medium text-white">{service.name}</h3>
                            <p className="text-sm text-white/50 mt-0.5 line-clamp-2">
                              {service.short_description}
                            </p>
                          </div>
                          <span className="text-white font-semibold whitespace-nowrap">
                            {service.price_varies_by_state ? 'Get Quote' : formatPaisa(service.price_base_paisa)}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 mt-3">
                          <Badge variant="outline" className="text-xs">
                            <Clock className="h-3 w-3 mr-1" />
                            {service.sla_working_days} days
                          </Badge>
                          <span className="text-xs text-white/40">
                            {getReasonForService(service)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      ) : (
        <Card className="border-white/10 bg-white/[0.02]">
          <CardContent className="p-8 text-center">
            <FileText className="h-12 w-12 text-white/20 mx-auto mb-4" />
            <h3 className="font-medium text-white mb-2">No specific recommendations</h3>
            <p className="text-sm text-white/50">
              Browse our full catalogue to find services that fit your needs.
            </p>
          </CardContent>
        </Card>
      )}

      <div className="space-y-3 pt-4">
        <Button
          className="w-full"
          size="lg"
          onClick={handleComplete}
          disabled={isUpdating}
        >
          {isUpdating ? (
            <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              Browse All Services
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
