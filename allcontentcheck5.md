# Penalty Calculator Components - Part 3 (Calculators 7-10)

Continuation from allcontentcheck4.md

---

## 7. PFESICCalculator.tsx

```typescript
'use client'

import { useState, useMemo, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { SlidersHorizontal } from 'lucide-react'
import { EmployeeCountSlider, MonthsLateSlider, RupeeInput, ResultsPanel, WarningBanner, InfoBanner } from '@/components/penalty-calculator'
import { safeParseInt } from '@/lib/parse-url-params'

type DefaultType = 'pf_only' | 'esic_only' | 'both'

function getPFDamageRate(months: number): number {
  if (months < 2) return 0.05
  if (months < 4) return 0.10
  if (months < 6) return 0.15
  return 0.25
}
function getPFDamageRateLabel(months: number): string {
  if (months < 2) return '5% p.a.'
  if (months < 4) return '10% p.a.'
  if (months < 6) return '15% p.a.'
  return '25% p.a.'
}

interface CalculationResult { monthlyPF: number; monthlyESIC: number; totalPFArrears: number; totalESICArrears: number; pfDamages: number; esicInterest: number; total: number; pfDamageRate: number; pfDamageRateLabel: string }

function calculatePFESICPenalty(employeeCount: number, avgMonthlySalary: number, monthsLate: number, defaultType: DefaultType, monthlyPFOverride: number | null, monthlyESICOverride: number | null): CalculationResult {
  const autoMonthlyPF = Math.round(avgMonthlySalary * employeeCount * 0.12)
  const autoMonthlyESIC = avgMonthlySalary <= 21000 ? Math.round(avgMonthlySalary * employeeCount * 0.0325) : 0
  const monthlyPF = monthlyPFOverride ?? autoMonthlyPF
  const monthlyESIC = monthlyESICOverride ?? autoMonthlyESIC
  const totalPFArrears = monthlyPF * monthsLate
  const totalESICArrears = monthlyESIC * monthsLate
  const pfDamageRate = getPFDamageRate(monthsLate)
  const pfDamages = defaultType !== 'esic_only' ? Math.round(monthlyPF * pfDamageRate * (monthsLate / 12)) : 0
  const esicInterest = defaultType !== 'pf_only' && employeeCount >= 10 ? Math.round(totalESICArrears * 0.12 * (monthsLate / 12)) : 0
  return { monthlyPF, monthlyESIC, totalPFArrears: defaultType !== 'esic_only' ? totalPFArrears : 0, totalESICArrears: defaultType !== 'pf_only' && employeeCount >= 10 ? totalESICArrears : 0, pfDamages, esicInterest, total: pfDamages + esicInterest, pfDamageRate, pfDamageRateLabel: getPFDamageRateLabel(monthsLate) }
}

function PFESICCalculatorInner() {
  const searchParams = useSearchParams()
  const [employeeCount, setEmployeeCount] = useState(safeParseInt(searchParams.get('employees'), 25))
  const [avgMonthlySalary, setAvgMonthlySalary] = useState(safeParseInt(searchParams.get('salary'), 20000))
  const [monthsLate, setMonthsLate] = useState(safeParseInt(searchParams.get('months'), 3))
  const [defaultType, setDefaultType] = useState<DefaultType>((searchParams.get('type') as DefaultType) || 'both')
  const [monthlyPFOverride, setMonthlyPFOverride] = useState<number | null>(null)
  const [monthlyESICOverride, setMonthlyESICOverride] = useState<number | null>(null)
  const [showCauseNotice, setShowCauseNotice] = useState(searchParams.get('notice') === 'true')

  const result = useMemo(() => calculatePFESICPenalty(employeeCount, avgMonthlySalary, monthsLate, defaultType, monthlyPFOverride, monthlyESICOverride), [employeeCount, avgMonthlySalary, monthsLate, defaultType, monthlyPFOverride, monthlyESICOverride])
  const isPFMandatory = employeeCount >= 20
  const isESICApplicable = employeeCount >= 10
  const isHighSalaryWarning = avgMonthlySalary > 21000 && isESICApplicable

  useEffect(() => {
    const params = new URLSearchParams()
    params.set('employees', employeeCount.toString()); params.set('salary', avgMonthlySalary.toString()); params.set('months', monthsLate.toString()); params.set('type', defaultType); params.set('notice', showCauseNotice.toString())
    window.history.replaceState(null, '', `${window.location.pathname}?${params.toString()}`)
  }, [employeeCount, avgMonthlySalary, monthsLate, defaultType, showCauseNotice])

  const breakdown = useMemo(() => {
    const items = []
    if (result.pfDamages > 0) items.push({ label: 'PF Damages (Section 14B)', amount: result.pfDamages, subItems: [{ label: `Monthly PF: Rs.${result.monthlyPF.toLocaleString('en-IN')}`, amount: 0 }, { label: `Rate: ${result.pfDamageRateLabel} for ${monthsLate} months`, amount: result.pfDamages }], statuteShort: 'Sec 14B', statuteFull: "Section 14B of Employees' Provident Funds Act, 1952" })
    if (result.esicInterest > 0) items.push({ label: 'ESIC Interest (Section 85B)', amount: result.esicInterest, subItems: [{ label: `Monthly ESIC: Rs.${result.monthlyESIC.toLocaleString('en-IN')}`, amount: 0 }, { label: `12% p.a. for ${monthsLate} months`, amount: result.esicInterest }], statuteShort: 'Sec 85B', statuteFull: "Section 85B of Employees' State Insurance Act, 1948" })
    return items
  }, [result, monthsLate])

  return (
    <div className="grid lg:grid-cols-[1.2fr,1fr] gap-10">
      <div className="rounded-xl border border-border bg-card p-6 space-y-8">
        <div className="space-y-6">
          <EmployeeCountSlider value={employeeCount} onChange={setEmployeeCount} label="Number of Employees" />
          {!isPFMandatory && (<InfoBanner title="Voluntary PF Registration" body="PF registration is mandatory for establishments with 20+ employees. Below 20, registration is voluntary." />)}
          {!isESICApplicable && (<InfoBanner title="ESIC Not Applicable" body="ESIC applies to establishments with 10+ employees." />)}
          <RupeeInput value={avgMonthlySalary} onChange={setAvgMonthlySalary} label="Average Monthly Salary (Rs.)" helpText="Gross salary per employee" />
          {isHighSalaryWarning && (<InfoBanner title="ESIC Salary Limit" body="ESIC only applies to employees earning up to Rs.21,000 per month." />)}
          <MonthsLateSlider value={monthsLate} onChange={setMonthsLate} label="Months of Default" />
          <div className="space-y-3">
            <Label>Type of Default</Label>
            <RadioGroup value={defaultType} onValueChange={(v) => setDefaultType(v as DefaultType)} className="space-y-2">
              <div className="flex items-center space-x-2"><RadioGroupItem value="both" id="both" /><Label htmlFor="both" className="font-normal cursor-pointer">Both PF and ESIC</Label></div>
              <div className="flex items-center space-x-2"><RadioGroupItem value="pf_only" id="pf_only" /><Label htmlFor="pf_only" className="font-normal cursor-pointer">PF only</Label></div>
              {isESICApplicable && (<div className="flex items-center space-x-2"><RadioGroupItem value="esic_only" id="esic_only" /><Label htmlFor="esic_only" className="font-normal cursor-pointer">ESIC only</Label></div>)}
            </RadioGroup>
          </div>
          <Accordion type="single" collapsible>
            <AccordionItem value="advanced" className="border-t border-border/50 border-b-0">
              <AccordionTrigger className="text-sm text-muted-foreground hover:text-foreground hover:no-underline py-4"><span className="flex items-center gap-2"><SlidersHorizontal className="h-3.5 w-3.5" />Advanced options</span></AccordionTrigger>
              <AccordionContent className="space-y-6 pt-4">
                <RupeeInput value={monthlyPFOverride ?? result.monthlyPF} onChange={(v) => setMonthlyPFOverride(v)} label="Monthly PF Contribution (Rs.)" helpText={`Auto-calculated: Rs.${result.monthlyPF.toLocaleString('en-IN')}`} />
                {isESICApplicable && (<RupeeInput value={monthlyESICOverride ?? result.monthlyESIC} onChange={(v) => setMonthlyESICOverride(v)} label="Monthly ESIC Contribution (Rs.)" helpText={`Auto-calculated: Rs.${result.monthlyESIC.toLocaleString('en-IN')}`} />)}
                <div className="flex items-center justify-between"><div><Label>Was a Show-Cause Notice Issued?</Label><p className="text-xs text-muted-foreground mt-0.5">Indicates advanced stage of proceedings</p></div><Switch checked={showCauseNotice} onCheckedChange={setShowCauseNotice} /></div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
      <div className="lg:sticky lg:top-24 lg:self-start">
        <ResultsPanel total={result.total} breakdown={breakdown} dueDate="15th of the following month" statute="EPF Act 1952, ESI Act 1948" ctaText="Get PF/ESIC Compliance Help" ctaHref="/services/payroll-compliance" showCta={result.total > 0}>
          {(result.totalPFArrears > 0 || result.totalESICArrears > 0) && (<InfoBanner title="Total Arrears (Principal)" body={`PF: Rs.${result.totalPFArrears.toLocaleString('en-IN')} | ESIC: Rs.${result.totalESICArrears.toLocaleString('en-IN')}. Payable in addition to penalty.`} />)}
          {monthsLate >= 6 && defaultType !== 'esic_only' && (<WarningBanner variant="red" title="Maximum Damage Rate Applied" body="At 6+ months, PF damages are 25% per annum. EPFO can also initiate prosecution." />)}
          {monthsLate > 12 && (<WarningBanner variant="red" title="Criminal Prosecution Risk" body="EPFO can file criminal complaint. Penalty can include imprisonment up to 3 years." />)}
          {showCauseNotice && (<WarningBanner variant="yellow" title="Show-Cause Notice Issued" body="Respond within the deadline and pay dues immediately to avoid prosecution." />)}
        </ResultsPanel>
      </div>
    </div>
  )
}

export function CalculatorSkeleton() { return (<div className="grid lg:grid-cols-[1.5fr,1fr] gap-8 animate-pulse"><div className="bg-muted rounded-lg h-[600px]" /><div className="bg-muted rounded-lg h-[450px]" /></div>) }
export function PFESICCalculator() { return (<Suspense fallback={<CalculatorSkeleton />}><PFESICCalculatorInner /></Suspense>) }
```

---

## 8. ProfessionalTaxCalculator.tsx

```typescript
'use client'

import { useState, useMemo, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { SlidersHorizontal, AlertTriangle } from 'lucide-react'
import { EmployeeCountSlider, MonthsLateSlider, RupeeInput, ResultsPanel, WarningBanner, InfoBanner } from '@/components/penalty-calculator'
import { safeParseInt } from '@/lib/parse-url-params'

interface PTStateInfo { name: string; maxAnnualPT: number; penaltyType: 'percent_per_month' | 'flat_percent' | 'percent_plus_interest'; penaltyRate: number; interestRate?: number; penaltyDescription: string }

const PT_STATES: Record<string, PTStateInfo> = {
  'Maharashtra': { name: 'Maharashtra', maxAnnualPT: 2500, penaltyType: 'percent_per_month', penaltyRate: 0.10, penaltyDescription: '10% of tax due per month' },
  'Karnataka': { name: 'Karnataka', maxAnnualPT: 2400, penaltyType: 'percent_per_month', penaltyRate: 0.02, penaltyDescription: '2% per month' },
  'West Bengal': { name: 'West Bengal', maxAnnualPT: 2500, penaltyType: 'flat_percent', penaltyRate: 0.25, penaltyDescription: '25% of tax due (flat)' },
  'Andhra Pradesh': { name: 'Andhra Pradesh', maxAnnualPT: 2400, penaltyType: 'flat_percent', penaltyRate: 0.25, penaltyDescription: '25% of tax due (flat)' },
  'Telangana': { name: 'Telangana', maxAnnualPT: 2400, penaltyType: 'flat_percent', penaltyRate: 0.25, penaltyDescription: '25% of tax due (flat)' },
  'Tamil Nadu': { name: 'Tamil Nadu', maxAnnualPT: 2400, penaltyType: 'percent_plus_interest', penaltyRate: 0.10, interestRate: 0.02, penaltyDescription: '10% penalty + 2% per month interest' },
  'Gujarat': { name: 'Gujarat', maxAnnualPT: 2500, penaltyType: 'percent_per_month', penaltyRate: 0.02, penaltyDescription: '2% per month' },
  'Assam': { name: 'Assam', maxAnnualPT: 2500, penaltyType: 'percent_per_month', penaltyRate: 0.02, penaltyDescription: '2% per month' },
  'Kerala': { name: 'Kerala', maxAnnualPT: 2400, penaltyType: 'percent_per_month', penaltyRate: 0.01, penaltyDescription: '12% per annum (1% per month)' },
  'Odisha': { name: 'Odisha', maxAnnualPT: 2400, penaltyType: 'percent_per_month', penaltyRate: 0.02, penaltyDescription: '2% per month' },
}

const NON_PT_STATES = ['Delhi', 'Uttar Pradesh', 'Rajasthan', 'Haryana', 'Punjab', 'Himachal Pradesh', 'Uttarakhand', 'Jammu and Kashmir', 'Ladakh', 'Chandigarh', 'Goa', 'Bihar', 'Jharkhand', 'Chhattisgarh', 'Madhya Pradesh', 'Arunachal Pradesh', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Sikkim', 'Tripura', 'Andaman and Nicobar Islands', 'Dadra and Nagar Haveli', 'Daman and Diu', 'Lakshadweep', 'Puducherry']
const ALL_STATES = [...Object.keys(PT_STATES), ...NON_PT_STATES].sort()

interface CalculationResult { monthlyPTDue: number; totalPTDue: number; penalty: number; interest: number; total: number; penaltyDescription: string }

function calculatePTPenalty(state: string, employeeCount: number, avgMonthlySalary: number, monthsLate: number, monthlyPTOverride: number | null): CalculationResult | null {
  const stateInfo = PT_STATES[state]
  if (!stateInfo) return null
  const autoMonthlyPT = Math.round((stateInfo.maxAnnualPT / 12) * employeeCount)
  const monthlyPTDue = monthlyPTOverride ?? autoMonthlyPT
  const totalPTDue = monthlyPTDue * monthsLate
  let penalty = 0, interest = 0
  switch (stateInfo.penaltyType) {
    case 'percent_per_month': penalty = Math.round(totalPTDue * stateInfo.penaltyRate * monthsLate); break
    case 'flat_percent': penalty = Math.round(totalPTDue * stateInfo.penaltyRate); break
    case 'percent_plus_interest': penalty = Math.round(totalPTDue * stateInfo.penaltyRate); interest = Math.round(totalPTDue * (stateInfo.interestRate || 0) * monthsLate); break
  }
  return { monthlyPTDue, totalPTDue, penalty, interest, total: penalty + interest, penaltyDescription: stateInfo.penaltyDescription }
}

function ProfessionalTaxCalculatorInner() {
  const searchParams = useSearchParams()
  const [state, setState] = useState(searchParams.get('state') || 'Maharashtra')
  const [employeeCount, setEmployeeCount] = useState(safeParseInt(searchParams.get('employees'), 25))
  const [avgMonthlySalary, setAvgMonthlySalary] = useState(safeParseInt(searchParams.get('salary'), 30000))
  const [monthsLate, setMonthsLate] = useState(safeParseInt(searchParams.get('months'), 3))
  const [monthlyPTOverride, setMonthlyPTOverride] = useState<number | null>(null)

  const isPTState = state in PT_STATES
  const stateInfo = PT_STATES[state]
  const result = useMemo(() => isPTState ? calculatePTPenalty(state, employeeCount, avgMonthlySalary, monthsLate, monthlyPTOverride) : null, [state, employeeCount, avgMonthlySalary, monthsLate, monthlyPTOverride, isPTState])

  useEffect(() => {
    const params = new URLSearchParams()
    params.set('state', state); params.set('employees', employeeCount.toString()); params.set('salary', avgMonthlySalary.toString()); params.set('months', monthsLate.toString())
    window.history.replaceState(null, '', `${window.location.pathname}?${params.toString()}`)
  }, [state, employeeCount, avgMonthlySalary, monthsLate])

  const breakdown = useMemo(() => {
    if (!result) return []
    const items = [{ label: 'Penalty', amount: result.penalty, subItems: [{ label: `PT Due: Rs.${result.totalPTDue.toLocaleString('en-IN')}`, amount: 0 }, { label: result.penaltyDescription, amount: result.penalty }], statuteShort: `${state} PT Act`, statuteFull: `${state} Professional Tax Act` }]
    if (result.interest > 0) items.push({ label: 'Interest', amount: result.interest, subItems: [{ label: `2% per month x ${monthsLate} months`, amount: result.interest }], statuteShort: `${state} PT Act`, statuteFull: `${state} Professional Tax Act` })
    return items
  }, [result, state, monthsLate])

  return (
    <div className="grid lg:grid-cols-[1.2fr,1fr] gap-10">
      <div className="rounded-xl border border-border bg-card p-6 space-y-8">
        <div className="space-y-6">
          <div className="space-y-1.5">
            <Label>State of Registration</Label>
            <Select value={state} onValueChange={setState}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{ALL_STATES.map((s) => (<SelectItem key={s} value={s}>{s} {s in PT_STATES ? '' : '(No PT)'}</SelectItem>))}</SelectContent></Select>
            {isPTState && stateInfo && (<p className="text-xs text-muted-foreground">Max PT: Rs.{stateInfo.maxAnnualPT}/year | Penalty: {stateInfo.penaltyDescription}</p>)}
          </div>
          {!isPTState && (
            <div className="p-6 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-100">
              <div className="flex items-start gap-3"><AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5" /><div><p className="font-semibold">Professional Tax is not levied in {state}</p><p className="text-sm mt-1">This calculator does not apply. Only certain states levy Professional Tax.</p></div></div>
            </div>
          )}
          {isPTState && (<>
            <EmployeeCountSlider value={employeeCount} onChange={setEmployeeCount} label="Number of Employees" />
            <RupeeInput value={avgMonthlySalary} onChange={setAvgMonthlySalary} label="Average Monthly Salary (Rs.)" helpText="Used to estimate PT liability" />
            <MonthsLateSlider value={monthsLate} onChange={setMonthsLate} label="Months of Default" />
            <Accordion type="single" collapsible>
              <AccordionItem value="advanced" className="border-t border-border/50 border-b-0">
                <AccordionTrigger className="text-sm text-muted-foreground hover:text-foreground hover:no-underline py-4"><span className="flex items-center gap-2"><SlidersHorizontal className="h-3.5 w-3.5" />Advanced options</span></AccordionTrigger>
                <AccordionContent className="space-y-6 pt-4"><RupeeInput value={monthlyPTOverride ?? (result?.monthlyPTDue || 0)} onChange={(v) => setMonthlyPTOverride(v)} label="Monthly PT Due (Rs.)" helpText={`Auto-calculated based on max PT of Rs.${stateInfo?.maxAnnualPT}/year`} /></AccordionContent>
              </AccordionItem>
            </Accordion>
          </>)}
        </div>
      </div>
      <div className="lg:sticky lg:top-24 lg:self-start">
        {isPTState && result ? (
          <ResultsPanel total={result.total} breakdown={breakdown} dueDate="Varies by state (typically monthly or quarterly)" statute={`${state} Professional Tax Act`} ctaText="Get PT Compliance Help" ctaHref="/services/payroll-compliance" showCta={result.total > 0}>
            <InfoBanner title="Total PT Due (Principal)" body={`Rs.${result.totalPTDue.toLocaleString('en-IN')} for ${monthsLate} months. Payable in addition to penalty.`} />
            {monthsLate > 6 && (<WarningBanner variant="yellow" title="Extended Default Period" body="Prolonged non-payment may attract additional scrutiny." />)}
          </ResultsPanel>
        ) : (<Card className="p-6"><p className="text-muted-foreground text-center">Select a PT-applicable state to calculate penalty</p></Card>)}
      </div>
    </div>
  )
}

export function CalculatorSkeleton() { return (<div className="grid lg:grid-cols-[1.5fr,1fr] gap-8 animate-pulse"><div className="bg-muted rounded-lg h-[500px]" /><div className="bg-muted rounded-lg h-[400px]" /></div>) }
export function ProfessionalTaxCalculator() { return (<Suspense fallback={<CalculatorSkeleton />}><ProfessionalTaxCalculatorInner /></Suspense>) }
```

---

## 9. ShopsEstablishmentCalculator.tsx

```typescript
'use client'

import { useState, useMemo, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { SlidersHorizontal } from 'lucide-react'
import { EmployeeCountSlider, MonthsLateSlider, ResultsPanel, InfoBanner, WarningBanner } from '@/components/penalty-calculator'
import { safeParseInt } from '@/lib/parse-url-params'

type DefaultType = 'not_registered' | 'not_renewed' | 'outside_hours'

interface StatePenaltyData { name: string; firstOffence: { min: number; max: number }; repeatOffence: { min: number; max: number }; notes?: string }

const statePenalties: Record<string, StatePenaltyData> = {
  maharashtra: { name: 'Maharashtra', firstOffence: { min: 1000, max: 5000 }, repeatOffence: { min: 5000, max: 10000 }, notes: 'Under Maharashtra Shops and Establishments Act, 2017' },
  karnataka: { name: 'Karnataka', firstOffence: { min: 500, max: 3000 }, repeatOffence: { min: 3000, max: 10000 }, notes: 'Under Karnataka Shops and Commercial Establishments Act, 1961' },
  delhi: { name: 'Delhi', firstOffence: { min: 500, max: 2500 }, repeatOffence: { min: 2500, max: 5000 }, notes: 'Under Delhi Shops and Establishments Act, 1954' },
  tamil_nadu: { name: 'Tamil Nadu', firstOffence: { min: 500, max: 5000 }, repeatOffence: { min: 5000, max: 10000 }, notes: 'Under Tamil Nadu Shops and Establishments Act, 1947' },
  gujarat: { name: 'Gujarat', firstOffence: { min: 500, max: 3000 }, repeatOffence: { min: 3000, max: 10000 }, notes: 'Under Gujarat Shops and Establishments Act, 2019' },
  west_bengal: { name: 'West Bengal', firstOffence: { min: 500, max: 2000 }, repeatOffence: { min: 2000, max: 5000 }, notes: 'Under West Bengal Shops and Establishments Act, 1963' },
}

const majorStates = Object.keys(statePenalties)
const allStates = [
  { value: 'maharashtra', label: 'Maharashtra' }, { value: 'karnataka', label: 'Karnataka' }, { value: 'delhi', label: 'Delhi' }, { value: 'tamil_nadu', label: 'Tamil Nadu' }, { value: 'gujarat', label: 'Gujarat' }, { value: 'west_bengal', label: 'West Bengal' },
  { value: 'andhra_pradesh', label: 'Andhra Pradesh' }, { value: 'telangana', label: 'Telangana' }, { value: 'uttar_pradesh', label: 'Uttar Pradesh' }, { value: 'madhya_pradesh', label: 'Madhya Pradesh' }, { value: 'rajasthan', label: 'Rajasthan' }, { value: 'bihar', label: 'Bihar' },
  { value: 'kerala', label: 'Kerala' }, { value: 'punjab', label: 'Punjab' }, { value: 'haryana', label: 'Haryana' }, { value: 'odisha', label: 'Odisha' }, { value: 'assam', label: 'Assam' }, { value: 'jharkhand', label: 'Jharkhand' },
  { value: 'chhattisgarh', label: 'Chhattisgarh' }, { value: 'uttarakhand', label: 'Uttarakhand' }, { value: 'himachal_pradesh', label: 'Himachal Pradesh' }, { value: 'goa', label: 'Goa' }, { value: 'other', label: 'Other State/UT' },
]

interface CalculationResult { penaltyMin: number; penaltyMax: number; isExactPenalty: boolean; stateName: string; notes: string }

function calculateShopsEstablishmentPenalty(state: string, defaultType: DefaultType, employeeCount: number, monthsLate: number): CalculationResult {
  const isMajorState = majorStates.includes(state)
  const stateData = statePenalties[state]
  if (isMajorState && stateData) {
    const isRepeatOffence = monthsLate > 12
    const penalty = isRepeatOffence ? stateData.repeatOffence : stateData.firstOffence
    let multiplier = 1
    if (employeeCount > 50) multiplier = 1.5
    if (employeeCount > 100) multiplier = 2
    return { penaltyMin: Math.round(penalty.min * multiplier), penaltyMax: Math.round(penalty.max * multiplier), isExactPenalty: true, stateName: stateData.name, notes: stateData.notes || '' }
  } else {
    return { penaltyMin: 200, penaltyMax: monthsLate > 12 ? 10000 : 5000, isExactPenalty: false, stateName: allStates.find((s) => s.value === state)?.label || state, notes: 'Penalty typically Rs.200-Rs.5,000 for first offence, up to Rs.10,000 for repeat.' }
  }
}

function ShopsEstablishmentCalculatorInner() {
  const searchParams = useSearchParams()
  const [state, setState] = useState(searchParams.get('state') || 'maharashtra')
  const [defaultType, setDefaultType] = useState<DefaultType>((searchParams.get('type') as DefaultType) || 'not_registered')
  const [employeeCount, setEmployeeCount] = useState(safeParseInt(searchParams.get('employees'), 5))
  const [monthsLate, setMonthsLate] = useState(safeParseInt(searchParams.get('months'), 3))

  const result = useMemo(() => calculateShopsEstablishmentPenalty(state, defaultType, employeeCount, monthsLate), [state, defaultType, employeeCount, monthsLate])

  useEffect(() => {
    const params = new URLSearchParams()
    params.set('state', state); params.set('type', defaultType); params.set('employees', employeeCount.toString()); params.set('months', monthsLate.toString())
    window.history.replaceState(null, '', `${window.location.pathname}?${params.toString()}`)
  }, [state, defaultType, employeeCount, monthsLate])

  const breakdown = useMemo(() => [{ label: `S&E Penalty (${result.stateName})`, amount: result.penaltyMax, subItems: [{ label: `Range: Rs.${result.penaltyMin.toLocaleString('en-IN')} - Rs.${result.penaltyMax.toLocaleString('en-IN')}`, amount: 0 }], statuteShort: 'S&E Act', statuteFull: `${result.notes || 'State Shops and Establishments Act'}` }], [result])

  const showRepeatWarning = monthsLate > 12

  return (
    <div className="grid lg:grid-cols-[1.2fr,1fr] gap-10">
      <div className="rounded-xl border border-border bg-card p-6 space-y-8">
        <div className="space-y-6">
          <div className="space-y-1.5"><Label>State</Label><Select value={state} onValueChange={setState}><SelectTrigger><SelectValue placeholder="Select state" /></SelectTrigger><SelectContent>{allStates.map((s) => (<SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>))}</SelectContent></Select></div>
          <div className="space-y-3">
            <Label>Type of Default</Label>
            <RadioGroup value={defaultType} onValueChange={(v) => setDefaultType(v as DefaultType)} className="space-y-2">
              <div className="flex items-center space-x-2"><RadioGroupItem value="not_registered" id="not_registered" /><Label htmlFor="not_registered" className="font-normal cursor-pointer">Not registered</Label></div>
              <div className="flex items-center space-x-2"><RadioGroupItem value="not_renewed" id="not_renewed" /><Label htmlFor="not_renewed" className="font-normal cursor-pointer">Registered but not renewed</Label></div>
              <div className="flex items-center space-x-2"><RadioGroupItem value="outside_hours" id="outside_hours" /><Label htmlFor="outside_hours" className="font-normal cursor-pointer">Operating outside permitted hours</Label></div>
            </RadioGroup>
          </div>
          <EmployeeCountSlider value={employeeCount} onChange={setEmployeeCount} maxCount={10000} />
          <MonthsLateSlider value={monthsLate} onChange={setMonthsLate} maxMonths={60} label="Months of Default" />
          <Accordion type="single" collapsible>
            <AccordionItem value="advanced" className="border-t border-border/50 border-b-0">
              <AccordionTrigger className="text-sm text-muted-foreground hover:text-foreground hover:no-underline py-4"><span className="flex items-center gap-2"><SlidersHorizontal className="h-3.5 w-3.5" />Advanced options</span></AccordionTrigger>
              <AccordionContent className="space-y-4 pt-4"><p className="text-sm text-muted-foreground">Shops and Establishment penalties vary significantly by state. This calculator shows exact penalties for major states.</p>{result.notes && (<p className="text-sm text-muted-foreground">{result.notes}</p>)}</AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
      <div className="lg:sticky lg:top-24 lg:self-start">
        <ResultsPanel total={result.penaltyMax} breakdown={breakdown} statute={`Estimated range: Rs.${result.penaltyMin.toLocaleString('en-IN')} - Rs.${result.penaltyMax.toLocaleString('en-IN')}`} ctaText="Get S&E Registration" ctaHref="/services/shops-establishment-registration" showCta={result.penaltyMax > 0}>
          {showRepeatWarning && (<WarningBanner variant="yellow" title="Extended non-compliance" body="At over 12 months, this may be treated as a repeat offence with higher penalties." />)}
          {!result.isExactPenalty && (<InfoBanner title="State-specific rates unavailable" body={`We don't have exact penalty rates for ${result.stateName}.`} />)}
        </ResultsPanel>
      </div>
    </div>
  )
}

export function CalculatorSkeleton() { return (<div className="grid lg:grid-cols-[1.5fr,1fr] gap-8 animate-pulse"><div className="bg-muted rounded-lg h-[500px]" /><div className="bg-muted rounded-lg h-[350px]" /></div>) }
export function ShopsEstablishmentCalculator() { return (<Suspense fallback={<CalculatorSkeleton />}><ShopsEstablishmentCalculatorInner /></Suspense>) }
```

---

## 10. StartupDPIITCalculator.tsx

```typescript
'use client'

import { useState, useMemo, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Checkbox } from '@/components/ui/checkbox'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { SlidersHorizontal } from 'lucide-react'
import { MonthsLateSlider, RupeeInput, ResultsPanel, InfoBanner } from '@/components/penalty-calculator'
import { safeParseInt } from '@/lib/parse-url-params'

type ComplianceType = 'fc_gpr' | 'fc_trs' | 'esop' | 'angel_tax'

interface CalculationResult { fcGprPenaltyMin: number; fcGprPenaltyMax: number; fcTrsPenaltyMin: number; fcTrsPenaltyMax: number; esopPenaltyMin: number; esopPenaltyMax: number; totalMin: number; totalMax: number; showRange: boolean }

function calculateStartupPenalty(complianceTypes: ComplianceType[], foreignInvestmentAmount: number, monthsLate: number, isDPIITRecognised: boolean): CalculationResult {
  let fcGprPenaltyMin = 0, fcGprPenaltyMax = 0, fcTrsPenaltyMin = 0, fcTrsPenaltyMax = 0, esopPenaltyMin = 0, esopPenaltyMax = 0
  if (complianceTypes.includes('fc_gpr') && foreignInvestmentAmount > 0) { fcGprPenaltyMin = 5000; fcGprPenaltyMax = Math.round(foreignInvestmentAmount * 0.01); if (fcGprPenaltyMax < fcGprPenaltyMin) fcGprPenaltyMax = fcGprPenaltyMin }
  if (complianceTypes.includes('fc_trs') && foreignInvestmentAmount > 0) { fcTrsPenaltyMin = 5000; fcTrsPenaltyMax = Math.round(foreignInvestmentAmount * 0.01); if (fcTrsPenaltyMax < fcTrsPenaltyMin) fcTrsPenaltyMax = fcTrsPenaltyMin }
  if (complianceTypes.includes('esop') && foreignInvestmentAmount > 0) { esopPenaltyMin = 5000; esopPenaltyMax = Math.round(foreignInvestmentAmount * 0.005); if (esopPenaltyMax < esopPenaltyMin) esopPenaltyMax = esopPenaltyMin }
  const totalMin = fcGprPenaltyMin + fcTrsPenaltyMin + esopPenaltyMin
  const totalMax = fcGprPenaltyMax + fcTrsPenaltyMax + esopPenaltyMax
  return { fcGprPenaltyMin, fcGprPenaltyMax, fcTrsPenaltyMin, fcTrsPenaltyMax, esopPenaltyMin, esopPenaltyMax, totalMin, totalMax, showRange: totalMin !== totalMax }
}

function StartupDPIITCalculatorInner() {
  const searchParams = useSearchParams()
  const [complianceTypes, setComplianceTypes] = useState<ComplianceType[]>(() => {
    const types = searchParams.get('types')?.split(',') as ComplianceType[] || ['fc_gpr']
    return types.filter(t => ['fc_gpr', 'fc_trs', 'esop', 'angel_tax'].includes(t))
  })
  const [foreignInvestmentAmount, setForeignInvestmentAmount] = useState(safeParseInt(searchParams.get('amount'), 5000000))
  const [monthsLate, setMonthsLate] = useState(safeParseInt(searchParams.get('months'), 6))
  const [isDPIITRecognised, setIsDPIITRecognised] = useState(searchParams.get('dpiit') !== 'false')

  const result = useMemo(() => calculateStartupPenalty(complianceTypes, foreignInvestmentAmount, monthsLate, isDPIITRecognised), [complianceTypes, foreignInvestmentAmount, monthsLate, isDPIITRecognised])

  const toggleComplianceType = (type: ComplianceType) => { setComplianceTypes(prev => prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]) }

  useEffect(() => {
    const params = new URLSearchParams()
    params.set('types', complianceTypes.join(',')); params.set('amount', foreignInvestmentAmount.toString()); params.set('months', monthsLate.toString()); params.set('dpiit', isDPIITRecognised.toString())
    window.history.replaceState(null, '', `${window.location.pathname}?${params.toString()}`)
  }, [complianceTypes, foreignInvestmentAmount, monthsLate, isDPIITRecognised])

  const breakdown = useMemo(() => {
    const items = []
    if (result.fcGprPenaltyMax > 0) items.push({ label: 'FC-GPR Late Filing (FEMA)', amount: result.fcGprPenaltyMax, subItems: [{ label: `Range: Rs.${result.fcGprPenaltyMin.toLocaleString('en-IN')} - Rs.${result.fcGprPenaltyMax.toLocaleString('en-IN')}`, amount: 0 }], statuteShort: 'FEMA Sec 15', statuteFull: 'Section 15, FEMA 1999' })
    if (result.fcTrsPenaltyMax > 0) items.push({ label: 'FC-TRS Late Filing (FEMA)', amount: result.fcTrsPenaltyMax, subItems: [{ label: `Range: Rs.${result.fcTrsPenaltyMin.toLocaleString('en-IN')} - Rs.${result.fcTrsPenaltyMax.toLocaleString('en-IN')}`, amount: 0 }], statuteShort: 'FEMA Sec 15', statuteFull: 'Section 15, FEMA 1999' })
    if (result.esopPenaltyMax > 0) items.push({ label: 'ESOP Non-Compliance', amount: result.esopPenaltyMax, subItems: [{ label: `Range: Rs.${result.esopPenaltyMin.toLocaleString('en-IN')} - Rs.${result.esopPenaltyMax.toLocaleString('en-IN')}`, amount: 0 }], statuteShort: 'FEMA Sec 15', statuteFull: 'Section 15, FEMA 1999' })
    return items
  }, [result])

  const showAngelTaxInfo = complianceTypes.includes('angel_tax')
  const hasCalculablePenalty = complianceTypes.includes('fc_gpr') || complianceTypes.includes('fc_trs') || complianceTypes.includes('esop')

  return (
    <div className="grid lg:grid-cols-[1.2fr,1fr] gap-10">
      <div className="rounded-xl border border-border bg-card p-6 space-y-8">
        <div className="space-y-6">
          <div className="space-y-3">
            <Label>Compliance Type</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="flex items-center gap-2 cursor-pointer"><Checkbox checked={complianceTypes.includes('fc_gpr')} onCheckedChange={() => toggleComplianceType('fc_gpr')} /><span className="text-sm">FC-GPR not filed</span></label>
              <label className="flex items-center gap-2 cursor-pointer"><Checkbox checked={complianceTypes.includes('fc_trs')} onCheckedChange={() => toggleComplianceType('fc_trs')} /><span className="text-sm">FC-TRS not filed</span></label>
              <label className="flex items-center gap-2 cursor-pointer"><Checkbox checked={complianceTypes.includes('esop')} onCheckedChange={() => toggleComplianceType('esop')} /><span className="text-sm">ESOP non-compliance</span></label>
              <label className="flex items-center gap-2 cursor-pointer"><Checkbox checked={complianceTypes.includes('angel_tax')} onCheckedChange={() => toggleComplianceType('angel_tax')} /><span className="text-sm">Angel Tax exposure</span></label>
            </div>
          </div>
          <RupeeInput value={foreignInvestmentAmount} onChange={setForeignInvestmentAmount} label="Foreign Investment Amount (Rs.)" helpText="Total amount received from foreign investors" />
          <MonthsLateSlider value={monthsLate} onChange={setMonthsLate} maxMonths={60} label="Months of Default" />
          <div className="flex items-center justify-between"><div><Label htmlFor="dpiit">Is Company DPIIT Recognised?</Label><p className="text-xs text-muted-foreground mt-0.5">DPIIT recognition provides Angel Tax exemption</p></div><Switch id="dpiit" checked={isDPIITRecognised} onCheckedChange={setIsDPIITRecognised} /></div>
          <Accordion type="single" collapsible>
            <AccordionItem value="advanced" className="border-t border-border/50 border-b-0">
              <AccordionTrigger className="text-sm text-muted-foreground hover:text-foreground hover:no-underline py-4"><span className="flex items-center gap-2"><SlidersHorizontal className="h-3.5 w-3.5" />Advanced options</span></AccordionTrigger>
              <AccordionContent className="space-y-4 pt-4"><p className="text-sm text-muted-foreground">FEMA compounding fees are determined by RBI on a case-by-case basis. Factors include: nature of contravention, period of delay, voluntary disclosure, and amount involved.</p></AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
      <div className="lg:sticky lg:top-24 lg:self-start">
        <ResultsPanel total={result.totalMax} breakdown={breakdown} statute={result.showRange ? `Estimated range: Rs.${result.totalMin.toLocaleString('en-IN')} - Rs.${result.totalMax.toLocaleString('en-IN')}` : 'FEMA Section 15 - Compounding'} ctaText="Get FEMA Compliance Help" ctaHref="/services/startup-compliance" showCta={hasCalculablePenalty && result.totalMax > 0}>
          {showAngelTaxInfo && (<InfoBanner title={isDPIITRecognised ? 'Angel Tax Exempt' : 'Angel Tax Applies'} body={isDPIITRecognised ? 'As a DPIIT-recognised startup, you are exempt from Angel Tax under Section 56(2)(viib).' : 'Without DPIIT recognition, investment above fair market value is taxed as income at 30%.'} />)}
          {hasCalculablePenalty && (<InfoBanner title="Compounding fee is estimated" body="FEMA compounding fees range from Rs.5,000 to 1% of the amount. RBI determines the exact fee." />)}
        </ResultsPanel>
      </div>
    </div>
  )
}

export function CalculatorSkeleton() { return (<div className="grid lg:grid-cols-[1.5fr,1fr] gap-8 animate-pulse"><div className="bg-muted rounded-lg h-[500px]" /><div className="bg-muted rounded-lg h-[350px]" /></div>) }
export function StartupDPIITCalculator() { return (<Suspense fallback={<CalculatorSkeleton />}><StartupDPIITCalculatorInner /></Suspense>) }
```

---

# Summary - All Penalty Calculator Components

## Files Created

| File | Content |
|------|---------|
| **allcontentcheck2.md** | 8 Document Checklists + 3 Penalty Calculator Library files (types, constants, engine) |
| **allcontentcheck3.md** | Calculators 1-3: GSTLateFilingCalculator, DirectorKYCCalculator, MCAFilingCalculator |
| **allcontentcheck4.md** | Calculators 4-6: GSTDemandCalculator, ITRLateFilingCalculator, TDSLateFilingCalculator |
| **allcontentcheck5.md** | Calculators 7-10: PFESICCalculator, ProfessionalTaxCalculator, ShopsEstablishmentCalculator, StartupDPIITCalculator |

## Complete List of 10 Penalty Calculators

1. **GSTLateFilingCalculator** - GSTR-1/3B/9 late filing with CGST/SGST split, QRMP eligibility
2. **DirectorKYCCalculator** - DIR-3 KYC penalty with DIN deactivation status
3. **MCAFilingCalculator** - AOC-4/MGT-7/LLP Form 8/11 with strike-off and disqualification warnings
4. **GSTDemandCalculator** - Section 73/74 demand notice with scenario comparison
5. **ITRLateFilingCalculator** - Section 234A/234B/234F calculations with audit requirements
6. **TDSLateFilingCalculator** - 24Q/26Q/27Q with Section 271H and 40(a)(ia) disallowance warnings
7. **PFESICCalculator** - PF damages (Section 14B) and ESIC interest (Section 85B)
8. **ProfessionalTaxCalculator** - State-wise PT penalties for 10 states with different calculation methods
9. **ShopsEstablishmentCalculator** - S&E registration penalties across 6 major states
10. **StartupDPIITCalculator** - FC-GPR/FC-TRS/ESOP/Angel Tax with DPIIT recognition benefits

**Total: ~6000+ lines of complete code across all files**
