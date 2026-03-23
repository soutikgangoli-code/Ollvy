'use client'

import { useState, useMemo, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { SlidersHorizontal } from 'lucide-react'
import {
  MonthsLateSlider,
  RupeeInput,
  ResultsPanel,
  InfoBanner,
} from '@/components/penalty-calculator'
import { safeParseInt } from '@/lib/parse-url-params'

type ComplianceType = 'fc_gpr' | 'fc_trs' | 'esop' | 'angel_tax'

interface CalculationResult {
  fcGprPenaltyMin: number
  fcGprPenaltyMax: number
  fcTrsPenaltyMin: number
  fcTrsPenaltyMax: number
  esopPenaltyMin: number
  esopPenaltyMax: number
  totalMin: number
  totalMax: number
  showRange: boolean
}

function calculateStartupPenalty(
  complianceTypes: ComplianceType[],
  foreignInvestmentAmount: number,
  monthsLate: number,
  isDPIITRecognised: boolean
): CalculationResult {
  let fcGprPenaltyMin = 0
  let fcGprPenaltyMax = 0
  let fcTrsPenaltyMin = 0
  let fcTrsPenaltyMax = 0
  let esopPenaltyMin = 0
  let esopPenaltyMax = 0

  if (complianceTypes.includes('fc_gpr') && foreignInvestmentAmount > 0) {
    fcGprPenaltyMin = 5000
    fcGprPenaltyMax = Math.round(foreignInvestmentAmount * 0.01)
    if (fcGprPenaltyMax < fcGprPenaltyMin) {
      fcGprPenaltyMax = fcGprPenaltyMin
    }
  }

  if (complianceTypes.includes('fc_trs') && foreignInvestmentAmount > 0) {
    fcTrsPenaltyMin = 5000
    fcTrsPenaltyMax = Math.round(foreignInvestmentAmount * 0.01)
    if (fcTrsPenaltyMax < fcTrsPenaltyMin) {
      fcTrsPenaltyMax = fcTrsPenaltyMin
    }
  }

  if (complianceTypes.includes('esop') && foreignInvestmentAmount > 0) {
    esopPenaltyMin = 5000
    esopPenaltyMax = Math.round(foreignInvestmentAmount * 0.005)
    if (esopPenaltyMax < esopPenaltyMin) {
      esopPenaltyMax = esopPenaltyMin
    }
  }

  const totalMin = fcGprPenaltyMin + fcTrsPenaltyMin + esopPenaltyMin
  const totalMax = fcGprPenaltyMax + fcTrsPenaltyMax + esopPenaltyMax
  const showRange = totalMin !== totalMax

  return {
    fcGprPenaltyMin,
    fcGprPenaltyMax,
    fcTrsPenaltyMin,
    fcTrsPenaltyMax,
    esopPenaltyMin,
    esopPenaltyMax,
    totalMin,
    totalMax,
    showRange,
  }
}

function StartupDPIITCalculatorInner() {
  const searchParams = useSearchParams()

  const [complianceTypes, setComplianceTypes] = useState<ComplianceType[]>(() => {
    const types = searchParams.get('types')?.split(',') as ComplianceType[] || ['fc_gpr']
    return types.filter(t => ['fc_gpr', 'fc_trs', 'esop', 'angel_tax'].includes(t))
  })
  const [foreignInvestmentAmount, setForeignInvestmentAmount] = useState(
    safeParseInt(searchParams.get('amount'), 5000000)
  )
  const [monthsLate, setMonthsLate] = useState(
    safeParseInt(searchParams.get('months'), 6)
  )
  const [isDPIITRecognised, setIsDPIITRecognised] = useState(
    searchParams.get('dpiit') !== 'false'
  )

  const result = useMemo(() => {
    return calculateStartupPenalty(
      complianceTypes,
      foreignInvestmentAmount,
      monthsLate,
      isDPIITRecognised
    )
  }, [complianceTypes, foreignInvestmentAmount, monthsLate, isDPIITRecognised])

  const toggleComplianceType = (type: ComplianceType) => {
    setComplianceTypes(prev => {
      if (prev.includes(type)) {
        return prev.filter(t => t !== type)
      } else {
        return [...prev, type]
      }
    })
  }

  useEffect(() => {
    const params = new URLSearchParams()
    params.set('types', complianceTypes.join(','))
    params.set('amount', foreignInvestmentAmount.toString())
    params.set('months', monthsLate.toString())
    params.set('dpiit', isDPIITRecognised.toString())

    const newUrl = `${window.location.pathname}?${params.toString()}`
    window.history.replaceState(null, '', newUrl)
  }, [complianceTypes, foreignInvestmentAmount, monthsLate, isDPIITRecognised])

  const breakdown = useMemo(() => {
    const items = []

    if (result.fcGprPenaltyMax > 0) {
      items.push({
        label: 'FC-GPR Late Filing (FEMA)',
        amount: result.fcGprPenaltyMax,
        subItems: [
          {
            label: `Range: Rs.${result.fcGprPenaltyMin.toLocaleString('en-IN')} - Rs.${result.fcGprPenaltyMax.toLocaleString('en-IN')}`,
            amount: 0,
          },
        ],
        statuteShort: 'FEMA Sec 15',
        statuteFull: 'Section 15, FEMA 1999 - Compounding of contraventions',
      })
    }

    if (result.fcTrsPenaltyMax > 0) {
      items.push({
        label: 'FC-TRS Late Filing (FEMA)',
        amount: result.fcTrsPenaltyMax,
        subItems: [
          {
            label: `Range: Rs.${result.fcTrsPenaltyMin.toLocaleString('en-IN')} - Rs.${result.fcTrsPenaltyMax.toLocaleString('en-IN')}`,
            amount: 0,
          },
        ],
        statuteShort: 'FEMA Sec 15',
        statuteFull: 'Section 15, FEMA 1999 - Compounding of contraventions',
      })
    }

    if (result.esopPenaltyMax > 0) {
      items.push({
        label: 'ESOP Non-Compliance',
        amount: result.esopPenaltyMax,
        subItems: [
          {
            label: `Range: Rs.${result.esopPenaltyMin.toLocaleString('en-IN')} - Rs.${result.esopPenaltyMax.toLocaleString('en-IN')}`,
            amount: 0,
          },
        ],
        statuteShort: 'FEMA Sec 15',
        statuteFull: 'Section 15, FEMA 1999 - Compounding of contraventions',
      })
    }

    return items
  }, [result])

  const showAngelTaxInfo = complianceTypes.includes('angel_tax')
  const hasCalculablePenalty = complianceTypes.includes('fc_gpr') || complianceTypes.includes('fc_trs') || complianceTypes.includes('esop')

  return (
    <div className="grid lg:grid-cols-[1.2fr,1fr] gap-10">
      {/* Input Section */}
      <div className="rounded-xl border border-border bg-card p-6 space-y-8">
        <div className="space-y-6">
          {/* Compliance Type - Multi-select */}
          <div className="space-y-3">
            <Label>Compliance Type</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={complianceTypes.includes('fc_gpr')}
                  onCheckedChange={() => toggleComplianceType('fc_gpr')}
                />
                <span className="text-sm">FC-GPR not filed</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={complianceTypes.includes('fc_trs')}
                  onCheckedChange={() => toggleComplianceType('fc_trs')}
                />
                <span className="text-sm">FC-TRS not filed</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={complianceTypes.includes('esop')}
                  onCheckedChange={() => toggleComplianceType('esop')}
                />
                <span className="text-sm">ESOP non-compliance</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={complianceTypes.includes('angel_tax')}
                  onCheckedChange={() => toggleComplianceType('angel_tax')}
                />
                <span className="text-sm">Angel Tax exposure</span>
              </label>
            </div>
          </div>

          {/* Foreign Investment Amount */}
          <RupeeInput
            value={foreignInvestmentAmount}
            onChange={setForeignInvestmentAmount}
            label="Foreign Investment Amount (Rs.)"
            helpText="Total amount received from foreign investors"
          />

          {/* Months of Default */}
          <MonthsLateSlider
            value={monthsLate}
            onChange={setMonthsLate}
            maxMonths={60}
            label="Months of Default"
          />

          {/* DPIIT Recognition Toggle */}
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="dpiit">Is Company DPIIT Recognised?</Label>
              <p className="text-xs text-muted-foreground mt-0.5">
                DPIIT recognition provides Angel Tax exemption
              </p>
            </div>
            <Switch
              id="dpiit"
              checked={isDPIITRecognised}
              onCheckedChange={setIsDPIITRecognised}
            />
          </div>

          {/* Advanced filters accordion */}
          <Accordion type="single" collapsible>
            <AccordionItem value="advanced" className="border-t border-border/50 border-b-0">
              <AccordionTrigger className="text-sm text-muted-foreground hover:text-foreground hover:no-underline py-4">
                <span className="flex items-center gap-2">
                  <SlidersHorizontal className="h-3.5 w-3.5" />
                  Advanced options
                </span>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 pt-4">
                <p className="text-sm text-muted-foreground">
                  FEMA compounding fees are determined by RBI on a case-by-case basis.
                  Factors include: nature of contravention, period of delay, voluntary disclosure,
                  and amount involved. This calculator shows the typical range.
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>

      {/* Results Section */}
      <div className="lg:sticky lg:top-24 lg:self-start">
        <ResultsPanel
          total={result.totalMax}
          breakdown={breakdown}
          statute={result.showRange ? `Estimated range: Rs.${result.totalMin.toLocaleString('en-IN')} - Rs.${result.totalMax.toLocaleString('en-IN')}` : 'FEMA Section 15 - Compounding'}
          ctaText="Get FEMA Compliance Help"
          ctaHref="/services/startup-compliance"
          showCta={hasCalculablePenalty && result.totalMax > 0}
        >
          {/* Angel Tax InfoBanner */}
          {showAngelTaxInfo && (
            <InfoBanner
              title={isDPIITRecognised ? 'Angel Tax Exempt' : 'Angel Tax Applies'}
              body={isDPIITRecognised
                ? 'As a DPIIT-recognised startup, you are exempt from Angel Tax under Section 56(2)(viib) if you have filed Form 2 with DPIIT.'
                : 'Without DPIIT recognition, investment above fair market value is taxed as income under Section 56(2)(viib) at 30%.'
              }
            />
          )}

          {/* FEMA Range Note */}
          {hasCalculablePenalty && (
            <InfoBanner
              title="Compounding fee is estimated"
              body="FEMA compounding fees range from Rs.5,000 to 1% of the amount. RBI determines the exact fee on a case-by-case basis."
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
