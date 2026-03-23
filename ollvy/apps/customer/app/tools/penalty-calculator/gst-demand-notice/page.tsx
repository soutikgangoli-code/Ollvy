import { Suspense } from 'react'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { GSTDemandCalculator, CalculatorSkeleton } from '@/components/penalty-calculator/GSTDemandCalculator'

// FAQs for SEO
const faqs = [
  {
    question: 'What is a GST demand notice under Section 73?',
    answer: 'Section 73 applies when tax is short-paid, not paid, or wrongly refunded without intent to evade. Interest at 18% applies. Show cause notice can be issued within 3 years from the due date of annual return.',
  },
  {
    question: 'What is a GST demand notice under Section 74?',
    answer: 'Section 74 applies when tax is evaded with fraud, willful misstatement, or suppression of facts. Interest at 24% applies. Show cause notice can be issued within 5 years. Penalty is 100% of tax.',
  },
  {
    question: 'What is the difference between Section 73 and Section 74?',
    answer: 'Section 73 is for bona fide errors (no intent to evade) - 18% interest, no mandatory penalty if paid before notice. Section 74 is for fraud/evasion - 24% interest, 100% penalty. Section 74 has longer limitation period (5 years vs 3 years).',
  },
  {
    question: 'Can penalty be avoided if I pay voluntarily before notice?',
    answer: 'Under Section 73, if you pay tax + interest before SCN issuance, no penalty is levied. Under Section 74, you must pay 15% penalty even on voluntary payment before SCN.',
  },
  {
    question: 'What is the time limit for issuing GST demand notice?',
    answer: 'Section 73: Within 3 years from the due date of annual return (GSTR-9). Section 74: Within 5 years. After these periods, no SCN can be issued for that period.',
  },
  {
    question: 'What is DRC-01, DRC-02, and DRC-07?',
    answer: 'DRC-01 is the intimation before SCN giving 15 days to respond. DRC-02 is the final Show Cause Notice. DRC-07 is the final order after adjudication determining tax, interest, and penalty.',
  },
  {
    question: 'How do I respond to a GST demand notice?',
    answer: 'File DRC-06 response on the GST portal within 30 days of SCN. Provide all supporting documents, invoices, and explanations. If you agree, pay via DRC-03 and file DRC-06 accepting the demand.',
  },
  {
    question: 'Can I appeal against a GST demand order?',
    answer: 'Yes, appeal to the Appellate Authority within 3 months of the order. For appeal, you must pay 10% of disputed tax (max Rs.25 Crore). Further appeal lies to the Tribunal and High Court.',
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
  name: 'How to calculate GST demand notice interest and penalty',
  step: [
    { '@type': 'HowToStep', name: 'Select notice type', text: 'Choose Section 73 (bona fide error) or Section 74 (fraud/evasion)' },
    { '@type': 'HowToStep', name: 'Enter tax demanded', text: 'Input the principal tax amount in the notice' },
    { '@type': 'HowToStep', name: 'Select payment stage', text: 'Indicate when you plan to pay (before SCN, before order, after order)' },
    { '@type': 'HowToStep', name: 'View calculation', text: 'See total liability with interest and penalty breakdown' },
  ],
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://ollvy.com' },
    { '@type': 'ListItem', position: 2, name: 'Tools', item: 'https://ollvy.com/tools' },
    { '@type': 'ListItem', position: 3, name: 'Penalty Calculator', item: 'https://ollvy.com/tools/penalty-calculator' },
    { '@type': 'ListItem', position: 4, name: 'GST Demand Notice', item: 'https://ollvy.com/tools/penalty-calculator/gst-demand-notice' },
  ],
}

export default function GSTDemandNoticePage() {
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
        <GSTDemandCalculator />
      </Suspense>

      {/* SEO Content - Server Rendered */}
      <div className="mt-16 max-w-3xl space-y-12">
        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            What is a GST demand notice under Section 73 and Section 74?
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            GST demand notices are issued when the tax authorities believe that tax has been
            short-paid, not paid, erroneously refunded, or input tax credit has been wrongly
            availed or utilized. Section 73 of the CGST Act applies when there is no intent
            to evade tax (bona fide errors), while Section 74 applies when there is fraud,
            willful misstatement, or suppression of facts with intent to evade tax. The key
            differences are in interest rates (18% vs 24%), penalty structure, and limitation
            periods (3 years vs 5 years).
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            Section 73 - GST demand for bona fide errors (no fraud)
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Section 73 applies when tax is short-paid or not paid due to reasons other than
            fraud or willful misstatement. The interest rate under Section 73 is 18% per annum.
            The penalty structure is favorable if you pay early: if you pay tax + interest
            before the Show Cause Notice (SCN), no penalty is levied at all. If you pay within
            30 days of the SCN, penalty is 10% or Rs.10,000, whichever is higher. After 30 days,
            the penalty can go up to 10% of tax. The limitation period is 3 years from the
            due date of the annual return (GSTR-9) for the relevant financial year.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            Section 74 - GST demand for fraud, suppression, or willful misstatement
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Section 74 is the more severe provision, applicable when tax evasion involves
            fraud, willful misstatement, or suppression of facts. The interest rate is 24%
            per annum (higher than Section 73&apos;s 18%). Even if you pay voluntarily before
            the SCN is issued, you must pay 15% penalty - there is no zero-penalty option
            unlike Section 73. If you pay within 30 days of SCN, penalty is 25%. After the
            order is passed, penalty is 100% of the tax amount. The limitation period is
            5 years from the due date of the annual return.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            How to respond to a GST demand notice - DRC-06 response
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            When you receive a GST demand notice (DRC-01 intimation or DRC-02 SCN), you must
            respond through the GST portal using Form DRC-06. Here&apos;s the process:
          </p>
          <ol className="list-decimal list-inside text-muted-foreground space-y-2">
            <li>Login to the GST portal and go to Services &gt; User Services &gt; View Additional Notices/Orders</li>
            <li>Locate the notice and click on &quot;Reply&quot;</li>
            <li>File your response in DRC-06 format within 30 days of the notice</li>
            <li>Upload all supporting documents - invoices, contracts, calculations, explanations</li>
            <li>If you agree with the demand, make payment using DRC-03 and file DRC-06 accepting the same</li>
            <li>If you disagree, provide detailed grounds of objection with evidence</li>
          </ol>
          <p className="text-muted-foreground leading-relaxed mt-4">
            Need help responding to a GST notice?{' '}
            <Link href="/services/gst-notice-response" className="text-emerald-600 hover:underline">
              Ollvy can help you draft and file your response
            </Link>.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            GST appeal process - challenging the demand order
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            If you disagree with the final order (DRC-07) passed by the adjudicating authority,
            you can appeal to the Appellate Authority within 3 months of the order date. To
            file an appeal, you must pre-deposit 10% of the disputed tax amount (maximum Rs.25 Crore).
            If the Appellate Authority&apos;s decision is also unfavorable, you can appeal to the
            GST Appellate Tribunal (GSTAT), though this requires an additional 20% pre-deposit.
            Further appeals lie to the High Court (on questions of law) and the Supreme Court.
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
          <Link href="/tools/penalty-calculator/gst-late-filing" className="block">
            <Card className="p-4 rounded-none hover:border-emerald-500 transition-colors">
              <h3 className="font-semibold text-foreground">GST Late Filing Calculator</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Calculate GSTR-1, GSTR-3B, and GSTR-9 late fees
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
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @media print {
              .print-hidden {
                display: none !important;
              }
            }
          `,
        }}
      />
    </>
  )
}
