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

interface CalculationResult {
  fcGprPenaltyMin: number; fcGprPenaltyMax: number
  fcTrsPenaltyMin: number; fcTrsPenaltyMax: number
  esopPenaltyMin: number; esopPenaltyMax: number
  totalMin: number; totalMax: number; showRange: boolean
}

function calculateStartupPenalty(
  complianceTypes: ComplianceType[], foreignInvestmentAmount: number,
  monthsLate: number, isDPIITRecognised: boolean
): CalculationResult {
  let fcGprPenaltyMin = 0, fcGprPenaltyMax = 0
  let fcTrsPenaltyMin = 0, fcTrsPenaltyMax = 0
  let esopPenaltyMin = 0, esopPenaltyMax = 0

  if (complianceTypes.includes('fc_gpr') && foreignInvestmentAmount > 0) {
    fcGprPenaltyMin = 5000
    fcGprPenaltyMax = Math.max(Math.round(foreignInvestmentAmount * 0.01), 5000)
  }
  if (complianceTypes.includes('fc_trs') && foreignInvestmentAmount > 0) {
    fcTrsPenaltyMin = 5000
    fcTrsPenaltyMax = Math.max(Math.round(foreignInvestmentAmount * 0.01), 5000)
  }
  if (complianceTypes.includes('esop') && foreignInvestmentAmount > 0) {
    esopPenaltyMin = 5000
    esopPenaltyMax = Math.max(Math.round(foreignInvestmentAmount * 0.005), 5000)
  }

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

  const result = useMemo(
    () => calculateStartupPenalty(complianceTypes, foreignInvestmentAmount, monthsLate, isDPIITRecognised),
    [complianceTypes, foreignInvestmentAmount, monthsLate, isDPIITRecognised]
  )

  const toggleComplianceType = (type: ComplianceType) => {
    setComplianceTypes(prev => prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type])
  }

  useEffect(() => {
    const id = setTimeout(() => {
      const params = new URLSearchParams()
      params.set('types', complianceTypes.join(','))
      params.set('amount', foreignInvestmentAmount.toString())
      params.set('months', monthsLate.toString())
      params.set('dpiit', isDPIITRecognised.toString())
      window.history.replaceState(null, '', `${window.location.pathname}?${params.toString()}`)
    }, 250)
    return () => clearTimeout(id)
  }, [complianceTypes, foreignInvestmentAmount, monthsLate, isDPIITRecognised])

  const breakdown = useMemo(() => {
    const items = []
    if (result.fcGprPenaltyMax > 0) items.push({
      label: 'FC-GPR Late Filing (FEMA)',
      amount: result.fcGprPenaltyMax,
      subItems: [{ label: `Range: Rs. ${result.fcGprPenaltyMin.toLocaleString('en-IN')} - Rs. ${result.fcGprPenaltyMax.toLocaleString('en-IN')}`, amount: 0 }],
      statuteShort: 'FEMA Sec 15',
      statuteFull: 'Section 15, FEMA 1999',
    })
    if (result.fcTrsPenaltyMax > 0) items.push({
      label: 'FC-TRS Late Filing (FEMA)',
      amount: result.fcTrsPenaltyMax,
      subItems: [{ label: `Range: Rs. ${result.fcTrsPenaltyMin.toLocaleString('en-IN')} - Rs. ${result.fcTrsPenaltyMax.toLocaleString('en-IN')}`, amount: 0 }],
      statuteShort: 'FEMA Sec 15',
      statuteFull: 'Section 15, FEMA 1999',
    })
    if (result.esopPenaltyMax > 0) items.push({
      label: 'ESOP Non-Compliance',
      amount: result.esopPenaltyMax,
      subItems: [{ label: `Range: Rs. ${result.esopPenaltyMin.toLocaleString('en-IN')} - Rs. ${result.esopPenaltyMax.toLocaleString('en-IN')}`, amount: 0 }],
      statuteShort: 'FEMA Sec 15',
      statuteFull: 'Section 15, FEMA 1999',
    })
    return items
  }, [result])

  const showAngelTaxInfo = complianceTypes.includes('angel_tax')
  const hasCalculablePenalty = complianceTypes.includes('fc_gpr') || complianceTypes.includes('fc_trs') || complianceTypes.includes('esop')

  return (
    <div className="grid lg:grid-cols-[1.2fr,1fr] gap-10">
      <div className="rounded-xl border border-border bg-card p-6 space-y-8">
        <div className="space-y-6">
          <div className="space-y-3">
            <Label>What FEMA filing was missed?</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox checked={complianceTypes.includes('fc_gpr')} onCheckedChange={() => toggleComplianceType('fc_gpr')} />
                <span className="text-sm">FC-GPR not filed</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox checked={complianceTypes.includes('fc_trs')} onCheckedChange={() => toggleComplianceType('fc_trs')} />
                <span className="text-sm">FC-TRS not filed</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox checked={complianceTypes.includes('esop')} onCheckedChange={() => toggleComplianceType('esop')} />
                <span className="text-sm">ESOP non-compliance</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox checked={complianceTypes.includes('angel_tax')} onCheckedChange={() => toggleComplianceType('angel_tax')} />
                <span className="text-sm">Angel Tax exposure</span>
              </label>
            </div>
          </div>

          <RupeeInput
            value={foreignInvestmentAmount}
            onChange={setForeignInvestmentAmount}
            label="Total foreign investment received"
            helpText="The amount on which FEMA compliance was required"
          />

          <MonthsLateSlider value={monthsLate} onChange={setMonthsLate} maxMonths={60} label="Months since the filing was due" />

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="dpiit">Is the company DPIIT-recognised?</Label>
              <p className="text-xs text-muted-foreground mt-0.5">DPIIT recognition exempts you from Angel Tax under Section 56(2)(viib)</p>
            </div>
            <Switch id="dpiit" checked={isDPIITRecognised} onCheckedChange={setIsDPIITRecognised} />
          </div>

          <Accordion type="single" collapsible>
            <AccordionItem value="advanced" className="border-t border-border/50 border-b-0">
              <AccordionTrigger className="text-sm text-muted-foreground hover:text-foreground hover:no-underline py-4">
                <span className="flex items-center gap-2"><SlidersHorizontal className="h-3.5 w-3.5" />Advanced options</span>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 pt-4">
                <p className="text-sm text-muted-foreground">
                  RBI sets the final compounding fee individually. Key factors: nature of the violation, how long it went unreported, whether you came forward voluntarily, and the amount involved. Voluntary disclosure consistently gets lower fees.
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>

      <div className="lg:sticky lg:top-24 lg:self-start">
        <ResultsPanel
          total={result.totalMax}
          breakdown={breakdown}
          statute={result.showRange
            ? `Indicative range only. Section 15, FEMA 1999 - compounding of contraventions.`
            : 'Section 15, FEMA 1999 - compounding of contraventions'
          }
          ctaText="Get FEMA Compliance Help"
          ctaHref="/services/startup-compliance"
          showCta={hasCalculablePenalty && result.totalMax > 0}
        >
          {showAngelTaxInfo && (
            <InfoBanner
              title={isDPIITRecognised ? 'Angel Tax does not apply' : 'Angel Tax risk without DPIIT recognition'}
              body={isDPIITRecognised
                ? 'DPIIT recognition exempts your company from Section 56(2)(viib). Any investment above fair market value is not treated as income.'
                : 'Investment received above the company\'s fair market value is treated as income under Section 56(2)(viib) and taxed at 30%. DPIIT recognition removes this entirely.'
              }
            />
          )}
          {hasCalculablePenalty && (
            <InfoBanner
              title="These are estimates - RBI sets the actual fee"
              body="RBI determines compounding fees individually based on nature of violation, period of delay, and voluntary disclosure. The range here is indicative."
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

export function StartupDPIITCalculator() {
  return (
    <Suspense fallback={<CalculatorSkeleton />}>
      <StartupDPIITCalculatorInner />
    </Suspense>
  )
}
