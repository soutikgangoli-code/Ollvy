import { redirect } from 'next/navigation'
import { createServerSupabase } from '@/lib/supabase-server'
import { EligibilityPageClient } from './EligibilityPageClient'

interface PageProps {
  params: Promise<{ serviceId: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function EligibilityPage({ params, searchParams }: PageProps) {
  const { serviceId } = await params
  const searchParamsResolved = await searchParams

  const supabase = await createServerSupabase()

  // Check if serviceId is a UUID or slug
  const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(serviceId)

  // Fetch service - try by ID first if UUID, otherwise by slug
  let service: { id: string; slug: string; name: string; price_base_paisa: number; price_govt_fees_paisa: number | null; price_gst_rate: number | null } | null = null

  if (isUUID) {
    const { data } = await supabase
      .from('service_packages')
      .select('id, slug, name, price_base_paisa, price_govt_fees_paisa, price_gst_rate')
      .eq('id', serviceId)
      .eq('is_active', true)
      .single()
    service = data
  }

  if (!service) {
    const { data } = await supabase
      .from('service_packages')
      .select('id, slug, name, price_base_paisa, price_govt_fees_paisa, price_gst_rate')
      .eq('slug', serviceId)
      .eq('is_active', true)
      .single()
    service = data
  }

  // If service not found, let client handle error
  if (!service) {
    return <EligibilityPageClient serviceId={serviceId} />
  }

  // Check for pre-payment questions using the actual service ID
  const { count } = await supabase
    .from('service_questionnaires')
    .select('id', { count: 'exact', head: true })
    .eq('service_package_id', service.id)
    .eq('is_active', true)
    .eq('is_pre_payment', true)

  const hasPrePaymentQuestions = (count ?? 0) > 0

  // If no pre-payment questions, redirect directly to checkout (server-side)
  if (!hasPrePaymentQuestions) {
    const params = new URLSearchParams()
    if (searchParamsResolved.variant) {
      params.set('variant', String(searchParamsResolved.variant))
    }
    if (searchParamsResolved.addons) {
      params.set('addons', String(searchParamsResolved.addons))
    }
    const checkoutUrl = `/checkout/${service.slug}${params.toString() ? '?' + params.toString() : ''}`
    redirect(checkoutUrl)
  }

  // Has pre-payment questions - render the client component
  return (
    <EligibilityPageClient
      serviceId={serviceId}
      initialService={{
        id: service.id,
        slug: service.slug,
        name: service.name,
        price_base_paisa: service.price_base_paisa,
        price_govt_fees_paisa: service.price_govt_fees_paisa,
        price_gst_rate: service.price_gst_rate,
      }}
    />
  )
}
