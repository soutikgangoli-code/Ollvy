// lib/learn/pages.ts
// SEO Content Architecture for /learn pages

export interface LearnPageConfig {
  slug: string;
  title: string;                       // H1 - plain language, specific
  seoTitle: string;                    // <title> tag - includes year + location signal
  seoDescription: string;              // meta description - answer-first
  canonicalUrl: string;
  lastReviewed: string;                // "March 2025" - shown on page, updated manually
  category: LearnCategory;
  relatedServiceSlugs: string[];       // which service pages to link to
  relatedLearnSlugs: string[];         // which other /learn pages to link to

  // Tool config - one tool per page, shown at top
  tool?: LearnToolConfig;

  // Page sections
  sections: LearnSection[];

  // Service CTA at bottom
  ctaServiceSlug: string;              // primary service to promote
  ctaSecondarySlug?: string;           // secondary CTA if relevant
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
  title: string;                       // shown above tool
  questions?: EligibilityQuestion[];   // for eligibility tool
  penaltyType?: string;                // for penalty tool - maps to PENALTY_TABLE
  compareA?: string;                   // for comparison tool
  compareB?: string;
  deadlineType?: string;               // for deadline tracker
}

export interface EligibilityQuestion {
  text: string;
  options: Array<{ value: string; label: string }>;
  evaluator?: (answer: string, allAnswers: Record<number, string>) => EligibilityResult | null;
  earlyExit?: (answer: string) => EligibilityResult | null;
}

export interface EligibilityResult {
  type: 'eligible' | 'ineligible' | 'conditional';
  headline: string;
  body: string;
  ctaLabel?: string;
}

export interface LearnSection {
  heading: string;
  body: string;                        // markdown - rendered as prose
  table?: TableRow[];                  // optional data table
  list?: string[];                     // optional bullet list (plain text)
  note?: string;                       // italicised note at bottom of section
  componentSlot?: 'document-checklist' | 'process-stepper' | 'faq-list';
  componentProps?: Record<string, unknown>;
}

export interface TableRow {
  [key: string]: string;
}

// Import all learn page configs
import { howToRegisterGst } from './pages/how-to-register-gst';
import { startupIndiaDpiit } from './pages/startup-india-dpiit';
import { gstFilingPenalty } from './pages/gst-filing-penalty';
import { doINeedFssai } from './pages/do-i-need-fssai';
import { pvtLtdVsLlp } from './pages/pvt-ltd-vs-llp';

export const LEARN_PAGES: LearnPageConfig[] = [
  howToRegisterGst,
  startupIndiaDpiit,
  gstFilingPenalty,
  doINeedFssai,
  pvtLtdVsLlp,
];

export function getLearnPageBySlug(slug: string): LearnPageConfig | undefined {
  return LEARN_PAGES.find(p => p.slug === slug);
}

export function getLearnPagesByCategory(category: LearnCategory): LearnPageConfig[] {
  return LEARN_PAGES.filter(p => p.category === category);
}

export function getRelatedLearnPages(page: LearnPageConfig): LearnPageConfig[] {
  return page.relatedLearnSlugs
    .map(slug => LEARN_PAGES.find(p => p.slug === slug))
    .filter((p): p is LearnPageConfig => p !== undefined);
}
