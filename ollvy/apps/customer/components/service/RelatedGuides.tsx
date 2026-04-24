'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { getGuideSlugsForService } from '@/lib/data/guide-cross-links'
import { LEARN_PAGES } from '@/lib/guides/pages'

interface RelatedGuidesProps {
  serviceSlug: string
  serviceShortName: string
}

export function RelatedGuides({ serviceSlug, serviceShortName }: RelatedGuidesProps) {
  const guideSlugs = getGuideSlugsForService(serviceSlug)
  if (guideSlugs.length === 0) return null

  // Resolve slugs to full guide configs; drop any missing
  const guides = guideSlugs
    .map((slug) => LEARN_PAGES.find((p) => p.slug === slug))
    .filter((g): g is NonNullable<typeof g> => Boolean(g))

  if (guides.length === 0) return null

  return (
    <section className="py-16 border-b border-border">
      <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3 font-mono">
        RELATED GUIDES
      </p>
      <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-2">
        Deep-dive guides on {serviceShortName}
      </h2>
      <p className="text-sm text-muted-foreground mb-8 max-w-[560px]">
        Written by the same Ollvy CA team. Linked sources, updated when regulations change.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {guides.map((guide) => (
          <Card
            key={guide.slug}
            className="border border-border bg-card p-5 transition-colors hover:border-foreground/20"
          >
            <Link href={`/guides/${guide.slug}`} className="block group">
              <div className="flex items-start justify-between gap-4 mb-2">
                <h3 className="font-semibold text-foreground leading-snug">
                  {guide.title}
                </h3>
                <ArrowRight
                  size={16}
                  className="shrink-0 mt-1 text-muted-foreground transition-transform group-hover:translate-x-0.5"
                />
              </div>
              {guide.lastReviewed && (
                <p className="text-xs text-muted-foreground font-mono">
                  Updated {guide.lastReviewed}
                </p>
              )}
            </Link>
          </Card>
        ))}
      </div>
    </section>
  )
}
