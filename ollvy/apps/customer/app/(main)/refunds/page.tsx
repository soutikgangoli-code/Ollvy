import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Refund Policy | Ollvy',
  description: 'Refund policy for Ollvy compliance services. Understand our refund process, eligibility criteria, and timelines for GST registration, company incorporation, and other services.',
  // Legal/policy page — required to be publicly accessible (Razorpay compliance) but
  // shouldn't compete with service pages in SERP. follow:true so footer links still pass juice.
  robots: { index: false, follow: true },
  alternates: {
    canonical: 'https://www.ollvy.com/refunds',
  },
  openGraph: {
    title: 'Refund Policy | Ollvy',
    description: 'Refund policy for Ollvy compliance services. Understand our refund process, eligibility criteria, and timelines for GST registration, company incorporation, and other services.',
    url: 'https://www.ollvy.com/refunds',
    images: [{ url: 'https://www.ollvy.com/logo.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Refund Policy | Ollvy',
    description: 'Refund policy for Ollvy compliance services. Understand our refund process, eligibility criteria, and timelines for GST registration, company incorporation, and other services.',
    images: ['https://www.ollvy.com/logo.png'],
  },
}

export default function RefundsPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold text-foreground mb-6">Refund Policy</h1>
      <p className="text-sm text-muted-foreground mb-8">Last updated: March 2026</p>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-foreground mb-4">1. Eligibility for Refund</h2>
          <p className="text-muted-foreground leading-relaxed">
            Refunds are provided for cancelled orders where no work has been initiated. If partial work
            has been completed, a prorated refund may be issued based on the stage of completion.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-foreground mb-4">2. Government Fees</h2>
          <p className="text-muted-foreground leading-relaxed">
            Government fees ({' '}
            <Link href="/services/gst-registration" className="text-foreground underline hover:no-underline">GST</Link> portal fees,{' '}
            <Link href="/services/pvt-ltd-incorporation" className="text-foreground underline hover:no-underline">MCA</Link> filing fees, stamp duty, etc.) are non-refundable
            once paid to the respective authorities. These fees are passed through directly and Ollvy
            does not retain any portion of government fees.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-foreground mb-4">3. Refund Timeline</h2>
          <p className="text-muted-foreground leading-relaxed">
            Approved refunds are processed within 7-10 business days. Refunds are credited to the
            original payment method. Bank processing times may add additional days for the amount
            to reflect in your account.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-foreground mb-4">4. Service Guarantee</h2>
          <p className="text-muted-foreground leading-relaxed">
            If we fail to deliver the promised service within the stated SLA and the delay is solely
            due to Ollvy, you may be eligible for a full refund of the Ollvy service fee. This does
            not apply to delays caused by government processing times, document issues, or client
            response delays.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-foreground mb-4">5. How to Request a Refund</h2>
          <p className="text-muted-foreground leading-relaxed">
            To request a refund, contact us at{' '}
            <a href="mailto:support@ollvy.com" className="text-foreground underline">
              support@ollvy.com
            </a>{' '}
            with your order ID and reason for the refund request. Our team will review and respond
            within 48 hours.
          </p>
        </section>
      </div>
    </main>
  )
}
