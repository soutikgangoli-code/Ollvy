import { ReactNode } from 'react'
import Link from 'next/link'
import { ArrowLeft, ChevronRight } from 'lucide-react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { type ToolPageConfig, generateToolFAQSchema, generateToolBreadcrumbSchema, generateSoftwareApplicationSchema, generateToolHowToSchema } from '@/lib/tools/types'
import { PenaltyCalculatorSelector } from '@/components/penalty-calculator/PenaltyCalculatorSelector'
import { StickyToolCTA } from '@/components/tools/StickyToolCTA'
import { penaltyCalculators } from '@/components/penalty-calculator/penalty-calculator-data'
import { ToolLastReviewed } from '@/components/tools/DocumentPageToolExtensions'

interface ToolPageWrapperProps {
  config: ToolPageConfig
  children: ReactNode // The calculator or checklist widget
  showCalculatorSelector?: boolean // Show the penalty calculator selector dropdown
}

/**
 * Renders a paragraph with support for double-newline separated paragraphs
 */
function IntroSection({ text }: { text: string }) {
  const paragraphs = text.split('\n\n').filter(Boolean)

  return (
    <div className="mb-10 p-6 rounded-xl border border-border bg-muted/30">
      <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
        {paragraphs.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
    </div>
  )
}

/**
 * Renders the howToUse section with markdown-like formatting
 */
function HowToUseSection({ text, title }: { text: string; title: string }) {
  const lines = text.split('\n').filter(Boolean)

  return (
    <section className="mt-16 max-w-3xl">
      <div className="flex items-baseline gap-3 mb-6">
        <span className="font-mono text-[10px] text-muted-foreground">02</span>
        <h2 className="text-sm font-semibold text-foreground uppercase tracking-wide">
          How to Use This {title.includes('Calculator') ? 'Calculator' : 'Checklist'}
        </h2>
      </div>
      <div className="rounded-xl border border-border bg-muted/30 p-4 md:p-6 space-y-4">
        {lines.map((line, index) => {
          // Handle bold headers with **text**
          if (line.startsWith('**') && line.includes(':**')) {
            const match = line.match(/^\*\*(.+?):\*\*\s*(.*)/)
            if (match) {
              return (
                <div key={index} className="pt-2 first:pt-0">
                  <p className="text-sm font-medium text-foreground mb-1">{match[1]}:</p>
                  {match[2] && <p className="text-sm text-muted-foreground">{match[2]}</p>}
                </div>
              )
            }
          }
          // Handle list items
          if (line.startsWith('- ')) {
            return (
              <div key={index} className="flex gap-2 pl-2">
                <span className="text-muted-foreground/50 shrink-0">-</span>
                <p className="text-sm text-muted-foreground">{line.slice(2)}</p>
              </div>
            )
          }
          // Regular paragraph
          return (
            <p key={index} className="text-sm text-muted-foreground">
              {line}
            </p>
          )
        })}
      </div>
    </section>
  )
}

/**
 * Renders the FAQ section
 */
function FAQSection({ faqs }: { faqs: ToolPageConfig['faqs'] }) {
  return (
    <section className="mt-16 max-w-3xl">
      <div className="flex items-baseline gap-3 mb-6">
        <span className="font-mono text-[10px] text-muted-foreground">03</span>
        <h2 className="text-sm font-semibold text-foreground uppercase tracking-wide">
          Frequently Asked Questions
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
 * Related links section
 */
function RelatedLinks({ config }: { config: ToolPageConfig }) {
  const hasRelatedCalculators = config.relatedCalculatorSlugs && config.relatedCalculatorSlugs.length > 0

  if (!hasRelatedCalculators && !config.relatedLearnSlug) {
    return null
  }

  return (
    <section className="mt-16 max-w-3xl">
      <div className="flex items-baseline gap-3 mb-6">
        <span className="font-mono text-[10px] text-muted-foreground">04</span>
        <h2 className="text-sm font-semibold text-foreground uppercase tracking-wide">
          Related Tools
        </h2>
      </div>
      <div className="flex flex-wrap gap-3">
        {config.relatedCalculatorSlugs?.map((slug) => (
          <Link
            key={slug}
            href={`/tools/penalty-calculator/${slug}`}
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <span>{slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}</span>
            <ChevronRight className="h-3 w-3" />
          </Link>
        ))}
        {config.relatedLearnSlug && (
          <Link
            href={`/learn/${config.relatedLearnSlug}`}
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <span>Learn more</span>
            <ChevronRight className="h-3 w-3" />
          </Link>
        )}
      </div>
    </section>
  )
}

/**
 * Main wrapper component for tool pages (calculators and checklists)
 * Handles intro, howToUse, FAQs, and JSON-LD schema
 */
export function ToolPageWrapper({ config, children, showCalculatorSelector }: ToolPageWrapperProps) {
  const faqSchema = generateToolFAQSchema(config)
  const breadcrumbSchema = generateToolBreadcrumbSchema(config.category, config.title, config.canonicalUrl)
  const softwareAppSchema = generateSoftwareApplicationSchema(config)
  const howToSchema = generateToolHowToSchema(config)

  // Get the current calculator info for the selector
  const currentCalculator = showCalculatorSelector
    ? penaltyCalculators.find(calc => config.canonicalUrl.includes(calc.href.replace('/tools/penalty-calculator/', '')))
    : null

  return (
    <div className="py-16 md:py-24">
      <div className="container max-w-5xl">
        {/* JSON-LD Schemas */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareAppSchema) }}
        />
        {howToSchema && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
          />
        )}

        {/* Header with H1 - Centered like Document pages */}
        <header className="mb-12 text-center">
          {/* Mobile: back arrow + page name */}
          <div className="md:hidden flex items-center justify-center mb-4">
            <Link href="/tools/penalty-calculator" className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="h-3.5 w-3.5" />
              <span className="text-foreground">{config.title}</span>
            </Link>
          </div>
          {/* Full breadcrumb: hidden on mobile, visible on desktop. Stays in DOM for SEO. */}
          <nav className="hidden md:flex items-center justify-center gap-2 text-xs text-muted-foreground mb-4" aria-label="Breadcrumb">
            <Link href="/tools" className="hover:text-foreground transition-colors">
              Tools
            </Link>
            <ChevronRight className="h-3 w-3" />
            <Link href="/tools/penalty-calculator" className="hover:text-foreground transition-colors">
              Penalty Calculators
            </Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground">{config.title}</span>
          </nav>

          <p className="font-mono text-sm uppercase tracking-[0.3em] text-muted-foreground mb-4">
            Penalty Calculator
          </p>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground mb-6 tracking-tight">
            {config.title}
          </h1>

          {/* Calculator selector dropdown - centered */}
          {showCalculatorSelector && currentCalculator && (
            <div className="flex justify-center mb-6">
              <PenaltyCalculatorSelector
                currentHref={currentCalculator.href}
                currentLabel={currentCalculator.label}
              />
            </div>
          )}

          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Calculate exact penalties, interest, and late fees based on Indian compliance law
          </p>
        </header>

        {/* The actual tool widget (calculator or checklist) */}
        <div id="tool-section" className="mb-8">
          {children}
        </div>

        {/* Intro section - rendered BELOW the widget */}
        <IntroSection text={config.intro} />

        {/* How to Use section - rendered BELOW the widget */}
        <HowToUseSection text={config.howToUse} title={config.title} />

        {/* FAQ Section */}
        <FAQSection faqs={config.faqs} />

        {/* Related Links */}
        <RelatedLinks config={config} />

        {/* CTA */}
        <section className="mt-16">
          <p className="font-medium text-foreground mb-2">Need help with {config.category.toLowerCase()} compliance?</p>
          <p className="text-sm text-foreground/70 mb-4">
            Our team handles the paperwork so you can focus on your business.
          </p>
          <Link
            href={`/services/${config.relatedServiceSlug}`}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[hsl(var(--ollvy-green))] text-white text-sm font-medium rounded-full hover:bg-[hsl(var(--ollvy-green))]/90 transition-colors"
          >
            {config.relatedServiceLabel}
            <ChevronRight className="h-4 w-4" />
          </Link>
        </section>

        {/* How we reviewed - at bottom like service pages */}
        <ToolLastReviewed lastReviewed={config.lastReviewed} sources={config.reviewSources} />

        {/* Sticky mobile CTA */}
        <StickyToolCTA
          buttonText="Book Now"
          buttonHref={`/services/${config.relatedServiceSlug}`}
          triggerId="tool-section"
        />

        {/* Print styles */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
              @media print {
                .print-hidden {
                  display: none !important;
                }
              }
            `,
          }}
        />
      </div>
    </div>
  )
}
