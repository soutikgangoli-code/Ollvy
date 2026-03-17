'use client'

import { Suspense, useState, useMemo, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
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
import { Calculator, SlidersHorizontal } from 'lucide-react'
import {
  DaysLateSlider,
  ResultsPanel,
  WarningBanner,
} from '@/components/penalty-calculator'

type EntityType = 'pvt_ltd' | 'public_ltd' | 'llp'
type FormType = 'AOC-4' | 'MGT-7' | 'MGT-7A' | 'LLP Form 8' | 'LLP Form 11'

// Penalty rates from Section 6
const PENALTY_RATES: Record<FormType, { dailyRate: number; maxPenalty: number; label: string }> = {
  'AOC-4': { dailyRate: 100, maxPenalty: 1000000, label: 'AOC-4 (Financial Statements)' },
  'MGT-7': { dailyRate: 100, maxPenalty: 500000, label: 'MGT-7 (Annual Return)' },
  'MGT-7A': { dailyRate: 100, maxPenalty: 500000, label: 'MGT-7A (Small Companies Annual Return)' },
  'LLP Form 8': { dailyRate: 100, maxPenalty: 500000, label: 'LLP Form 8 (Statement of Account & Solvency)' },
  'LLP Form 11': { dailyRate: 100, maxPenalty: 500000, label: 'LLP Form 11 (Annual Return)' },
}

// FAQs from Section 14.3
const faqs = [
  {
    question: 'What is the penalty for late filing of AOC-4?',
    answer: 'AOC-4 attracts an additional fee of ₹100 per day of delay, maximum ₹10,00,000. The normal government fee of ₹300 also applies. For 100 days late: ₹10,000 additional + ₹300 base.',
  },
  {
    question: 'What is the penalty for late filing of MGT-7?',
    answer: 'MGT-7 attracts ₹100 per day, maximum ₹5,00,000. For 365 days late: ₹36,500. The maximum is reached at 5,000 days.',
  },
  {
    question: 'What is MGT-7A?',
    answer: 'MGT-7A is the annual return form for small companies with paid-up capital up to ₹2 Crore and turnover up to ₹20 Crore. Same late fee as MGT-7: ₹100 per day up to ₹5,00,000.',
  },
  {
    question: 'What is the LLP Form 8 and Form 11 late fee?',
    answer: 'Both LLP Form 8 and Form 11 carry ₹100 per day, capped at ₹5,00,000 each. Unlike companies, LLPs have no base filing fee.',
  },
  {
    question: 'When does director disqualification under Section 164(2) apply?',
    answer: 'A director is disqualified if their company has not filed annual returns for 3 consecutive financial years. The disqualification lasts 5 years and applies across all companies they direct.',
  },
  {
    question: 'What is company strike-off?',
    answer: 'The RoC can strike off a company under Section 248 if it has not filed annual returns for 2 consecutive years. Struck-off companies cannot carry on business and directors may face personal liability.',
  },
  {
    question: 'Can overdue annual returns be filed without full penalty?',
    answer: 'The government periodically announces Condonation of Delay Schemes (CODS) allowing overdue filings at reduced fees. Outside these schemes, the full ₹100/day fee must be paid.',
  },
  {
    question: 'What are the annual compliance requirements for a Pvt Ltd?',
    answer: '(1) AOC-4 by 30 October, (2) MGT-7 by 29 November, (3) ADT-1 (auditor appointment), (4) ITR by 31 October, (5) Regular GST returns if registered, (6) DIR-3 KYC for all directors by 30 September.',
  },
]

function calculateMCAPenalty(
  formsSelected: FormType[],
  daysLate: number
): Record<FormType, number> {
  const penalties: Record<FormType, number> = {
    'AOC-4': 0,
    'MGT-7': 0,
    'MGT-7A': 0,
    'LLP Form 8': 0,
    'LLP Form 11': 0,
  }

  for (const form of formsSelected) {
    const rate = PENALTY_RATES[form]
    penalties[form] = Math.min(rate.dailyRate * daysLate, rate.maxPenalty)
  }

  return penalties
}

function MCAFilingCalculator() {
  const searchParams = useSearchParams()

  // Initialize from URL params
  const [entityType, setEntityType] = useState<EntityType>(
    (searchParams.get('entity') as EntityType) || 'pvt_ltd'
  )
  const [formsSelected, setFormsSelected] = useState<FormType[]>(() => {
    const formsParam = searchParams.get('forms')
    if (formsParam) {
      return formsParam.split(',') as FormType[]
    }
    return entityType === 'llp' ? ['LLP Form 8', 'LLP Form 11'] : ['AOC-4', 'MGT-7']
  })
  const [daysLate, setDaysLate] = useState(
    parseInt(searchParams.get('days') || '30', 10)
  )
  const [yearsInDefault, setYearsInDefault] = useState(
    parseInt(searchParams.get('years') || '1', 10)
  )
  const [numberOfDirectors, setNumberOfDirectors] = useState(
    parseInt(searchParams.get('directors') || '2', 10)
  )
  const [paidUpCapital, setPaidUpCapital] = useState<string>(
    searchParams.get('capital') || 'under_10l'
  )

  // Available forms based on entity type
  const availableForms = useMemo((): FormType[] => {
    if (entityType === 'llp') {
      return ['LLP Form 8', 'LLP Form 11']
    }
    if (entityType === 'pvt_ltd' && paidUpCapital === 'under_10l') {
      return ['AOC-4', 'MGT-7', 'MGT-7A']
    }
    return ['AOC-4', 'MGT-7']
  }, [entityType, paidUpCapital])

  // Update forms when entity type changes
  useEffect(() => {
    if (entityType === 'llp') {
      setFormsSelected(['LLP Form 8', 'LLP Form 11'])
    } else {
      setFormsSelected(['AOC-4', 'MGT-7'])
    }
  }, [entityType])

  // Calculate penalties
  const penalties = useMemo(() => {
    return calculateMCAPenalty(formsSelected, daysLate)
  }, [formsSelected, daysLate])

  const totalPenalty = useMemo(() => {
    return Object.values(penalties).reduce((sum, p) => sum + p, 0)
  }, [penalties])

  // Warning conditions
  const showDisqualificationWarning = yearsInDefault >= 3 || daysLate > 1095
  const showStrikeOffWarning = daysLate > 365

  // Update URL params
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

  // Toggle form selection
  const toggleForm = (form: FormType) => {
    setFormsSelected(prev =>
      prev.includes(form)
        ? prev.filter(f => f !== form)
        : [...prev, form]
    )
  }

  // Breakdown for ResultsPanel
  const breakdown = useMemo(() => {
    return formsSelected
      .filter(form => penalties[form] > 0)
      .map(form => ({
        label: PENALTY_RATES[form].label,
        amount: penalties[form],
        subItems: [
          { label: `₹${PENALTY_RATES[form].dailyRate}/day × ${daysLate} days`, amount: PENALTY_RATES[form].dailyRate * daysLate },
          ...(penalties[form] >= PENALTY_RATES[form].maxPenalty
            ? [{ label: `Capped at ₹${(PENALTY_RATES[form].maxPenalty / 100000).toFixed(0)} Lakh`, amount: 0 }]
            : []),
        ],
        statuteShort: entityType === 'llp' ? 'LLP Act' : 'Sec 92/137',
        statuteFull: entityType === 'llp'
          ? 'Limited Liability Partnership Act, 2008 — Annual compliance penalties'
          : 'Section 92 (Annual Return) and Section 137 (Financial Statements), Companies Act 2013',
      }))
  }, [formsSelected, penalties, daysLate, entityType])

  return (
    <>
      {/* JSON-LD Schema - FAQPage */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: faqs.map(faq => ({
              '@type': 'Question',
              name: faq.question,
              acceptedAnswer: {
                '@type': 'Answer',
                text: faq.answer,
              },
            })),
          }),
        }}
      />

      {/* JSON-LD Schema - HowTo */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'HowTo',
            name: 'How to calculate MCA annual filing penalty',
            step: [
              { '@type': 'HowToStep', name: 'Select entity type', text: 'Choose Private Limited, Public Limited, or LLP' },
              { '@type': 'HowToStep', name: 'Select pending forms', text: 'Check which forms are overdue (AOC-4, MGT-7, etc.)' },
              { '@type': 'HowToStep', name: 'Enter days late', text: 'Use the slider to set days past due date' },
              { '@type': 'HowToStep', name: 'View penalty', text: 'See total penalty with per-form breakdown' },
            ],
          }),
        }}
      />

      {/* JSON-LD Schema - BreadcrumbList */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://ollvy.com' },
              { '@type': 'ListItem', position: 2, name: 'Tools', item: 'https://ollvy.com/tools' },
              { '@type': 'ListItem', position: 3, name: 'Penalty Calculator', item: 'https://ollvy.com/tools/penalty-calculator' },
              { '@type': 'ListItem', position: 4, name: 'MCA Annual Filing', item: 'https://ollvy.com/tools/penalty-calculator/mca-annual-filing' },
            ],
          }),
        }}
      />

      <div className="grid lg:grid-cols-[1.5fr,1fr] gap-8">
        {/* Input Section */}
        <div className="rounded-xl border border-border/50 bg-zinc-950 p-6">
          <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <Calculator className="h-5 w-5 text-emerald-600" />
            MCA Annual Filing Penalty Calculator
          </h2>

          <div className="space-y-6">
            {/* Entity Type */}
            <div className="space-y-1.5">
              <Label>Entity Type</Label>
              <Select value={entityType} onValueChange={(v) => setEntityType(v as EntityType)} modal={false}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pvt_ltd">Private Limited Company</SelectItem>
                  <SelectItem value="public_ltd">Public Limited Company</SelectItem>
                  <SelectItem value="llp">LLP</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Forms Pending */}
            <div className="space-y-3">
              <Label>Forms Pending</Label>
              <div className="grid gap-3">
                {availableForms.map((form) => (
                  <label
                    key={form}
                    className="flex items-start gap-3 cursor-pointer"
                  >
                    <Checkbox
                      checked={formsSelected.includes(form)}
                      onCheckedChange={() => toggleForm(form)}
                      className="mt-0.5"
                    />
                    <div>
                      <span className="text-sm font-medium">{PENALTY_RATES[form].label}</span>
                      <p className="text-xs text-muted-foreground">
                        ₹{PENALTY_RATES[form].dailyRate}/day, max ₹{(PENALTY_RATES[form].maxPenalty / 100000).toFixed(0)} Lakh
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Days Late */}
            <DaysLateSlider
              value={daysLate}
              onChange={setDaysLate}
              label="Days Late"
              maxDays={1095}
            />

            {/* Advanced Filters */}
            <Accordion type="single" collapsible>
              <AccordionItem value="advanced" className="border-none">
                <AccordionTrigger className="text-sm font-medium hover:no-underline py-2">
                  <span className="flex items-center gap-2">
                    <SlidersHorizontal className="h-4 w-4" />
                    Advanced filters
                  </span>
                </AccordionTrigger>
                <AccordionContent className="space-y-6 pt-4">
                  {/* Years in Default */}
                  <div className="space-y-1.5">
                    <Label>Number of Years in Default</Label>
                    <Select value={yearsInDefault.toString()} onValueChange={(v) => setYearsInDefault(parseInt(v))} modal={false}>
                      <SelectTrigger className="max-w-[200px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(y => (
                          <SelectItem key={y} value={y.toString()}>{y} year{y > 1 ? 's' : ''}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Number of Directors */}
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

                  {/* Paid-up Share Capital (for Pvt Ltd) */}
                  {entityType === 'pvt_ltd' && (
                    <div className="space-y-1.5">
                      <Label>Paid-up Share Capital</Label>
                      <Select value={paidUpCapital} onValueChange={setPaidUpCapital} modal={false}>
                        <SelectTrigger className="max-w-[200px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="under_10l">Under ₹10 Lakh</SelectItem>
                          <SelectItem value="10l_50l">₹10 Lakh – ₹50 Lakh</SelectItem>
                          <SelectItem value="50l_1cr">₹50 Lakh – ₹1 Crore</SelectItem>
                          <SelectItem value="above_1cr">Above ₹1 Crore</SelectItem>
                        </SelectContent>
                      </Select>
                      {paidUpCapital === 'under_10l' && (
                        <p className="text-xs text-muted-foreground">
                          You may be eligible to file MGT-7A (simpler form for small companies)
                        </p>
                      )}
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>

        {/* Results Section */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <ResultsPanel
            total={totalPenalty}
            breakdown={breakdown}
            dueDate={entityType === 'llp'
              ? 'Form 8: 30 October, Form 11: 30 May'
              : 'AOC-4: 30 days after AGM, MGT-7: 60 days after AGM'}
            statute={entityType === 'llp'
              ? 'LLP Act 2008'
              : 'Companies Act 2013, Section 92 & 137'}
            ctaText="File MCA Returns"
            ctaHref="/services/mca-annual-filing"
            showCta={totalPenalty > 0}
          >
            {/* Warning: days > 30 */}
            {daysLate > 30 && (
              <WarningBanner
                variant="yellow"
                title="Penalty increasing daily"
                body="MCA levies ₹100 per day per form. Your penalty is increasing daily."
              />
            )}

            {/* Warning: days > 180 */}
            {daysLate > 180 && (
              <WarningBanner
                variant="yellow"
                title="RoC Inquiry Risk"
                body="Prolonged non-filing may trigger RoC inquiry under Sections 97/98 of Companies Act 2013."
              />
            )}

            {/* Warning: Strike-off risk */}
            {showStrikeOffWarning && (
              <WarningBanner
                variant="red"
                title="STRIKE-OFF RISK"
                body="Under Section 248 of Companies Act 2013, the RoC can initiate strike-off for companies that have not filed annual returns for 2 consecutive years."
              />
            )}

            {/* Warning: Director disqualification */}
            {showDisqualificationWarning && (
              <WarningBanner
                variant="red"
                title="DIRECTOR DISQUALIFICATION"
                body={`Section 164(2) of Companies Act 2013 disqualifies every director for 5 years. This applies across all companies the ${numberOfDirectors} director${numberOfDirectors > 1 ? 's' : ''} direct${numberOfDirectors === 1 ? 's' : ''} — not just this one.`}
              />
            )}
          </ResultsPanel>
        </div>
      </div>

      {/* SEO Content - H2 Sections */}
      <div className="mt-16 max-w-3xl space-y-12">
        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            What is the penalty for late filing of AOC-4 and MGT-7?
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            The penalty for late filing of AOC-4 (Financial Statements) and MGT-7 (Annual Return)
            is governed by Section 403 of the Companies Act 2013 read with the Companies
            (Registration Offices and Fees) Rules, 2014. The additional fee for delayed filing
            is ₹100 per day for each form. AOC-4 has a maximum cap of ₹10,00,000 while MGT-7
            has a maximum cap of ₹5,00,000. If both forms are pending, the combined penalty
            is ₹200 per day. For a 365-day delay on both forms, the penalty would be ₹73,000
            (₹36,500 for each form).
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            MCA late filing fee — ₹100 per day explained
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            The ₹100 per day additional fee applies from the first day after the due date.
            For AOC-4, the due date is 30 days after the Annual General Meeting. For MGT-7,
            it is 60 days after the AGM. The AGM itself must be held within 6 months from
            the end of the financial year (i.e., by September 30 for companies with March 31
            year-end). Missing any of these deadlines triggers the daily penalty. There is
            no grace period, and the fee cannot be waived unless the government announces
            a specific amnesty scheme.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            Director disqualification under Section 164(2) — when does it apply?
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Section 164(2) of the Companies Act 2013 disqualifies a director if the company
            has failed to file annual returns or financial statements for a continuous period
            of three financial years. Once disqualified, the director cannot be appointed as
            a director in any company for a period of five years. This disqualification
            applies automatically and affects all companies where the person serves as
            director — not just the defaulting company. The disqualification can only be
            removed by filing all pending returns and applying for restoration of DIN.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            What is company strike-off and how to avoid it?
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Company strike-off under Section 248 of the Companies Act 2013 is when the
            Registrar of Companies removes a company from the register of companies. This
            can happen if the company has not been carrying on business for two immediately
            preceding financial years, or if the company has not filed annual returns or
            financial statements for the same period. To avoid strike-off: (1) file all
            pending returns immediately, (2) pay all penalties and fees, (3) respond to
            any RoC notices within the stipulated time. If strike-off proceedings have
            already begun, you can file an application for revival within 20 years.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            LLP annual compliance — Form 8 and Form 11 deadlines
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            LLPs have two annual compliance forms: Form 8 (Statement of Account and Solvency)
            due by October 30, and Form 11 (Annual Return) due by May 30. Unlike companies,
            LLPs do not have a base filing fee — only the additional fee of ₹100 per day
            applies for late filing. Both forms have a maximum penalty cap of ₹5,00,000 each.
            LLPs should ensure timely filing to avoid penalties and maintain good standing
            with the Ministry of Corporate Affairs.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            How to file overdue annual returns with MCA (CFSS scheme)
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            The government periodically announces Company Fresh Start Scheme (CFSS) or similar
            amnesty schemes that allow companies to file overdue returns at reduced penalties.
            The last major scheme was in 2020. Outside of such schemes, you must pay the full
            ₹100/day penalty. To file overdue returns: (1) prepare the financial statements
            and annual return for each pending year, (2) get them signed by directors and
            auditors, (3) file on the MCA portal with payment of all penalties. It&apos;s
            advisable to use a professional service like{' '}
            <Link href="/services/mca-annual-filing" className="text-emerald-600 hover:underline">
              Ollvy&apos;s MCA filing service
            </Link>{' '}
            to ensure accuracy and compliance.
          </p>
        </section>
      </div>

      {/* FAQs Section */}
      <div className="mt-16 max-w-3xl">
        <h2 className="text-2xl font-semibold text-foreground mb-6">
          Frequently Asked Questions
        </h2>
        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div key={index} className="border-b border-border pb-6 last:border-0">
              <h3 className="font-semibold text-foreground mb-2">{faq.question}</h3>
              <p className="text-muted-foreground">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Related Tools */}
      <div className="mt-16 max-w-3xl">
        <h2 className="text-2xl font-semibold text-foreground mb-6">Related Tools</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <Link href="/tools/penalty-calculator/director-kyc" className="block">
            <Card className="p-4 rounded-none hover:border-emerald-500 transition-colors">
              <h3 className="font-semibold text-foreground">Director KYC Calculator</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Calculate DIR-3 KYC late filing penalties
              </p>
            </Card>
          </Link>
          <Link href="/tools/penalty-calculator/itr-late-filing" className="block">
            <Card className="p-4 rounded-none hover:border-emerald-500 transition-colors">
              <h3 className="font-semibold text-foreground">ITR Late Filing Calculator</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Calculate income tax return penalties
              </p>
            </Card>
          </Link>
        </div>
      </div>
    </>
  )
}

// Loading fallback for Suspense
function CalculatorSkeleton() {
  return (
    <div className="grid lg:grid-cols-[1.5fr,1fr] gap-8 animate-pulse">
      <div className="bg-muted rounded-lg h-[600px]" />
      <div className="bg-muted rounded-lg h-[450px]" />
    </div>
  )
}

export default function MCALatePenaltyPage() {
  return (
    <Suspense fallback={<CalculatorSkeleton />}>
      <MCAFilingCalculator />
    </Suspense>
  )
}
