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

interface StatePenaltyData {
  name: string; firstOffence: { min: number; max: number }; repeatOffence: { min: number; max: number }; notes?: string
}

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
  { value: 'maharashtra', label: 'Maharashtra' }, { value: 'karnataka', label: 'Karnataka' },
  { value: 'delhi', label: 'Delhi' }, { value: 'tamil_nadu', label: 'Tamil Nadu' },
  { value: 'gujarat', label: 'Gujarat' }, { value: 'west_bengal', label: 'West Bengal' },
  { value: 'andhra_pradesh', label: 'Andhra Pradesh' }, { value: 'telangana', label: 'Telangana' },
  { value: 'uttar_pradesh', label: 'Uttar Pradesh' }, { value: 'madhya_pradesh', label: 'Madhya Pradesh' },
  { value: 'rajasthan', label: 'Rajasthan' }, { value: 'bihar', label: 'Bihar' },
  { value: 'kerala', label: 'Kerala' }, { value: 'punjab', label: 'Punjab' },
  { value: 'haryana', label: 'Haryana' }, { value: 'odisha', label: 'Odisha' },
  { value: 'assam', label: 'Assam' }, { value: 'jharkhand', label: 'Jharkhand' },
  { value: 'chhattisgarh', label: 'Chhattisgarh' }, { value: 'uttarakhand', label: 'Uttarakhand' },
  { value: 'himachal_pradesh', label: 'Himachal Pradesh' }, { value: 'goa', label: 'Goa' },
  { value: 'other', label: 'Other State/UT' },
]

interface CalculationResult {
  penaltyMin: number; penaltyMax: number; isExactPenalty: boolean; stateName: string; notes: string
}

function calculateShopsEstablishmentPenalty(
  state: string, defaultType: DefaultType, employeeCount: number, monthsLate: number
): CalculationResult {
  const isMajorState = majorStates.includes(state)
  const stateData = statePenalties[state]
  if (isMajorState && stateData) {
    const isRepeatOffence = monthsLate > 12
    const penalty = isRepeatOffence ? stateData.repeatOffence : stateData.firstOffence
    let multiplier = 1
    if (employeeCount > 50) multiplier = 1.5
    if (employeeCount > 100) multiplier = 2
    return {
      penaltyMin: Math.round(penalty.min * multiplier),
      penaltyMax: Math.round(penalty.max * multiplier),
      isExactPenalty: true,
      stateName: stateData.name,
      notes: stateData.notes || '',
    }
  } else {
    return {
      penaltyMin: 200,
      penaltyMax: monthsLate > 12 ? 10000 : 5000,
      isExactPenalty: false,
      stateName: allStates.find((s) => s.value === state)?.label || state,
      notes: 'Penalty typically Rs. 200-Rs. 5,000 for first offence, up to Rs. 10,000 for repeat.',
    }
  }
}

function ShopsEstablishmentCalculatorInner() {
  const searchParams = useSearchParams()
  const [state, setState] = useState(searchParams.get('state') || 'maharashtra')
  const [defaultType, setDefaultType] = useState<DefaultType>((searchParams.get('type') as DefaultType) || 'not_registered')
  const [employeeCount, setEmployeeCount] = useState(safeParseInt(searchParams.get('employees'), 5))
  const [monthsLate, setMonthsLate] = useState(safeParseInt(searchParams.get('months'), 3))

  const result = useMemo(
    () => calculateShopsEstablishmentPenalty(state, defaultType, employeeCount, monthsLate),
    [state, defaultType, employeeCount, monthsLate]
  )

  useEffect(() => {
    const params = new URLSearchParams()
    params.set('state', state); params.set('type', defaultType)
    params.set('employees', employeeCount.toString()); params.set('months', monthsLate.toString())
    window.history.replaceState(null, '', `${window.location.pathname}?${params.toString()}`)
  }, [state, defaultType, employeeCount, monthsLate])

  const breakdown = useMemo(() => [{
    label: `S&E Penalty (${result.stateName})`,
    amount: result.penaltyMax,
    subItems: [{ label: `Range: Rs. ${result.penaltyMin.toLocaleString('en-IN')} - Rs. ${result.penaltyMax.toLocaleString('en-IN')}`, amount: 0 }],
    statuteShort: 'S&E Act',
    statuteFull: result.notes || 'State Shops and Establishments Act',
  }], [result])

  const showRepeatWarning = monthsLate > 12

  return (
    <div className="grid lg:grid-cols-[1.2fr,1fr] gap-10">
      <div className="rounded-xl border border-border bg-card p-6 space-y-8">
        <div className="space-y-6">
          <div className="space-y-1.5">
            <Label>State</Label>
            <Select value={state} onValueChange={setState}>
              <SelectTrigger><SelectValue placeholder="Select state" /></SelectTrigger>
              <SelectContent>
                {allStates.map((s) => (<SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label>What is the issue?</Label>
            <RadioGroup value={defaultType} onValueChange={(v) => setDefaultType(v as DefaultType)} className="space-y-2">
              <div className="flex items-center space-x-2"><RadioGroupItem value="not_registered" id="not_registered" /><Label htmlFor="not_registered" className="font-normal cursor-pointer">Never registered</Label></div>
              <div className="flex items-center space-x-2"><RadioGroupItem value="not_renewed" id="not_renewed" /><Label htmlFor="not_renewed" className="font-normal cursor-pointer">Was registered, but did not renew</Label></div>
              <div className="flex items-center space-x-2"><RadioGroupItem value="outside_hours" id="outside_hours" /><Label htmlFor="outside_hours" className="font-normal cursor-pointer">Operating outside permitted hours or days</Label></div>
            </RadioGroup>
          </div>

          <EmployeeCountSlider value={employeeCount} onChange={setEmployeeCount} maxCount={10000} />
          <MonthsLateSlider value={monthsLate} onChange={setMonthsLate} maxMonths={60} label="How long has this been the case?" />

          <Accordion type="single" collapsible>
            <AccordionItem value="advanced" className="border-t border-border/50 border-b-0">
              <AccordionTrigger className="text-sm text-muted-foreground hover:text-foreground hover:no-underline py-4">
                <span className="flex items-center gap-2"><SlidersHorizontal className="h-3.5 w-3.5" />Advanced options</span>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 pt-4">
                <p className="text-sm text-muted-foreground">
                  S&E penalties are set by individual state acts - rates differ significantly. The penalties shown for the 6 major states are based on their current Acts. Other states use the general indicative range.
                </p>
                {result.notes && (<p className="text-sm text-muted-foreground">{result.notes}</p>)}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>

      <div className="lg:sticky lg:top-24 lg:self-start">
        <ResultsPanel
          total={result.penaltyMax}
          breakdown={breakdown}
          statute={`Indicative range only. ${result.notes || 'State Shops and Establishments Act'}`}
          ctaText="Get S&E Registration"
          ctaHref="/services/shops-establishment-registration"
          showCta={result.penaltyMax > 0}
        >
          {showRepeatWarning && (
            <WarningBanner
              variant="yellow"
              title="Repeat offence threshold crossed"
              body="Past 12 months, courts and inspectors typically treat this as a repeat offence. Penalties jump significantly - some states double them."
            />
          )}
          {!result.isExactPenalty && (
            <InfoBanner
              title={`Exact rates not available for ${result.stateName}`}
              body="We have confirmed penalty data for 6 major states. For other states, the range shown is indicative based on the general framework of state S&E Acts."
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
      <div className="bg-muted rounded-lg h-[500px]" />
      <div className="bg-muted rounded-lg h-[350px]" />
    </div>
  )
}

export function ShopsEstablishmentCalculator() {
  return (
    <Suspense fallback={<CalculatorSkeleton />}>
      <ShopsEstablishmentCalculatorInner />
    </Suspense>
  )
}
