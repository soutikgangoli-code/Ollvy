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
import { Calculator, SlidersHorizontal, CheckCircle2 } from 'lucide-react'
import {
  DaysLateSlider,
  RupeeInput,
  ResultsPanel,
  WarningBanner,
  InfoBanner,
} from '@/components/penalty-calculator'

type DefaultType = 'tax_not_paid' | 'short_paid' | 'wrong_itc' | 'excess_refund'
type NoticeStage = 'scn' | 'order_passed' | 'appeal_filed'

const DEFAULT_TYPE_LABELS: Record<DefaultType, string> = {
  tax_not_paid: 'Tax not paid',
  short_paid: 'Short-paid',
  wrong_itc: 'Wrong ITC availed',
  excess_refund: 'Excess refund claimed',
}

const NOTICE_STAGE_LABELS: Record<NoticeStage, string> = {
  scn: 'Show Cause Notice (SCN)',
  order_passed: 'Order passed',
  appeal_filed: 'Appeal filed',
}

interface ScenarioResult {
  label: string
  penalty: number
  penaltyRate: string
  interest: number
  total: number
  deadline: string
}

interface CalculationResult {
  demandAmount: number
  isFraud: boolean
  section: string
  interestRate: number
  scenarios: ScenarioResult[]
  currentPenalty: number
  currentInterest: number
  currentTotal: number
}

function calculateGSTDemandPenalty(
  demandAmount: number,
  isFraud: boolean,
  noticeStage: NoticeStage,
  daysSinceNotice: number
): CalculationResult {
  const interestRate = isFraud ? 0.24 : 0.18  // 24% for fraud, 18% for non-fraud
  const section = isFraud ? '74' : '73'

  // Calculate interest for all scenarios
  const calculateInterest = (days: number) => Math.round(demandAmount * interestRate * (days / 365))

  // Scenario penalties
  let scenarios: ScenarioResult[] = []

  if (isFraud) {
    // Section 74 — Fraud
    scenarios = [
      {
        label: 'Pay Within 30 Days of SCN',
        penalty: Math.round(demandAmount * 0.15),
        penaltyRate: '15%',
        interest: calculateInterest(30),
        total: demandAmount + Math.round(demandAmount * 0.15) + calculateInterest(30),
        deadline: '30 days from SCN date',
      },
      {
        label: 'Pay Before Order',
        penalty: Math.round(demandAmount * 0.25),
        penaltyRate: '25%',
        interest: calculateInterest(90),  // Assuming ~90 days
        total: demandAmount + Math.round(demandAmount * 0.25) + calculateInterest(90),
        deadline: 'Before order is passed',
      },
      {
        label: 'Pay After Order',
        penalty: demandAmount,  // 100% penalty
        penaltyRate: '100%',
        interest: calculateInterest(180),  // Assuming ~180 days
        total: demandAmount + demandAmount + calculateInterest(180),
        deadline: 'After order is passed',
      },
    ]
  } else {
    // Section 73 — Non-Fraud
    const minPenalty = 10000
    const penalty10Percent = Math.max(Math.round(demandAmount * 0.10), minPenalty)

    scenarios = [
      {
        label: 'Pay Within 30 Days of SCN',
        penalty: penalty10Percent,
        penaltyRate: '10% (min ₹10,000)',
        interest: calculateInterest(30),
        total: demandAmount + penalty10Percent + calculateInterest(30),
        deadline: '30 days from SCN date',
      },
      {
        label: 'Pay Before Order',
        penalty: penalty10Percent,
        penaltyRate: '10% (min ₹10,000)',
        interest: calculateInterest(90),
        total: demandAmount + penalty10Percent + calculateInterest(90),
        deadline: 'Before order is passed',
      },
      {
        label: 'Pay After Order',
        penalty: penalty10Percent,
        penaltyRate: '10% (min ₹10,000)',
        interest: calculateInterest(180),
        total: demandAmount + penalty10Percent + calculateInterest(180),
        deadline: 'After order is passed',
      },
    ]
  }

  // Determine current penalty based on stage
  let currentScenarioIndex = 0
  if (noticeStage === 'order_passed' || noticeStage === 'appeal_filed') {
    currentScenarioIndex = 2
  } else if (daysSinceNotice > 30) {
    currentScenarioIndex = 1
  }

  const currentInterest = calculateInterest(daysSinceNotice)

  return {
    demandAmount,
    isFraud,
    section,
    interestRate,
    scenarios,
    currentPenalty: scenarios[currentScenarioIndex].penalty,
    currentInterest,
    currentTotal: demandAmount + scenarios[currentScenarioIndex].penalty + currentInterest,
  }
}

// FAQs
const faqs = [
  {
    question: 'What is a GST demand notice under Section 73?',
    answer: 'Section 73 of CGST Act deals with cases where tax has not been paid or short-paid due to reasons other than fraud. The penalty is 10% of the tax demand (minimum ₹10,000), and interest is charged at 18% per annum.',
  },
  {
    question: 'What is Section 74 and when does it apply?',
    answer: 'Section 74 applies when tax has not been paid due to fraud, willful misstatement, or suppression of facts. Penalties are higher: 15% if paid within 30 days of SCN, 25% before order, or 100% after order. Interest is 24% per annum.',
  },
  {
    question: 'What is the penalty under Section 73 of CGST Act?',
    answer: 'Under Section 73, the penalty is 10% of the tax demand, subject to a minimum of ₹10,000. This rate applies whether you pay within 30 days of SCN, before order, or after order.',
  },
  {
    question: 'What is the penalty under Section 74 of CGST Act?',
    answer: 'Under Section 74: 15% if paid within 30 days of SCN, 25% if paid before order but after 30 days, and 100% (equal to full demand) if paid after order. This significantly increases the cost of delay.',
  },
  {
    question: 'What is the interest rate on GST demand?',
    answer: 'Interest under Section 50 is 18% per annum for regular cases (Section 73). For fraud cases (Section 74), interest is 24% per annum under Section 50(3). Interest runs from the due date to the date of payment.',
  },
  {
    question: 'Can Section 74 lead to criminal prosecution?',
    answer: 'Yes. Section 132 of CGST Act provides for prosecution in fraud cases. Tax evasion above ₹5 Crore is a cognizable and non-bailable offence. Offences can result in imprisonment up to 5 years.',
  },
  {
    question: 'What is a Show Cause Notice (SCN) in GST?',
    answer: 'An SCN is a notice issued by the GST officer asking the taxpayer to explain why the demand should not be confirmed. The taxpayer must respond within the specified time (usually 30 days) with their defence.',
  },
  {
    question: 'How to respond to a GST demand notice?',
    answer: 'Review the notice carefully, gather supporting documents, prepare a written reply addressing each allegation, and file the response on the GST portal before the deadline. Consider engaging a GST professional for complex cases.',
  },
]

function GSTDemandNoticeCalculator() {
  const searchParams = useSearchParams()

  // Initialize from URL params
  const [defaultType, setDefaultType] = useState<DefaultType>(
    (searchParams.get('type') as DefaultType) || 'tax_not_paid'
  )
  const [isFraud, setIsFraud] = useState(
    searchParams.get('fraud') === 'true'
  )
  const [demandAmount, setDemandAmount] = useState(
    parseInt(searchParams.get('amount') || '100000', 10)
  )
  const [noticeStage, setNoticeStage] = useState<NoticeStage>(
    (searchParams.get('stage') as NoticeStage) || 'scn'
  )
  const [daysSinceNotice, setDaysSinceNotice] = useState(
    parseInt(searchParams.get('days') || '30', 10)
  )

  // Calculate penalty
  const result = useMemo(() => {
    return calculateGSTDemandPenalty(demandAmount, isFraud, noticeStage, daysSinceNotice)
  }, [demandAmount, isFraud, noticeStage, daysSinceNotice])

  // Update URL params
  useEffect(() => {
    const params = new URLSearchParams()
    params.set('type', defaultType)
    params.set('fraud', isFraud.toString())
    params.set('amount', demandAmount.toString())
    params.set('stage', noticeStage)
    params.set('days', daysSinceNotice.toString())

    const newUrl = `${window.location.pathname}?${params.toString()}`
    window.history.replaceState(null, '', newUrl)
  }, [defaultType, isFraud, demandAmount, noticeStage, daysSinceNotice])

  // Breakdown for ResultsPanel
  const breakdown = useMemo(() => {
    return [
      {
        label: `Penalty (Section ${result.section})`,
        amount: result.currentPenalty,
        subItems: [
          { label: `Rate: ${result.scenarios[0].penaltyRate}`, amount: result.currentPenalty },
        ],
        statuteShort: `Sec ${result.section}`,
        statuteFull: `Section ${result.section} of CGST Act 2017 — ${isFraud ? 'Fraud/Willful misstatement' : 'Non-fraud cases'}`,
      },
      {
        label: `Interest (Section 50)`,
        amount: result.currentInterest,
        subItems: [
          { label: `${result.interestRate * 100}% p.a. for ${daysSinceNotice} days`, amount: result.currentInterest },
        ],
        statuteShort: 'Sec 50',
        statuteFull: `Section 50 of CGST Act 2017 — Interest on delayed payment at ${result.interestRate * 100}% p.a.`,
      },
    ]
  }, [result, daysSinceNotice, isFraud])

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
            name: 'How to calculate GST demand notice penalty',
            step: [
              { '@type': 'HowToStep', name: 'Select default type', text: 'Choose the type of default (tax not paid, short-paid, etc.)' },
              { '@type': 'HowToStep', name: 'Indicate fraud status', text: 'Toggle if this is a fraud case (Section 74) or not (Section 73)' },
              { '@type': 'HowToStep', name: 'Enter demand amount', text: 'Enter the tax demand amount as per the notice' },
              { '@type': 'HowToStep', name: 'Select notice stage', text: 'Choose the current stage (SCN, order passed, appeal)' },
              { '@type': 'HowToStep', name: 'View penalty scenarios', text: 'Compare penalties for different payment timelines' },
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
              { '@type': 'ListItem', position: 4, name: 'GST Demand Notice', item: 'https://ollvy.com/tools/penalty-calculator/gst-demand-notice' },
            ],
          }),
        }}
      />

      <div className="grid lg:grid-cols-[1.5fr,1fr] gap-8">
        {/* Input Section */}
        <div className="rounded-xl border border-border/50 bg-zinc-950 p-6">
          <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <Calculator className="h-5 w-5 text-emerald-600" />
            GST Demand Notice (Section 73/74) Calculator
          </h2>

          <div className="space-y-6">
            {/* Type of Default */}
            <div className="space-y-1.5">
              <Label>Type of Default</Label>
              <Select value={defaultType} onValueChange={(v) => setDefaultType(v as DefaultType)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(DEFAULT_TYPE_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Is Fraud */}
            <div className="flex items-center justify-between">
              <div>
                <Label>Is Fraud / Willful Misstatement?</Label>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Yes = Section 74 (higher penalties), No = Section 73
                </p>
              </div>
              <Switch checked={isFraud} onCheckedChange={setIsFraud} />
            </div>

            {/* Demand Amount */}
            <RupeeInput
              value={demandAmount}
              onChange={setDemandAmount}
              label="Demand Amount (₹)"
              helpText="Tax demand as per the notice"
            />

            {/* Notice Stage */}
            <div className="space-y-1.5">
              <Label>Stage of Notice</Label>
              <Select value={noticeStage} onValueChange={(v) => setNoticeStage(v as NoticeStage)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(NOTICE_STAGE_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
                  {/* Days Since Notice */}
                  <DaysLateSlider
                    value={daysSinceNotice}
                    onChange={setDaysSinceNotice}
                    label="Days Since Notice Date"
                    maxDays={365}
                  />
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            {/* Three Scenarios Comparison */}
            <div className="pt-4 border-t border-border">
              <h3 className="font-semibold text-foreground mb-4">
                Payment Scenarios — Section {result.section}
              </h3>
              <div className="grid gap-4">
                {result.scenarios.map((scenario, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border ${
                      index === 0
                        ? 'bg-zinc-900 border-emerald-500/30'
                        : 'bg-zinc-950 border-border/50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-medium text-foreground flex items-center gap-2">
                          {index === 0 && <CheckCircle2 className="h-4 w-4 text-emerald-400" />}
                          {scenario.label}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Deadline: {scenario.deadline}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-foreground">
                          ₹{scenario.total.toLocaleString('en-IN')}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Penalty: {scenario.penaltyRate}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 text-xs text-muted-foreground grid grid-cols-3 gap-2">
                      <span>Tax: ₹{demandAmount.toLocaleString('en-IN')}</span>
                      <span>Penalty: ₹{scenario.penalty.toLocaleString('en-IN')}</span>
                      <span>Interest: ₹{scenario.interest.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                ))}
              </div>
              {isFraud && (
                <p className="text-xs text-muted-foreground mt-4">
                  * Section 74 penalties escalate significantly. Paying early can save up to 85% in penalties.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <ResultsPanel
            total={result.currentTotal}
            breakdown={breakdown}
            dueDate={`${daysSinceNotice > 30 ? 'Overdue' : '30 days from SCN'}`}
            statute={`Section ${result.section}, CGST Act 2017`}
            ctaText="Get GST Notice Help"
            ctaHref="/services/gst-notice-response"
            showCta={result.currentTotal > 0}
          >
            {/* Tax Demand Principal */}
            <InfoBanner
              title="Tax Demand (Principal)"
              body={`₹${demandAmount.toLocaleString('en-IN')} is payable in addition to the penalty and interest shown above.`}
            />

            {/* Section 74 Fraud Warning */}
            {isFraud && (
              <WarningBanner
                variant="red"
                title="Section 74 — Prosecution Risk"
                body="Section 74 cases can result in prosecution under Section 132 of CGST Act. Tax evasion above ₹5 Crore is a cognizable and non-bailable offence. Imprisonment can extend to 5 years."
              />
            )}

            {/* Pay Early Tip */}
            {daysSinceNotice <= 30 && noticeStage === 'scn' && (
              <InfoBanner
                title="Pay Within 30 Days"
                body={isFraud
                  ? 'Paying within 30 days of SCN reduces penalty from 100% to just 15%. This is your best window to minimize liability.'
                  : 'Paying within 30 days minimizes interest accumulation. Penalty remains 10% regardless of timing.'}
              />
            )}

            {/* Overdue Warning */}
            {daysSinceNotice > 30 && noticeStage === 'scn' && (
              <WarningBanner
                variant="yellow"
                title="30-Day Window Expired"
                body={isFraud
                  ? 'The 15% penalty window has closed. Penalty is now 25% of demand. Pay before order to avoid 100% penalty.'
                  : 'Interest continues to accrue daily. Consider paying soon to limit total liability.'}
              />
            )}
          </ResultsPanel>
        </div>
      </div>

      {/* SEO Content - H2 Sections */}
      <div className="mt-16 max-w-3xl space-y-12">
        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            What is a GST demand notice under Section 73 and 74?
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            A GST demand notice is issued by the tax authorities when they determine that
            tax has not been paid, has been short-paid, wrong ITC has been availed, or
            excess refund has been claimed. Section 73 of the CGST Act applies to cases
            where the default is not due to fraud — the penalty is 10% of the tax demand.
            Section 74 applies to cases involving fraud, willful misstatement, or suppression
            of facts — penalties range from 15% to 100% depending on when payment is made.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            Section 73 vs Section 74 — key differences
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-muted-foreground">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 pr-4">Aspect</th>
                  <th className="text-left py-2 pr-4">Section 73 (Non-Fraud)</th>
                  <th className="text-left py-2">Section 74 (Fraud)</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-2 pr-4">Applies When</td>
                  <td className="py-2 pr-4">Honest mistakes, errors</td>
                  <td className="py-2">Fraud, suppression, willful misstatement</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 pr-4">Penalty (within 30 days)</td>
                  <td className="py-2 pr-4">10% (min ₹10,000)</td>
                  <td className="py-2">15%</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 pr-4">Penalty (before order)</td>
                  <td className="py-2 pr-4">10% (min ₹10,000)</td>
                  <td className="py-2">25%</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 pr-4">Penalty (after order)</td>
                  <td className="py-2 pr-4">10% (min ₹10,000)</td>
                  <td className="py-2">100%</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 pr-4">Interest Rate</td>
                  <td className="py-2 pr-4">18% p.a.</td>
                  <td className="py-2">24% p.a.</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4">Prosecution</td>
                  <td className="py-2 pr-4">Not applicable</td>
                  <td className="py-2">Possible under Section 132</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            How to respond to a GST Show Cause Notice (SCN)
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            When you receive a GST Show Cause Notice, follow these steps:
          </p>
          <ol className="list-decimal list-inside text-muted-foreground space-y-2">
            <li>Read the notice carefully and note the deadline for response</li>
            <li>Identify the exact allegations and the sections cited</li>
            <li>Gather all supporting documents (invoices, returns, payment challans)</li>
            <li>Prepare a detailed written reply addressing each point</li>
            <li>File the reply on the GST portal before the deadline</li>
            <li>Request a personal hearing if needed</li>
            <li>If liable, consider paying within 30 days to minimize penalty</li>
          </ol>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            Interest calculation on GST demand — Section 50
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Interest on GST demand is calculated under Section 50 of the CGST Act. For
            regular cases (Section 73), interest is 18% per annum. For fraud cases
            (Section 74), interest is higher at 24% per annum. Interest is calculated
            from the date the tax was due until the date of payment. The formula is:
            Interest = Demand Amount × Rate × (Days / 365). For example, a ₹1 Lakh demand
            for 90 days at 18% = ₹1,00,000 × 0.18 × (90/365) = ₹4,438.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            Can Section 74 lead to arrest and imprisonment?
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Yes. Section 132 of the CGST Act provides for prosecution in cases of tax
            evasion, wrong ITC availment, or fake invoicing. The consequences vary by
            the amount involved: Tax evasion of ₹5 Crore or more is a cognizable and
            non-bailable offence with imprisonment up to 5 years. Below ₹5 Crore, it is
            bailable with imprisonment up to 3 years. Additionally, arrest can be made
            without warrant in non-bailable cases. This is why responding promptly and
            paying dues early is crucial in Section 74 cases. Need help?{' '}
            <Link href="/services/gst-notice-response" className="text-emerald-600 hover:underline">
              Get expert help with your GST notice
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
          <Link href="/tools/penalty-calculator/gst-late-filing" className="block">
            <Card className="p-4 rounded-none hover:border-emerald-500 transition-colors">
              <h3 className="font-semibold text-foreground">GST Late Filing Calculator</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Calculate GSTR-1, GSTR-3B, and GSTR-9 late fees
              </p>
            </Card>
          </Link>
          <Link href="/tools/penalty-calculator/itr-late-filing" className="block">
            <Card className="p-4 rounded-none hover:border-emerald-500 transition-colors">
              <h3 className="font-semibold text-foreground">ITR Late Filing Calculator</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Calculate Section 234F, 234A, and 234B penalties
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
      <div className="bg-muted rounded-lg h-[700px]" />
      <div className="bg-muted rounded-lg h-[500px]" />
    </div>
  )
}

export default function GSTDemandNoticePage() {
  return (
    <Suspense fallback={<CalculatorSkeleton />}>
      <GSTDemandNoticeCalculator />
    </Suspense>
  )
}
