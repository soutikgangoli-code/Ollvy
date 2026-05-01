'use client'

import { useState, useMemo, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { SlidersHorizontal } from 'lucide-react'
import { TurnoverSlider, DaysLateSlider, RupeeInput, ResultsPanel, WarningBanner, InfoBanner } from '@/components/penalty-calculator'
import { safeParseInt } from '@/lib/parse-url-params'

type EntityType = 'individual' | 'huf' | 'partnership' | 'llp' | 'company'
type FinancialYear = 'FY2024-25' | 'FY2023-24' | 'FY2022-23' | 'FY2021-22'

interface DueDateInfo { dueDate: string; auditRequired: boolean; dateString: string }

function getDueDateInfo(entityType: EntityType, totalIncome: number, isAuditRequired: boolean): DueDateInfo {
  if (entityType === 'company' || entityType === 'llp') return { dueDate: '31 October', auditRequired: true, dateString: '31 October (companies, LLPs, and audit cases)' }
  if (entityType === 'partnership' && totalIncome > 10000000) return { dueDate: '31 October', auditRequired: true, dateString: '31 October (companies, LLPs, and audit cases)' }
  if (isAuditRequired) return { dueDate: '31 October', auditRequired: true, dateString: '31 October (companies, LLPs, and audit cases)' }
  return { dueDate: '31 July', auditRequired: false, dateString: '31 July (standard deadline for non-audit cases)' }
}

interface CalculationResult { lateFee: number; interest234A: number; interest234B: number; total: number; statute: string; monthsLate: number }

function calculateITRPenalty(totalIncome: number, outstandingTax: number, daysLate: number, advanceTaxPaid: number): CalculationResult {
  let lateFee = 0
  const BASIC_EXEMPTION = 250000
  if (totalIncome > BASIC_EXEMPTION) lateFee = totalIncome <= 500000 ? 1000 : 5000
  const monthsLate = Math.ceil(daysLate / 30)
  const interest234A = Math.round(outstandingTax * 0.01 * monthsLate)
  const assessedTax = outstandingTax + advanceTaxPaid
  let interest234B = 0
  if (advanceTaxPaid < assessedTax * 0.9 && assessedTax > 0) {
    const shortfall = assessedTax - advanceTaxPaid
    interest234B = Math.round(shortfall * 0.01 * monthsLate)
  }
  return { lateFee, interest234A, interest234B, total: lateFee + interest234A + interest234B, statute: 'Section 234F (late fee), 234A (interest on unpaid tax), 234B (advance tax shortfall)', monthsLate }
}

function ITRCalculatorInner() {
  const searchParams = useSearchParams()
  const [entityType, setEntityType] = useState<EntityType>((searchParams.get('entity') as EntityType) || 'individual')
  const [financialYear, setFinancialYear] = useState<FinancialYear>((searchParams.get('fy') as FinancialYear) || 'FY2024-25')
  const [isAuditRequired, setIsAuditRequired] = useState(searchParams.get('audit') === 'true')
  const [totalIncome, setTotalIncome] = useState(safeParseInt(searchParams.get('income'), 1000000))
  const [outstandingTax, setOutstandingTax] = useState(safeParseInt(searchParams.get('tax'), 0))
  const [daysLate, setDaysLate] = useState(safeParseInt(searchParams.get('days'), 30))
  const [wasAdvanceTaxPaid, setWasAdvanceTaxPaid] = useState(searchParams.get('advance_paid') !== 'false')
  const [advanceTaxPaid, setAdvanceTaxPaid] = useState(safeParseInt(searchParams.get('advance_amount'), 0))
  const [tdsDeducted, setTdsDeducted] = useState(safeParseInt(searchParams.get('tds'), 0))

  const dueDateInfo = useMemo(() => getDueDateInfo(entityType, totalIncome, isAuditRequired), [entityType, totalIncome, isAuditRequired])
  const result = useMemo(() => calculateITRPenalty(totalIncome, outstandingTax, daysLate, wasAdvanceTaxPaid ? advanceTaxPaid : 0), [totalIncome, outstandingTax, daysLate, wasAdvanceTaxPaid, advanceTaxPaid])

  const showAuditWarning = dueDateInfo.auditRequired && daysLate > 0
  const showCompanyPenaltyWarning = entityType === 'company' && daysLate > 0
  const showLongDefaultWarning = outstandingTax > 0 && result.monthsLate > 6

  useEffect(() => {
    const id = setTimeout(() => {
      const params = new URLSearchParams()
      params.set('entity', entityType); params.set('fy', financialYear); params.set('audit', isAuditRequired.toString())
      params.set('income', totalIncome.toString()); params.set('tax', outstandingTax.toString()); params.set('days', daysLate.toString())
      params.set('advance_paid', wasAdvanceTaxPaid.toString()); params.set('advance_amount', advanceTaxPaid.toString()); params.set('tds', tdsDeducted.toString())
      window.history.replaceState(null, '', `${window.location.pathname}?${params.toString()}`)
    }, 250)
    return () => clearTimeout(id)
  }, [entityType, financialYear, isAuditRequired, totalIncome, outstandingTax, daysLate, wasAdvanceTaxPaid, advanceTaxPaid, tdsDeducted])

  const breakdown = useMemo(() => {
    const items = []
    if (result.lateFee > 0) items.push({
      label: 'Section 234F - Late Filing Fee',
      amount: result.lateFee,
      subItems: [{ label: totalIncome <= 500000 ? 'Total income is Rs. 5 lakh or below - lower late fee applies' : 'Total income exceeds Rs. 5 lakh', amount: result.lateFee }],
      statuteShort: 'Sec 234F',
      statuteFull: 'Section 234F of Income Tax Act 1961',
    })
    if (result.interest234A > 0) items.push({
      label: 'Section 234A - Interest on Unpaid Tax',
      amount: result.interest234A,
      subItems: [{ label: `1% per month for ${result.monthsLate} months on unpaid tax`, amount: result.interest234A }],
      statuteShort: 'Sec 234A',
      statuteFull: 'Section 234A of Income Tax Act 1961',
    })
    if (result.interest234B > 0) items.push({
      label: 'Section 234B - Advance Tax Shortfall',
      amount: result.interest234B,
      subItems: [{ label: 'Advance tax paid was less than 90% of total tax liability', amount: result.interest234B }],
      statuteShort: 'Sec 234B',
      statuteFull: 'Section 234B of Income Tax Act 1961',
    })
    return items
  }, [result, totalIncome])

  return (
    <div className="grid lg:grid-cols-[1.2fr,1fr] gap-10">
      <div className="rounded-xl border border-border bg-card p-6 space-y-8">
        <div className="space-y-6">
          <div className="space-y-1.5">
            <Label>Entity Type</Label>
            <Select value={entityType} onValueChange={(v) => setEntityType(v as EntityType)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="individual">Individual</SelectItem>
                <SelectItem value="huf">HUF</SelectItem>
                <SelectItem value="partnership">Partnership Firm</SelectItem>
                <SelectItem value="llp">LLP</SelectItem>
                <SelectItem value="company">Company</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">Due date: {dueDateInfo.dateString}</p>
          </div>

          <div className="space-y-1.5">
            <Label>Financial Year</Label>
            <Select value={financialYear} onValueChange={(v) => setFinancialYear(v as FinancialYear)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="FY2024-25">FY 2024-25</SelectItem>
                <SelectItem value="FY2023-24">FY 2023-24</SelectItem>
                <SelectItem value="FY2022-23">FY 2022-23</SelectItem>
                <SelectItem value="FY2021-22">FY 2021-22</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Is a tax audit required?</Label>
              <p className="text-xs text-muted-foreground mt-0.5">Mandatory if business turnover exceeds Rs. 1 crore (or Rs. 10 crore if 95%+ transactions are digital)</p>
            </div>
            <Switch
              checked={isAuditRequired || entityType === 'company' || entityType === 'llp'}
              onCheckedChange={setIsAuditRequired}
              disabled={entityType === 'company' || entityType === 'llp'}
            />
          </div>

          <TurnoverSlider value={totalIncome} onChange={setTotalIncome} label="Total annual income (before deductions)" />

          <RupeeInput
            value={outstandingTax}
            onChange={setOutstandingTax}
            label="Tax still unpaid"
            helpText="After subtracting TDS and advance tax paid"
          />

          <Accordion type="single" collapsible>
            <AccordionItem value="advanced" className="border-t border-border/50 border-b-0">
              <AccordionTrigger className="text-sm text-muted-foreground hover:text-foreground hover:no-underline py-4">
                <span className="flex items-center gap-2"><SlidersHorizontal className="h-3.5 w-3.5" />Advanced options</span>
              </AccordionTrigger>
              <AccordionContent className="space-y-6 pt-4">
                <DaysLateSlider value={daysLate} onChange={setDaysLate} label="Days Late from Due Date" maxDays={365} />
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Did you pay advance tax during the year?</Label>
                    <p className="text-xs text-muted-foreground mt-0.5">If less than 90% of tax liability was paid as advance tax, Section 234B interest applies</p>
                  </div>
                  <Switch checked={wasAdvanceTaxPaid} onCheckedChange={setWasAdvanceTaxPaid} />
                </div>
                {wasAdvanceTaxPaid && (
                  <RupeeInput value={advanceTaxPaid} onChange={setAdvanceTaxPaid} label="Advance Tax Paid Amount" />
                )}
                <RupeeInput
                  value={tdsDeducted}
                  onChange={setTdsDeducted}
                  label="TDS already deducted on your income"
                  helpText="Visible in Form 26AS"
                />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>

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
          <InfoBanner
            title="Section 234C not included above"
            body="If you missed or underpaid any quarterly advance tax instalment, Section 234C interest applies in addition to what is shown here. Calculate separately."
          />
          {showCompanyPenaltyWarning && (
            <WarningBanner
              variant="red"
              title="Section 271B penalty for missing audit deadline"
              body="If you were required to get a tax audit done and missed the October 31 deadline, Section 271B applies: 0.5% of turnover, capped at Rs. 1.5 lakh."
            />
          )}
          {showAuditWarning && entityType !== 'company' && (
            <WarningBanner
              variant="yellow"
              title="Tax audit report was also due October 31"
              body="Section 271B penalty for missing the audit deadline: 0.5% of turnover, capped at Rs. 1.5 lakh. This is separate from the late fee shown above."
            />
          )}
          {showLongDefaultWarning && (
            <WarningBanner
              variant="yellow"
              title="Interest is still running"
              body="Section 234A interest at 1% per month continues on unpaid tax until the day you actually pay. File and pay now to stop the clock."
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
