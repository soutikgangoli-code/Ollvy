import { Suspense } from 'react'
import { shopsEstablishmentPenaltyContent } from '@/lib/tools/penalty-content'
import { generateFAQSchema, generateHowToSchema, generateBreadcrumbSchema } from '@/lib/tools/penalty-schemas'
import { ShopsEstablishmentCalculator, CalculatorSkeleton } from '@/components/penalty-calculator/ShopsEstablishmentCalculator'
import {
  PenaltyIntro,
  HowToCalculateSection,
  PenaltyBreakdownTable,
  FinancialImpactSection,
  DeadlinesTable,
  LegalReferencesSection,
  HowToAvoidSection,
  FAQSection,
  RelatedPenalties,
} from '@/components/penalty-calculator/seo'

const content = shopsEstablishmentPenaltyContent
const faqSchema = generateFAQSchema(content)
const howToSchema = generateHowToSchema(content)
const breadcrumbSchema = generateBreadcrumbSchema(content.slug, content.intro.title)

export default function ShopsEstablishmentPenaltyPage() {
  return (
    <>
      {/* JSON-LD Schemas - Server Rendered */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Calculator - Client Component */}
      <Suspense fallback={<CalculatorSkeleton />}>
        <ShopsEstablishmentCalculator />
      </Suspense>

      {/* SEO Content - Server Rendered */}
      <div className="mt-16 max-w-3xl space-y-12">
        <PenaltyIntro data={content.intro} />
        <HowToCalculateSection data={content.howToCalculate} />
        <PenaltyBreakdownTable data={content.penaltyBreakdown} />
        <FinancialImpactSection data={content.financialImpact} />
        <DeadlinesTable data={content.deadlines} />
        <LegalReferencesSection data={content.legalReferences} />
        <HowToAvoidSection data={content.howToAvoid} />
        <FAQSection data={content.additionalFaqs} />
        <RelatedPenalties data={content.relatedPenalties} />
      </div>

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
    </>
  )
}
