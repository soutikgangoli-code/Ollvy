'use client'

import { useState, useMemo, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
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
import { SlidersHorizontal } from 'lucide-react'
import {
  TurnoverSlider,
  DaysLateSlider,
  RupeeInput,
  ResultsPanel,
  WarningBanner,
  InfoBanner,
} from '@/components/penalty-calculator'
import { safeParseInt } from '@/lib/parse-url-params'

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
  turnover: number,
  daysLate: number,
  outstandingTax: number
): CalculationResult {
  let dailyRate: number
  let maxCap: number

  if (returnType === 'GSTR-9') {
    // Statutory rate: Rs. 200/day (Rs. 100 CGST + Rs. 100 SGST) - Section 47(2)
    // Cap: 0.25% per Act = 0.50% combined (Section 47(2), CGST Act 2017)
    // FIX: was 0.0025 (0.25%) which is only one Act's cap - correct is 0.005 (0.50%)
    dailyRate = 200
    maxCap = Math.floor(turnover * 0.005)
  } else {
    // GSTR-1 and GSTR-3B per CBIC Notifications 19/2021 and 20/2021
    // Non-nil: Rs. 50/day (Rs. 25 CGST + Rs. 25 SGST)
    // Nil: Rs. 20/day (Rs. 10 CGST + Rs. 10 SGST)
    dailyRate = isNilReturn ? 20 : 50
    // FIX: Nil return cap is Rs. 500 (Rs. 250 CGST + Rs. 250 SGST) per Notification 20/2021
    // Not Rs. 5,000 - that applies only to non-nil returns
    maxCap = isNilReturn ? 500 : 5000
  }

  const calculatedFee = dailyRate * daysLate
  const lateFee = Math.min(calculatedFee, maxCap)
  const capHit = calculatedFee >= maxCap

  const interest = Math.round(outstandingTax * 0.18 * (daysLate / 365))

  return {
    lateFee,
    lateFeeCGST: Math.floor(lateFee / 2),
    lateFeeSGST: Math.ceil(lateFee / 2),
    interest,
    total: lateFee + interest,
    statute: returnType === 'GSTR-9'
      ? 'Section 47(2), CGST Act 2017 (late fee) + Section 50 (interest on unpaid tax)'
      : 'Section 47, CGST Act 2017 (late fee) + Section 50 (interest on unpaid tax)',
    dailyRate,
    maxCap,
    capHit,
    calculatedFee,
  }
}

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

function formatTurnover(value: number): string {
  if (value >= 10000000) {
    const crores = value / 10000000
    return crores % 1 === 0 ? `Rs. ${crores} Crore` : `Rs. ${crores.toFixed(2)} Crore`
  }
  if (value >= 100000) {
    const lakhs = value / 100000
    return lakhs % 1 === 0 ? `Rs. ${lakhs} Lakh` : `Rs. ${lakhs.toFixed(2)} Lakh`
  }
  return `Rs. ${value.toLocaleString('en-IN')}`
}

function GSTCalculatorInner() {
  const searchParams = useSearchParams()

  const [returnType, setReturnType] = useState<ReturnType>(
    (searchParams.get('return') as ReturnType) || 'GSTR-3B'
  )
  const [isNilReturn, setIsNilReturn] = useState(
    searchParams.get('nil') === 'true'
  )
  const [turnover, setTurnover] = useState(
    safeParseInt(searchParams.get('turnover'), 10000000)
  )
  const [daysLate, setDaysLate] = useState(
    safeParseInt(searchParams.get('days'), 30)
  )
  const [outstandingTax, setOutstandingTax] = useState(
    safeParseInt(searchParams.get('liability'), 0)
  )
  const [filingFrequency, setFilingFrequency] = useState<FilingFrequency>(
    (searchParams.get('frequency') as FilingFrequency) || 'monthly'
  )
  const [state, setState] = useState(
    searchParams.get('state') || 'Delhi'
  )

  const result = useMemo(() => {
    return calculateGSTPenalty(returnType, isNilReturn, turnover, daysLate, outstandingTax)
  }, [returnType, isNilReturn, turnover, daysLate, outstandingTax])

  const isQRMPEligible = turnover <= 50000000 && returnType === 'GSTR-3B'

  useEffect(() => {
    const id = setTimeout(() => {
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
    }, 250)
    return () => clearTimeout(id)
  }, [returnType, isNilReturn, turnover, daysLate, outstandingTax, filingFrequency, state])

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
        statuteFull: 'Section 47, Central Goods and Services Tax Act, 2017 - late fee for failure to furnish return',
      },
    ]

    if (result.interest > 0) {
      items.push({
        label: 'Interest on Outstanding Tax',
        amount: result.interest,
        subItems: [],
        statuteShort: 'Sec 50',
        statuteFull: 'Section 50, CGST Act 2017 - interest on delayed payment of tax at 18% per annum',
      })
    }

    return items
  }, [result])

  return (
    <div className="grid lg:grid-cols-[1.2fr,1fr] gap-10">
      <div className="rounded-xl border border-border bg-card p-6 space-y-8">
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Return Type</label>
            <Select value={returnType} onValueChange={(v) => setReturnType(v as ReturnType)}>
              <SelectTrigger className="h-11 bg-background">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="GSTR-1">GSTR-1 (Sales)</SelectItem>
                <SelectItem value="GSTR-3B">GSTR-3B (Summary)</SelectItem>
                <SelectItem value="GSTR-9">GSTR-9 (Annual)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {returnType !== 'GSTR-9' && (
            <div className="flex items-center justify-between py-3 border-b border-border/50">
              <div>
                <label className="text-sm font-medium text-foreground">Nil Return?</label>
                <p className="text-xs text-muted-foreground mt-0.5">Half the daily rate, capped at Rs. 500</p>
              </div>
              <Switch checked={isNilReturn} onCheckedChange={setIsNilReturn} />
            </div>
          )}

          <div className="space-y-2">
            <TurnoverSlider value={turnover} onChange={setTurnover} label="Annual Turnover" />
            {isQRMPEligible && (
              <span className="inline-flex items-center px-2 py-1 text-[10px] font-mono tracking-tight bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                QRMP Eligible
              </span>
            )}
          </div>

          <div className="space-y-2">
            <DaysLateSlider value={daysLate} onChange={setDaysLate} label="Days Late" maxDays={365} />
            <p className="text-xs text-muted-foreground">Due date: {getDueDate(returnType, filingFrequency)}</p>
          </div>
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
              <RupeeInput
                value={outstandingTax}
                onChange={setOutstandingTax}
                label="Unpaid GST (for interest calculation)"
                helpText="GST you owe but have not paid - 18% annual interest applies"
              />
              {returnType === 'GSTR-3B' && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">How often you file</label>
                  <Select value={filingFrequency} onValueChange={(v) => setFilingFrequency(v as FilingFrequency)}>
                    <SelectTrigger className="bg-background"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="quarterly">Quarterly (QRMP)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">State where you are GST-registered</label>
                <Select value={state} onValueChange={setState}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {INDIAN_STATES.map((s) => (<SelectItem key={s} value={s}>{s}</SelectItem>))}
                  </SelectContent>
                </Select>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      <div className="lg:sticky lg:top-24 lg:self-start">
        <ResultsPanel
          total={result.total}
          breakdown={breakdown}
          dueDate={getDueDate(returnType, filingFrequency)}
          statute={result.statute}
          ctaText="File Now and Stop the Meter"
          ctaHref="/services/gst-monthly"
          showCta={result.total > 0}
          docChecklistHref="/tools/documents/gst-registration"
          docChecklistText="GST registration documents"
        >
          {isQRMPEligible && (
            <InfoBanner
              title="QRMP eligible"
              body="Your turnover qualifies for QRMP - quarterly returns, monthly tax payments. Cuts filing work by two-thirds."
            />
          )}
          {daysLate > 30 && (
            <WarningBanner
              variant="yellow"
              title={`Rs. ${result.dailyRate} added every day`}
              body="File now to stop the late fee from increasing. Interest on any unpaid tax continues regardless."
            />
          )}
          {result.capHit && returnType !== 'GSTR-9' && (
            <InfoBanner
              title="Late fee is capped - no further increase"
              body={isNilReturn
                ? 'Nil return late fee stops at Rs. 500. You owe Rs. 500 in late fees, no matter how long you wait.'
                : 'Late fee has reached the cap for your turnover slab. Filing now will not reduce the late fee, but it will stop interest from growing.'
              }
            />
          )}
          {result.capHit && returnType === 'GSTR-9' && result.maxCap > 0 && (
            <InfoBanner
              title="GSTR-9 late fee capped"
              body={`Cap is 0.50% of annual turnover (0.25% CGST + 0.25% SGST). Maximum late fee: ${formatTurnover(result.maxCap)}.`}
            />
          )}
          {outstandingTax > 0 && daysLate > 30 && (
            <WarningBanner
              variant="yellow"
              title="18% annual interest on unpaid GST"
              body={`That is Rs. ${Math.round(outstandingTax * 0.18 / 365).toLocaleString('en-IN')} per day on your current balance. Paying the tax stops this immediately.`}
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

export function GSTLateFilingCalculator() {
  return (
    <Suspense fallback={<CalculatorSkeleton />}>
      <GSTCalculatorInner />
    </Suspense>
  )
}
