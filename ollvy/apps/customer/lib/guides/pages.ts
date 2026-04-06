// lib/guides/pages.ts
// SEO Content Architecture for /guides pages

import type { LearnSectionTable } from './types/learn-section-table';
import type { ToolRanking } from './types/tool-ranking';

export type { LearnSectionTable } from './types/learn-section-table';
export type { ToolRanking, UrgencyLevel, ComparisonRanking, UrgencyRanking, BenefitsRanking, FormAssignmentRanking } from './types/tool-ranking';
export { URGENCY_LEVELS, getUrgencyLevel } from './types/tool-ranking';

export interface LearnPageConfig {
  slug: string;
  title: string;                       // H1 - plain language, specific
  seoTitle: string;                    // <title> tag - includes year + location signal
  seoDescription: string;              // meta description - answer-first
  canonicalUrl: string;
  lastReviewed: string;                // "March 2025" - shown on page, updated manually
  category: LearnCategory;
  relatedServiceSlugs: string[];       // which service pages to link to
  relatedLearnSlugs: string[];         // which other /guides pages to link to

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

  // Related external tools (penalty calculators, document checklists)
  relatedTools?: RelatedTools;
}

export interface RelatedTools {
  penaltyCalculators?: string[];       // e.g., ['gst-late-filing', 'itr-late-filing']
  documentChecklists?: string[];       // e.g., ['gst-registration', 'business-itr']
  deadlines?: string[];                // e.g., ['itr-2027', 'gst-annual-2027']
}

// Tool metadata for displaying links
export interface ToolMetadata {
  slug: string;
  title: string;
  subtitle: string;
}

export const PENALTY_CALCULATOR_METADATA: ToolMetadata[] = [
  { slug: 'gst-late-filing', title: 'GST Late Filing Penalty Calculator', subtitle: 'Calculate GSTR-1, GSTR-3B, GSTR-9 penalties' },
  { slug: 'gst-demand-notice', title: 'GST Demand Notice Calculator', subtitle: 'Estimate penalty and interest on notices' },
  { slug: 'itr-late-filing', title: 'ITR Late Filing Penalty Calculator', subtitle: 'Calculate Section 234F late fees' },
  { slug: 'tds-late-filing', title: 'TDS Late Filing Penalty Calculator', subtitle: 'Calculate TDS return penalties' },
  { slug: 'mca-annual-filing', title: 'MCA Annual Filing Penalty Calculator', subtitle: 'AOC-4, MGT-7 late fee calculator' },
  { slug: 'director-kyc', title: 'Director KYC Penalty Calculator', subtitle: 'DIR-3 KYC default penalty' },
  { slug: 'pf-esic-penalty', title: 'PF & ESIC Penalty Calculator', subtitle: 'Late payment and filing penalties' },
  { slug: 'professional-tax-penalty', title: 'Professional Tax Penalty Calculator', subtitle: 'PT late payment penalties' },
  { slug: 'shops-establishment-penalty', title: 'Shops & Establishment Penalty', subtitle: 'State-wise compliance penalties' },
  { slug: 'startup-dpiit-compliance', title: 'DPIIT Startup Compliance', subtitle: 'Startup India compliance status' },
];

export const DOCUMENT_CHECKLIST_METADATA: ToolMetadata[] = [
  { slug: 'gst-registration', title: 'GST Registration Documents', subtitle: 'Documents required for GSTIN' },
  { slug: 'business-itr', title: 'Business ITR Documents', subtitle: 'Documents for company/LLP tax filing' },
  { slug: 'individual-itr', title: 'Individual ITR Documents', subtitle: 'Documents for personal tax filing' },
  { slug: 'private-limited-company', title: 'Private Limited Company Documents', subtitle: 'Incorporation document checklist' },
  { slug: 'llp', title: 'LLP Documents', subtitle: 'LLP registration checklist' },
  { slug: 'partnership', title: 'Partnership Firm Documents', subtitle: 'Partnership deed requirements' },
  { slug: 'sole-proprietor', title: 'Sole Proprietor Documents', subtitle: 'Proprietorship registration docs' },
  { slug: 'trademark', title: 'Trademark Documents', subtitle: 'TM application requirements' },
];

export const DEADLINE_METADATA: ToolMetadata[] = [
  { slug: 'tds-return-q4-fy2025-26', title: 'TDS Return Q4 FY2025-26', subtitle: 'Due May 31, 2026' },
  { slug: 'tds-return-q1-fy2026-27', title: 'TDS Return Q1 FY2026-27', subtitle: 'Due Jul 31, 2026' },
  { slug: 'director-kyc-2026', title: 'Director KYC 2026', subtitle: 'Triennial - Next Jun 30, 2028' },
  { slug: 'tds-return-q2-fy2026-27', title: 'TDS Return Q2 FY2026-27', subtitle: 'Due Oct 31, 2026' },
  { slug: 'business-itr-fy2025-26', title: 'Business ITR FY2025-26', subtitle: 'Due Oct 31, 2026' },
  { slug: 'gstr-9-fy2025-26', title: 'GSTR-9 FY2025-26', subtitle: 'Due Dec 31, 2026' },
];

export function getPenaltyCalculatorBySlug(slug: string): ToolMetadata | undefined {
  return PENALTY_CALCULATOR_METADATA.find(t => t.slug === slug);
}

export function getDocumentChecklistBySlug(slug: string): ToolMetadata | undefined {
  return DOCUMENT_CHECKLIST_METADATA.find(t => t.slug === slug);
}

export function getDeadlineBySlug(slug: string): ToolMetadata | undefined {
  return DEADLINE_METADATA.find(t => t.slug === slug);
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
  | 'ROC Notice'
  | 'TDS Filing'
  | 'Income Tax Filing'
  | 'ROC Filing'
  | 'GST Filing';

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
  evaluator?: (answer: string, allAnswers: string[]) => EligibilityResult | null;
  earlyExit?: (answer: string, allAnswers?: string[]) => EligibilityResult | null;
}

export interface EligibilityResult {
  type: 'eligible' | 'ineligible' | 'conditional' | 'mandatory' | 'recommended' | 'not_required' | 'optional';
  headline: string;
  body: string;
  ctaLabel?: string;
  ctaHref?: string;
  ranking?: ToolRanking;
}

export interface LearnSection {
  number?: string;                     // "01", "02", etc. - for numbered sections
  heading: string;
  body: string;                        // markdown - rendered as prose
  bullets?: string[];                  // bullet points for the section
  table?: LearnSectionTable;           // optional comparison/reference table
  list?: string[];                     // optional bullet list (plain text) - alias for bullets
  note?: string;                       // italicised note at bottom of section
  componentSlot?: 'document-checklist' | 'process-stepper' | 'faq-list';
  componentProps?: Record<string, unknown>;
}

/** @deprecated Use LearnSectionTable instead */
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

// Deadline Guides
import { tdsQ4FY2526 } from './pages/tds-return-q4-fy2025-26';
import { tdsQ1FY2627 } from './pages/tds-return-q1-fy2026-27';
import { directorKYC2026 } from './pages/director-kyc-2026';
import { tdsQ2FY2627 } from './pages/tds-return-q2-fy2026-27';
import { businessITRFY2526 } from './pages/business-itr-fy2025-26';
import { gstr9FY2526 } from './pages/gstr-9-fy2025-26';

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

  // Deadline Guides
  tdsQ4FY2526,
  tdsQ1FY2627,
  directorKYC2026,
  tdsQ2FY2627,
  businessITRFY2526,
  gstr9FY2526,
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
