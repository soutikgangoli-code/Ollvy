import { Metadata } from 'next'
import Link from 'next/link'
import { Linkedin, Mail } from 'lucide-react'

export const metadata: Metadata = {
  title: 'About | Ollvy',
  description: 'Ollvy Technologies Private Limited. Who runs the company, where we are registered, and who to contact if something goes wrong.',
  alternates: {
    canonical: 'https://www.ollvy.com/about',
  },
  openGraph: {
    title: 'About | Ollvy',
    description: 'Ollvy Technologies Private Limited. Who runs the company, where we are registered, and who to contact if something goes wrong.',
    url: 'https://www.ollvy.com/about',
    images: [{ url: 'https://www.ollvy.com/logo.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About | Ollvy',
    description: 'Ollvy Technologies Private Limited. Who runs the company, where we are registered, and who to contact if something goes wrong.',
    images: ['https://www.ollvy.com/logo.png'],
  },
}

export default function AboutPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold text-foreground mb-10">About Ollvy</h1>

      <div className="prose prose-neutral dark:prose-invert max-w-none">

        {/* Company */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-foreground mb-4">The company</h2>
          <p className="text-muted-foreground leading-relaxed">
            Ollvy Technologies Private Limited. Incorporated 2024.
          </p>
          <div className="mt-4 text-sm text-muted-foreground space-y-1">
            <p>
              <span className="font-medium text-foreground">Registered office:</span>{' '}
              737, Block A, Sushant Lok Phase 1, Sector 43, Gurgaon 122009, Haryana
            </p>
          </div>
        </section>

        {/* How it works */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-foreground mb-4">How Ollvy works</h2>
          <p className="text-muted-foreground leading-relaxed">
            Ollvy assigns the CA or CS. Ollvy owns the deadline. If something goes wrong, Ollvy fixes it.
          </p>
          <p className="text-muted-foreground leading-relaxed mt-3">
            This is not a marketplace. We do not pass your documents to a random professional and disappear.
            Your assigned CA is an ICAI-enrolled member with a minimum of three years of practice.
            Every order carries a guaranteed completion date, and if we miss it, the full service fee is refunded automatically.
          </p>
        </section>

        {/* Founder */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-foreground mb-4">Who runs this</h2>
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center shrink-0 text-lg font-semibold text-foreground">
              SG
            </div>
            <div>
              <p className="font-semibold text-foreground">Soutik Gangoli</p>
              <p className="text-sm text-muted-foreground mt-1">Founder</p>
              <div className="flex items-center gap-3 mt-2">
                <Link
                  href="https://linkedin.com/in/soutikganguly"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Linkedin size={14} />
                  LinkedIn
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Escalation */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-foreground mb-4">Something not right?</h2>
          <p className="text-muted-foreground leading-relaxed">
            If your assigned professional is unresponsive, or something is not going the way it should:
          </p>
          <div className="mt-4 space-y-3">
            <div className="flex items-center gap-2.5">
              <Mail size={14} className="text-muted-foreground shrink-0" />
              <div>
                <p className="text-sm text-foreground font-medium">Escalation</p>
                <Link
                  href="mailto:care@ollvy.com"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  care@ollvy.com
                </Link>
                <p className="text-xs text-muted-foreground mt-0.5">Soutik reads these. You will hear back within 24 hours.</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <Mail size={14} className="text-muted-foreground shrink-0" />
              <div>
                <p className="text-sm text-foreground font-medium">General questions</p>
                <Link
                  href="mailto:support@ollvy.com"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  support@ollvy.com
                </Link>
              </div>
            </div>
          </div>
        </section>

      </div>
    </main>
  )
}
