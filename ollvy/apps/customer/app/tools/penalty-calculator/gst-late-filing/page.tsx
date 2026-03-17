'use client'

import { Suspense, useState, useMemo, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
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

// Indian states and UTs
const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Delhi', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan',
  'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh',
  'Uttarakhand', 'West Bengal', 'Andaman and Nicobar Islands', 'Chandigarh',
  'Dadra and Nagar Haveli', 'Daman and Diu', 'Jammu and Kashmir', 'Ladakh',
  'Lakshadweep', 'Puducherry',
]

type ReturnType = 'GSTR-1' | 'GSTR-3B' | 'GSTR-9'
type FilingFrequency = 'monthly' | 'quarterly'

interface CalculationResult {
  lateFee: number
  lateFeeCGST: number
  lateFeeSGST: number
  interest: number
  total: number
  statute: string
  dailyRate: number
  maxCap: number
  capHit: boolean
  calculatedFee: number
}

function calculateGSTPenalty(
  returnType: ReturnType,
  isNilReturn: boolean,
  turnover: number, // in rupees
  daysLate: number,
  outstandingTax: number
): CalculationResult {
  let dailyRate: number
  let maxCap: number

  if (returnType === 'GSTR-9') {
    dailyRate = 200 // ₹100 CGST + ₹100 SGST
    maxCap = Math.floor(turnover * 0.0025) // 0.25% of turnover — NOT 0.5%
  } else {
    // GSTR-1 or GSTR-3B
    dailyRate = isNilReturn ? 20 : 50 // nil: ₹10+₹10, regular: ₹25+₹25
    maxCap = 5000
  }

  const calculatedFee = dailyRate * daysLate
  const lateFee = Math.min(calculatedFee, maxCap)
  const capHit = calculatedFee >= maxCap

  // Interest on outstanding tax: Section 50, 18% p.a.
  const interest = Math.round(outstandingTax * 0.18 * (daysLate / 365))

  return {
    lateFee,
    lateFeeCGST: Math.floor(lateFee / 2),
    lateFeeSGST: Math.ceil(lateFee / 2),
    interest,
    total: lateFee + interest,
    statute: returnType === 'GSTR-9'
      ? 'Section 47, CGST Act 2017 (Annual Return) + Section 50 (Interest)'
      : 'Section 47, CGST Act 2017 + Section 50 (Interest)',
    dailyRate,
    maxCap,
    capHit,
    calculatedFee,
  }
}

// Get due date based on return type
function getDueDate(returnType: ReturnType, frequency: FilingFrequency): string {
  switch (returnType) {
    case 'GSTR-1':
      return frequency === 'quarterly' ? '13th of the month following the quarter' : '11th of the following month'
    case 'GSTR-3B':
      return frequency === 'quarterly' ? '22nd/24th of the month following the quarter' : '20th of the following month'
    case 'GSTR-9':
      return '31st December of the following financial year'
    default:
      return ''
  }
}

// Format turnover for display
function formatTurnover(value: number): string {
  if (value >= 10000000) {
    const crores = value / 10000000
    return crores % 1 === 0 ? `₹${crores} Crore` : `₹${crores.toFixed(2)} Crore`
  }
  if (value >= 100000) {
    const lakhs = value / 100000
    return lakhs % 1 === 0 ? `₹${lakhs} Lakh` : `₹${lakhs.toFixed(2)} Lakh`
  }
  return `₹${value.toLocaleString('en-IN')}`
}

// FAQs from Section 14.1
const faqs = [
  {
    question: 'What is the GST late filing penalty for GSTR-3B?',
    answer: 'For a regular (non-nil) GSTR-3B, the late fee is ₹50 per day — ₹25 CGST and ₹25 SGST. The maximum is capped at ₹5,000 total (₹2,500 each). For a nil return, the fee is ₹20 per day (₹10 CGST + ₹10 SGST), also capped at ₹5,000.',
  },
  {
    question: 'What is the late fee for GSTR-1?',
    answer: 'GSTR-1 follows the same structure as GSTR-3B: ₹50 per day for regular returns and ₹20 per day for nil returns, maximum ₹5,000.',
  },
  {
    question: 'What is the GSTR-9 annual return late fee?',
    answer: 'GSTR-9 carries ₹200 per day (₹100 CGST + ₹100 SGST), capped at 0.25% of your annual turnover. For a ₹1 Crore business, the maximum is ₹25,000. This was reduced from 0.5% by Notification 07/2023-Central Tax.',
  },
  {
    question: 'Is there interest on late GST payment separately from the late fee?',
    answer: 'Yes. Section 50 of CGST Act charges interest at 18% per annum on outstanding GST tax liability from the original due date. This is separate from the late filing fee.',
  },
  {
    question: 'Can GST late fees be waived?',
    answer: 'The government has periodically announced amnesty schemes (such as the 2023 scheme). Routine waiver is not available — the late fee must be paid before the return can be filed.',
  },
  {
    question: 'What is the QRMP scheme?',
    answer: 'QRMP (Quarterly Return Monthly Payment) allows taxpayers with annual turnover up to ₹5 Crore to file GSTR-3B quarterly instead of monthly. Monthly PMT-06 challans must still be paid.',
  },
  {
    question: 'What happens if I never file a GST return?',
    answer: 'Continued non-filing attracts the maximum late fee (₹5,000 per return). GST registration can also be cancelled under Section 29 for sustained non-filing — typically 6 consecutive months for monthly filers.',
  },
  {
    question: 'How is GST interest on unpaid tax calculated?',
    answer: 'Interest = Tax Amount × 18% × (Days / 365). Example: ₹50,000 unpaid for 60 days = ₹50,000 × 0.18 × (60/365) = ₹1,479.',
  },
]

function GSTLatePenaltyCalculator() {
  const searchParams = useSearchParams()

  // Initialize from URL params
  const [returnType, setReturnType] = useState<ReturnType>(
    (searchParams.get('return') as ReturnType) || 'GSTR-3B'
  )
  const [isNilReturn, setIsNilReturn] = useState(
    searchParams.get('nil') === 'true'
  )
  const [turnover, setTurnover] = useState(
    parseInt(searchParams.get('turnover') || '10000000', 10) // Default ₹1 Crore
  )
  const [daysLate, setDaysLate] = useState(
    parseInt(searchParams.get('days') || '30', 10)
  )
  const [outstandingTax, setOutstandingTax] = useState(
    parseInt(searchParams.get('liability') || '0', 10)
  )
  const [filingFrequency, setFilingFrequency] = useState<FilingFrequency>(
    (searchParams.get('frequency') as FilingFrequency) || 'monthly'
  )
  const [state, setState] = useState(
    searchParams.get('state') || 'Delhi'
  )

  // Calculate penalty
  const result = useMemo(() => {
    return calculateGSTPenalty(returnType, isNilReturn, turnover, daysLate, outstandingTax)
  }, [returnType, isNilReturn, turnover, daysLate, outstandingTax])

  // QRMP eligibility
  const isQRMPEligible = turnover <= 50000000 && returnType === 'GSTR-3B' // ≤ ₹5 Crore

  // Update URL params
  useEffect(() => {
    const params = new URLSearchParams()
    params.set('return', returnType)
    params.set('nil', isNilReturn.toString())
    params.set('turnover', turnover.toString())
    params.set('days', daysLate.toString())
    params.set('liability', outstandingTax.toString())
    params.set('frequency', filingFrequency)
    params.set('state', state)

    const newUrl = `${window.location.pathname}?${params.toString()}`
    window.history.replaceState(null, '', newUrl)
  }, [returnType, isNilReturn, turnover, daysLate, outstandingTax, filingFrequency, state])

  // Breakdown for ResultsPanel
  const breakdown = useMemo(() => {
    const items = [
      {
        label: 'Late Filing Fee',
        amount: result.lateFee,
        subItems: [
          { label: 'CGST', amount: result.lateFeeCGST },
          { label: 'SGST', amount: result.lateFeeSGST },
        ],
        statuteShort: 'Sec 47',
        statuteFull: 'Section 47 of Central Goods and Services Tax Act, 2017 — Late fee for failure to furnish return',
      },
    ]

    if (result.interest > 0) {
      items.push({
        label: 'Interest on Outstanding Tax',
        amount: result.interest,
        subItems: [],
        statuteShort: 'Sec 50',
        statuteFull: 'Section 50 of CGST Act, 2017 — Interest on delayed payment of tax at 18% per annum',
      })
    }

    return items
  }, [result])

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
            name: 'How to calculate GST late filing penalty',
            step: [
              { '@type': 'HowToStep', name: 'Select return type', text: 'Choose GSTR-1, GSTR-3B, or GSTR-9' },
              { '@type': 'HowToStep', name: 'Indicate if nil return', text: 'Toggle if this is a nil return (no tax liability)' },
              { '@type': 'HowToStep', name: 'Enter annual turnover', text: 'Use the slider to set your annual turnover' },
              { '@type': 'HowToStep', name: 'Enter days late', text: 'Use the slider to set days past due date' },
              { '@type': 'HowToStep', name: 'View penalty', text: 'See total penalty with CGST/SGST breakdown' },
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
              { '@type': 'ListItem', position: 4, name: 'GST Late Filing', item: 'https://ollvy.com/tools/penalty-calculator/gst-late-filing' },
            ],
          }),
        }}
      />

      <div className="grid lg:grid-cols-[1.5fr,1fr] gap-8">
        {/* Input Section */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <Calculator className="h-5 w-5 text-emerald-600" />
            GST Late Filing Penalty Calculator
          </h2>

          <div className="space-y-6">
            {/* Return Type */}
            <div className="space-y-1.5">
              <Label>Return Type</Label>
              <Select value={returnType} onValueChange={(v) => setReturnType(v as ReturnType)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="GSTR-1">GSTR-1 (Sales)</SelectItem>
                  <SelectItem value="GSTR-3B">GSTR-3B (Summary)</SelectItem>
                  <SelectItem value="GSTR-9">GSTR-9 (Annual)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Is Nil Return */}
            {returnType !== 'GSTR-9' && (
              <div className="flex items-center justify-between">
                <div>
                  <Label>Is Nil Return?</Label>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Nil returns have lower penalty rates
                  </p>
                </div>
                <Switch checked={isNilReturn} onCheckedChange={setIsNilReturn} />
              </div>
            )}

            {/* Annual Turnover */}
            <div className="space-y-1">
              <TurnoverSlider
                value={turnover}
                onChange={setTurnover}
                label="Annual Turnover"
              />
              {isQRMPEligible && (
                <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                  Eligible for QRMP scheme
                </Badge>
              )}
            </div>

            {/* Days Late */}
            <div>
              <DaysLateSlider
                value={daysLate}
                onChange={setDaysLate}
                label="Days Late"
                maxDays={365}
              />
              <p className="text-xs text-muted-foreground mt-2">
                Due date: {getDueDate(returnType, filingFrequency)}
              </p>
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
                  {/* Outstanding Tax */}
                  <RupeeInput
                    value={outstandingTax}
                    onChange={setOutstandingTax}
                    label="Outstanding GST Liability"
                    helpText="Enter any unpaid GST for interest calculation"
                  />

                  {/* Filing Frequency (only for GSTR-3B) */}
                  {returnType === 'GSTR-3B' && (
                    <div className="space-y-1.5">
                      <Label>Filing Frequency</Label>
                      <Select value={filingFrequency} onValueChange={(v) => setFilingFrequency(v as FilingFrequency)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="monthly">Monthly</SelectItem>
                          <SelectItem value="quarterly">Quarterly (QRMP)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {/* State */}
                  <div className="space-y-1.5">
                    <Label>State of Registration</Label>
                    <Select value={state} onValueChange={setState}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {INDIAN_STATES.map((s) => (
                          <SelectItem key={s} value={s}>{s}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
            dueDate={getDueDate(returnType, filingFrequency)}
            statute={result.statute}
            ctaText="File GST Returns"
            ctaHref="/services/gst-return-filing"
            showCta={result.total > 0}
          >
            {/* QRMP Info Banner */}
            {isQRMPEligible && (
              <InfoBanner
                title="QRMP Scheme Eligible"
                body="With annual turnover up to ₹5 Crore, you may be eligible for the QRMP scheme. Under QRMP, GSTR-3B is filed quarterly (not monthly), but tax is paid monthly via PMT-06 challan. Late fees under QRMP apply per quarter."
              />
            )}

            {/* Warning: Days late > 30 */}
            {daysLate > 30 && (
              <WarningBanner
                variant="yellow"
                title="Late fees are increasing daily"
                body={`Every additional day adds ₹${result.dailyRate} to your liability.`}
              />
            )}

            {/* Info: Cap hit for GSTR-1/3B */}
            {result.capHit && returnType !== 'GSTR-9' && (
              <InfoBanner
                title="Maximum cap reached"
                body="Your late fee has reached the maximum cap of ₹5,000. Filing today or in 30 days results in the same late fee — but interest on unpaid tax under Section 50 continues to accrue daily."
              />
            )}

            {/* Info: Cap hit for GSTR-9 */}
            {result.capHit && returnType === 'GSTR-9' && (
              <InfoBanner
                title="Turnover-based cap applied"
                body={`Your GSTR-9 late fee is capped at 0.25% of your annual turnover (${formatTurnover(result.maxCap)}).`}
              />
            )}

            {/* Warning: Outstanding tax with days > 30 */}
            {outstandingTax > 0 && daysLate > 30 && (
              <WarningBanner
                variant="yellow"
                title="Interest accruing daily"
                body="Interest on unpaid GST accrues at 18% per annum under Section 50. Make payment immediately to stop interest from growing."
              />
            )}
          </ResultsPanel>
        </div>
      </div>

      {/* SEO Content - H2 Sections */}
      <div className="mt-16 max-w-3xl space-y-12">
        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            What is the GST late filing penalty in India?
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            The GST late filing penalty in India is governed by Section 47 of the CGST Act 2017.
            When a registered person fails to furnish their GST return by the due date, they are
            liable to pay a late fee. The late fee structure varies based on the type of return
            filed. For GSTR-1 and GSTR-3B, the late fee is ₹50 per day of delay (₹25 CGST + ₹25 SGST)
            for regular returns, and ₹20 per day (₹10 CGST + ₹10 SGST) for nil returns. The maximum
            late fee is capped at ₹5,000 per return. For GSTR-9 annual returns, the late fee is
            ₹200 per day, capped at 0.25% of the annual turnover.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            GST late fee for GSTR-1 and GSTR-3B — how is it calculated?
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            The calculation of GST late fees for GSTR-1 and GSTR-3B is straightforward. For every
            day of delay beyond the due date, a fixed late fee accrues. The rate depends on whether
            it&apos;s a regular return (with tax liability) or a nil return (no tax liability).
          </p>
          <ul className="list-disc list-inside text-muted-foreground space-y-2">
            <li><strong>Regular returns:</strong> ₹50 per day (₹25 CGST + ₹25 SGST)</li>
            <li><strong>Nil returns:</strong> ₹20 per day (₹10 CGST + ₹10 SGST)</li>
            <li><strong>Maximum cap:</strong> ₹5,000 per return for both types</li>
          </ul>
          <p className="text-muted-foreground leading-relaxed mt-4">
            Additionally, if there is any outstanding tax liability, interest at 18% per annum
            is charged under Section 50 of the CGST Act from the due date until the date of payment.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            GSTR-9 annual return penalty — 2024-25 rates
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            The GSTR-9 annual return carries a higher per-day late fee but also has a turnover-based
            cap. As per Notification 07/2023-Central Tax dated 31 March 2023, the maximum late fee
            for GSTR-9 is capped at 0.25% of annual turnover. The per-day rate is ₹200 (₹100 CGST +
            ₹100 SGST). This means for a business with ₹1 Crore turnover, the maximum late fee
            would be ₹25,000 regardless of how many days late the return is filed. For smaller
            businesses, this cap provides significant relief compared to the previous 0.5% cap.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            Can GST late fees be waived?
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Routine waiver of GST late fees is not available under the current tax framework.
            The late fee must be paid along with the return before it can be filed on the GST
            portal. However, the government has periodically announced amnesty schemes that
            provide relief to taxpayers with pending returns. The 2023 amnesty scheme, for
            example, waived late fees for returns filed between April 2021 and June 2023 for
            certain categories of taxpayers. Such schemes are announced through notifications
            and circulars, and businesses should watch for such opportunities to clear pending
            returns at reduced costs.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            How to avoid GST late fees going forward
          </h2>

          <h3 className="text-lg font-medium text-foreground mt-6 mb-3">
            Set up monthly reminders for GST due dates
          </h3>
          <p className="text-muted-foreground leading-relaxed">
            Mark the 11th (GSTR-1) and 20th (GSTR-3B) of each month in your calendar with reminders
            set 3-5 days before the due date. This gives you sufficient time to compile data and
            file returns without last-minute rush.
          </p>

          <h3 className="text-lg font-medium text-foreground mt-6 mb-3">
            Switch to QRMP scheme if eligible
          </h3>
          <p className="text-muted-foreground leading-relaxed">
            If your annual turnover is up to ₹5 Crore, consider opting for the QRMP (Quarterly
            Return Monthly Payment) scheme. Under QRMP, you file GSTR-3B quarterly instead of
            monthly, reducing the compliance burden. However, you must still pay tax monthly
            through the PMT-06 challan.
          </p>

          <h3 className="text-lg font-medium text-foreground mt-6 mb-3">
            Use Ollvy for managed GST filing
          </h3>
          <p className="text-muted-foreground leading-relaxed">
            Outsource your GST compliance to professionals who track deadlines, compile data,
            and file returns on your behalf. This eliminates the risk of missed deadlines and
            ensures accurate filing every month.{' '}
            <Link href="/services/gst-return-filing" className="text-emerald-600 hover:underline">
              Learn more about Ollvy&apos;s GST filing service
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
          <Link href="/tools/penalty-calculator/itr-late-filing" className="block">
            <Card className="p-4 hover:border-emerald-500 transition-colors">
              <h3 className="font-semibold text-foreground">ITR Late Filing Calculator</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Calculate Section 234F, 234A, and 234B penalties
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
      <div className="bg-muted rounded-lg h-[600px]" />
      <div className="bg-muted rounded-lg h-[400px]" />
    </div>
  )
}

export default function GSTLatePenaltyPage() {
  return (
    <Suspense fallback={<CalculatorSkeleton />}>
      <GSTLatePenaltyCalculator />
    </Suspense>
  )
}
