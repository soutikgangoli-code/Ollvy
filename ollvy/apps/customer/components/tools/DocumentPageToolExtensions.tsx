'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronRight, ArrowRight, FileText, History } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { ToolPageConfig } from '@/lib/tools/types'
import { StickyToolCTA } from '@/components/tools/StickyToolCTA'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

/**
 * Renders the intro section from ToolPageConfig for document checklist pages
 * Placed immediately before the document checklist widget
 */
export function ToolIntroSection({ text }: { text: string }) {
  const paragraphs = text.split('\n\n').filter(Boolean)

  return (
    <section className="mb-8 p-4 md:p-6 rounded-xl border border-border bg-muted/30">
      <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
        {paragraphs.map((paragraph, index) => (
          <p key={index}>
            {paragraph}
          </p>
        ))}
      </div>
    </section>
  )
}

/**
 * CTA link displayed after the intro section
 */
export function ToolIntroCTA({ config }: { config: ToolPageConfig }) {
  return (
    <div className="mb-12 flex items-center gap-2">
      <Link
        href={`/services/${config.relatedServiceSlug}`}
        className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
      >
        {config.relatedServiceLabel}
        <ChevronRight className="h-4 w-4" />
      </Link>
    </div>
  )
}

/**
 * FAQ section from ToolPageConfig, placed at the very bottom of document pages
 */
export function ToolFAQSection({ faqs, sectionNumber }: { faqs: ToolPageConfig['faqs']; sectionNumber?: string }) {
  return (
    <section className="mt-16 max-w-3xl">
      <div className="flex items-baseline gap-3 mb-6">
        <span className="font-mono text-[10px] text-muted-foreground">{sectionNumber || '07'}</span>
        <h2 className="text-sm font-semibold text-foreground uppercase tracking-wide">
          More Questions
        </h2>
      </div>
      <Accordion type="single" collapsible className="space-y-0">
        {faqs.map((faq, index) => (
          <AccordionItem
            key={index}
            value={`faq-${index}`}
            className="border-b border-border last:border-0"
          >
            <AccordionTrigger className="text-sm font-medium text-foreground text-left py-4 hover:no-underline">
              {faq.q}
            </AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-4">
              {faq.a}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  )
}

/**
 * Standalone CTA section - used when CTA is separated from DocumentChecklistContent
 */
export function DocumentCTA({
  title,
  description,
  buttonText,
  buttonHref,
  penaltyCalcHref,
  penaltyCalcText,
}: {
  title: string
  description: string
  buttonText: string
  buttonHref: string
  penaltyCalcHref?: string
  penaltyCalcText?: string
}) {
  return (
    <>
      <section className="mt-16 py-10 text-center">
        <h3 className="text-xl font-semibold text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground mt-3 max-w-lg mx-auto leading-relaxed">
          {description}
        </p>
        <Button className="mt-6 h-12 px-8" size="lg" asChild>
          <Link href={buttonHref}>
            {buttonText}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
        {penaltyCalcHref && (
          <p className="mt-4">
            <Link
              href={penaltyCalcHref}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1"
            >
              {penaltyCalcText || 'Calculate late filing penalty'}
              <ChevronRight size={12} />
            </Link>
          </p>
        )}
      </section>
      <StickyToolCTA
        buttonText={buttonText.replace(/^Start\s+/, 'Book ')}
        buttonHref={buttonHref}
        triggerId="doc-checklist-section"
        showScrollTop
        scrollTopTargetId="doc-checklist-section"
      />
    </>
  )
}

/**
 * How we reviewed section - matches service page HowWeReviewed component exactly
 * Has tabs for Sources and History
 */
export function ToolLastReviewed({
  lastReviewed,
  sources = []
}: {
  lastReviewed: string
  sources?: Array<{ name: string; url: string; description: string }>
}) {
  const [activeTab, setActiveTab] = useState<'sources' | 'history'>('sources')

  return (
    <section className="mt-16 pt-10 border-t border-border">
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

      {activeTab === 'sources' && (
        <div>
          {sources.length > 0 ? (
            <ul className="space-y-3">
              {sources.map((source) => (
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
                      <span className="opacity-50">↗</span>
                    </a>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {source.description}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-muted-foreground">
              Sources will be added soon.
            </p>
          )}
        </div>
      )}

      {activeTab === 'history' && (
        <div>
          <p className="text-xs text-muted-foreground">
            Last reviewed:{' '}
            <span className="text-foreground font-medium">
              {lastReviewed}
            </span>
          </p>
          <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
            Penalty amounts and deadlines are manually verified against source
            portals when any regulatory update is announced.
          </p>
        </div>
      )}
    </section>
  )
}
