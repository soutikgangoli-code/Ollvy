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

interface CalculationResult {
  monthlyPF: number; monthlyESIC: number; totalPFArrears: number; totalESICArrears: number
  pfDamages: number; esicInterest: number; total: number; pfDamageRate: number; pfDamageRateLabel: string
}

function calculatePFESICPenalty(
  employeeCount: number, avgMonthlySalary: number, monthsLate: number,
  defaultType: DefaultType, monthlyPFOverride: number | null, monthlyESICOverride: number | null
): CalculationResult {
  const autoMonthlyPF = Math.round(avgMonthlySalary * employeeCount * 0.12)
  const autoMonthlyESIC = avgMonthlySalary <= 21000 ? Math.round(avgMonthlySalary * employeeCount * 0.0325) : 0
  const monthlyPF = monthlyPFOverride ?? autoMonthlyPF
  const monthlyESIC = monthlyESICOverride ?? autoMonthlyESIC
  const totalPFArrears = monthlyPF * monthsLate
  const totalESICArrears = monthlyESIC * monthsLate
  const pfDamageRate = getPFDamageRate(monthsLate)
  const pfDamages = defaultType !== 'esic_only' ? Math.round(monthlyPF * pfDamageRate * (monthsLate / 12)) : 0
  const esicInterest = defaultType !== 'pf_only' && employeeCount >= 10 ? Math.round(totalESICArrears * 0.12 * (monthsLate / 12)) : 0
  return {
    monthlyPF, monthlyESIC,
    totalPFArrears: defaultType !== 'esic_only' ? totalPFArrears : 0,
    totalESICArrears: defaultType !== 'pf_only' && employeeCount >= 10 ? totalESICArrears : 0,
    pfDamages, esicInterest, total: pfDamages + esicInterest, pfDamageRate, pfDamageRateLabel: getPFDamageRateLabel(monthsLate),
  }
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

  const result = useMemo(
    () => calculatePFESICPenalty(employeeCount, avgMonthlySalary, monthsLate, defaultType, monthlyPFOverride, monthlyESICOverride),
    [employeeCount, avgMonthlySalary, monthsLate, defaultType, monthlyPFOverride, monthlyESICOverride]
  )
  const isPFMandatory = employeeCount >= 20
  const isESICApplicable = employeeCount >= 10
  const isHighSalaryWarning = avgMonthlySalary > 21000 && isESICApplicable

  useEffect(() => {
    const id = setTimeout(() => {
      const params = new URLSearchParams()
      params.set('employees', employeeCount.toString()); params.set('salary', avgMonthlySalary.toString())
      params.set('months', monthsLate.toString()); params.set('type', defaultType); params.set('notice', showCauseNotice.toString())
      window.history.replaceState(null, '', `${window.location.pathname}?${params.toString()}`)
    }, 250)
    return () => clearTimeout(id)
  }, [employeeCount, avgMonthlySalary, monthsLate, defaultType, showCauseNotice])

  const breakdown = useMemo(() => {
    const items = []
    if (result.pfDamages > 0) items.push({
      label: 'PF Damages (Section 14B)',
      amount: result.pfDamages,
      subItems: [
        { label: `Monthly PF: Rs. ${result.monthlyPF.toLocaleString('en-IN')}`, amount: 0 },
        { label: `Rate: ${result.pfDamageRateLabel} for ${monthsLate} months`, amount: result.pfDamages },
      ],
      statuteShort: 'Sec 14B',
      statuteFull: "Section 14B of Employees' Provident Funds Act, 1952",
    })
    if (result.esicInterest > 0) items.push({
      label: 'ESIC Interest (Section 85B)',
      amount: result.esicInterest,
      subItems: [
        { label: `Monthly ESIC: Rs. ${result.monthlyESIC.toLocaleString('en-IN')}`, amount: 0 },
        { label: `12% p.a. for ${monthsLate} months`, amount: result.esicInterest },
      ],
      statuteShort: 'Sec 85B',
      statuteFull: "Section 85B of Employees' State Insurance Act, 1948",
    })
    return items
  }, [result, monthsLate])

  return (
    <div className="grid lg:grid-cols-[1.2fr,1fr] gap-10">
      <div className="rounded-xl border border-border bg-card p-6 space-y-8">
        <div className="space-y-6">
          <EmployeeCountSlider value={employeeCount} onChange={setEmployeeCount} label="Employees on payroll" />
          {!isPFMandatory && (
            <InfoBanner
              title="PF is optional below 20 employees"
              body="EPF registration is mandatory only once you have 20 or more employees. Below that, it is voluntary."
            />
          )}
          {!isESICApplicable && (
            <InfoBanner
              title="ESIC applies only above 10 employees"
              body="Your current count is below the mandatory threshold of 10 employees."
            />
          )}
          <RupeeInput
            value={avgMonthlySalary}
            onChange={setAvgMonthlySalary}
            label="Average gross monthly salary per employee"
            helpText="Gross salary per employee"
          />
          {isHighSalaryWarning && (
            <InfoBanner
              title="ESIC does not apply above Rs. 21,000/month"
              body="Employees earning more than Rs. 21,000 per month are exempt from ESIC. Only those below this threshold are counted."
            />
          )}
          <MonthsLateSlider value={monthsLate} onChange={setMonthsLate} label="Months overdue" />
          <div className="space-y-3">
            <Label>What is overdue?</Label>
            <RadioGroup value={defaultType} onValueChange={(v) => setDefaultType(v as DefaultType)} className="space-y-2">
              <div className="flex items-center space-x-2"><RadioGroupItem value="both" id="both" /><Label htmlFor="both" className="font-normal cursor-pointer">Both PF and ESIC are overdue</Label></div>
              <div className="flex items-center space-x-2"><RadioGroupItem value="pf_only" id="pf_only" /><Label htmlFor="pf_only" className="font-normal cursor-pointer">Only PF is overdue</Label></div>
              {isESICApplicable && (<div className="flex items-center space-x-2"><RadioGroupItem value="esic_only" id="esic_only" /><Label htmlFor="esic_only" className="font-normal cursor-pointer">Only ESIC is overdue</Label></div>)}
            </RadioGroup>
          </div>
          <Accordion type="single" collapsible>
            <AccordionItem value="advanced" className="border-t border-border/50 border-b-0">
              <AccordionTrigger className="text-sm text-muted-foreground hover:text-foreground hover:no-underline py-4">
                <span className="flex items-center gap-2"><SlidersHorizontal className="h-3.5 w-3.5" />Advanced options</span>
              </AccordionTrigger>
              <AccordionContent className="space-y-6 pt-4">
                <RupeeInput
                  value={monthlyPFOverride ?? result.monthlyPF}
                  onChange={(v) => setMonthlyPFOverride(v)}
                  label="Actual monthly PF contribution (if different from the estimate)"
                  helpText={`Estimated at 12% of average salary. Override if you know the exact figure.`}
                />
                {isESICApplicable && (
                  <RupeeInput
                    value={monthlyESICOverride ?? result.monthlyESIC}
                    onChange={(v) => setMonthlyESICOverride(v)}
                    label="Actual monthly ESIC contribution (if different from the estimate)"
                    helpText={`Auto-calculated: Rs. ${result.monthlyESIC.toLocaleString('en-IN')}`}
                  />
                )}
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Have you received a show-cause notice?</Label>
                    <p className="text-xs text-muted-foreground mt-0.5">A notice means proceedings are active. Respond within the deadline.</p>
                  </div>
                  <Switch checked={showCauseNotice} onCheckedChange={setShowCauseNotice} />
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>

      <div className="lg:sticky lg:top-24 lg:self-start">
        <ResultsPanel
          total={result.total}
          breakdown={breakdown}
          dueDate="15th of the following month"
          statute="EPF Act 1952, ESI Act 1948"
          ctaText="Get PF/ESIC Compliance Help"
          ctaHref="/services"
          showCta={result.total > 0}
        >
          {(result.totalPFArrears > 0 || result.totalESICArrears > 0) && (
            <InfoBanner
              title="What you owe before penalties"
              body={`PF arrears: Rs. ${result.totalPFArrears.toLocaleString('en-IN')}. ESIC arrears: Rs. ${result.totalESICArrears.toLocaleString('en-IN')}. The damages shown above are on top of these amounts - you pay both.`}
            />
          )}
          {monthsLate >= 6 && defaultType !== 'esic_only' && (
            <WarningBanner
              variant="red"
              title="Maximum PF damage rate: 25% per year"
              body="At 6 months you have hit the ceiling. EPFO can now also initiate prosecution under Section 14 of the EPF Act."
            />
          )}
          {monthsLate > 12 && (
            <WarningBanner
              variant="red"
              title="Criminal prosecution risk"
              body="Past one year of default, EPFO can file a criminal complaint. Section 14, EPF Act: imprisonment up to 3 years."
            />
          )}
          {showCauseNotice && (
            <WarningBanner
              variant="yellow"
              title="Notice received - respond immediately"
              body="Pay the full arrears and penalties before the response deadline. Silence on an EPFO notice moves proceedings toward prosecution."
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
      <div className="bg-muted rounded-lg h-[450px]" />
    </div>
  )
}

export function PFESICCalculator() {
  return (
    <Suspense fallback={<CalculatorSkeleton />}>
      <PFESICCalculatorInner />
    </Suspense>
  )
}
