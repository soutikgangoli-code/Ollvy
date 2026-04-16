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
    <main className="max-w-2xl mx-auto px-6 py-12 sm:py-20">
      {/* Header */}
      <div className="mb-12 sm:mb-16">
        <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3 font-mono">About</p>
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground">Ollvy</h1>
        <p className="text-muted-foreground mt-3 text-sm sm:text-base leading-relaxed max-w-xl">
          Company registration, GST, trademark, and compliance for Indian businesses. Fixed prices. Tracked delivery. Vetted CAs.
        </p>
      </div>

      <div className="space-y-12 sm:space-y-16">

        {/* How it works */}
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-4">How it works</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <span className="font-mono text-xs font-bold text-muted-foreground bg-muted rounded-md w-6 h-6 flex items-center justify-center shrink-0 mt-0.5">1</span>
              <p className="text-sm text-muted-foreground leading-relaxed">You pick a service and pay. Ollvy assigns an ICAI-enrolled CA with 3+ years of practice.</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="font-mono text-xs font-bold text-muted-foreground bg-muted rounded-md w-6 h-6 flex items-center justify-center shrink-0 mt-0.5">2</span>
              <p className="text-sm text-muted-foreground leading-relaxed">Upload documents. Your CA reviews everything before filing - mismatches and errors caught upfront.</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="font-mono text-xs font-bold text-muted-foreground bg-muted rounded-md w-6 h-6 flex items-center justify-center shrink-0 mt-0.5">3</span>
              <p className="text-sm text-muted-foreground leading-relaxed">Track every stage in-app. Every order has a guaranteed completion date - miss it and the service fee is refunded.</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-4 border-l-2 border-border pl-3">
            Not a marketplace. Ollvy owns the deadline, handles officer queries, and fixes problems.
          </p>
        </section>

        {/* Founder */}
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-4">Who runs this</h2>
          <div className="flex items-center gap-4 p-4 rounded-xl border border-border bg-card">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center shrink-0 text-sm font-bold text-foreground font-mono">
              SG
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-foreground text-sm">Soutik Gangoli</p>
              <p className="text-xs text-muted-foreground">Founder</p>
            </div>
            <Link
              href="https://linkedin.com/in/soutikganguly"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors shrink-0"
            >
              <Linkedin size={14} />
            </Link>
          </div>
        </section>

        {/* Contact */}
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-4">Something not right?</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            <div className="p-4 rounded-xl border border-border bg-card">
              <div className="flex items-center gap-2 mb-2">
                <Mail size={14} className="text-muted-foreground" />
                <p className="text-sm font-medium text-foreground">Escalation</p>
              </div>
              <Link href="mailto:care@ollvy.com" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                care@ollvy.com
              </Link>
              <p className="text-xs text-muted-foreground mt-1">Soutik reads these. Reply within 24 hours.</p>
            </div>
            <div className="p-4 rounded-xl border border-border bg-card">
              <div className="flex items-center gap-2 mb-2">
                <Mail size={14} className="text-muted-foreground" />
                <p className="text-sm font-medium text-foreground">General questions</p>
              </div>
              <Link href="mailto:support@ollvy.com" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                support@ollvy.com
              </Link>
            </div>
          </div>
        </section>

        {/* Company details */}
        <section className="pt-8 border-t border-border">
          <div className="flex flex-wrap gap-x-8 gap-y-2 text-xs text-muted-foreground font-mono">
            <span>Ollvy Technologies Private Limited</span>
            <span>Incorporated 2026</span>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            737, Block A, Sushant Lok Phase 1, Sector 43, Gurgaon 122009, Haryana
          </p>
        </section>

      </div>
    </main>
  )
}
