'use client'

import { ServiceCard } from './ServiceCard'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent } from '@/components/ui/card'
import { Search } from 'lucide-react'
import type { ServicePackage } from '@/lib/types'

interface ServiceGridProps {
  services: ServicePackage[]
  isLoading?: boolean
}

export function ServiceGrid({ services, isLoading }: ServiceGridProps) {
  if (isLoading) {
    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="h-full">
            <div className="p-6 space-y-4">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
              <div className="pt-3">
                <Skeleton className="h-6 w-24" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    )
  }

  if (services.length === 0) {
    return (
      <Card className="py-16">
        <CardContent className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-6">
            <Search className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="font-medium text-foreground mb-2">No services found</h3>
          <p className="text-sm text-muted-foreground">
            Try adjusting your search or filters to find what you're looking for.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 auto-rows-fr">
      {services.map((service) => (
        <ServiceCard key={service.id} service={service} />
      ))}
    </div>
  )
}
