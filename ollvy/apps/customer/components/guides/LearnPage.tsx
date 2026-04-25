import dynamic from 'next/dynamic';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  LearnPageConfig,
  getPenaltyCalculatorBySlug,
  getDocumentChecklistBySlug,
  getDeadlineBySlug,
} from '@/lib/guides/pages';
import { ServiceConfig } from '@/lib/services';
import { LearnHero } from './LearnHero';
import { LearnSectionBlock } from './LearnSectionBlock';
import { LearnServiceCTA } from './LearnServiceCTA';
import { LearnInternalLinks } from './LearnInternalLinks';
import { ToolLastReviewed } from '@/components/tools/DocumentPageToolExtensions';

// Each guide page renders only one of these — load the matching one on demand.
// Each skeleton reserves the initial-state height of its tool so chunk arrival
// doesn't push the first content section below.
const EligibilityTool = dynamic(
  () => import('./tools/EligibilityTool').then(m => ({ default: m.EligibilityTool })),
  { loading: () => <div className="min-h-[200px] rounded-xl bg-muted/10" aria-hidden="true" /> }
);
const ComparisonTool = dynamic(
  () => import('./tools/ComparisonTool').then(m => ({ default: m.ComparisonTool })),
  { loading: () => <div className="min-h-[200px] rounded-xl bg-muted/10" aria-hidden="true" /> }
);

export function LearnPage({ page, ctaService, secondaryService }: {
  page: LearnPageConfig;
  ctaService: ServiceConfig;
  secondaryService?: ServiceConfig;
}) {
  return (
    <div className="py-16 md:py-24">
      <div className="container max-w-5xl">
        <LearnHero page={page} />

        <div className="max-w-3xl mx-auto">

        {/* Tool - always at top, before first section */}
        {page.tool && (
          <div className="mb-12">
            {page.tool.type === 'eligibility' && (
              <EligibilityTool config={page.tool} ctaService={ctaService} />
            )}
            {page.tool.type === 'comparison' && (
              <ComparisonTool config={page.tool} />
            )}
          </div>
        )}

        {/* Sections */}
        {page.sections.map((section, i) => (
          <div key={i} className="mb-12">
            <LearnSectionBlock section={section} />
          </div>
        ))}

        {/* FAQs */}
        {page.faqs && page.faqs.length > 0 && (
          <div className="mb-12">
            <div className="flex items-baseline gap-3 mb-4">
              <span className="font-mono text-[10px] text-muted-foreground">FAQ</span>
              <h2 className="text-sm font-semibold text-foreground uppercase tracking-wide">
                Frequently Asked Questions
              </h2>
            </div>
            <Accordion type="single" collapsible className="space-y-0">
              {page.faqs.map((faq, i) => (
                <AccordionItem
                  key={i}
                  value={`faq-${i}`}
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
          </div>
        )}

        {/* Last Reviewed / Sources */}
        <ToolLastReviewed
          lastReviewed={page.lastReviewed}
          sources={page.sources ?? []}
        />

        {/* Service CTA */}
        <LearnServiceCTA
          primary={ctaService}
          secondary={secondaryService}
        />

        {/* Related Tools Section */}
        <RelatedToolsSection relatedTools={page.relatedTools} />

        {/* Related guides */}
        <LearnInternalLinks
          learnSlugs={page.relatedLearnSlugs}
          serviceSlugs={page.relatedServiceSlugs}
        />
      </div>
      </div>
    </div>
  );
}

function RelatedToolsSection({ relatedTools }: { relatedTools?: LearnPageConfig['relatedTools'] }) {
  if (!relatedTools) return null;

  const penaltyCalcs = (relatedTools.penaltyCalculators || [])
    .map(slug => getPenaltyCalculatorBySlug(slug))
    .filter(Boolean);

  const docChecklists = (relatedTools.documentChecklists || [])
    .map(slug => getDocumentChecklistBySlug(slug))
    .filter(Boolean);

  const deadlines = (relatedTools.deadlines || [])
    .map(slug => getDeadlineBySlug(slug))
    .filter(Boolean);

  if (penaltyCalcs.length === 0 && docChecklists.length === 0 && deadlines.length === 0) {
    return null;
  }

  return (
    <div className="mt-12 pt-10 border-t border-border">
      <p className="text-xs uppercase tracking-widest text-muted-foreground mb-4">
        Helpful tools
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {deadlines.map((tool) => (
          <Link
            key={tool!.slug}
            href={`/${tool!.slug}`}
            className="flex items-center justify-between p-4 rounded-lg border border-border hover:border-foreground/30 hover:bg-muted/20 transition-colors group"
          >
            <div>
              <p className="text-sm font-medium text-foreground group-hover:text-foreground/90">
                {tool!.title}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {tool!.subtitle}
              </p>
            </div>
            <ChevronRight size={16} className="text-muted-foreground group-hover:text-foreground shrink-0" />
          </Link>
        ))}
        {penaltyCalcs.map((tool) => (
          <Link
            key={tool!.slug}
            href={`/tools/penalty-calculator/${tool!.slug}`}
            className="flex items-center justify-between p-4 rounded-lg border border-border hover:border-foreground/30 hover:bg-muted/20 transition-colors group"
          >
            <div>
              <p className="text-sm font-medium text-foreground group-hover:text-foreground/90">
                {tool!.title}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {tool!.subtitle}
              </p>
            </div>
            <ChevronRight size={16} className="text-muted-foreground group-hover:text-foreground shrink-0" />
          </Link>
        ))}
        {docChecklists.map((tool) => (
          <Link
            key={tool!.slug}
            href={`/tools/documents/${tool!.slug}`}
            className="flex items-center justify-between p-4 rounded-lg border border-border hover:border-foreground/30 hover:bg-muted/20 transition-colors group"
          >
            <div>
              <p className="text-sm font-medium text-foreground group-hover:text-foreground/90">
                {tool!.title}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {tool!.subtitle}
              </p>
            </div>
            <ChevronRight size={16} className="text-muted-foreground group-hover:text-foreground shrink-0" />
          </Link>
        ))}
      </div>
    </div>
  );
}
