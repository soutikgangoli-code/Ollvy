import { notFound, redirect } from 'next/navigation'
import { unstable_cache } from 'next/cache'
import { supabaseServer } from '@/lib/supabase-server'
import type { ServicePackage } from '@/lib/types'
import CheckoutClient from './CheckoutClient'

interface PageProps {
  params: Promise<{ serviceId: string }>
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

async function fetchService(serviceId: string): Promise<ServicePackage | null> {
  if (!supabaseServer) return null

  const isUUID = UUID_RE.test(serviceId)

  if (isUUID) {
    const { data } = await supabaseServer
      .from('service_packages')
      .select('*')
      .eq('id', serviceId)
      .single()
    if (data) return data as ServicePackage
  }

  const { data } = await supabaseServer
    .from('service_packages')
    .select('*')
    .eq('slug', serviceId)
    .single()

  return (data as ServicePackage) || null
}

export default async function CheckoutPage({ params }: PageProps) {
  const { serviceId } = await params

  // Tag-based cache — admin mutations on `service_packages` must call
  // revalidateTag('service-packages') so price edits propagate instantly.
  const getCached = unstable_cache(
    () => fetchService(serviceId),
    [`checkout-service-${serviceId}`],
    { tags: ['service-packages'] }
  )
  const service = await getCached()

  if (!service) notFound()

  // State-variable pricing needs a quote, not a fixed checkout.
  if (service.price_varies_by_state) {
    redirect(`/quote/request/${service.id}`)
  }

  return <CheckoutClient initialService={service} serviceId={serviceId} />
}
