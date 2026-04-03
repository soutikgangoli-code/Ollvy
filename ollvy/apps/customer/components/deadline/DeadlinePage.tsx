import Link from 'next/link'
import { format } from 'date-fns'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Clock, AlertTriangle, Check } from 'lucide-react'
import { DeadlineConfig } from '@/lib/deadlines'
import { Navbar } from '@/components/landing/Navbar'
import { Footer } from '@/components/landing/Footer'
import { DocumentChecklist } from '@/components/landing/DocumentChecklist'
import { DeadlineCountdown, GuaranteedBadge } from './DeadlineCountdown'

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

interface DeadlinePageProps {
  deadline: DeadlineConfig
}

export function DeadlinePage({ deadline }: DeadlinePageProps) {
  const dueDate = new Date(deadline.dueDate)

  return (
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
              <Link href={`/services/${deadline.serviceSlug}`}>Start Filing Now</Link>
            </Button>

            {/* Urgency line - client component for live countdown */}
            <DeadlineCountdown
              dueDate={deadline.dueDate}
              postDeadlineMessage={deadline.postDeadlineMessage}
              urgencyLine={deadline.urgencyLine}
              penaltyLine={deadline.penaltyLine}
              variant="hero"
            />
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
                <GuaranteedBadge slaDays={deadline.slaDays} />
              </div>

              <div className="mt-6 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Ollvy fee</span>
                  <span className="font-mono text-foreground">
                    Rs. {deadline.ollvyFee.toLocaleString('en-IN')}
                  </span>
                </div>
                {deadline.govtFee && deadline.govtFee > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Govt fee</span>
                    <span className="font-mono text-foreground">
                      Rs. {deadline.govtFee.toLocaleString('en-IN')}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-sm pt-2 border-t border-border">
                  <span className="font-medium text-foreground">Total</span>
                  <span className="font-mono font-bold text-foreground">
                    Rs. {((deadline.ollvyFee || 0) + (deadline.govtFee || 0)).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-4 text-xs text-muted-foreground">
                <Clock size={12} />
                <span>{deadline.slaDays} working days SLA</span>
              </div>

              <Button className="w-full mt-6" asChild>
                <Link href={`/services/${deadline.serviceSlug}`}>
                  Book This Service - Rs. {deadline.ollvyFee.toLocaleString('en-IN')}
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
                  Fixed price Rs. {deadline.ollvyFee.toLocaleString('en-IN')}. Verified CA assigned within 24 hours. Done in {deadline.slaDays} working days.
                </p>
                <Button className="mt-4" size="lg" asChild>
                  <Link href={`/services/${deadline.serviceSlug}`}>
                    Book {deadline.serviceName} - Rs. {deadline.ollvyFee.toLocaleString('en-IN')}
                  </Link>
                </Button>
              </div>
            </Card>
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
                        {t.role} - {t.business} - {t.city}
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
            <p className="text-base text-muted-foreground mt-4 whitespace-nowrap">
              Fixed price. Verified CA. Done within {deadline.slaDays} working days.
            </p>
            <Button size="lg" className="mt-8" asChild>
              <Link href={`/services/${deadline.serviceSlug}`}>
                Start Filing - Rs. {deadline.ollvyFee.toLocaleString('en-IN')}
              </Link>
            </Button>
            <DeadlineCountdown
              dueDate={deadline.dueDate}
              postDeadlineMessage={deadline.postDeadlineMessage}
              urgencyLine={deadline.urgencyLine}
              penaltyLine={deadline.penaltyLine}
              variant="footer"
            />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
