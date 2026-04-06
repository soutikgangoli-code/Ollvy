'use client'

import { useState, useMemo, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { SlidersHorizontal, CheckCircle2 } from 'lucide-react'
import { DaysLateSlider, RupeeInput, ResultsPanel, WarningBanner, InfoBanner } from '@/components/penalty-calculator'
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
  const calculateInterest = (days: number) =>
    Math.round(demandAmount * interestRate * (days / 365))

  let scenarios: ScenarioResult[] = []

  if (isFraud) {
    // Section 74 - fraud, wilful misstatement, suppression of facts
    // Penalty tiers per Section 74(8) and Section 74(11)
    scenarios = [
      {
        label: 'Pay within 30 days of SCN',
        penalty: Math.round(demandAmount * 0.15),
        penaltyRate: '15%',
        interest: calculateInterest(30),
        total: demandAmount + Math.round(demandAmount * 0.15) + calculateInterest(30),
        deadline: '30 days from the SCN date',
      },
      {
        label: 'Pay after 30 days, before order is passed',
        penalty: Math.round(demandAmount * 0.25),
        penaltyRate: '25%',
        interest: calculateInterest(90),
        total: demandAmount + Math.round(demandAmount * 0.25) + calculateInterest(90),
        deadline: 'Between day 31 and the adjudication order',
      },
      {
        label: 'Pay after the order is passed',
        penalty: demandAmount,
        penaltyRate: '100%',
        interest: calculateInterest(180),
        total: demandAmount + demandAmount + calculateInterest(180),
        deadline: 'Highest exposure - no reduction available',
      },
    ]
  } else {
    // Section 73 - non-fraud, genuine errors
    // FIX: Section 73(8) CGST Act is explicit: "no penalty shall be payable" if paid
    // with tax + interest within 30 days of SCN. Old code showed 10% here - WRONG.
    // 10% penalty (min Rs. 10,000) only applies when an order is passed (Section 73(9)).
    const orderPenalty = Math.max(Math.round(demandAmount * 0.10), 10000)
    scenarios = [
      {
        label: 'Pay within 30 days of SCN',
        penalty: 0,
        penaltyRate: 'No penalty',
        interest: calculateInterest(30),
        total: demandAmount + calculateInterest(30),
        deadline: '30 days from SCN date',
      },
      {
        label: 'Pay after 30 days, before order is passed',
        penalty: orderPenalty,
        penaltyRate: '10% or Rs. 10,000 (whichever is higher)',
        interest: calculateInterest(90),
        total: demandAmount + orderPenalty + calculateInterest(90),
        deadline: 'Before adjudication order',
      },
      {
        label: 'Pay after the order is passed',
        penalty: orderPenalty,
        penaltyRate: '10% or Rs. 10,000 (whichever is higher)',
        interest: calculateInterest(180),
        total: demandAmount + orderPenalty + calculateInterest(180),
        deadline: 'After order',
      },
    ]
  }

  let currentScenarioIndex = 0
  if (noticeStage === 'order_passed' || noticeStage === 'appeal_filed') {
    currentScenarioIndex = 2
  } else if (daysSinceNotice > 30) {
    currentScenarioIndex = 1
  }

  return {
    demandAmount,
    isFraud,
    section,
    interestRate,
    scenarios,
    currentPenalty: scenarios[currentScenarioIndex].penalty,
    currentInterest: calculateInterest(daysSinceNotice),
    currentTotal: demandAmount + scenarios[currentScenarioIndex].penalty + calculateInterest(daysSinceNotice),
  }
}

function GSTDemandCalculatorInner() {
  const searchParams = useSearchParams()
  const [defaultType, setDefaultType] = useState<DefaultType>((searchParams.get('type') as DefaultType) || 'tax_not_paid')
  const [isFraud, setIsFraud] = useState(searchParams.get('fraud') === 'true')
  const [demandAmount, setDemandAmount] = useState(safeParseInt(searchParams.get('amount'), 100000))
  const [noticeStage, setNoticeStage] = useState<NoticeStage>((searchParams.get('stage') as NoticeStage) || 'scn')
  const [daysSinceNotice, setDaysSinceNotice] = useState(safeParseInt(searchParams.get('days'), 30))

  const result = useMemo(
    () => calculateGSTDemandPenalty(demandAmount, isFraud, noticeStage, daysSinceNotice),
    [demandAmount, isFraud, noticeStage, daysSinceNotice]
  )

  useEffect(() => {
    const params = new URLSearchParams()
    params.set('type', defaultType)
    params.set('fraud', isFraud.toString())
    params.set('amount', demandAmount.toString())
    params.set('stage', noticeStage)
    params.set('days', daysSinceNotice.toString())
    window.history.replaceState(null, '', `${window.location.pathname}?${params.toString()}`)
  }, [defaultType, isFraud, demandAmount, noticeStage, daysSinceNotice])

  const breakdown = useMemo(() => [
    {
      label: `Penalty (Section ${result.section})`,
      amount: result.currentPenalty,
      subItems: [{ label: `Rate: ${result.scenarios[0].penaltyRate}`, amount: result.currentPenalty }],
      statuteShort: `Sec ${result.section}`,
      statuteFull: `Section ${result.section} of CGST Act 2017`,
    },
    {
      label: 'Interest (Section 50)',
      amount: result.currentInterest,
      subItems: [{ label: `${result.interestRate * 100}% p.a. for ${daysSinceNotice} days`, amount: result.currentInterest }],
      statuteShort: 'Sec 50',
      statuteFull: 'Section 50, CGST Act 2017',
    },
  ], [result, daysSinceNotice])

  return (
    <div className="grid lg:grid-cols-[1.2fr,1fr] gap-10">
      <div className="rounded-xl border border-border bg-card p-6 space-y-8">
        <div className="space-y-6">
          <div className="space-y-1.5">
            <Label>What is the demand about?</Label>
            <Select value={defaultType} onValueChange={(v) => setDefaultType(v as DefaultType)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {Object.entries(DEFAULT_TYPE_LABELS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Does the notice allege fraud or deliberate evasion?</Label>
              <p className="text-xs text-muted-foreground mt-0.5">
                Section 74 (fraud) = higher penalties. Section 73 (genuine error) = much lower penalties.
              </p>
            </div>
            <Switch checked={isFraud} onCheckedChange={setIsFraud} />
          </div>

          <RupeeInput
            value={demandAmount}
            onChange={setDemandAmount}
            label="Tax demand amount"
            helpText="The tax figure in your notice - excluding penalty and interest"
          />

          <div className="space-y-1.5">
            <Label>Where are you in the process?</Label>
            <Select value={noticeStage} onValueChange={(v) => setNoticeStage(v as NoticeStage)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {Object.entries(NOTICE_STAGE_LABELS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Accordion type="single" collapsible>
            <AccordionItem value="advanced" className="border-t border-border/50 border-b-0">
              <AccordionTrigger className="text-sm text-muted-foreground hover:text-foreground hover:no-underline py-4">
                <span className="flex items-center gap-2">
                  <SlidersHorizontal className="h-3.5 w-3.5" />
                  Advanced options
                </span>
              </AccordionTrigger>
              <AccordionContent className="space-y-6 pt-4">
                <DaysLateSlider
                  value={daysSinceNotice}
                  onChange={setDaysSinceNotice}
                  label="Days since the notice was issued"
                  maxDays={365}
                />
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <div className="pt-4 border-t border-border">
            <h3 className="font-semibold text-foreground mb-4">Payment Scenarios - Section {result.section}</h3>
            <div className="grid gap-4">
              {result.scenarios.map((scenario, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border ${index === 0 ? 'bg-muted border-emerald-500/30' : 'bg-card border-border'}`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-medium text-foreground flex items-center gap-2">
                        {index === 0 && <CheckCircle2 className="h-4 w-4 text-emerald-400" />}
                        {scenario.label}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">Deadline: {scenario.deadline}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-foreground">Rs. {scenario.total.toLocaleString('en-IN')}</p>
                      <p className="text-xs text-muted-foreground">Penalty: {scenario.penaltyRate}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="lg:sticky lg:top-24 lg:self-start">
        <ResultsPanel
          total={result.currentTotal}
          breakdown={breakdown}
          dueDate={daysSinceNotice > 30 ? 'Overdue' : '30 days from SCN'}
          statute={`Section ${result.section}, CGST Act 2017`}
          ctaText="Get GST Notice Help"
          ctaHref="/services/gst-notice-response"
          showCta={result.currentTotal > 0}
        >
          <InfoBanner
            title={`Principal demand: Rs. ${demandAmount.toLocaleString('en-IN')}`}
            body="The penalty and interest shown above are on top of this. You pay the demand amount regardless of scenario."
          />

          {isFraud && (
            <WarningBanner
              variant="red"
              title="Prosecution risk under Section 132"
              body="Section 74 carries prosecution risk. Tax evasion above Rs. 5 crore is a cognizable, non-bailable offence. Get a lawyer."
            />
          )}

          {daysSinceNotice <= 30 && noticeStage === 'scn' && (
            <InfoBanner
              title={isFraud ? 'Pay now - 30-day window is open' : '30-day no-penalty window is open'}
              body={isFraud
                ? 'Pay within 30 days of SCN: 15% penalty instead of 100%. Every day costs you more.'
                : 'Pay tax + interest within 30 days of SCN and no penalty applies at all. Section 73(8) is clear on this.'
              }
            />
          )}

          {daysSinceNotice > 30 && noticeStage === 'scn' && (
            <WarningBanner
              variant="yellow"
              title={isFraud ? '30-day window closed - 25% penalty now' : '30-day window closed'}
              body={isFraud
                ? 'You are now in the 25% penalty bracket. Waiting for the order raises this to 100%.'
                : 'A 10% penalty (min Rs. 10,000) will apply when the order is passed. The tax and interest still need to be paid.'
              }
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
