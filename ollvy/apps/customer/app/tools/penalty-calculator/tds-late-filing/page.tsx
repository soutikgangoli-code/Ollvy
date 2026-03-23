import { Suspense } from 'react'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { TDSLateFilingCalculator, CalculatorSkeleton } from '@/components/penalty-calculator/TDSLateFilingCalculator'

// FAQs for SEO
const faqs = [
  {
    question: 'What is the penalty for late TDS return filing?',
    answer: 'Section 234E imposes Rs.200 per day of delay. The total fee cannot exceed the TDS amount in the return. For Rs.10,000 TDS and 100 days late: fee = Rs.10,000 (not Rs.20,000 - capped).',
  },
  {
    question: 'What is Section 271H and how is it different from 234E?',
    answer: 'Section 234E is the routine Rs.200/day fee. Section 271H is an additional penalty of Rs.10,000 to Rs.1,00,000 at the AO\'s discretion. Section 271H can be waived if TDS is paid, 234E fee is paid, and return is filed within 1 year.',
  },
  {
    question: 'What TDS return forms are there?',
    answer: 'Form 24Q: TDS on salary. Form 26Q: TDS on non-salary domestic payments. Form 27Q: TDS on payments to non-residents. Form 27EQ: TCS by sellers.',
  },
  {
    question: 'What is the interest rate for late TDS deposit?',
    answer: 'Deducted but deposited late: 1.5% per month under Section 201(1A). Not deducted at all: 1% per month. Partial months are rounded up.',
  },
  {
    question: 'What is Section 40(a)(ia) disallowance?',
    answer: 'If TDS is not deducted or not deposited by March 31, 30% of the underlying expense may be disallowed for income tax, increasing taxable income. This is not a penalty - it is a tax consequence.',
  },
  {
    question: 'What are the TDS return due dates?',
    answer: 'Q1 (Apr-Jun): 31 July. Q2 (Jul-Sep): 31 October. Q3 (Oct-Dec): 31 January. Q4 (Jan-Mar): 31 May.',
  },
  {
    question: 'Can TDS penalty be waived?',
    answer: 'Section 271H can be waived if all three conditions are met: TDS paid, 234E fee paid, and return filed within 1 year. Section 234E itself cannot be waived.',
  },
  {
    question: 'What is the difference between TDS and TCS?',
    answer: 'TDS is deducted by the payer when making payments (salary, rent, contractor fees). TCS is collected by the seller at the time of sale for specified goods. TCS returns are in Form 27EQ.',
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
  name: 'How to calculate TDS late filing penalty',
  step: [
    { '@type': 'HowToStep', name: 'Select return type', text: 'Choose 24Q, 26Q, 27Q, or 27EQ' },
    { '@type': 'HowToStep', name: 'Enter TDS amount', text: 'Enter the TDS/TCS amount for the quarter' },
    { '@type': 'HowToStep', name: 'Select deposit status', text: 'Indicate if TDS was deposited on time, late, or not deducted' },
    { '@type': 'HowToStep', name: 'Enter days late', text: 'Specify how many days late the return and deposit are' },
    { '@type': 'HowToStep', name: 'View penalty', text: 'See total penalty with Section 234E and 201(1A) breakdown' },
  ],
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://ollvy.com' },
    { '@type': 'ListItem', position: 2, name: 'Tools', item: 'https://ollvy.com/tools' },
    { '@type': 'ListItem', position: 3, name: 'Penalty Calculator', item: 'https://ollvy.com/tools/penalty-calculator' },
    { '@type': 'ListItem', position: 4, name: 'TDS Late Filing', item: 'https://ollvy.com/tools/penalty-calculator/tds-late-filing' },
  ],
}

export default function TDSLatePenaltyPage() {
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
        <TDSLateFilingCalculator />
      </Suspense>

      {/* SEO Content - Server Rendered */}
      <div className="mt-16 max-w-3xl space-y-12">
        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            What is the penalty for late TDS return filing?
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            The penalty for late TDS return filing is governed by Section 234E of the Income Tax
            Act 1961. A late fee of Rs.200 per day is levied from the due date of filing until
            the date of actual filing. However, the total late fee cannot exceed the TDS amount
            that was required to be deposited in that quarter. For example, if your TDS liability
            for Q1 was Rs.10,000 and you filed 100 days late, the penalty would be Rs.10,000 (capped),
            not Rs.20,000 (calculated). This cap provides some relief for smaller deductors.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            Section 234E late fee - Rs.200 per day, capped at TDS amount
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Section 234E is a mandatory late fee with no discretion involved - the fee accrues
            automatically when a TDS return is filed after the due date. The due dates for TDS
            returns are: Q1 (Apr-Jun) by 31 July, Q2 (Jul-Sep) by 31 October, Q3 (Oct-Dec) by
            31 January, and Q4 (Jan-Mar) by 31 May. The Rs.200/day calculation starts from the
            day after the due date. Unlike Section 271H (which is discretionary), Section 234E
            cannot be waived under any circumstances - it must be paid along with the return.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            Section 271H penalty - when can it be waived?
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Section 271H provides for an additional penalty of Rs.10,000 to Rs.1,00,000 at the
            discretion of the Assessing Officer. This is on top of the Section 234E late fee.
            However, Section 271H specifically allows for waiver if three conditions are met:
            (1) the TDS amount has been paid to the government, (2) the Section 234E late fee
            has been paid, and (3) the TDS return has been filed within one year of the due date.
            If all three conditions are satisfied, the AO must not levy the Section 271H penalty.
            However, if the return is filed more than one year late, the waiver protection no
            longer applies.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            TDS interest for late deposit - 1% vs 1.5%
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Section 201(1A) charges interest on TDS that is not deposited on time. The rate
            depends on the nature of the default. If TDS was deducted but not deposited by
            the due date, interest at 1.5% per month (or part of a month) is charged from the
            date of deduction to the date of deposit. If TDS was not deducted at all, interest
            at 1% per month is charged from the date when TDS should have been deducted to the
            date of actual deduction. Note that partial months are rounded up - even one day
            into a new month counts as a full month for interest calculation.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            What is 26Q and 24Q - when do you need each?
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            TDS returns are filed in different forms depending on the nature of the payment:
          </p>
          <ul className="list-disc list-inside text-muted-foreground space-y-2">
            <li>
              <strong>Form 24Q:</strong> TDS on salary payments. Filed quarterly by all employers
              who deduct TDS from employee salaries under Section 192.
            </li>
            <li>
              <strong>Form 26Q:</strong> TDS on non-salary payments to residents. Covers payments
              like interest (Section 194A), professional fees (Section 194J), rent (Section 194I),
              contractor payments (Section 194C), etc.
            </li>
            <li>
              <strong>Form 27Q:</strong> TDS on payments to non-residents. Filed when making any
              payment to a non-resident where TDS is applicable under Section 195.
            </li>
            <li>
              <strong>Form 27EQ:</strong> Tax Collected at Source (TCS). Filed by sellers who
              collect TCS on sale of specified goods like scrap, timber, minerals, etc.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            TDS compliance calendar - quarterly due dates for FY 2024-25
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Here are the key TDS compliance dates for FY 2024-25:
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-muted-foreground">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 pr-4">Quarter</th>
                  <th className="text-left py-2 pr-4">Period</th>
                  <th className="text-left py-2 pr-4">TDS Deposit Due</th>
                  <th className="text-left py-2">Return Due Date</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-2 pr-4">Q1</td>
                  <td className="py-2 pr-4">Apr 1 - Jun 30, 2024</td>
                  <td className="py-2 pr-4">7th of next month</td>
                  <td className="py-2">31 July 2024</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 pr-4">Q2</td>
                  <td className="py-2 pr-4">Jul 1 - Sep 30, 2024</td>
                  <td className="py-2 pr-4">7th of next month</td>
                  <td className="py-2">31 October 2024</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 pr-4">Q3</td>
                  <td className="py-2 pr-4">Oct 1 - Dec 31, 2024</td>
                  <td className="py-2 pr-4">7th of next month</td>
                  <td className="py-2">31 January 2025</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4">Q4</td>
                  <td className="py-2 pr-4">Jan 1 - Mar 31, 2025</td>
                  <td className="py-2 pr-4">30 April 2025</td>
                  <td className="py-2">31 May 2025</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-muted-foreground leading-relaxed mt-4">
            Note: TDS deducted in March can be deposited by 30 April (not 7 April). This gives
            additional time for year-end salary TDS adjustments. Need help with TDS compliance?{' '}
            <Link href="/services/tds-filing" className="text-emerald-600 hover:underline">
              Ollvy can file your TDS returns - starting Rs.999 per quarter
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
          <Link href="/tools/penalty-calculator/itr-late-filing" className="block">
            <Card className="p-4 rounded-none hover:border-emerald-500 transition-colors">
              <h3 className="font-semibold text-foreground">ITR Late Filing Calculator</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Calculate Section 234F, 234A, and 234B penalties
              </p>
            </Card>
          </Link>
          <Link href="/tools/penalty-calculator/gst-late-filing" className="block">
            <Card className="p-4 rounded-none hover:border-emerald-500 transition-colors">
              <h3 className="font-semibold text-foreground">GST Late Filing Calculator</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Calculate GSTR-1, GSTR-3B, and GSTR-9 penalties
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
