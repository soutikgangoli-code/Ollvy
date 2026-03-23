'use client'

import { useState, useMemo, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
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
import { SlidersHorizontal, AlertTriangle } from 'lucide-react'
import {
  EmployeeCountSlider,
  MonthsLateSlider,
  RupeeInput,
  ResultsPanel,
  WarningBanner,
  InfoBanner,
} from '@/components/penalty-calculator'
import { safeParseInt } from '@/lib/parse-url-params'

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

const NON_PT_STATES = [
  'Delhi', 'Uttar Pradesh', 'Rajasthan', 'Haryana', 'Punjab', 'Himachal Pradesh',
  'Uttarakhand', 'Jammu and Kashmir', 'Ladakh', 'Chandigarh', 'Goa', 'Bihar',
  'Jharkhand', 'Chhattisgarh', 'Madhya Pradesh', 'Arunachal Pradesh', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Sikkim', 'Tripura', 'Andaman and Nicobar Islands',
  'Dadra and Nagar Haveli', 'Daman and Diu', 'Lakshadweep', 'Puducherry',
]

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

function ProfessionalTaxCalculatorInner() {
  const searchParams = useSearchParams()

  const [state, setState] = useState(
    searchParams.get('state') || 'Maharashtra'
  )
  const [employeeCount, setEmployeeCount] = useState(
    safeParseInt(searchParams.get('employees'), 25)
  )
  const [avgMonthlySalary, setAvgMonthlySalary] = useState(
    safeParseInt(searchParams.get('salary'), 30000)
  )
  const [monthsLate, setMonthsLate] = useState(
    safeParseInt(searchParams.get('months'), 3)
  )
  const [monthlyPTOverride, setMonthlyPTOverride] = useState<number | null>(null)

  const isPTState = state in PT_STATES
  const stateInfo = PT_STATES[state]

  const result = useMemo(() => {
    if (!isPTState) return null
    return calculatePTPenalty(state, employeeCount, avgMonthlySalary, monthsLate, monthlyPTOverride)
  }, [state, employeeCount, avgMonthlySalary, monthsLate, monthlyPTOverride, isPTState])

  useEffect(() => {
    const params = new URLSearchParams()
    params.set('state', state)
    params.set('employees', employeeCount.toString())
    params.set('salary', avgMonthlySalary.toString())
    params.set('months', monthsLate.toString())

    const newUrl = `${window.location.pathname}?${params.toString()}`
    window.history.replaceState(null, '', newUrl)
  }, [state, employeeCount, avgMonthlySalary, monthsLate])

  const breakdown = useMemo(() => {
    if (!result) return []

    const items = [
      {
        label: 'Penalty',
        amount: result.penalty,
        subItems: [
          { label: `PT Due: Rs.${result.totalPTDue.toLocaleString('en-IN')}`, amount: 0 },
          { label: result.penaltyDescription, amount: result.penalty },
        ],
        statuteShort: `${state} PT Act`,
        statuteFull: `${state} Professional Tax Act - Penalty for delayed payment`,
      },
    ]

    if (result.interest > 0) {
      items.push({
        label: 'Interest',
        amount: result.interest,
        subItems: [
          { label: `2% per month x ${monthsLate} months`, amount: result.interest },
        ],
        statuteShort: `${state} PT Act`,
        statuteFull: `${state} Professional Tax Act - Interest on delayed payment`,
      })
    }

    return items
  }, [result, state, monthsLate])

  return (
    <div className="grid lg:grid-cols-[1.2fr,1fr] gap-10">
      {/* Input Section */}
      <div className="rounded-xl border border-border bg-card p-6 space-y-8">
        <div className="space-y-6">
          {/* State Selector */}
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
                Max PT: Rs.{stateInfo.maxAnnualPT}/year | Penalty: {stateInfo.penaltyDescription}
              </p>
            )}
          </div>

          {/* Non-PT State Message */}
          {!isPTState && (
            <div className="p-6 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-100">
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
                label="Average Monthly Salary (Rs.)"
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
                <AccordionItem value="advanced" className="border-t border-border/50 border-b-0">
                  <AccordionTrigger className="text-sm text-muted-foreground hover:text-foreground hover:no-underline py-4">
                    <span className="flex items-center gap-2">
                      <SlidersHorizontal className="h-3.5 w-3.5" />
                      Advanced options
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-6 pt-4">
                    {/* Monthly PT Override */}
                    <RupeeInput
                      value={monthlyPTOverride ?? (result?.monthlyPTDue || 0)}
                      onChange={(v) => setMonthlyPTOverride(v)}
                      label="Monthly PT Due (Rs.)"
                      helpText={`Auto-calculated based on max PT of Rs.${stateInfo?.maxAnnualPT}/year`}
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
              body={`Rs.${result.totalPTDue.toLocaleString('en-IN')} for ${monthsLate} month${monthsLate > 1 ? 's' : ''}. This is payable in addition to the penalty shown above.`}
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
  )
}

export function CalculatorSkeleton() {
  return (
    <div className="grid lg:grid-cols-[1.5fr,1fr] gap-8 animate-pulse">
      <div className="bg-muted rounded-lg h-[500px]" />
      <div className="bg-muted rounded-lg h-[400px]" />
    </div>
  )
}

export function ProfessionalTaxCalculator() {
  return (
    <Suspense fallback={<CalculatorSkeleton />}>
      <ProfessionalTaxCalculatorInner />
    </Suspense>
  )
}
