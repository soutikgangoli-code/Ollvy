'use client'

import Link from 'next/link'
import Script from 'next/script'
import { format, differenceInDays, isPast } from 'date-fns'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Clock, AlertTriangle, Check, Calendar, Activity, Zap } from 'lucide-react'
import { DeadlineConfig } from '@/lib/deadlines'
import { getGuaranteedDate } from '@/lib/dates'
import { Navbar } from '@/components/landing/Navbar'
import { Footer } from '@/components/landing/Footer'
import { DocumentChecklist } from '@/components/landing/DocumentChecklist'

function AvatarStack({ count }: { count: number }) {
  const initials = ['RA', 'PK', 'SM', 'DM', 'NK'].slice(0, count)
  return (
    <div className="flex -space-x-2">
      {initials.map((init, i) => (
        <div
          key={i}
          className="w-6 h-6 rounded-full bg-muted border border-background flex items-center justify-center text-[9px] font-semibold text-muted-foreground"
        >
          {init}
        </div>
      ))}
    </div>
  )
}

function getUrgencyStyle(daysLeft: number, isPastDeadline: boolean) {
  if (isPastDeadline) return 'text-red-400'
  if (daysLeft <= 7) return 'text-ollvy-amber'
  return 'text-muted-foreground'
}

function getUrgencyText(deadline: DeadlineConfig, daysLeft: number, isPastDeadline: boolean) {
  if (isPastDeadline) return deadline.postDeadlineMessage
  if (daysLeft === 0) return 'Due today — file now'
  if (daysLeft <= 7) return `${daysLeft} days left · Urgency is real`
  if (daysLeft <= 30) return `${daysLeft} days left · File now — CAs are filling up fast this season`
  return `${daysLeft} days left · ${deadline.urgencyLine}`
}

interface DeadlinePageProps {
  deadline: DeadlineConfig
}

export function DeadlinePage({ deadline }: DeadlinePageProps) {
  const dueDate = new Date(deadline.dueDate)
  const isPastDeadline = isPast(dueDate)
  const daysLeft = differenceInDays(dueDate, new Date())
  const guaranteedDate = getGuaranteedDate(deadline.slaDays)

  // JSON-LD structured data for SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: deadline.serviceName,
    description: deadline.seoDescription,
    provider: {
      '@type': 'Organization',
      name: 'Ollvy Technologies Private Limited',
      url: 'https://ollvy.com',
    },
    offers: {
      '@type': 'Offer',
      price: deadline.ollvyFee.toString(),
      priceCurrency: 'INR',
      availability: 'https://schema.org/InStock',
      validThrough: deadline.dueDate,
    },
    areaServed: {
      '@type': 'Country',
      name: 'India',
    },
  }

  return (
    <>
      <Script
        id="deadline-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="min-h-screen bg-background">
        <Navbar />

      <main className="pt-16">
        {/* Hero Section */}
        <section className="relative min-h-[80vh] flex flex-col items-center justify-center bg-background overflow-hidden">
          {/* Background effects */}
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-card" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_20%,hsl(142_71%_35%_/_0.07),transparent_60%)]" />

          {/* Social proof pill */}
          {deadline.filingCount && (
            <div className="absolute top-6 right-6 flex items-center gap-2 bg-card border border-border rounded-full px-3 py-1.5">
              <AvatarStack count={3} />
              <span className="text-xs text-muted-foreground">
                {deadline.filingCount}+ businesses filing this with Ollvy
              </span>
            </div>
          )}

          <div className="relative z-10 text-center max-w-[640px] px-6">
            {/* Service name */}
            <h1 className="text-5xl md:text-6xl font-bold text-foreground font-display">
              {deadline.serviceName}
            </h1>

            {/* Event label */}
            <p className="text-2xl md:text-3xl font-semibold text-ollvy-green mt-2">
              {deadline.heroTagline}
            </p>

            {/* Due date line */}
            <p className="text-sm text-muted-foreground mt-4">
              Due {format(dueDate, 'MMMM d, yyyy')}
            </p>

            {/* Metadata row */}
            <div className="flex justify-center gap-8 mt-6">
              <div className="text-center">
                <p className="text-xs uppercase tracking-widest text-muted-foreground">For</p>
                <p className="font-semibold text-foreground text-sm mt-1">
                  {deadline.eligibilityLabel}
                </p>
              </div>
              <div className="w-px bg-border" />
              <div className="text-center">
                <p className="text-xs uppercase tracking-widest text-muted-foreground">Type</p>
                <p className="font-semibold text-foreground text-sm mt-1">
                  {deadline.purposeLabel}
                </p>
              </div>
            </div>

            {/* CTA button */}
            <Button size="lg" className="mt-8 w-full max-w-[320px]" asChild>
              <Link href={`/services/${deadline.serviceSlug}?utm_source=deadline_page&utm_medium=landing&utm_content=${deadline.slug}_hero`}>Start Filing Now</Link>
            </Button>

            {/* Urgency line */}
            <p className={`text-sm mt-3 ${getUrgencyStyle(daysLeft, isPastDeadline)}`}>
              {getUrgencyText(deadline, daysLeft, isPastDeadline)}
            </p>
          </div>
        </section>

        {/* Service Card Section */}
        <section className="bg-card py-24">
          <div className="container">
            <Card className="border border-border bg-background p-6 max-w-[640px] mx-auto">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-lg text-foreground">{deadline.serviceName}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{deadline.eventLabel}</p>
                </div>
                {guaranteedDate && (
                  <Badge
                    className="bg-ollvy-green/10 text-ollvy-green border border-ollvy-green/20"
                    aria-label={`Guaranteed completed by ${guaranteedDate}`}
                  >
                    Done by {guaranteedDate}
                  </Badge>
                )}
              </div>

              <div className="mt-6 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Ollvy fee</span>
                  <span className="font-mono text-foreground">
                    ₹{deadline.ollvyFee.toLocaleString('en-IN')}
                  </span>
                </div>
                {deadline.govtFee && deadline.govtFee > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Govt fee</span>
                    <span className="font-mono text-foreground">
                      ₹{deadline.govtFee.toLocaleString('en-IN')}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-sm pt-2 border-t border-border">
                  <span className="font-medium text-foreground">Total</span>
                  <span className="font-mono font-bold text-foreground">
                    ₹{((deadline.ollvyFee || 0) + (deadline.govtFee || 0)).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-4 text-xs text-muted-foreground">
                <Clock size={12} />
                <span>{deadline.slaDays} working days SLA</span>
              </div>

              <Button className="w-full mt-6" asChild>
                <Link href={`/services/${deadline.serviceSlug}?utm_source=deadline_page&utm_medium=landing&utm_content=${deadline.slug}_card`}>
                  Book This Service — ₹{deadline.ollvyFee.toLocaleString('en-IN')}
                </Link>
              </Button>
            </Card>
          </div>
        </section>

        {/* Documents Section */}
        <DocumentChecklist
          defaultTab={deadline.documentTab}
          showSectionHeader={false}
          customHeading={deadline.documentHeading}
        />

        {/* Why This Deadline Matters */}
        <section className="bg-card py-24">
          <div className="container">
            <p className="text-xs uppercase tracking-widest text-muted-foreground text-center mb-3">
              PENALTY RISK
            </p>
            <h2 className="text-3xl md:text-4xl font-semibold text-foreground text-center">
              Why this deadline matters
            </h2>

            <div className="mt-12 max-w-[720px] mx-auto divide-y divide-border">
              {deadline.risks.map((risk, i) => (
                <div key={i} className="flex items-start gap-4 py-5">
                  <div className="w-10 h-10 rounded-lg bg-ollvy-red/10 flex items-center justify-center shrink-0">
                    <AlertTriangle size={18} className="text-ollvy-red" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-base text-foreground">{risk.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                      {risk.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Book This Service CTA */}
            <Card className="border border-border bg-background p-6 max-w-[640px] mx-auto mt-12">
              <div className="text-center">
                <h3 className="font-semibold text-lg text-foreground">
                  Skip the penalty. File {deadline.serviceName} now.
                </h3>
                <p className="text-sm text-muted-foreground mt-2">
                  Fixed price ₹{deadline.ollvyFee.toLocaleString('en-IN')}. Verified CA assigned within 24 hours. Done in {deadline.slaDays} working days.
                </p>
                <Button className="mt-4" size="lg" asChild>
                  <Link href={`/services/${deadline.serviceSlug}?utm_source=deadline_page&utm_medium=landing&utm_content=${deadline.slug}_penalty_cta`}>
                    Book {deadline.serviceName} — ₹{deadline.ollvyFee.toLocaleString('en-IN')}
                  </Link>
                </Button>
              </div>
            </Card>
          </div>
        </section>

        {/* Ollvy Pro Section */}
        <section className="bg-background py-24">
          <div className="container">
            <p className="text-xs uppercase tracking-widest text-muted-foreground text-center mb-3">
              NEVER MISS A DEADLINE
            </p>
            <h2 className="text-3xl md:text-4xl font-semibold text-foreground text-center">
              Or let Ollvy Pro remind you before it's due.
            </h2>
            <p className="text-base text-muted-foreground text-center max-w-[480px] mx-auto mt-4">
              ₹833/month. Every deadline tracked. Reminders at 30d, 7d, 1d before. Plus 5% off every service.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 max-w-[900px] mx-auto">
              {[
                {
                  icon: Calendar,
                  title: 'Compliance calendar',
                  body: `Get reminded about ${deadline.serviceName} and every other deadline — 30 days, 7 days, 1 day before. Never miss a filing again.`,
                },
                {
                  icon: Activity,
                  title: 'Business health score',
                  body: 'A single number that tells you where you stand. Track filings completed, pending, and overdue across all compliances.',
                },
                {
                  icon: Zap,
                  title: 'Priority + 5% discount',
                  body: 'Pro orders go to the front of the queue. Plus 5% off every service — pays for itself after 2 bookings.',
                },
              ].map((feature, i) => {
                const Icon = feature.icon
                return (
                  <Card key={i} className="border border-border bg-card p-6">
                    <Icon size={20} className="text-yellow-400" strokeWidth={1.5} />
                    <h3 className="font-semibold mt-4 text-foreground">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{feature.body}</p>
                  </Card>
                )
              })}
            </div>

            <div className="text-center mt-10">
              <Button size="lg" asChild>
                <Link href={`/upgrade?utm_source=deadline_page&utm_medium=landing&utm_content=${deadline.slug}_pro`}>
                  Start Ollvy Pro — ₹9,990/year
                </Link>
              </Button>
              <p className="text-sm text-muted-foreground mt-2">
                That's ₹833/month. 14-day money-back guarantee.
              </p>
            </div>
          </div>
        </section>

        {/* What's Included Section */}
        <section className="bg-background py-24">
          <div className="container">
            <p className="text-xs uppercase tracking-widest text-muted-foreground text-center mb-3">
              WHAT YOU GET
            </p>
            <h2 className="text-3xl md:text-4xl font-semibold text-foreground text-center">
              Every filing includes
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 max-w-[900px] mx-auto">
              {[
                {
                  title: 'Verified CA assigned within 24 hours',
                  description:
                    'A background-checked professional matched to your filing type and location.',
                },
                {
                  title: 'Engagement letter at checkout',
                  description:
                    "Exact scope of work before you pay. No ambiguity about what's covered.",
                },
                {
                  title: 'Acknowledgement proof on completion',
                  description:
                    'Filing confirmation with acknowledgement number sent to your dashboard.',
                },
              ].map((item, i) => (
                <Card key={i} className="border border-border bg-card p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <Check size={14} className="text-ollvy-green" />
                    <h3 className="font-semibold text-sm text-foreground">{item.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        {deadline.testimonials && deadline.testimonials.length > 0 && (
          <section className="bg-card py-24">
            <div className="container">
              <p className="text-xs uppercase tracking-widest text-muted-foreground text-center mb-3">
                FROM BUSINESSES LIKE YOURS
              </p>
              <h2 className="text-3xl md:text-4xl font-semibold text-foreground text-center">
                Why they chose Ollvy for {deadline.serviceName.toLowerCase()}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12 max-w-[900px] mx-auto">
                {deadline.testimonials.map((t, i) => (
                  <Card key={i} className="border border-border bg-background p-6">
                    <div className="text-4xl leading-none text-muted-foreground/20 font-serif">
                      &ldquo;
                    </div>
                    <p className="text-sm text-foreground leading-relaxed mt-3">{t.quote}</p>
                    <div className="border-t border-border mt-6 pt-4">
                      <p className="text-sm font-semibold text-foreground">{t.name}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {t.role} · {t.business} · {t.city}
                      </p>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Final CTA */}
        <section className="bg-card py-24">
          <div className="container text-center">
            <h2 className="text-3xl md:text-4xl font-semibold text-foreground">
              File {deadline.serviceName} now
            </h2>
            <p className="text-base text-muted-foreground mt-4 max-w-[400px] mx-auto">
              Fixed price. Verified CA. Done within {deadline.slaDays} working days.
            </p>
            <Button size="lg" className="mt-8" asChild>
              <Link href={`/services/${deadline.serviceSlug}?utm_source=deadline_page&utm_medium=landing&utm_content=${deadline.slug}_final_cta`}>
                Start Filing — ₹{deadline.ollvyFee.toLocaleString('en-IN')}
              </Link>
            </Button>
            <p className={`text-sm mt-3 ${getUrgencyStyle(daysLeft, isPastDeadline)}`}>
              {isPastDeadline ? deadline.penaltyLine : `Due ${format(dueDate, 'MMMM d, yyyy')}`}
            </p>
          </div>
        </section>
      </main>

        <Footer />
      </div>
    </>
  )
}
