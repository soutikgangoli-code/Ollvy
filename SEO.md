
---

## §19 — SEO CONTENT ARCHITECTURE (`/learn` pages)

**Route**: `app/learn/[slug]/page.tsx`
**Shared layout**: `components/learn/LearnPage.tsx`

These are not blog posts. Every page is a tool-first, answer-first resource that earns organic search traffic and converts it to bookings. Structure is always: tool at top → direct answer → process detail → service CTA. No filler. No "in this article we will explain."

---

### FILE STRUCTURE

```
app/
  learn/
    [slug]/
      page.tsx                  ← metadata + LearnPage render
    page.tsx                    ← /learn index (list of all guides)
    sitemap.ts                  ← learn pages sitemap fragment

components/
  learn/
    LearnPage.tsx               ← shared layout: hero + tool + sections + CTA
    LearnHero.tsx               ← H1 + subhead + breadcrumb + last-updated
    LearnSectionBlock.tsx       ← reusable section: heading + body + optional table/list
    LearnServiceCTA.tsx         ← service card + CTA at bottom of every learn page
    LearnInternalLinks.tsx      ← "Related guides" at bottom
    tools/
      EligibilityTool.tsx       ← multi-question decision tree → specific output
      PenaltyTool.tsx           ← inputs → specific rupee amounts (reuse §8 calculator)
      ComparisonTool.tsx        ← A vs B decision tool
      DeadlineTracker.tsx       ← current due date + days remaining + penalty

lib/
  learn/
    pages.ts                    ← LearnPageConfig[] — one entry per /learn page
    pages/
      how-to-register-gst.ts
      startup-india-dpiit.ts
      gst-filing-penalty.ts
      do-i-need-fssai.ts
      pvt-ltd-vs-llp.ts
      gst-due-dates.ts
      director-kyc-penalty.ts
      fssai-license-requirements.ts
      how-to-close-pvt-ltd.ts
      msme-registration-benefits.ts
```

---

### `LearnPageConfig` INTERFACE

```typescript
// lib/learn/pages.ts

export interface LearnPageConfig {
  slug: string;
  title: string;                       // H1 — plain language, specific
  seoTitle: string;                    // <title> tag — includes year + location signal
  seoDescription: string;             // meta description — answer-first
  canonicalUrl: string;
  lastReviewed: string;               // "March 2025" — shown on page, updated manually
  category: LearnCategory;
  relatedServiceSlugs: string[];      // which service pages to link to
  relatedLearnSlugs: string[];        // which other /learn pages to link to

  // Tool config — one tool per page, shown at top
  tool?: LearnToolConfig;

  // Page sections
  sections: LearnSection[];

  // Service CTA at bottom
  ctaServiceSlug: string;             // primary service to promote
  ctaSecondarySlug?: string;          // secondary CTA if relevant
}

export type LearnCategory =
  | 'GST'
  | 'Incorporation'
  | 'Startup'
  | 'Licensing'
  | 'Tax'
  | 'Compliance'
  | 'Payroll';

export interface LearnToolConfig {
  type: 'eligibility' | 'penalty' | 'comparison' | 'deadline';
  title: string;                      // shown above tool
  questions?: EligibilityQuestion[];  // for eligibility tool
  penaltyType?: string;              // for penalty tool — maps to PENALTY_TABLE
  compareA?: string;                 // for comparison tool
  compareB?: string;
  deadlineType?: string;             // for deadline tracker
}

export interface LearnSection {
  heading: string;
  body: string;                      // markdown — rendered as prose
  table?: TableRow[];                // optional data table
  list?: string[];                   // optional bullet list (plain text)
  note?: string;                     // italicised note at bottom of section
  componentSlot?: 'document-checklist' | 'process-stepper' | 'faq-list';
  componentProps?: Record<string, unknown>;
}
```

---

### `app/learn/[slug]/page.tsx`

```typescript
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { LEARN_PAGES } from '@/lib/learn/pages';
import { LearnPage } from '@/components/learn/LearnPage';
import { SERVICE_CONFIGS } from '@/lib/services';

interface Props { params: { slug: string } }

export function generateStaticParams() {
  return LEARN_PAGES.map(p => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const page = LEARN_PAGES.find(p => p.slug === params.slug);
  if (!page) return {};
  return {
    title: page.seoTitle,
    description: page.seoDescription,
    alternates: { canonical: page.canonicalUrl },
    openGraph: {
      title: page.seoTitle,
      description: page.seoDescription,
      url: page.canonicalUrl,
      type: 'article',
    },
  };
}

export default function LearnPageRoute({ params }: Props) {
  const page = LEARN_PAGES.find(p => p.slug === params.slug);
  if (!page) notFound();

  const ctaService = SERVICE_CONFIGS.find(s => s.slug === page.ctaServiceSlug);
  if (!ctaService) notFound();

  const secondaryService = page.ctaSecondarySlug
    ? SERVICE_CONFIGS.find(s => s.slug === page.ctaSecondarySlug)
    : undefined;

  // JSON-LD: Article + FAQPage schema
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: page.title,
    dateModified: new Date().toISOString(),
    author: {
      '@type': 'Organization',
      name: 'Ollvy',
      url: 'https://ollvy.com',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Ollvy Technologies Private Limited',
      url: 'https://ollvy.com',
    },
    // FAQ schema — Google shows these as rich results
    mainEntity: page.sections
      .filter(s => s.componentSlot === 'faq-list')
      .flatMap(s => (s.componentProps?.faqs as Array<{q:string,a:string}> ?? []))
      .slice(0, 8)
      .map(faq => ({
        '@type': 'Question',
        name: faq.q,
        acceptedAnswer: { '@type': 'Answer', text: faq.a },
      })),
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Ollvy', item: 'https://ollvy.com' },
        { '@type': 'ListItem', position: 2, name: 'Guides', item: 'https://ollvy.com/learn' },
        { '@type': 'ListItem', position: 3, name: page.title, item: page.canonicalUrl },
      ],
    },
  };

  return (
    <>
      <script type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <LearnPage page={page} ctaService={ctaService} secondaryService={secondaryService} />
    </>
  );
}
```

---

### `components/learn/LearnPage.tsx`

```typescript
'use client';
import { LearnPageConfig } from '@/lib/learn/pages';
import { ServiceConfig } from '@/lib/services';
import { LearnHero } from './LearnHero';
import { LearnSectionBlock } from './LearnSectionBlock';
import { LearnServiceCTA } from './LearnServiceCTA';
import { LearnInternalLinks } from './LearnInternalLinks';
import { EligibilityTool } from './tools/EligibilityTool';
import { PenaltyTool } from './tools/PenaltyTool';
import { ComparisonTool } from './tools/ComparisonTool';
import { DeadlineTracker } from './tools/DeadlineTracker';
import { DocumentChecklist } from '@/components/service/tabs/DocumentsTab';
import { ProcessStepper } from '@/components/service/ProcessStepper';

export function LearnPage({ page, ctaService, secondaryService }: {
  page: LearnPageConfig;
  ctaService: ServiceConfig;
  secondaryService?: ServiceConfig;
}) {
  return (
    <div className="min-h-screen bg-background">
      <LearnHero page={page} />

      <div className="max-w-[760px] mx-auto px-6 py-12">

        {/* Tool — always at top, before first section */}
        {page.tool && (
          <div className="mb-12">
            {page.tool.type === 'eligibility' && (
              <EligibilityTool config={page.tool} ctaService={ctaService} />
            )}
            {page.tool.type === 'penalty' && (
              <PenaltyTool config={page.tool} ctaService={ctaService} />
            )}
            {page.tool.type === 'comparison' && (
              <ComparisonTool config={page.tool} />
            )}
            {page.tool.type === 'deadline' && (
              <DeadlineTracker config={page.tool} ctaService={ctaService} />
            )}
          </div>
        )}

        {/* Sections */}
        {page.sections.map((section, i) => (
          <div key={i} className="mb-12">
            <LearnSectionBlock section={section} />

            {/* Component slots — reuse service page components */}
            {section.componentSlot === 'document-checklist' && (
              <div className="mt-6">
                <DocumentChecklist
                  serviceSlug={section.componentProps?.serviceSlug as string}
                />
              </div>
            )}
            {section.componentSlot === 'process-stepper' && (
              <div className="mt-6">
                <ProcessStepper
                  steps={section.componentProps?.steps as any[]}
                />
              </div>
            )}
          </div>
        ))}

        {/* Service CTA */}
        <LearnServiceCTA
          primary={ctaService}
          secondary={secondaryService}
        />

        {/* Related guides */}
        <LearnInternalLinks
          learnSlugs={page.relatedLearnSlugs}
          serviceSlugs={page.relatedServiceSlugs}
        />
      </div>
    </div>
  );
}
```

---

### `components/learn/LearnHero.tsx`

```typescript
import Link from 'next/link';
import { LearnPageConfig } from '@/lib/learn/pages';

const CATEGORY_LABELS: Record<string, string> = {
  GST: 'GST',
  Incorporation: 'Company Registration',
  Startup: 'Startups',
  Licensing: 'Licensing',
  Tax: 'Tax',
  Compliance: 'Compliance',
  Payroll: 'Payroll',
};

export function LearnHero({ page }: { page: LearnPageConfig }) {
  return (
    <section className="border-b border-border bg-background">
      <div className="max-w-[760px] mx-auto px-6 pt-10 pb-8">

        {/* Breadcrumb */}
        <p className="text-xs text-muted-foreground mb-4">
          <Link href="/" className="hover:text-foreground transition-colors">Ollvy</Link>
          <span className="mx-1.5">→</span>
          <Link href="/learn" className="hover:text-foreground transition-colors">Guides</Link>
          <span className="mx-1.5">→</span>
          <span className="text-muted-foreground">{CATEGORY_LABELS[page.category]}</span>
        </p>

        {/* H1 */}
        <h1 className="text-3xl md:text-4xl font-bold text-foreground leading-tight">
          {page.title}
        </h1>

        {/* Last reviewed */}
        <p className="text-xs text-muted-foreground mt-4">
          Last reviewed:{' '}
          <span className="text-foreground">{page.lastReviewed}</span>
          {' · '}
          <span>Sourced from official government portals</span>
        </p>
      </div>
    </section>
  );
}
```

---

### `components/learn/LearnServiceCTA.tsx`

```typescript
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
                Done by {guaranteedDate}, guaranteed
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

      {/* Self-serve nudge — builds trust, people who want to DIY bookmark us */}
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
```

---

### `components/learn/tools/EligibilityTool.tsx`

Used on: `/learn/how-to-register-gst-india`, `/learn/do-i-need-fssai-license`, `/learn/startup-india-dpiit-recognition`

```typescript
'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { LearnToolConfig, EligibilityQuestion } from '@/lib/learn/pages';
import { ServiceConfig } from '@/lib/services';

export function EligibilityTool({ config, ctaService }: {
  config: LearnToolConfig;
  ctaService: ServiceConfig;
}) {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [result, setResult] = useState<EligibilityResult | null>(null);
  const [step, setStep] = useState(0);

  const questions = config.questions ?? [];
  const currentQ = questions[step];
  const isComplete = step === questions.length;

  const handleAnswer = (answer: string) => {
    const newAnswers = { ...answers, [step]: answer };
    setAnswers(newAnswers);

    // Check for early-exit branches
    const earlyResult = getEarlyResult(questions, newAnswers, step);
    if (earlyResult) {
      setResult(earlyResult);
      return;
    }

    if (step < questions.length - 1) {
      setStep(prev => prev + 1);
    } else {
      setResult(evaluateAnswers(questions, newAnswers));
    }
  };

  return (
    <div className="border border-border rounded-xl bg-card overflow-hidden">
      <div className="px-6 py-4 border-b border-border bg-background">
        <p className="text-xs uppercase tracking-widest text-muted-foreground">
          Quick check
        </p>
        <p className="font-semibold text-foreground mt-1">{config.title}</p>
      </div>

      {!result ? (
        <div className="p-6">
          {/* Progress */}
          <div className="flex gap-1.5 mb-6">
            {questions.map((_, i) => (
              <div key={i} className={cn(
                "h-1 flex-1 rounded-full transition-colors",
                i <= step ? "bg-[hsl(var(--ollvy-green))]" : "bg-muted"
              )} />
            ))}
          </div>

          <p className="text-sm font-medium text-foreground mb-4">
            {currentQ?.text}
          </p>
          <div className="space-y-2">
            {currentQ?.options.map(opt => (
              <button
                key={opt.value}
                onClick={() => handleAnswer(opt.value)}
                className="w-full text-left px-4 py-3 rounded-lg border border-border
                           text-sm text-foreground hover:border-foreground/40
                           hover:bg-muted/30 transition-colors"
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="p-6">
          <div className={cn(
            "flex items-start gap-3 rounded-lg p-4 mb-5",
            result.type === 'eligible'
              ? "bg-[hsl(var(--ollvy-green))]/5 border border-[hsl(var(--ollvy-green))]/20"
              : result.type === 'ineligible'
              ? "bg-muted/40 border border-border"
              : "bg-[hsl(var(--ollvy-amber))]/5 border border-[hsl(var(--ollvy-amber))]/20"
          )}>
            {result.type === 'eligible'
              ? <CheckCircle size={16} className="text-[hsl(var(--ollvy-green))] mt-0.5 shrink-0" />
              : <AlertCircle size={16} className="text-[hsl(var(--ollvy-amber))] mt-0.5 shrink-0" />
            }
            <div>
              <p className="text-sm font-semibold text-foreground">{result.headline}</p>
              <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{result.body}</p>
            </div>
          </div>

          {result.type === 'eligible' && (
            <Button className="w-full" asChild>
              <a href={`/services/${ctaService.slug}?utm_source=learn_tool&utm_medium=eligibility_result`}>
                {result.ctaLabel ?? `Book ${ctaService.shortName} — ₹${(ctaService.ollvyFee + (ctaService.govtFee ?? 0)).toLocaleString('en-IN')}`}
              </a>
            </Button>
          )}

          <button
            onClick={() => { setAnswers({}); setStep(0); setResult(null); }}
            className="w-full mt-3 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Start over
          </button>
        </div>
      )}
    </div>
  );
}

interface EligibilityResult {
  type: 'eligible' | 'ineligible' | 'conditional';
  headline: string;
  body: string;
  ctaLabel?: string;
}

// Evaluation logic is defined per tool in the LearnPageConfig
// These are pure functions — no side effects
function evaluateAnswers(
  questions: EligibilityQuestion[],
  answers: Record<number, string>
): EligibilityResult {
  // Each question has an `evaluator` function that returns a result or null
  for (const [i, q] of questions.entries()) {
    const result = q.evaluator?.(answers[i], answers);
    if (result) return result;
  }
  // Default
  return {
    type: 'conditional',
    headline: 'It depends on your situation.',
    body: 'WhatsApp us with your specific details and we\'ll tell you in 2 minutes.',
  };
}

function getEarlyResult(
  questions: EligibilityQuestion[],
  answers: Record<number, string>,
  currentStep: number
): EligibilityResult | null {
  return questions[currentStep]?.earlyExit?.(answers[currentStep]) ?? null;
}
```

---

## THE 5 PRIORITY LEARN PAGES — COMPLETE DATA

---

### PAGE 1: `/learn/how-to-register-gst-india`

```typescript
// lib/learn/pages/how-to-register-gst.ts
import { LearnPageConfig } from '../pages';

export const howToRegisterGst: LearnPageConfig = {
  slug: 'how-to-register-gst-india',
  title: 'How to Register for GST in India',
  seoTitle: 'How to Register for GST in India (2025) — Step-by-Step Guide | Ollvy',
  seoDescription: 'Complete guide to GST registration in India. Check if it\'s mandatory for you, required documents by business type, exact process steps, fees, and timeline. Free eligibility checker.',
  canonicalUrl: 'https://ollvy.com/learn/how-to-register-gst-india',
  lastReviewed: 'March 2025',
  category: 'GST',
  ctaServiceSlug: 'gst-registration',
  relatedServiceSlugs: ['gst-monthly-filing', 'pvt-ltd-incorporation'],
  relatedLearnSlugs: ['gst-filing-penalty', 'gst-due-dates', 'pvt-ltd-vs-llp'],

  tool: {
    type: 'eligibility',
    title: 'Is GST registration mandatory for your business?',
    questions: [
      {
        text: 'What type of business are you?',
        options: [
          { value: 'pvt_ltd', label: 'Private Limited Company' },
          { value: 'llp', label: 'LLP or Partnership' },
          { value: 'proprietor', label: 'Sole Proprietor or Freelancer' },
          { value: 'ecommerce', label: 'E-commerce seller (Amazon, Flipkart, etc.)' },
        ],
        evaluator: (answer) => {
          if (answer === 'ecommerce') return {
            type: 'eligible',
            headline: 'GST registration is mandatory for you.',
            body: 'E-commerce sellers must register for GST regardless of annual turnover. Amazon, Flipkart, and all major platforms require a valid GSTIN before you can activate your seller account.',
            ctaLabel: 'Get GST Registration — ₹8,999',
          };
          return null; // continue to next question
        },
      },
      {
        text: 'What is your approximate annual turnover?',
        options: [
          { value: 'below_20l', label: 'Below ₹20 lakh' },
          { value: '20l_40l', label: '₹20–40 lakh' },
          { value: 'above_40l', label: 'Above ₹40 lakh' },
          { value: 'not_started', label: 'Not started yet / below ₹5 lakh' },
        ],
        evaluator: (answer, allAnswers) => {
          if (answer === 'above_40l') return {
            type: 'eligible',
            headline: 'GST registration is mandatory for you.',
            body: 'Businesses with annual turnover above ₹40 lakh (₹20L for service businesses) must register for GST under Section 22 of the CGST Act. Non-registration after crossing the threshold is an offence with 100% tax due as penalty.',
            ctaLabel: 'Get GST Registration — ₹8,999',
          };
          if (answer === 'below_20l' && allAnswers[0] === 'proprietor') return {
            type: 'ineligible',
            headline: 'GST registration is not mandatory at this turnover.',
            body: 'Sole proprietors below ₹20L turnover (₹10L in North-East states) are exempt. You can register voluntarily if you want to issue GST invoices to B2B clients or claim input tax credit. Voluntary registration uses the same process.',
          };
          return null;
        },
      },
      {
        text: 'Do you supply goods or services across state borders?',
        options: [
          { value: 'yes', label: 'Yes — I sell to customers in other states' },
          { value: 'no', label: 'No — all sales are within my state' },
        ],
        evaluator: (answer) => {
          if (answer === 'yes') return {
            type: 'eligible',
            headline: 'GST registration is mandatory for you.',
            body: 'Interstate supply triggers mandatory GST registration regardless of annual turnover. Even if your total sales are ₹5 lakh, a single interstate sale requires registration.',
            ctaLabel: 'Get GST Registration — ₹8,999',
          };
          return null;
        },
      },
      {
        text: 'Do you want to claim input tax credit on purchases?',
        options: [
          { value: 'yes', label: 'Yes — I buy goods/services for my business' },
          { value: 'no', label: 'Not a priority right now' },
        ],
        evaluator: (answer, allAnswers) => {
          if (answer === 'yes') return {
            type: 'eligible',
            headline: 'Voluntary GST registration makes sense for you.',
            body: 'To claim input tax credit (reduce your tax by the GST you paid on purchases), you must be a registered taxpayer. If your supplier is GST-registered and you\'re not, you lose that credit. Voluntary registration uses the same process and the same ₹8,999 price.',
            ctaLabel: 'Get Voluntary GST Registration — ₹8,999',
          };
          return {
            type: 'conditional',
            headline: 'Registration is optional at your current stage.',
            body: 'You\'re below the mandatory threshold and don\'t have immediate interstate sales or ITC needs. Register when turnover approaches ₹40L, or when you start selling B2B to GST-registered buyers who will want a tax invoice.',
          };
        },
      },
    ],
  },

  sections: [
    {
      heading: 'Is GST registration mandatory?',
      body: `The threshold depends on your business type and what you sell.

**For goods businesses**: Mandatory above ₹40 lakh annual turnover. If you're in Manipur, Mizoram, Tripura, Meghalaya, Assam, Nagaland, Arunachal Pradesh, or Sikkim, the threshold is ₹20 lakh.

**For service businesses**: Mandatory above ₹20 lakh annual turnover. Same North-East exception applies.

**Regardless of turnover — mandatory in all cases**:
- Any interstate supply of goods or services
- E-commerce sellers (Amazon, Flipkart, Meesho, etc.)
- Casual taxable persons (occasional supplies)
- Non-resident taxable persons
- Anyone required to deduct TDS under GST
- Anyone supplying through an e-commerce operator

**Voluntary registration**: If you're below the threshold but want to issue GST invoices or claim input tax credit, you can register voluntarily. Same process, same fee.`,
      table: [
        { col1: 'Business Type', col2: 'Mandatory Threshold', col3: 'Exception' },
        { col1: 'Goods — general states', col2: '₹40 lakh/year', col3: '—' },
        { col1: 'Services — general states', col2: '₹20 lakh/year', col3: '—' },
        { col1: 'Any — North-East states', col2: '₹10 lakh/year', col3: '—' },
        { col1: 'E-commerce seller', col2: 'No threshold — mandatory', col3: '—' },
        { col1: 'Interstate supply', col2: 'No threshold — mandatory', col3: '—' },
      ],
      note: 'Source: Section 22, CGST Act 2017. Thresholds as amended by Notification 10/2019-CT.',
    },
    {
      heading: 'What documents do you need?',
      body: 'Required documents depend on your business type. Use the tabs below.',
      componentSlot: 'document-checklist',
      componentProps: { serviceSlug: 'gst-registration' },
    },
    {
      heading: 'The registration process — step by step',
      body: 'Your CA handles all of this. If you\'re filing yourself, this is what happens on the GSTN portal.',
      componentSlot: 'process-stepper',
      componentProps: {
        steps: [
          {
            step: 1, title: 'Answer 5 questions — personalised checklist generated', timeline: 'Day 0',
            body: 'Business type, state, turnover estimate, supply type, and whether you need voluntary registration. A CA is assigned within 4 hours and generates your specific document list — not the generic 20-item government list.',
            visual: 'checklist', milestone: 'CA assigned, document checklist sent',
          },
          {
            step: 2, title: 'Upload documents', timeline: 'Day 0–1',
            body: 'PAN, Aadhaar, address proof, and bank statement. Uploaded through the app. CA verifies every document before filing — blurry scans and address mismatches are caught here, not after an officer query.',
            visual: 'upload', milestone: 'Documents verified',
          },
          {
            step: 3, title: 'Application filed — ARN in 24 hours', timeline: 'Day 1–2',
            body: 'CA files GST REG-01 on the GSTN portal. Application Reference Number generated immediately. Shared in your app the same day. You can verify the status yourself at gstn.gov.in → Search Taxpayer → Search by ARN.',
            visual: 'form', milestone: 'ARN generated and sent to your app',
          },
          {
            step: 4, title: 'Officer query — if raised, CA responds', timeline: 'Day 3–5 (if applicable)',
            body: 'Officers occasionally request document clarification within 7 days. Your CA responds within 24 hours. This is in scope — not an extra charge.',
            visual: 'form',
          },
          {
            step: 5, title: 'GSTIN issued', timeline: 'Day 5–7',
            body: 'GSTN issues your GSTIN. Permanent — no renewal. Compliance calendar populated automatically with GSTR-1 and GSTR-3B due dates.',
            visual: 'stamp', isCompletion: true, milestone: 'GSTIN active on GSTN portal',
          },
        ],
      },
    },
    {
      heading: 'How long does it take?',
      body: `**Standard timeline**: 5–7 working days if documents are clean.

**What delays it**:
- Aadhaar mobile number not linked or changed: adds 2–3 days (requires UIDAI visit, must be done by the applicant)
- Business address doesn't match utility bill exactly: officer raises a query, adds 3–5 days
- GSTN portal downtime: happens occasionally, especially near filing deadlines

**If you file yourself**: The GST REG-01 form has 23 fields across 5 tabs. Budget 2–3 hours minimum if you're doing it for the first time. Officers raise queries on self-filed applications more frequently than CA-filed ones — document formatting is a common issue.`,
    },
    {
      heading: 'What does it cost?',
      body: `**Government fee**: ₹0. There is no fee to apply for GST registration.

**If using a CA**: Market rates in India range from ₹1,500 (budget, no tracking) to ₹5,000 (full-service). Ollvy charges ₹8,999 — which includes CA assignment, document pre-verification, ARN tracking, officer query handling, and compliance calendar setup. The price difference is the difference between filing and being done.

**Penalty for not registering when mandatory**: 100% of tax due, minimum ₹10,000. If your annual turnover is ₹50 lakh and you haven't registered, that's ₹50,000+ penalty on top of all unpaid GST.`,
      note: 'Penalty reference: Section 122, CGST Act 2017.',
    },
    {
      heading: 'What are your obligations after getting a GSTIN?',
      body: `Once registered, you must file regularly or face penalties.

**Monthly (for most businesses)**:
- GSTR-1 (outward supplies): Due by 11th of every month
- GSTR-3B (net tax payment): Due by 20th of every month

**Quarterly (if annual turnover below ₹1.5 crore)**:
- GSTR-1: Due by 13th of the month after quarter end
- GSTR-3B: Due by 22nd or 24th depending on state

**Annually**:
- GSTR-9 (annual return): Due December 31 for the previous financial year
- GSTR-9C (reconciliation, if turnover above ₹5Cr): Due with GSTR-9

**Late filing penalties**: ₹100/day (₹50 CGST + ₹50 SGST) plus 18% per annum interest on outstanding tax from day 21.

If this sounds like a lot to track, it is. Ollvy's GST Monthly Filing retainer handles all of this for ₹2,999/month — CA assigned, all three filings covered, Proof-of-Work Report every cycle.`,
    },
  ],
};
```

---

### PAGE 2: `/learn/startup-india-dpiit-recognition`

```typescript
// lib/learn/pages/startup-india-dpiit.ts

export const startupIndiaDpiit: LearnPageConfig = {
  slug: 'startup-india-dpiit-recognition',
  title: 'Startup India DPIIT Recognition — Eligibility, Benefits, and How to Apply',
  seoTitle: 'Startup India DPIIT Recognition (2025) — Eligibility, Tax Benefits, How to Apply | Ollvy',
  seoDescription: 'Complete guide to DPIIT recognition under Startup India. Check eligibility, understand 80IAC tax holiday and angel tax exemption, and apply in 5 working days.',
  canonicalUrl: 'https://ollvy.com/learn/startup-india-dpiit-recognition',
  lastReviewed: 'March 2025',
  category: 'Startup',
  ctaServiceSlug: 'startup-india-dpiit',
  ctaSecondarySlug: 'msme-udyam',
  relatedServiceSlugs: ['pvt-ltd-incorporation', 'gst-registration', 'trademark-registration'],
  relatedLearnSlugs: ['how-to-register-gst-india', 'pvt-ltd-vs-llp', 'msme-registration-benefits'],

  tool: {
    type: 'eligibility',
    title: 'Does your startup qualify for DPIIT recognition?',
    questions: [
      {
        text: 'What is your business entity type?',
        options: [
          { value: 'pvt_ltd', label: 'Private Limited Company' },
          { value: 'llp', label: 'Limited Liability Partnership (LLP)' },
          { value: 'partnership', label: 'Registered Partnership Firm' },
          { value: 'proprietor', label: 'Sole Proprietorship' },
          { value: 'not_incorporated', label: 'Not incorporated yet' },
        ],
        earlyExit: (answer) => {
          if (answer === 'proprietor') return {
            type: 'ineligible',
            headline: 'Sole proprietorships cannot get DPIIT recognition.',
            body: 'DPIIT recognition requires a Pvt Ltd, LLP, or Registered Partnership Firm. Incorporate as a Pvt Ltd first — it takes 15 working days and ₹24,999. Most startups choose Pvt Ltd for easier equity structure and future funding.',
          };
          if (answer === 'not_incorporated') return {
            type: 'ineligible',
            headline: 'You need to incorporate first.',
            body: 'DPIIT recognition is post-incorporation. Incorporate as a Pvt Ltd (recommended for startups), then apply for recognition. Both can be done through Ollvy — Pvt Ltd takes 15 days, DPIIT recognition takes 5 days after that.',
          };
          return null;
        },
      },
      {
        text: 'When was your company incorporated?',
        options: [
          { value: 'under_2y', label: 'Less than 2 years ago' },
          { value: '2_5y', label: '2–5 years ago' },
          { value: '5_10y', label: '5–10 years ago' },
          { value: 'over_10y', label: 'More than 10 years ago' },
        ],
        earlyExit: (answer) => {
          if (answer === 'over_10y') return {
            type: 'ineligible',
            headline: 'Your company is too old for DPIIT recognition.',
            body: 'DPIIT recognition requires incorporation within the last 10 years. Your company doesn\'t qualify. MSME (Udyam) registration has no age restriction and provides lending benefits, payment protection, and government scheme access — apply for that instead.',
          };
          return null;
        },
      },
      {
        text: 'Has your annual turnover ever exceeded ₹100 crore?',
        options: [
          { value: 'no', label: 'No — never crossed ₹100 crore' },
          { value: 'yes', label: 'Yes — we\'ve crossed ₹100 crore in a year' },
        ],
        earlyExit: (answer) => {
          if (answer === 'yes') return {
            type: 'ineligible',
            headline: 'Your company has exceeded the DPIIT turnover limit.',
            body: 'DPIIT recognition requires that annual turnover has never exceeded ₹100 crore in any financial year. Once you\'ve crossed this, recognition is no longer available.',
          };
          return null;
        },
      },
      {
        text: 'Does your business use technology or innovation in its core offering?',
        options: [
          { value: 'yes_tech', label: 'Yes — technology is central to how we deliver value' },
          { value: 'yes_process', label: 'We\'ve innovated the process, but it\'s not purely tech' },
          { value: 'no', label: 'No — we\'re a traditional business model' },
          { value: 'unsure', label: 'Not sure — help me understand the criteria' },
        ],
        evaluator: (answer) => {
          if (answer === 'yes_tech' || answer === 'yes_process') return {
            type: 'eligible',
            headline: 'Your startup qualifies for DPIIT recognition.',
            body: 'You meet all four eligibility criteria: incorporated as Pvt Ltd/LLP, within 10 years, below ₹100Cr turnover, and technology/innovation-based business model. Recognition takes 5 working days. The benefits — angel tax exemption, 80IAC tax holiday, patent fee reduction — are active from the date of recognition.',
            ctaLabel: 'Apply for DPIIT Recognition — ₹4,999',
          };
          if (answer === 'no') return {
            type: 'conditional',
            headline: 'DPIIT recognition may be harder to get, but not impossible.',
            body: 'The "innovation" criterion is interpreted broadly by DPIIT. A restaurant chain with a proprietary ordering system qualifies. A construction firm with a unique material innovation qualifies. DPIIT has rejected purely traditional business models. Our CS can review your business description and advise before you apply.',
          };
          return {
            type: 'conditional',
            headline: 'The innovation criterion is broader than most people think.',
            body: 'DPIIT has approved recognition for SaaS companies, D2C brands, marketplace businesses, and tech-enabled services. The test is not whether you\'ve invented something new — it\'s whether technology or innovation is a meaningful part of how you create or deliver value. A cloud kitchen with an ordering app qualifies. An offline restaurant without technology usually doesn\'t.',
          };
        },
      },
    ],
  },

  sections: [
    {
      heading: 'What is Startup India / DPIIT recognition?',
      body: `The Department for Promotion of Industry and Internal Trade (DPIIT), under the Ministry of Commerce and Industry, runs the Startup India initiative. Recognition is a government certification that your company qualifies as a "startup" under the Startup India Action Plan (2016).

Recognition is self-certified — you apply on the Startup India portal, certify that you meet the criteria, and DPIIT issues the certificate within 2–5 working days. There is no physical inspection or third-party verification at the time of application.

The recognition is permanent once issued. It doesn't expire as long as your company continues to meet the criteria (under 10 years old, under ₹100Cr turnover).`,
    },
    {
      heading: 'Eligibility criteria — specific',
      body: `All four conditions must be met:

**1. Entity type**: Must be incorporated as a Private Limited Company, Limited Liability Partnership (LLP), or Registered Partnership Firm. Sole proprietorships and one-person companies do not qualify.

**2. Age**: Incorporated less than 10 years ago.

**3. Turnover**: Annual turnover has never exceeded ₹100 crore in any financial year since incorporation.

**4. Innovation**: Working towards innovation, development, or deployment of new products/processes/services, OR has a scalable business model with high potential for job creation or wealth generation.

**On the innovation criterion** — this is where most founders are unsure. DPIIT has approved recognition for:
- SaaS and software products
- D2C brands with proprietary products
- Marketplace businesses (Ollvy included)
- Tech-enabled professional services
- Food businesses with technology in ordering, delivery, or production
- Hardware and IoT products
- Agritech, edtech, fintech, healthtech — all approved regularly

What DPIIT does not approve: purely traditional business models with no technology or innovation component — offline retail, construction, transport without tech, generic trading companies.

**The write-up is the application**: When you apply, you submit a 300–500 word description of your innovation. The quality of this write-up determines approval. Most DIY applications that get rejected have vague descriptions — "we use technology to deliver seamless solutions." Our CS helps you write a specific, verifiable description.`,
      note: 'Eligibility defined under G.S.R. 364(E) — DPIIT Notification dated April 11, 2018, as amended.',
    },
    {
      heading: 'What recognition gives you — with actual numbers',
      body: `Recognition itself gives you nothing — it's the gateway to applying for the specific benefits. Here's what each benefit actually means:

**1. Section 80IAC — 3-year income tax holiday**

After getting DPIIT recognition, you can apply to the Inter-Ministerial Board (IMB) for the 80IAC deduction. If approved, profits in any 3 consecutive years out of the first 10 years of incorporation are 100% exempt from income tax.

*What this means in rupees*: A startup that makes ₹50 lakh profit in year 3 would normally pay approximately ₹13 lakh corporate tax (26% effective rate). With 80IAC approval, that's ₹0. Over 3 profitable years at ₹50L/year, that's ₹39 lakh saved.

Important: 80IAC is a separate application to the IMB, not automatic from DPIIT recognition. Most startups get DPIIT recognition but miss this step. Ollvy's CS flags this and helps file the 80IAC application as part of the DPIIT service.

**2. Angel tax exemption — Section 56(2)(viib)**

Without DPIIT recognition, if an investor pays more than the "fair market value" of your shares, the excess is treated as income and taxed in the company's hands. This is angel tax — it can trigger a 30%+ tax liability on your funding round.

With DPIIT recognition, your startup is exempt from Section 56(2)(viib). Investments at any valuation are not treated as income. This is the single most important reason to get recognised before your first external funding round.

*Example*: You raise ₹50 lakh at a ₹5 crore valuation. The IT department determines fair market value as ₹2 crore. Without recognition, ₹30 lakh (the "excess") is taxed at 30% — that's ₹9 lakh tax on your funding. With recognition, ₹0.

**3. Government procurement — no prior experience required**

DPIIT-recognised startups can bid for government tenders without meeting the standard eligibility requirements for prior turnover or number of years in operation. For startups targeting government contracts, this removes a major barrier.

**4. Patent and trademark fee reduction**

- Patent application fee: Reduced by 80% (from ₹16,000 to ₹3,200 for a natural person/startup)
- Trademark examination fee: Also reduced
- Fast-track examination available for patents

**5. Self-certification for 9 labour and environment laws**

DPIIT-recognised startups can self-certify compliance with certain labour and environment laws for 3–5 years, reducing compliance burden in the early years. Not applicable once you have more than 20 employees for most provisions.`,
      note: 'Tax exemption references: Section 80IAC, Income Tax Act 1961. Angel tax exemption: Section 56(2)(viib), Income Tax Act 1961. Patent fee: Office of the Controller General of Patents, Designs & Trade Marks (CGPDTM).',
    },
    {
      heading: 'The application process',
      componentSlot: 'process-stepper',
      body: 'You can apply on the Startup India portal yourself. The process below is what Ollvy\'s CS does on your behalf.',
      componentProps: {
        steps: [
          {
            step: 1, title: 'Register on the Startup India portal', timeline: 'Day 0',
            body: 'Create an account at startupindia.gov.in using your company PAN and a director\'s email. Your CS does this for you and adds you as a collaborator so you retain access permanently.',
            visual: 'form',
          },
          {
            step: 2, title: 'Startup profile + innovation write-up', timeline: 'Day 0–1',
            body: 'The most important step. Fill your company details, upload Certificate of Incorporation and PAN, and submit the innovation description (300–500 words). Your CS drafts the write-up based on your business model. We\'ve never had a rejection when the write-up is specific and accurate.',
            visual: 'form', milestone: 'Write-up drafted and approved by you',
          },
          {
            step: 3, title: 'Self-certification and submission', timeline: 'Day 1',
            body: 'You certify that all information is accurate. The certification is a legal declaration. Your CS reviews the entire application before you certify.',
            visual: 'checklist',
          },
          {
            step: 4, title: 'DPIIT Recognition Certificate issued', timeline: 'Day 2–5',
            body: 'DPIIT reviews and issues the recognition certificate with your DPIIT number. Certificate is downloaded and stored in your Ollvy account. CS then initiates the 80IAC IMB application separately if you want the tax holiday.',
            visual: 'stamp', isCompletion: true, milestone: 'DPIIT Recognition Certificate issued',
          },
        ],
      },
    },
    {
      heading: 'DPIIT vs MSME — get both',
      body: `These are two completely different registrations with different benefits. Both can be held simultaneously. Both are one-time.

| | DPIIT (Startup India) | MSME (Udyam) |
|---|---|---|
| Who can apply | Pvt Ltd, LLP, Partnership | Any business including proprietor |
| Age limit | Under 10 years | No limit |
| Turnover limit | Under ₹100 crore | Under ₹250 crore |
| Key benefits | Tax holiday, angel tax exemption, patent fees | Priority lending, payment protection |
| Government fee | ₹0 | ₹0 |
| Ollvy fee | ₹4,999 | ₹1,999 |
| Time | 5 working days | 2 working days |

A 2-year-old Pvt Ltd startup qualifies for both. Register for both. Total: ₹6,998 for two registrations that can save lakhs in tax and unlock crores in lending access.`,
    },
    {
      heading: 'The 80IAC application — the step most founders miss',
      body: `DPIIT recognition gets you eligibility for the 80IAC tax holiday. Claiming it requires a separate application to the Inter-Ministerial Board (IMB).

**How to apply for 80IAC**:
1. Log in to the Startup India portal with your DPIIT-recognised account
2. Navigate to Tax Exemption → Section 80IAC
3. Upload: CIN, audited financials, board resolution, business plan (detailed)
4. IMB reviews within 45–90 days

**The business plan requirement is where most applications fail**. The IMB wants to see:
- Current business model and revenue streams
- Technology or innovation central to the business (with evidence — patents, proprietary tech, unique process)
- Market opportunity and scalability
- 3-year financial projections

This is not a compliance filing — it's closer to a VC pitch deck in format. Ollvy handles 80IAC applications as an add-on to the DPIIT service. Ask at checkout.

**When to apply**: Apply as soon as you have your first profitable year or expect one within 12 months. The clock on your "3 years out of 10" starts when you first claim the deduction — there's no penalty for applying late other than losing the window.`,
      note: 'Section 80IAC: Deduction in respect of profits and gains from eligible business of an eligible start-up. Income Tax Act 1961, as amended by Finance Act 2019.',
    },
    {
      heading: 'Frequently asked questions',
      componentSlot: 'faq-list',
      body: '',
      componentProps: {
        faqs: [
          { q: 'Can I apply for DPIIT recognition if I haven\'t started generating revenue?', a: 'Yes. Revenue is not part of the eligibility criteria. Pre-revenue startups apply and get recognised regularly. The application requires you to describe your business model and innovation — not your revenue.' },
          { q: 'Does DPIIT recognition need to be renewed?', a: 'No. Recognition is permanent once issued. It doesn\'t expire. Your DPIIT number stays active as long as your company meets the criteria (under 10 years, under ₹100Cr turnover).' },
          { q: 'My startup is an LLP. Am I eligible?', a: 'Yes. LLPs registered in India are eligible for DPIIT recognition. The process is identical to Pvt Ltd. Note that LLPs cannot issue equity shares — angel tax exemption applies differently (profit share vs equity). Consult a CA before your first external investment.' },
          { q: 'What happens if my turnover crosses ₹100 crore after recognition?', a: 'Your recognition remains valid but you no longer qualify as a "startup" for future applications or renewals. Existing benefits are not clawed back — you keep what you\'ve already claimed.' },
          { q: 'Is DPIIT recognition the same as "Startup India" registration?', a: 'Yes. "Startup India registration," "DPIIT recognition," and "Startup India certification" all refer to the same thing — a recognition certificate issued by DPIIT under the Startup India initiative.' },
          { q: 'Will DPIIT recognition help with fundraising?', a: 'Directly, yes — through the angel tax exemption (Section 56(2)(viib)), which means your investors can invest at any valuation without triggering a tax liability. It doesn\'t directly help you get investments, but it removes a compliance obstacle that some investors and their CAs flag during due diligence.' },
        ],
      },
    },
  ],
};
```

---

### PAGE 3: `/learn/gst-filing-penalty`

```typescript
// lib/learn/pages/gst-filing-penalty.ts

export const gstFilingPenalty: LearnPageConfig = {
  slug: 'gst-filing-penalty',
  title: 'GST Filing Penalties in India — Exact Amounts, Not Estimates',
  seoTitle: 'GST Late Filing Penalty India (2025) — GSTR-1, GSTR-3B, GSTR-9 Exact Amounts',
  seoDescription: 'GST late filing penalties: ₹100/day late fee plus 18% annual interest from day 21. Calculate your exact penalty for GSTR-1, GSTR-3B, and GSTR-9. Includes penalty calculator.',
  canonicalUrl: 'https://ollvy.com/learn/gst-filing-penalty',
  lastReviewed: 'March 2025',
  category: 'GST',
  ctaServiceSlug: 'gst-monthly-filing',
  relatedServiceSlugs: ['gst-registration', 'gst-monthly-filing'],
  relatedLearnSlugs: ['how-to-register-gst-india', 'gst-due-dates'],

  tool: {
    type: 'penalty',
    title: 'Calculate your exact GST penalty',
    penaltyType: 'gst',
    // Reuses the PenaltyTool component from §8
    // Business type + GST registered + employees → specific rupee output
  },

  sections: [
    {
      heading: 'GSTR-3B late filing — specific penalty amounts',
      body: `GSTR-3B is the monthly summary return. Due date: 20th of every month.

**Late fee** (Section 47, CGST Act):
- ₹50/day: ₹25 CGST + ₹25 SGST, if tax is payable
- ₹20/day: ₹10 CGST + ₹10 SGST, for nil returns (no tax due)
- Maximum: ₹5,000 per return (₹2,500 CGST + ₹2,500 SGST) for returns with tax liability
- Maximum: ₹500 per return (₹250 CGST + ₹250 SGST) for nil returns

**Interest on outstanding tax** (Section 50, CGST Act):
- 18% per annum on unpaid tax
- Starts from the day after the due date — not from when you discover the shortfall
- Calculated daily: (Tax due × 18%) ÷ 365 × days late

*Example*: GSTR-3B was due April 20. You file on May 10 with ₹1 lakh tax outstanding.
- Late fee: 20 days × ₹50/day = ₹1,000
- Interest: ₹1,00,000 × 18% ÷ 365 × 20 = ₹986
- Total additional cost: ₹1,986 on top of the ₹1 lakh tax

The interest accrues silently. Most founders discover the liability when a CA audits the books.`,
      note: 'Source: Section 47 (late fee) and Section 50 (interest) of CGST Act 2017.',
    },
    {
      heading: 'GSTR-1 late filing penalties',
      body: `GSTR-1 is the outward supply return. Due date: 11th of every month (or 13th for quarterly filers).

**Late fee**: ₹50/day (₹25 CGST + ₹25 SGST) for returns with outward supplies
**For nil returns**: ₹20/day
**Maximum**: ₹5,000 per return

**Cascading consequence — not just your problem**:
Your GSTR-1 feeds your buyer's ITC claim. If you file GSTR-1 late, your buyer's input tax credit (ITC) is blocked until you file. They may get a notice. They may call you.

This is why many B2B buyers ask their suppliers: "Are you GST compliant? Do you file on time?" Late GSTR-1 filing damages business relationships beyond the fine itself.`,
    },
    {
      heading: 'GSTR-9 annual return penalties',
      body: `GSTR-9 is the annual summary return. Due: December 31 for the previous financial year. Mandatory for businesses with annual turnover above ₹2 crore; optional below that.

**Late fee**: ₹200/day (₹100 CGST + ₹100 SGST)
**Maximum**: 0.25% of annual turnover in the state

*Example*: Annual turnover ₹80 lakh. You file GSTR-9 60 days late.
- Daily penalty: ₹200
- 60 days: ₹12,000
- Maximum cap: 0.25% × ₹80,00,000 = ₹20,000
- Actual penalty: ₹12,000 (below the cap)

If you file 100 days late: ₹20,000 penalty (capped).`,
      note: 'Source: Section 47, CGST Act 2017. Turnover-based cap as per CGST Notification.',
    },
    {
      heading: 'What to do if you\'ve already missed a deadline',
      body: `**Step 1**: File immediately. Late fee stops accruing the day you file. Every additional day adds to the penalty.

**Step 2**: Pay the late fee along with the return. The portal calculates it automatically when you file. You'll see the exact amount before submission.

**Step 3**: Check for interest liability. If there was outstanding tax when the return was due, interest has been accruing. A CA can calculate the exact amount — it shows up on your GSTR-3B as a liability.

**Step 4**: Check for amnesty. DPIIT and GSTN periodically announce GST amnesty schemes that waive or reduce late fees for businesses that file within a specified window. The most recent was in 2023. Watch for notifications — Ollvy's compliance calendar flags these when announced.

**Step 5**: Evaluate your ongoing risk. A single late filing indicates a process problem. Two or three suggests you need a retainer arrangement where a CA handles filing — removing the human error entirely.`,
    },
  ],
};
```

---

### PAGE 4: `/learn/do-i-need-fssai-license`

```typescript
export const doINeedFssai: LearnPageConfig = {
  slug: 'do-i-need-fssai-license',
  title: 'Do I Need an FSSAI License? — Food Business Requirements in India',
  seoTitle: 'Do I Need FSSAI License? Requirements for Restaurants, Cloud Kitchens & Food Businesses (2025)',
  seoDescription: 'Find out if you need FSSAI Basic Registration, State License, or Central License. Covers restaurants, cloud kitchens, home food businesses, packaged food, and catering.',
  canonicalUrl: 'https://ollvy.com/learn/do-i-need-fssai-license',
  lastReviewed: 'March 2025',
  category: 'Licensing',
  ctaServiceSlug: 'fssai-license',
  ctaSecondarySlug: 'gst-registration',
  relatedServiceSlugs: ['fssai-license', 'gst-registration', 'msme-udyam'],
  relatedLearnSlugs: ['how-to-register-gst-india', 'msme-registration-benefits'],

  tool: {
    type: 'eligibility',
    title: 'Which FSSAI license do you need?',
    questions: [
      {
        text: 'What type of food business are you?',
        options: [
          { value: 'restaurant', label: 'Restaurant or café (dine-in or takeaway)' },
          { value: 'cloud_kitchen', label: 'Cloud kitchen or delivery-only kitchen' },
          { value: 'home_food', label: 'Home-based food business (cooking from home)' },
          { value: 'packaged', label: 'Packaged food product (manufactured/branded)' },
          { value: 'catering', label: 'Catering company or food events' },
          { value: 'retail', label: 'Retail store selling food items' },
        ],
      },
      {
        text: 'What is your approximate annual turnover from food business?',
        options: [
          { value: 'below_12l', label: 'Below ₹12 lakh' },
          { value: '12l_20cr', label: '₹12 lakh to ₹20 crore' },
          { value: 'above_20cr', label: 'Above ₹20 crore' },
        ],
        evaluator: (answer, allAnswers) => {
          if (answer === 'above_20cr') return {
            type: 'eligible',
            headline: 'You need a Central FSSAI License.',
            body: 'Businesses with annual turnover above ₹20 crore, or operating in more than one state, require a Central FSSAI License. This is processed by the Ministry of Health and Family Welfare directly. Timeline: 60–90 days. Govt fee: ₹7,500/year.',
          };
          if (answer === 'below_12l' && allAnswers[0] === 'home_food') return {
            type: 'eligible',
            headline: 'You need FSSAI Basic Registration.',
            body: 'Home-based food businesses with turnover below ₹12 lakh need FSSAI Basic Registration (petty food business). Fee: ₹100/year. This is the simplest registration — filed on FoSCoS portal. Ollvy handles this for ₹1,999 (includes document preparation and filing).',
          };
          if (answer === '12l_20cr') return {
            type: 'eligible',
            headline: 'You need a State FSSAI License.',
            body: `State FSSAI License is required for businesses with annual turnover between ₹12 lakh and ₹20 crore, operating within one state. This applies to most restaurants, cloud kitchens, and packaged food businesses at early-to-mid stage. Govt fee: ₹2,000/year. Ollvy fee: ₹4,999 (first year includes licence + govt fee).`,
            ctaLabel: 'Book FSSAI State License — ₹6,999',
          };
          return null;
        },
      },
    ],
  },

  sections: [
    {
      heading: 'Three types of FSSAI license — which one applies to you',
      body: `Every food business operator in India must have an FSSAI registration or license. There is no exemption for new businesses, informal operations, or small scale — if you handle food commercially, you need one.`,
      table: [
        { col1: 'Type', col2: 'Annual Turnover', col3: 'Govt Fee', col4: 'Timeline', col5: 'Who It Applies To' },
        { col1: 'Basic Registration', col2: 'Below ₹12 lakh', col3: '₹100/year', col4: '7 days', col5: 'Petty food businesses, home cooks selling food' },
        { col1: 'State License', col2: '₹12L–₹20Cr, single state', col3: '₹2,000/year', col4: '30–45 days', col5: 'Restaurants, cloud kitchens, catering, packaged food' },
        { col1: 'Central License', col2: 'Above ₹20Cr or multi-state', col3: '₹7,500/year', col4: '60–90 days', col5: 'Large manufacturers, multi-state chains, importers/exporters' },
      ],
      note: 'Source: Food Safety and Standards (Licensing and Registration of Food Businesses) Regulations, 2011. Fee schedule as per FoSCoS portal.',
    },
    {
      heading: 'Cloud kitchens specifically',
      body: `A cloud kitchen (dark kitchen, ghost kitchen, delivery-only kitchen) is treated as a food business establishment under FSSAI regulations. The fact that you don't have dine-in customers is irrelevant — food is being prepared and sold commercially.

**What FSSAI inspects for cloud kitchens**:
- Kitchen premises address (must match license)
- Refrigeration equipment and temperature logs
- Pest control records (exterminator visit records + certificate)
- Staff with Food Safety Training and Certification (FoSTaC)
- Source of raw materials (invoices showing food-grade suppliers)
- Waste disposal records

**Important for Swiggy/Zomato listings**: Both platforms require a valid FSSAI license before activating your cloud kitchen. Without it, your listing goes live but payments are blocked until you upload the license. This is the most common delay for new cloud kitchen operators.

**Shared kitchen / commissary kitchen**: If you operate from a shared kitchen space, the license is in your name, not the kitchen owner's. The kitchen owner typically has their own license for the premises. Both must be valid.`,
    },
    {
      heading: 'What you need after FSSAI — the food business compliance stack',
      body: `Getting an FSSAI license is the start, not the end. A food business in India typically needs:

**Mandatory**:
- FSSAI license (covered above)
- GST Registration — mandatory above ₹20L turnover (₹40L for goods, but food is typically goods)
- Shop & Establishment Act registration — required in most states for any business premises
- BBMP / local municipal body trade license — varies by city and premises type

**Strongly recommended**:
- MSME / Udyam Registration — unlocks priority lending, payment protection
- Fire NOC — required for kitchen spaces above certain square footage (varies by city)
- Eating House License — required in Delhi, Maharashtra, and some other states for restaurants

**If you have employees** (above 10):
- ESIC Registration
- PF Registration (above 20 employees)

Ollvy handles all of these as individual services.`,
    },
  ],
};
```

---

### PAGE 5: `/learn/pvt-ltd-vs-llp`

```typescript
export const pvtLtdVsLlp: LearnPageConfig = {
  slug: 'pvt-ltd-vs-llp',
  title: 'Private Limited Company vs LLP — Which Is Right for Your Business?',
  seoTitle: 'Pvt Ltd vs LLP India (2025) — Comparison, Tax, Compliance, and When to Choose Each',
  seoDescription: 'Compare Private Limited Company and LLP for Indian businesses. Tax rates, compliance costs, funding eligibility, and liability. With decision tool.',
  canonicalUrl: 'https://ollvy.com/learn/pvt-ltd-vs-llp',
  lastReviewed: 'March 2025',
  category: 'Incorporation',
  ctaServiceSlug: 'pvt-ltd-incorporation',
  ctaSecondarySlug: 'llp-incorporation',
  relatedServiceSlugs: ['pvt-ltd-incorporation', 'llp-incorporation', 'startup-india-dpiit'],
  relatedLearnSlugs: ['startup-india-dpiit-recognition', 'how-to-register-gst-india'],

  tool: {
    type: 'comparison',
    title: 'Which entity type is right for your business?',
    compareA: 'pvt-ltd',
    compareB: 'llp',
    // ComparisonTool asks 4 questions and gives a specific recommendation
    questions: [
      {
        text: 'Do you plan to raise equity investment (angels, VCs) in the next 3 years?',
        options: [
          { value: 'yes', label: 'Yes — fundraising is part of the plan' },
          { value: 'maybe', label: 'Maybe — not ruled out' },
          { value: 'no', label: 'No — bootstrapped or debt-only' },
        ],
        evaluator: (answer) => {
          if (answer === 'yes') return {
            type: 'eligible', headline: 'Choose Private Limited Company.',
            body: 'Equity investment requires issuing shares. LLPs don\'t have shares — they have profit-sharing ratios. Most angels and VCs will not invest in an LLP. Converting an LLP to a Pvt Ltd after raising is complicated and expensive. Choose Pvt Ltd from the start.',
          };
          return null;
        },
      },
      {
        text: 'Are the founders providing professional services — consulting, accounting, law, architecture?',
        options: [
          { value: 'yes', label: 'Yes — professional services is our primary business' },
          { value: 'no', label: 'No — we\'re a product or non-professional service company' },
        ],
        evaluator: (answer, allAnswers) => {
          if (answer === 'yes' && allAnswers[0] === 'no') return {
            type: 'eligible', headline: 'LLP is likely the right choice.',
            body: 'Professional services firms (CA firms, law firms, consulting practices, architectural firms) traditionally use LLPs. The profit-sharing structure is simpler than salary + dividend. Compliance burden is lower. No mandatory statutory audit until turnover crosses ₹40L or contribution exceeds ₹25L.',
          };
          return null;
        },
      },
      {
        text: 'How many founders / partners?',
        options: [
          { value: 'one', label: '1 founder (solo)' },
          { value: 'two_four', label: '2–4 founders' },
          { value: 'five_plus', label: '5+ partners' },
        ],
        evaluator: (answer, allAnswers) => {
          if (answer === 'one') return {
            type: 'eligible', headline: 'Choose Private Limited Company.',
            body: 'LLPs require a minimum of 2 designated partners. A solo founder cannot incorporate an LLP. Choose Pvt Ltd — you can be the sole director and shareholder.',
          };
          return null;
        },
      },
      {
        text: 'What is your expected annual revenue in Year 1?',
        options: [
          { value: 'below_25l', label: 'Below ₹25 lakh' },
          { value: '25l_1cr', label: '₹25 lakh–₹1 crore' },
          { value: 'above_1cr', label: 'Above ₹1 crore' },
        ],
        evaluator: (answer, allAnswers) => {
          if (answer === 'above_1cr' || allAnswers[1] === 'no') return {
            type: 'eligible',
            headline: 'Private Limited Company is the safer default.',
            body: 'At this revenue level, or for a product/non-professional services business, Pvt Ltd gives you better credibility with enterprise clients, easier compliance with major platforms (Amazon, Razorpay require Pvt Ltd for certain features), and a cleaner path to growth.',
          };
          return {
            type: 'conditional',
            headline: 'Either can work — but Pvt Ltd is the default for a reason.',
            body: 'At early stage with modest revenue expectations and a professional services model, an LLP is cheaper to maintain (no mandatory audit, lower compliance). But if there\'s any chance of raising money or bringing in external investors, start with Pvt Ltd.',
          };
        },
      },
    ],
  },

  sections: [
    {
      heading: 'The decision in one table',
      body: 'Most of the time, the decision is simple. Choose Pvt Ltd unless you have a specific reason not to.',
      table: [
        { col1: 'Factor', col2: 'Private Limited', col3: 'LLP' },
        { col1: 'Equity investment', col2: '✓ Can issue shares to investors', col3: '✗ Cannot issue equity shares' },
        { col1: 'Minimum founders', col2: '1 director, 1 shareholder (can be same person)', col3: '2 designated partners (minimum)' },
        { col1: 'Corporate tax rate', col2: '22% (existing) / 15% (new mfg)', col3: '30% on profits + surcharge' },
        { col1: 'Dividend distribution', col2: 'After tax — dividend to shareholders', col3: 'Profit share — not taxed again after firm-level tax' },
        { col1: 'Statutory audit', col2: 'Mandatory regardless of turnover', col3: 'Only if turnover > ₹40L or contribution > ₹25L' },
        { col1: 'DPIIT / Startup India', col2: '✓ Eligible', col3: '✓ Eligible' },
        { col1: 'Compliance cost (annual)', col2: 'Higher — audit, annual return, ITR', col3: 'Lower — no mandatory audit at early stage' },
        { col1: 'Credibility with banks/clients', col2: 'Higher — established norm for companies', col3: 'Accepted but less common outside professional services' },
        { col1: 'Incorporation cost (Ollvy)', col2: '₹24,999 (includes ₹15,000 MCA)', col3: '₹13,999 (includes ₹5,000 MCA)' },
      ],
    },
    {
      heading: 'When LLP is genuinely the better choice',
      body: `LLP is not a second-class entity. It's the right choice in specific situations:

**1. Professional services partnership**: CA firms, law firms, architecture practices, and consulting partnerships traditionally use LLPs. The structure maps well to how professional services firms operate — partners draw profit shares, not salaries. No mandatory audit if below the threshold. The regulated profession bodies (ICAI, Bar Council) have specific rules about LLP formation for their members.

**2. Real estate holding**: LLP is commonly used for real estate holding and investment structures because of the flexibility in profit-sharing ratios and the absence of dividend distribution tax complications.

**3. Joint ventures between established companies**: Two companies forming a JV for a specific project sometimes use LLP because it offers contractual flexibility that Pvt Ltd doesn't.

**4. When compliance cost matters more than optics**: A solo professional or small team earning ₹30–50L annually doing B2B consulting may genuinely prefer LLP's lower compliance cost — no mandatory audit saves ₹40,000–₹80,000 per year.

In all other situations — product businesses, startups, D2C, SaaS, marketplaces, e-commerce — start with Pvt Ltd.`,
    },
    {
      heading: 'The tax difference — it\'s not what most articles say',
      body: `The common claim is "LLP has lower tax." This is partly true and partly misleading.

**Corporate tax**:
- Pvt Ltd: 22% of net profit (under the new tax regime, applicable to domestic companies)
- LLP: 30% of net profit + surcharge and cess

On pure corporate tax, Pvt Ltd is lower.

**But the distribution matters**:
- Pvt Ltd profit distributed to founders: First pay 22% corporate tax, then founders pay dividend tax (typically 30% + surcharge if high income). Double taxation.
- LLP profit distributed to partners: Pay 30% at the firm level. Partner's share is NOT taxed again.

**Effective rate comparison** (for founder-operated businesses that take all profit out):
- Pvt Ltd: ~22% corporate + ~30% dividend (on remaining 78%) = effectively ~43%
- LLP: 30% flat, no further tax on partner share = 30%

This makes LLP more tax-efficient for founder-operated businesses that distribute all profits annually. But for businesses that retain earnings and reinvest — or that plan to raise money and use salary + ESOP instead of dividends — Pvt Ltd is better.

The right answer depends entirely on your specific situation. Ask a CA.`,
      note: 'Tax rates as per Finance Act 2023. Surcharge and cess apply in addition. Individual circumstances vary significantly.',
    },
  ],
};
```

---

## §20 — THE STARTUP WEDGE PAGE (`/startup`)

**Route**: `app/startup/page.tsx`
**Component**: `components/startup/StartupPage.tsx`
**Purpose**: Dedicated landing page for startup founders. Drives incorporation + DPIIT + MSME bundling. Converts via stage-based service stack.

---

### `app/startup/page.tsx`

```typescript
import { Metadata } from 'next';
import { StartupPage } from '@/components/startup/StartupPage';

export const metadata: Metadata = {
  title: 'Startup Compliance Stack — Incorporation to Series A | Ollvy',
  description: 'Everything a startup needs: Pvt Ltd incorporation, Startup India DPIIT recognition, GST, MSME, monthly filings, ITR. Fixed prices. CAs assigned same day.',
  alternates: { canonical: 'https://ollvy.com/startup' },
  openGraph: {
    title: 'Startup Compliance Stack | Ollvy',
    description: 'The complete compliance stack for Indian startups. Incorporation, DPIIT, GST, MSME. All in one place.',
    url: 'https://ollvy.com/startup',
  },
};

export default function StartupPageRoute() {
  return <StartupPage />;
}
```

---

### `components/startup/StartupPage.tsx` — FULL COMPONENT SPEC

```typescript
'use client';
import { useState } from 'react';
import Link from 'next/link';
import { CheckCircle, Lock, ChevronRight, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { SERVICE_CONFIGS } from '@/lib/services';
import { getGuaranteedDate } from '@/lib/dates';

// The startup compliance stack — ordered by dependency
// locked: can only be booked after prerequisites
const STARTUP_STACK = [
  {
    stage: 1,
    label: 'Start here',
    tagline: 'Days 0–15',
    services: [
      {
        slug: 'pvt-ltd-incorporation',
        note: 'Required before anything else can be registered.',
        prerequisite: null,
      },
      {
        slug: 'startup-india-dpiit',
        note: 'Apply 5 days after CIN is issued.',
        prerequisite: 'pvt-ltd-incorporation',
        prereqNote: 'Requires CIN from incorporation',
      },
      {
        slug: 'msme-udyam',
        note: 'Apply same week as DPIIT. Different registration, different benefits.',
        prerequisite: 'pvt-ltd-incorporation',
        prereqNote: 'Requires CIN',
      },
    ],
  },
  {
    stage: 2,
    label: 'First 60 days',
    tagline: 'Days 15–60',
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
        note: 'Annual — due Sep 30. Set it up now so it\'s not forgotten.',
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
      },
      {
        slug: 'business-itr',
        note: 'ITR-6 for Pvt Ltd. Due Oct 31. Required even if the company made no profit.',
        prerequisite: 'pvt-ltd-incorporation',
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
            <span className="text-xs font-medium text-[hsl(var(--ollvy-green-fg))]">FOR STARTUPS</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-foreground font-display leading-tight max-w-[720px] mx-auto">
            Your compliance stack.<br />
            From Day 1 to Series A.
          </h1>

          <p className="text-base text-muted-foreground mt-5 max-w-[540px] mx-auto leading-relaxed">
            Incorporation, DPIIT recognition, GST, MSME, monthly filings, and annual returns.
            Every service in the sequence you need them. Fixed prices. CAs assigned same day.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
            <Button size="lg" asChild>
              <Link href="/services/pvt-ltd-incorporation?utm_source=startup_page&utm_medium=hero">
                Incorporate now — ₹24,999
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
              { stage: 3, label: '3–12 months', sub: 'Operating, team growing' },
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
            DPIIT recognition — what it actually gives you
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
                body: 'Patent application fees reduced 80% — from ₹16,000 to ₹3,200 for standard applications. Trademark examination fee also reduced.',
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
              <Link href="/services/startup-india-dpiit?utm_source=startup_page&utm_medium=dpiit_section">
                Apply for DPIIT Recognition — ₹4,999
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/learn/startup-india-dpiit-recognition">
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
            are the ones who kept records from day 1 — not those scrambling to file 3 years of
            MCA returns in a week.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {[
              { label: 'All MCA filings', detail: 'On time, every year. Acknowledgements stored permanently.' },
              { label: 'GST returns', detail: 'GSTR-1, GSTR-3B, GSTR-9 — all in one place.' },
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
                quote: 'DPIIT recognition took 5 days. Nobody told me about the angel tax exemption until Ollvy\'s CS did — during the scope call, before I\'d even booked. That alone was worth ten times the fee.',
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
              <Link href="/services/pvt-ltd-incorporation?utm_source=startup_page&utm_medium=footer_cta">
                Incorporate now — ₹24,999
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/services/startup-india-dpiit?utm_source=startup_page&utm_medium=footer_cta">
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
              <Link href={`/services/${svc.slug}?utm_source=startup_page&utm_medium=stack`}>
                Book this service <ChevronRight size={11} />
              </Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
```

---

## §21 — PROGRAMMATIC GEO PAGES

**Route**: `app/[service]/[city]/page.tsx`
**Scale**: 32 services × 30 cities = up to 960 pages
**Build order**: 6 priority combinations first, then scale

---

### PRIORITY 6 (build first)

| Slug | Expected monthly search |
|---|---|
| `/gst-registration/delhi` | ~18,000 |
| `/pvt-ltd-incorporation/bangalore` | ~15,000 |
| `/pvt-ltd-incorporation/delhi` | ~14,000 |
| `/gst-registration/bangalore` | ~12,000 |
| `/gst-registration/mumbai` | ~10,000 |
| `/trademark-registration/delhi` | ~8,000 |

---

### `lib/geo/cities.ts`

```typescript
export interface CityConfig {
  slug: string;
  name: string;                    // "Delhi"
  displayName: string;             // "Delhi NCR" for display
  state: string;                   // "Delhi"
  gstJurisdiction: string;         // "Central GST — Delhi Commissionerate"
  mcaRoc: string;                  // "RoC Delhi & Haryana"
  ptApplicable: boolean;           // Professional Tax applicable?
  shopEstActName?: string;         // State-specific name of Act
  coworkingNote?: string;          // City-specific note for address
}

export const CITIES: CityConfig[] = [
  {
    slug: 'delhi',
    name: 'Delhi',
    displayName: 'Delhi NCR',
    state: 'Delhi',
    gstJurisdiction: 'CGST jurisdiction. Delhi South, Delhi West, Delhi North commissionerates.',
    mcaRoc: 'RoC Delhi & Haryana (based in Delhi)',
    ptApplicable: false,
    shopEstActName: 'Delhi Shops and Establishments Act, 1954',
    coworkingNote: 'Co-working spaces in Delhi (WeWork, 91Springboard, Awfis, Smartworks) provide NOC letters. Must be on letterhead with your designated workspace number.',
  },
  {
    slug: 'bangalore',
    name: 'Bangalore',
    displayName: 'Bangalore',
    state: 'Karnataka',
    gstJurisdiction: 'SGST jurisdiction — Karnataka GST Commissionerate.',
    mcaRoc: 'RoC Karnataka (based in Bangalore)',
    ptApplicable: true,
    shopEstActName: 'Karnataka Shops and Commercial Establishments Act, 1961',
    coworkingNote: 'Karnataka requires BBMP trade license for commercial premises. Co-working NOC is accepted for GST address proof.',
  },
  {
    slug: 'mumbai',
    name: 'Mumbai',
    displayName: 'Mumbai',
    state: 'Maharashtra',
    gstJurisdiction: 'CGST jurisdiction. Multiple Mumbai commissionerates by area.',
    mcaRoc: 'RoC Maharashtra (Mumbai)',
    ptApplicable: true,
    shopEstActName: 'Maharashtra Shops and Establishments (Regulation of Employment and Conditions of Service) Act, 2017',
    coworkingNote: 'Mumbai co-working NOC is standard. BMC trade licence required for physical business addresses.',
  },
  {
    slug: 'hyderabad',
    name: 'Hyderabad',
    displayName: 'Hyderabad',
    state: 'Telangana',
    gstJurisdiction: 'SGST jurisdiction — Telangana State Tax.',
    mcaRoc: 'RoC Telangana & Andhra Pradesh',
    ptApplicable: true,
    shopEstActName: 'Telangana Shops and Establishments Act, 1988',
  },
  {
    slug: 'chennai',
    name: 'Chennai',
    displayName: 'Chennai',
    state: 'Tamil Nadu',
    gstJurisdiction: 'SGST jurisdiction — Tamil Nadu GST.',
    mcaRoc: 'RoC Tamil Nadu (Chennai)',
    ptApplicable: true,
    shopEstActName: 'Tamil Nadu Shops and Establishments Act, 1947',
  },
  {
    slug: 'pune',
    name: 'Pune',
    displayName: 'Pune',
    state: 'Maharashtra',
    gstJurisdiction: 'CGST jurisdiction — Pune Commissionerate.',
    mcaRoc: 'RoC Maharashtra (Pune)',
    ptApplicable: true,
    shopEstActName: 'Maharashtra Shops and Establishments Act, 2017',
  },
  // Add 24 more cities using same structure
];
```

---

### `app/[service]/[city]/page.tsx`

```typescript
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SERVICE_CONFIGS } from '@/lib/services';
import { CITIES } from '@/lib/geo/cities';
import { GeoPage } from '@/components/geo/GeoPage';
import { GEO_CONTENT } from '@/lib/geo/geo-content';

// Only generate pages for confirmed priority combinations
// Not all 32×30 = 960 at once — build priority first, expand later
const PRIORITY_COMBINATIONS = [
  { service: 'gst-registration', city: 'delhi' },
  { service: 'gst-registration', city: 'bangalore' },
  { service: 'gst-registration', city: 'mumbai' },
  { service: 'pvt-ltd-incorporation', city: 'delhi' },
  { service: 'pvt-ltd-incorporation', city: 'bangalore' },
  { service: 'trademark-registration', city: 'delhi' },
  { service: 'gst-registration', city: 'hyderabad' },
  { service: 'gst-registration', city: 'chennai' },
  { service: 'pvt-ltd-incorporation', city: 'mumbai' },
  { service: 'director-kyc', city: 'delhi' },
  { service: 'director-kyc', city: 'bangalore' },
  { service: 'msme-udyam', city: 'delhi' },
];

interface Props { params: { service: string; city: string } }

export function generateStaticParams() {
  return PRIORITY_COMBINATIONS;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const service = SERVICE_CONFIGS.find(s => s.slug === params.service);
  const city = CITIES.find(c => c.slug === params.city);
  if (!service || !city) return {};

  const totalFee = service.ollvyFee + (service.govtFee ?? 0);
  return {
    title: `${service.name} in ${city.name} — ₹${totalFee.toLocaleString('en-IN')} | Ollvy`,
    description: `${service.name} in ${city.name}. CA from ${city.name}, verified against ${city.state === 'Delhi' ? 'ICAI' : 'local registry'}. ${service.slaDays} working days. Fixed price ₹${totalFee.toLocaleString('en-IN')}.`,
    alternates: {
      canonical: `https://ollvy.com/${params.service}/${params.city}`,
    },
  };
}

export default function GeoPageRoute({ params }: Props) {
  const service = SERVICE_CONFIGS.find(s => s.slug === params.service);
  const city = CITIES.find(c => c.slug === params.city);
  if (!service || !city) notFound();

  const geoContent = GEO_CONTENT[`${params.service}__${params.city}`];

  return <GeoPage service={service} city={city} geoContent={geoContent} />;
}
```

---

### `components/geo/GeoPage.tsx`

```typescript
import Link from 'next/link';
import { CheckCircle } from 'lucide-react';
import { ServiceConfig } from '@/lib/services';
import { CityConfig } from '@/lib/geo/cities';
import { ServiceCard } from '@/components/landing/ServiceCard';
import { DocumentChecklist } from '@/components/service/tabs/DocumentsTab';
import { FaqsTab } from '@/components/service/tabs/FaqsTab';
import { BookingPanel } from '@/components/service/BookingPanel';
import { getGuaranteedDate } from '@/lib/dates';

interface GeoContent {
  citySpecificNotes: string[];           // 2–3 sentences specific to this city
  additionalFaqs: Array<{q:string, a:string}>;  // 2–3 city-specific FAQs
  jurisdictionNote: string;              // one paragraph about local jurisdiction
}

export function GeoPage({ service, city, geoContent }: {
  service: ServiceConfig;
  city: CityConfig;
  geoContent?: GeoContent;
}) {
  const totalFee = service.ollvyFee + (service.govtFee ?? 0);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: `${service.name} in ${city.name}`,
    areaServed: { '@type': 'City', name: city.name },
    provider: {
      '@type': 'Organization',
      name: 'Ollvy Technologies Private Limited',
      url: 'https://ollvy.com',
    },
    offers: {
      '@type': 'Offer',
      price: totalFee.toString(),
      priceCurrency: 'INR',
    },
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Ollvy', item: 'https://ollvy.com' },
        { '@type': 'ListItem', position: 2, name: service.name, item: `https://ollvy.com/services/${service.slug}` },
        { '@type': 'ListItem', position: 3, name: city.name, item: `https://ollvy.com/${service.slug}/${city.slug}` },
      ],
    },
  };

  return (
    <>
      <script type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Hero */}
      <section className="border-b border-border bg-background py-10">
        <div className="max-w-[1200px] mx-auto px-6">
          <p className="text-xs text-muted-foreground mb-3">
            <Link href="/">Ollvy</Link> → <Link href={`/services/${service.slug}`}>{service.name}</Link> → {city.name}
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
            {service.name} in {city.displayName}
          </h1>
          <p className="text-sm text-muted-foreground mt-3 max-w-[520px] leading-relaxed">
            CA from {city.name}, verified. {service.slaDays} working days.
            Fixed price ₹{totalFee.toLocaleString('en-IN')}.
          </p>
          <div className="flex items-center gap-2 mt-4">
            <CheckCircle size={13} className="text-[hsl(var(--ollvy-green))]" />
            <span className="text-sm text-[hsl(var(--ollvy-green-fg))]">
              Done by {getGuaranteedDate(service.slaDays)}, guaranteed
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
            <ServiceCard service={service} />

            {/* City-specific jurisdiction */}
            {geoContent?.jurisdictionNote && (
              <div>
                <h2 className="text-lg font-semibold text-foreground mb-3">
                  {service.shortName} in {city.name} — local details
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

            {/* Document checklist */}
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-3">
                What you need to get started
              </h2>
              <DocumentChecklist serviceSlug={service.slug} />
              {city.coworkingNote && (
                <p className="text-xs text-muted-foreground mt-3 italic">{city.coworkingNote}</p>
              )}
            </div>

            {/* City-specific notes */}
            {geoContent?.citySpecificNotes && geoContent.citySpecificNotes.length > 0 && (
              <div className="space-y-3">
                {geoContent.citySpecificNotes.map((note, i) => (
                  <div key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                    <div className="w-1 h-1 rounded-full bg-muted-foreground mt-2 shrink-0" />
                    {note}
                  </div>
                ))}
              </div>
            )}

            {/* Standard FAQs + city-specific FAQs */}
            <FaqsTab service={{
              ...service,
              faqs: [
                ...service.faqs,
                ...(geoContent?.additionalFaqs?.map(faq => ({
                  category: city.name,
                  q: faq.q,
                  a: faq.a,
                })) ?? []),
              ],
            }} />

            {/* Link to base service page */}
            <p className="text-xs text-muted-foreground">
              For full service details, process steps, and What's Included:{' '}
              <Link href={`/services/${service.slug}`} className="underline hover:text-foreground">
                {service.name} — main service page →
              </Link>
            </p>
          </div>

          {/* Right: sticky booking panel */}
          <div className="hidden lg:block">
            <BookingPanel service={service} />
          </div>
        </div>
      </div>
    </>
  );
}
```

---

### GEO CONTENT SPEC — 3 EXAMPLES

```typescript
// lib/geo/geo-content.ts

export const GEO_CONTENT: Record<string, GeoContent> = {

  'gst-registration__delhi': {
    jurisdictionNote: `Delhi falls under CGST jurisdiction. Depending on your business address, you may be assigned to Delhi North, Delhi West, Delhi South, or Delhi Central CGST Commissionerate. All applications are filed electronically through the GSTN portal — the commissionerate only matters if you receive an officer query, in which case your CA handles the response directly with that commissionerate's officers.`,
    citySpecificNotes: [
      `Delhi has no separate state GST — it uses the Central GST framework directly. Unlike states like Maharashtra or Karnataka where SGST and CGST are separate administrations, Delhi's GST is administered entirely by CGST officers.`,
      `The GSTN Seva Kendra for Delhi is at SCOPE Complex, Core 8, 7 Institutional Area, Lodhi Road, New Delhi — 110 003. Walk-in queries are handled there, though almost all issues can be resolved online or through your CA.`,
    ],
    additionalFaqs: [
      {
        q: 'Can I use my co-working space address in Delhi for GST registration?',
        a: `Yes. Co-working space addresses are accepted for GST registration in Delhi. You need an NOC from the co-working space operator on their letterhead, specifying your name, company, and designated workspace (desk number, cabin, or floor). WeWork, 91Springboard, Awfis, Smartworks, and most other major Delhi co-working spaces provide this routinely. The letter should state that you have a right to use the address as your business address.`,
      },
      {
        q: 'Which CGST commissionerate covers South Delhi?',
        a: `South Delhi falls under the Delhi South CGST Commissionerate. Your GSTIN will have "07" as the state code (Delhi's GST state code). The commissionerate is relevant only for officer queries — your CA handles any interactions with them.`,
      },
    ],
  },

  'pvt-ltd-incorporation__bangalore': {
    jurisdictionNote: `Bangalore falls under the jurisdiction of the Registrar of Companies, Karnataka (RoC Karnataka), located at Kendriya Sadana, 2nd Floor, Sultan Bazar, Bangalore — 560 020. All SPICe+ filings go to this RoC. Name availability is checked against the MCA21 national database — not just Karnataka companies — so conflicting names across India can block your reservation.`,
    citySpecificNotes: [
      `Karnataka has Professional Tax (PT). Once your company is registered, you need to register for PT within 30 days if you have any salaried employees or if the directors draw remuneration. PT for directors is ₹2,500/year. Ollvy handles PT registration separately (₹1,999).`,
      `BBMP trade licence is required for commercial premises in Bruhat Bengaluru Mahanagara Palike jurisdiction. If your registered address is a co-working space, the co-working operator typically holds the BBMP trade licence — you don't need a separate one unless you have independent premises.`,
    ],
    additionalFaqs: [
      {
        q: 'Can I use an HSR Layout or Koramangala co-working address for incorporation?',
        a: `Yes. Co-working space addresses are accepted as registered office addresses for Pvt Ltd companies in Bangalore. You need an NOC from the space operator and the utility bill of the premises (in the operator's name). Most major Bangalore co-working spaces (WeWork, 91Springboard, Bhive, IndiQube, CoWrks) provide standard NOC letters. Your CS will review the document before filing.`,
      },
      {
        q: 'Does Karnataka have any state-specific requirements for company registration?',
        a: `The incorporation process is federal — SPICe+ is filed with the central MCA, not with Karnataka specifically. The state-specific obligations that come after incorporation are: Karnataka PT registration (if you have salaried employees), BBMP trade licence (for commercial premises), and Karnataka Shops and Commercial Establishments Act registration (for premises with employees). Ollvy handles all post-incorporation registrations.`,
      },
    ],
  },

  'gst-registration__mumbai': {
    jurisdictionNote: `Mumbai falls under CGST jurisdiction. The city is divided across multiple CGST commissionerates — Mumbai South, Mumbai Central, Mumbai East, and Thane (for businesses in Thane and extended Mumbai). Your commissionerate is determined by your business address pin code. All GST applications are electronic, so this doesn't affect the filing process — it only matters if there's an officer query.`,
    citySpecificNotes: [
      `Maharashtra levies SGST separately from CGST. For a Mumbai business, your GSTIN will show "27" as the state code (Maharashtra). CGST and SGST are administered separately — CGST by central officers, SGST by Maharashtra state tax officers.`,
      `BMC (Brihanmumbai Municipal Corporation) trade licence is required for commercial addresses in Mumbai. If you're using a co-working space, the operator holds the trade licence. For your own commercial premises, this needs to be obtained separately — Ollvy handles this as an add-on.`,
    ],
    additionalFaqs: [
      {
        q: 'Can I register for GST with a co-working space address in BKC or Lower Parel?',
        a: `Yes. GST registration with co-working space addresses is standard in Mumbai. You need the NOC from the space operator (on their letterhead, with your name, company, and workspace details) and a utility bill for the premises in the operator's name. Your CA verifies both before filing. BKC, Lower Parel, Andheri, and other major business hubs have established co-working operators who provide these routinely.`,
      },
    ],
  },
};
```

---

### IMPLEMENTATION NOTES FOR CLAUDE CODE — GEO + LEARN PAGES

1. **`generateStaticParams` is non-negotiable** on all three new route types — `/learn/[slug]`, `/[service]/[city]`, and `/startup`. All must be statically generated. Dynamic rendering would hurt SEO and performance.

2. **`LearnPage` reuses service components directly** — `ProcessStepper`, `DocumentChecklist`, `FaqsTab`. Do not recreate these. Import from `@/components/service/`. The `componentSlot` pattern in `LearnSection` handles this at render time.

3. **Geo page `[service]` vs `services/[slug]`** — these are different routes. `/gst-registration/delhi` and `/services/gst-registration` coexist. The geo page breadcrumb links back to the base service page. The base service page does not link to geo pages (too many to enumerate — handle via sitemap).

4. **`GEO_CONTENT` is optional** — if `geoContent` is undefined (combination exists in `generateStaticParams` but no custom content written yet), the geo page renders without the city-specific notes and additional FAQs. It still works. Add content progressively.

5. **`/startup` is a static page** — no `generateStaticParams` needed, no dynamic data at build time. The service data comes from `SERVICE_CONFIGS` (already static). The only dynamic data is the booking panel `getGuaranteedDate()` call, which is a pure date utility.

6. **EligibilityTool `evaluator` functions** — these are defined inline in the `LearnPageConfig` objects in `lib/learn/pages/[slug].ts`. They are pure TypeScript functions, not API calls. They run client-side, no server round-trip.

7. **UTM parameters** — every CTA link from learn pages and startup page uses `utm_source=learn` or `utm_source=startup_page`. Every geo page CTA uses `utm_source=geo_page`. This is how you attribute acquisition by distribution channel in PostHog.

8. **Internal linking is load-bearing for SEO** — `LearnInternalLinks` component must render actual `<Link>` elements (not JavaScript-routed). The search bot needs to follow them. Do not use `onClick` for navigation in this component.

9. **The self-serve links in `LearnServiceCTA`** (pointing to gstn.gov.in, mca.gov.in, startupindia.gov.in) are intentional. They build E-E-A-T signals and reduce bounce rate — a user who clicks through to the govt portal and comes back has demonstrated intent. Don't remove them.

10. **`/startup` page `completedServices` state** — this is ephemeral (useState, not persisted). The checkbox state resets on page reload. This is correct behaviour for an anonymous user flow. If the user is logged in, this should eventually sync to their account's service completion status — v2 feature, not now.
