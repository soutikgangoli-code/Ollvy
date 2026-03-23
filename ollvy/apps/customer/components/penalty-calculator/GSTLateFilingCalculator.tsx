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
  turnover: number,
  daysLate: number,
  outstandingTax: number
): CalculationResult {
  let dailyRate: number
  let maxCap: number

  if (returnType === 'GSTR-9') {
    dailyRate = 200
    maxCap = Math.floor(turnover * 0.0025)
  } else {
    dailyRate = isNilReturn ? 20 : 50
    maxCap = 5000
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
      ? 'Section 47, CGST Act 2017 (Annual Return) + Section 50 (Interest)'
      : 'Section 47, CGST Act 2017 + Section 50 (Interest)',
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
    return crores % 1 === 0 ? `₹${crores} Crore` : `₹${crores.toFixed(2)} Crore`
  }
  if (value >= 100000) {
    const lakhs = value / 100000
    return lakhs % 1 === 0 ? `₹${lakhs} Lakh` : `₹${lakhs.toFixed(2)} Lakh`
  }
  return `₹${value.toLocaleString('en-IN')}`
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
        statuteFull: 'Section 47 of Central Goods and Services Tax Act, 2017 - Late fee for failure to furnish return',
      },
    ]

    if (result.interest > 0) {
      items.push({
        label: 'Interest on Outstanding Tax',
        amount: result.interest,
        subItems: [],
        statuteShort: 'Sec 50',
        statuteFull: 'Section 50 of CGST Act, 2017 - Interest on delayed payment of tax at 18% per annum',
      })
    }

    return items
  }, [result])

  return (
    <div className="grid lg:grid-cols-[1.2fr,1fr] gap-10">
      {/* Input Section */}
      <div className="rounded-xl border border-border bg-card p-6 space-y-8">
        <div className="space-y-6">
          {/* Return Type */}
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

          {/* Is Nil Return */}
          {returnType !== 'GSTR-9' && (
            <div className="flex items-center justify-between py-3 border-b border-border/50">
              <div>
                <label className="text-sm font-medium text-foreground">Nil Return?</label>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Lower penalty rates apply
                </p>
              </div>
              <Switch checked={isNilReturn} onCheckedChange={setIsNilReturn} />
            </div>
          )}

          {/* Annual Turnover */}
          <div className="space-y-2">
            <TurnoverSlider
              value={turnover}
              onChange={setTurnover}
              label="Annual Turnover"
            />
            {isQRMPEligible && (
              <span className="inline-flex items-center px-2 py-1 text-[10px] font-mono tracking-tight bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                QRMP Eligible
              </span>
            )}
          </div>

          {/* Days Late */}
          <div className="space-y-2">
            <DaysLateSlider
              value={daysLate}
              onChange={setDaysLate}
              label="Days Late"
              maxDays={365}
            />
            <p className="text-xs text-muted-foreground">
              Due: {getDueDate(returnType, filingFrequency)}
            </p>
          </div>
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
                {/* Outstanding Tax */}
                <RupeeInput
                  value={outstandingTax}
                  onChange={setOutstandingTax}
                  label="Outstanding GST Liability"
                  helpText="Enter any unpaid GST for interest calculation"
                />

                {/* Filing Frequency (only for GSTR-3B) */}
                {returnType === 'GSTR-3B' && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Filing Frequency</label>
                    <Select value={filingFrequency} onValueChange={(v) => setFilingFrequency(v as FilingFrequency)}>
                      <SelectTrigger className="bg-background">
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
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">State of Registration</label>
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
              body="Your late fee has reached the maximum cap of ₹5,000. Filing today or in 30 days results in the same late fee - but interest on unpaid tax under Section 50 continues to accrue daily."
            />
          )}

          {/* Info: Cap hit for GSTR-9 */}
          {result.capHit && returnType === 'GSTR-9' && result.maxCap > 0 && (
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
