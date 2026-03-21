import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy | Ollvy',
  description: 'Privacy policy for Ollvy Technologies Private Limited. Learn how we collect, use, and protect your personal information.',
  alternates: {
    canonical: 'https://ollvy.com/privacy',
  },
}

export default function PrivacyPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold text-foreground mb-6">Privacy Policy</h1>
      <p className="text-sm text-muted-foreground mb-8">Last updated: March 2026</p>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-foreground mb-4">1. Information We Collect</h2>
          <p className="text-muted-foreground leading-relaxed">
            We collect information you provide directly to us, including name, email address, phone number,
            business details, and documents necessary to provide our compliance services. We also collect
            information automatically when you use our services, including IP address, browser type, and
            device information.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-foreground mb-4">2. How We Use Your Information</h2>
          <p className="text-muted-foreground leading-relaxed">
            We use the information we collect to provide, maintain, and improve our services, process
            transactions, send you technical notices and support messages, and respond to your inquiries.
            Your documents are used solely for the purpose of completing the compliance services you request.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-foreground mb-4">3. Information Sharing</h2>
          <p className="text-muted-foreground leading-relaxed">
            We share your information with third parties only as necessary to provide our services,
            including government portals (GST, MCA, FSSAI, etc.) for filing purposes, and vetted CAs
            and lawyers who handle your compliance work. We do not sell your personal information.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-foreground mb-4">4. Data Security</h2>
          <p className="text-muted-foreground leading-relaxed">
            We implement appropriate technical and organizational measures to protect your personal
            information against unauthorized access, alteration, disclosure, or destruction. All data
            is encrypted in transit and at rest.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-foreground mb-4">5. Contact Us</h2>
          <p className="text-muted-foreground leading-relaxed">
            If you have any questions about this Privacy Policy, please contact us at{' '}
            <a href="mailto:privacy@ollvy.com" className="text-foreground underline">
              privacy@ollvy.com
            </a>.
          </p>
        </section>
      </div>
    </main>
  )
}
