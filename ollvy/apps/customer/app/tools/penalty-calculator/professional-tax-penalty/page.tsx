'use client'

import { useState, useMemo, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
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
import { Calculator, SlidersHorizontal, AlertTriangle } from 'lucide-react'
import {
  EmployeeCountSlider,
  MonthsLateSlider,
  RupeeInput,
  ResultsPanel,
  WarningBanner,
  InfoBanner,
} from '@/components/penalty-calculator'

// PT-applicable states with rates
interface PTStateInfo {
  name: string
  maxAnnualPT: number
  penaltyType: 'percent_per_month' | 'flat_percent' | 'percent_plus_interest'
  penaltyRate: number
  interestRate?: number
  penaltyDescription: string
}

const PT_STATES: Record<string, PTStateInfo> = {
  'Maharashtra': {
    name: 'Maharashtra',
    maxAnnualPT: 2500,
    penaltyType: 'percent_per_month',
    penaltyRate: 0.10,
    penaltyDescription: '10% of tax due per month',
  },
  'Karnataka': {
    name: 'Karnataka',
    maxAnnualPT: 2400,
    penaltyType: 'percent_per_month',
    penaltyRate: 0.02,
    penaltyDescription: '2% per month',
  },
  'West Bengal': {
    name: 'West Bengal',
    maxAnnualPT: 2500,
    penaltyType: 'flat_percent',
    penaltyRate: 0.25,
    penaltyDescription: '25% of tax due (flat)',
  },
  'Andhra Pradesh': {
    name: 'Andhra Pradesh',
    maxAnnualPT: 2400,
    penaltyType: 'flat_percent',
    penaltyRate: 0.25,
    penaltyDescription: '25% of tax due (flat)',
  },
  'Telangana': {
    name: 'Telangana',
    maxAnnualPT: 2400,
    penaltyType: 'flat_percent',
    penaltyRate: 0.25,
    penaltyDescription: '25% of tax due (flat)',
  },
  'Tamil Nadu': {
    name: 'Tamil Nadu',
    maxAnnualPT: 2400,
    penaltyType: 'percent_plus_interest',
    penaltyRate: 0.10,
    interestRate: 0.02,
    penaltyDescription: '10% penalty + 2% per month interest',
  },
  'Gujarat': {
    name: 'Gujarat',
    maxAnnualPT: 2500,
    penaltyType: 'percent_per_month',
    penaltyRate: 0.02,
    penaltyDescription: '2% per month',
  },
  'Assam': {
    name: 'Assam',
    maxAnnualPT: 2500,
    penaltyType: 'percent_per_month',
    penaltyRate: 0.02,
    penaltyDescription: '2% per month',
  },
  'Kerala': {
    name: 'Kerala',
    maxAnnualPT: 2400,
    penaltyType: 'percent_per_month',
    penaltyRate: 0.01,
    penaltyDescription: '12% per annum (1% per month)',
  },
  'Odisha': {
    name: 'Odisha',
    maxAnnualPT: 2400,
    penaltyType: 'percent_per_month',
    penaltyRate: 0.02,
    penaltyDescription: '2% per month',
  },
}

// Non-PT states
const NON_PT_STATES = [
  'Delhi', 'Uttar Pradesh', 'Rajasthan', 'Haryana', 'Punjab', 'Himachal Pradesh',
  'Uttarakhand', 'Jammu and Kashmir', 'Ladakh', 'Chandigarh', 'Goa', 'Bihar',
  'Jharkhand', 'Chhattisgarh', 'Madhya Pradesh', 'Arunachal Pradesh', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Sikkim', 'Tripura', 'Andaman and Nicobar Islands',
  'Dadra and Nagar Haveli', 'Daman and Diu', 'Lakshadweep', 'Puducherry',
]

// All states for dropdown
const ALL_STATES = [
  ...Object.keys(PT_STATES),
  ...NON_PT_STATES,
].sort()

interface CalculationResult {
  monthlyPTDue: number
  totalPTDue: number
  penalty: number
  interest: number
  total: number
  penaltyDescription: string
}

function calculatePTPenalty(
  state: string,
  employeeCount: number,
  avgMonthlySalary: number,
  monthsLate: number,
  monthlyPTOverride: number | null
): CalculationResult | null {
  const stateInfo = PT_STATES[state]
  if (!stateInfo) return null

  // Auto-calculate monthly PT (simplified - assume max PT for each employee)
  // In reality, PT has slabs, but we use max for estimation
  const autoMonthlyPT = Math.round((stateInfo.maxAnnualPT / 12) * employeeCount)
  const monthlyPTDue = monthlyPTOverride ?? autoMonthlyPT
  const totalPTDue = monthlyPTDue * monthsLate

  let penalty = 0
  let interest = 0

  switch (stateInfo.penaltyType) {
    case 'percent_per_month':
      penalty = Math.round(totalPTDue * stateInfo.penaltyRate * monthsLate)
      break
    case 'flat_percent':
      penalty = Math.round(totalPTDue * stateInfo.penaltyRate)
      break
    case 'percent_plus_interest':
      penalty = Math.round(totalPTDue * stateInfo.penaltyRate)
      interest = Math.round(totalPTDue * (stateInfo.interestRate || 0) * monthsLate)
      break
  }

  return {
    monthlyPTDue,
    totalPTDue,
    penalty,
    interest,
    total: penalty + interest,
    penaltyDescription: stateInfo.penaltyDescription,
  }
}

// FAQs
const faqs = [
  {
    question: 'What is Professional Tax (PT) in India?',
    answer: 'Professional Tax is a state-level tax levied on salaried employees, professionals, and traders. It is deducted by employers from employee salaries and remitted to the state government. The maximum PT is capped at ₹2,500 per year as per Article 276 of the Constitution.',
  },
  {
    question: 'Which states levy Professional Tax in India?',
    answer: 'PT is levied by: Maharashtra, Karnataka, West Bengal, Andhra Pradesh, Telangana, Tamil Nadu, Gujarat, Assam, Kerala, Odisha, Meghalaya, Tripura, and Sikkim. States like Delhi, Uttar Pradesh, Rajasthan, Haryana do not levy PT.',
  },
  {
    question: 'What is the penalty for late PT payment in Maharashtra?',
    answer: 'In Maharashtra, the penalty for late PT payment is 10% of the tax due per month of delay. For example, if PT due is ₹10,000 and it is 3 months late, penalty would be ₹10,000 × 10% × 3 = ₹3,000.',
  },
  {
    question: 'How is PT different from Income Tax?',
    answer: 'PT is a state tax with a maximum cap of ₹2,500/year, deducted by employers. Income Tax is a central tax with progressive rates up to 30%, filed by individuals. PT paid is deductible while computing taxable income for Income Tax.',
  },
  {
    question: 'Who is liable to pay Professional Tax?',
    answer: 'All salaried employees, self-employed professionals (doctors, lawyers, CAs, etc.), and traders earning above the threshold (varies by state, typically ₹10,000-15,000/month) are liable to pay PT.',
  },
  {
    question: 'How to register for Professional Tax as an employer?',
    answer: 'Employers must register on their state\'s PT portal within 30 days of becoming liable (i.e., hiring employees). Registration requires PAN, address proof, employee count, and salary details. A PT Enrollment Certificate (PTEC) is issued upon registration.',
  },
  {
    question: 'Can PT penalty be waived?',
    answer: 'Some states offer amnesty schemes periodically where penalties may be reduced or waived if arrears are paid. Outside such schemes, penalties must be paid in full. Check your state PT department for current schemes.',
  },
  {
    question: 'What happens if an employer does not deduct PT?',
    answer: 'Employers are liable for the PT amount even if not deducted from employees. Additionally, penalties apply for non-deduction. In some states, prosecution may be initiated for willful non-compliance.',
  },
]

function ProfessionalTaxCalculator() {
  const searchParams = useSearchParams()

  // Initialize from URL params
  const [state, setState] = useState(
    searchParams.get('state') || 'Maharashtra'
  )
  const [employeeCount, setEmployeeCount] = useState(
    parseInt(searchParams.get('employees') || '25', 10)
  )
  const [avgMonthlySalary, setAvgMonthlySalary] = useState(
    parseInt(searchParams.get('salary') || '30000', 10)
  )
  const [monthsLate, setMonthsLate] = useState(
    parseInt(searchParams.get('months') || '3', 10)
  )
  const [monthlyPTOverride, setMonthlyPTOverride] = useState<number | null>(null)

  // Check if state has PT
  const isPTState = state in PT_STATES
  const stateInfo = PT_STATES[state]

  // Calculate penalty
  const result = useMemo(() => {
    if (!isPTState) return null
    return calculatePTPenalty(state, employeeCount, avgMonthlySalary, monthsLate, monthlyPTOverride)
  }, [state, employeeCount, avgMonthlySalary, monthsLate, monthlyPTOverride, isPTState])

  // Update URL params
  useEffect(() => {
    const params = new URLSearchParams()
    params.set('state', state)
    params.set('employees', employeeCount.toString())
    params.set('salary', avgMonthlySalary.toString())
    params.set('months', monthsLate.toString())

    const newUrl = `${window.location.pathname}?${params.toString()}`
    window.history.replaceState(null, '', newUrl)
  }, [state, employeeCount, avgMonthlySalary, monthsLate])

  // Breakdown for ResultsPanel
  const breakdown = useMemo(() => {
    if (!result) return []

    const items = [
      {
        label: 'Penalty',
        amount: result.penalty,
        subItems: [
          { label: `PT Due: ₹${result.totalPTDue.toLocaleString('en-IN')}`, amount: 0 },
          { label: result.penaltyDescription, amount: result.penalty },
        ],
        statuteShort: `${state} PT Act`,
        statuteFull: `${state} Professional Tax Act — Penalty for delayed payment`,
      },
    ]

    if (result.interest > 0) {
      items.push({
        label: 'Interest',
        amount: result.interest,
        subItems: [
          { label: `2% per month × ${monthsLate} months`, amount: result.interest },
        ],
        statuteShort: `${state} PT Act`,
        statuteFull: `${state} Professional Tax Act — Interest on delayed payment`,
      })
    }

    return items
  }, [result, state, monthsLate])

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
            name: 'How to calculate Professional Tax penalty',
            step: [
              { '@type': 'HowToStep', name: 'Select state', text: 'Choose your state of registration' },
              { '@type': 'HowToStep', name: 'Enter employee count', text: 'Specify the number of employees' },
              { '@type': 'HowToStep', name: 'Enter months late', text: 'Specify how many months the payment is overdue' },
              { '@type': 'HowToStep', name: 'View penalty', text: 'See total penalty based on your state\'s PT rules' },
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
              { '@type': 'ListItem', position: 4, name: 'Professional Tax Penalty', item: 'https://ollvy.com/tools/penalty-calculator/professional-tax-penalty' },
            ],
          }),
        }}
      />

      <div className="grid lg:grid-cols-[1.5fr,1fr] gap-8">
        {/* Input Section */}
        <div className="rounded-xl border border-border/50 bg-zinc-950 p-6">
          <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <Calculator className="h-5 w-5 text-emerald-600" />
            Professional Tax Penalty Calculator
          </h2>

          <div className="space-y-6">
            {/* State Selector - FIRST INPUT */}
            <div className="space-y-1.5">
              <Label>State of Registration</Label>
              <Select value={state} onValueChange={setState}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ALL_STATES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s} {s in PT_STATES ? '' : '(No PT)'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {isPTState && stateInfo && (
                <p className="text-xs text-muted-foreground">
                  Max PT: ₹{stateInfo.maxAnnualPT}/year | Penalty: {stateInfo.penaltyDescription}
                </p>
              )}
            </div>

            {/* Non-PT State Message */}
            {!isPTState && (
              <div className="p-6 rounded-lg bg-amber-50 border border-amber-200 text-amber-900">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">Professional Tax is not levied in {state}</p>
                    <p className="text-sm mt-1">
                      This calculator does not apply. Professional Tax is a state-level tax and
                      {state} does not levy PT. Only certain states like Maharashtra, Karnataka,
                      West Bengal, Tamil Nadu, etc. levy Professional Tax.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Other inputs - only show if PT state */}
            {isPTState && (
              <>
                {/* Number of Employees */}
                <EmployeeCountSlider
                  value={employeeCount}
                  onChange={setEmployeeCount}
                  label="Number of Employees"
                />

                {/* Average Monthly Salary */}
                <RupeeInput
                  value={avgMonthlySalary}
                  onChange={setAvgMonthlySalary}
                  label="Average Monthly Salary (₹)"
                  helpText="Used to estimate PT liability"
                />

                {/* Months Late */}
                <MonthsLateSlider
                  value={monthsLate}
                  onChange={setMonthsLate}
                  label="Months of Default"
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
                      {/* Monthly PT Override */}
                      <RupeeInput
                        value={monthlyPTOverride ?? (result?.monthlyPTDue || 0)}
                        onChange={(v) => setMonthlyPTOverride(v)}
                        label="Monthly PT Due (₹)"
                        helpText={`Auto-calculated based on max PT of ₹${stateInfo?.maxAnnualPT}/year`}
                      />
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </>
            )}
          </div>
        </div>

        {/* Results Section */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          {isPTState && result ? (
            <ResultsPanel
              total={result.total}
              breakdown={breakdown}
              dueDate="Varies by state (typically monthly or quarterly)"
              statute={`${state} Professional Tax Act`}
              ctaText="Get PT Compliance Help"
              ctaHref="/services/payroll-compliance"
              showCta={result.total > 0}
            >
              {/* PT Due Info */}
              <InfoBanner
                title="Total PT Due (Principal)"
                body={`₹${result.totalPTDue.toLocaleString('en-IN')} for ${monthsLate} month${monthsLate > 1 ? 's' : ''}. This is payable in addition to the penalty shown above.`}
              />

              {/* Warning for high penalty */}
              {monthsLate > 6 && (
                <WarningBanner
                  variant="yellow"
                  title="Extended Default Period"
                  body="Prolonged non-payment may attract additional scrutiny from the PT department. Some states may initiate prosecution for willful non-compliance."
                />
              )}
            </ResultsPanel>
          ) : (
            <Card className="p-6">
              <p className="text-muted-foreground text-center">
                Select a PT-applicable state to calculate penalty
              </p>
            </Card>
          )}
        </div>
      </div>

      {/* SEO Content - H2 Sections */}
      <div className="mt-16 max-w-3xl space-y-12">
        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            What is Professional Tax (PT) in India?
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Professional Tax is a state-level tax levied on individuals earning income from
            employment, profession, or trade. It is collected by employers from employee
            salaries and remitted to the state government. Under Article 276 of the Indian
            Constitution, the maximum Professional Tax that can be levied is capped at
            ₹2,500 per person per year. Not all states levy PT — it is primarily collected
            in Maharashtra, Karnataka, West Bengal, Andhra Pradesh, Telangana, Tamil Nadu,
            Gujarat, and a few other states.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            Which states levy Professional Tax?
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Professional Tax is levied by the following states and union territories:
          </p>
          <ul className="list-disc list-inside text-muted-foreground space-y-1">
            <li><strong>Maharashtra:</strong> Max ₹2,500/year, 10% penalty per month</li>
            <li><strong>Karnataka:</strong> Max ₹2,400/year, 2% penalty per month</li>
            <li><strong>West Bengal:</strong> Max ₹2,500/year, 25% flat penalty</li>
            <li><strong>Tamil Nadu:</strong> Max ₹2,400/year, 10% + 2%/month interest</li>
            <li><strong>Andhra Pradesh & Telangana:</strong> Max ₹2,400/year, 25% flat penalty</li>
            <li><strong>Gujarat:</strong> Max ₹2,500/year, 2% penalty per month</li>
            <li><strong>Kerala:</strong> Max ₹2,400/year, 12% per annum</li>
          </ul>
          <p className="text-muted-foreground leading-relaxed mt-4">
            States like Delhi, Uttar Pradesh, Rajasthan, Haryana, and Punjab do not levy
            Professional Tax.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            Professional Tax slab rates for employees — state-wise
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            PT slabs vary by state. Here&apos;s a simplified overview of monthly PT for
            employees in major PT states:
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-muted-foreground">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 pr-4">Monthly Salary</th>
                  <th className="text-left py-2 pr-4">Maharashtra</th>
                  <th className="text-left py-2 pr-4">Karnataka</th>
                  <th className="text-left py-2">West Bengal</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-2 pr-4">Up to ₹10,000</td>
                  <td className="py-2 pr-4">Nil</td>
                  <td className="py-2 pr-4">Nil</td>
                  <td className="py-2">Nil</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 pr-4">₹10,001 - ₹15,000</td>
                  <td className="py-2 pr-4">₹175</td>
                  <td className="py-2 pr-4">₹150</td>
                  <td className="py-2">₹110</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 pr-4">₹15,001 - ₹25,000</td>
                  <td className="py-2 pr-4">₹200</td>
                  <td className="py-2 pr-4">₹200</td>
                  <td className="py-2">₹130</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4">Above ₹25,000</td>
                  <td className="py-2 pr-4">₹200 (₹300 in Feb)</td>
                  <td className="py-2 pr-4">₹200</td>
                  <td className="py-2">₹200</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            Penalty for non-payment of Professional Tax
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Penalties for late or non-payment of Professional Tax vary by state. Maharashtra
            charges the highest at 10% per month of delay. Most other states charge 2% per
            month. West Bengal, Andhra Pradesh, and Telangana charge a flat 25% penalty
            regardless of the delay period. Tamil Nadu charges a combination of 10% penalty
            plus 2% monthly interest. In all states, the principal tax amount must also be
            paid along with the penalty.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            How to register for Professional Tax as an employer
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Employers must register for PT within 30 days of becoming liable (hiring
            employees in a PT state). The registration process is:
          </p>
          <ol className="list-decimal list-inside text-muted-foreground space-y-2">
            <li>Visit your state&apos;s PT portal (e.g., mahagst.gov.in for Maharashtra)</li>
            <li>Apply for PT Enrollment Certificate (PTEC) as an employer</li>
            <li>Submit required documents: PAN, address proof, employee details</li>
            <li>Pay the registration fee (typically ₹2,500 for 5 years)</li>
            <li>Receive PTEC number for filing returns and making payments</li>
          </ol>
          <p className="text-muted-foreground leading-relaxed mt-4">
            After registration, you must file monthly/quarterly returns and pay PT by the
            due date. Need help with PT registration?{' '}
            <Link href="/services/payroll-compliance" className="text-emerald-600 hover:underline">
              Ollvy can handle your PT compliance
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
          <Link href="/tools/penalty-calculator/pf-esic-penalty" className="block">
            <Card className="p-4 rounded-none hover:border-emerald-500 transition-colors">
              <h3 className="font-semibold text-foreground">PF/ESIC Penalty Calculator</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Calculate EPF and ESIC late payment penalties
              </p>
            </Card>
          </Link>
          <Link href="/tools/penalty-calculator/tds-late-filing" className="block">
            <Card className="p-4 rounded-none hover:border-emerald-500 transition-colors">
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
      <div className="bg-muted rounded-lg h-[500px]" />
      <div className="bg-muted rounded-lg h-[400px]" />
    </div>
  )
}

export default function ProfessionalTaxPenaltyPage() {
  return (
    <Suspense fallback={<CalculatorSkeleton />}>
      <ProfessionalTaxCalculator />
    </Suspense>
  )
}
