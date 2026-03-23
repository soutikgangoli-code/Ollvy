import { Suspense } from 'react'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { ShopsEstablishmentCalculator, CalculatorSkeleton } from '@/components/penalty-calculator/ShopsEstablishmentCalculator'

// FAQs for SEO
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
    answer: 'Penalties vary by state but typically range from Rs.500 to Rs.5,000 for first offence and up to Rs.10,000 for repeat offences. Some states like Maharashtra and Gujarat have updated their acts with higher penalties. Non-registration can also result in business closure orders.',
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
    answer: 'Operating beyond permitted hours is a violation that can attract penalties ranging from Rs.500 to Rs.5,000 depending on the state. Repeated violations can result in suspension of registration, closure orders, or prosecution. Night operations typically require special permits.',
  },
]

// JSON-LD Schemas
const faqSchema = {
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
}

const howToSchema = {
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
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://ollvy.com' },
    { '@type': 'ListItem', position: 2, name: 'Tools', item: 'https://ollvy.com/tools' },
    { '@type': 'ListItem', position: 3, name: 'Penalty Calculator', item: 'https://ollvy.com/tools/penalty-calculator' },
    { '@type': 'ListItem', position: 4, name: 'Shops & Establishment', item: 'https://ollvy.com/tools/penalty-calculator/shops-establishment-penalty' },
  ],
}

export default function ShopsEstablishmentPenaltyPage() {
  return (
    <>
      {/* JSON-LD Schemas - Server Rendered */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Calculator - Client Component */}
      <Suspense fallback={<CalculatorSkeleton />}>
        <ShopsEstablishmentCalculator />
      </Suspense>

      {/* SEO Content - Server Rendered */}
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
            Establishment Act is an offence that can attract penalties ranging from Rs.200 to
            Rs.10,000 depending on the state. First-time offenders typically face lower
            penalties (Rs.500-Rs.5,000), while repeat offenders can be penalized more heavily.
            Beyond monetary penalties, non-registration can result in closure notices from
            the labour inspector, inability to obtain other business licenses, issues with
            GST registration, and difficulties in opening bank accounts.{' '}
            <Link href="/services/shops-establishment-registration" className="text-emerald-600 hover:underline">
              Get your S&amp;E registration done on Ollvy
            </Link>.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            State-wise S&amp;E registration requirements
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
            Working hours and overtime under S&amp;E Act
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

      {/* FAQs Section - Server Rendered */}
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

      {/* Related Tools - Server Rendered */}
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
