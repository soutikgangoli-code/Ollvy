'use client'

import React from 'react'
import { ServiceCard } from './ServiceCard'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent } from '@/components/ui/card'
import { Search } from 'lucide-react'
import type { ServicePackage } from '@/lib/types'

function HighlightSnippet({ text, query }: { text: string; query: string }) {
  if (!query.trim()) return <>{text}</>
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
  const parts = text.split(regex)
  return (
    <>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <mark key={i} className="bg-[hsl(var(--ollvy-green))]/20 text-foreground rounded-sm px-0.5">{part}</mark>
        ) : (
          <React.Fragment key={i}>{part}</React.Fragment>
        )
      )}
    </>
  )
}

interface ServiceGridProps {
  services: ServicePackage[]
  isLoading?: boolean
  snippets?: Record<string, { source: string; snippet: string }>
  query?: string
}

export function ServiceGrid({ services, isLoading, snippets, query }: ServiceGridProps) {
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
      {services.map((service) => {
        const match = snippets?.[service.slug]
        return (
          <div key={service.id} className="flex flex-col">
            <ServiceCard service={service} />
            {match && query && (
              <div className="mx-1 -mt-1 px-4 py-2.5 rounded-b-xl border border-t-0 border-border bg-muted/30">
                <p className="text-[10px] text-muted-foreground font-mono mb-1">
                  Found in: {match.source}
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  <HighlightSnippet text={match.snippet} query={query} />
                </p>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
