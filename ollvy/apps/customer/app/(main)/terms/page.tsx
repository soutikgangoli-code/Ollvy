import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Terms of Service | Ollvy',
  description: 'Terms of service for Ollvy Technologies Private Limited. Read our terms and conditions for using our business compliance and registration services in India.',
  alternates: {
    canonical: 'https://www.ollvy.com/terms',
  },
  openGraph: {
    title: 'Terms of Service | Ollvy',
    description: 'Terms of service for Ollvy Technologies Private Limited. Read our terms and conditions for using our business compliance and registration services in India.',
    url: 'https://www.ollvy.com/terms',
    images: [{ url: 'https://www.ollvy.com/logo.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Terms of Service | Ollvy',
    description: 'Terms of service for Ollvy Technologies Private Limited. Read our terms and conditions for using our business compliance and registration services in India.',
    images: ['https://www.ollvy.com/logo.png'],
  },
}

export default function TermsPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold text-foreground mb-6">Terms of Service</h1>
      <p className="text-sm text-muted-foreground mb-8">Last updated: March 2026</p>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-foreground mb-4">1. Acceptance of Terms</h2>
          <p className="text-muted-foreground leading-relaxed">
            By accessing or using Ollvy's services, you agree to be bound by these Terms of Service.
            If you do not agree to these terms, please do not use our services.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-foreground mb-4">2. Description of Services</h2>
          <p className="text-muted-foreground leading-relaxed">
            Ollvy provides business compliance services including but not limited to{' '}
            <Link href="/services/gst-registration" className="text-foreground underline hover:no-underline">GST registration</Link>,{' '}
            <Link href="/services/pvt-ltd-incorporation" className="text-foreground underline hover:no-underline">company incorporation</Link>,{' '}
            <Link href="/services/trademark-registration" className="text-foreground underline hover:no-underline">trademark filing</Link>, and{' '}
            <Link href="/services/business-itr" className="text-foreground underline hover:no-underline">tax return filing</Link>. Services are provided through
            our network of vetted Chartered Accountants and legal professionals.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-foreground mb-4">3. User Responsibilities</h2>
          <p className="text-muted-foreground leading-relaxed">
            You are responsible for providing accurate and complete information required for our services.
            You must ensure that all documents submitted are authentic and legally obtained. Any delays
            caused by incorrect or incomplete information may affect our service timelines.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-foreground mb-4">4. Payment Terms</h2>
          <p className="text-muted-foreground leading-relaxed">
            All prices are displayed in Indian Rupees and include applicable taxes unless otherwise stated.
            Government fees are collected separately and remitted to the respective authorities. Payment
            is required before service commencement unless otherwise agreed.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-foreground mb-4">5. Limitation of Liability</h2>
          <p className="text-muted-foreground leading-relaxed">
            Ollvy's liability is limited to the fees paid for the specific service in question. We are
            not liable for any indirect, incidental, or consequential damages arising from the use of
            our services.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-foreground mb-4">6. Contact</h2>
          <p className="text-muted-foreground leading-relaxed">
            For questions about these Terms, please contact us at{' '}
            <a href="mailto:legal@ollvy.com" className="text-foreground underline">
              legal@ollvy.com
            </a>.
          </p>
        </section>
      </div>
    </main>
  )
}
