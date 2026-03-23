import { Suspense } from 'react'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { PFESICCalculator, CalculatorSkeleton } from '@/components/penalty-calculator/PFESICCalculator'

// FAQs for SEO
const faqs = [
  {
    question: 'What is the penalty for late payment of EPF?',
    answer: 'Late EPF payment attracts damages under Section 14B of the EPF Act. Damages are charged at rates from 5% to 100% based on delay duration: 0-2 months: 5%, 2-4 months: 10%, 4-6 months: 15%, >6 months: 25% p.a. (100% for criminal prosecution cases).',
  },
  {
    question: 'What is the EPF interest rate on late payment?',
    answer: 'In addition to Section 14B damages, Section 7Q charges interest at 12% per annum from the date on which the contribution became due until the date of actual payment.',
  },
  {
    question: 'What is ESIC late payment penalty?',
    answer: 'ESIC charges interest at 12% per annum under Section 39(5)(a) of the ESI Act. Unlike EPF, there is no separate damages component - only interest applies.',
  },
  {
    question: 'When is EPF due date for payment?',
    answer: 'EPF must be deposited by the 15th of the following month. For March, the due date is 15th April. Missing this deadline attracts Section 14B damages and Section 7Q interest.',
  },
  {
    question: 'Is ESIC mandatory for all companies?',
    answer: 'ESIC is mandatory for establishments with 10 or more employees in most states (20 in some states) and where employee salary is up to Rs.21,000 per month (Rs.25,000 for PwD).',
  },
  {
    question: 'What is the EPF contribution rate for employer and employee?',
    answer: 'Both employer and employee contribute 12% of basic + DA. Employer\'s 12% is split: 8.33% to EPS and 3.67% to EPF. For establishments with <20 employees or certain industries, the rate may be 10%.',
  },
  {
    question: 'Can EPF penalty be waived?',
    answer: 'Section 14B damages can be reduced or waived by EPFO on showing reasonable cause. Interest under Section 7Q cannot be waived. Applications for damages reduction must be made to the Regional PF Commissioner.',
  },
  {
    question: 'What happens if employer does not deposit PF?',
    answer: 'Criminal prosecution under Section 406/409 IPC is possible. EPFO can attach assets and bank accounts. Directors of companies can be held personally liable. Continued non-compliance can result in imprisonment.',
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
  name: 'How to calculate PF/ESIC late payment penalty',
  step: [
    { '@type': 'HowToStep', name: 'Select contribution type', text: 'Choose EPF only, ESIC only, or both' },
    { '@type': 'HowToStep', name: 'Enter contribution amount', text: 'Specify the monthly PF/ESIC contribution due' },
    { '@type': 'HowToStep', name: 'Enter days late', text: 'Indicate how many days past the 15th the payment is delayed' },
    { '@type': 'HowToStep', name: 'View penalty', text: 'See Section 14B damages, 7Q interest, and ESIC interest breakdown' },
  ],
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://ollvy.com' },
    { '@type': 'ListItem', position: 2, name: 'Tools', item: 'https://ollvy.com/tools' },
    { '@type': 'ListItem', position: 3, name: 'Penalty Calculator', item: 'https://ollvy.com/tools/penalty-calculator' },
    { '@type': 'ListItem', position: 4, name: 'PF ESIC Penalty', item: 'https://ollvy.com/tools/penalty-calculator/pf-esic-penalty' },
  ],
}

export default function PFESICPenaltyPage() {
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
        <PFESICCalculator />
      </Suspense>

      {/* SEO Content - Server Rendered */}
      <div className="mt-16 max-w-3xl space-y-12">
        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            What is the penalty for late payment of EPF (Provident Fund)?
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            The penalty for late payment of EPF (Employees&apos; Provident Fund) is governed by
            Section 14B and Section 7Q of the Employees&apos; Provident Funds and Miscellaneous
            Provisions Act, 1952. Section 14B imposes damages (penalty) based on the duration
            of delay, while Section 7Q charges interest at 12% per annum. The EPF contribution
            is due by the 15th of the following month - for example, June 2024 contributions
            are due by July 15, 2024. Missing this deadline triggers both damages and interest
            from the very first day of delay.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            Section 14B damages rate chart - EPF late payment
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Section 14B damages are charged at different rates based on the period of delay:
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-muted-foreground">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 pr-4">Period of Default</th>
                  <th className="text-left py-2">Damages Rate</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-2 pr-4">Less than 2 months</td>
                  <td className="py-2">5% per annum</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 pr-4">2 months to less than 4 months</td>
                  <td className="py-2">10% per annum</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 pr-4">4 months to less than 6 months</td>
                  <td className="py-2">15% per annum</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 pr-4">6 months and above</td>
                  <td className="py-2">25% per annum</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4">Criminal prosecution cases</td>
                  <td className="py-2">100%</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-muted-foreground leading-relaxed mt-4">
            Note that these rates are in addition to the 12% per annum interest under Section 7Q.
            For extended delays, the combined penalty can be significant.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            Section 7Q interest calculation - 12% per annum
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Section 7Q of the EPF Act charges simple interest at the rate of 12% per annum on any
            amount due under the Act from the date on which the amount became due until the date
            of actual payment. Unlike Section 14B damages which can be reduced by EPFO on showing
            reasonable cause, Section 7Q interest cannot be waived under any circumstances. The
            interest is calculated on the total EPF contribution due (both employer and employee
            share) from the 16th of the month following the wage month.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            ESIC late payment interest - Section 39(5)(a)
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            ESIC (Employees&apos; State Insurance Corporation) charges interest at 12% per annum
            on late contributions under Section 39(5)(a) of the ESI Act, 1948. Unlike EPF, there
            is no separate &quot;damages&quot; component for ESIC - only interest applies. The ESIC
            contribution (6.5% of wages, split as 4.75% employer + 1.75% employee) is due by
            the 15th of the following month. ESIC applies to establishments with 10 or more
            employees (20 in some states) where employee wages are up to Rs.21,000 per month.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            EPF and ESIC due dates - monthly compliance calendar
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Here are the key dates for EPF and ESIC compliance:
          </p>
          <ul className="list-disc list-inside text-muted-foreground space-y-2">
            <li><strong>15th of each month:</strong> Payment due date for previous month&apos;s EPF and ESIC</li>
            <li><strong>15th of each month:</strong> ECR (Electronic Challan cum Return) filing for EPF</li>
            <li><strong>15th of each month:</strong> ESIC contribution challan payment</li>
            <li><strong>25th of following month:</strong> Deadline for filing ESIC monthly return</li>
            <li><strong>April 30:</strong> EPF Annual Return filing</li>
          </ul>
          <p className="text-muted-foreground leading-relaxed mt-4">
            Missing any of these dates can result in penalties. For payroll compliance support,
            consider{' '}
            <Link href="/services/payroll-compliance" className="text-emerald-600 hover:underline">
              Ollvy&apos;s payroll compliance service
            </Link>.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            Can EPF Section 14B damages be waived or reduced?
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Yes, Section 14B damages can be reduced or waived by the Regional PF Commissioner
            if the employer can demonstrate reasonable cause for the delay. However, interest
            under Section 7Q cannot be waived under any circumstances. To apply for reduction
            of damages, the employer must submit a written application to the RPFC with
            supporting documents explaining the reason for delay (such as financial hardship,
            natural calamity, lockouts, etc.). The RPFC has discretionary power to reduce
            damages up to 0% in genuine hardship cases, but this is rare.
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
          <Link href="/tools/penalty-calculator/professional-tax-penalty" className="block">
            <Card className="p-4 rounded-none hover:border-emerald-500 transition-colors">
              <h3 className="font-semibold text-foreground">Professional Tax Penalty</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Calculate state-wise PT late payment penalties
              </p>
            </Card>
          </Link>
          <Link href="/tools/penalty-calculator/tds-late-filing" className="block">
            <Card className="p-4 rounded-none hover:border-emerald-500 transition-colors">
              <h3 className="font-semibold text-foreground">TDS Late Filing Calculator</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Calculate Section 234E and 271H penalties
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
