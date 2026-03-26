'use client'

import { useState, useMemo, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
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
import { SlidersHorizontal, CheckCircle2 } from 'lucide-react'
import {
  DaysLateSlider,
  RupeeInput,
  ResultsPanel,
  WarningBanner,
  InfoBanner,
} from '@/components/penalty-calculator'
import { safeParseInt } from '@/lib/parse-url-params'

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
  const interestRate = isFraud ? 0.24 : 0.18
  const section = isFraud ? '74' : '73'

  const calculateInterest = (days: number) => Math.round(demandAmount * interestRate * (days / 365))

  let scenarios: ScenarioResult[] = []

  if (isFraud) {
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
        interest: calculateInterest(90),
        total: demandAmount + Math.round(demandAmount * 0.25) + calculateInterest(90),
        deadline: 'Before order is passed',
      },
      {
        label: 'Pay After Order',
        penalty: demandAmount,
        penaltyRate: '100%',
        interest: calculateInterest(180),
        total: demandAmount + demandAmount + calculateInterest(180),
        deadline: 'After order is passed',
      },
    ]
  } else {
    const minPenalty = 10000
    const penalty10Percent = Math.max(Math.round(demandAmount * 0.10), minPenalty)

    scenarios = [
      {
        label: 'Pay Within 30 Days of SCN',
        penalty: penalty10Percent,
        penaltyRate: '10% (min Rs.10,000)',
        interest: calculateInterest(30),
        total: demandAmount + penalty10Percent + calculateInterest(30),
        deadline: '30 days from SCN date',
      },
      {
        label: 'Pay Before Order',
        penalty: penalty10Percent,
        penaltyRate: '10% (min Rs.10,000)',
        interest: calculateInterest(90),
        total: demandAmount + penalty10Percent + calculateInterest(90),
        deadline: 'Before order is passed',
      },
      {
        label: 'Pay After Order',
        penalty: penalty10Percent,
        penaltyRate: '10% (min Rs.10,000)',
        interest: calculateInterest(180),
        total: demandAmount + penalty10Percent + calculateInterest(180),
        deadline: 'After order is passed',
      },
    ]
  }

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

function GSTDemandCalculatorInner() {
  const searchParams = useSearchParams()

  const [defaultType, setDefaultType] = useState<DefaultType>(
    (searchParams.get('type') as DefaultType) || 'tax_not_paid'
  )
  const [isFraud, setIsFraud] = useState(
    searchParams.get('fraud') === 'true'
  )
  const [demandAmount, setDemandAmount] = useState(
    safeParseInt(searchParams.get('amount'), 100000)
  )
  const [noticeStage, setNoticeStage] = useState<NoticeStage>(
    (searchParams.get('stage') as NoticeStage) || 'scn'
  )
  const [daysSinceNotice, setDaysSinceNotice] = useState(
    safeParseInt(searchParams.get('days'), 30)
  )

  const result = useMemo(() => {
    return calculateGSTDemandPenalty(demandAmount, isFraud, noticeStage, daysSinceNotice)
  }, [demandAmount, isFraud, noticeStage, daysSinceNotice])

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

  const breakdown = useMemo(() => {
    return [
      {
        label: `Penalty (Section ${result.section})`,
        amount: result.currentPenalty,
        subItems: [
          { label: `Rate: ${result.scenarios[0].penaltyRate}`, amount: result.currentPenalty },
        ],
        statuteShort: `Sec ${result.section}`,
        statuteFull: `Section ${result.section} of CGST Act 2017 - ${isFraud ? 'Fraud/Willful misstatement' : 'Non-fraud cases'}`,
      },
      {
        label: 'Interest (Section 50)',
        amount: result.currentInterest,
        subItems: [
          { label: `${result.interestRate * 100}% p.a. for ${daysSinceNotice} days`, amount: result.currentInterest },
        ],
        statuteShort: 'Sec 50',
        statuteFull: `Section 50 of CGST Act 2017 - Interest on delayed payment at ${result.interestRate * 100}% p.a.`,
      },
    ]
  }, [result, daysSinceNotice, isFraud])

  return (
    <div className="grid lg:grid-cols-[1.2fr,1fr] gap-10">
      {/* Input Section */}
      <div className="rounded-xl border border-border bg-card p-6 space-y-8">
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
            label="Demand Amount (Rs.)"
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
            <AccordionItem value="advanced" className="border-t border-border/50 border-b-0">
              <AccordionTrigger className="text-sm text-muted-foreground hover:text-foreground hover:no-underline py-4">
                <span className="flex items-center gap-2">
                  <SlidersHorizontal className="h-3.5 w-3.5" />
                  Advanced options
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
              Payment Scenarios - Section {result.section}
            </h3>
            <div className="grid gap-4">
              {result.scenarios.map((scenario, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border ${
                    index === 0
                      ? 'bg-muted border-emerald-500/30'
                      : 'bg-card border-border'
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
                        Rs.{scenario.total.toLocaleString('en-IN')}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Penalty: {scenario.penaltyRate}
                      </p>
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-muted-foreground grid grid-cols-3 gap-2">
                    <span>Tax: Rs.{demandAmount.toLocaleString('en-IN')}</span>
                    <span>Penalty: Rs.{scenario.penalty.toLocaleString('en-IN')}</span>
                    <span>Interest: Rs.{scenario.interest.toLocaleString('en-IN')}</span>
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
          docChecklistHref="/tools/documents/gst-registration"
          docChecklistText="GST compliance documents"
        >
          {/* Tax Demand Principal */}
          <InfoBanner
            title="Tax Demand (Principal)"
            body={`Rs.${demandAmount.toLocaleString('en-IN')} is payable in addition to the penalty and interest shown above.`}
          />

          {/* Section 74 Fraud Warning */}
          {isFraud && (
            <WarningBanner
              variant="red"
              title="Section 74 - Prosecution Risk"
              body="Section 74 cases can result in prosecution under Section 132 of CGST Act. Tax evasion above Rs.5 Crore is a cognizable and non-bailable offence. Imprisonment can extend to 5 years."
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
  )
}

export function CalculatorSkeleton() {
  return (
    <div className="grid lg:grid-cols-[1.5fr,1fr] gap-8 animate-pulse">
      <div className="bg-muted rounded-lg h-[700px]" />
      <div className="bg-muted rounded-lg h-[500px]" />
    </div>
  )
}

export function GSTDemandCalculator() {
  return (
    <Suspense fallback={<CalculatorSkeleton />}>
      <GSTDemandCalculatorInner />
    </Suspense>
  )
}
