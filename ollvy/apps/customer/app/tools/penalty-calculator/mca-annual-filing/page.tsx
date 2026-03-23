import { Suspense } from 'react'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { MCAFilingCalculator, CalculatorSkeleton } from '@/components/penalty-calculator/MCAFilingCalculator'

// FAQs for SEO
const faqs = [
  {
    question: 'What is the penalty for late filing of AOC-4?',
    answer: 'AOC-4 attracts an additional fee of Rs.100 per day of delay, maximum Rs.10,00,000. The normal government fee of Rs.300 also applies. For 100 days late: Rs.10,000 additional + Rs.300 base.',
  },
  {
    question: 'What is the penalty for late filing of MGT-7?',
    answer: 'MGT-7 attracts Rs.100 per day, maximum Rs.5,00,000. For 365 days late: Rs.36,500. The maximum is reached at 5,000 days.',
  },
  {
    question: 'What is MGT-7A?',
    answer: 'MGT-7A is the annual return form for small companies with paid-up capital up to Rs.2 Crore and turnover up to Rs.20 Crore. Same late fee as MGT-7: Rs.100 per day up to Rs.5,00,000.',
  },
  {
    question: 'What is the LLP Form 8 and Form 11 late fee?',
    answer: 'Both LLP Form 8 and Form 11 carry Rs.100 per day, capped at Rs.5,00,000 each. Unlike companies, LLPs have no base filing fee.',
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
    answer: 'The government periodically announces Condonation of Delay Schemes (CODS) allowing overdue filings at reduced fees. Outside these schemes, the full Rs.100/day fee must be paid.',
  },
  {
    question: 'What are the annual compliance requirements for a Pvt Ltd?',
    answer: '(1) AOC-4 by 30 October, (2) MGT-7 by 29 November, (3) ADT-1 (auditor appointment), (4) ITR by 31 October, (5) Regular GST returns if registered, (6) DIR-3 KYC for all directors by 30 September.',
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
  name: 'How to calculate MCA annual filing penalty',
  step: [
    { '@type': 'HowToStep', name: 'Select entity type', text: 'Choose Private Limited, Public Limited, or LLP' },
    { '@type': 'HowToStep', name: 'Select pending forms', text: 'Check which forms are overdue (AOC-4, MGT-7, etc.)' },
    { '@type': 'HowToStep', name: 'Enter days late', text: 'Use the slider to set days past due date' },
    { '@type': 'HowToStep', name: 'View penalty', text: 'See total penalty with per-form breakdown' },
  ],
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://ollvy.com' },
    { '@type': 'ListItem', position: 2, name: 'Tools', item: 'https://ollvy.com/tools' },
    { '@type': 'ListItem', position: 3, name: 'Penalty Calculator', item: 'https://ollvy.com/tools/penalty-calculator' },
    { '@type': 'ListItem', position: 4, name: 'MCA Annual Filing', item: 'https://ollvy.com/tools/penalty-calculator/mca-annual-filing' },
  ],
}

export default function MCALatePenaltyPage() {
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
        <MCAFilingCalculator />
      </Suspense>

      {/* SEO Content - Server Rendered */}
      <div className="mt-16 max-w-3xl space-y-12">
        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            What is the penalty for late filing of AOC-4 and MGT-7?
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            The penalty for late filing of AOC-4 (Financial Statements) and MGT-7 (Annual Return)
            is governed by Section 403 of the Companies Act 2013 read with the Companies
            (Registration Offices and Fees) Rules, 2014. The additional fee for delayed filing
            is Rs.100 per day for each form. AOC-4 has a maximum cap of Rs.10,00,000 while MGT-7
            has a maximum cap of Rs.5,00,000. If both forms are pending, the combined penalty
            is Rs.200 per day. For a 365-day delay on both forms, the penalty would be Rs.73,000
            (Rs.36,500 for each form).
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            MCA late filing fee - Rs.100 per day explained
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            The Rs.100 per day additional fee applies from the first day after the due date.
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
            Director disqualification under Section 164(2) - when does it apply?
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Section 164(2) of the Companies Act 2013 disqualifies a director if the company
            has failed to file annual returns or financial statements for a continuous period
            of three financial years. Once disqualified, the director cannot be appointed as
            a director in any company for a period of five years. This disqualification
            applies automatically and affects all companies where the person serves as
            director - not just the defaulting company. The disqualification can only be
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
            LLP annual compliance - Form 8 and Form 11 deadlines
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            LLPs have two annual compliance forms: Form 8 (Statement of Account and Solvency)
            due by October 30, and Form 11 (Annual Return) due by May 30. Unlike companies,
            LLPs do not have a base filing fee - only the additional fee of Rs.100 per day
            applies for late filing. Both forms have a maximum penalty cap of Rs.5,00,000 each.
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
            Rs.100/day penalty. To file overdue returns: (1) prepare the financial statements
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
