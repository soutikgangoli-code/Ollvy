import Link from 'next/link';
import { CheckCircle } from 'lucide-react';
import { ServiceConfig } from '@/lib/services';
import { CityConfig } from '@/lib/geo/cities';
import { GeoContent } from '@/lib/geo/geo-content';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { getGuaranteedDate } from '@/lib/dates';

interface DbPricing {
  ollvyFee: number;
  govtFee: number;
  slaDays: number;
  serviceId?: string;
}

interface GeoPageProps {
  service: ServiceConfig;
  city: CityConfig;
  geoContent?: GeoContent;
  dbPricing?: DbPricing;
}

/**
 * GeoPage Component
 * Per §23 Connection Point 8: Uses DB pricing with state-specific override
 */
export function GeoPage({ service, city, geoContent, dbPricing }: GeoPageProps) {
  // Use DB pricing if available, otherwise fall back to static config
  const ollvyFee = dbPricing?.ollvyFee ?? service.ollvyFee;
  const govtFee = dbPricing?.govtFee ?? service.govtFee ?? 0;
  const slaDays = dbPricing?.slaDays ?? service.slaDays;
  const totalFee = ollvyFee + govtFee;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="border-b border-border bg-background py-10">
        <div className="max-w-[1200px] mx-auto px-6">
          <p className="text-xs text-muted-foreground mb-3">
            <Link href="/" className="hover:text-foreground transition-colors">Ollvy</Link>
            <span className="mx-1.5">→</span>
            <Link href={`/services/${service.slug}`} className="hover:text-foreground transition-colors">{service.name}</Link>
            <span className="mx-1.5">→</span>
            <span>{city.name}</span>
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
            {service.name} in {city.displayName}
          </h1>
          <p className="text-sm text-muted-foreground mt-3 max-w-[520px] leading-relaxed">
            CA from {city.name}, verified. {slaDays} working days.
            Fixed price ₹{totalFee.toLocaleString('en-IN')}.
          </p>
          <div className="flex items-center gap-2 mt-4">
            <CheckCircle size={13} className="text-[hsl(var(--ollvy-green))]" />
            <span className="text-sm text-[hsl(var(--ollvy-green))]">
              Guaranteed by {getGuaranteedDate(slaDays)}
            </span>
          </div>
        </div>
      </section>

      {/* Two-column layout */}
      <div className="max-w-[1200px] mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-10">

          {/* Left content */}
          <div className="space-y-12">

            {/* Service card */}
            <Card className="border border-border bg-card p-6">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <h2 className="text-lg font-semibold text-foreground">{service.name}</h2>
                  <p className="text-sm text-muted-foreground mt-1">{service.tagline}</p>
                </div>
                <div className="text-right">
                  <p className="font-mono text-xl font-bold text-foreground">
                    ₹{totalFee.toLocaleString('en-IN')}
                  </p>
                  {govtFee ? (
                    <p className="text-xs text-muted-foreground">
                      ₹{ollvyFee.toLocaleString('en-IN')} + ₹{govtFee.toLocaleString('en-IN')} govt
                    </p>
                  ) : null}
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <CheckCircle size={12} className="text-[hsl(var(--ollvy-green))]" />
                  {slaDays} working days
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <CheckCircle size={12} className="text-[hsl(var(--ollvy-green))]" />
                  CA from {city.name}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <CheckCircle size={12} className="text-[hsl(var(--ollvy-green))]" />
                  All-inclusive pricing
                </div>
              </div>

              <Button className="w-full mt-6" asChild>
                <Link href={`/services/${service.slug}?utm_source=geo_page&utm_medium=service_card&utm_content=${city.slug}`}>
                  Book Now - ₹{totalFee.toLocaleString('en-IN')}
                </Link>
              </Button>
            </Card>

            {/* City-specific jurisdiction */}
            {geoContent?.jurisdictionNote && (
              <div>
                <h2 className="text-lg font-semibold text-foreground mb-3">
                  {service.shortName} in {city.name} - local details
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {geoContent.jurisdictionNote}
                </p>
                {city.ptApplicable && (
                  <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
                    <strong className="text-foreground">Professional Tax note</strong>:{' '}
                    {city.state} levies Professional Tax on salaried employees and business owners.
                    Once you register your business, PT registration is required.
                    Ollvy handles PT registration as a separate service (₹1,999).
                  </p>
                )}
              </div>
            )}

            {/* What's included */}
            {service.whatsIncluded && service.whatsIncluded.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-foreground mb-3">
                  What's included
                </h2>
                <div className="space-y-2">
                  {service.whatsIncluded.map((item, i) => (
                    <div key={i} className="flex items-start gap-3 text-sm">
                      <CheckCircle size={14} className="text-[hsl(var(--ollvy-green))] mt-0.5 shrink-0" />
                      <span className="text-muted-foreground">{item.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* City-specific notes */}
            {geoContent?.citySpecificNotes && geoContent.citySpecificNotes.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-foreground mb-3">
                  {city.name}-specific notes
                </h2>
                <div className="space-y-3">
                  {geoContent.citySpecificNotes.map((note, i) => (
                    <div key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                      <div className="w-1 h-1 rounded-full bg-muted-foreground mt-2 shrink-0" />
                      {note}
                    </div>
                  ))}
                </div>
                {city.coworkingNote && (
                  <p className="text-xs text-muted-foreground mt-4 italic border-l-2 border-border pl-3">
                    {city.coworkingNote}
                  </p>
                )}
              </div>
            )}

            {/* FAQs - Standard + city-specific */}
            {(service.faqs.length > 0 || geoContent?.additionalFaqs?.length) && (
              <div>
                <h2 className="text-lg font-semibold text-foreground mb-4">
                  Frequently asked questions
                </h2>
                <div className="space-y-3">
                  {/* City-specific FAQs first */}
                  {geoContent?.additionalFaqs?.map((faq, i) => (
                    <div key={`city-${i}`} className="border border-border rounded-lg p-4">
                      <p className="text-sm font-semibold text-foreground mb-2">{faq.q}</p>
                      <p className="text-sm text-muted-foreground">{faq.a}</p>
                    </div>
                  ))}
                  {/* Standard FAQs */}
                  {service.faqs.slice(0, 3).map((faq, i) => (
                    <div key={`std-${i}`} className="border border-border rounded-lg p-4">
                      <p className="text-sm font-semibold text-foreground mb-2">{faq.q}</p>
                      <p className="text-sm text-muted-foreground">{faq.a}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Link to base service page */}
            <p className="text-xs text-muted-foreground">
              For full service details, process steps, and complete FAQ:{' '}
              <Link href={`/services/${service.slug}`} className="underline hover:text-foreground">
                {service.name} - main service page →
              </Link>
            </p>
          </div>

          {/* Right: sticky booking panel */}
          <div className="hidden lg:block">
            <div className="sticky top-6">
              <Card className="border border-border bg-card p-6">
                <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3">
                  Book this service
                </p>
                <p className="font-mono text-2xl font-bold text-foreground">
                  ₹{totalFee.toLocaleString('en-IN')}
                </p>
                {govtFee ? (
                  <p className="text-xs text-muted-foreground mt-1">
                    ₹{ollvyFee.toLocaleString('en-IN')} Ollvy fee + ₹{govtFee.toLocaleString('en-IN')} govt fee
                  </p>
                ) : null}

                <div className="mt-4 pt-4 border-t border-border space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle size={14} className="text-[hsl(var(--ollvy-green))]" />
                    Guaranteed by {getGuaranteedDate(slaDays)}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle size={14} className="text-[hsl(var(--ollvy-green))]" />
                    CA assigned within 4 hours
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle size={14} className="text-[hsl(var(--ollvy-green))]" />
                    All government fees included
                  </div>
                </div>

                <Button className="w-full mt-6" size="lg" asChild>
                  <Link href={`/services/${service.slug}?utm_source=geo_page&utm_medium=sticky_panel&utm_content=${city.slug}`}>
                    Book Now →
                  </Link>
                </Button>

                <p className="text-xs text-muted-foreground mt-4 text-center">
                  Pay only after service is complete
                </p>
              </Card>

              {/* Trust signals */}
              <div className="mt-4 p-4 rounded-lg bg-muted/20 border border-border">
                <p className="text-xs text-muted-foreground">
                  <strong className="text-foreground">4,200+ startups</strong> have used Ollvy
                  for {service.shortName?.toLowerCase() || service.name.toLowerCase()} in {city.name}.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sticky CTA */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-background border-t border-border">
        <Button className="w-full" size="lg" asChild>
          <Link href={`/services/${service.slug}?utm_source=geo_page&utm_medium=mobile_sticky&utm_content=${city.slug}`}>
            Book Now - ₹{totalFee.toLocaleString('en-IN')}
          </Link>
        </Button>
      </div>
    </div>
  );
}
