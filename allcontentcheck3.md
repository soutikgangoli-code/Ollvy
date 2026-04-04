# Penalty Calculator Components - Complete Code Reference

This document contains the complete TypeScript code for all 10 penalty calculator components.

**Source:** `/ollvy/apps/customer/components/penalty-calculator/`

---

## 1. GSTLateFilingCalculator.tsx

```typescript
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
                <p className="text-xs text-muted-foreground mt-0.5">Lower penalty rates apply</p>
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
            <p className="text-xs text-muted-foreground">Due: {getDueDate(returnType, filingFrequency)}</p>
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
              <RupeeInput value={outstandingTax} onChange={setOutstandingTax} label="Outstanding GST Liability" helpText="Enter any unpaid GST for interest calculation" />
              {returnType === 'GSTR-3B' && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Filing Frequency</label>
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
                <label className="text-sm font-medium text-foreground">State of Registration</label>
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
        <ResultsPanel total={result.total} breakdown={breakdown} dueDate={getDueDate(returnType, filingFrequency)} statute={result.statute} ctaText="File GST Returns" ctaHref="/services/gst-monthly" showCta={result.total > 0} docChecklistHref="/tools/documents/gst-registration" docChecklistText="GST registration documents">
          {isQRMPEligible && (<InfoBanner title="QRMP Scheme Eligible" body="With annual turnover up to ₹5 Crore, you may be eligible for the QRMP scheme." />)}
          {daysLate > 30 && (<WarningBanner variant="yellow" title="Late fees are increasing daily" body={`Every additional day adds ₹${result.dailyRate} to your liability.`} />)}
          {result.capHit && returnType !== 'GSTR-9' && (<InfoBanner title="Maximum cap reached" body="Your late fee has reached the maximum cap of ₹5,000." />)}
          {result.capHit && returnType === 'GSTR-9' && result.maxCap > 0 && (<InfoBanner title="Turnover-based cap applied" body={`Your GSTR-9 late fee is capped at 0.25% of your annual turnover (${formatTurnover(result.maxCap)}).`} />)}
          {outstandingTax > 0 && daysLate > 30 && (<WarningBanner variant="yellow" title="Interest accruing daily" body="Interest on unpaid GST accrues at 18% per annum under Section 50." />)}
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
```

---

## 2. DirectorKYCCalculator.tsx

```typescript
'use client'

import { Suspense, useState, useMemo, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { AlertCircle } from 'lucide-react'
import { ResultsPanel, InfoBanner } from '@/components/penalty-calculator'
import { safeParseInt } from '@/lib/parse-url-params'

function DirectorKYCCalculatorInner() {
  const searchParams = useSearchParams()

  const [numberOfDirectors, setNumberOfDirectors] = useState(
    safeParseInt(searchParams.get('directors'), 1)
  )
  const [isDINDeactivated, setIsDINDeactivated] = useState(
    searchParams.get('deactivated') === 'true'
  )

  const PENALTY_PER_DIRECTOR = 5000
  const totalPenalty = numberOfDirectors * PENALTY_PER_DIRECTOR

  useEffect(() => {
    const params = new URLSearchParams()
    params.set('directors', numberOfDirectors.toString())
    params.set('deactivated', isDINDeactivated.toString())
    const newUrl = `${window.location.pathname}?${params.toString()}`
    window.history.replaceState(null, '', newUrl)
  }, [numberOfDirectors, isDINDeactivated])

  const breakdown = useMemo(() => [
    {
      label: 'Penalty Breakdown',
      amount: totalPenalty,
      subItems: [
        { label: `Rs.5,000 x ${numberOfDirectors} director${numberOfDirectors > 1 ? 's' : ''}`, amount: totalPenalty },
      ],
      statuteShort: 'Rule 12A',
      statuteFull: 'Rule 12A of Companies (Appointment and Qualification of Directors) Rules - DIR-3 KYC late fee',
    },
  ], [totalPenalty, numberOfDirectors])

  return (
    <div className="grid lg:grid-cols-[1.2fr,1fr] gap-10">
      <div className="rounded-xl border border-border bg-card p-6 space-y-8">
        <div className="space-y-6">
          <div className="space-y-1.5">
            <Label htmlFor="directors">Number of Directors with Pending KYC</Label>
            <Input id="directors" type="number" min={1} max={50} value={numberOfDirectors} onChange={(e) => setNumberOfDirectors(Math.max(1, Math.min(50, parseInt(e.target.value) || 1)))} className="max-w-[200px]" />
            <p className="text-xs text-muted-foreground">Each director pays Rs.5,000 separately</p>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Is DIN Currently Deactivated?</Label>
              <p className="text-xs text-muted-foreground mt-0.5">DINs are deactivated after September 30 if KYC is not filed</p>
            </div>
            <Switch checked={isDINDeactivated} onCheckedChange={setIsDINDeactivated} />
          </div>

          <div className="space-y-3 pt-4 border-t border-border">
            <h3 className="font-medium text-foreground flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-blue-600" />
              Important Information
            </h3>
            <ul className="text-sm text-muted-foreground space-y-2 list-disc list-inside">
              <li>DIR-3 KYC must be filed annually by September 30.</li>
              <li>A deactivated DIN blocks all MCA filings.</li>
              <li>Reactivation: File DIR-3 KYC with late fee of Rs.5,000.</li>
              <li>From FY 2019-20: Directors with mobile and email linked must also file DIR-3 KYC-Web annually.</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="lg:sticky lg:top-24 lg:self-start">
        <ResultsPanel total={totalPenalty} breakdown={breakdown} dueDate="30 September every year" statute="Companies Act 2013, Rule 12A" ctaText="File DIR-3 KYC" ctaHref="/services/director-kyc" showCta={totalPenalty > 0} docChecklistHref="/tools/documents/private-limited-company" docChecklistText="Company compliance documents">
          <InfoBanner title="Additional Risk" body="Up to Rs.50,000 under Section 450 for continued non-compliance" />
          {isDINDeactivated && (
            <div className="p-4 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-red-900 dark:text-red-100">
              <p className="font-semibold text-sm flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                DIN STATUS: Deactivated
              </p>
              <ul className="text-sm mt-2 space-y-1 ml-6 list-disc">
                <li>Cannot act as director</li>
                <li>Cannot sign MCA forms</li>
                <li>All company MCA filings blocked until reactivation</li>
                <li>Reactivation: 24-48 hours after filing + payment</li>
              </ul>
            </div>
          )}
        </ResultsPanel>
      </div>
    </div>
  )
}

export function CalculatorSkeleton() {
  return (
    <div className="grid lg:grid-cols-[1.5fr,1fr] gap-8 animate-pulse">
      <div className="bg-muted rounded-lg h-[400px]" />
      <div className="bg-muted rounded-lg h-[350px]" />
    </div>
  )
}

export function DirectorKYCCalculator() {
  return (
    <Suspense fallback={<CalculatorSkeleton />}>
      <DirectorKYCCalculatorInner />
    </Suspense>
  )
}
```

---

## 3. MCAFilingCalculator.tsx

```typescript
'use client'

import { Suspense, useState, useMemo, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { SlidersHorizontal } from 'lucide-react'
import { DaysLateSlider, ResultsPanel, WarningBanner } from '@/components/penalty-calculator'
import { safeParseInt } from '@/lib/parse-url-params'

type EntityType = 'pvt_ltd' | 'public_ltd' | 'llp'
type FormType = 'AOC-4' | 'MGT-7' | 'MGT-7A' | 'LLP Form 8' | 'LLP Form 11'

const PENALTY_RATES: Record<FormType, { dailyRate: number; maxPenalty: number; label: string }> = {
  'AOC-4': { dailyRate: 100, maxPenalty: 1000000, label: 'AOC-4 (Financial Statements)' },
  'MGT-7': { dailyRate: 100, maxPenalty: 500000, label: 'MGT-7 (Annual Return)' },
  'MGT-7A': { dailyRate: 100, maxPenalty: 500000, label: 'MGT-7A (Small Companies Annual Return)' },
  'LLP Form 8': { dailyRate: 100, maxPenalty: 500000, label: 'LLP Form 8 (Statement of Account & Solvency)' },
  'LLP Form 11': { dailyRate: 100, maxPenalty: 500000, label: 'LLP Form 11 (Annual Return)' },
}

function calculateMCAPenalty(formsSelected: FormType[], daysLate: number): Record<FormType, number> {
  const penalties: Record<FormType, number> = { 'AOC-4': 0, 'MGT-7': 0, 'MGT-7A': 0, 'LLP Form 8': 0, 'LLP Form 11': 0 }
  for (const form of formsSelected) {
    const rate = PENALTY_RATES[form]
    penalties[form] = Math.min(rate.dailyRate * daysLate, rate.maxPenalty)
  }
  return penalties
}

function MCACalculatorInner() {
  const searchParams = useSearchParams()
  const [entityType, setEntityType] = useState<EntityType>((searchParams.get('entity') as EntityType) || 'pvt_ltd')
  const [formsSelected, setFormsSelected] = useState<FormType[]>(() => {
    const formsParam = searchParams.get('forms')
    if (formsParam) return formsParam.split(',') as FormType[]
    return entityType === 'llp' ? ['LLP Form 8', 'LLP Form 11'] : ['AOC-4', 'MGT-7']
  })
  const [daysLate, setDaysLate] = useState(safeParseInt(searchParams.get('days'), 30))
  const [yearsInDefault, setYearsInDefault] = useState(safeParseInt(searchParams.get('years'), 1))
  const [numberOfDirectors, setNumberOfDirectors] = useState(safeParseInt(searchParams.get('directors'), 2))
  const [paidUpCapital, setPaidUpCapital] = useState<string>(searchParams.get('capital') || 'under_10l')

  const availableForms = useMemo((): FormType[] => {
    if (entityType === 'llp') return ['LLP Form 8', 'LLP Form 11']
    if (entityType === 'pvt_ltd' && paidUpCapital === 'under_10l') return ['AOC-4', 'MGT-7', 'MGT-7A']
    return ['AOC-4', 'MGT-7']
  }, [entityType, paidUpCapital])

  useEffect(() => {
    if (entityType === 'llp') setFormsSelected(['LLP Form 8', 'LLP Form 11'])
    else setFormsSelected(['AOC-4', 'MGT-7'])
  }, [entityType])

  const penalties = useMemo(() => calculateMCAPenalty(formsSelected, daysLate), [formsSelected, daysLate])
  const totalPenalty = useMemo(() => Object.values(penalties).reduce((sum, p) => sum + p, 0), [penalties])
  const showDisqualificationWarning = yearsInDefault >= 3 || daysLate > 1095
  const showStrikeOffWarning = daysLate > 365

  useEffect(() => {
    const params = new URLSearchParams()
    params.set('entity', entityType)
    params.set('forms', formsSelected.join(','))
    params.set('days', daysLate.toString())
    params.set('years', yearsInDefault.toString())
    params.set('directors', numberOfDirectors.toString())
    params.set('capital', paidUpCapital)
    const newUrl = `${window.location.pathname}?${params.toString()}`
    window.history.replaceState(null, '', newUrl)
  }, [entityType, formsSelected, daysLate, yearsInDefault, numberOfDirectors, paidUpCapital])

  const toggleForm = (form: FormType) => {
    setFormsSelected(prev => prev.includes(form) ? prev.filter(f => f !== form) : [...prev, form])
  }

  const breakdown = useMemo(() => {
    return formsSelected.filter(form => penalties[form] > 0).map(form => ({
      label: PENALTY_RATES[form].label,
      amount: penalties[form],
      subItems: [
        { label: `Rs.${PENALTY_RATES[form].dailyRate}/day x ${daysLate} days`, amount: PENALTY_RATES[form].dailyRate * daysLate },
        ...(penalties[form] >= PENALTY_RATES[form].maxPenalty ? [{ label: `Capped at Rs.${(PENALTY_RATES[form].maxPenalty / 100000).toFixed(0)} Lakh`, amount: 0 }] : []),
      ],
      statuteShort: entityType === 'llp' ? 'LLP Act' : 'Sec 92/137',
      statuteFull: entityType === 'llp' ? 'Limited Liability Partnership Act, 2008' : 'Section 92 and Section 137, Companies Act 2013',
    }))
  }, [formsSelected, penalties, daysLate, entityType])

  return (
    <div className="grid lg:grid-cols-[1.2fr,1fr] gap-10">
      <div className="rounded-xl border border-border bg-card p-6 space-y-8">
        <div className="space-y-6">
          <div className="space-y-1.5">
            <Label>Entity Type</Label>
            <Select value={entityType} onValueChange={(v) => setEntityType(v as EntityType)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="pvt_ltd">Private Limited Company</SelectItem>
                <SelectItem value="public_ltd">Public Limited Company</SelectItem>
                <SelectItem value="llp">LLP</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label>Forms Pending</Label>
            <div className="grid gap-3">
              {availableForms.map((form) => (
                <label key={form} className="flex items-start gap-3 cursor-pointer">
                  <Checkbox checked={formsSelected.includes(form)} onCheckedChange={() => toggleForm(form)} className="mt-0.5" />
                  <div>
                    <span className="text-sm font-medium">{PENALTY_RATES[form].label}</span>
                    <p className="text-xs text-muted-foreground">Rs.{PENALTY_RATES[form].dailyRate}/day, max Rs.{(PENALTY_RATES[form].maxPenalty / 100000).toFixed(0)} Lakh</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <DaysLateSlider value={daysLate} onChange={setDaysLate} label="Days Late" maxDays={1095} />

          <Accordion type="single" collapsible>
            <AccordionItem value="advanced" className="border-t border-border/50 border-b-0">
              <AccordionTrigger className="text-sm text-muted-foreground hover:text-foreground hover:no-underline py-4">
                <span className="flex items-center gap-2"><SlidersHorizontal className="h-3.5 w-3.5" />Advanced options</span>
              </AccordionTrigger>
              <AccordionContent className="space-y-6 pt-4">
                <div className="space-y-1.5">
                  <Label>Number of Years in Default</Label>
                  <Select value={yearsInDefault.toString()} onValueChange={(v) => setYearsInDefault(parseInt(v))}>
                    <SelectTrigger className="max-w-[200px]"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(y => (<SelectItem key={y} value={y.toString()}>{y} year{y > 1 ? 's' : ''}</SelectItem>))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="directors">Number of Directors</Label>
                  <Input id="directors" type="number" min={1} max={50} value={numberOfDirectors} onChange={(e) => setNumberOfDirectors(Math.max(1, Math.min(50, parseInt(e.target.value) || 1)))} className="max-w-[200px]" />
                </div>
                {entityType === 'pvt_ltd' && (
                  <div className="space-y-1.5">
                    <Label>Paid-up Share Capital</Label>
                    <Select value={paidUpCapital} onValueChange={setPaidUpCapital}>
                      <SelectTrigger className="max-w-[200px]"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="under_10l">Under Rs.10 Lakh</SelectItem>
                        <SelectItem value="10l_50l">Rs.10 Lakh - Rs.50 Lakh</SelectItem>
                        <SelectItem value="50l_1cr">Rs.50 Lakh - Rs.1 Crore</SelectItem>
                        <SelectItem value="above_1cr">Above Rs.1 Crore</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>

      <div className="lg:sticky lg:top-24 lg:self-start">
        <ResultsPanel total={totalPenalty} breakdown={breakdown} dueDate={entityType === 'llp' ? 'Form 8: 30 October, Form 11: 30 May' : 'AOC-4: 30 days after AGM, MGT-7: 60 days after AGM'} statute={entityType === 'llp' ? 'LLP Act 2008' : 'Companies Act 2013, Section 92 & 137'} ctaText="File MCA Returns" ctaHref="/services/mca-annual-filing" showCta={totalPenalty > 0} docChecklistHref={entityType === 'llp' ? '/tools/documents/llp' : '/tools/documents/private-limited-company'} docChecklistText={entityType === 'llp' ? 'LLP filing documents' : 'Company filing documents'}>
          {daysLate > 30 && (<WarningBanner variant="yellow" title="Penalty increasing daily" body="MCA levies Rs.100 per day per form." />)}
          {daysLate > 180 && (<WarningBanner variant="yellow" title="RoC Inquiry Risk" body="Prolonged non-filing may trigger RoC inquiry." />)}
          {showStrikeOffWarning && (<WarningBanner variant="red" title="STRIKE-OFF RISK" body="RoC can initiate strike-off for companies that have not filed for 2 consecutive years." />)}
          {showDisqualificationWarning && (<WarningBanner variant="red" title="DIRECTOR DISQUALIFICATION" body={`Section 164(2) disqualifies every director for 5 years.`} />)}
        </ResultsPanel>
      </div>
    </div>
  )
}

export function CalculatorSkeleton() {
  return (<div className="grid lg:grid-cols-[1.5fr,1fr] gap-8 animate-pulse"><div className="bg-muted rounded-lg h-[600px]" /><div className="bg-muted rounded-lg h-[450px]" /></div>)
}

export function MCAFilingCalculator() {
  return (<Suspense fallback={<CalculatorSkeleton />}><MCACalculatorInner /></Suspense>)
}
```

---

*See allcontentcheck4.md for calculators 4-10*
