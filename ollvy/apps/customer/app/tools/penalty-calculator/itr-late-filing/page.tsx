import { Suspense } from 'react'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { ITRLateFilingCalculator, CalculatorSkeleton } from '@/components/penalty-calculator/ITRLateFilingCalculator'

// FAQs for SEO
const faqs = [
  {
    question: 'What is the penalty for filing ITR late?',
    answer: 'Section 234F imposes a flat fee: Rs.1,000 if total income is up to Rs.5 Lakh, and Rs.5,000 if income exceeds Rs.5 Lakh. If income is below the basic exemption limit (Rs.2.5 Lakh), no fee applies.',
  },
  {
    question: 'Is the Section 234F fee per day or a flat fee?',
    answer: 'It is a flat one-time fee - not per day. Whether you file 1 day late or 6 months late, the fee is the same. This is a common misconception.',
  },
  {
    question: 'What is Section 234A interest?',
    answer: 'Section 234A charges interest at 1% per month (or part thereof) on unpaid tax if the return is filed after the due date. If all tax was paid via TDS or advance tax, Section 234A = Rs.0.',
  },
  {
    question: 'What is Section 234B and when does it apply?',
    answer: 'Section 234B charges 1% per month on the shortfall if advance tax paid is less than 90% of total tax liability. It applies from April 1 of the assessment year until payment.',
  },
  {
    question: 'What is the ITR due date for a company?',
    answer: 'For companies (Pvt Ltd, Public Ltd), the due date is 31 October, as audit is always mandatory. For non-audit individuals: 31 July. For audit-required individuals and partnerships: 31 October.',
  },
  {
    question: 'What is a belated return?',
    answer: 'A belated return is filed after the original due date but before 31 December of the assessment year. For FY 2024-25, belated returns can be filed until 31 December 2025.',
  },
  {
    question: 'Can I claim a refund if I file ITR late?',
    answer: 'Yes, you can claim a refund in a belated return. However, interest on refund under Section 244A runs only from April 1 of the assessment year or date of tax payment - not from the original due date.',
  },
  {
    question: 'What is the Section 271B penalty for not getting accounts audited?',
    answer: 'If turnover exceeds Rs.1 Crore and you don\'t get audited, Section 271B imposes a penalty of 0.5% of turnover or Rs.1,50,000, whichever is lower.',
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
  name: 'How to calculate ITR late filing penalty',
  step: [
    { '@type': 'HowToStep', name: 'Select entity type', text: 'Choose Individual, HUF, Partnership, LLP, or Company' },
    { '@type': 'HowToStep', name: 'Enter total income', text: 'Enter your total annual income' },
    { '@type': 'HowToStep', name: 'Enter outstanding tax', text: 'Enter any tax liability not yet paid' },
    { '@type': 'HowToStep', name: 'Enter days late', text: 'Specify how many days late you are filing' },
    { '@type': 'HowToStep', name: 'View penalty', text: 'See total penalty with 234F, 234A, and 234B breakdown' },
  ],
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://ollvy.com' },
    { '@type': 'ListItem', position: 2, name: 'Tools', item: 'https://ollvy.com/tools' },
    { '@type': 'ListItem', position: 3, name: 'Penalty Calculator', item: 'https://ollvy.com/tools/penalty-calculator' },
    { '@type': 'ListItem', position: 4, name: 'ITR Late Filing', item: 'https://ollvy.com/tools/penalty-calculator/itr-late-filing' },
  ],
}

export default function ITRLatePenaltyPage() {
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
        <ITRLateFilingCalculator />
      </Suspense>

      {/* SEO Content - Server Rendered */}
      <div className="mt-16 max-w-3xl space-y-12">
        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            What is the penalty for filing income tax return late?
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            The penalty for filing income tax return late in India is governed by Section 234F
            of the Income Tax Act 1961. This section imposes a flat late filing fee based on
            your total income. If your total income exceeds Rs.5 Lakh, the late fee is Rs.5,000.
            If your income is between Rs.2.5 Lakh and Rs.5 Lakh, the fee is Rs.1,000. If your income
            is below the basic exemption limit of Rs.2.5 Lakh (Rs.3 Lakh for senior citizens,
            Rs.5 Lakh for super seniors), no late fee applies as filing is not mandatory.
            Additionally, if you have unpaid tax, interest under Sections 234A, 234B, and 234C
            may also apply.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            Section 234F late filing fee - Rs.1,000 vs Rs.5,000
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Section 234F imposes a flat late filing fee - not a per-day penalty. This is a
            common misconception. Whether you file your return 1 day late or 6 months late,
            the fee is the same. The fee amount depends solely on your total income:
          </p>
          <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-4">
            <li><strong>Income &lt;= Rs.5 Lakh:</strong> Late fee is Rs.1,000</li>
            <li><strong>Income &gt; Rs.5 Lakh:</strong> Late fee is Rs.5,000</li>
            <li><strong>Income below basic exemption (Rs.2.5L):</strong> No late fee (filing not mandatory)</li>
          </ul>
          <p className="text-muted-foreground leading-relaxed mt-4">
            Note that prior to FY 2020-21, there was also a Rs.10,000 fee for returns filed after
            31 December. This distinction has been removed - the fee is now Rs.5,000 regardless
            of when you file (as long as it&apos;s within the belated return window).
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            Section 234A interest - how is it calculated?
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Section 234A charges interest at 1% per month (or part of a month) on unpaid tax
            from the original due date until the date of filing. The key word is &quot;unpaid tax&quot;
            - if all your tax liability was covered by TDS and advance tax, Section 234A
            interest will be zero. The calculation formula is:
          </p>
          <p className="text-muted-foreground leading-relaxed mt-4 font-mono bg-muted p-4 rounded">
            Interest = Outstanding Tax x 1% x Number of Months Late (rounded up)
          </p>
          <p className="text-muted-foreground leading-relaxed mt-4">
            For example, if you have Rs.20,000 outstanding tax and file 3.5 months late, the
            interest would be: Rs.20,000 x 1% x 4 months = Rs.800. Note that 3.5 months is rounded
            up to 4 months - partial months count as full months for interest calculation.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            What happens if I miss the ITR filing deadline for my company?
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Companies (Pvt Ltd, Public Ltd) have additional compliance requirements beyond
            individual taxpayers. The ITR due date for companies is 31 October (not 31 July)
            as audit is always mandatory. Missing the deadline has the following consequences:
          </p>
          <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-4">
            <li><strong>Section 234F:</strong> Rs.5,000 late filing fee (as company income is typically above Rs.5 Lakh)</li>
            <li><strong>Section 234A:</strong> 1% per month interest on unpaid tax</li>
            <li><strong>Section 234B:</strong> 1% per month on advance tax shortfall</li>
            <li><strong>Section 271B:</strong> Penalty for not getting audit done - 0.5% of turnover or Rs.1,50,000 (whichever is lower)</li>
            <li><strong>Director liability:</strong> Directors may face personal consequences for company non-compliance</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            How to file a belated return under Section 139(4)
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            If you have missed the original due date (31 July or 31 October), you can still
            file a &quot;belated return&quot; under Section 139(4) of the Income Tax Act. The belated
            return can be filed until 31 December of the assessment year. For FY 2024-25
            (AY 2025-26), this means you can file until 31 December 2025. The process is:
          </p>
          <ol className="list-decimal list-inside text-muted-foreground space-y-2 mt-4">
            <li>Login to the Income Tax e-filing portal (incometax.gov.in)</li>
            <li>Go to e-File &gt; Income Tax Returns &gt; File Income Tax Return</li>
            <li>Select the Assessment Year and ITR form applicable to you</li>
            <li>Fill in all required details including income, deductions, and tax payments</li>
            <li>Pay any outstanding tax liability (including the late fee)</li>
            <li>Verify and submit the return using Aadhaar OTP, EVC, or DSC</li>
          </ol>
          <p className="text-muted-foreground leading-relaxed mt-4">
            Note that in a belated return, you cannot carry forward certain losses (business
            losses, speculation losses) to future years - this benefit is only available if
            you file on time. Need help filing?{' '}
            <Link href="/services/itr-filing" className="text-emerald-600 hover:underline">
              Ollvy can file your ITR - starting Rs.999
            </Link>.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            ITR filing due dates for FY 2024-25
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            The ITR filing due dates for FY 2024-25 (Assessment Year 2025-26) are:
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-muted-foreground">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 pr-4">Category</th>
                  <th className="text-left py-2 pr-4">Audit Required?</th>
                  <th className="text-left py-2">Due Date</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-2 pr-4">Individual / HUF (non-audit)</td>
                  <td className="py-2 pr-4">No</td>
                  <td className="py-2">31 July 2025</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 pr-4">Individual / HUF (audit required)</td>
                  <td className="py-2 pr-4">Yes</td>
                  <td className="py-2">31 October 2025</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 pr-4">Partnership Firm (non-audit)</td>
                  <td className="py-2 pr-4">No</td>
                  <td className="py-2">31 July 2025</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 pr-4">Partnership Firm (audit required)</td>
                  <td className="py-2 pr-4">Yes</td>
                  <td className="py-2">31 October 2025</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 pr-4">LLP</td>
                  <td className="py-2 pr-4">Always Yes</td>
                  <td className="py-2">31 October 2025</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 pr-4">Company (Pvt Ltd / Public Ltd)</td>
                  <td className="py-2 pr-4">Always Yes</td>
                  <td className="py-2">31 October 2025</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4">Belated Return (all categories)</td>
                  <td className="py-2 pr-4">-</td>
                  <td className="py-2">31 December 2025</td>
                </tr>
              </tbody>
            </table>
          </div>
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
          <Link href="/tools/penalty-calculator/tds-late-filing" className="block">
            <Card className="p-4 rounded-none hover:border-emerald-500 transition-colors">
              <h3 className="font-semibold text-foreground">TDS Late Filing Calculator</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Calculate Section 234E and 271H penalties
              </p>
            </Card>
          </Link>
          <Link href="/tools/penalty-calculator/mca-annual-filing" className="block">
            <Card className="p-4 rounded-none hover:border-emerald-500 transition-colors">
              <h3 className="font-semibold text-foreground">MCA Annual Filing Calculator</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Calculate AOC-4 and MGT-7 late filing penalties
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
