import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Check } from 'lucide-react'

function DashboardMockup() {
  return (
    <div className="hidden lg:block">
      <div className="relative">
        {/* Main dashboard mockup */}
        <div className="rounded-3xl border border-border bg-card shadow-2xl shadow-foreground/5 overflow-hidden">
          {/* Browser chrome */}
          <div className="h-10 bg-muted/50 border-b border-border flex items-center px-4 gap-2">
            <div className="w-3 h-3 rounded-full bg-red-400/60" />
            <div className="w-3 h-3 rounded-full bg-yellow-400/60" />
            <div className="w-3 h-3 rounded-full bg-green-400/60" />
            <div className="flex-1 mx-4">
              <div className="h-5 bg-muted rounded-md px-3 flex items-center w-48">
                <span className="text-xs text-muted-foreground">app.ollvy.com/dashboard</span>
              </div>
            </div>
          </div>

          {/* Dashboard content */}
          <div className="p-6 space-y-4">
            {/* Header */}
            <div className="flex justify-between items-center">
              <p className="text-sm font-semibold text-foreground">Your Orders</p>
              <div className="h-8 bg-primary/10 rounded-lg px-3 flex items-center">
                <span className="text-xs font-medium text-primary">+ New Order</span>
              </div>
            </div>

            {/* Order cards */}
            <div className="space-y-3">
              {[
                { status: 'done', name: 'GST Filing - March', date: '18 Mar' },
                { status: 'progress', name: 'Pvt Ltd Incorporation', date: 'Stage 3/5' },
                { status: 'upcoming', name: 'Director KYC', date: 'Due 30 Apr' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 p-4 rounded-lg border border-border bg-background">
                  <div className={`w-3 h-3 rounded-full ${
                    item.status === 'done' ? 'bg-emerald-500' :
                    item.status === 'progress' ? 'bg-amber-500' :
                    'bg-muted-foreground/30'
                  }`} />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{item.date}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </div>
              ))}
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              <div className="p-3 rounded-lg bg-muted/50">
                <p className="text-2xl font-bold text-foreground">12</p>
                <p className="text-xs text-muted-foreground">Filings done</p>
              </div>
              <div className="p-3 rounded-lg bg-muted/50">
                <p className="text-2xl font-bold text-foreground">0</p>
                <p className="text-xs text-muted-foreground">Penalties</p>
              </div>
              <div className="p-3 rounded-lg bg-muted/50">
                <p className="text-2xl font-bold text-foreground">84</p>
                <p className="text-xs text-muted-foreground">Score</p>
              </div>
            </div>
          </div>
        </div>

        {/* Floating notification card */}
        <div className="absolute -bottom-4 -left-8 p-4 rounded-2xl border border-border bg-card shadow-xl shadow-foreground/5 max-w-[220px]">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
              <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">GSTR-3B Filed</p>
              <p className="text-xs text-muted-foreground mt-0.5">2 days before deadline</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function Hero() {
  return (
    <section className="relative min-h-[60vh] md:min-h-[80vh] lg:min-h-[90vh] flex items-center bg-background pt-12 md:pt-24 pb-12 md:pb-16">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: Bold claim */}
          <div className="max-w-[600px]">
            {/* SEO: Hidden H1 with keywords for search engines */}
            <h1 className="sr-only">Company Registration, GST & Business Compliance Services in India</h1>

            {/* The bold headline - Mercury style with larger desktop text */}
            <p className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-foreground leading-[1.08] tracking-tight" role="heading" aria-level={2}>
              Never miss a<br />
              <span className="text-muted-foreground">compliance deadline</span><br />
              again.
            </p>

            {/* The big stat - prominent with subtle glow */}
            <div className="mt-8 flex items-center gap-4">
              <div className="px-5 py-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl shadow-sm shadow-emerald-500/10 backdrop-blur-sm">
                <span className="font-mono text-3xl md:text-4xl font-bold text-emerald-600 dark:text-emerald-400">98%</span>
                <span className="ml-2 text-sm font-medium text-emerald-600 dark:text-emerald-400">on-time delivery</span>
              </div>
            </div>

            {/* Subheadline - minimal */}
            <p className="text-lg md:text-xl text-muted-foreground mt-8 max-w-[500px]">
              CA for GST. Lawyer for trademark. CS for MCA filings.
              All tracked in one dashboard.
            </p>

            {/* CTA */}
            <div className="flex flex-wrap items-center gap-4 mt-10">
              <Button size="lg" className="px-8 h-14 text-base font-semibold rounded-2xl shadow-lg shadow-primary/20" asChild>
                <Link href="/services" prefetch={true}>
                  See all services
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Right: Product screenshot */}
          <DashboardMockup />
        </div>
      </div>
    </section>
  )
}
