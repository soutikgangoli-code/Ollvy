'use client'

import { useState, useMemo, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Calculator, SlidersHorizontal } from 'lucide-react'
import {
  MonthsLateSlider,
  RupeeInput,
  ResultsPanel,
  InfoBanner,
} from '@/components/penalty-calculator'

type ComplianceType = 'fc_gpr' | 'fc_trs' | 'esop' | 'angel_tax'

interface CalculationResult {
  fcGprPenaltyMin: number
  fcGprPenaltyMax: number
  fcTrsPenaltyMin: number
  fcTrsPenaltyMax: number
  esopPenaltyMin: number
  esopPenaltyMax: number
  totalMin: number
  totalMax: number
  showRange: boolean
}

function calculateStartupPenalty(
  complianceTypes: ComplianceType[],
  foreignInvestmentAmount: number,
  monthsLate: number,
  isDPIITRecognised: boolean
): CalculationResult {
  let fcGprPenaltyMin = 0
  let fcGprPenaltyMax = 0
  let fcTrsPenaltyMin = 0
  let fcTrsPenaltyMax = 0
  let esopPenaltyMin = 0
  let esopPenaltyMax = 0

  // FC-GPR Non-Filing
  // Compounding fee: ₹5,000 to 1% of amount, case-by-case by RBI
  if (complianceTypes.includes('fc_gpr') && foreignInvestmentAmount > 0) {
    fcGprPenaltyMin = 5000
    fcGprPenaltyMax = Math.round(foreignInvestmentAmount * 0.01)
    if (fcGprPenaltyMax < fcGprPenaltyMin) {
      fcGprPenaltyMax = fcGprPenaltyMin
    }
  }

  // FC-TRS Non-Filing - similar to FC-GPR
  if (complianceTypes.includes('fc_trs') && foreignInvestmentAmount > 0) {
    fcTrsPenaltyMin = 5000
    fcTrsPenaltyMax = Math.round(foreignInvestmentAmount * 0.01)
    if (fcTrsPenaltyMax < fcTrsPenaltyMin) {
      fcTrsPenaltyMax = fcTrsPenaltyMin
    }
  }

  // ESOP Non-compliance - typically ₹5,000 to 0.5% of ESOP pool value
  if (complianceTypes.includes('esop') && foreignInvestmentAmount > 0) {
    esopPenaltyMin = 5000
    esopPenaltyMax = Math.round(foreignInvestmentAmount * 0.005)
    if (esopPenaltyMax < esopPenaltyMin) {
      esopPenaltyMax = esopPenaltyMin
    }
  }

  const totalMin = fcGprPenaltyMin + fcTrsPenaltyMin + esopPenaltyMin
  const totalMax = fcGprPenaltyMax + fcTrsPenaltyMax + esopPenaltyMax
  const showRange = totalMin !== totalMax

  return {
    fcGprPenaltyMin,
    fcGprPenaltyMax,
    fcTrsPenaltyMin,
    fcTrsPenaltyMax,
    esopPenaltyMin,
    esopPenaltyMax,
    totalMin,
    totalMax,
    showRange,
  }
}

// FAQs
const faqs = [
  {
    question: 'What is FC-GPR and when must it be filed?',
    answer: 'FC-GPR (Foreign Currency - Gross Provisional Return) is a form that Indian companies must file with RBI within 30 days of receiving foreign investment. It reports inward remittance and allotment of shares to foreign investors under the automatic or approval route.',
  },
  {
    question: 'What is the penalty for not filing FC-GPR?',
    answer: 'Late or non-filing of FC-GPR is a FEMA contravention. RBI can impose compounding fees ranging from ₹5,000 to 1% of the amount involved, determined on a case-by-case basis. In severe cases, RBI may decline compounding and refer the matter to the Enforcement Directorate.',
  },
  {
    question: 'What is FC-TRS and how is it different from FC-GPR?',
    answer: 'FC-TRS (Foreign Currency Transfer of Shares) is filed when shares are transferred between a resident and non-resident. FC-GPR is for fresh issuance of shares. Both must be filed within 60 days (FC-TRS) and 30 days (FC-GPR) of the transaction respectively.',
  },
  {
    question: 'What is Angel Tax and does it apply to DPIIT startups?',
    answer: 'Angel Tax under Section 56(2)(viib) taxes share premium above fair market value as income. DPIIT-recognised startups that file Form 2 are exempt from Angel Tax. Without DPIIT recognition, any premium received above valuation is taxed at 30%.',
  },
  {
    question: 'How do I get DPIIT recognition for my startup?',
    answer: 'Apply on the Startup India portal. Requirements: (1) Entity age < 10 years, (2) Annual turnover < ₹100 Crore, (3) Working towards innovation or scalable business model, (4) Not formed by splitting/reconstruction. Recognition is typically granted within 2-3 weeks.',
  },
  {
    question: 'What ESOP compliances are required under FEMA?',
    answer: 'Indian companies issuing ESOPs to foreign employees or subsidiaries must: (1) File FC-GPR on exercise, (2) Report annual returns to RBI, (3) Ensure pricing per FEMA regulations. Non-compliance can attract compounding fees and regulatory scrutiny.',
  },
  {
    question: 'Can FEMA contraventions be compounded?',
    answer: 'Yes, most FEMA contraventions can be compounded by applying to RBI. The application must be made within 3 years. RBI considers the nature, cause, and period of default when determining the compounding fee. Technical violations typically attract lower fees than willful non-compliance.',
  },
  {
    question: 'What documents are required for FC-GPR filing?',
    answer: 'FC-GPR filing requires: (1) Board resolution, (2) Shareholder resolution if applicable, (3) FIRC (Foreign Inward Remittance Certificate), (4) KYC of foreign investor, (5) Valuation certificate from CA/Merchant Banker, (6) CS certificate.',
  },
]

function StartupDPIITComplianceCalculator() {
  const searchParams = useSearchParams()

  // Initialize from URL params
  const [complianceTypes, setComplianceTypes] = useState<ComplianceType[]>(() => {
    const types = searchParams.get('types')?.split(',') as ComplianceType[] || ['fc_gpr']
    return types.filter(t => ['fc_gpr', 'fc_trs', 'esop', 'angel_tax'].includes(t))
  })
  const [foreignInvestmentAmount, setForeignInvestmentAmount] = useState(
    parseInt(searchParams.get('amount') || '5000000', 10)
  )
  const [monthsLate, setMonthsLate] = useState(
    parseInt(searchParams.get('months') || '6', 10)
  )
  const [isDPIITRecognised, setIsDPIITRecognised] = useState(
    searchParams.get('dpiit') !== 'false'
  )

  // Calculate penalty
  const result = useMemo(() => {
    return calculateStartupPenalty(
      complianceTypes,
      foreignInvestmentAmount,
      monthsLate,
      isDPIITRecognised
    )
  }, [complianceTypes, foreignInvestmentAmount, monthsLate, isDPIITRecognised])

  // Toggle compliance type
  const toggleComplianceType = (type: ComplianceType) => {
    setComplianceTypes(prev => {
      if (prev.includes(type)) {
        return prev.filter(t => t !== type)
      } else {
        return [...prev, type]
      }
    })
  }

  // Update URL params
  useEffect(() => {
    const params = new URLSearchParams()
    params.set('types', complianceTypes.join(','))
    params.set('amount', foreignInvestmentAmount.toString())
    params.set('months', monthsLate.toString())
    params.set('dpiit', isDPIITRecognised.toString())

    const newUrl = `${window.location.pathname}?${params.toString()}`
    window.history.replaceState(null, '', newUrl)
  }, [complianceTypes, foreignInvestmentAmount, monthsLate, isDPIITRecognised])

  // Breakdown for ResultsPanel
  const breakdown = useMemo(() => {
    const items = []

    if (result.fcGprPenaltyMax > 0) {
      items.push({
        label: 'FC-GPR Late Filing (FEMA)',
        amount: result.fcGprPenaltyMax,
        subItems: [
          {
            label: `Range: ₹${result.fcGprPenaltyMin.toLocaleString('en-IN')} - ₹${result.fcGprPenaltyMax.toLocaleString('en-IN')}`,
            amount: 0,
          },
        ],
        statuteShort: 'FEMA Sec 15',
        statuteFull: 'Section 15, FEMA 1999 — Compounding of contraventions',
      })
    }

    if (result.fcTrsPenaltyMax > 0) {
      items.push({
        label: 'FC-TRS Late Filing (FEMA)',
        amount: result.fcTrsPenaltyMax,
        subItems: [
          {
            label: `Range: ₹${result.fcTrsPenaltyMin.toLocaleString('en-IN')} - ₹${result.fcTrsPenaltyMax.toLocaleString('en-IN')}`,
            amount: 0,
          },
        ],
        statuteShort: 'FEMA Sec 15',
        statuteFull: 'Section 15, FEMA 1999 — Compounding of contraventions',
      })
    }

    if (result.esopPenaltyMax > 0) {
      items.push({
        label: 'ESOP Non-Compliance',
        amount: result.esopPenaltyMax,
        subItems: [
          {
            label: `Range: ₹${result.esopPenaltyMin.toLocaleString('en-IN')} - ₹${result.esopPenaltyMax.toLocaleString('en-IN')}`,
            amount: 0,
          },
        ],
        statuteShort: 'FEMA Sec 15',
        statuteFull: 'Section 15, FEMA 1999 — Compounding of contraventions',
      })
    }

    return items
  }, [result])

  // Check if angel tax is selected
  const showAngelTaxInfo = complianceTypes.includes('angel_tax')
  const hasCalculablePenalty = complianceTypes.includes('fc_gpr') || complianceTypes.includes('fc_trs') || complianceTypes.includes('esop')

  return (
    <>
      {/* JSON-LD Schema - FAQPage */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: faqs.map((faq) => ({
              '@type': 'Question',
              name: faq.question,
              acceptedAnswer: {
                '@type': 'Answer',
                text: faq.answer,
              },
            })),
          }),
        }}
      />

      {/* JSON-LD Schema - HowTo */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'HowTo',
            name: 'How to calculate FEMA penalty for startup compliance',
            step: [
              { '@type': 'HowToStep', name: 'Select compliance type', text: 'Choose FC-GPR, FC-TRS, ESOP, or Angel Tax exposure' },
              { '@type': 'HowToStep', name: 'Enter foreign investment amount', text: 'Input the total foreign investment received in rupees' },
              { '@type': 'HowToStep', name: 'Set months of default', text: 'Specify how many months the filing is overdue' },
              { '@type': 'HowToStep', name: 'Indicate DPIIT status', text: 'Toggle whether your startup has DPIIT recognition' },
              { '@type': 'HowToStep', name: 'View penalty range', text: 'See estimated compounding fee range and advisory notes' },
            ],
          }),
        }}
      />

      {/* JSON-LD Schema - BreadcrumbList */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://ollvy.com' },
              { '@type': 'ListItem', position: 2, name: 'Tools', item: 'https://ollvy.com/tools' },
              { '@type': 'ListItem', position: 3, name: 'Penalty Calculator', item: 'https://ollvy.com/tools/penalty-calculator' },
              { '@type': 'ListItem', position: 4, name: 'Startup DPIIT Compliance', item: 'https://ollvy.com/tools/penalty-calculator/startup-dpiit-compliance' },
            ],
          }),
        }}
      />

      <div className="grid lg:grid-cols-[1.2fr,1fr] gap-10">
        {/* Input Section */}
        <div className="rounded-xl border border-border/50 bg-zinc-950 p-6 space-y-8">
          <div className="space-y-6">
            {/* Compliance Type - Multi-select */}
            <div className="space-y-3">
              <Label>Compliance Type</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <Checkbox
                    checked={complianceTypes.includes('fc_gpr')}
                    onCheckedChange={() => toggleComplianceType('fc_gpr')}
                  />
                  <span className="text-sm">FC-GPR not filed</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <Checkbox
                    checked={complianceTypes.includes('fc_trs')}
                    onCheckedChange={() => toggleComplianceType('fc_trs')}
                  />
                  <span className="text-sm">FC-TRS not filed</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <Checkbox
                    checked={complianceTypes.includes('esop')}
                    onCheckedChange={() => toggleComplianceType('esop')}
                  />
                  <span className="text-sm">ESOP non-compliance</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <Checkbox
                    checked={complianceTypes.includes('angel_tax')}
                    onCheckedChange={() => toggleComplianceType('angel_tax')}
                  />
                  <span className="text-sm">Angel Tax exposure</span>
                </label>
              </div>
            </div>

            {/* Foreign Investment Amount */}
            <RupeeInput
              value={foreignInvestmentAmount}
              onChange={setForeignInvestmentAmount}
              label="Foreign Investment Amount (₹)"
              helpText="Total amount received from foreign investors"
            />

            {/* Months of Default */}
            <MonthsLateSlider
              value={monthsLate}
              onChange={setMonthsLate}
              maxMonths={60}
              label="Months of Default"
            />

            {/* DPIIT Recognition Toggle */}
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="dpiit">Is Company DPIIT Recognised?</Label>
                <p className="text-xs text-muted-foreground mt-0.5">
                  DPIIT recognition provides Angel Tax exemption
                </p>
              </div>
              <Switch
                id="dpiit"
                checked={isDPIITRecognised}
                onCheckedChange={setIsDPIITRecognised}
              />
            </div>

            {/* Advanced filters accordion */}
            <Accordion type="single" collapsible>
              <AccordionItem value="advanced" className="border-none">
                <AccordionTrigger className="text-sm font-medium hover:no-underline py-2">
                  <span className="flex items-center gap-2">
                    <SlidersHorizontal className="h-4 w-4" />
                    Advanced filters
                  </span>
                </AccordionTrigger>
                <AccordionContent className="space-y-4 pt-4">
                  <p className="text-sm text-muted-foreground">
                    FEMA compounding fees are determined by RBI on a case-by-case basis.
                    Factors include: nature of contravention, period of delay, voluntary disclosure,
                    and amount involved. This calculator shows the typical range.
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>

        {/* Results Section */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <ResultsPanel
            total={result.totalMax}
            breakdown={breakdown}
            statute={result.showRange ? `Estimated range: ₹${result.totalMin.toLocaleString('en-IN')} - ₹${result.totalMax.toLocaleString('en-IN')}` : 'FEMA Section 15 — Compounding'}
            ctaText="Get FEMA Compliance Help"
            ctaHref="/services/startup-compliance"
            showCta={hasCalculablePenalty && result.totalMax > 0}
          >
            {/* Angel Tax InfoBanner */}
            {showAngelTaxInfo && (
              <InfoBanner
                title={isDPIITRecognised ? 'Angel Tax Exempt' : 'Angel Tax Applies'}
                body={isDPIITRecognised
                  ? 'As a DPIIT-recognised startup, you are exempt from Angel Tax under Section 56(2)(viib) if you have filed Form 2 with DPIIT.'
                  : 'Without DPIIT recognition, investment above fair market value is taxed as income under Section 56(2)(viib) at 30%.'
                }
              />
            )}

            {/* FEMA Range Note */}
            {hasCalculablePenalty && (
              <InfoBanner
                title="Compounding fee is estimated"
                body="FEMA compounding fees range from ₹5,000 to 1% of the amount. RBI determines the exact fee on a case-by-case basis."
              />
            )}
          </ResultsPanel>
        </div>
      </div>

      {/* SEO Content - H2 Sections */}
      <div className="mt-16 max-w-3xl space-y-12">
        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            What is FC-GPR and why is it mandatory for startups?
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            FC-GPR (Foreign Currency - Gross Provisional Return) is a regulatory filing
            required by the Reserve Bank of India (RBI) under FEMA regulations. When an Indian
            company receives foreign investment — whether from foreign VCs, angel investors, or
            strategic investors — it must report this transaction to RBI within 30 days of
            receiving the funds and allotting shares. The FC-GPR filing serves multiple
            purposes: it enables RBI to track foreign investment flows into India, ensures
            compliance with sectoral caps and pricing guidelines, and creates a documented
            trail for the company&apos;s cap table. For startups raising from international
            investors, FC-GPR compliance is non-negotiable.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            FEMA compounding fees for FC-GPR and FC-TRS violations
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            When a company fails to file FC-GPR or FC-TRS within the stipulated timeline, it
            constitutes a FEMA contravention. RBI has the power to compound such violations
            under Section 15 of FEMA, 1999. The compounding fee is determined on a case-by-case
            basis and typically ranges from ₹5,000 to 1% of the amount involved. Factors that
            influence the compounding fee include the nature and extent of the contravention,
            whether it was a technical violation or willful non-compliance, the period of delay,
            and the company&apos;s overall compliance history.{' '}
            <Link href="/services/startup-compliance" className="text-emerald-600 hover:underline">
              Get FEMA compliance support from Ollvy
            </Link>.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            Angel Tax exemption for DPIIT-recognised startups
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Angel Tax under Section 56(2)(viib) of the Income Tax Act can be a significant
            burden for startups raising funds at valuations above fair market value. When a
            startup issues shares at a premium that exceeds the fair market value (FMV), the
            premium is treated as income and taxed at 30% plus surcharge and cess. However,
            startups that obtain DPIIT (Department for Promotion of Industry and Internal Trade)
            recognition and file Form 2 with DPIIT are exempt from Angel Tax. This exemption
            applies to investments from residents as well as Category I AIFs.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            ESOP compliance requirements under FEMA
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Employee Stock Option Plans (ESOPs) involving foreign employees or having
            cross-border elements attract FEMA compliance requirements. When shares are issued
            to foreign employees on exercise of ESOPs, the company must file FC-GPR within 30
            days. Additionally, if the ESOP allows cashless exercise or involves a trust
            structure, specific RBI regulations apply. Non-compliance with ESOP-related FEMA
            requirements can result in compounding fees and may create issues during due
            diligence for subsequent fundraising or M&A transactions.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            How to apply for FEMA compounding at RBI
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            If your startup has missed the FC-GPR or FC-TRS filing deadline, you can apply for
            compounding at RBI. The application must be submitted within 3 years of the
            contravention through the RBI&apos;s FIRMS portal. Required documents typically
            include: a detailed description of the contravention, reasons for the delay,
            supporting transaction documents, CA certificate, and CS certificate. RBI typically
            processes compounding applications within 90-180 days. It is advisable to engage a
            professional (CA or Company Secretary) with FEMA experience to handle the
            compounding application.
          </p>
        </section>
      </div>

      {/* FAQs Section */}
      <div className="mt-16 max-w-3xl">
        <h2 className="text-2xl font-semibold text-foreground mb-6">
          Frequently Asked Questions
        </h2>
        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div key={index} className="border-b border-border pb-6 last:border-0">
              <h3 className="font-semibold text-foreground mb-2">{faq.question}</h3>
              <p className="text-muted-foreground">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Related Tools */}
      <div className="mt-16 max-w-3xl">
        <h2 className="text-2xl font-semibold text-foreground mb-6">Related Tools</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <Link href="/tools/penalty-calculator/mca-annual-filing" className="block">
            <Card className="p-4 rounded-none hover:border-emerald-500 transition-colors">
              <h3 className="font-semibold text-foreground">MCA Annual Filing Penalty</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Calculate ROC filing penalties for AOC-4 and MGT-7
              </p>
            </Card>
          </Link>
          <Link href="/tools/penalty-calculator/director-kyc" className="block">
            <Card className="p-4 rounded-none hover:border-emerald-500 transition-colors">
              <h3 className="font-semibold text-foreground">Director KYC Penalty</h3>
              <p className="text-sm text-muted-foreground mt-1">
                ₹5,000 per director for DIR-3 KYC non-filing
              </p>
            </Card>
          </Link>
          <Link href="/tools/penalty-calculator/gst-late-filing" className="block">
            <Card className="p-4 rounded-none hover:border-emerald-500 transition-colors">
              <h3 className="font-semibold text-foreground">GST Late Filing Penalty</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Calculate GSTR-1, GSTR-3B, GSTR-9 late fees
              </p>
            </Card>
          </Link>
          <Link href="/tools/penalty-calculator/itr-late-filing" className="block">
            <Card className="p-4 rounded-none hover:border-emerald-500 transition-colors">
              <h3 className="font-semibold text-foreground">ITR Late Filing Penalty</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Section 234F fee and interest calculation
              </p>
            </Card>
          </Link>
        </div>
      </div>

      {/* Print styles */}
      <style jsx global>{`
        @media print {
          .print-hidden {
            display: none !important;
          }
        }
      `}</style>
    </>
  )
}

// Loading fallback for Suspense
function CalculatorSkeleton() {
  return (
    <div className="grid lg:grid-cols-[1.5fr,1fr] gap-8 animate-pulse">
      <div className="bg-muted rounded-lg h-[500px]" />
      <div className="bg-muted rounded-lg h-[350px]" />
    </div>
  )
}

export default function StartupDPIITCompliancePage() {
  return (
    <Suspense fallback={<CalculatorSkeleton />}>
      <StartupDPIITComplianceCalculator />
    </Suspense>
  )
}

