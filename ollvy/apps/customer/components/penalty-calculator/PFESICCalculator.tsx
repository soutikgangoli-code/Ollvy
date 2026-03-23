'use client'

import { useState, useMemo, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { SlidersHorizontal } from 'lucide-react'
import {
  EmployeeCountSlider,
  MonthsLateSlider,
  RupeeInput,
  ResultsPanel,
  WarningBanner,
  InfoBanner,
} from '@/components/penalty-calculator'
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
  monthlyPF: number
  monthlyESIC: number
  totalPFArrears: number
  totalESICArrears: number
  pfDamages: number
  esicInterest: number
  total: number
  pfDamageRate: number
  pfDamageRateLabel: string
}

function calculatePFESICPenalty(
  employeeCount: number,
  avgMonthlySalary: number,
  monthsLate: number,
  defaultType: DefaultType,
  monthlyPFOverride: number | null,
  monthlyESICOverride: number | null
): CalculationResult {
  const autoMonthlyPF = Math.round(avgMonthlySalary * employeeCount * 0.12)
  const autoMonthlyESIC = avgMonthlySalary <= 21000
    ? Math.round(avgMonthlySalary * employeeCount * 0.0325)
    : 0

  const monthlyPF = monthlyPFOverride ?? autoMonthlyPF
  const monthlyESIC = monthlyESICOverride ?? autoMonthlyESIC

  const totalPFArrears = monthlyPF * monthsLate
  const totalESICArrears = monthlyESIC * monthsLate

  const pfDamageRate = getPFDamageRate(monthsLate)
  const pfDamages = defaultType !== 'esic_only'
    ? Math.round(monthlyPF * pfDamageRate * (monthsLate / 12))
    : 0

  const esicInterest = defaultType !== 'pf_only' && employeeCount >= 10
    ? Math.round(totalESICArrears * 0.12 * (monthsLate / 12))
    : 0

  return {
    monthlyPF,
    monthlyESIC,
    totalPFArrears: defaultType !== 'esic_only' ? totalPFArrears : 0,
    totalESICArrears: defaultType !== 'pf_only' && employeeCount >= 10 ? totalESICArrears : 0,
    pfDamages,
    esicInterest,
    total: pfDamages + esicInterest,
    pfDamageRate,
    pfDamageRateLabel: getPFDamageRateLabel(monthsLate),
  }
}

function PFESICCalculatorInner() {
  const searchParams = useSearchParams()

  const [employeeCount, setEmployeeCount] = useState(
    safeParseInt(searchParams.get('employees'), 25)
  )
  const [avgMonthlySalary, setAvgMonthlySalary] = useState(
    safeParseInt(searchParams.get('salary'), 20000)
  )
  const [monthsLate, setMonthsLate] = useState(
    safeParseInt(searchParams.get('months'), 3)
  )
  const [defaultType, setDefaultType] = useState<DefaultType>(
    (searchParams.get('type') as DefaultType) || 'both'
  )
  const [monthlyPFOverride, setMonthlyPFOverride] = useState<number | null>(null)
  const [monthlyESICOverride, setMonthlyESICOverride] = useState<number | null>(null)
  const [showCauseNotice, setShowCauseNotice] = useState(
    searchParams.get('notice') === 'true'
  )

  const result = useMemo(() => {
    return calculatePFESICPenalty(
      employeeCount,
      avgMonthlySalary,
      monthsLate,
      defaultType,
      monthlyPFOverride,
      monthlyESICOverride
    )
  }, [employeeCount, avgMonthlySalary, monthsLate, defaultType, monthlyPFOverride, monthlyESICOverride])

  const isPFMandatory = employeeCount >= 20
  const isESICApplicable = employeeCount >= 10
  const isHighSalaryWarning = avgMonthlySalary > 21000 && isESICApplicable

  useEffect(() => {
    const params = new URLSearchParams()
    params.set('employees', employeeCount.toString())
    params.set('salary', avgMonthlySalary.toString())
    params.set('months', monthsLate.toString())
    params.set('type', defaultType)
    params.set('notice', showCauseNotice.toString())

    const newUrl = `${window.location.pathname}?${params.toString()}`
    window.history.replaceState(null, '', newUrl)
  }, [employeeCount, avgMonthlySalary, monthsLate, defaultType, showCauseNotice])

  const breakdown = useMemo(() => {
    const items = []

    if (result.pfDamages > 0) {
      items.push({
        label: 'PF Damages (Section 14B)',
        amount: result.pfDamages,
        subItems: [
          { label: `Monthly PF: Rs.${result.monthlyPF.toLocaleString('en-IN')}`, amount: 0 },
          { label: `Rate: ${result.pfDamageRateLabel} for ${monthsLate} month${monthsLate > 1 ? 's' : ''}`, amount: result.pfDamages },
        ],
        statuteShort: 'Sec 14B',
        statuteFull: 'Section 14B of Employees\' Provident Funds and Miscellaneous Provisions Act, 1952 - Damages for non-payment of contribution',
      })
    }

    if (result.esicInterest > 0) {
      items.push({
        label: 'ESIC Interest (Section 85B)',
        amount: result.esicInterest,
        subItems: [
          { label: `Monthly ESIC: Rs.${result.monthlyESIC.toLocaleString('en-IN')}`, amount: 0 },
          { label: `12% p.a. for ${monthsLate} month${monthsLate > 1 ? 's' : ''}`, amount: result.esicInterest },
        ],
        statuteShort: 'Sec 85B',
        statuteFull: 'Section 85B of Employees\' State Insurance Act, 1948 - Interest on amounts due',
      })
    }

    return items
  }, [result, monthsLate])

  return (
    <div className="grid lg:grid-cols-[1.2fr,1fr] gap-10">
      {/* Input Section */}
      <div className="rounded-xl border border-border bg-card p-6 space-y-8">
        <div className="space-y-6">
          {/* Number of Employees */}
          <EmployeeCountSlider
            value={employeeCount}
            onChange={setEmployeeCount}
            label="Number of Employees"
          />

          {/* PF Voluntary Registration Info */}
          {!isPFMandatory && (
            <InfoBanner
              title="Voluntary PF Registration"
              body="PF registration is mandatory for establishments with 20 or more employees. Below 20, registration is voluntary. If you have voluntarily registered, penalties apply from your registration date."
            />
          )}

          {/* ESIC Not Applicable Info */}
          {!isESICApplicable && (
            <InfoBanner
              title="ESIC Not Applicable"
              body="ESIC applies to establishments with 10 or more employees. With fewer than 10 employees, ESIC registration is not required."
            />
          )}

          {/* Average Monthly Salary */}
          <RupeeInput
            value={avgMonthlySalary}
            onChange={setAvgMonthlySalary}
            label="Average Monthly Salary (Rs.)"
            helpText="Gross salary per employee"
          />

          {/* High Salary Warning for ESIC */}
          {isHighSalaryWarning && (
            <InfoBanner
              title="ESIC Salary Limit"
              body="ESIC only applies to employees earning up to Rs.21,000 per month. If average salary exceeds this, ESIC may not be applicable for all employees."
            />
          )}

          {/* Months of Default */}
          <MonthsLateSlider
            value={monthsLate}
            onChange={setMonthsLate}
            label="Months of Default"
          />

          {/* Type of Default */}
          <div className="space-y-3">
            <Label>Type of Default</Label>
            <RadioGroup
              value={defaultType}
              onValueChange={(v) => setDefaultType(v as DefaultType)}
              className="space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="both" id="both" />
                <Label htmlFor="both" className="font-normal cursor-pointer">
                  Both PF and ESIC
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="pf_only" id="pf_only" />
                <Label htmlFor="pf_only" className="font-normal cursor-pointer">
                  PF only
                </Label>
              </div>
              {isESICApplicable && (
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="esic_only" id="esic_only" />
                  <Label htmlFor="esic_only" className="font-normal cursor-pointer">
                    ESIC only
                  </Label>
                </div>
              )}
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
                {/* Monthly PF Override */}
                <RupeeInput
                  value={monthlyPFOverride ?? result.monthlyPF}
                  onChange={(v) => setMonthlyPFOverride(v)}
                  label="Monthly PF Contribution (Rs.)"
                  helpText={`Auto-calculated: Rs.${result.monthlyPF.toLocaleString('en-IN')} (12% of salary x employees)`}
                />

                {/* Monthly ESIC Override */}
                {isESICApplicable && (
                  <RupeeInput
                    value={monthlyESICOverride ?? result.monthlyESIC}
                    onChange={(v) => setMonthlyESICOverride(v)}
                    label="Monthly ESIC Contribution (Rs.)"
                    helpText={`Auto-calculated: Rs.${result.monthlyESIC.toLocaleString('en-IN')} (3.25% of salary x employees)`}
                  />
                )}

                {/* Show Cause Notice */}
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Was a Show-Cause Notice Issued?</Label>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Indicates advanced stage of proceedings
                    </p>
                  </div>
                  <Switch checked={showCauseNotice} onCheckedChange={setShowCauseNotice} />
                </div>
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
          dueDate="15th of the following month"
          statute="EPF Act 1952, ESI Act 1948"
          ctaText="Get PF/ESIC Compliance Help"
          ctaHref="/services/payroll-compliance"
          showCta={result.total > 0}
        >
          {/* Arrears Summary */}
          {(result.totalPFArrears > 0 || result.totalESICArrears > 0) && (
            <InfoBanner
              title="Total Arrears (Principal)"
              body={`PF Arrears: Rs.${result.totalPFArrears.toLocaleString('en-IN')} | ESIC Arrears: Rs.${result.totalESICArrears.toLocaleString('en-IN')}. These amounts are payable in addition to the penalty shown above.`}
            />
          )}

          {/* Warning: 6+ months - Maximum rate */}
          {monthsLate >= 6 && defaultType !== 'esic_only' && (
            <WarningBanner
              variant="red"
              title="Maximum Damage Rate Applied"
              body="At 6+ months default, PF damages are levied at 25% per annum - the maximum rate. EPFO can also attach employer property and initiate prosecution under Section 14."
            />
          )}

          {/* Warning: 12+ months - Criminal prosecution */}
          {monthsLate > 12 && (
            <WarningBanner
              variant="red"
              title="Criminal Prosecution Risk"
              body="EPFO can file criminal complaint under Section 14 of EPF Act. Penalty can include imprisonment up to 3 years and fine up to Rs.10,000."
            />
          )}

          {/* Show Cause Notice Warning */}
          {showCauseNotice && (
            <WarningBanner
              variant="yellow"
              title="Show-Cause Notice Issued"
              body="A show-cause notice indicates EPFO/ESIC has initiated formal proceedings. Respond within the deadline and pay dues immediately to avoid prosecution."
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
