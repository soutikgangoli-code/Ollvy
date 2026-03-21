import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Cancellation Policy | Ollvy',
  description: 'Cancellation policy for Ollvy compliance services. Learn about our order cancellation terms and conditions.',
  alternates: {
    canonical: 'https://ollvy.com/cancellation',
  },
}

export default function CancellationPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold text-foreground mb-6">Cancellation Policy</h1>
      <p className="text-sm text-muted-foreground mb-8">Last updated: March 2026</p>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-foreground mb-4">1. Cancellation Window</h2>
          <p className="text-muted-foreground leading-relaxed">
            Orders can be cancelled within 24 hours of placement, provided no work has been initiated.
            Once our team begins document verification or filing preparation, cancellation may not be
            possible or may incur partial charges.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-foreground mb-4">2. How to Cancel</h2>
          <p className="text-muted-foreground leading-relaxed">
            To request a cancellation, contact us immediately at{' '}
            <a href="mailto:support@ollvy.com" className="text-foreground underline">
              support@ollvy.com
            </a>{' '}
            with your order ID and reason for cancellation. Our team will confirm the cancellation
            status within 24 hours.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-foreground mb-4">3. Non-Cancellable Services</h2>
          <p className="text-muted-foreground leading-relaxed">
            Services that involve government fee payment or submission to government portals cannot
            be cancelled once the payment or submission is made. Government fees are non-refundable
            as per respective authority policies.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-foreground mb-4">4. Partial Cancellation</h2>
          <p className="text-muted-foreground leading-relaxed">
            If your order includes multiple services, you may request cancellation of individual
            services that have not yet been initiated. The remaining services will continue as planned.
          </p>
        </section>
      </div>
    </main>
  )
}
