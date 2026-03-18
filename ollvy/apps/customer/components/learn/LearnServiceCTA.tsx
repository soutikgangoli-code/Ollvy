import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';
import { ServiceConfig } from '@/lib/services';
import { getGuaranteedDate } from '@/lib/dates';

export function LearnServiceCTA({ primary, secondary }: {
  primary: ServiceConfig;
  secondary?: ServiceConfig;
}) {
  const totalFee = primary.ollvyFee + (primary.govtFee ?? 0);
  const guaranteedDate = getGuaranteedDate(primary.slaDays);

  return (
    <div className="mt-16 pt-10 border-t border-border">
      <p className="text-xs uppercase tracking-widest text-muted-foreground mb-5">
        Book this service on Ollvy
      </p>

      <Card className="border border-border bg-card p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="font-semibold text-foreground">{primary.name}</h3>
            <div className="flex items-center gap-3 mt-2">
              <span className="font-mono font-bold text-foreground text-lg">
                ₹{totalFee.toLocaleString('en-IN')}
              </span>
              {primary.govtFee ? (
                <span className="text-xs text-muted-foreground">
                  (₹{primary.ollvyFee.toLocaleString('en-IN')} Ollvy +
                  ₹{primary.govtFee.toLocaleString('en-IN')} govt)
                </span>
              ) : null}
            </div>
            <div className="flex items-center gap-1.5 mt-2">
              <CheckCircle size={12} className="text-[hsl(var(--ollvy-green))]" />
              <span className="text-xs text-muted-foreground">
                Guaranteed by {guaranteedDate}
              </span>
            </div>
          </div>
          <Button size="lg" asChild>
            <Link
              href={`/services/${primary.slug}?utm_source=learn&utm_medium=cta&utm_content=${primary.slug}`}
            >
              Book Now →
            </Link>
          </Button>
        </div>
      </Card>

      {secondary && (
        <div className="mt-3">
          <Card className="border border-border bg-muted/30 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">{secondary.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  ₹{(secondary.ollvyFee + (secondary.govtFee ?? 0)).toLocaleString('en-IN')}
                  {' · '}{secondary.slaDays} working days
                </p>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href={`/services/${secondary.slug}?utm_source=learn&utm_medium=cta_secondary&utm_content=${secondary.slug}`}>
                  View →
                </Link>
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Self-serve nudge - builds trust, people who want to DIY bookmark us */}
      <p className="text-xs text-muted-foreground mt-4 text-center">
        Want to do it yourself?{' '}
        {primary.slug === 'gst-registration' && (
          <a href="https://reg.gst.gov.in/registration/" target="_blank" rel="noopener noreferrer"
            className="underline hover:text-foreground">
            Apply directly on GSTN portal →
          </a>
        )}
        {primary.slug === 'pvt-ltd-incorporation' && (
          <a href="https://www.mca.gov.in/content/mca/global/en/mca/spice-plus.html"
            target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground">
            File SPICe+ directly on MCA21 →
          </a>
        )}
        {primary.slug === 'startup-india-dpiit' && (
          <a href="https://www.startupindia.gov.in/content/sih/en/startupgov/startup-recognition-page.html"
            target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground">
            Apply directly on Startup India portal →
          </a>
        )}
      </p>
    </div>
  );
}
