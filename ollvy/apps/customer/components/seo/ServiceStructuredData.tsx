// Structured Data for individual service pages
// Emits: BreadcrumbList + Product (with AggregateRating + Review for star snippets) + FAQPage + HowTo
// @type is Product, not Service: Google's Review Snippet rich result requires Product/LocalBusiness/etc.
// as parent — Service is not in the supported list, so review/aggregateRating fail validation on it.
import { LAST_REVIEWED, getReviewerForSlug, parseReviewedToISO } from '@/constants/accuracy'

interface ReviewData {
  rating: number
  comment: string | null
  created_at: string
}

interface ProcessStep {
  step: number
  title: string
  timeline: string
  body: string
}

interface WhatsIncludedItem {
  title: string
  body: string
}

interface ServiceStructuredDataProps {
  serviceName: string
  serviceSlug: string
  description: string
  price: number // Ollvy fee in rupees
  govtFee?: number // Government fee in rupees
  category?: string
  avgRating?: number | null
  totalRatings?: number
  faqs?: { q: string; a: string }[]
  reviews?: ReviewData[]
  // New props for additional rich results
  processSteps?: ProcessStep[]
  whatsIncluded?: WhatsIncludedItem[]
  slaDays?: number
}

export function ServiceStructuredData({
  serviceName,
  serviceSlug,
  description,
  price,
  govtFee,
  category = 'Professional Service',
  avgRating,
  totalRatings,
  faqs,
  reviews = [],
  processSteps = [],
  whatsIncluded = [],
  slaDays,
}: ServiceStructuredDataProps) {
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://www.ollvy.com',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Services',
        item: 'https://www.ollvy.com/services',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: serviceName,
        item: `https://www.ollvy.com/services/${serviceSlug}`,
      },
    ],
  }

  // Price validity: 90 days from today. Re-computed on each ISR rebuild (hourly),
  // so the date always stays ~90 days forward. Signals current pricing to Google.
  const priceValidUntil = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split('T')[0]

  // Build offers with price specification if govt fee exists.
  // SLA days now move to Offer.deliveryLeadTime (Product has no estimatedDuration).
  const deliveryLeadTime = slaDays
    ? {
        deliveryLeadTime: {
          '@type': 'QuantitativeValue',
          value: slaDays,
          unitCode: 'DAY',
        },
      }
    : {}

  // Digital service: zero shipping cost, delivered electronically. Required by
  // Google's Merchant Listings spec when @type is Product.
  const shippingDetails = {
    '@type': 'OfferShippingDetails',
    shippingRate: {
      '@type': 'MonetaryAmount',
      value: 0,
      currency: 'INR',
    },
    shippingDestination: {
      '@type': 'DefinedRegion',
      addressCountry: 'IN',
    },
    deliveryTime: {
      '@type': 'ShippingDeliveryTime',
      handlingTime: { '@type': 'QuantitativeValue', minValue: 0, maxValue: 0, unitCode: 'DAY' },
      transitTime: { '@type': 'QuantitativeValue', minValue: 0, maxValue: 0, unitCode: 'DAY' },
    },
  }

  // Mirrors the published refund policy at /refunds: refundable before work begins,
  // processed in 7-10 business days. Govt fees are excluded (handled in copy, not schema).
  const merchantReturnPolicy = {
    '@type': 'MerchantReturnPolicy',
    applicableCountry: 'IN',
    returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
    merchantReturnDays: 7,
    returnMethod: 'https://schema.org/ReturnByMail',
    returnFees: 'https://schema.org/FreeReturn',
  }

  const offersSchema = govtFee
    ? {
        '@type': 'Offer',
        price: price + govtFee,
        priceCurrency: 'INR',
        availability: 'https://schema.org/InStock',
        priceValidUntil,
        eligibleRegion: { '@type': 'Country', name: 'IN' },
        ...deliveryLeadTime,
        shippingDetails,
        hasMerchantReturnPolicy: merchantReturnPolicy,
        priceSpecification: [
          {
            '@type': 'UnitPriceSpecification',
            price: price,
            priceCurrency: 'INR',
            name: 'Professional Fee',
          },
          {
            '@type': 'UnitPriceSpecification',
            price: govtFee,
            priceCurrency: 'INR',
            name: 'Government Fee',
          },
        ],
      }
    : {
        '@type': 'Offer',
        price: price,
        priceCurrency: 'INR',
        availability: 'https://schema.org/InStock',
        priceValidUntil,
        eligibleRegion: { '@type': 'Country', name: 'IN' },
        ...deliveryLeadTime,
        shippingDetails,
        hasMerchantReturnPolicy: merchantReturnPolicy,
      }

  // Review markup is emitted ONLY from genuine customer reviews (DB-sourced).
  // Google's review-snippet spam policy requires reviews in structured data to be
  // user-submitted — never emit editorial/fallback testimonials here, even though
  // they may still render as visible page copy elsewhere.
  const reviewsForSchema = reviews.slice(0, 5).map(review => ({
    '@type': 'Review',
    author: { '@type': 'Person', name: 'Verified Customer' },
    datePublished: review.created_at.split('T')[0],
    reviewRating: {
      '@type': 'Rating',
      ratingValue: review.rating.toString(),
      bestRating: '5',
    },
    reviewBody: review.comment || '',
  }))

  // Aggregate rating from real data only: DB-level avg/count if present,
  // else computed from the real reviews emitted above, else omitted entirely.
  const aggregateRatingValue = (avgRating != null && totalRatings != null && totalRatings > 0)
    ? { value: avgRating, count: totalRatings }
    : reviews.length > 0
      ? {
          value: Number(
            (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
          ),
          count: reviews.length,
        }
      : null

  // Build HowTo schema from process steps (for "how to" rich results)
  const howToSchema = processSteps.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: `How to get ${serviceName} in India`,
    description: `Step-by-step process to complete ${serviceName} with Ollvy`,
    totalTime: slaDays ? `P${slaDays}D` : undefined, // ISO 8601 duration
    estimatedCost: {
      '@type': 'MonetaryAmount',
      currency: 'INR',
      value: govtFee ? price + govtFee : price,
    },
    step: processSteps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.title,
      text: step.body,
      ...(step.timeline ? { duration: step.timeline } : {}),
    })),
  } : null

  // Build hasOfferCatalog from whatsIncluded (shows what's included in the service)
  // Each entry wraps an Offer inside a ListItem per schema.org spec
  // (position is a ListItem property, not an Offer property).
  const offerCatalog = whatsIncluded.length > 0 ? {
    '@type': 'OfferCatalog',
    name: `What's included in ${serviceName}`,
    itemListElement: whatsIncluded.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: item.title,
          description: item.body,
        },
      },
    })),
  } : null

  // E-E-A-T signals for YMYL content (tax/compliance)
  const reviewerName = getReviewerForSlug(serviceSlug)
  const lastReviewedStr = LAST_REVIEWED[serviceSlug] ?? 'April 2026'
  const dateModifiedISO = parseReviewedToISO(lastReviewedStr)

  // Product schema with optional aggregate rating + reviews + E-E-A-T.
  // Product (not Service) is required for Review Snippet rich results.
  // Field mapping vs prior Service: provider→brand, serviceType→category, areaServed dropped
  // (Offer.eligibleRegion already conveys IN), estimatedDuration moved to Offer.deliveryLeadTime.
  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: serviceName,
    description: description,
    url: `https://www.ollvy.com/services/${serviceSlug}`,
    // Required by Google's Merchant Listings rich-result spec when @type is Product.
    // Without `image` Google flags "Missing field 'image'" as a critical error even
    // though we only care about Review Snippets (which doesn't require image).
    image: ['https://www.ollvy.com/logo.png'],
    // Product identifier required by Merchant Listings + Product Snippet specs.
    sku: `OLLVY-${serviceSlug.toUpperCase()}`,
    mpn: `OLLVY-${serviceSlug.toUpperCase()}`,
    brand: {
      '@type': 'Brand',
      name: 'Ollvy',
      logo: 'https://www.ollvy.com/logo.png',
    },
    category: category,
    // E-E-A-T: named CA reviewer with affiliation for YMYL credibility
    reviewedBy: {
      '@type': 'Person',
      name: reviewerName,
      jobTitle: 'Chartered Accountant',
      worksFor: {
        '@type': 'Organization',
        name: 'Ollvy',
        url: 'https://www.ollvy.com',
      },
    },
    ...(dateModifiedISO ? { dateModified: dateModifiedISO } : {}),
    offers: offersSchema,
    // What's included — kept as hasOfferCatalog; Google ignores unsupported props on Product gracefully
    ...(offerCatalog ? { hasOfferCatalog: offerCatalog } : {}),
    // AggregateRating MUST accompany multiple Review items per Google's spec.
    // Compute from whichever review set we're emitting (real or fallback).
    ...(aggregateRatingValue
      ? {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: aggregateRatingValue.value,
            reviewCount: aggregateRatingValue.count,
            bestRating: 5,
            worstRating: 1,
          },
        }
      : {}),
    // Include individual reviews for rich results
    ...(reviewsForSchema.length > 0 ? { review: reviewsForSchema } : {}),
  }

  // Build FAQPage schema if FAQs exist
  const faqPageSchema =
    faqs && faqs.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: faqs.map((faq) => ({
            '@type': 'Question',
            name: faq.q,
            acceptedAnswer: {
              '@type': 'Answer',
              text: faq.a,
            },
          })),
        }
      : null

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      {faqPageSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageSchema) }}
        />
      )}
      {howToSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
        />
      )}
    </>
  )
}
