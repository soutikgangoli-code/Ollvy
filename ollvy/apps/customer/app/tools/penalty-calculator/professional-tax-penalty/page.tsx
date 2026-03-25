import { Suspense } from 'react'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { ProfessionalTaxCalculator, CalculatorSkeleton } from '@/components/penalty-calculator/ProfessionalTaxCalculator'

// FAQs for SEO
const faqs = [
  {
    question: 'What is Professional Tax (PT) in India?',
    answer: 'Professional Tax is a state-level tax levied on salaried employees, professionals, and traders. It is deducted by employers from employee salaries and remitted to the state government. The maximum PT is capped at Rs.2,500 per year as per Article 276 of the Constitution.',
  },
  {
    question: 'Which states levy Professional Tax in India?',
    answer: 'PT is levied by: Maharashtra, Karnataka, West Bengal, Andhra Pradesh, Telangana, Tamil Nadu, Gujarat, Assam, Kerala, Odisha, Meghalaya, Tripura, and Sikkim. States like Delhi, Uttar Pradesh, Rajasthan, Haryana do not levy PT.',
  },
  {
    question: 'What is the penalty for late PT payment in Maharashtra?',
    answer: 'In Maharashtra, the penalty for late PT payment is 10% of the tax due per month of delay. For example, if PT due is Rs.10,000 and it is 3 months late, penalty would be Rs.10,000 x 10% x 3 = Rs.3,000.',
  },
  {
    question: 'How is PT different from Income Tax?',
    answer: 'PT is a state tax with a maximum cap of Rs.2,500/year, deducted by employers. Income Tax is a central tax with progressive rates up to 30%, filed by individuals. PT paid is deductible while computing taxable income for Income Tax.',
  },
  {
    question: 'Who is liable to pay Professional Tax?',
    answer: 'All salaried employees, self-employed professionals (doctors, lawyers, CAs, etc.), and traders earning above the threshold (varies by state, typically Rs.10,000-15,000/month) are liable to pay PT.',
  },
  {
    question: 'How to register for Professional Tax as an employer?',
    answer: 'Employers must register on their state\'s PT portal within 30 days of becoming liable (i.e., hiring employees). Registration requires PAN, address proof, employee count, and salary details. A PT Enrollment Certificate (PTEC) is issued upon registration.',
  },
  {
    question: 'Can PT penalty be waived?',
    answer: 'Some states offer amnesty schemes periodically where penalties may be reduced or waived if arrears are paid. Outside such schemes, penalties must be paid in full. Check your state PT department for current schemes.',
  },
  {
    question: 'What happens if an employer does not deduct PT?',
    answer: 'Employers are liable for the PT amount even if not deducted from employees. Additionally, penalties apply for non-deduction. In some states, prosecution may be initiated for willful non-compliance.',
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
  name: 'How to calculate Professional Tax penalty',
  step: [
    { '@type': 'HowToStep', name: 'Select state', text: 'Choose your state of registration' },
    { '@type': 'HowToStep', name: 'Enter employee count', text: 'Specify the number of employees' },
    { '@type': 'HowToStep', name: 'Enter months late', text: 'Specify how many months the payment is overdue' },
    { '@type': 'HowToStep', name: 'View penalty', text: 'See total penalty based on your state\'s PT rules' },
  ],
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://ollvy.com' },
    { '@type': 'ListItem', position: 2, name: 'Tools', item: 'https://ollvy.com/tools' },
    { '@type': 'ListItem', position: 3, name: 'Penalty Calculator', item: 'https://ollvy.com/tools/penalty-calculator' },
    { '@type': 'ListItem', position: 4, name: 'Professional Tax Penalty', item: 'https://ollvy.com/tools/penalty-calculator/professional-tax-penalty' },
  ],
}

export default function ProfessionalTaxPenaltyPage() {
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
        <ProfessionalTaxCalculator />
      </Suspense>

      {/* SEO Content - Server Rendered */}
      <div className="mt-16 max-w-3xl space-y-12">
        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            What is Professional Tax (PT) in India?
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Professional Tax is a state-level tax levied on individuals earning income from
            employment, profession, or trade. It is collected by employers from employee
            salaries and remitted to the state government. Under Article 276 of the Indian
            Constitution, the maximum Professional Tax that can be levied is capped at
            Rs.2,500 per person per year. Not all states levy PT - it is primarily collected
            in Maharashtra, Karnataka, West Bengal, Andhra Pradesh, Telangana, Tamil Nadu,
            Gujarat, and a few other states.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            Which states levy Professional Tax?
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Professional Tax is levied by the following states and union territories:
          </p>
          <ul className="list-disc list-inside text-muted-foreground space-y-1">
            <li><strong>Maharashtra:</strong> Max Rs.2,500/year, 10% penalty per month</li>
            <li><strong>Karnataka:</strong> Max Rs.2,400/year, 2% penalty per month</li>
            <li><strong>West Bengal:</strong> Max Rs.2,500/year, 25% flat penalty</li>
            <li><strong>Tamil Nadu:</strong> Max Rs.2,400/year, 10% + 2%/month interest</li>
            <li><strong>Andhra Pradesh &amp; Telangana:</strong> Max Rs.2,400/year, 25% flat penalty</li>
            <li><strong>Gujarat:</strong> Max Rs.2,500/year, 2% penalty per month</li>
            <li><strong>Kerala:</strong> Max Rs.2,400/year, 12% per annum</li>
          </ul>
          <p className="text-muted-foreground leading-relaxed mt-4">
            States like Delhi, Uttar Pradesh, Rajasthan, Haryana, and Punjab do not levy
            Professional Tax.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            Professional Tax slab rates for employees - state-wise
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            PT slabs vary by state. Here&apos;s a simplified overview of monthly PT for
            employees in major PT states:
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-muted-foreground">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 pr-4">Monthly Salary</th>
                  <th className="text-left py-2 pr-4">Maharashtra</th>
                  <th className="text-left py-2 pr-4">Karnataka</th>
                  <th className="text-left py-2">West Bengal</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-2 pr-4">Up to Rs.10,000</td>
                  <td className="py-2 pr-4">Nil</td>
                  <td className="py-2 pr-4">Nil</td>
                  <td className="py-2">Nil</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 pr-4">Rs.10,001 - Rs.15,000</td>
                  <td className="py-2 pr-4">Rs.175</td>
                  <td className="py-2 pr-4">Rs.150</td>
                  <td className="py-2">Rs.110</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 pr-4">Rs.15,001 - Rs.25,000</td>
                  <td className="py-2 pr-4">Rs.200</td>
                  <td className="py-2 pr-4">Rs.200</td>
                  <td className="py-2">Rs.130</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4">Above Rs.25,000</td>
                  <td className="py-2 pr-4">Rs.200 (Rs.300 in Feb)</td>
                  <td className="py-2 pr-4">Rs.200</td>
                  <td className="py-2">Rs.200</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            Penalty for non-payment of Professional Tax
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Penalties for late or non-payment of Professional Tax vary by state. Maharashtra
            charges the highest at 10% per month of delay. Most other states charge 2% per
            month. West Bengal, Andhra Pradesh, and Telangana charge a flat 25% penalty
            regardless of the delay period. Tamil Nadu charges a combination of 10% penalty
            plus 2% monthly interest. In all states, the principal tax amount must also be
            paid along with the penalty.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            How to register for Professional Tax as an employer
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Employers must register for PT within 30 days of becoming liable (hiring
            employees in a PT state). The registration process is:
          </p>
          <ol className="list-decimal list-inside text-muted-foreground space-y-2">
            <li>Visit your state&apos;s PT portal (e.g., mahagst.gov.in for Maharashtra)</li>
            <li>Apply for PT Enrollment Certificate (PTEC) as an employer</li>
            <li>Submit required documents: PAN, address proof, employee details</li>
            <li>Pay the registration fee (typically Rs.2,500 for 5 years)</li>
            <li>Receive PTEC number for filing returns and making payments</li>
          </ol>
          <p className="text-muted-foreground leading-relaxed mt-4">
            After registration, you must file monthly/quarterly returns and pay PT by the
            due date. Need help with PT registration?{' '}
            <Link href="/services/payroll-management" className="text-emerald-600 hover:underline">
              Ollvy can handle your PT compliance
            </Link>.
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
              <h3 className="font-semibold text-foreground">PF/ESIC Penalty Calculator</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Calculate EPF and ESIC late payment penalties
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
