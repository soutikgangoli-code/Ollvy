import { Suspense } from 'react'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { GSTLateFilingCalculator, CalculatorSkeleton } from '@/components/penalty-calculator/GSTLateFilingCalculator'

// FAQs for SEO
const faqs = [
  {
    question: 'What is the GST late filing penalty for GSTR-3B?',
    answer: 'For a regular (non-nil) GSTR-3B, the late fee is ₹50 per day - ₹25 CGST and ₹25 SGST. The maximum is capped at ₹5,000 total (₹2,500 each). For a nil return, the fee is ₹20 per day (₹10 CGST + ₹10 SGST), also capped at ₹5,000.',
  },
  {
    question: 'What is the late fee for GSTR-1?',
    answer: 'GSTR-1 follows the same structure as GSTR-3B: ₹50 per day for regular returns and ₹20 per day for nil returns, maximum ₹5,000.',
  },
  {
    question: 'What is the GSTR-9 annual return late fee?',
    answer: 'GSTR-9 carries ₹200 per day (₹100 CGST + ₹100 SGST), capped at 0.25% of your annual turnover. For a ₹1 Crore business, the maximum is ₹25,000. This was reduced from 0.5% by Notification 07/2023-Central Tax.',
  },
  {
    question: 'Is there interest on late GST payment separately from the late fee?',
    answer: 'Yes. Section 50 of CGST Act charges interest at 18% per annum on outstanding GST tax liability from the original due date. This is separate from the late filing fee.',
  },
  {
    question: 'Can GST late fees be waived?',
    answer: 'The government has periodically announced amnesty schemes (such as the 2023 scheme). Routine waiver is not available - the late fee must be paid before the return can be filed.',
  },
  {
    question: 'What is the QRMP scheme?',
    answer: 'QRMP (Quarterly Return Monthly Payment) allows taxpayers with annual turnover up to ₹5 Crore to file GSTR-3B quarterly instead of monthly. Monthly PMT-06 challans must still be paid.',
  },
  {
    question: 'What happens if I never file a GST return?',
    answer: 'Continued non-filing attracts the maximum late fee (₹5,000 per return). GST registration can also be cancelled under Section 29 for sustained non-filing - typically 6 consecutive months for monthly filers.',
  },
  {
    question: 'How is GST interest on unpaid tax calculated?',
    answer: 'Interest = Tax Amount × 18% × (Days / 365). Example: ₹50,000 unpaid for 60 days = ₹50,000 × 0.18 × (60/365) = ₹1,479.',
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
  name: 'How to calculate GST late filing penalty',
  step: [
    { '@type': 'HowToStep', name: 'Select return type', text: 'Choose GSTR-1, GSTR-3B, or GSTR-9' },
    { '@type': 'HowToStep', name: 'Indicate if nil return', text: 'Toggle if this is a nil return (no tax liability)' },
    { '@type': 'HowToStep', name: 'Enter annual turnover', text: 'Use the slider to set your annual turnover' },
    { '@type': 'HowToStep', name: 'Enter days late', text: 'Use the slider to set days past due date' },
    { '@type': 'HowToStep', name: 'View penalty', text: 'See total penalty with CGST/SGST breakdown' },
  ],
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://ollvy.com' },
    { '@type': 'ListItem', position: 2, name: 'Tools', item: 'https://ollvy.com/tools' },
    { '@type': 'ListItem', position: 3, name: 'Penalty Calculator', item: 'https://ollvy.com/tools/penalty-calculator' },
    { '@type': 'ListItem', position: 4, name: 'GST Late Filing', item: 'https://ollvy.com/tools/penalty-calculator/gst-late-filing' },
  ],
}

export default function GSTLatePenaltyPage() {
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
        <GSTLateFilingCalculator />
      </Suspense>

      {/* SEO Content - Server Rendered */}
      <div className="mt-16 max-w-3xl space-y-12">
        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            What is the GST late filing penalty in India?
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            The GST late filing penalty in India is governed by Section 47 of the CGST Act 2017.
            When a registered person fails to furnish their GST return by the due date, they are
            liable to pay a late fee. The late fee structure varies based on the type of return
            filed. For GSTR-1 and GSTR-3B, the late fee is ₹50 per day of delay (₹25 CGST + ₹25 SGST)
            for regular returns, and ₹20 per day (₹10 CGST + ₹10 SGST) for nil returns. The maximum
            late fee is capped at ₹5,000 per return. For GSTR-9 annual returns, the late fee is
            ₹200 per day, capped at 0.25% of the annual turnover.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            GST late fee for GSTR-1 and GSTR-3B - how is it calculated?
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            The calculation of GST late fees for GSTR-1 and GSTR-3B is straightforward. For every
            day of delay beyond the due date, a fixed late fee accrues. The rate depends on whether
            it&apos;s a regular return (with tax liability) or a nil return (no tax liability).
          </p>
          <ul className="list-disc list-inside text-muted-foreground space-y-2">
            <li><strong>Regular returns:</strong> ₹50 per day (₹25 CGST + ₹25 SGST)</li>
            <li><strong>Nil returns:</strong> ₹20 per day (₹10 CGST + ₹10 SGST)</li>
            <li><strong>Maximum cap:</strong> ₹5,000 per return for both types</li>
          </ul>
          <p className="text-muted-foreground leading-relaxed mt-4">
            Additionally, if there is any outstanding tax liability, interest at 18% per annum
            is charged under Section 50 of the CGST Act from the due date until the date of payment.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            GSTR-9 annual return penalty - 2024-25 rates
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            The GSTR-9 annual return carries a higher per-day late fee but also has a turnover-based
            cap. As per Notification 07/2023-Central Tax dated 31 March 2023, the maximum late fee
            for GSTR-9 is capped at 0.25% of annual turnover. The per-day rate is ₹200 (₹100 CGST +
            ₹100 SGST). This means for a business with ₹1 Crore turnover, the maximum late fee
            would be ₹25,000 regardless of how many days late the return is filed. For smaller
            businesses, this cap provides significant relief compared to the previous 0.5% cap.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            Can GST late fees be waived?
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Routine waiver of GST late fees is not available under the current tax framework.
            The late fee must be paid along with the return before it can be filed on the GST
            portal. However, the government has periodically announced amnesty schemes that
            provide relief to taxpayers with pending returns. The 2023 amnesty scheme, for
            example, waived late fees for returns filed between April 2021 and June 2023 for
            certain categories of taxpayers. Such schemes are announced through notifications
            and circulars, and businesses should watch for such opportunities to clear pending
            returns at reduced costs.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            How to avoid GST late fees going forward
          </h2>

          <h3 className="text-lg font-medium text-foreground mt-6 mb-3">
            Set up monthly reminders for GST due dates
          </h3>
          <p className="text-muted-foreground leading-relaxed">
            Mark the 11th (GSTR-1) and 20th (GSTR-3B) of each month in your calendar with reminders
            set 3-5 days before the due date. This gives you sufficient time to compile data and
            file returns without last-minute rush.
          </p>

          <h3 className="text-lg font-medium text-foreground mt-6 mb-3">
            Switch to QRMP scheme if eligible
          </h3>
          <p className="text-muted-foreground leading-relaxed">
            If your annual turnover is up to ₹5 Crore, consider opting for the QRMP (Quarterly
            Return Monthly Payment) scheme. Under QRMP, you file GSTR-3B quarterly instead of
            monthly, reducing the compliance burden. However, you must still pay tax monthly
            through the PMT-06 challan.
          </p>

          <h3 className="text-lg font-medium text-foreground mt-6 mb-3">
            Use Ollvy for managed GST filing
          </h3>
          <p className="text-muted-foreground leading-relaxed">
            Outsource your GST compliance to professionals who track deadlines, compile data,
            and file returns on your behalf. This eliminates the risk of missed deadlines and
            ensures accurate filing every month.{' '}
            <Link href="/services/gst-return-filing" className="text-emerald-600 hover:underline">
              Learn more about Ollvy&apos;s GST filing service
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
