# Penalty Calculator Components - Part 2 (Calculators 4-10)

Continuation from allcontentcheck3.md

---

## 4. GSTDemandCalculator.tsx

```typescript
'use client'

import { useState, useMemo, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { SlidersHorizontal, CheckCircle2 } from 'lucide-react'
import { DaysLateSlider, RupeeInput, ResultsPanel, WarningBanner, InfoBanner } from '@/components/penalty-calculator'
import { safeParseInt } from '@/lib/parse-url-params'

type DefaultType = 'tax_not_paid' | 'short_paid' | 'wrong_itc' | 'excess_refund'
type NoticeStage = 'scn' | 'order_passed' | 'appeal_filed'

const DEFAULT_TYPE_LABELS: Record<DefaultType, string> = {
  tax_not_paid: 'Tax not paid', short_paid: 'Short-paid', wrong_itc: 'Wrong ITC availed', excess_refund: 'Excess refund claimed',
}
const NOTICE_STAGE_LABELS: Record<NoticeStage, string> = {
  scn: 'Show Cause Notice (SCN)', order_passed: 'Order passed', appeal_filed: 'Appeal filed',
}

interface ScenarioResult { label: string; penalty: number; penaltyRate: string; interest: number; total: number; deadline: string }
interface CalculationResult { demandAmount: number; isFraud: boolean; section: string; interestRate: number; scenarios: ScenarioResult[]; currentPenalty: number; currentInterest: number; currentTotal: number }

function calculateGSTDemandPenalty(demandAmount: number, isFraud: boolean, noticeStage: NoticeStage, daysSinceNotice: number): CalculationResult {
  const interestRate = isFraud ? 0.24 : 0.18
  const section = isFraud ? '74' : '73'
  const calculateInterest = (days: number) => Math.round(demandAmount * interestRate * (days / 365))

  let scenarios: ScenarioResult[] = []
  if (isFraud) {
    scenarios = [
      { label: 'Pay Within 30 Days of SCN', penalty: Math.round(demandAmount * 0.15), penaltyRate: '15%', interest: calculateInterest(30), total: demandAmount + Math.round(demandAmount * 0.15) + calculateInterest(30), deadline: '30 days from SCN date' },
      { label: 'Pay Before Order', penalty: Math.round(demandAmount * 0.25), penaltyRate: '25%', interest: calculateInterest(90), total: demandAmount + Math.round(demandAmount * 0.25) + calculateInterest(90), deadline: 'Before order is passed' },
      { label: 'Pay After Order', penalty: demandAmount, penaltyRate: '100%', interest: calculateInterest(180), total: demandAmount + demandAmount + calculateInterest(180), deadline: 'After order is passed' },
    ]
  } else {
    const minPenalty = 10000
    const penalty10Percent = Math.max(Math.round(demandAmount * 0.10), minPenalty)
    scenarios = [
      { label: 'Pay Within 30 Days of SCN', penalty: penalty10Percent, penaltyRate: '10% (min Rs.10,000)', interest: calculateInterest(30), total: demandAmount + penalty10Percent + calculateInterest(30), deadline: '30 days from SCN date' },
      { label: 'Pay Before Order', penalty: penalty10Percent, penaltyRate: '10% (min Rs.10,000)', interest: calculateInterest(90), total: demandAmount + penalty10Percent + calculateInterest(90), deadline: 'Before order is passed' },
      { label: 'Pay After Order', penalty: penalty10Percent, penaltyRate: '10% (min Rs.10,000)', interest: calculateInterest(180), total: demandAmount + penalty10Percent + calculateInterest(180), deadline: 'After order is passed' },
    ]
  }

  let currentScenarioIndex = 0
  if (noticeStage === 'order_passed' || noticeStage === 'appeal_filed') currentScenarioIndex = 2
  else if (daysSinceNotice > 30) currentScenarioIndex = 1

  return { demandAmount, isFraud, section, interestRate, scenarios, currentPenalty: scenarios[currentScenarioIndex].penalty, currentInterest: calculateInterest(daysSinceNotice), currentTotal: demandAmount + scenarios[currentScenarioIndex].penalty + calculateInterest(daysSinceNotice) }
}

function GSTDemandCalculatorInner() {
  const searchParams = useSearchParams()
  const [defaultType, setDefaultType] = useState<DefaultType>((searchParams.get('type') as DefaultType) || 'tax_not_paid')
  const [isFraud, setIsFraud] = useState(searchParams.get('fraud') === 'true')
  const [demandAmount, setDemandAmount] = useState(safeParseInt(searchParams.get('amount'), 100000))
  const [noticeStage, setNoticeStage] = useState<NoticeStage>((searchParams.get('stage') as NoticeStage) || 'scn')
  const [daysSinceNotice, setDaysSinceNotice] = useState(safeParseInt(searchParams.get('days'), 30))

  const result = useMemo(() => calculateGSTDemandPenalty(demandAmount, isFraud, noticeStage, daysSinceNotice), [demandAmount, isFraud, noticeStage, daysSinceNotice])

  useEffect(() => {
    const params = new URLSearchParams()
    params.set('type', defaultType); params.set('fraud', isFraud.toString()); params.set('amount', demandAmount.toString()); params.set('stage', noticeStage); params.set('days', daysSinceNotice.toString())
    window.history.replaceState(null, '', `${window.location.pathname}?${params.toString()}`)
  }, [defaultType, isFraud, demandAmount, noticeStage, daysSinceNotice])

  const breakdown = useMemo(() => [
    { label: `Penalty (Section ${result.section})`, amount: result.currentPenalty, subItems: [{ label: `Rate: ${result.scenarios[0].penaltyRate}`, amount: result.currentPenalty }], statuteShort: `Sec ${result.section}`, statuteFull: `Section ${result.section} of CGST Act 2017` },
    { label: 'Interest (Section 50)', amount: result.currentInterest, subItems: [{ label: `${result.interestRate * 100}% p.a. for ${daysSinceNotice} days`, amount: result.currentInterest }], statuteShort: 'Sec 50', statuteFull: `Section 50 of CGST Act 2017` },
  ], [result, daysSinceNotice])

  return (
    <div className="grid lg:grid-cols-[1.2fr,1fr] gap-10">
      <div className="rounded-xl border border-border bg-card p-6 space-y-8">
        <div className="space-y-6">
          <div className="space-y-1.5">
            <Label>Type of Default</Label>
            <Select value={defaultType} onValueChange={(v) => setDefaultType(v as DefaultType)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{Object.entries(DEFAULT_TYPE_LABELS).map(([value, label]) => (<SelectItem key={value} value={value}>{label}</SelectItem>))}</SelectContent></Select>
          </div>
          <div className="flex items-center justify-between">
            <div><Label>Is Fraud / Willful Misstatement?</Label><p className="text-xs text-muted-foreground mt-0.5">Yes = Section 74, No = Section 73</p></div>
            <Switch checked={isFraud} onCheckedChange={setIsFraud} />
          </div>
          <RupeeInput value={demandAmount} onChange={setDemandAmount} label="Demand Amount (Rs.)" helpText="Tax demand as per the notice" />
          <div className="space-y-1.5">
            <Label>Stage of Notice</Label>
            <Select value={noticeStage} onValueChange={(v) => setNoticeStage(v as NoticeStage)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{Object.entries(NOTICE_STAGE_LABELS).map(([value, label]) => (<SelectItem key={value} value={value}>{label}</SelectItem>))}</SelectContent></Select>
          </div>
          <Accordion type="single" collapsible>
            <AccordionItem value="advanced" className="border-t border-border/50 border-b-0">
              <AccordionTrigger className="text-sm text-muted-foreground hover:text-foreground hover:no-underline py-4"><span className="flex items-center gap-2"><SlidersHorizontal className="h-3.5 w-3.5" />Advanced options</span></AccordionTrigger>
              <AccordionContent className="space-y-6 pt-4"><DaysLateSlider value={daysSinceNotice} onChange={setDaysSinceNotice} label="Days Since Notice Date" maxDays={365} /></AccordionContent>
            </AccordionItem>
          </Accordion>
          <div className="pt-4 border-t border-border">
            <h3 className="font-semibold text-foreground mb-4">Payment Scenarios - Section {result.section}</h3>
            <div className="grid gap-4">
              {result.scenarios.map((scenario, index) => (
                <div key={index} className={`p-4 rounded-lg border ${index === 0 ? 'bg-muted border-emerald-500/30' : 'bg-card border-border'}`}>
                  <div className="flex items-start justify-between gap-4">
                    <div><p className="font-medium text-foreground flex items-center gap-2">{index === 0 && <CheckCircle2 className="h-4 w-4 text-emerald-400" />}{scenario.label}</p><p className="text-xs text-muted-foreground mt-1">Deadline: {scenario.deadline}</p></div>
                    <div className="text-right"><p className="font-semibold text-foreground">Rs.{scenario.total.toLocaleString('en-IN')}</p><p className="text-xs text-muted-foreground">Penalty: {scenario.penaltyRate}</p></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="lg:sticky lg:top-24 lg:self-start">
        <ResultsPanel total={result.currentTotal} breakdown={breakdown} dueDate={`${daysSinceNotice > 30 ? 'Overdue' : '30 days from SCN'}`} statute={`Section ${result.section}, CGST Act 2017`} ctaText="Get GST Notice Help" ctaHref="/services/gst-notice-response" showCta={result.currentTotal > 0}>
          <InfoBanner title="Tax Demand (Principal)" body={`Rs.${demandAmount.toLocaleString('en-IN')} is payable in addition to the penalty and interest.`} />
          {isFraud && (<WarningBanner variant="red" title="Section 74 - Prosecution Risk" body="Section 74 cases can result in prosecution. Tax evasion above Rs.5 Crore is a cognizable and non-bailable offence." />)}
          {daysSinceNotice <= 30 && noticeStage === 'scn' && (<InfoBanner title="Pay Within 30 Days" body={isFraud ? 'Paying within 30 days reduces penalty from 100% to just 15%.' : 'Paying within 30 days minimizes interest accumulation.'} />)}
          {daysSinceNotice > 30 && noticeStage === 'scn' && (<WarningBanner variant="yellow" title="30-Day Window Expired" body={isFraud ? 'Penalty is now 25% of demand.' : 'Interest continues to accrue daily.'} />)}
        </ResultsPanel>
      </div>
    </div>
  )
}

export function CalculatorSkeleton() { return (<div className="grid lg:grid-cols-[1.5fr,1fr] gap-8 animate-pulse"><div className="bg-muted rounded-lg h-[700px]" /><div className="bg-muted rounded-lg h-[500px]" /></div>) }
export function GSTDemandCalculator() { return (<Suspense fallback={<CalculatorSkeleton />}><GSTDemandCalculatorInner /></Suspense>) }
```

---

## 5. ITRLateFilingCalculator.tsx

```typescript
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
  if (entityType === 'company' || entityType === 'llp') return { dueDate: '31 October', auditRequired: true, dateString: '31 October' }
  if (entityType === 'partnership' && totalIncome > 10000000) return { dueDate: '31 October', auditRequired: true, dateString: '31 October' }
  if (isAuditRequired) return { dueDate: '31 October', auditRequired: true, dateString: '31 October' }
  return { dueDate: '31 July', auditRequired: false, dateString: '31 July' }
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
  return { lateFee, interest234A, interest234B, total: lateFee + interest234A + interest234B, statute: 'Section 234F (Late Fee), 234A (Interest), 234B (Advance Tax)', monthsLate }
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
    const params = new URLSearchParams()
    params.set('entity', entityType); params.set('fy', financialYear); params.set('audit', isAuditRequired.toString()); params.set('income', totalIncome.toString()); params.set('tax', outstandingTax.toString()); params.set('days', daysLate.toString()); params.set('advance_paid', wasAdvanceTaxPaid.toString()); params.set('advance_amount', advanceTaxPaid.toString()); params.set('tds', tdsDeducted.toString())
    window.history.replaceState(null, '', `${window.location.pathname}?${params.toString()}`)
  }, [entityType, financialYear, isAuditRequired, totalIncome, outstandingTax, daysLate, wasAdvanceTaxPaid, advanceTaxPaid, tdsDeducted])

  const breakdown = useMemo(() => {
    const items = []
    if (result.lateFee > 0) items.push({ label: 'Section 234F - Late Filing Fee', amount: result.lateFee, subItems: [{ label: totalIncome <= 500000 ? 'Income <= Rs.5 Lakh' : 'Income > Rs.5 Lakh', amount: result.lateFee }], statuteShort: 'Sec 234F', statuteFull: 'Section 234F of Income Tax Act 1961' })
    if (result.interest234A > 0) items.push({ label: 'Section 234A - Interest on Unpaid Tax', amount: result.interest234A, subItems: [{ label: `1% per month x ${result.monthsLate} months`, amount: result.interest234A }], statuteShort: 'Sec 234A', statuteFull: 'Section 234A of Income Tax Act 1961' })
    if (result.interest234B > 0) items.push({ label: 'Section 234B - Advance Tax Shortfall', amount: result.interest234B, subItems: [{ label: 'Advance tax < 90% of liability', amount: result.interest234B }], statuteShort: 'Sec 234B', statuteFull: 'Section 234B of Income Tax Act 1961' })
    return items
  }, [result, totalIncome])

  return (
    <div className="grid lg:grid-cols-[1.2fr,1fr] gap-10">
      <div className="rounded-xl border border-border bg-card p-6 space-y-8">
        <div className="space-y-6">
          <div className="space-y-1.5"><Label>Entity Type</Label><Select value={entityType} onValueChange={(v) => setEntityType(v as EntityType)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="individual">Individual</SelectItem><SelectItem value="huf">HUF</SelectItem><SelectItem value="partnership">Partnership Firm</SelectItem><SelectItem value="llp">LLP</SelectItem><SelectItem value="company">Company</SelectItem></SelectContent></Select><p className="text-xs text-muted-foreground">Due date: {dueDateInfo.dateString}</p></div>
          <div className="space-y-1.5"><Label>Financial Year</Label><Select value={financialYear} onValueChange={(v) => setFinancialYear(v as FinancialYear)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="FY2024-25">FY 2024-25</SelectItem><SelectItem value="FY2023-24">FY 2023-24</SelectItem><SelectItem value="FY2022-23">FY 2022-23</SelectItem><SelectItem value="FY2021-22">FY 2021-22</SelectItem></SelectContent></Select></div>
          <div className="flex items-center justify-between"><div><Label>Is Audit Required?</Label><p className="text-xs text-muted-foreground mt-0.5">Required if turnover &gt; Rs.1 Cr</p></div><Switch checked={isAuditRequired || entityType === 'company' || entityType === 'llp'} onCheckedChange={setIsAuditRequired} disabled={entityType === 'company' || entityType === 'llp'} /></div>
          <TurnoverSlider value={totalIncome} onChange={setTotalIncome} label="Total Annual Income" />
          <RupeeInput value={outstandingTax} onChange={setOutstandingTax} label="Outstanding Tax Liability" helpText="Tax liability remaining after TDS and advance tax" />
          <Accordion type="single" collapsible>
            <AccordionItem value="advanced" className="border-t border-border/50 border-b-0">
              <AccordionTrigger className="text-sm text-muted-foreground hover:text-foreground hover:no-underline py-4"><span className="flex items-center gap-2"><SlidersHorizontal className="h-3.5 w-3.5" />Advanced options</span></AccordionTrigger>
              <AccordionContent className="space-y-6 pt-4">
                <DaysLateSlider value={daysLate} onChange={setDaysLate} label="Days Late from Due Date" maxDays={365} />
                <div className="flex items-center justify-between"><div><Label>Was Advance Tax Paid?</Label><p className="text-xs text-muted-foreground mt-0.5">Affects Section 234B interest</p></div><Switch checked={wasAdvanceTaxPaid} onCheckedChange={setWasAdvanceTaxPaid} /></div>
                {wasAdvanceTaxPaid && (<RupeeInput value={advanceTaxPaid} onChange={setAdvanceTaxPaid} label="Advance Tax Paid Amount" />)}
                <RupeeInput value={tdsDeducted} onChange={setTdsDeducted} label="TDS Deducted (Rs.)" helpText="Credit against tax liability" />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
      <div className="lg:sticky lg:top-24 lg:self-start">
        <ResultsPanel total={result.total} breakdown={breakdown} dueDate={dueDateInfo.dateString} statute="Income Tax Act, 1961" ctaText="File ITR Now" ctaHref="/services/itr-filing" showCta={result.total > 0} docChecklistHref="/tools/documents/business-itr" docChecklistText="ITR filing documents">
          <InfoBanner title="Section 234C - Quarterly Advance Tax Interest" body="If advance tax instalments were not paid on time, Section 234C interest applies separately." />
          {showCompanyPenaltyWarning && (<WarningBanner variant="red" title="Section 271B Penalty Risk" body="Companies face mandatory penalty under Section 271B for audit non-compliance." />)}
          {showAuditWarning && entityType !== 'company' && (<WarningBanner variant="yellow" title="Audit Report Also Due" body="Audit report was also due 31 October. Non-filing attracts Section 271B penalty." />)}
          {showLongDefaultWarning && (<WarningBanner variant="yellow" title="Interest continuing to accrue" body="Section 234A interest continues until full payment." />)}
        </ResultsPanel>
      </div>
    </div>
  )
}

export function CalculatorSkeleton() { return (<div className="grid lg:grid-cols-[1.5fr,1fr] gap-8 animate-pulse"><div className="bg-muted rounded-lg h-[600px]" /><div className="bg-muted rounded-lg h-[400px]" /></div>) }
export function ITRLateFilingCalculator() { return (<Suspense fallback={<CalculatorSkeleton />}><ITRCalculatorInner /></Suspense>) }
```

---

## 6. TDSLateFilingCalculator.tsx

```typescript
'use client'

import { useState, useMemo, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { SlidersHorizontal } from 'lucide-react'
import { DaysLateSlider, RupeeInput, ResultsPanel, WarningBanner, InfoBanner } from '@/components/penalty-calculator'
import { safeParseInt } from '@/lib/parse-url-params'

type ReturnType = '24Q' | '26Q' | '27Q' | '27EQ'
type Quarter = 'Q1' | 'Q2' | 'Q3' | 'Q4'
type DepositStatus = 'ON_TIME' | 'DEDUCTED_LATE' | 'NOT_DEDUCTED'

const QUARTER_DUE_DATES: Record<Quarter, { period: string; dueDate: string }> = {
  Q1: { period: 'April 1 - June 30', dueDate: '31 July' },
  Q2: { period: 'July 1 - September 30', dueDate: '31 October' },
  Q3: { period: 'October 1 - December 31', dueDate: '31 January (next year)' },
  Q4: { period: 'January 1 - March 31', dueDate: '31 May' },
}
const RETURN_TYPE_INFO: Record<ReturnType, string> = { '24Q': 'Salary TDS', '26Q': 'Non-Salary TDS', '27Q': 'Foreign Payments', '27EQ': 'TCS' }

interface CalculationResult { lateFee234E: number; interest201: number; total: number; interestRate: string; monthsLate: number; show271HWarning: boolean; show271HCritical: boolean; showDisallowanceWarning: boolean }

function calculateTDSPenalty(tdsAmount: number, daysLateReturn: number, daysLateDeposit: number, depositStatus: DepositStatus): CalculationResult {
  const lateFee234E = Math.min(200 * daysLateReturn, tdsAmount)
  let interest201 = 0, interestRate = '0%', monthsLate = 0
  if (depositStatus === 'DEDUCTED_LATE') { monthsLate = Math.ceil(daysLateDeposit / 30); interest201 = Math.round(tdsAmount * 0.015 * monthsLate); interestRate = '1.5%' }
  else if (depositStatus === 'NOT_DEDUCTED') { monthsLate = Math.ceil(daysLateReturn / 30); interest201 = Math.round(tdsAmount * 0.01 * monthsLate); interestRate = '1%' }
  return { lateFee234E, interest201, total: lateFee234E + interest201, interestRate, monthsLate, show271HWarning: daysLateReturn > 0, show271HCritical: daysLateReturn > 365, showDisallowanceWarning: depositStatus === 'NOT_DEDUCTED' }
}

function TDSCalculatorInner() {
  const searchParams = useSearchParams()
  const [returnType, setReturnType] = useState<ReturnType>((searchParams.get('form') as ReturnType) || '26Q')
  const [quarter, setQuarter] = useState<Quarter>((searchParams.get('quarter') as Quarter) || 'Q1')
  const [tdsAmount, setTdsAmount] = useState(safeParseInt(searchParams.get('tds_amount'), 50000))
  const [depositStatus, setDepositStatus] = useState<DepositStatus>((searchParams.get('deposit_status') as DepositStatus) || 'ON_TIME')
  const [daysLateReturn, setDaysLateReturn] = useState(safeParseInt(searchParams.get('days_return'), 30))
  const [daysLateDeposit, setDaysLateDeposit] = useState(safeParseInt(searchParams.get('days_deposit'), 30))

  const result = useMemo(() => calculateTDSPenalty(tdsAmount, daysLateReturn, daysLateDeposit, depositStatus), [tdsAmount, daysLateReturn, daysLateDeposit, depositStatus])

  useEffect(() => {
    const params = new URLSearchParams()
    params.set('form', returnType); params.set('quarter', quarter); params.set('tds_amount', tdsAmount.toString()); params.set('deposit_status', depositStatus); params.set('days_return', daysLateReturn.toString()); params.set('days_deposit', daysLateDeposit.toString())
    window.history.replaceState(null, '', `${window.location.pathname}?${params.toString()}`)
  }, [returnType, quarter, tdsAmount, depositStatus, daysLateReturn, daysLateDeposit])

  const breakdown = useMemo(() => {
    const items = [{ label: 'Section 234E - Late Filing Fee', amount: result.lateFee234E, subItems: [{ label: `Rs.200/day x ${daysLateReturn} days`, amount: 200 * daysLateReturn }, ...(result.lateFee234E < 200 * daysLateReturn ? [{ label: 'Capped at TDS amount', amount: 0 }] : [])], statuteShort: 'Sec 234E', statuteFull: 'Section 234E of Income Tax Act 1961' }]
    if (result.interest201 > 0) items.push({ label: 'Interest on Late Deposit (Section 201(1A))', amount: result.interest201, subItems: [{ label: `${result.interestRate} per month x ${result.monthsLate} months`, amount: result.interest201 }], statuteShort: 'Sec 201(1A)', statuteFull: 'Section 201(1A) of Income Tax Act 1961' })
    return items
  }, [result, daysLateReturn])

  return (
    <div className="grid lg:grid-cols-[1.2fr,1fr] gap-10">
      <div className="rounded-xl border border-border bg-card p-6 space-y-8">
        <div className="space-y-6">
          <div className="space-y-1.5"><Label>Return Type</Label><Select value={returnType} onValueChange={(v) => setReturnType(v as ReturnType)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{Object.entries(RETURN_TYPE_INFO).map(([type, desc]) => (<SelectItem key={type} value={type}>{type} ({desc})</SelectItem>))}</SelectContent></Select></div>
          <div className="space-y-1.5"><Label>Quarter</Label><Select value={quarter} onValueChange={(v) => setQuarter(v as Quarter)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{Object.entries(QUARTER_DUE_DATES).map(([q, info]) => (<SelectItem key={q} value={q}>{q} ({info.period})</SelectItem>))}</SelectContent></Select><p className="text-xs text-muted-foreground">Due date: {QUARTER_DUE_DATES[quarter].dueDate}</p></div>
          <RupeeInput value={tdsAmount} onChange={setTdsAmount} label="TDS/TCS Amount" helpText="Enter the TDS/TCS amount for this quarter" />
          <div className="space-y-3">
            <Label>TDS Deposit Status</Label>
            <RadioGroup value={depositStatus} onValueChange={(v) => setDepositStatus(v as DepositStatus)} className="space-y-2">
              <div className="flex items-center space-x-2"><RadioGroupItem value="ON_TIME" id="on_time" /><Label htmlFor="on_time" className="font-normal cursor-pointer">Deducted &amp; deposited on time</Label></div>
              <div className="flex items-center space-x-2"><RadioGroupItem value="DEDUCTED_LATE" id="deducted_late" /><Label htmlFor="deducted_late" className="font-normal cursor-pointer">Deducted but deposited late</Label></div>
              <div className="flex items-center space-x-2"><RadioGroupItem value="NOT_DEDUCTED" id="not_deducted" /><Label htmlFor="not_deducted" className="font-normal cursor-pointer">Not deducted at all</Label></div>
            </RadioGroup>
          </div>
          <Accordion type="single" collapsible>
            <AccordionItem value="advanced" className="border-t border-border/50 border-b-0">
              <AccordionTrigger className="text-sm text-muted-foreground hover:text-foreground hover:no-underline py-4"><span className="flex items-center gap-2"><SlidersHorizontal className="h-3.5 w-3.5" />Advanced options</span></AccordionTrigger>
              <AccordionContent className="space-y-6 pt-4">
                <DaysLateSlider value={daysLateReturn} onChange={setDaysLateReturn} label="Days Late (Return Filing)" maxDays={365} />
                {(depositStatus === 'DEDUCTED_LATE' || depositStatus === 'NOT_DEDUCTED') && (<DaysLateSlider value={daysLateDeposit} onChange={setDaysLateDeposit} label="Days Late (Deposit)" maxDays={365} />)}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
      <div className="lg:sticky lg:top-24 lg:self-start">
        <ResultsPanel total={result.total} breakdown={breakdown} dueDate={QUARTER_DUE_DATES[quarter].dueDate} statute="Section 234E, 271H, 201(1A) - Income Tax Act 1961" ctaText="File TDS Return" ctaHref="/services/tds-monthly-compliance" showCta={result.total > 0}>
          {result.show271HWarning && !result.show271HCritical && (<InfoBanner title="Section 271H Advisory" body="Rs.10,000 - Rs.1,00,000 additional penalty may be levied. Can be waived if filed within 1 year." />)}
          {result.show271HCritical && (<WarningBanner variant="red" title="Section 271H Waiver Window Closed" body="1 year exceeded. Penalty of Rs.10,000-Rs.1,00,000 is now likely." />)}
          {result.showDisallowanceWarning && (<WarningBanner variant="red" title="Section 40(a)(ia) Disallowance" body="30% of the expense on which TDS was not deducted may be disallowed." />)}
        </ResultsPanel>
      </div>
    </div>
  )
}

export function CalculatorSkeleton() { return (<div className="grid lg:grid-cols-[1.5fr,1fr] gap-8 animate-pulse"><div className="bg-muted rounded-lg h-[600px]" /><div className="bg-muted rounded-lg h-[400px]" /></div>) }
export function TDSLateFilingCalculator() { return (<Suspense fallback={<CalculatorSkeleton />}><TDSCalculatorInner /></Suspense>) }
```

---

*See allcontentcheck5.md for calculators 7-10*
