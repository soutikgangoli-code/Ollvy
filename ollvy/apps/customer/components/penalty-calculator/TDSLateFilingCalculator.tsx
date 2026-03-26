'use client'

import { useState, useMemo, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
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
import { SlidersHorizontal } from 'lucide-react'
import {
  DaysLateSlider,
  RupeeInput,
  ResultsPanel,
  WarningBanner,
  InfoBanner,
} from '@/components/penalty-calculator'
import { safeParseInt } from '@/lib/parse-url-params'

type ReturnType = '24Q' | '26Q' | '27Q' | '27EQ'
type Quarter = 'Q1' | 'Q2' | 'Q3' | 'Q4'
type DepositStatus = 'ON_TIME' | 'DEDUCTED_LATE' | 'NOT_DEDUCTED'

const QUARTER_DUE_DATES: Record<Quarter, { period: string; dueDate: string }> = {
  Q1: { period: 'April 1 - June 30', dueDate: '31 July' },
  Q2: { period: 'July 1 - September 30', dueDate: '31 October' },
  Q3: { period: 'October 1 - December 31', dueDate: '31 January (next year)' },
  Q4: { period: 'January 1 - March 31', dueDate: '31 May' },
}

const RETURN_TYPE_INFO: Record<ReturnType, string> = {
  '24Q': 'Salary TDS',
  '26Q': 'Non-Salary TDS',
  '27Q': 'Foreign Payments',
  '27EQ': 'TCS',
}

interface CalculationResult {
  lateFee234E: number
  interest201: number
  total: number
  interestRate: string
  monthsLate: number
  show271HWarning: boolean
  show271HCritical: boolean
  showDisallowanceWarning: boolean
}

function calculateTDSPenalty(
  tdsAmount: number,
  daysLateReturn: number,
  daysLateDeposit: number,
  depositStatus: DepositStatus
): CalculationResult {
  const lateFee234E = Math.min(200 * daysLateReturn, tdsAmount)

  let interest201 = 0
  let interestRate = '0%'
  let monthsLate = 0

  if (depositStatus === 'DEDUCTED_LATE') {
    monthsLate = Math.ceil(daysLateDeposit / 30)
    interest201 = Math.round(tdsAmount * 0.015 * monthsLate)
    interestRate = '1.5%'
  } else if (depositStatus === 'NOT_DEDUCTED') {
    monthsLate = Math.ceil(daysLateReturn / 30)
    interest201 = Math.round(tdsAmount * 0.01 * monthsLate)
    interestRate = '1%'
  }

  const show271HWarning = daysLateReturn > 0
  const show271HCritical = daysLateReturn > 365

  return {
    lateFee234E,
    interest201,
    total: lateFee234E + interest201,
    interestRate,
    monthsLate,
    show271HWarning,
    show271HCritical,
    showDisallowanceWarning: depositStatus === 'NOT_DEDUCTED',
  }
}

function TDSCalculatorInner() {
  const searchParams = useSearchParams()

  const [returnType, setReturnType] = useState<ReturnType>(
    (searchParams.get('form') as ReturnType) || '26Q'
  )
  const [quarter, setQuarter] = useState<Quarter>(
    (searchParams.get('quarter') as Quarter) || 'Q1'
  )
  const [tdsAmount, setTdsAmount] = useState(
    safeParseInt(searchParams.get('tds_amount'), 50000)
  )
  const [depositStatus, setDepositStatus] = useState<DepositStatus>(
    (searchParams.get('deposit_status') as DepositStatus) || 'ON_TIME'
  )
  const [daysLateReturn, setDaysLateReturn] = useState(
    safeParseInt(searchParams.get('days_return'), 30)
  )
  const [daysLateDeposit, setDaysLateDeposit] = useState(
    safeParseInt(searchParams.get('days_deposit'), 30)
  )

  const result = useMemo(() => {
    return calculateTDSPenalty(tdsAmount, daysLateReturn, daysLateDeposit, depositStatus)
  }, [tdsAmount, daysLateReturn, daysLateDeposit, depositStatus])

  useEffect(() => {
    const params = new URLSearchParams()
    params.set('form', returnType)
    params.set('quarter', quarter)
    params.set('tds_amount', tdsAmount.toString())
    params.set('deposit_status', depositStatus)
    params.set('days_return', daysLateReturn.toString())
    params.set('days_deposit', daysLateDeposit.toString())

    const newUrl = `${window.location.pathname}?${params.toString()}`
    window.history.replaceState(null, '', newUrl)
  }, [returnType, quarter, tdsAmount, depositStatus, daysLateReturn, daysLateDeposit])

  const breakdown = useMemo(() => {
    const items = [
      {
        label: 'Section 234E - Late Filing Fee',
        amount: result.lateFee234E,
        subItems: [
          { label: `Rs.200/day x ${daysLateReturn} days`, amount: 200 * daysLateReturn },
          ...(result.lateFee234E < 200 * daysLateReturn
            ? [{ label: 'Capped at TDS amount', amount: 0 }]
            : []),
        ],
        statuteShort: 'Sec 234E',
        statuteFull: 'Section 234E of Income Tax Act 1961 - Late fee for failure to furnish TDS statement',
      },
    ]

    if (result.interest201 > 0) {
      items.push({
        label: 'Interest on Late Deposit (Section 201(1A))',
        amount: result.interest201,
        subItems: [
          { label: `${result.interestRate} per month x ${result.monthsLate} month${result.monthsLate > 1 ? 's' : ''}`, amount: result.interest201 },
        ],
        statuteShort: 'Sec 201(1A)',
        statuteFull: 'Section 201(1A) of Income Tax Act 1961 - Interest on failure to deduct or pay TDS',
      })
    }

    return items
  }, [result, daysLateReturn])

  return (
    <div className="grid lg:grid-cols-[1.2fr,1fr] gap-10">
      {/* Input Section */}
      <div className="rounded-xl border border-border bg-card p-6 space-y-8">
        <div className="space-y-6">
          {/* Return Type */}
          <div className="space-y-1.5">
            <Label>Return Type</Label>
            <Select value={returnType} onValueChange={(v) => setReturnType(v as ReturnType)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(RETURN_TYPE_INFO).map(([type, desc]) => (
                  <SelectItem key={type} value={type}>
                    {type} ({desc})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Quarter */}
          <div className="space-y-1.5">
            <Label>Quarter</Label>
            <Select value={quarter} onValueChange={(v) => setQuarter(v as Quarter)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(QUARTER_DUE_DATES).map(([q, info]) => (
                  <SelectItem key={q} value={q}>
                    {q} ({info.period})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Due date: {QUARTER_DUE_DATES[quarter].dueDate}
            </p>
          </div>

          {/* TDS Amount */}
          <RupeeInput
            value={tdsAmount}
            onChange={setTdsAmount}
            label="TDS/TCS Amount"
            helpText="Enter the TDS/TCS amount for this quarter"
          />

          {/* Deposit Status */}
          <div className="space-y-3">
            <Label>TDS Deposit Status</Label>
            <RadioGroup
              value={depositStatus}
              onValueChange={(v) => setDepositStatus(v as DepositStatus)}
              className="space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="ON_TIME" id="on_time" />
                <Label htmlFor="on_time" className="font-normal cursor-pointer">
                  Deducted &amp; deposited on time
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="DEDUCTED_LATE" id="deducted_late" />
                <Label htmlFor="deducted_late" className="font-normal cursor-pointer">
                  Deducted but deposited late
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="NOT_DEDUCTED" id="not_deducted" />
                <Label htmlFor="not_deducted" className="font-normal cursor-pointer">
                  Not deducted at all
                </Label>
              </div>
            </RadioGroup>
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
                {/* Days Late - Return Filing */}
                <DaysLateSlider
                  value={daysLateReturn}
                  onChange={setDaysLateReturn}
                  label="Days Late (Return Filing)"
                  maxDays={365}
                />

                {/* Days Late - Deposit */}
                {(depositStatus === 'DEDUCTED_LATE' || depositStatus === 'NOT_DEDUCTED') && (
                  <DaysLateSlider
                    value={daysLateDeposit}
                    onChange={setDaysLateDeposit}
                    label="Days Late (Deposit)"
                    maxDays={365}
                  />
                )}
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
          dueDate={QUARTER_DUE_DATES[quarter].dueDate}
          statute="Section 234E, 271H, 201(1A) - Income Tax Act 1961"
          ctaText="File TDS Return"
          ctaHref="/services/tds-monthly-compliance"
          showCta={result.total > 0}
        >
          {/* Section 271H Advisory */}
          {result.show271HWarning && !result.show271HCritical && (
            <InfoBanner
              title="Section 271H Advisory"
              body="Rs.10,000 - Rs.1,00,000 additional penalty may be levied at AO's discretion. Can be waived if TDS is paid, 234E fee is paid, and return is filed within 1 year of due date."
            />
          )}

          {/* Section 271H Critical Warning */}
          {result.show271HCritical && (
            <WarningBanner
              variant="red"
              title="Section 271H Waiver Window Closed"
              body="Section 271H penalty waiver window has closed (1 year exceeded). Penalty of Rs.10,000-Rs.1,00,000 is now likely."
            />
          )}

          {/* 40(a)(ia) Disallowance Warning */}
          {result.showDisallowanceWarning && (
            <WarningBanner
              variant="red"
              title="Section 40(a)(ia) Disallowance"
              body="30% of the expense on which TDS was not deducted may be disallowed for income tax, increasing your taxable income. This is separate from the penalty above."
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
      <div className="bg-muted rounded-lg h-[600px]" />
      <div className="bg-muted rounded-lg h-[400px]" />
    </div>
  )
}

export function TDSLateFilingCalculator() {
  return (
    <Suspense fallback={<CalculatorSkeleton />}>
      <TDSCalculatorInner />
    </Suspense>
  )
}
