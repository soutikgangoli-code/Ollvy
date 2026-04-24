'use client'

import { useState } from 'react'
import { DBServiceConfig } from '@/lib/data/services'
import { FileText, History, ExternalLink } from 'lucide-react'
import { cn } from '@/lib/utils'
import { LAST_REVIEWED, getReviewerForSlug } from '@/constants/accuracy'

export function HowWeReviewed({ service }: { service: DBServiceConfig }) {
  const [activeTab, setActiveTab] = useState<'sources' | 'history'>('sources')

  return (
    <div className="mt-16 pt-10 border-t border-border">
      <h3 className="text-sm font-semibold text-foreground mb-1">
        How we reviewed this page
      </h3>
      <p className="text-xs text-muted-foreground mb-5 leading-relaxed max-w-[560px]">
        The penalty amounts, deadlines, and regulatory requirements on this page
        are sourced directly from official government portals. We do not use
        secondary sources. When regulations change, we update the page.
      </p>

      {/* Tabs */}
      <div className="flex gap-0 border-b border-border mb-5">
        {(['sources', 'history'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              'flex items-center gap-1.5 px-4 py-2 text-xs font-medium border-b-2 -mb-px transition-colors capitalize',
              activeTab === tab
                ? 'border-foreground text-foreground'
                : 'border-transparent text-muted-foreground'
            )}
          >
            {tab === 'sources' ? <FileText size={11} /> : <History size={11} />}
            {tab}
          </button>
        ))}
      </div>

      <ul className={cn('space-y-3', activeTab !== 'sources' && 'hidden')}>
        {service.reviewSources.map((source) => (
          <li key={source.name} className="flex items-start gap-3">
            <div className="w-1 h-1 rounded-full bg-muted-foreground mt-2 shrink-0" />
            <div>
              <a
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-medium text-foreground hover:underline inline-flex items-center gap-1"
              >
                {source.name}
                <ExternalLink size={9} className="opacity-50" />
              </a>
              <p className="text-xs text-muted-foreground mt-0.5">
                {source.description}
              </p>
            </div>
          </li>
        ))}
      </ul>

      <div className={cn(activeTab !== 'history' && 'hidden')}>
        <p className="text-xs text-muted-foreground">
          Last reviewed:{' '}
          <span className="text-foreground font-medium">
            {LAST_REVIEWED[service.slug] ?? 'April 2026'}
          </span>
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Reviewed by{' '}
          <span className="text-foreground font-medium">
            {getReviewerForSlug(service.slug)}
          </span>
          , Ollvy CA team
        </p>
        <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
          Penalty amounts and deadlines are manually verified against source
          portals when any regulatory update is announced.
        </p>
      </div>
    </div>
  )
}
