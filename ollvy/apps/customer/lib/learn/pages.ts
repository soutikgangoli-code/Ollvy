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

  // FAQs - shown after sections
  faqs?: LearnFaq[];

  // Service CTA at bottom
  ctaServiceSlug: string;              // primary service to promote
  ctaSecondarySlug?: string;           // secondary CTA if relevant

  // Notice-specific fields (for tax/compliance notice pages)
  severity?: NoticeSeverity;           // 'urgent', 'serious', 'moderate'
  deadline?: string;                   // e.g., "30 days from date of notice"
  deadlineNote?: string;               // additional context about the deadline
}

export type LearnCategory =
  | 'GST'
  | 'Incorporation'
  | 'Startup'
  | 'Licensing'
  | 'Tax'
  | 'Compliance'
  | 'Payroll'
  | 'Registration'
  | 'GST Notice'
  | 'Income Tax Notice'
  | 'TDS Notice'
  | 'ROC Notice';

export type NoticeSeverity = 'urgent' | 'serious' | 'moderate';

export interface LearnFaq {
  q: string;
  a: string;
}

export interface LearnToolConfig {
  type: 'eligibility' | 'penalty' | 'comparison' | 'deadline';
  title: string;                       // shown above tool
  questions?: EligibilityQuestion[];   // for eligibility tool
  defaultResult?: EligibilityResult;   // fallback result after all questions answered
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
  type: 'eligible' | 'ineligible' | 'conditional' | 'mandatory' | 'recommended' | 'not_required' | 'optional';
  headline: string;
  body: string;
  ctaLabel?: string;
  ctaHref?: string;
}

export interface LearnSection {
  number?: string;                     // "01", "02", etc. - for numbered sections
  heading: string;
  body: string;                        // markdown - rendered as prose
  bullets?: string[];                  // bullet points for the section
  table?: TableRow[];                  // optional data table
  list?: string[];                     // optional bullet list (plain text) - alias for bullets
  note?: string;                       // italicised note at bottom of section
  componentSlot?: 'document-checklist' | 'process-stepper' | 'faq-list';
  componentProps?: Record<string, unknown>;
}

export interface TableRow {
  [key: string]: string;
}

// Import all learn page configs
// Tier 1 - Core Business Decisions
import { gstRegistration } from './pages/gst-registration';
import { pvtLtdVsLlp } from './pages/pvt-ltd-vs-llp';
import { itrFiling } from './pages/itr-filing';
import { trademarkRegistration } from './pages/trademark';

// Tier 2 - Compliance Triggers
import { pfRegistration } from './pages/pf-registration';
import { esiRegistration } from './pages/esi-registration';
import { professionalTax } from './pages/professional-tax';
import { shopEstablishment } from './pages/shop-establishment';

// Tier 3 - Strategic Decisions
import { msmeUdyam } from './pages/msme-udyam';
import { dpiitStartup } from './pages/dpiit-startup';
import { fssaiLicense } from './pages/fssai-license';
import { itrFormSelection } from './pages/itr-form-selection';

// GST Notices
import { gstDrc01Notice } from './pages/gst-drc-01-notice';
import { gstDrc01aPreNotice } from './pages/gst-drc-01a-pre-notice';
import { gstDrc01bMismatch } from './pages/gst-drc-01b-mismatch';
import { gstAsmt10Notice } from './pages/gst-asmt-10-notice';
import { gstAsmt14BestJudgment } from './pages/gst-asmt-14-best-judgment';
import { gstReg17CancellationNotice } from './pages/gst-reg-17-cancellation-notice';
import { gstReg31Suspension } from './pages/gst-reg-31-suspension';
import { gstGstr2bItcMismatch } from './pages/gst-gstr2b-itc-mismatch';
import { gstGstr9AnnualReturnMismatch } from './pages/gst-gstr9-annual-return-mismatch';

// Income Tax Notices
import { incomeTax1431Intimation } from './pages/income-tax-143-1-intimation';
import { incomeTax1432Scrutiny } from './pages/income-tax-143-2-scrutiny';
import { incomeTax1421Notice } from './pages/income-tax-142-1-notice';
import { incomeTax148148aReopening } from './pages/income-tax-148-148a-reopening';
import { incomeTax1399DefectiveReturn } from './pages/income-tax-139-9-defective-return';
import { incomeTax156Demand } from './pages/income-tax-156-demand';
import { incomeTax245RefundAdjustment } from './pages/income-tax-245-refund-adjustment';
import { incomeTax271Penalty } from './pages/income-tax-271-penalty';
import { incomeTax131Summons } from './pages/income-tax-131-summons';
import { incomeTaxAisSftNotice } from './pages/income-tax-ais-sft-notice';

// TDS Notices
import { tdsShortDeductionNotice } from './pages/tds-short-deduction-notice';
import { tds26q27qMismatch } from './pages/tds-26q-27q-mismatch';
import { tds194c194jDemand } from './pages/tds-194c-194j-demand';

// ROC Notices
import { rocAnnualFilingDefaultNotice } from './pages/roc-annual-filing-default-notice';
import { dir3KycDinDeactivation } from './pages/dir-3-kyc-din-deactivation';

export const LEARN_PAGES: LearnPageConfig[] = [
  // Tier 1 - Core Business Decisions
  gstRegistration,
  pvtLtdVsLlp,
  itrFiling,
  trademarkRegistration,

  // Tier 2 - Compliance Triggers
  pfRegistration,
  esiRegistration,
  professionalTax,
  shopEstablishment,

  // Tier 3 - Strategic Decisions
  msmeUdyam,
  dpiitStartup,
  fssaiLicense,
  itrFormSelection,

  // GST Notices
  gstDrc01Notice,
  gstDrc01aPreNotice,
  gstDrc01bMismatch,
  gstAsmt10Notice,
  gstAsmt14BestJudgment,
  gstReg17CancellationNotice,
  gstReg31Suspension,
  gstGstr2bItcMismatch,
  gstGstr9AnnualReturnMismatch,

  // Income Tax Notices
  incomeTax1431Intimation,
  incomeTax1432Scrutiny,
  incomeTax1421Notice,
  incomeTax148148aReopening,
  incomeTax1399DefectiveReturn,
  incomeTax156Demand,
  incomeTax245RefundAdjustment,
  incomeTax271Penalty,
  incomeTax131Summons,
  incomeTaxAisSftNotice,

  // TDS Notices
  tdsShortDeductionNotice,
  tds26q27qMismatch,
  tds194c194jDemand,

  // ROC Notices
  rocAnnualFilingDefaultNotice,
  dir3KycDinDeactivation,
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
