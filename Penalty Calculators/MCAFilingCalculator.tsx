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
        { label: `Rs. ${PENALTY_RATES[form].dailyRate}/day x ${daysLate} days`, amount: PENALTY_RATES[form].dailyRate * daysLate },
        ...(penalties[form] >= PENALTY_RATES[form].maxPenalty ? [{ label: `Capped at Rs. ${(PENALTY_RATES[form].maxPenalty / 100000).toFixed(0)} Lakh`, amount: 0 }] : []),
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
            <Label>What kind of entity?</Label>
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
            <Label>Which forms are overdue?</Label>
            <div className="grid gap-3">
              {availableForms.map((form) => (
                <label key={form} className="flex items-start gap-3 cursor-pointer">
                  <Checkbox checked={formsSelected.includes(form)} onCheckedChange={() => toggleForm(form)} className="mt-0.5" />
                  <div>
                    <span className="text-sm font-medium">{PENALTY_RATES[form].label}</span>
                    <p className="text-xs text-muted-foreground">Rs. {PENALTY_RATES[form].dailyRate}/day. Stops at Rs. {(PENALTY_RATES[form].maxPenalty / 100000).toFixed(0)} lakh.</p>
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
                  <Label>Years of non-filing</Label>
                  <Select value={yearsInDefault.toString()} onValueChange={(v) => setYearsInDefault(parseInt(v))}>
                    <SelectTrigger className="max-w-[200px]"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {[1,2,3,4,5,6,7,8,9,10].map(y => (
                        <SelectItem key={y} value={y.toString()}>{y} year{y > 1 ? 's' : ''}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="directors">Number of Directors</Label>
                  <Input
                    id="directors"
                    type="number"
                    min={1}
                    max={50}
                    value={numberOfDirectors}
                    onChange={(e) => setNumberOfDirectors(Math.max(1, Math.min(50, parseInt(e.target.value) || 1)))}
                    className="max-w-[200px]"
                  />
                </div>
                {entityType === 'pvt_ltd' && (
                  <div className="space-y-1.5">
                    <Label>Paid-up capital</Label>
                    <Select value={paidUpCapital} onValueChange={setPaidUpCapital}>
                      <SelectTrigger className="max-w-[200px]"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="under_10l">Under Rs. 10 Lakh</SelectItem>
                        <SelectItem value="10l_50l">Rs. 10 Lakh - Rs. 50 Lakh</SelectItem>
                        <SelectItem value="50l_1cr">Rs. 50 Lakh - Rs. 1 Crore</SelectItem>
                        <SelectItem value="above_1cr">Above Rs. 1 Crore</SelectItem>
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
        <ResultsPanel
          total={totalPenalty}
          breakdown={breakdown}
          dueDate={entityType === 'llp' ? 'Form 8 due Oct 30. Form 11 due May 30.' : 'AOC-4: 30 days after AGM (usually Oct 30). MGT-7: 60 days after AGM (usually Nov 29).'}
          statute={entityType === 'llp' ? 'LLP Act 2008' : 'Companies Act 2013, Section 92 & 137'}
          ctaText="File MCA Returns"
          ctaHref="/services/mca-annual-filing"
          showCta={totalPenalty > 0}
          docChecklistHref={entityType === 'llp' ? '/tools/documents/llp' : '/tools/documents/private-limited-company'}
          docChecklistText={entityType === 'llp' ? 'LLP filing documents' : 'Company filing documents'}
        >
          {daysLate > 30 && (
            <WarningBanner
              variant="yellow"
              title="Rs. 100/day per overdue form"
              body="Both AOC-4 and MGT-7 overdue? That is Rs. 200/day combined, accumulating right now."
            />
          )}
          {daysLate > 180 && (
            <WarningBanner
              variant="yellow"
              title="RoC inquiry territory"
              body="Past 180 days, the Registrar of Companies can initiate an inquiry under Section 206."
            />
          )}
          {showStrikeOffWarning && (
            <WarningBanner
              variant="red"
              title="Strike-off risk"
              body="Two consecutive years of non-filing and the RoC can strike your company off the register. Reversing a strike-off is possible but expensive and slow."
            />
          )}
          {showDisqualificationWarning && (
            <WarningBanner
              variant="red"
              title="Director disqualification - Section 164(2)"
              body="Every director of this company is disqualified from being a director of any other company for 5 years. This applies to all directors, not just those responsible for non-filing."
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

export function MCAFilingCalculator() {
  return (
    <Suspense fallback={<CalculatorSkeleton />}>
      <MCACalculatorInner />
    </Suspense>
  )
}
