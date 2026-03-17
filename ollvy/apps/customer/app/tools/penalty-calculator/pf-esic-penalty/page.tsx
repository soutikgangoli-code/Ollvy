'use client'

import { useState, useMemo, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Calculator, SlidersHorizontal } from 'lucide-react'
import {
  EmployeeCountSlider,
  MonthsLateSlider,
  RupeeInput,
  ResultsPanel,
  WarningBanner,
  InfoBanner,
} from '@/components/penalty-calculator'

type DefaultType = 'pf_only' | 'esic_only' | 'both'

// PF Damage rates from Section 14B, EPF Act 1952
function getPFDamageRate(months: number): number {
  if (months < 2) return 0.05   // 5% p.a.
  if (months < 4) return 0.10   // 10% p.a.
  if (months < 6) return 0.15   // 15% p.a.
  return 0.25                    // 25% p.a.
}

function getPFDamageRateLabel(months: number): string {
  if (months < 2) return '5% p.a.'
  if (months < 4) return '10% p.a.'
  if (months < 6) return '15% p.a.'
  return '25% p.a.'
}

interface CalculationResult {
  monthlyPF: number
  monthlyESIC: number
  totalPFArrears: number
  totalESICArrears: number
  pfDamages: number
  esicInterest: number
  total: number
  pfDamageRate: number
  pfDamageRateLabel: string
}

function calculatePFESICPenalty(
  employeeCount: number,
  avgMonthlySalary: number,
  monthsLate: number,
  defaultType: DefaultType,
  monthlyPFOverride: number | null,
  monthlyESICOverride: number | null
): CalculationResult {
  // Auto-calculate monthly contributions
  // PF = 12% of basic salary (assuming basic = gross for simplicity)
  const autoMonthlyPF = Math.round(avgMonthlySalary * employeeCount * 0.12)
  // ESIC employer = 3.25% of gross salary (for employees earning ≤ ₹21,000/month)
  const autoMonthlyESIC = avgMonthlySalary <= 21000
    ? Math.round(avgMonthlySalary * employeeCount * 0.0325)
    : 0

  const monthlyPF = monthlyPFOverride ?? autoMonthlyPF
  const monthlyESIC = monthlyESICOverride ?? autoMonthlyESIC

  // Calculate arrears
  const totalPFArrears = monthlyPF * monthsLate
  const totalESICArrears = monthlyESIC * monthsLate

  // PF Damages — Section 14B
  // Formula: monthlyPF × damageRate × (months / 12)
  const pfDamageRate = getPFDamageRate(monthsLate)
  const pfDamages = defaultType !== 'esic_only'
    ? Math.round(monthlyPF * pfDamageRate * (monthsLate / 12))
    : 0

  // ESIC Interest — Section 85B, 12% p.a.
  const esicInterest = defaultType !== 'pf_only' && employeeCount >= 10
    ? Math.round(totalESICArrears * 0.12 * (monthsLate / 12))
    : 0

  return {
    monthlyPF,
    monthlyESIC,
    totalPFArrears: defaultType !== 'esic_only' ? totalPFArrears : 0,
    totalESICArrears: defaultType !== 'pf_only' && employeeCount >= 10 ? totalESICArrears : 0,
    pfDamages,
    esicInterest,
    total: pfDamages + esicInterest,
    pfDamageRate,
    pfDamageRateLabel: getPFDamageRateLabel(monthsLate),
  }
}

// FAQs
const faqs = [
  {
    question: 'What is the penalty for late PF payment in India?',
    answer: 'Late PF payment attracts damages under Section 14B of the EPF Act 1952. The damage rate ranges from 5% to 25% per annum depending on the period of default. Less than 2 months: 5%. 2-4 months: 10%. 4-6 months: 15%. 6+ months: 25%.',
  },
  {
    question: 'How are EPF Section 14B damages calculated?',
    answer: 'Section 14B damages are calculated as: Monthly PF Contribution × Damage Rate × (Months of Default / 12). The damage rate applicable to the total period applies to the entire arrear — it is not stepped.',
  },
  {
    question: 'What is the ESIC late payment penalty?',
    answer: 'ESIC late payment attracts interest under Section 85B of the ESI Act 1948 at 12% per annum on the amount of contribution in default. This is simple interest calculated from the due date to the date of payment.',
  },
  {
    question: 'When is PF registration mandatory?',
    answer: 'PF registration is mandatory for establishments with 20 or more employees. Below 20 employees, registration is voluntary. However, once registered (voluntarily or mandatorily), all compliance requirements apply.',
  },
  {
    question: 'When is ESIC registration mandatory?',
    answer: 'ESIC registration is mandatory for establishments with 10 or more employees. Additionally, ESIC only applies to employees earning up to ₹21,000 per month. Higher-earning employees are not covered under ESIC.',
  },
  {
    question: 'Can EPFO attach company property for PF default?',
    answer: 'Yes. Under Section 8B of the EPF Act, EPFO can attach and sell the property of the employer to recover dues. This includes both movable and immovable property. EPFO treats PF dues as first-charge on assets.',
  },
  {
    question: 'What is the criminal penalty for PF non-payment?',
    answer: 'Under Section 14 of the EPF Act, willful non-payment of PF can result in imprisonment up to 3 years and/or fine up to ₹10,000. For subsequent offences, imprisonment can extend to 5 years.',
  },
  {
    question: 'What are the current PF and ESIC contribution rates?',
    answer: 'PF: Employer contributes 12% of basic salary (3.67% to EPF, 8.33% to EPS). Employee also contributes 12%. ESIC: Employer contributes 3.25% of gross salary, employee contributes 0.75%.',
  },
]

function PFESICPenaltyCalculator() {
  const searchParams = useSearchParams()

  // Initialize from URL params
  const [employeeCount, setEmployeeCount] = useState(
    parseInt(searchParams.get('employees') || '25', 10)
  )
  const [avgMonthlySalary, setAvgMonthlySalary] = useState(
    parseInt(searchParams.get('salary') || '20000', 10)
  )
  const [monthsLate, setMonthsLate] = useState(
    parseInt(searchParams.get('months') || '3', 10)
  )
  const [defaultType, setDefaultType] = useState<DefaultType>(
    (searchParams.get('type') as DefaultType) || 'both'
  )
  const [monthlyPFOverride, setMonthlyPFOverride] = useState<number | null>(null)
  const [monthlyESICOverride, setMonthlyESICOverride] = useState<number | null>(null)
  const [showCauseNotice, setShowCauseNotice] = useState(
    searchParams.get('notice') === 'true'
  )

  // Calculate penalty
  const result = useMemo(() => {
    return calculatePFESICPenalty(
      employeeCount,
      avgMonthlySalary,
      monthsLate,
      defaultType,
      monthlyPFOverride,
      monthlyESICOverride
    )
  }, [employeeCount, avgMonthlySalary, monthsLate, defaultType, monthlyPFOverride, monthlyESICOverride])

  // Thresholds and warnings
  const isPFMandatory = employeeCount >= 20
  const isESICApplicable = employeeCount >= 10
  const isHighSalaryWarning = avgMonthlySalary > 21000 && isESICApplicable

  // Update URL params
  useEffect(() => {
    const params = new URLSearchParams()
    params.set('employees', employeeCount.toString())
    params.set('salary', avgMonthlySalary.toString())
    params.set('months', monthsLate.toString())
    params.set('type', defaultType)
    params.set('notice', showCauseNotice.toString())

    const newUrl = `${window.location.pathname}?${params.toString()}`
    window.history.replaceState(null, '', newUrl)
  }, [employeeCount, avgMonthlySalary, monthsLate, defaultType, showCauseNotice])

  // Breakdown for ResultsPanel
  const breakdown = useMemo(() => {
    const items = []

    if (result.pfDamages > 0) {
      items.push({
        label: 'PF Damages (Section 14B)',
        amount: result.pfDamages,
        subItems: [
          { label: `Monthly PF: ₹${result.monthlyPF.toLocaleString('en-IN')}`, amount: 0 },
          { label: `Rate: ${result.pfDamageRateLabel} for ${monthsLate} month${monthsLate > 1 ? 's' : ''}`, amount: result.pfDamages },
        ],
        statuteShort: 'Sec 14B',
        statuteFull: 'Section 14B of Employees\' Provident Funds and Miscellaneous Provisions Act, 1952 — Damages for non-payment of contribution',
      })
    }

    if (result.esicInterest > 0) {
      items.push({
        label: 'ESIC Interest (Section 85B)',
        amount: result.esicInterest,
        subItems: [
          { label: `Monthly ESIC: ₹${result.monthlyESIC.toLocaleString('en-IN')}`, amount: 0 },
          { label: `12% p.a. for ${monthsLate} month${monthsLate > 1 ? 's' : ''}`, amount: result.esicInterest },
        ],
        statuteShort: 'Sec 85B',
        statuteFull: 'Section 85B of Employees\' State Insurance Act, 1948 — Interest on amounts due',
      })
    }

    return items
  }, [result, monthsLate])

  return (
    <>
      {/* JSON-LD Schema - FAQPage */}
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

      {/* JSON-LD Schema - HowTo */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'HowTo',
            name: 'How to calculate PF and ESIC late payment penalty',
            step: [
              { '@type': 'HowToStep', name: 'Enter employee count', text: 'Specify the number of employees in your establishment' },
              { '@type': 'HowToStep', name: 'Enter average salary', text: 'Enter the average monthly salary per employee' },
              { '@type': 'HowToStep', name: 'Enter months late', text: 'Specify how many months the payment is overdue' },
              { '@type': 'HowToStep', name: 'Select default type', text: 'Choose PF only, ESIC only, or both' },
              { '@type': 'HowToStep', name: 'View penalty', text: 'See total penalty with PF damages and ESIC interest breakdown' },
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
              { '@type': 'ListItem', position: 4, name: 'PF ESIC Penalty', item: 'https://ollvy.com/tools/penalty-calculator/pf-esic-penalty' },
            ],
          }),
        }}
      />

      <div className="grid lg:grid-cols-[1.5fr,1fr] gap-8">
        {/* Input Section */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <Calculator className="h-5 w-5 text-emerald-600" />
            PF / ESIC Late Payment Penalty Calculator
          </h2>

          <div className="space-y-6">
            {/* Number of Employees */}
            <EmployeeCountSlider
              value={employeeCount}
              onChange={setEmployeeCount}
              label="Number of Employees"
            />

            {/* PF Voluntary Registration Info */}
            {!isPFMandatory && (
              <InfoBanner
                title="Voluntary PF Registration"
                body="PF registration is mandatory for establishments with 20 or more employees. Below 20, registration is voluntary. If you have voluntarily registered, penalties apply from your registration date."
              />
            )}

            {/* ESIC Not Applicable Info */}
            {!isESICApplicable && (
              <InfoBanner
                title="ESIC Not Applicable"
                body="ESIC applies to establishments with 10 or more employees. With fewer than 10 employees, ESIC registration is not required."
              />
            )}

            {/* Average Monthly Salary */}
            <RupeeInput
              value={avgMonthlySalary}
              onChange={setAvgMonthlySalary}
              label="Average Monthly Salary (₹)"
              helpText="Gross salary per employee"
            />

            {/* High Salary Warning for ESIC */}
            {isHighSalaryWarning && (
              <InfoBanner
                title="ESIC Salary Limit"
                body="ESIC only applies to employees earning up to ₹21,000 per month. If average salary exceeds this, ESIC may not be applicable for all employees."
              />
            )}

            {/* Months of Default */}
            <MonthsLateSlider
              value={monthsLate}
              onChange={setMonthsLate}
              label="Months of Default"
            />

            {/* Type of Default */}
            <div className="space-y-3">
              <Label>Type of Default</Label>
              <RadioGroup
                value={defaultType}
                onValueChange={(v) => setDefaultType(v as DefaultType)}
                className="space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="both" id="both" />
                  <Label htmlFor="both" className="font-normal cursor-pointer">
                    Both PF and ESIC
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="pf_only" id="pf_only" />
                  <Label htmlFor="pf_only" className="font-normal cursor-pointer">
                    PF only
                  </Label>
                </div>
                {isESICApplicable && (
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="esic_only" id="esic_only" />
                    <Label htmlFor="esic_only" className="font-normal cursor-pointer">
                      ESIC only
                    </Label>
                  </div>
                )}
              </RadioGroup>
            </div>

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
                  {/* Monthly PF Override */}
                  <RupeeInput
                    value={monthlyPFOverride ?? result.monthlyPF}
                    onChange={(v) => setMonthlyPFOverride(v)}
                    label="Monthly PF Contribution (₹)"
                    helpText={`Auto-calculated: ₹${result.monthlyPF.toLocaleString('en-IN')} (12% of salary × employees)`}
                  />

                  {/* Monthly ESIC Override */}
                  {isESICApplicable && (
                    <RupeeInput
                      value={monthlyESICOverride ?? result.monthlyESIC}
                      onChange={(v) => setMonthlyESICOverride(v)}
                      label="Monthly ESIC Contribution (₹)"
                      helpText={`Auto-calculated: ₹${result.monthlyESIC.toLocaleString('en-IN')} (3.25% of salary × employees)`}
                    />
                  )}

                  {/* Show Cause Notice */}
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Was a Show-Cause Notice Issued?</Label>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Indicates advanced stage of proceedings
                      </p>
                    </div>
                    <Switch checked={showCauseNotice} onCheckedChange={setShowCauseNotice} />
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </Card>

        {/* Results Section */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <ResultsPanel
            total={result.total}
            breakdown={breakdown}
            dueDate="15th of the following month"
            statute="EPF Act 1952, ESI Act 1948"
            ctaText="Get PF/ESIC Compliance Help"
            ctaHref="/services/payroll-compliance"
            showCta={result.total > 0}
          >
            {/* Arrears Summary */}
            {(result.totalPFArrears > 0 || result.totalESICArrears > 0) && (
              <InfoBanner
                title="Total Arrears (Principal)"
                body={`PF Arrears: ₹${result.totalPFArrears.toLocaleString('en-IN')} | ESIC Arrears: ₹${result.totalESICArrears.toLocaleString('en-IN')}. These amounts are payable in addition to the penalty shown above.`}
              />
            )}

            {/* Warning: 6+ months - Maximum rate */}
            {monthsLate >= 6 && defaultType !== 'esic_only' && (
              <WarningBanner
                variant="red"
                title="Maximum Damage Rate Applied"
                body="At 6+ months default, PF damages are levied at 25% per annum — the maximum rate. EPFO can also attach employer property and initiate prosecution under Section 14."
              />
            )}

            {/* Warning: 12+ months - Criminal prosecution */}
            {monthsLate > 12 && (
              <WarningBanner
                variant="red"
                title="Criminal Prosecution Risk"
                body="EPFO can file criminal complaint under Section 14 of EPF Act. Penalty can include imprisonment up to 3 years and fine up to ₹10,000."
              />
            )}

            {/* Show Cause Notice Warning */}
            {showCauseNotice && (
              <WarningBanner
                variant="yellow"
                title="Show-Cause Notice Issued"
                body="A show-cause notice indicates EPFO/ESIC has initiated formal proceedings. Respond within the deadline and pay dues immediately to avoid prosecution."
              />
            )}
          </ResultsPanel>
        </div>
      </div>

      {/* SEO Content - H2 Sections */}
      <div className="mt-16 max-w-3xl space-y-12">
        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            What is the penalty for late PF payment in India?
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Late PF (Provident Fund) payment attracts damages under Section 14B of the
            Employees&apos; Provident Funds and Miscellaneous Provisions Act, 1952. The damage
            rate is determined by the period of default and ranges from 5% to 25% per annum.
            For defaults less than 2 months, the rate is 5% p.a. For 2-4 months, it&apos;s 10% p.a.
            For 4-6 months, it&apos;s 15% p.a. And for defaults of 6 months or more, the maximum
            rate of 25% p.a. applies. Importantly, the rate applicable to the total period
            applies to the entire arrear — it is not calculated on a stepped basis.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            EPF Section 14B damages — rate table explained
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Section 14B of the EPF Act empowers the Central Provident Fund Commissioner to
            recover damages from employers who default on PF contributions. The rates are:
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-muted-foreground">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 pr-4">Period of Default</th>
                  <th className="text-left py-2 pr-4">Damage Rate</th>
                  <th className="text-left py-2">Example (₹1 Lakh monthly PF)</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-2 pr-4">Less than 2 months</td>
                  <td className="py-2 pr-4">5% per annum</td>
                  <td className="py-2">₹833 for 1 month</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 pr-4">2 to 4 months</td>
                  <td className="py-2 pr-4">10% per annum</td>
                  <td className="py-2">₹2,500 for 3 months</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 pr-4">4 to 6 months</td>
                  <td className="py-2 pr-4">15% per annum</td>
                  <td className="py-2">₹6,250 for 5 months</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4">6 months or more</td>
                  <td className="py-2 pr-4">25% per annum</td>
                  <td className="py-2">₹14,583 for 7 months</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            ESIC late payment interest — Section 85B
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Under Section 85B of the Employees&apos; State Insurance Act, 1948, employers who
            fail to pay ESIC contributions on time are liable to pay simple interest at
            12% per annum on the amount in default. This interest is calculated from the
            due date (15th of the following month) until the date of actual payment.
            Unlike PF damages which have a stepped rate structure, ESIC interest is a
            flat 12% regardless of the period of default. ESIC applies to establishments
            with 10 or more employees, and covers employees earning up to ₹21,000 per month.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            Can EPFO attach my company property for PF default?
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Yes. Under Section 8B of the EPF Act, EPFO has the power to attach and sell
            the property of an employer to recover PF dues. This includes both movable
            and immovable property. PF dues are treated as a first charge on the assets
            of the employer, meaning they take priority over other debts. EPFO can also
            issue arrest warrants for employers who willfully default. Additionally,
            under Section 14, willful non-payment can result in criminal prosecution
            with imprisonment up to 3 years and/or fine up to ₹10,000.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            PF and ESIC contribution rates for 2024-25
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            The current contribution rates for PF and ESIC are:
          </p>
          <ul className="list-disc list-inside text-muted-foreground space-y-2">
            <li>
              <strong>PF (Employer):</strong> 12% of basic salary — split as 3.67% to EPF
              and 8.33% to Employee Pension Scheme (EPS)
            </li>
            <li>
              <strong>PF (Employee):</strong> 12% of basic salary — entirely to EPF
            </li>
            <li>
              <strong>ESIC (Employer):</strong> 3.25% of gross salary
            </li>
            <li>
              <strong>ESIC (Employee):</strong> 0.75% of gross salary
            </li>
          </ul>
          <p className="text-muted-foreground leading-relaxed mt-4">
            PF contributions are calculated on basic salary (capped at ₹15,000 for EPS).
            ESIC contributions are calculated on gross salary for employees earning up
            to ₹21,000 per month. Need help with payroll compliance?{' '}
            <Link href="/services/payroll-compliance" className="text-emerald-600 hover:underline">
              Ollvy can manage your PF/ESIC compliance
            </Link>.
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
          <Link href="/tools/penalty-calculator/professional-tax-penalty" className="block">
            <Card className="p-4 hover:border-emerald-500 transition-colors">
              <h3 className="font-semibold text-foreground">Professional Tax Calculator</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Calculate state-wise Professional Tax penalties
              </p>
            </Card>
          </Link>
          <Link href="/tools/penalty-calculator/tds-late-filing" className="block">
            <Card className="p-4 hover:border-emerald-500 transition-colors">
              <h3 className="font-semibold text-foreground">TDS Late Filing Calculator</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Calculate Section 234E and 271H penalties
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
      <div className="bg-muted rounded-lg h-[600px]" />
      <div className="bg-muted rounded-lg h-[450px]" />
    </div>
  )
}

export default function PFESICPenaltyPage() {
  return (
    <Suspense fallback={<CalculatorSkeleton />}>
      <PFESICPenaltyCalculator />
    </Suspense>
  )
}
