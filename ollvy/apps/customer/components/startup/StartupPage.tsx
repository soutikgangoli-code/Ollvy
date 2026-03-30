'use client';
import { useState } from 'react';
import Link from 'next/link';
import { CheckCircle, Lock, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { SERVICE_CONFIGS } from '@/lib/services';
import { getGuaranteedDate } from '@/lib/dates';

/**
 * Startup Compliance Stack - ordered by dependency
 * locked: can only be booked after prerequisites
 *
 * IMPORTANT: Slug naming conventions (database slugs):
 * - DPIIT/Startup India registration: 'startup-india' (NOT 'startup-india-dpiit')
 * - MSME/Udyam registration: 'msme-registration' (NOT 'msme-udyam')
 * - GST monthly filing: 'gst-monthly-50l' (NOT 'gst-monthly-filing')
 *
 * These slugs must match the 'slug' column in the service_packages database table.
 * See FALLBACK_SERVICE_SLUGS in lib/data/services.ts for the canonical list.
 */
const STARTUP_STACK = [
  {
    stage: 1,
    label: 'Start here',
    tagline: 'Days 0-15',
    services: [
      {
        slug: 'pvt-ltd-incorporation',
        note: 'Required before anything else can be registered.',
        prerequisite: null,
      },
      {
        slug: 'startup-india',
        note: 'Apply 5 days after CIN is issued.',
        prerequisite: 'pvt-ltd-incorporation',
        prereqNote: 'Requires CIN from incorporation',
      },
      {
        slug: 'msme-registration',
        note: 'Apply same week as DPIIT. Different registration, different benefits.',
        prerequisite: 'pvt-ltd-incorporation',
        prereqNote: 'Requires CIN',
      },
    ],
  },
  {
    stage: 2,
    label: 'First 60 days',
    tagline: 'Days 15-60',
    services: [
      {
        slug: 'gst-registration',
        note: 'Mandatory above ₹40L turnover. Get it now if you plan to invoice B2B clients.',
        prerequisite: null,
      },
      {
        slug: 'trademark-registration',
        note: 'Your brand protection. File before you go public.',
        prerequisite: null,
      },
      {
        slug: 'director-kyc',
        note: 'Annual - due Sep 30. Set it up now so it\'s not forgotten.',
        prerequisite: 'pvt-ltd-incorporation',
        prereqNote: 'Requires active DIN from incorporation',
      },
    ],
  },
  {
    stage: 3,
    label: 'Monthly compliance',
    tagline: 'Month 2 onwards',
    services: [
      {
        slug: 'gst-monthly-filing',
        note: 'GSTR-1 and GSTR-3B. Due 11th and 20th every month. One CA handles both.',
        prerequisite: 'gst-registration',
        prereqNote: 'Requires active GSTIN',
        isRetainer: true,
      },
      {
        slug: 'tds-monthly-compliance',
        note: 'Required once you start making vendor payments above ₹30,000 in a quarter.',
        prerequisite: null,
        isRetainer: true,
      },
    ],
  },
  {
    stage: 4,
    label: 'Annual',
    tagline: 'Year-end obligations',
    services: [
      {
        slug: 'mca-annual-filing',
        note: 'AOC-4 and MGT-7. Due Sep 30. Mandatory for all Pvt Ltd companies.',
        prerequisite: 'pvt-ltd-incorporation',
        prereqNote: 'Requires active CIN',
      },
      {
        slug: 'business-itr',
        note: 'ITR-6 for Pvt Ltd. Due Oct 31. Required even if the company made no profit.',
        prerequisite: 'pvt-ltd-incorporation',
        prereqNote: 'Requires active CIN',
      },
    ],
  },
];

type Stage = typeof STARTUP_STACK[0];
type StackService = Stage['services'][0];

export function StartupPage() {
  const [selectedStage, setSelectedStage] = useState<number | null>(null);
  const [completedServices, setCompletedServices] = useState<Set<string>>(new Set());

  const toggleComplete = (slug: string) => {
    setCompletedServices(prev => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug); else next.add(slug);
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-background">

      {/* ── HERO ── */}
      <section className="relative border-b border-border overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,hsl(142_71%_35%_/_0.07),transparent_60%)]" />
        <div className="relative max-w-[1100px] mx-auto px-6 py-20 text-center">

          <div className="inline-flex items-center gap-2 bg-[hsl(var(--ollvy-green))]/10 border border-[hsl(var(--ollvy-green))]/20 rounded-full px-4 py-1.5 mb-6">
            <span className="text-xs font-medium text-[hsl(var(--ollvy-green))]">FOR STARTUPS</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-foreground leading-tight max-w-[720px] mx-auto">
            Your compliance stack.<br />
            From Day 1 to Series A.
          </h1>

          <p className="text-base text-muted-foreground mt-5 max-w-[540px] mx-auto leading-relaxed">
            Incorporation, DPIIT recognition, GST, MSME, monthly filings, and annual returns.
            Every service in the sequence you need them. Fixed prices. CAs assigned same day.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
            <Button size="lg" asChild>
              <Link href="/services/pvt-ltd-incorporation">
                Incorporate now - ₹24,999
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="#stack">See the full stack →</a>
            </Button>
          </div>

          {/* Trust signals */}
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 mt-8">
            {[
              'DPIIT recognition in 5 days post-incorporation',
              'MSME certificate in 2 days',
              'Angel tax exemption setup included',
            ].map(line => (
              <div key={line} className="flex items-center gap-1.5 text-sm text-muted-foreground">
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
              { stage: 1, label: 'Pre-incorporation', sub: 'Haven\'t registered yet' },
              { stage: 2, label: 'Just incorporated', sub: 'CIN in hand, < 3 months' },
              { stage: 3, label: '3-12 months', sub: 'Operating, team growing' },
              { stage: 4, label: 'Series A ready', sub: 'Preparing for diligence' },
            ].map(item => (
              <button
                key={item.stage}
                onClick={() => {
                  setSelectedStage(item.stage);
                  document.getElementById('stack')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className={cn(
                  "text-left p-4 rounded-xl border transition-all",
                  selectedStage === item.stage
                    ? "border-foreground bg-card"
                    : "border-border hover:border-foreground/30 bg-background"
                )}
              >
                <p className="text-sm font-semibold text-foreground">{item.label}</p>
                <p className="text-xs text-muted-foreground mt-1">{item.sub}</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── STARTUP STACK ── */}
      <section id="stack" className="max-w-[1100px] mx-auto px-6 py-16">
        <h2 className="text-2xl font-bold text-foreground mb-2">The complete startup compliance stack</h2>
        <p className="text-sm text-muted-foreground mb-10">
          In the order you need them. Prerequisites shown. Mark what you've already done.
        </p>

        <div className="space-y-12">
          {STARTUP_STACK.map(stage => (
            <StartupStageBlock
              key={stage.stage}
              stage={stage}
              completedServices={completedServices}
              onToggleComplete={toggleComplete}
              isHighlighted={selectedStage === stage.stage}
            />
          ))}
        </div>
      </section>

      {/* ── DPIIT DEEP DIVE ── */}
      <section className="border-t border-border bg-card/20">
        <div className="max-w-[1100px] mx-auto px-6 py-16">
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Most founders miss this</p>
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
                body: 'Without recognition, if an investor pays above "fair market value," the excess is taxed in your company\'s hands at 30%+. With recognition, this tax doesn\'t exist. Critical before any funding round.',
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
            ].map(card => (
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
              <Link href="/services/startup-india">
                Apply for DPIIT Recognition - ₹4,999
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
            When a VC asks for documents, you have 72 hours. The founders who survive diligence
            are the ones who kept records from day 1 - not those scrambling to file 3 years of
            MCA returns in a week.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {[
              { label: 'All MCA filings', detail: 'On time, every year. Acknowledgements stored permanently.' },
              { label: 'GST returns', detail: 'GSTR-1, GSTR-3B, GSTR-9 - all in one place.' },
              { label: 'Director KYC', detail: 'Never missed. DINs always active.' },
              { label: 'Business ITR', detail: 'Filed and acknowledged, available for download.' },
              { label: 'GST-compliant invoices', detail: 'Every service purchase. CGST/SGST split. 3-year retention.' },
              { label: 'Engagement letters', detail: 'Scope of work documented for every service.' },
            ].map(item => (
              <div key={item.label}
                className="border border-border rounded-xl bg-card p-4 flex items-start gap-3">
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
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-8">From founders</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                name: 'Karan M.', city: 'Bangalore', type: 'SaaS founder',
                quote: 'Incorporated in January. DPIIT recognition by February, MSME and GST sorted by March. When we raised seed in April, the VC\'s CA said our compliance pack was the cleanest they\'d seen from a pre-seed company.',
              },
              {
                name: 'Aditi S.', city: 'Delhi', type: 'D2C founder',
                quote: 'DPIIT recognition took 5 days. Nobody told me about the angel tax exemption until Ollvy\'s CS did - during the scope call, before I\'d even booked. That alone was worth ten times the fee.',
              },
              {
                name: 'Rohan P.', city: 'Hyderabad', type: 'B2B SaaS founder',
                quote: 'Four founders across three cities. DSC for all four, SPICe+ filed, CIN in 14 days. My previous attempt at self-filing had stalled for 6 weeks.',
              },
            ].map(t => (
              <Card key={t.name} className="border border-border bg-card p-6">
                <p className="text-sm text-foreground leading-relaxed">"{t.quote}"</p>
                <div className="mt-4 pt-4 border-t border-border">
                  <p className="text-sm font-semibold text-foreground">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.city} · {t.type}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="border-t border-border">
        <div className="max-w-[1100px] mx-auto px-6 py-16 text-center">
          <h2 className="text-2xl font-bold text-foreground mb-3">
            Start with incorporation. Everything else follows.
          </h2>
          <p className="text-sm text-muted-foreground mb-8">
            Pvt Ltd registration with MCA, CA assigned within 4 hours, CIN in 15 working days.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button size="lg" asChild>
              <Link href="/services/pvt-ltd-incorporation">
                Incorporate now - ₹24,999
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/services/startup-india">
                Already incorporated? Get DPIIT →
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

// Sub-component: one stage in the stack
function StartupStageBlock({ stage, completedServices, onToggleComplete, isHighlighted }: {
  stage: typeof STARTUP_STACK[0];
  completedServices: Set<string>;
  onToggleComplete: (slug: string) => void;
  isHighlighted: boolean;
}) {
  return (
    <div className={cn(
      "rounded-2xl border p-6 transition-all",
      isHighlighted ? "border-foreground/40 bg-card" : "border-border"
    )}>
      <div className="flex items-center gap-3 mb-5">
        <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center">
          <span className="text-xs font-mono font-bold text-foreground">{stage.stage}</span>
        </div>
        <div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground">{stage.label}</p>
          <p className="text-sm font-semibold text-foreground">{stage.tagline}</p>
        </div>
      </div>

      <div className="space-y-3">
        {stage.services.map(svc => (
          <StartupServiceRow
            key={svc.slug}
            svc={svc}
            completed={completedServices.has(svc.slug)}
            prereqCompleted={!svc.prerequisite || completedServices.has(svc.prerequisite)}
            onToggle={() => onToggleComplete(svc.slug)}
          />
        ))}
      </div>
    </div>
  );
}

function StartupServiceRow({ svc, completed, prereqCompleted, onToggle }: {
  svc: typeof STARTUP_STACK[0]['services'][0];
  completed: boolean;
  prereqCompleted: boolean;
  onToggle: () => void;
}) {
  const service = SERVICE_CONFIGS.find(s => s.slug === svc.slug);
  if (!service) return null;

  const totalFee = service.ollvyFee + (service.govtFee ?? 0);
  const isLocked = !prereqCompleted;

  return (
    <div className={cn(
      "rounded-xl border p-4 transition-all",
      completed ? "border-[hsl(var(--ollvy-green))]/30 bg-[hsl(var(--ollvy-green))]/5" : "border-border bg-background",
      isLocked ? "opacity-60" : ""
    )}>
      <div className="flex items-start gap-4">
        {/* Checkbox */}
        <button
          onClick={onToggle}
          disabled={isLocked}
          className={cn(
            "mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-colors",
            completed
              ? "border-[hsl(var(--ollvy-green))] bg-[hsl(var(--ollvy-green))]"
              : "border-border hover:border-foreground/40"
          )}
        >
          {completed && <CheckCircle size={12} className="text-white" />}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className={cn(
                "text-sm font-semibold",
                completed ? "line-through text-muted-foreground" : "text-foreground"
              )}>
                {service.name}
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
              <p className="font-mono text-sm font-bold text-foreground">
                ₹{totalFee.toLocaleString('en-IN')}
                {service.isRetainer ? <span className="text-xs font-normal">/mo</span> : null}
              </p>
              {service.govtFee ? (
                <p className="text-xs text-muted-foreground">
                  ₹{service.ollvyFee.toLocaleString('en-IN')} + ₹{service.govtFee.toLocaleString('en-IN')} govt
                </p>
              ) : null}
            </div>
          </div>

          {!completed && !isLocked && (
            <Button size="sm" variant="outline" className="mt-3 gap-1.5 h-7 text-xs" asChild>
              <Link href={`/services/${svc.slug}`}>
                Book this service <ChevronRight size={11} />
              </Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
