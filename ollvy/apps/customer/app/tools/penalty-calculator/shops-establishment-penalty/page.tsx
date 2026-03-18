'use client'

import { useState, useMemo, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
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
  EmployeeCountSlider,
  MonthsLateSlider,
  ResultsPanel,
  InfoBanner,
  WarningBanner,
} from '@/components/penalty-calculator'

type DefaultType = 'not_registered' | 'not_renewed' | 'outside_hours'

// State-wise penalty data for 6 major states
interface StatePenaltyData {
  name: string
  firstOffence: { min: number; max: number }
  repeatOffence: { min: number; max: number }
  notes?: string
}

const statePenalties: Record<string, StatePenaltyData> = {
  maharashtra: {
    name: 'Maharashtra',
    firstOffence: { min: 1000, max: 5000 },
    repeatOffence: { min: 5000, max: 10000 },
    notes: 'Under Maharashtra Shops and Establishments Act, 2017',
  },
  karnataka: {
    name: 'Karnataka',
    firstOffence: { min: 500, max: 3000 },
    repeatOffence: { min: 3000, max: 10000 },
    notes: 'Under Karnataka Shops and Commercial Establishments Act, 1961',
  },
  delhi: {
    name: 'Delhi',
    firstOffence: { min: 500, max: 2500 },
    repeatOffence: { min: 2500, max: 5000 },
    notes: 'Under Delhi Shops and Establishments Act, 1954',
  },
  tamil_nadu: {
    name: 'Tamil Nadu',
    firstOffence: { min: 500, max: 5000 },
    repeatOffence: { min: 5000, max: 10000 },
    notes: 'Under Tamil Nadu Shops and Establishments Act, 1947',
  },
  gujarat: {
    name: 'Gujarat',
    firstOffence: { min: 500, max: 3000 },
    repeatOffence: { min: 3000, max: 10000 },
    notes: 'Under Gujarat Shops and Establishments Act, 2019',
  },
  west_bengal: {
    name: 'West Bengal',
    firstOffence: { min: 500, max: 2000 },
    repeatOffence: { min: 2000, max: 5000 },
    notes: 'Under West Bengal Shops and Establishments Act, 1963',
  },
}

const majorStates = Object.keys(statePenalties)

const allStates = [
  { value: 'maharashtra', label: 'Maharashtra' },
  { value: 'karnataka', label: 'Karnataka' },
  { value: 'delhi', label: 'Delhi' },
  { value: 'tamil_nadu', label: 'Tamil Nadu' },
  { value: 'gujarat', label: 'Gujarat' },
  { value: 'west_bengal', label: 'West Bengal' },
  { value: 'andhra_pradesh', label: 'Andhra Pradesh' },
  { value: 'telangana', label: 'Telangana' },
  { value: 'uttar_pradesh', label: 'Uttar Pradesh' },
  { value: 'madhya_pradesh', label: 'Madhya Pradesh' },
  { value: 'rajasthan', label: 'Rajasthan' },
  { value: 'bihar', label: 'Bihar' },
  { value: 'kerala', label: 'Kerala' },
  { value: 'punjab', label: 'Punjab' },
  { value: 'haryana', label: 'Haryana' },
  { value: 'odisha', label: 'Odisha' },
  { value: 'assam', label: 'Assam' },
  { value: 'jharkhand', label: 'Jharkhand' },
  { value: 'chhattisgarh', label: 'Chhattisgarh' },
  { value: 'uttarakhand', label: 'Uttarakhand' },
  { value: 'himachal_pradesh', label: 'Himachal Pradesh' },
  { value: 'goa', label: 'Goa' },
  { value: 'other', label: 'Other State/UT' },
]

interface CalculationResult {
  penaltyMin: number
  penaltyMax: number
  isExactPenalty: boolean
  stateName: string
  notes: string
}

function calculateShopsEstablishmentPenalty(
  state: string,
  defaultType: DefaultType,
  employeeCount: number,
  monthsLate: number
): CalculationResult {
  const isMajorState = majorStates.includes(state)
  const stateData = statePenalties[state]

  if (isMajorState && stateData) {
    const isRepeatOffence = monthsLate > 12

    const penalty = isRepeatOffence
      ? stateData.repeatOffence
      : stateData.firstOffence

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
      notes: 'Penalty typically ₹200–₹5,000 for first offence, up to ₹10,000 for repeat. Check your state-specific act for exact rates.',
    }
  }
}

// FAQs
const faqs = [
  {
    question: 'What is the Shops and Establishment Act?',
    answer: 'The Shops and Establishment Act is a state-level law that regulates working conditions in shops, commercial establishments, and businesses. Each state has its own version with specific rules on working hours, rest intervals, holidays, leave, and employment conditions.',
  },
  {
    question: 'Is S&E registration mandatory for all businesses?',
    answer: 'Yes, registration under the Shops and Establishment Act is mandatory for most commercial establishments including shops, offices, warehouses, restaurants, hotels, and entertainment venues. The registration must be obtained within 30 days of starting business in most states.',
  },
  {
    question: 'What is the penalty for not registering under the S&E Act?',
    answer: 'Penalties vary by state but typically range from ₹500 to ₹5,000 for first offence and up to ₹10,000 for repeat offences. Some states like Maharashtra and Gujarat have updated their acts with higher penalties. Non-registration can also result in business closure orders.',
  },
  {
    question: 'How often does S&E registration need to be renewed?',
    answer: 'Renewal requirements vary by state. Some states require annual renewal, others have 3-year or 5-year validity periods. Some states like Gujarat and Maharashtra have introduced permanent registration that does not require renewal. Check your state-specific rules.',
  },
  {
    question: 'What are the maximum working hours allowed under S&E Act?',
    answer: 'Most states prescribe 9 hours per day and 48 hours per week as maximum working hours. Overtime is usually capped at 50-75 hours per quarter. Employees must get a weekly off and cannot work more than 10-12 hours in a single day including overtime.',
  },
  {
    question: 'What documents are required for S&E registration?',
    answer: 'Typical documents include: (1) Address proof of establishment, (2) Identity proof of owner/partners/directors, (3) PAN card, (4) Photographs, (5) Rent agreement or ownership proof, (6) Employee list with attendance register. Requirements may vary by state.',
  },
  {
    question: 'Can S&E registration be done online?',
    answer: 'Yes, most states now offer online S&E registration through their labour department portals or through the Shram Suvidha Portal. Some states like Maharashtra issue registration within minutes through automated systems. Processing time varies from instant to 7 days.',
  },
  {
    question: 'What happens if I operate a shop beyond permitted hours?',
    answer: 'Operating beyond permitted hours is a violation that can attract penalties ranging from ₹500 to ₹5,000 depending on the state. Repeated violations can result in suspension of registration, closure orders, or prosecution. Night operations typically require special permits.',
  },
]

function ShopsEstablishmentPenaltyCalculator() {
  const searchParams = useSearchParams()

  // Initialize from URL params
  const [state, setState] = useState(searchParams.get('state') || 'maharashtra')
  const [defaultType, setDefaultType] = useState<DefaultType>(
    (searchParams.get('type') as DefaultType) || 'not_registered'
  )
  const [employeeCount, setEmployeeCount] = useState(
    parseInt(searchParams.get('employees') || '5', 10)
  )
  const [monthsLate, setMonthsLate] = useState(
    parseInt(searchParams.get('months') || '3', 10)
  )

  // Calculate penalty
  const result = useMemo(() => {
    return calculateShopsEstablishmentPenalty(
      state,
      defaultType,
      employeeCount,
      monthsLate
    )
  }, [state, defaultType, employeeCount, monthsLate])

  // Update URL params
  useEffect(() => {
    const params = new URLSearchParams()
    params.set('state', state)
    params.set('type', defaultType)
    params.set('employees', employeeCount.toString())
    params.set('months', monthsLate.toString())

    const newUrl = `${window.location.pathname}?${params.toString()}`
    window.history.replaceState(null, '', newUrl)
  }, [state, defaultType, employeeCount, monthsLate])

  // Breakdown for ResultsPanel
  const breakdown = useMemo(() => {
    return [
      {
        label: `S&E Penalty (${result.stateName})`,
        amount: result.penaltyMax,
        subItems: [
          {
            label: `Range: ₹${result.penaltyMin.toLocaleString('en-IN')} - ₹${result.penaltyMax.toLocaleString('en-IN')}`,
            amount: 0,
          },
        ],
        statuteShort: 'S&E Act',
        statuteFull: `${result.notes || 'State Shops and Establishments Act'}`,
      },
    ]
  }, [result])

  // Check if repeat offence warning should show
  const showRepeatWarning = monthsLate > 12

  return (
    <>
      {/* JSON-LD Schema - FAQPage */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: faqs.map((faq) => ({
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
            name: 'How to calculate Shops and Establishment Act penalty',
            step: [
              { '@type': 'HowToStep', name: 'Select your state', text: 'Choose the state where your business operates' },
              { '@type': 'HowToStep', name: 'Select default type', text: 'Choose whether not registered, not renewed, or operating outside hours' },
              { '@type': 'HowToStep', name: 'Enter employee count', text: 'Specify the number of employees in your establishment' },
              { '@type': 'HowToStep', name: 'Set months of default', text: 'Indicate how long the registration has been overdue' },
              { '@type': 'HowToStep', name: 'View penalty range', text: 'See the estimated penalty range based on state law' },
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
              { '@type': 'ListItem', position: 4, name: 'Shops & Establishment', item: 'https://ollvy.com/tools/penalty-calculator/shops-establishment-penalty' },
            ],
          }),
        }}
      />

      <div className="grid lg:grid-cols-[1.2fr,1fr] gap-10">
        {/* Input Section */}
        <div className="rounded-xl border border-border/50 bg-zinc-950 p-6 space-y-8">
          <div className="space-y-6">
            {/* State Selector - First Input */}
            <div className="space-y-1.5">
              <Label>State</Label>
              <Select value={state} onValueChange={setState}>
                <SelectTrigger>
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent>
                  {allStates.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Default Type */}
            <div className="space-y-3">
              <Label>Type of Default</Label>
              <RadioGroup
                value={defaultType}
                onValueChange={(v) => setDefaultType(v as DefaultType)}
                className="space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="not_registered" id="not_registered" />
                  <Label htmlFor="not_registered" className="font-normal cursor-pointer">
                    Not registered
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="not_renewed" id="not_renewed" />
                  <Label htmlFor="not_renewed" className="font-normal cursor-pointer">
                    Registered but not renewed
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="outside_hours" id="outside_hours" />
                  <Label htmlFor="outside_hours" className="font-normal cursor-pointer">
                    Operating outside permitted hours
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Number of Employees */}
            <EmployeeCountSlider
              value={employeeCount}
              onChange={setEmployeeCount}
              maxCount={10000}
            />

            {/* Months of Default */}
            <MonthsLateSlider
              value={monthsLate}
              onChange={setMonthsLate}
              maxMonths={60}
              label="Months of Default"
            />

            {/* Advanced filters accordion */}
            <Accordion type="single" collapsible>
              <AccordionItem value="advanced" className="border-none">
                <AccordionTrigger className="text-sm font-medium hover:no-underline py-2">
                  <span className="flex items-center gap-2">
                    <SlidersHorizontal className="h-4 w-4" />
                    Advanced filters
                  </span>
                </AccordionTrigger>
                <AccordionContent className="space-y-4 pt-4">
                  <p className="text-sm text-muted-foreground">
                    Shops and Establishment penalties vary significantly by state. This calculator
                    shows exact penalties for Maharashtra, Karnataka, Delhi, Tamil Nadu, Gujarat,
                    and West Bengal. For other states, a typical range is shown.
                  </p>
                  {result.notes && (
                    <p className="text-sm text-muted-foreground">{result.notes}</p>
                  )}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>

        {/* Results Section */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <ResultsPanel
            total={result.penaltyMax}
            breakdown={breakdown}
            statute={`Estimated range: ₹${result.penaltyMin.toLocaleString('en-IN')} - ₹${result.penaltyMax.toLocaleString('en-IN')}`}
            ctaText="Get S&E Registration"
            ctaHref="/services/shops-establishment-registration"
            showCta={result.penaltyMax > 0}
          >
            {/* Repeat Offence Warning */}
            {showRepeatWarning && (
              <WarningBanner
                variant="yellow"
                title="Extended non-compliance"
                body="At over 12 months, this may be treated as a repeat offence with higher penalties. Continued non-compliance can result in business closure orders."
              />
            )}

            {/* State-Specific Note for non-major states */}
            {!result.isExactPenalty && (
              <InfoBanner
                title="State-specific rates unavailable"
                body={`We don't have exact penalty rates for ${result.stateName}. Check your state's Shops and Establishment Act for precise amounts.`}
              />
            )}
          </ResultsPanel>
        </div>
      </div>

      {/* SEO Content - H2 Sections */}
      <div className="mt-16 max-w-3xl space-y-12">
        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            What is the Shops and Establishment Act?
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            The Shops and Establishment Act is a state-level legislation that regulates
            working conditions, employee welfare, and operational aspects of commercial
            establishments. Each state in India has enacted its own version of this act,
            which applies to shops, restaurants, hotels, theatres, offices, warehouses, and
            other commercial premises. The act covers various aspects including working hours,
            rest intervals, weekly holidays, annual leave, employment of women and young
            persons, health and safety conditions, and record-keeping requirements.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            Penalty for non-registration under Shops and Establishment Act
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Operating a commercial establishment without registration under the Shops and
            Establishment Act is an offence that can attract penalties ranging from ₹200 to
            ₹10,000 depending on the state. First-time offenders typically face lower
            penalties (₹500–₹5,000), while repeat offenders can be penalized more heavily.
            Beyond monetary penalties, non-registration can result in closure notices from
            the labour inspector, inability to obtain other business licenses, issues with
            GST registration, and difficulties in opening bank accounts.{' '}
            <Link href="/services/shops-establishment-registration" className="text-emerald-600 hover:underline">
              Get your S&E registration done on Ollvy
            </Link>.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            State-wise S&E registration requirements
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Registration requirements and penalties vary significantly across states.
            Maharashtra&apos;s 2017 act modernized the registration process with online filing
            and permanent registration. Karnataka requires annual renewal in most
            jurisdictions. Delhi&apos;s 1954 act has been amended multiple times with varied
            validity periods. Gujarat&apos;s 2019 act introduced self-certification for small
            establishments. Common requirements across states include registration within 30
            days of starting business, display of registration certificate at premises, and
            maintenance of employee registers.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            Working hours and overtime under S&E Act
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            The Shops and Establishment Act prescribes maximum working hours to protect
            employee welfare. Most states limit daily working hours to 9 hours and weekly
            hours to 48 hours. Any work beyond these limits is considered overtime and must
            be compensated at higher rates (typically 1.5x to 2x normal wages). Overtime is
            usually capped at 50-75 hours per quarter. Opening and closing hours are regulated
            to ensure employees get adequate rest.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            How to register under Shops and Establishment Act
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Most states now offer online registration through their labour department
            portals or through the central Shram Suvidha Portal. The process typically
            involves creating an account on the portal, filling the application form with
            establishment details, uploading required documents like address proof, identity
            proof, and employee list, paying the registration fee, and receiving the
            registration certificate. Processing time varies from instant (in states with
            automated systems like Maharashtra) to 7-15 working days.
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
          <Link href="/tools/penalty-calculator/pf-esic-penalty" className="block">
            <Card className="p-4 rounded-none hover:border-emerald-500 transition-colors">
              <h3 className="font-semibold text-foreground">PF/ESIC Late Payment Penalty</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Calculate EPF Section 14B damages and ESIC interest
              </p>
            </Card>
          </Link>
          <Link href="/tools/penalty-calculator/professional-tax-penalty" className="block">
            <Card className="p-4 rounded-none hover:border-emerald-500 transition-colors">
              <h3 className="font-semibold text-foreground">Professional Tax Penalty</h3>
              <p className="text-sm text-muted-foreground mt-1">
                State-wise PT penalty calculator
              </p>
            </Card>
          </Link>
          <Link href="/tools/penalty-calculator/gst-late-filing" className="block">
            <Card className="p-4 rounded-none hover:border-emerald-500 transition-colors">
              <h3 className="font-semibold text-foreground">GST Late Filing Penalty</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Calculate GSTR-1, GSTR-3B, GSTR-9 late fees
              </p>
            </Card>
          </Link>
          <Link href="/tools/penalty-calculator/mca-annual-filing" className="block">
            <Card className="p-4 rounded-none hover:border-emerald-500 transition-colors">
              <h3 className="font-semibold text-foreground">MCA Annual Filing Penalty</h3>
              <p className="text-sm text-muted-foreground mt-1">
                ROC filing penalties for companies and LLPs
              </p>
            </Card>
          </Link>
        </div>
      </div>

      {/* Print styles */}
      <style jsx global>{`
        @media print {
          .print-hidden {
            display: none !important;
          }
        }
      `}</style>
    </>
  )
}

// Loading fallback for Suspense
function CalculatorSkeleton() {
  return (
    <div className="grid lg:grid-cols-[1.5fr,1fr] gap-8 animate-pulse">
      <div className="bg-muted rounded-lg h-[500px]" />
      <div className="bg-muted rounded-lg h-[350px]" />
    </div>
  )
}

export default function ShopsEstablishmentPenaltyPage() {
  return (
    <Suspense fallback={<CalculatorSkeleton />}>
      <ShopsEstablishmentPenaltyCalculator />
    </Suspense>
  )
}

