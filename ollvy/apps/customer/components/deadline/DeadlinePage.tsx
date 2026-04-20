import Link from 'next/link'
import { format } from 'date-fns'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Clock, AlertTriangle, Check, ArrowLeft, ChevronRight } from 'lucide-react'
import { DeadlineConfig } from '@/lib/deadlines'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { NavbarServer } from '@/components/landing/NavbarServer'
import { Footer } from '@/components/landing/Footer'
import { DocumentChecklist } from '@/components/landing/DocumentChecklist'
import { ToolLastReviewed } from '@/components/tools/DocumentPageToolExtensions'
import { DeadlineCountdown, GuaranteedBadge } from './DeadlineCountdown'

interface DeadlinePageProps {
  deadline: DeadlineConfig
}

export function DeadlinePage({ deadline }: DeadlinePageProps) {
  const dueDate = new Date(deadline.dueDate)

  return (
    <div className="min-h-screen bg-background">
      <NavbarServer />

      <main className="pt-16">
        <div className="py-16 md:py-24">
          <div className="container max-w-5xl">

            {/* Header — centered, matches ToolPageWrapper */}
            <header className="mb-12 text-center">
              {/* Mobile: back arrow */}
              <div className="md:hidden flex items-center justify-center mb-4">
                <Link href="/" className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span className="text-foreground">Home</span>
                </Link>
              </div>

              <p className="font-mono text-sm uppercase tracking-[0.3em] text-muted-foreground mb-4">
                Deadline
              </p>

              <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground mb-4 tracking-tight">
                {deadline.serviceName}
              </h1>

              <p className="text-lg text-muted-foreground">
                {deadline.heroTagline}
              </p>

              <p className="text-sm text-muted-foreground mt-3">
                Due {format(dueDate, 'MMMM d, yyyy')}
              </p>

              {/* Metadata pills */}
              <div className="flex justify-center gap-3 mt-6">
                <div className="px-3 py-1.5 rounded-full bg-muted/50 border border-border/50 font-mono">
                  <span className="text-[10px] text-muted-foreground">For </span>
                  <span className="text-[10px] font-medium text-foreground">{deadline.eligibilityLabel}</span>
                </div>
                <div className="px-3 py-1.5 rounded-full bg-muted/50 border border-border/50 font-mono">
                  <span className="text-[10px] text-muted-foreground">Type </span>
                  <span className="text-[10px] font-medium text-foreground">{deadline.purposeLabel}</span>
                </div>
              </div>

              {/* CTA */}
              <Button size="lg" className="mt-8" asChild>
                <Link href={`/services/${deadline.serviceSlug}`}>Start Filing Now</Link>
              </Button>

              {/* Countdown */}
              <DeadlineCountdown
                dueDate={deadline.dueDate}
                postDeadlineMessage={deadline.postDeadlineMessage}
                urgencyLine={deadline.urgencyLine}
                penaltyLine={deadline.penaltyLine}
                variant="hero"
              />
            </header>

            {/* Content — max-w-3xl centered */}
            <div className="max-w-3xl mx-auto space-y-12 sm:space-y-16">

              {/* Service pricing card */}
              <section>
                <Card className="border border-border bg-card p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-base text-foreground">{deadline.serviceName}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{deadline.eventLabel}</p>
                    </div>
                    <GuaranteedBadge slaDays={deadline.slaDays} />
                  </div>

                  <div className="mt-5 space-y-2">
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

                  <Button className="w-full mt-5" asChild>
                    <Link href={`/services/${deadline.serviceSlug}`}>
                      Book This Service - Rs. {deadline.ollvyFee.toLocaleString('en-IN')}
                    </Link>
                  </Button>
                </Card>
              </section>

              {/* Documents */}
              <section>
                <DocumentChecklist
                  defaultTab={deadline.documentTab}
                  showSectionHeader={false}
                  customHeading={deadline.documentHeading}
                />
              </section>

              {/* Why this deadline matters */}
              <section>
                <h2 className="text-xl font-semibold text-foreground mb-6">Why this deadline matters</h2>
                <div className="divide-y divide-border">
                  {deadline.risks.map((risk, i) => (
                    <div key={i} className="flex items-start gap-3 py-4">
                      <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center shrink-0">
                        <AlertTriangle size={14} className="text-red-500" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm text-foreground">{risk.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                          {risk.body}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* What you get */}
              <section>
                <h2 className="text-xl font-semibold text-foreground mb-6">Every filing includes</h2>
                <div className="space-y-3">
                  {[
                    { title: 'Verified CA assigned within 24 hours', description: 'A background-checked professional matched to your filing type and location.' },
                    { title: 'Engagement letter at checkout', description: "Exact scope of work before you pay. No ambiguity about what's covered." },
                    { title: 'Acknowledgement proof on completion', description: 'Filing confirmation with acknowledgement number sent to your dashboard.' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3 p-4 rounded-xl border border-border bg-card">
                      <Check size={14} className="text-[hsl(var(--ollvy-green))] shrink-0 mt-0.5" />
                      <div>
                        <h3 className="font-semibold text-sm text-foreground">{item.title}</h3>
                        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Testimonials */}
              {deadline.testimonials && deadline.testimonials.length > 0 && (
                <section>
                  <h2 className="text-xl font-semibold text-foreground mb-6">
                    Why they chose Ollvy for {deadline.serviceName.toLowerCase()}
                  </h2>
                  <div className="space-y-3">
                    {deadline.testimonials.map((t, i) => (
                      <Card key={i} className="border border-border bg-card p-5">
                        <p className="text-sm text-foreground leading-relaxed">"{t.quote}"</p>
                        <div className="border-t border-border mt-4 pt-3">
                          <p className="text-sm font-semibold text-foreground">{t.name}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {t.role} - {t.business} - {t.city}
                          </p>
                        </div>
                      </Card>
                    ))}
                  </div>
                </section>
              )}

              {/* FAQs */}
              {deadline.faqs && deadline.faqs.length > 0 && (
                <section>
                  <h2 className="text-xl font-semibold text-foreground mb-6">Frequently asked questions</h2>
                  <Accordion type="single" collapsible className="space-y-0">
                    {deadline.faqs.map((faq, i) => (
                      <AccordionItem
                        key={i}
                        value={`faq-${i}`}
                        className="border-b border-border last:border-0"
                      >
                        <AccordionTrigger className="text-sm font-medium text-foreground text-left py-4 hover:no-underline">
                          {faq.q}
                        </AccordionTrigger>
                        <AccordionContent forceMount className="text-sm text-muted-foreground leading-relaxed pb-4">
                          {faq.a}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </section>
              )}

              {/* Final CTA */}
              <section className="text-center pt-8 border-t border-border">
                <p className="font-medium text-foreground mb-2">File {deadline.serviceName} now</p>
                <p className="text-sm text-muted-foreground mb-4">
                  Fixed price. Verified CA. Done within {deadline.slaDays} working days.
                </p>
                <Button size="lg" asChild>
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
              </section>

              {/* How we reviewed this page */}
              <ToolLastReviewed
                lastReviewed={deadline.lastReviewed}
                sources={deadline.sources}
              />

            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
