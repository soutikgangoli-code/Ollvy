'use client'

import { useState, useMemo, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Calculator, SlidersHorizontal } from 'lucide-react'
import {
  TurnoverSlider,
  DaysLateSlider,
  RupeeInput,
  ResultsPanel,
  WarningBanner,
  InfoBanner,
} from '@/components/penalty-calculator'
import { safeParseInt } from '@/lib/parse-url-params'

type EntityType = 'individual' | 'huf' | 'partnership' | 'llp' | 'company'
type FinancialYear = 'FY2024-25' | 'FY2023-24' | 'FY2022-23' | 'FY2021-22'

// Due date logic from spec
interface DueDateInfo {
  dueDate: string
  auditRequired: boolean
  dateString: string
}

function getDueDateInfo(
  entityType: EntityType,
  totalIncome: number,
  isAuditRequired: boolean
): DueDateInfo {
  // Companies and LLPs always require audit
  if (entityType === 'company' || entityType === 'llp') {
    return {
      dueDate: '31 October',
      auditRequired: true,
      dateString: '31 October',
    }
  }

  // Partnership firms with turnover > ₹1 Crore require audit
  if (entityType === 'partnership' && totalIncome > 10000000) {
    return {
      dueDate: '31 October',
      auditRequired: true,
      dateString: '31 October',
    }
  }

  // Individual/HUF with audit required
  if (isAuditRequired) {
    return {
      dueDate: '31 October',
      auditRequired: true,
      dateString: '31 October',
    }
  }

  // Non-audit cases
  return {
    dueDate: '31 July',
    auditRequired: false,
    dateString: '31 July',
  }
}

interface CalculationResult {
  lateFee: number // Section 234F
  interest234A: number // Section 234A
  interest234B: number // Section 234B
  total: number
  statute: string
  monthsLate: number
}

function calculateITRPenalty(
  totalIncome: number,
  outstandingTax: number,
  daysLate: number,
  advanceTaxPaid: number
): CalculationResult {
  // Section 234F - FLAT fee, not per day
  let lateFee = 0
  const BASIC_EXEMPTION = 250000 // ₹2.5L for individuals under 60

  if (totalIncome > BASIC_EXEMPTION) {
    lateFee = totalIncome <= 500000 ? 1000 : 5000
  }

  // Section 234A - 1% per month on unpaid tax (round UP partial months)
  const monthsLate = Math.ceil(daysLate / 30)
  const interest234A = Math.round(outstandingTax * 0.01 * monthsLate)

  // Section 234B - Advance tax shortfall (if advance tax < 90% of assessed tax)
  const assessedTax = outstandingTax + advanceTaxPaid
  let interest234B = 0
  if (advanceTaxPaid < assessedTax * 0.9 && assessedTax > 0) {
    const shortfall = assessedTax - advanceTaxPaid
    interest234B = Math.round(shortfall * 0.01 * monthsLate)
  }

  return {
    lateFee,
    interest234A,
    interest234B,
    total: lateFee + interest234A + interest234B,
    statute: 'Section 234F (Late Fee), 234A (Interest), 234B (Advance Tax)',
    monthsLate,
  }
}

// FAQs from Section 14.2
const faqs = [
  {
    question: 'What is the penalty for filing ITR late?',
    answer: 'Section 234F imposes a flat fee: ₹1,000 if total income is up to ₹5 Lakh, and ₹5,000 if income exceeds ₹5 Lakh. If income is below the basic exemption limit (₹2.5 Lakh), no fee applies.',
  },
  {
    question: 'Is the Section 234F fee per day or a flat fee?',
    answer: 'It is a flat one-time fee - not per day. Whether you file 1 day late or 6 months late, the fee is the same. This is a common misconception.',
  },
  {
    question: 'What is Section 234A interest?',
    answer: 'Section 234A charges interest at 1% per month (or part thereof) on unpaid tax if the return is filed after the due date. If all tax was paid via TDS or advance tax, Section 234A = ₹0.',
  },
  {
    question: 'What is Section 234B and when does it apply?',
    answer: 'Section 234B charges 1% per month on the shortfall if advance tax paid is less than 90% of total tax liability. It applies from April 1 of the assessment year until payment.',
  },
  {
    question: 'What is the ITR due date for a company?',
    answer: 'For companies (Pvt Ltd, Public Ltd), the due date is 31 October, as audit is always mandatory. For non-audit individuals: 31 July. For audit-required individuals and partnerships: 31 October.',
  },
  {
    question: 'What is a belated return?',
    answer: 'A belated return is filed after the original due date but before 31 December of the assessment year. For FY 2024-25, belated returns can be filed until 31 December 2025.',
  },
  {
    question: 'Can I claim a refund if I file ITR late?',
    answer: 'Yes, you can claim a refund in a belated return. However, interest on refund under Section 244A runs only from April 1 of the assessment year or date of tax payment - not from the original due date.',
  },
  {
    question: 'What is the Section 271B penalty for not getting accounts audited?',
    answer: 'If turnover exceeds ₹1 Crore and you don\'t get audited, Section 271B imposes a penalty of 0.5% of turnover or ₹1,50,000, whichever is lower.',
  },
]

function ITRLatePenaltyCalculator() {
  const searchParams = useSearchParams()

  // Initialize from URL params
  const [entityType, setEntityType] = useState<EntityType>(
    (searchParams.get('entity') as EntityType) || 'individual'
  )
  const [financialYear, setFinancialYear] = useState<FinancialYear>(
    (searchParams.get('fy') as FinancialYear) || 'FY2024-25'
  )
  const [isAuditRequired, setIsAuditRequired] = useState(
    searchParams.get('audit') === 'true'
  )
  const [totalIncome, setTotalIncome] = useState(
    safeParseInt(searchParams.get('income'), 1000000) // Default ₹10 Lakh
  )
  const [outstandingTax, setOutstandingTax] = useState(
    safeParseInt(searchParams.get('tax'), 0)
  )
  const [daysLate, setDaysLate] = useState(
    safeParseInt(searchParams.get('days'), 30)
  )
  const [wasAdvanceTaxPaid, setWasAdvanceTaxPaid] = useState(
    searchParams.get('advance_paid') !== 'false'
  )
  const [advanceTaxPaid, setAdvanceTaxPaid] = useState(
    safeParseInt(searchParams.get('advance_amount'), 0)
  )
  const [tdsDeducted, setTdsDeducted] = useState(
    safeParseInt(searchParams.get('tds'), 0)
  )

  // Get due date info
  const dueDateInfo = useMemo(() => {
    return getDueDateInfo(entityType, totalIncome, isAuditRequired)
  }, [entityType, totalIncome, isAuditRequired])

  // Calculate penalty
  const result = useMemo(() => {
    const effectiveAdvanceTax = wasAdvanceTaxPaid ? advanceTaxPaid : 0
    return calculateITRPenalty(totalIncome, outstandingTax, daysLate, effectiveAdvanceTax)
  }, [totalIncome, outstandingTax, daysLate, wasAdvanceTaxPaid, advanceTaxPaid])

  // Warning conditions
  const showAuditWarning = dueDateInfo.auditRequired && daysLate > 0
  const showCompanyPenaltyWarning = entityType === 'company' && daysLate > 0
  const showLongDefaultWarning = outstandingTax > 0 && result.monthsLate > 6

  // Update URL params
  useEffect(() => {
    const params = new URLSearchParams()
    params.set('entity', entityType)
    params.set('fy', financialYear)
    params.set('audit', isAuditRequired.toString())
    params.set('income', totalIncome.toString())
    params.set('tax', outstandingTax.toString())
    params.set('days', daysLate.toString())
    params.set('advance_paid', wasAdvanceTaxPaid.toString())
    params.set('advance_amount', advanceTaxPaid.toString())
    params.set('tds', tdsDeducted.toString())

    const newUrl = `${window.location.pathname}?${params.toString()}`
    window.history.replaceState(null, '', newUrl)
  }, [entityType, financialYear, isAuditRequired, totalIncome, outstandingTax, daysLate, wasAdvanceTaxPaid, advanceTaxPaid, tdsDeducted])

  // Breakdown for ResultsPanel
  const breakdown = useMemo(() => {
    const items = []

    if (result.lateFee > 0) {
      items.push({
        label: 'Section 234F - Late Filing Fee',
        amount: result.lateFee,
        subItems: [
          { label: totalIncome <= 500000 ? 'Income ≤ ₹5 Lakh' : 'Income > ₹5 Lakh', amount: result.lateFee },
        ],
        statuteShort: 'Sec 234F',
        statuteFull: 'Section 234F of Income Tax Act 1961 - Fee for late filing of return',
      })
    }

    if (result.interest234A > 0) {
      items.push({
        label: 'Section 234A - Interest on Unpaid Tax',
        amount: result.interest234A,
        subItems: [
          { label: `1% per month × ${result.monthsLate} month${result.monthsLate > 1 ? 's' : ''} on ₹${outstandingTax.toLocaleString('en-IN')}`, amount: result.interest234A },
        ],
        statuteShort: 'Sec 234A',
        statuteFull: 'Section 234A of Income Tax Act 1961 - Interest for default in furnishing return of income',
      })
    }

    if (result.interest234B > 0) {
      items.push({
        label: 'Section 234B - Advance Tax Shortfall',
        amount: result.interest234B,
        subItems: [
          { label: `Advance tax < 90% of liability`, amount: result.interest234B },
        ],
        statuteShort: 'Sec 234B',
        statuteFull: 'Section 234B of Income Tax Act 1961 - Interest for default in payment of advance tax',
      })
    }

    return items
  }, [result, totalIncome, outstandingTax])

  return (
    <>
      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: faqs.map(faq => ({
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

      {/* HowTo Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'HowTo',
            name: 'How to calculate ITR late filing penalty',
            step: [
              { '@type': 'HowToStep', name: 'Select entity type', text: 'Choose Individual, HUF, Partnership, LLP, or Company' },
              { '@type': 'HowToStep', name: 'Enter total income', text: 'Enter your total annual income' },
              { '@type': 'HowToStep', name: 'Enter outstanding tax', text: 'Enter any tax liability not yet paid' },
              { '@type': 'HowToStep', name: 'Enter days late', text: 'Specify how many days late you are filing' },
              { '@type': 'HowToStep', name: 'View penalty', text: 'See total penalty with 234F, 234A, and 234B breakdown' },
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
              { '@type': 'ListItem', position: 4, name: 'ITR Late Filing', item: 'https://ollvy.com/tools/penalty-calculator/itr-late-filing' },
            ],
          }),
        }}
      />

      <div className="grid lg:grid-cols-[1.2fr,1fr] gap-10">
        {/* Input Section */}
        <div className="rounded-xl border border-border bg-card p-6 space-y-8">
          <div className="space-y-6">
            {/* Entity Type */}
            <div className="space-y-1.5">
              <Label>Entity Type</Label>
              <Select value={entityType} onValueChange={(v) => setEntityType(v as EntityType)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="individual">Individual</SelectItem>
                  <SelectItem value="huf">HUF</SelectItem>
                  <SelectItem value="partnership">Partnership Firm</SelectItem>
                  <SelectItem value="llp">LLP</SelectItem>
                  <SelectItem value="company">Company</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Due date: {dueDateInfo.dateString}
              </p>
            </div>

            {/* Financial Year */}
            <div className="space-y-1.5">
              <Label>Financial Year</Label>
              <Select value={financialYear} onValueChange={(v) => setFinancialYear(v as FinancialYear)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="FY2024-25">FY 2024-25</SelectItem>
                  <SelectItem value="FY2023-24">FY 2023-24</SelectItem>
                  <SelectItem value="FY2022-23">FY 2022-23</SelectItem>
                  <SelectItem value="FY2021-22">FY 2021-22</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Is Audit Required */}
            <div className="flex items-center justify-between">
              <div>
                <Label>Is Audit Required?</Label>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Required if turnover &gt; ₹1 Cr (or ₹10 Cr with ≤5% cash)
                </p>
              </div>
              <Switch
                checked={isAuditRequired || entityType === 'company' || entityType === 'llp'}
                onCheckedChange={setIsAuditRequired}
                disabled={entityType === 'company' || entityType === 'llp'}
              />
            </div>

            {/* Total Annual Income */}
            <TurnoverSlider
              value={totalIncome}
              onChange={setTotalIncome}
              label="Total Annual Income"
            />
            <p className="text-xs text-muted-foreground -mt-4">
              Penalty is ₹1,000 if income ≤ ₹5 lakh, ₹5,000 if higher
            </p>

            {/* Outstanding Tax */}
            <RupeeInput
              value={outstandingTax}
              onChange={setOutstandingTax}
              label="Outstanding Tax Liability"
              helpText="Tax liability remaining after TDS and advance tax"
            />

            {/* Advanced Filters */}
            <Accordion type="single" collapsible>
              <AccordionItem value="advanced" className="border-none">
                <AccordionTrigger className="text-sm font-medium hover:no-underline py-2">
                  <span className="flex items-center gap-2">
                    <SlidersHorizontal className="h-4 w-4" />
                    Advanced filters
                  </span>
                </AccordionTrigger>
                <AccordionContent className="space-y-6 pt-4">
                  {/* Days Late */}
                  <DaysLateSlider
                    value={daysLate}
                    onChange={setDaysLate}
                    label="Days Late from Due Date"
                    maxDays={365}
                  />

                  {/* Was Advance Tax Paid */}
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Was Advance Tax Paid?</Label>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Affects Section 234B interest calculation
                      </p>
                    </div>
                    <Switch checked={wasAdvanceTaxPaid} onCheckedChange={setWasAdvanceTaxPaid} />
                  </div>

                  {/* Advance Tax Paid Amount */}
                  {wasAdvanceTaxPaid && (
                    <RupeeInput
                      value={advanceTaxPaid}
                      onChange={setAdvanceTaxPaid}
                      label="Advance Tax Paid Amount"
                      helpText="Total advance tax paid during the year"
                    />
                  )}

                  {/* TDS Deducted */}
                  <RupeeInput
                    value={tdsDeducted}
                    onChange={setTdsDeducted}
                    label="TDS Deducted (₹)"
                    helpText="Credit against tax liability"
                  />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>

        {/* Results Section */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <ResultsPanel
            total={result.total}
            breakdown={breakdown}
            dueDate={dueDateInfo.dateString}
            statute="Income Tax Act, 1961"
            ctaText="File ITR Now"
            ctaHref="/services/itr-filing"
            showCta={result.total > 0}
          >
            {/* Section 234C Advisory - InfoBanner only */}
            <InfoBanner
              title="Section 234C - Quarterly Advance Tax Interest"
              body="If advance tax instalments were not paid on time during the year (due 15 June, 15 September, 15 December, 15 March), Section 234C interest applies at 1% per month on the quarterly shortfall. This is separate from the Section 234B interest shown above. Consult your CA to calculate exact 234C liability for your instalments."
            />

            {/* Warning: Company filing late */}
            {showCompanyPenaltyWarning && (
              <WarningBanner
                variant="red"
                title="Section 271B Penalty Risk"
                body="Companies face mandatory penalty under Section 271B for audit non-compliance. Late fee under 234F applies additionally."
              />
            )}

            {/* Warning: Audit required and late */}
            {showAuditWarning && entityType !== 'company' && (
              <WarningBanner
                variant="yellow"
                title="Audit Report Also Due"
                body="Audit report (Form 3CA/3CB) was also due 31 October. Non-filing attracts Section 271B: 0.5% of turnover or ₹1,50,000, whichever is lower."
              />
            )}

            {/* Warning: Long default */}
            {showLongDefaultWarning && (
              <WarningBanner
                variant="yellow"
                title="Interest continuing to accrue"
                body="Section 234A interest continues to accrue until full payment."
              />
            )}
          </ResultsPanel>
        </div>
      </div>

      {/* SEO Content - H2 Sections */}
      <div className="mt-16 max-w-3xl space-y-12">
        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            What is the penalty for filing income tax return late?
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            The penalty for filing income tax return late in India is governed by Section 234F
            of the Income Tax Act 1961. This section imposes a flat late filing fee based on
            your total income. If your total income exceeds ₹5 Lakh, the late fee is ₹5,000.
            If your income is between ₹2.5 Lakh and ₹5 Lakh, the fee is ₹1,000. If your income
            is below the basic exemption limit of ₹2.5 Lakh (₹3 Lakh for senior citizens,
            ₹5 Lakh for super seniors), no late fee applies as filing is not mandatory.
            Additionally, if you have unpaid tax, interest under Sections 234A, 234B, and 234C
            may also apply.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            Section 234F late filing fee - ₹1,000 vs ₹5,000
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Section 234F imposes a flat late filing fee - not a per-day penalty. This is a
            common misconception. Whether you file your return 1 day late or 6 months late,
            the fee is the same. The fee amount depends solely on your total income:
          </p>
          <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-4">
            <li><strong>Income ≤ ₹5 Lakh:</strong> Late fee is ₹1,000</li>
            <li><strong>Income &gt; ₹5 Lakh:</strong> Late fee is ₹5,000</li>
            <li><strong>Income below basic exemption (₹2.5L):</strong> No late fee (filing not mandatory)</li>
          </ul>
          <p className="text-muted-foreground leading-relaxed mt-4">
            Note that prior to FY 2020-21, there was also a ₹10,000 fee for returns filed after
            31 December. This distinction has been removed - the fee is now ₹5,000 regardless
            of when you file (as long as it&apos;s within the belated return window).
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            Section 234A interest - how is it calculated?
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Section 234A charges interest at 1% per month (or part of a month) on unpaid tax
            from the original due date until the date of filing. The key word is &quot;unpaid tax&quot;
            - if all your tax liability was covered by TDS and advance tax, Section 234A
            interest will be zero. The calculation formula is:
          </p>
          <p className="text-muted-foreground leading-relaxed mt-4 font-mono bg-muted p-4 rounded">
            Interest = Outstanding Tax × 1% × Number of Months Late (rounded up)
          </p>
          <p className="text-muted-foreground leading-relaxed mt-4">
            For example, if you have ₹20,000 outstanding tax and file 3.5 months late, the
            interest would be: ₹20,000 × 1% × 4 months = ₹800. Note that 3.5 months is rounded
            up to 4 months - partial months count as full months for interest calculation.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            What happens if I miss the ITR filing deadline for my company?
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Companies (Pvt Ltd, Public Ltd) have additional compliance requirements beyond
            individual taxpayers. The ITR due date for companies is 31 October (not 31 July)
            as audit is always mandatory. Missing the deadline has the following consequences:
          </p>
          <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-4">
            <li><strong>Section 234F:</strong> ₹5,000 late filing fee (as company income is typically above ₹5 Lakh)</li>
            <li><strong>Section 234A:</strong> 1% per month interest on unpaid tax</li>
            <li><strong>Section 234B:</strong> 1% per month on advance tax shortfall</li>
            <li><strong>Section 271B:</strong> Penalty for not getting audit done - 0.5% of turnover or ₹1,50,000 (whichever is lower)</li>
            <li><strong>Director liability:</strong> Directors may face personal consequences for company non-compliance</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            How to file a belated return under Section 139(4)
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            If you have missed the original due date (31 July or 31 October), you can still
            file a &quot;belated return&quot; under Section 139(4) of the Income Tax Act. The belated
            return can be filed until 31 December of the assessment year. For FY 2024-25
            (AY 2025-26), this means you can file until 31 December 2025. The process is:
          </p>
          <ol className="list-decimal list-inside text-muted-foreground space-y-2 mt-4">
            <li>Login to the Income Tax e-filing portal (incometax.gov.in)</li>
            <li>Go to e-File &gt; Income Tax Returns &gt; File Income Tax Return</li>
            <li>Select the Assessment Year and ITR form applicable to you</li>
            <li>Fill in all required details including income, deductions, and tax payments</li>
            <li>Pay any outstanding tax liability (including the late fee)</li>
            <li>Verify and submit the return using Aadhaar OTP, EVC, or DSC</li>
          </ol>
          <p className="text-muted-foreground leading-relaxed mt-4">
            Note that in a belated return, you cannot carry forward certain losses (business
            losses, speculation losses) to future years - this benefit is only available if
            you file on time. Need help filing?{' '}
            <Link href="/services/itr-filing" className="text-emerald-600 hover:underline">
              Ollvy can file your ITR - starting ₹999
            </Link>.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            ITR filing due dates for FY 2024-25
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            The ITR filing due dates for FY 2024-25 (Assessment Year 2025-26) are:
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-muted-foreground">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 pr-4">Category</th>
                  <th className="text-left py-2 pr-4">Audit Required?</th>
                  <th className="text-left py-2">Due Date</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-2 pr-4">Individual / HUF (non-audit)</td>
                  <td className="py-2 pr-4">No</td>
                  <td className="py-2">31 July 2025</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 pr-4">Individual / HUF (audit required)</td>
                  <td className="py-2 pr-4">Yes</td>
                  <td className="py-2">31 October 2025</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 pr-4">Partnership Firm (non-audit)</td>
                  <td className="py-2 pr-4">No</td>
                  <td className="py-2">31 July 2025</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 pr-4">Partnership Firm (audit required)</td>
                  <td className="py-2 pr-4">Yes</td>
                  <td className="py-2">31 October 2025</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 pr-4">LLP</td>
                  <td className="py-2 pr-4">Always Yes</td>
                  <td className="py-2">31 October 2025</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 pr-4">Company (Pvt Ltd / Public Ltd)</td>
                  <td className="py-2 pr-4">Always Yes</td>
                  <td className="py-2">31 October 2025</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4">Belated Return (all categories)</td>
                  <td className="py-2 pr-4">-</td>
                  <td className="py-2">31 December 2025</td>
                </tr>
              </tbody>
            </table>
          </div>
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
          <Link href="/tools/penalty-calculator/tds-late-filing" className="block">
            <Card className="p-4 rounded-none hover:border-emerald-500 transition-colors">
              <h3 className="font-semibold text-foreground">TDS Late Filing Calculator</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Calculate Section 234E and 271H penalties
              </p>
            </Card>
          </Link>
          <Link href="/tools/penalty-calculator/mca-annual-filing" className="block">
            <Card className="p-4 rounded-none hover:border-emerald-500 transition-colors">
              <h3 className="font-semibold text-foreground">MCA Annual Filing Calculator</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Calculate AOC-4 and MGT-7 late filing penalties
              </p>
            </Card>
          </Link>
        </div>
      </div>
    </>
  )
}

// Loading fallback for Suspense
function CalculatorSkeleton() {
  return (
    <div className="grid lg:grid-cols-[1.5fr,1fr] gap-8 animate-pulse">
      <div className="bg-muted rounded-lg h-[400px]" />
      <div className="bg-muted rounded-lg h-[350px]" />
    </div>
  )
}

export default function ITRLatePenaltyPage() {
  return (
    <Suspense fallback={<CalculatorSkeleton />}>
      <ITRLatePenaltyCalculator />
    </Suspense>
  )
}
