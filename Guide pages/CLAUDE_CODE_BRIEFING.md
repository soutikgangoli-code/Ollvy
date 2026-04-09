# CLAUDE CODE BRIEFING
# Guide pages overhaul - everything to implement
# Date: April 2026

---

## OVERVIEW

Four workstreams:
1. New types and components (4 new files)
2. Replace all 12 guide page files
3. Swap in ranked tool configs for 5 guides
4. Add comparison tables to all 12 guides
5. Schema changes in existing files

Run `tsc --noEmit` after each section to catch type errors before moving on.

---

## SECTION 1: NEW FILES - CREATE THESE

### 1A. Type definition for table support in guide sections

**Destination:** `lib/guides/types/learn-section-table.ts`
**Action:** Create new file

```typescript
export interface LearnSectionTable {
  caption?: string
  headers: string[]
  rows: string[][]
}
```

---

### 1B. Type definitions for ranked tool results

**Destination:** `lib/guides/types/tool-ranking.ts`
**Action:** Create new file
**Content:** Copy from output file `tool-ranking.ts`

---

### 1C. Ranked result render component

**Destination:** `components/learn/LearnToolRankedResult.tsx`
**Action:** Create new file
**Content:** Copy from output file `LearnToolRankedResult.tsx`

---

### 1D. Table render component

**Destination:** `components/learn/LearnSectionTable.tsx`
**Action:** Create new file
**Content:** Copy from output file `LearnSectionTable.tsx`

---

## SECTION 2: SCHEMA CHANGES IN EXISTING FILES

### 2A. Add table field to LearnSection

**File:** `lib/guides/types/index.ts` (or wherever LearnSection is defined)
**Action:** Add one field to the existing LearnSection interface

```typescript
// BEFORE:
export interface LearnSection {
  number?: string
  heading: string
  body: string
  bullets?: string[]
  note?: string
}

// AFTER:
import type { LearnSectionTable } from './learn-section-table'

export interface LearnSection {
  number?: string
  heading: string
  body: string
  bullets?: string[]
  table?: LearnSectionTable    // <-- add this
  note?: string
}
```

---

### 2B. Add ranking field to EligibilityResult

**File:** wherever `EligibilityResult` or tool result types are defined
**Action:** Add optional ranking field

```typescript
import type { ToolRanking } from './tool-ranking'

// Add to existing EligibilityResult interface:
ranking?: ToolRanking
```

---

### 2C. Update guide section renderer to show tables

**File:** wherever guide sections are rendered (likely `components/learn/LearnSections.tsx` or similar)
**Action:** Import and use LearnSectionTable when `section.table` exists

```tsx
import { LearnSectionTable } from '@/components/learn/LearnSectionTable'

// Inside the section render, after bullets and before note:
{section.table && (
  <LearnSectionTable
    caption={section.table.caption}
    headers={section.table.headers}
    rows={section.table.rows}
  />
)}
```

---

### 2D. Update tool result renderer to show rankings

**File:** wherever the tool eligibility result is rendered (likely `components/learn/LearnToolResult.tsx` or similar)
**Action:** Import and use LearnToolRankedResult when `result.ranking` exists

```tsx
import { LearnToolRankedResult } from '@/components/learn/LearnToolRankedResult'

// Replace or wrap the existing result render:
{result.ranking ? (
  <LearnToolRankedResult
    headline={result.headline}
    body={result.body}
    ranking={result.ranking}
    ctaLabel={result.ctaLabel}
    ctaHref={result.ctaHref}
  />
) : (
  // existing result render unchanged
  <ExistingResultComponent result={result} />
)}
```

---

### 2E. Fix section heading render (SEO)

**File:** wherever guide section headings are rendered
**Action:** Section headings in the schema are ALL CAPS (e.g. "THE SHORT ANSWER"). The rendered `<h2>` must NOT be all caps - convert to title case on render.

```tsx
// Helper:
function toTitleCase(str: string): string {
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

// In render:
<h2>{toTitleCase(section.heading)}</h2>
```

---

## SECTION 3: REPLACE ALL 12 GUIDE PAGE FILES

Each guide file is a complete replacement. The new versions have:
- Fixed factual errors (LLP tax rate, DIR-3 KYC frequency, MSME thresholds)
- Updated lastReviewed: 'April 2026'
- Working tool logic with earlyExit and evaluator functions
- Better writing - concise, no em dashes, human

### Guide 1
**Destination:** `lib/guides/pages/gst-registration.ts`
**Action:** Replace entire file
**Source:** Output file `gst-registration.ts`

### Guide 2
**Destination:** `lib/guides/pages/pvt-ltd-vs-llp.ts`
**Action:** Replace entire file
**Source:** Output file `pvt-ltd-vs-llp.ts`

### Guide 3
**Destination:** `lib/guides/pages/itr-filing.ts`
**Action:** Replace entire file
**Source:** Output file `itr-filing.ts`

### Guides 4, 5, 6
**Source file:** Output file `guides-4-6.ts` (contains three named exports)

Extract and create three separate files:

| Export name | Destination |
|---|---|
| `trademarkGuide` | `lib/guides/pages/trademark.ts` |
| `pfRegistration` | `lib/guides/pages/pf-registration.ts` |
| `esiRegistration` | `lib/guides/pages/esi-registration.ts` |

Each file should have the export as default or named export matching whatever your existing convention is.

### Guides 7, 8, 9
**Source file:** Output file `guides-7-9.ts` (contains three named exports)

| Export name | Destination |
|---|---|
| `professionalTax` | `lib/guides/pages/professional-tax.ts` |
| `shopEstablishment` | `lib/guides/pages/shop-establishment.ts` |
| `msmeUdyam` | `lib/guides/pages/msme-udyam.ts` |

### Guides 10, 11, 12
**Source file:** Output file `guides-10-12.ts` (contains three named exports)

| Export name | Destination |
|---|---|
| `dpiitStartup` | `lib/guides/pages/dpiit-startup.ts` |
| `fssaiLicense` | `lib/guides/pages/fssai-license.ts` |
| `itrFormSelection` | `lib/guides/pages/itr-form-selection.ts` |

---

## SECTION 4: SWAP IN RANKED TOOL CONFIGS

**Source file:** Output file `ranked-tool-configs.ts`

This file contains updated `tool` configs for 5 guides that now score and rank instead of giving binary yes/no results. Replace only the `tool` field in each guide file.

| Export in ranked-tool-configs.ts | Replace `tool` field in |
|---|---|
| `pvtLtdVsLlpTool` | `lib/guides/pages/pvt-ltd-vs-llp.ts` |
| `trademarkTool` | `lib/guides/pages/trademark.ts` |
| `msmeTool` | `lib/guides/pages/msme-udyam.ts` |
| `dpiitTool` | `lib/guides/pages/dpiit-startup.ts` |
| `itrFormTool` | `lib/guides/pages/itr-form-selection.ts` |

Example for Guide 2:
```typescript
// In pvt-ltd-vs-llp.ts, replace:
tool: {
  type: 'comparison',
  title: 'Which Structure is Right for Your Business?',
  questions: [ ...old questions... ]
}

// With:
import { pvtLtdVsLlpTool } from '../types/ranked-tool-configs'
// then:
tool: pvtLtdVsLlpTool
```

---

## SECTION 5: ADD TABLES TO ALL 12 GUIDES

**Source file:** Output file `guide-tables.ts`

This file exports table data for all 12 guides. Add each table to the relevant section's `table` field.

### Guide 1 - GST Registration
```typescript
import { gstThresholdTable } from '../types/guide-tables'

// In gst-registration.ts, add table to section 01:
{
  number: '01',
  heading: 'THE SHORT ANSWER',
  body: 'GST registration becomes mandatory...',
  bullets: [...],
  table: gstThresholdTable,   // <-- add
  note: 'Source: ...'
}
```

### Guide 2 - Pvt Ltd vs LLP
```typescript
import { pvtLtdVsLlpTable } from '../types/guide-tables'

// Add table to section 04 (compliance costs):
table: pvtLtdVsLlpTable
```

### Guide 3 - ITR Filing
```typescript
import { itrThresholdTable, itrHighValueTable } from '../types/guide-tables'

// Add itrThresholdTable to section 01
// Add itrHighValueTable to section 02
```

### Guide 4 - Trademark
```typescript
import { trademarkCostTable, trademarkUrgencyTable } from '../types/guide-tables'

// Add trademarkCostTable to section 06 (cost section)
// Add trademarkUrgencyTable to section 02 (when urgent)
```

### Guide 5 - PF Registration
```typescript
import { pfContributionTable, pfThresholdTable } from '../types/guide-tables'

// Add pfContributionTable to section 03
// Add pfThresholdTable to section 01
```

### Guide 6 - ESI Registration
```typescript
import { esiContributionTable, esiBenefitsTable } from '../types/guide-tables'

// Add esiContributionTable to section 03
// Add esiBenefitsTable to section 04
```

### Guide 7 - Professional Tax
```typescript
import { professionalTaxTable } from '../types/guide-tables'

// Add to section 02 (states where PT applies)
table: professionalTaxTable
```

### Guide 8 - Shop and Establishment
```typescript
import { shopEstablishmentTable, shopEstablishmentUsesTable } from '../types/guide-tables'

// Add shopEstablishmentTable to section 01
// Add shopEstablishmentUsesTable to section 03
```

### Guide 9 - MSME
```typescript
import { msmeClassificationTable, msmeBenefitsTable } from '../types/guide-tables'

// Add msmeClassificationTable to section 02
// Add msmeBenefitsTable to section 03
```

### Guide 10 - DPIIT
```typescript
import { dpiitEligibilityTable, dpiitBenefitsTable } from '../types/guide-tables'

// Add dpiitEligibilityTable to section 02
// Add dpiitBenefitsTable to section 03
```

### Guide 11 - FSSAI
```typescript
import { fssaiTierTable, fssaiPlatformTable } from '../types/guide-tables'

// Add fssaiTierTable to section 01
// Add fssaiPlatformTable to section 02
```

### Guide 12 - ITR Form Selection
```typescript
import { itrFormTable, itrOneVsTwoTable } from '../types/guide-tables'

// Add itrFormTable to section 01
// Add itrOneVsTwoTable to section 02
```

---

## SECTION 6: SEO - ADD JSON-LD SCHEMAS

**File:** Guide page layout component (wherever `<head>` is rendered for guide pages)
**Action:** Add two JSON-LD script tags per guide page

### FAQ Schema (one per guide page)
```tsx
// Pull FAQs from the guide config and render as JSON-LD
const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: guide.faqs?.map(faq => ({
    '@type': 'Question',
    name: faq.q,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.a,
    },
  })),
}

// In <head>:
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
/>
```

### Article Schema (one per guide page)
```tsx
const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: guide.title,
  description: guide.seoDescription,
  dateModified: new Date().toISOString().split('T')[0],  // use guide.lastReviewed properly
  publisher: {
    '@type': 'Organization',
    name: 'Ollvy',
    url: 'https://www.ollvy.com',
  },
}

<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
/>
```

---

## SECTION 7: VERIFY EVERYTHING WORKS

Run these checks after implementation:

```bash
# Type check
npx tsc --noEmit

# Check no broken guide imports
grep -r "from.*guides/pages" --include="*.ts" --include="*.tsx" src/

# Check all 12 guide slugs are still resolving
# Visit each /guides/[slug] route in dev mode
```

Spot check these specific routes:
- `/guides/pvt-ltd-vs-llp` - should show ranked comparison tool with score bars
- `/guides/is-msme-registration-worth-it` - should show benefits ranked by relevance
- `/guides/which-itr-form-should-i-use` - should show form assignment with elimination table
- `/guides/do-i-need-gst-registration` - should show threshold table in section 01

---

## FILE MANIFEST (what you are giving Claude Code)

| Output File | Action | Destination |
|---|---|---|
| `gst-registration.ts` | Replace | `lib/guides/pages/gst-registration.ts` |
| `pvt-ltd-vs-llp.ts` | Replace | `lib/guides/pages/pvt-ltd-vs-llp.ts` |
| `itr-filing.ts` | Replace | `lib/guides/pages/itr-filing.ts` |
| `guides-4-6.ts` | Extract 3 exports | `trademark.ts`, `pf-registration.ts`, `esi-registration.ts` |
| `guides-7-9.ts` | Extract 3 exports | `professional-tax.ts`, `shop-establishment.ts`, `msme-udyam.ts` |
| `guides-10-12.ts` | Extract 3 exports | `dpiit-startup.ts`, `fssai-license.ts`, `itr-form-selection.ts` |
| `ranked-tool-configs.ts` | Merge tool fields into 5 guides | pvt-ltd-vs-llp, trademark, msme-udyam, dpiit-startup, itr-form-selection |
| `guide-tables.ts` | Import tables into all 12 guides | All guide files |
| `tool-ranking.ts` | Create new | `lib/guides/types/tool-ranking.ts` |
| `learn-section-table.ts` | Create new | `lib/guides/types/learn-section-table.ts` |
| `LearnToolRankedResult.tsx` | Create new | `components/learn/LearnToolRankedResult.tsx` |
| `LearnSectionTable.tsx` | Create new | `components/learn/LearnSectionTable.tsx` |

Plus schema changes (no new files):
- Add `table?: LearnSectionTable` to `LearnSection` interface
- Add `ranking?: ToolRanking` to `EligibilityResult` interface
- Add `<LearnSectionTable>` render in section component
- Add `<LearnToolRankedResult>` render in tool result component
- Add title case conversion on section heading render
- Add FAQ and Article JSON-LD schemas to guide page layout
