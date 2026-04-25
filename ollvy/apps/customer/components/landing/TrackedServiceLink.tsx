'use client'

import Link from 'next/link'
import { ReactNode } from 'react'
import { usePostHogEvents } from '@/lib/hooks/usePostHogEvents'

interface TrackedServiceLinkProps {
  slug: string
  serviceName: string
  pricePaisa: number
  isRetainer: boolean
  source: string
  className?: string
  children: ReactNode
}

/**
 * Client-only wrapper for the homepage carousel service Link.
 * Lets ServicesSimplified stay a server component while still firing
 * the `service_card_clicked` PostHog event on click.
 */
export function TrackedServiceLink({
  slug,
  serviceName,
  pricePaisa,
  isRetainer,
  source,
  className,
  children,
}: TrackedServiceLinkProps) {
  const { trackEvent } = usePostHogEvents()
  return (
    <Link
      href={`/services/${slug}`}
      prefetch={true}
      className={className}
      onClick={() =>
        trackEvent('service_card_clicked', {
          service_slug: slug,
          source,
          service_name: serviceName,
          price_paisa: pricePaisa,
          is_popular: true,
          is_retainer: isRetainer,
        })
      }
    >
      {children}
    </Link>
  )
}
