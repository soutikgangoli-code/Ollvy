'use client';
import { LearnPageConfig } from '@/lib/learn/pages';
import { ServiceConfig } from '@/lib/services';
import { LearnHero } from './LearnHero';
import { LearnSectionBlock } from './LearnSectionBlock';
import { LearnServiceCTA } from './LearnServiceCTA';
import { LearnInternalLinks } from './LearnInternalLinks';
import { EligibilityTool } from './tools/EligibilityTool';
import { PenaltyTool } from './tools/PenaltyTool';
import { ComparisonTool } from './tools/ComparisonTool';
import { DeadlineTracker } from './tools/DeadlineTracker';

export function LearnPage({ page, ctaService, secondaryService }: {
  page: LearnPageConfig;
  ctaService: ServiceConfig;
  secondaryService?: ServiceConfig;
}) {
  return (
    <div className="min-h-screen bg-background">
      <LearnHero page={page} />

      <div className="max-w-[760px] mx-auto px-6 py-12">

        {/* Tool - always at top, before first section */}
        {page.tool && (
          <div className="mb-12">
            {page.tool.type === 'eligibility' && (
              <EligibilityTool config={page.tool} ctaService={ctaService} />
            )}
            {page.tool.type === 'penalty' && (
              <PenaltyTool config={page.tool} ctaService={ctaService} />
            )}
            {page.tool.type === 'comparison' && (
              <ComparisonTool config={page.tool} />
            )}
            {page.tool.type === 'deadline' && (
              <DeadlineTracker config={page.tool} ctaService={ctaService} />
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
            <div className="space-y-4">
              {page.faqs.map((faq, i) => (
                <div key={i} className="border border-border rounded-lg p-4">
                  <p className="text-sm font-semibold text-foreground mb-2">{faq.q}</p>
                  <p className="text-sm text-muted-foreground">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Service CTA */}
        <LearnServiceCTA
          primary={ctaService}
          secondary={secondaryService}
        />

        {/* Related guides */}
        <LearnInternalLinks
          learnSlugs={page.relatedLearnSlugs}
          serviceSlugs={page.relatedServiceSlugs}
        />
      </div>
    </div>
  );
}
