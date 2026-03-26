'use client'

import { useState, useMemo, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Label } from '@/components/ui/label'
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

type EntityType = 'individual' | 'huf' | 'partnership' | 'llp' | 'company'
type FinancialYear = 'FY2024-25' | 'FY2023-24' | 'FY2022-23' | 'FY2021-22'

interface DueDateInfo {
  dueDate: string
  auditRequired: boolean
  dateString: string
}

function getDueDateInfo(
  entityType: EntityType,
  totalIncome: number,
  isAuditRequired: boolean
): DueDateInfo {
  if (entityType === 'company' || entityType === 'llp') {
    return {
      dueDate: '31 October',
      auditRequired: true,
      dateString: '31 October',
    }
  }

  if (entityType === 'partnership' && totalIncome > 10000000) {
    return {
      dueDate: '31 October',
      auditRequired: true,
      dateString: '31 October',
    }
  }

  if (isAuditRequired) {
    return {
      dueDate: '31 October',
      auditRequired: true,
      dateString: '31 October',
    }
  }

  return {
    dueDate: '31 July',
    auditRequired: false,
    dateString: '31 July',
  }
}

interface CalculationResult {
  lateFee: number
  interest234A: number
  interest234B: number
  total: number
  statute: string
  monthsLate: number
}

function calculateITRPenalty(
  totalIncome: number,
  outstandingTax: number,
  daysLate: number,
  advanceTaxPaid: number
): CalculationResult {
  let lateFee = 0
  const BASIC_EXEMPTION = 250000

  if (totalIncome > BASIC_EXEMPTION) {
    lateFee = totalIncome <= 500000 ? 1000 : 5000
  }

  const monthsLate = Math.ceil(daysLate / 30)
  const interest234A = Math.round(outstandingTax * 0.01 * monthsLate)

  const assessedTax = outstandingTax + advanceTaxPaid
  let interest234B = 0
  if (advanceTaxPaid < assessedTax * 0.9 && assessedTax > 0) {
    const shortfall = assessedTax - advanceTaxPaid
    interest234B = Math.round(shortfall * 0.01 * monthsLate)
  }

  return {
    lateFee,
    interest234A,
    interest234B,
    total: lateFee + interest234A + interest234B,
    statute: 'Section 234F (Late Fee), 234A (Interest), 234B (Advance Tax)',
    monthsLate,
  }
}

function ITRCalculatorInner() {
  const searchParams = useSearchParams()

  const [entityType, setEntityType] = useState<EntityType>(
    (searchParams.get('entity') as EntityType) || 'individual'
  )
  const [financialYear, setFinancialYear] = useState<FinancialYear>(
    (searchParams.get('fy') as FinancialYear) || 'FY2024-25'
  )
  const [isAuditRequired, setIsAuditRequired] = useState(
    searchParams.get('audit') === 'true'
  )
  const [totalIncome, setTotalIncome] = useState(
    safeParseInt(searchParams.get('income'), 1000000)
  )
  const [outstandingTax, setOutstandingTax] = useState(
    safeParseInt(searchParams.get('tax'), 0)
  )
  const [daysLate, setDaysLate] = useState(
    safeParseInt(searchParams.get('days'), 30)
  )
  const [wasAdvanceTaxPaid, setWasAdvanceTaxPaid] = useState(
    searchParams.get('advance_paid') !== 'false'
  )
  const [advanceTaxPaid, setAdvanceTaxPaid] = useState(
    safeParseInt(searchParams.get('advance_amount'), 0)
  )
  const [tdsDeducted, setTdsDeducted] = useState(
    safeParseInt(searchParams.get('tds'), 0)
  )

  const dueDateInfo = useMemo(() => {
    return getDueDateInfo(entityType, totalIncome, isAuditRequired)
  }, [entityType, totalIncome, isAuditRequired])

  const result = useMemo(() => {
    const effectiveAdvanceTax = wasAdvanceTaxPaid ? advanceTaxPaid : 0
    return calculateITRPenalty(totalIncome, outstandingTax, daysLate, effectiveAdvanceTax)
  }, [totalIncome, outstandingTax, daysLate, wasAdvanceTaxPaid, advanceTaxPaid])

  const showAuditWarning = dueDateInfo.auditRequired && daysLate > 0
  const showCompanyPenaltyWarning = entityType === 'company' && daysLate > 0
  const showLongDefaultWarning = outstandingTax > 0 && result.monthsLate > 6

  useEffect(() => {
    const params = new URLSearchParams()
    params.set('entity', entityType)
    params.set('fy', financialYear)
    params.set('audit', isAuditRequired.toString())
    params.set('income', totalIncome.toString())
    params.set('tax', outstandingTax.toString())
    params.set('days', daysLate.toString())
    params.set('advance_paid', wasAdvanceTaxPaid.toString())
    params.set('advance_amount', advanceTaxPaid.toString())
    params.set('tds', tdsDeducted.toString())

    const newUrl = `${window.location.pathname}?${params.toString()}`
    window.history.replaceState(null, '', newUrl)
  }, [entityType, financialYear, isAuditRequired, totalIncome, outstandingTax, daysLate, wasAdvanceTaxPaid, advanceTaxPaid, tdsDeducted])

  const breakdown = useMemo(() => {
    const items = []

    if (result.lateFee > 0) {
      items.push({
        label: 'Section 234F - Late Filing Fee',
        amount: result.lateFee,
        subItems: [
          { label: totalIncome <= 500000 ? 'Income <= Rs.5 Lakh' : 'Income > Rs.5 Lakh', amount: result.lateFee },
        ],
        statuteShort: 'Sec 234F',
        statuteFull: 'Section 234F of Income Tax Act 1961 - Fee for late filing of return',
      })
    }

    if (result.interest234A > 0) {
      items.push({
        label: 'Section 234A - Interest on Unpaid Tax',
        amount: result.interest234A,
        subItems: [
          { label: `1% per month x ${result.monthsLate} month${result.monthsLate > 1 ? 's' : ''} on Rs.${outstandingTax.toLocaleString('en-IN')}`, amount: result.interest234A },
        ],
        statuteShort: 'Sec 234A',
        statuteFull: 'Section 234A of Income Tax Act 1961 - Interest for default in furnishing return of income',
      })
    }

    if (result.interest234B > 0) {
      items.push({
        label: 'Section 234B - Advance Tax Shortfall',
        amount: result.interest234B,
        subItems: [
          { label: 'Advance tax < 90% of liability', amount: result.interest234B },
        ],
        statuteShort: 'Sec 234B',
        statuteFull: 'Section 234B of Income Tax Act 1961 - Interest for default in payment of advance tax',
      })
    }

    return items
  }, [result, totalIncome, outstandingTax])

  return (
    <div className="grid lg:grid-cols-[1.2fr,1fr] gap-10">
      {/* Input Section */}
      <div className="rounded-xl border border-border bg-card p-6 space-y-8">
        <div className="space-y-6">
          {/* Entity Type */}
          <div className="space-y-1.5">
            <Label>Entity Type</Label>
            <Select value={entityType} onValueChange={(v) => setEntityType(v as EntityType)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="individual">Individual</SelectItem>
                <SelectItem value="huf">HUF</SelectItem>
                <SelectItem value="partnership">Partnership Firm</SelectItem>
                <SelectItem value="llp">LLP</SelectItem>
                <SelectItem value="company">Company</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Due date: {dueDateInfo.dateString}
            </p>
          </div>

          {/* Financial Year */}
          <div className="space-y-1.5">
            <Label>Financial Year</Label>
            <Select value={financialYear} onValueChange={(v) => setFinancialYear(v as FinancialYear)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="FY2024-25">FY 2024-25</SelectItem>
                <SelectItem value="FY2023-24">FY 2023-24</SelectItem>
                <SelectItem value="FY2022-23">FY 2022-23</SelectItem>
                <SelectItem value="FY2021-22">FY 2021-22</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Is Audit Required */}
          <div className="flex items-center justify-between">
            <div>
              <Label>Is Audit Required?</Label>
              <p className="text-xs text-muted-foreground mt-0.5">
                Required if turnover &gt; Rs.1 Cr (or Rs.10 Cr with &lt;=5% cash)
              </p>
            </div>
            <Switch
              checked={isAuditRequired || entityType === 'company' || entityType === 'llp'}
              onCheckedChange={setIsAuditRequired}
              disabled={entityType === 'company' || entityType === 'llp'}
            />
          </div>

          {/* Total Annual Income */}
          <TurnoverSlider
            value={totalIncome}
            onChange={setTotalIncome}
            label="Total Annual Income"
          />
          <p className="text-xs text-muted-foreground -mt-4">
            Penalty is Rs.1,000 if income &lt;= Rs.5 lakh, Rs.5,000 if higher
          </p>

          {/* Outstanding Tax */}
          <RupeeInput
            value={outstandingTax}
            onChange={setOutstandingTax}
            label="Outstanding Tax Liability"
            helpText="Tax liability remaining after TDS and advance tax"
          />

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
                {/* Days Late */}
                <DaysLateSlider
                  value={daysLate}
                  onChange={setDaysLate}
                  label="Days Late from Due Date"
                  maxDays={365}
                />

                {/* Was Advance Tax Paid */}
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Was Advance Tax Paid?</Label>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Affects Section 234B interest calculation
                    </p>
                  </div>
                  <Switch checked={wasAdvanceTaxPaid} onCheckedChange={setWasAdvanceTaxPaid} />
                </div>

                {/* Advance Tax Paid Amount */}
                {wasAdvanceTaxPaid && (
                  <RupeeInput
                    value={advanceTaxPaid}
                    onChange={setAdvanceTaxPaid}
                    label="Advance Tax Paid Amount"
                    helpText="Total advance tax paid during the year"
                  />
                )}

                {/* TDS Deducted */}
                <RupeeInput
                  value={tdsDeducted}
                  onChange={setTdsDeducted}
                  label="TDS Deducted (Rs.)"
                  helpText="Credit against tax liability"
                />
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
          dueDate={dueDateInfo.dateString}
          statute="Income Tax Act, 1961"
          ctaText="File ITR Now"
          ctaHref="/services/itr-filing"
          showCta={result.total > 0}
          docChecklistHref="/tools/documents/business-itr"
          docChecklistText="ITR filing documents"
        >
          {/* Section 234C Advisory */}
          <InfoBanner
            title="Section 234C - Quarterly Advance Tax Interest"
            body="If advance tax instalments were not paid on time during the year (due 15 June, 15 September, 15 December, 15 March), Section 234C interest applies at 1% per month on the quarterly shortfall. This is separate from the Section 234B interest shown above. Consult your CA to calculate exact 234C liability for your instalments."
          />

          {/* Warning: Company filing late */}
          {showCompanyPenaltyWarning && (
            <WarningBanner
              variant="red"
              title="Section 271B Penalty Risk"
              body="Companies face mandatory penalty under Section 271B for audit non-compliance. Late fee under 234F applies additionally."
            />
          )}

          {/* Warning: Audit required and late */}
          {showAuditWarning && entityType !== 'company' && (
            <WarningBanner
              variant="yellow"
              title="Audit Report Also Due"
              body="Audit report (Form 3CA/3CB) was also due 31 October. Non-filing attracts Section 271B: 0.5% of turnover or Rs.1,50,000, whichever is lower."
            />
          )}

          {/* Warning: Long default */}
          {showLongDefaultWarning && (
            <WarningBanner
              variant="yellow"
              title="Interest continuing to accrue"
              body="Section 234A interest continues to accrue until full payment."
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

export function ITRLateFilingCalculator() {
  return (
    <Suspense fallback={<CalculatorSkeleton />}>
      <ITRCalculatorInner />
    </Suspense>
  )
}
