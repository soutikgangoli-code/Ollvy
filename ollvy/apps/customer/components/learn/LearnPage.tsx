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
