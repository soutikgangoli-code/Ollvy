'use client';
import { useMemo, useState } from 'react';
import Link from 'next/link';
import { CheckCircle, Lock, ChevronRight, Repeat } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { BundleServiceData } from '@/lib/data/services';
import { STARTUP_STACK, type StartupStackService } from './startup-stack-config';
import { ServiceToggle, type ServiceToggleState } from './ServiceToggle';
import { StartupCartSidebar } from './StartupCartSidebar';

interface StartupPageProps {
  /** Live DB pricing for every slug in STARTUP_STACK_SLUGS that exists in service_packages. */
  services: BundleServiceData[];
}

export function StartupPage({ services }: StartupPageProps) {
  const [selectedStage, setSelectedStage] = useState<number | null>(null);

  // Per-service toggle state. Default: every retainer is fixed at 'none' and hidden;
  // every other slug starts at 'none' until the user picks cart or done.
  const [toggleStates, setToggleStates] = useState<Record<string, ServiceToggleState>>(
    {}
  );

  const setToggle = (slug: string, next: ServiceToggleState) => {
    setToggleStates((prev) => ({ ...prev, [slug]: next }));
  };

  const cartSlugs = useMemo(
    () =>
      Object.entries(toggleStates)
        .filter(([, st]) => st === 'cart')
        .map(([slug]) => slug),
    [toggleStates]
  );

  const doneSlugs = useMemo(
    () =>
      new Set(
        Object.entries(toggleStates)
          .filter(([, st]) => st === 'done')
          .map(([slug]) => slug)
      ),
    [toggleStates]
  );

  // Quick lookup: slug → live DB row.
  const servicesBySlug = useMemo(() => {
    const m = new Map<string, BundleServiceData>();
    for (const s of services) m.set(s.slug, s);
    return m;
  }, [services]);

  return (
    <div className="min-h-screen bg-background">
      {/* ── HERO ── */}
      <section className="relative border-b border-border overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,hsl(142_71%_35%_/_0.07),transparent_60%)]" />
        <div className="relative max-w-[1100px] mx-auto px-6 py-20 text-center">
          <div className="inline-flex items-center gap-2 bg-[hsl(var(--ollvy-green))]/10 border border-[hsl(var(--ollvy-green))]/20 rounded-full px-4 py-1.5 mb-6">
            <span className="text-xs font-medium text-[hsl(var(--ollvy-green))]">
              FOR STARTUPS
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-foreground leading-tight max-w-[720px] mx-auto">
            Your compliance stack.
            <br />
            From Day 1 to Series A.
          </h1>

          <p className="text-base text-muted-foreground mt-5 max-w-[540px] mx-auto leading-relaxed">
            Incorporation, DPIIT recognition, GST, MSME, monthly filings, and annual returns.
            Every service in the sequence you need them. Fixed prices. CAs assigned same day.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
            <Button size="lg" asChild>
              <a href="#stack">Build my stack →</a>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/services/pvt-ltd-incorporation">Just incorporate first</Link>
            </Button>
          </div>

          {/* Trust signals */}
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 mt-8">
            {[
              'DPIIT recognition in 5 days post-incorporation',
              'MSME certificate in 2 days',
              'Angel tax exemption setup included',
            ].map((line) => (
              <div
                key={line}
                className="flex items-center gap-1.5 text-sm text-muted-foreground"
              >
                <CheckCircle size={12} className="text-[hsl(var(--ollvy-green))] shrink-0" />
                {line}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STAGE SELECTOR ── */}
      <section className="border-b border-border bg-card/30">
        <div className="max-w-[1100px] mx-auto px-6 py-8">
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-5 text-center">
            Where are you right now?
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { stage: 1, label: 'Pre-incorporation', sub: "Haven't registered yet" },
              { stage: 2, label: 'Just incorporated', sub: 'CIN in hand, < 3 months' },
              { stage: 3, label: '3-12 months', sub: 'Operating, team growing' },
              { stage: 4, label: 'Series A ready', sub: 'Preparing for diligence' },
            ].map((item) => (
              <button
                key={item.stage}
                onClick={() => {
                  setSelectedStage(item.stage);
                  document.getElementById('stack')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className={cn(
                  'text-left p-4 rounded-xl border transition-all',
                  selectedStage === item.stage
                    ? 'border-foreground bg-card'
                    : 'border-border hover:border-foreground/30 bg-background'
                )}
              >
                <p className="text-sm font-semibold text-foreground">{item.label}</p>
                <p className="text-xs text-muted-foreground mt-1">{item.sub}</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── STACK + STICKY CART ── */}
      <section id="stack" className="max-w-[1200px] mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-10">
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              The complete startup compliance stack
            </h2>
            <p className="text-sm text-muted-foreground mb-10">
              Toggle <span className="font-mono">Add</span> on the services you want, or{' '}
              <span className="font-mono">Done</span> if you've already handled them
              elsewhere. Prerequisites unlock once their parent is in cart or marked done.
            </p>

            <div className="space-y-12">
              {STARTUP_STACK.map((stage) => (
                <StartupStageBlock
                  key={stage.stage}
                  stage={stage}
                  servicesBySlug={servicesBySlug}
                  toggleStates={toggleStates}
                  doneSlugs={doneSlugs}
                  cartSlugs={cartSlugs}
                  onToggle={setToggle}
                  isHighlighted={selectedStage === stage.stage}
                />
              ))}
            </div>
          </div>

          {/* Sticky sidebar — hidden on mobile, shown on lg+. */}
          <div className="hidden lg:block">
            <StartupCartSidebar
              allServices={services}
              selectedSlugs={cartSlugs}
              onRemove={(slug) => setToggle(slug, 'none')}
            />
          </div>
        </div>
      </section>

      {/* Mobile sticky cart bar (compact, shown only when items in cart) */}
      <MobileCartBar
        allServices={services}
        selectedSlugs={cartSlugs}
      />


      {/* ── DPIIT DEEP DIVE ── */}
      <section className="border-t border-border bg-card/20">
        <div className="max-w-[1100px] mx-auto px-6 py-16">
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3">
            Most founders miss this
          </p>
          <h2 className="text-2xl font-bold text-foreground mb-2">
            DPIIT recognition - what it actually gives you
          </h2>
          <p className="text-sm text-muted-foreground mb-10 max-w-[560px]">
            Not "you may be eligible for tax benefits." Specific numbers, specific sections.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                title: '3-year income tax holiday',
                section: 'Section 80IAC',
                body: 'Any 3 consecutive years out of the first 10, profits are 100% exempt from corporate tax. A startup making ₹50L profit in year 3 pays ₹0 instead of ₹13L in corporate tax.',
                caveat: 'Separate IMB application required post-DPIIT recognition. Ollvy files this for you.',
              },
              {
                title: 'Angel tax exemption',
                section: 'Section 56(2)(viib)',
                body: "Without recognition, if an investor pays above \"fair market value,\" the excess is taxed in your company's hands at 30%+. With recognition, this tax doesn't exist. Critical before any funding round.",
                caveat: 'Active from date of DPIIT recognition. Apply before your first investment.',
              },
              {
                title: 'Patent fee reduction',
                section: 'CGPDTM Circular',
                body: 'Patent application fees reduced 80% - from ₹16,000 to ₹3,200 for standard applications. Trademark examination fee also reduced.',
                caveat: null,
              },
              {
                title: 'Government procurement',
                section: 'Startup India Action Plan',
                body: 'DPIIT-recognised startups can bid for government tenders without prior turnover or experience requirements that usually block new companies.',
                caveat: null,
              },
            ].map((card) => (
              <Card key={card.title} className="border border-border bg-card p-6">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <h3 className="font-semibold text-foreground">{card.title}</h3>
                  <span className="text-xs font-mono text-muted-foreground border border-border rounded px-2 py-0.5 shrink-0">
                    {card.section}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{card.body}</p>
                {card.caveat && (
                  <p className="text-xs text-[hsl(var(--ollvy-amber))] mt-3 border-t border-border pt-3">
                    ⚠ {card.caveat}
                  </p>
                )}
              </Card>
            ))}
          </div>

          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <Button asChild>
              <Link href="/startup">
                Apply for DPIIT Recognition →
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/guides/should-i-get-dpiit-startup-recognition">
                Full guide to DPIIT →
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ── DUE DILIGENCE READY ── */}
      <section className="border-t border-border">
        <div className="max-w-[1100px] mx-auto px-6 py-16">
          <h2 className="text-2xl font-bold text-foreground mb-3">
            Due diligence-ready before you need it.
          </h2>
          <p className="text-sm text-muted-foreground mb-8 max-w-[520px] leading-relaxed">
            When a VC asks for documents, you have 72 hours. The founders who survive
            diligence are the ones who kept records from day 1 - not those scrambling to
            file 3 years of MCA returns in a week.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {[
              { label: 'All MCA filings', detail: 'On time, every year. Acknowledgements stored permanently.' },
              { label: 'GST returns', detail: 'GSTR-1, GSTR-3B, GSTR-9 - all in one place.' },
              { label: 'Director KYC', detail: 'Never missed. DINs always active.' },
              { label: 'Business ITR', detail: 'Filed and acknowledged, available for download.' },
              { label: 'GST-compliant invoices', detail: 'Every service purchase. CGST/SGST split. 3-year retention.' },
              { label: 'Engagement letters', detail: 'Scope of work documented for every service.' },
            ].map((item) => (
              <div
                key={item.label}
                className="border border-border rounded-xl bg-card p-4 flex items-start gap-3"
              >
                <CheckCircle size={14} className="text-[hsl(var(--ollvy-green))] mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-foreground">{item.label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{item.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="border-t border-border bg-card/20">
        <div className="max-w-[1100px] mx-auto px-6 py-16">
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-8">
            From founders
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                name: 'Karan M.',
                city: 'Bangalore',
                type: 'SaaS founder',
                quote:
                  "Incorporated in January. DPIIT recognition by February, MSME and GST sorted by March. When we raised seed in April, the VC's CA said our compliance pack was the cleanest they'd seen from a pre-seed company.",
              },
              {
                name: 'Aditi S.',
                city: 'Delhi',
                type: 'D2C founder',
                quote:
                  "DPIIT recognition took 5 days. Nobody told me about the angel tax exemption until Ollvy's CS did - during the scope call, before I'd even booked. That alone was worth ten times the fee.",
              },
              {
                name: 'Rohan P.',
                city: 'Hyderabad',
                type: 'B2B SaaS founder',
                quote:
                  'Four founders across three cities. DSC for all four, SPICe+ filed, CIN in 14 days. My previous attempt at self-filing had stalled for 6 weeks.',
              },
            ].map((t) => (
              <Card key={t.name} className="border border-border bg-card p-6">
                <p className="text-sm text-foreground leading-relaxed">"{t.quote}"</p>
                <div className="mt-4 pt-4 border-t border-border">
                  <p className="text-sm font-semibold text-foreground">{t.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {t.city} · {t.type}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

// ── Mobile sticky cart bar (compact) ──────────────────────────────────────────
function MobileCartBar({
  allServices,
  selectedSlugs,
}: {
  allServices: BundleServiceData[];
  selectedSlugs: string[];
}) {
  const items = useMemo(
    () =>
      selectedSlugs
        .map((slug) => allServices.find((s) => s.slug === slug))
        .filter((s): s is BundleServiceData => Boolean(s)),
    [allServices, selectedSlugs]
  );

  if (items.length === 0) return null;

  // Simple total — full bundle math runs on the checkout page.
  const totalPaisa = items.reduce(
    (acc, s) => acc + s.ollvyFeePaisa + s.govtFeePaisa,
    0
  );
  const checkoutHref = `/checkout/bundle?slugs=${encodeURIComponent(selectedSlugs.join(','))}`;

  return (
    <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-card border-t border-border px-4 py-3 shadow-lg flex items-center justify-between gap-3">
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">
          {items.length} {items.length === 1 ? 'service' : 'services'} in bundle
        </p>
        <p className="font-mono text-sm font-bold text-foreground">
          ₹{(totalPaisa / 100).toLocaleString('en-IN')}
        </p>
      </div>
      <Button asChild size="sm" className="gap-1.5 shrink-0">
        <Link href={checkoutHref}>
          Checkout
          <ChevronRight size={12} />
        </Link>
      </Button>
    </div>
  );
}

// ── Stage block ───────────────────────────────────────────────────────────────
function StartupStageBlock({
  stage,
  servicesBySlug,
  toggleStates,
  doneSlugs,
  cartSlugs,
  onToggle,
  isHighlighted,
}: {
  stage: (typeof STARTUP_STACK)[number];
  servicesBySlug: Map<string, BundleServiceData>;
  toggleStates: Record<string, ServiceToggleState>;
  doneSlugs: Set<string>;
  cartSlugs: string[];
  onToggle: (slug: string, next: ServiceToggleState) => void;
  isHighlighted: boolean;
}) {
  return (
    <div
      className={cn(
        'rounded-2xl border p-6 transition-all',
        isHighlighted ? 'border-foreground/40 bg-card' : 'border-border'
      )}
    >
      <div className="flex items-center gap-3 mb-5">
        <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center">
          <span className="text-xs font-mono font-bold text-foreground">{stage.stage}</span>
        </div>
        <div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground">
            {stage.label}
          </p>
          <p className="text-sm font-semibold text-foreground">{stage.tagline}</p>
        </div>
      </div>

      <div className="space-y-3">
        {stage.services.map((svc) => {
          const dbRow = servicesBySlug.get(svc.slug);
          if (!dbRow) {
            // Slug not in DB (yet) — render a soft placeholder so the page never goes blank.
            return (
              <PlaceholderRow key={svc.slug} svc={svc} />
            );
          }
          return (
            <StackServiceRow
              key={svc.slug}
              svc={svc}
              dbRow={dbRow}
              state={toggleStates[svc.slug] ?? 'none'}
              prereqSatisfied={
                !svc.prerequisite ||
                doneSlugs.has(svc.prerequisite) ||
                cartSlugs.includes(svc.prerequisite)
              }
              onChange={(next) => onToggle(svc.slug, next)}
            />
          );
        })}
      </div>
    </div>
  );
}

// ── Service row ───────────────────────────────────────────────────────────────
function StackServiceRow({
  svc,
  dbRow,
  state,
  prereqSatisfied,
  onChange,
}: {
  svc: StartupStackService;
  dbRow: BundleServiceData;
  state: ServiceToggleState;
  prereqSatisfied: boolean;
  onChange: (next: ServiceToggleState) => void;
}) {
  const isCart = state === 'cart';
  const isDone = state === 'done';
  const totalPaisa = dbRow.ollvyFeePaisa + dbRow.govtFeePaisa;
  const totalRupees = totalPaisa / 100;
  const mrpRupees = dbRow.mrpPaisa > dbRow.ollvyFeePaisa ? (dbRow.mrpPaisa + dbRow.govtFeePaisa) / 100 : null;
  const isLocked = !prereqSatisfied && !isDone;

  // Retainer services aren't bundle-eligible; show a "book separately" link instead of toggle.
  if (dbRow.isRetainer) {
    return (
      <div className="rounded-xl border border-border bg-background p-4">
        <div className="flex items-start gap-4">
          <Repeat size={16} className="text-muted-foreground mt-1 shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-foreground">{dbRow.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{svc.note}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Subscription — book this separately on the service page.
                </p>
              </div>
              <div className="text-right shrink-0">
                <p className="font-mono text-sm font-bold text-foreground">
                  ₹{(dbRow.ollvyFeePaisa / 100).toLocaleString('en-IN')}
                  <span className="text-xs font-normal text-muted-foreground">/mo</span>
                </p>
              </div>
            </div>
            <Button size="sm" variant="outline" className="mt-3 gap-1.5 h-7 text-xs" asChild>
              <Link href={`/services/${dbRow.slug}`}>
                Book this separately <ChevronRight size={11} />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'rounded-xl border p-4 transition-all',
        isCart
          ? 'border-foreground/40 bg-foreground/[0.02]'
          : isDone
            ? 'border-[hsl(var(--ollvy-green))]/30 bg-[hsl(var(--ollvy-green))]/5'
            : 'border-border bg-background',
        isLocked && 'opacity-70'
      )}
    >
      <div className="flex items-start gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p
                className={cn(
                  'text-sm font-semibold',
                  isDone ? 'line-through text-muted-foreground' : 'text-foreground'
                )}
              >
                {dbRow.name}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">{svc.note}</p>
              {isLocked && svc.prereqNote && (
                <div className="flex items-center gap-1 mt-1">
                  <Lock size={9} className="text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">{svc.prereqNote}</span>
                </div>
              )}
            </div>
            <div className="text-right shrink-0">
              <div className="flex items-baseline gap-2 justify-end">
                <p className="font-mono text-sm font-bold text-foreground">
                  ₹{totalRupees.toLocaleString('en-IN')}
                </p>
                {mrpRupees && (
                  <p className="font-mono text-xs text-muted-foreground line-through">
                    ₹{mrpRupees.toLocaleString('en-IN')}
                  </p>
                )}
              </div>
              {dbRow.govtFeePaisa > 0 && (
                <p className="text-xs text-muted-foreground">
                  ₹{(dbRow.ollvyFeePaisa / 100).toLocaleString('en-IN')} +{' '}
                  ₹{(dbRow.govtFeePaisa / 100).toLocaleString('en-IN')} govt
                </p>
              )}
            </div>
          </div>

          <div className="mt-3 flex items-center gap-3">
            <ServiceToggle
              state={state}
              onChange={onChange}
              disabled={isLocked}
              disabledReason={svc.prereqNote ?? undefined}
            />
            <Link
              href={`/services/${dbRow.slug}`}
              className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-0.5"
            >
              See details <ChevronRight size={10} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// Placeholder when DB doesn't yet have the slug (e.g. startup-india / director-kyc
// haven't been seeded). Keep page intact rather than crash.
function PlaceholderRow({ svc }: { svc: StartupStackService }) {
  return (
    <div className="rounded-xl border border-dashed border-border/60 bg-muted/20 p-4 opacity-70">
      <p className="text-sm font-medium text-muted-foreground">
        {svc.slug.replace(/-/g, ' ')}
      </p>
      <p className="text-xs text-muted-foreground mt-0.5">{svc.note}</p>
      <p className="text-[10px] text-muted-foreground mt-1 italic">
        Coming soon — will sync with the services catalog.
      </p>
    </div>
  );
}
