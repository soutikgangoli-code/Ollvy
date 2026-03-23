# Ollvy SEO Fix Instructions

Audit date: March 21, 2026. Score: 6/10. Fix all issues below in priority order.
Do not use em dashes anywhere in code or copy. Do not create new pages unless explicitly instructed below.
Stack: Next.js 14 App Router. All metadata must use the `generateMetadata` or `metadata` export pattern.

---

## P0: Fix Canonical URLs (5 pages affected)

Every page listed below is currently outputting `https://ollvy.com` as its canonical URL.
That tells Google all these pages are duplicates of the homepage, which will destroy rankings.

Fix each page by adding the correct `alternates.canonical` to its metadata export.

### Pages to fix and their correct canonical URLs

| Page file | Correct canonical |
|---|---|
| `app/services/page.tsx` | `https://ollvy.com/services` |
| `app/tools/page.tsx` | `https://ollvy.com/tools` |
| `app/tools/documents/[slug]/page.tsx` | `https://ollvy.com/tools/documents/${params.slug}` |
| `app/tools/penalty-calculator/[slug]/page.tsx` | `https://ollvy.com/tools/penalty-calculator/${params.slug}` |

### Pattern to use for static pages

```ts
export const metadata: Metadata = {
  alternates: {
    canonical: 'https://ollvy.com/services',
  },
  // ... rest of metadata
}
```

### Pattern for dynamic routes

```ts
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return {
    alternates: {
      canonical: `https://ollvy.com/tools/documents/${params.slug}`,
    },
    // ... rest of metadata
  }
}
```

---

## P0: Fix /services Page Metadata

Root cause: `app/services/page.tsx` is a `'use client'` component with no metadata export.
Next.js cannot export metadata from client components. Fix this with a layout wrapper.

### Steps

1. Create `app/services/layout.tsx`:

```tsx
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Business Compliance Services in India | Ollvy',
  description: 'GST registration, company incorporation, trademark filing and more. Fixed-price compliance packages handled by vetted CAs and lawyers. Starting at 999.',
  alternates: {
    canonical: 'https://ollvy.com/services',
  },
  openGraph: {
    title: 'Business Compliance Services | Ollvy',
    description: 'Fixed-price compliance services for Indian SMEs. Vetted CAs and lawyers.',
    url: 'https://ollvy.com/services',
    images: [{ url: 'https://ollvy.com/og-home.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Business Compliance Services | Ollvy',
    description: 'Fixed-price compliance services for Indian SMEs. Vetted CAs and lawyers.',
    images: ['https://ollvy.com/og-home.png'],
  },
}

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
```

2. Keep `app/services/page.tsx` as `'use client'` unchanged. The layout handles metadata.

3. Also add a JSON-LD block to the `/services` page component itself. The listing page is missing structured data entirely. Add this inside the `app/services/page.tsx` JSX return:

```tsx
const servicesJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Business Compliance Services',
  description: 'Fixed-price compliance packages for Indian SMEs',
  url: 'https://ollvy.com/services',
  numberOfItems: services.length, // use your actual services array length
  itemListElement: services.map((service, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: service.title,
    url: `https://ollvy.com/services/${service.slug}`,
  })),
}

// In JSX:
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify(servicesJsonLd) }}
/>
```

---

## P0: Expand Sitemap

Current sitemap has 13 URLs. 50+ pages are missing. Google cannot discover them.

Replace or rewrite `app/sitemap.ts` to dynamically include all public routes.

```ts
import { MetadataRoute } from 'next'

// Replace these with your actual data sources
import { getAllServiceSlugs } from '@/lib/services'
import { getAllLearnSlugs } from '@/lib/learn'
import { DOCUMENT_CHECKLIST_SLUGS, PENALTY_CALCULATOR_SLUGS, PACK_SLUGS, GEO_SLUGS } from '@/lib/tools'

const BASE_URL = 'https://ollvy.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const serviceSlugs = await getAllServiceSlugs()
  const learnSlugs = await getAllLearnSlugs()

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/services`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/tools`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/learn`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/terms`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ]

  const serviceRoutes: MetadataRoute.Sitemap = serviceSlugs.map((slug) => ({
    url: `${BASE_URL}/services/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.85,
  }))

  const documentRoutes: MetadataRoute.Sitemap = DOCUMENT_CHECKLIST_SLUGS.map((slug) => ({
    url: `${BASE_URL}/tools/documents/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  const penaltyRoutes: MetadataRoute.Sitemap = PENALTY_CALCULATOR_SLUGS.map((slug) => ({
    url: `${BASE_URL}/tools/penalty-calculator/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  const learnRoutes: MetadataRoute.Sitemap = learnSlugs.map((slug) => ({
    url: `${BASE_URL}/learn/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.75,
  }))

  // Include /packs/* if these routes exist publicly
  // If PACK_SLUGS is empty or packs are not public, pass an empty array
  const packRoutes: MetadataRoute.Sitemap = PACK_SLUGS.map((slug) => ({
    url: `${BASE_URL}/packs/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.75,
  }))

  // Include geo pages if they are publicly accessible (not behind auth)
  // If GEO_SLUGS is empty or geo pages are not public, pass an empty array
  const geoRoutes: MetadataRoute.Sitemap = GEO_SLUGS.map((slug) => ({
    url: `${BASE_URL}/in/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.65,
  }))

  return [
    ...staticRoutes,
    ...serviceRoutes,
    ...documentRoutes,
    ...penaltyRoutes,
    ...learnRoutes,
    ...packRoutes,
    ...geoRoutes,
  ]
}
```

If PACK_SLUGS, GEO_SLUGS, or other slug arrays do not exist yet as exports, hardcode them as empty arrays `[]` or populate them from your known routes. Do not import from a path that does not exist.

---

## P1: Fix Document Checklist Page Metadata

The audit shows `/tools/documents/[slug]` already has good title and description, but both `canonical` and `og:url` point to `https://ollvy.com` instead of the actual page URL. These are two separate fields and both must be fixed.

In `app/tools/documents/[slug]/page.tsx`, add or update `generateMetadata`:

```ts
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // fetch or derive the checklist data for this slug
  return {
    // title and description already exist, keep them
    alternates: {
      canonical: `https://ollvy.com/tools/documents/${params.slug}`,
    },
    openGraph: {
      url: `https://ollvy.com/tools/documents/${params.slug}`,
      images: [{ url: 'https://ollvy.com/og-home.png', width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      images: ['https://ollvy.com/og-home.png'],
    },
  }
}
```

Do not overwrite the existing title and description. Only add the missing fields shown above.

---

## P1: Add Metadata to Penalty Calculator Pages

These pages currently fall back to homepage title and description.

In `app/tools/penalty-calculator/[slug]/page.tsx`, add a `generateMetadata` export:

```ts
const CALCULATOR_META: Record<string, { title: string; description: string }> = {
  'gst-late-filing': {
    title: 'GST Late Filing Penalty Calculator | Ollvy',
    description: 'Calculate penalties and interest for late GST return filing. Enter your turnover and delayed months to get an instant estimate.',
  },
  // add remaining slugs
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const meta = CALCULATOR_META[params.slug]
  return {
    title: meta?.title ?? 'Penalty Calculator | Ollvy',
    description: meta?.description ?? 'Calculate compliance penalties for Indian businesses.',
    alternates: {
      canonical: `https://ollvy.com/tools/penalty-calculator/${params.slug}`,
    },
    openGraph: {
      url: `https://ollvy.com/tools/penalty-calculator/${params.slug}`,
      title: meta?.title,
      description: meta?.description,
      images: [{ url: 'https://ollvy.com/og-home.png', width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: meta?.title,
      description: meta?.description,
      images: ['https://ollvy.com/og-home.png'],
    },
  }
}
```

---

## P1: Fix Multiple H1 Tags

Two pages have more than one H1. Fix them so exactly one H1 exists per page.

### /services/pvt-ltd-incorporation

Find the second `<h1>` in `app/services/[slug]/page.tsx` or the pvt-ltd-specific component.
Demote it to `<h2>`. The page title heading must be the only H1.

This page also has a missing `og:image`. Confirm the `generateMetadata` for this slug includes the `openGraph.images` field. It should be covered by the global service page fix in the P2 section below, but double-check this specific slug since it has multiple issues compounding.

### /tools/penalty-calculator/[slug]

The page renders both a layout-level H1 ("Penalty Calculator") and a content-level H1 ("You run your business...").
Keep only one. The layout-level "Penalty Calculator" heading should be the H1.
Change the content-level one to a `<p>` with appropriate styling or a `<h2>`.

---

## P1: Add Service JSON-LD Schema to All /services/* Pages

Every service detail page is missing structured data. This means no rich snippets in Google.

In `app/services/[slug]/page.tsx`, add a JSON-LD script block inside the component:

```tsx
const serviceJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: service.title,
  description: service.description,
  provider: {
    '@type': 'Organization',
    name: 'Ollvy',
    url: 'https://ollvy.com',
  },
  areaServed: {
    '@type': 'Country',
    name: 'India',
  },
  offers: {
    '@type': 'Offer',
    price: service.price,
    priceCurrency: 'INR',
    availability: 'https://schema.org/InStock',
  },
}

// Inside your JSX return:
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
/>
```

Place this script tag inside the page-level component, not in the metadata export.

---

## P2: Add og:image and Twitter Cards to Service Pages

All `/services/*` pages are missing `og:image` and Twitter card tags, so social shares show a blank card.
The audit also flags the `/tools` index page og:image as falling back to homepage.

### Service pages

Two options, pick one:

**Option A (quick):** Use the homepage OG image as a fallback for all service pages.

In `generateMetadata` for service pages:

```ts
openGraph: {
  images: [{ url: 'https://ollvy.com/og-home.png', width: 1200, height: 630 }],
},
twitter: {
  card: 'summary_large_image',
  images: ['https://ollvy.com/og-home.png'],
},
```

**Option B (better, do this later):** Generate service-specific OG images using Next.js `ImageResponse` in `app/services/[slug]/opengraph-image.tsx`. Defer this to a separate task if it takes more than 30 minutes.

### /tools index page

In `app/tools/page.tsx`, the metadata export is missing `og:image` and Twitter cards. Add:

```ts
export const metadata: Metadata = {
  title: 'Free Business Tools - Ollvy',
  // ... existing fields
  alternates: {
    canonical: 'https://ollvy.com/tools',
  },
  openGraph: {
    url: 'https://ollvy.com/tools',
    images: [{ url: 'https://ollvy.com/og-home.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['https://ollvy.com/og-home.png'],
  },
}
```

---

## P2: Add JSON-LD to Tools Pages

### /tools (index)

Add a `WebPage` + `ItemList` schema listing the available tool categories.

### /tools/documents/[slug]

Add a `HowTo` schema. The document checklist is a step-by-step guide, which maps cleanly to `HowTo` with `HowToStep` items.

### /tools/penalty-calculator/[slug]

The existing `BreadcrumbList` is fine. Add a `FAQPage` schema with common penalty questions for the specific calculator type.

---

## P2: Resolve Missing Footer-Linked Pages

The audit flags `/about`, `/privacy`, and `/terms` as missing, but the footer contains links to them.
Broken footer links hurt crawlability and user trust.

### Check what exists first

Before creating anything, check if these files exist:
- `app/about/page.tsx`
- `app/privacy/page.tsx`
- `app/terms/page.tsx`

### If the pages do not exist, pick one of two paths:

**Option A (quick):** Remove the footer links pointing to missing pages. Find the footer component (likely `components/Footer.tsx` or similar) and comment out or delete any `<Link>` or `<a>` tags pointing to `/about`, `/privacy`, or `/terms` that do not have a corresponding page file.

**Option B (correct):** Create minimal placeholder pages for `/privacy` and `/terms`. These are legally advisable to have live anyway. Use this pattern:

`app/privacy/page.tsx`:
```tsx
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy | Ollvy',
  alternates: { canonical: 'https://ollvy.com/privacy' },
}

export default function PrivacyPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-16">
      <h1>Privacy Policy</h1>
      <p>Last updated: March 2026</p>
      {/* Add policy content here */}
    </main>
  )
}
```

Do the same for `/terms`. For `/about`, either create it or remove the footer link. Do not leave a footer link pointing to a 404.

Also remove `/privacy` and `/terms` from the sitemap expansion code above if the pages do not yet exist, to avoid submitting dead URLs to Google.

---

## Verification Checklist

After making all changes, verify:

- [ ] `curl -s https://ollvy.com/services | grep -i canonical` returns `/services` not `/`
- [ ] `curl -s https://ollvy.com/tools | grep -i canonical` returns `/tools` not `/`
- [ ] `curl -s https://ollvy.com/tools/documents/private-limited-company | grep -i "og:url"` returns correct URL not `/`
- [ ] `curl -s https://ollvy.com/learn | grep -i canonical` -- the audit did not test this page's canonical. Verify it is set correctly and not falling back to homepage.
- [ ] `https://ollvy.com/sitemap.xml` has more than 13 entries and includes /tools/*, /learn/*, /packs/* (if applicable), and geo pages (if public)
- [ ] `/services/pvt-ltd-incorporation` has exactly one `<h1>` in page source
- [ ] `/services/pvt-ltd-incorporation` page source contains `og:image`
- [ ] `/tools/penalty-calculator/gst-late-filing` has a unique title tag (not homepage fallback)
- [ ] `/tools/penalty-calculator/gst-late-filing` page source contains `twitter:card`
- [ ] `/tools` page source contains correct `og:url` pointing to `/tools` not `/`
- [ ] Service pages have a `application/ld+json` script in page source
- [ ] `/services` page source contains `application/ld+json` with `ItemList` type
- [ ] All footer links resolve with 200, not 404: `curl -o /dev/null -s -w "%{http_code}" https://ollvy.com/privacy`
- [ ] Run `https://search.google.com/test/rich-results` on one service page to confirm schema is valid

---

## Do Not Touch

- `robots.txt` is correctly configured. No changes needed.
- `/` homepage is fully optimized. No changes needed.
- `/learn` page is passing. No changes needed.
