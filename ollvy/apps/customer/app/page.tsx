import { Metadata } from 'next'
import { NavbarServer } from '@/components/landing/NavbarServer'
import { Hero } from '@/components/landing/Hero'
import { SocialProofBar } from '@/components/landing/SocialProofBar'
import { FearRelief } from '@/components/landing/FearRelief'
import { SingleTestimonial } from '@/components/landing/SingleTestimonial'
import { ServicesSimplified } from '@/components/landing/ServicesSimplified'
import { FinalCTA } from '@/components/landing/FinalCTA'
import { Footer } from '@/components/landing/Footer'
import { MobileBottomCTA } from '@/components/landing/MobileBottomCTA'
import { getPopularServices, getFAQServicePrices, FAQServicePrices } from '@/lib/data/services'
// Direct imports for SEO crawlability - dynamic imports hide content from Google
import { ProductShowcase } from '@/components/landing/ProductShowcase'
import { HomeFAQ } from '@/components/landing/HomeFAQ'

/**
 * Homepage - Mercury-Inspired Redesign
 *
 * Structure (8 sections):
 * 1. Hero - Bold claim + 98% stat + dashboard screenshot
 * 2. Social Proof Bar - Founder avatars + 4.8 rating
 * 3. Fear -> Relief - Penalty costs vs Ollvy peace
 * 4. Product Showcase - 4 dashboard screenshots
 * 5. Single Testimonial - One founder story with numbers
 * 6. Services - 6 cards + "View all" link
 * 7. FAQ - Top 5 questions + link to full /faq page
 * 8. Final CTA - Strong close
 *
 * Removed: HowItWorks, TrustLayer carousel, Reviews carousel
 */

// Homepage metadata for SEO
export const metadata: Metadata = {
  title: 'Company Registration, GST & Compliance Services India | Ollvy',
  description: 'Register your Pvt Ltd, LLP, get GST, trademark, FSSAI with verified CAs. 98% on-time delivery. Track everything in one dashboard.',
  alternates: {
    canonical: 'https://www.ollvy.com',
  },
  openGraph: {
    title: 'Company Registration, GST & Compliance Services | Ollvy',
    description: 'Register your business with verified CAs. 98% on-time delivery.',
    url: 'https://www.ollvy.com',
    images: [{ url: 'https://www.ollvy.com/logo.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Company Registration & Compliance Services | Ollvy',
    description: 'Register your business with verified CAs. 98% on-time delivery.',
  },
}

// Per §23: ISR - revalidate: 3600 (rebuilds hourly)
export const revalidate = 3600

/**
 * Generate FAQ schema with live prices from database
 * This ensures Google sees current prices in FAQ rich results
 */
function generateFAQSchema(prices: FAQServicePrices) {
  const faqs = [
    {
      question: 'What is the difference between an LLP and a Private Limited Company in India?',
      answer: `Both LLP (Limited Liability Partnership) and Private Limited Company are popular legal structures for Indian businesses, but they serve different needs. Here is the complete breakdown to help you choose.

Liability protection: Both structures offer limited liability - your personal assets are protected if the business faces losses or legal claims. This is the primary reason founders choose either structure over a sole proprietorship or traditional partnership.

Compliance burden: An LLP has far lower annual compliance requirements - no mandatory board meetings, no statutory registers, and simpler annual filings (just Form 11 and Form 8 with MCA). A Private Limited Company must hold at minimum 4 board meetings per year, maintain detailed statutory registers, file multiple forms with the Registrar of Companies, and get accounts audited regardless of turnover.

Taxation: Both are taxed at 30% flat on profits plus surcharges. However, a Private Limited Company can offer ESOPs (Employee Stock Option Plans) to employees - not possible with an LLP - making Pvt Ltd the preferred choice for startups planning to hire and retain talent through equity.

Investment and funding: If you plan to raise funding from angel investors or venture capital, Private Limited is the only viable option. LLPs cannot issue equity shares, cannot have foreign investors under the automatic FDI route for most sectors, and are generally not fundable by institutional investors.

Cost comparison: LLP registration costs less upfront and costs less annually due to simpler compliance. For a two-partner services business with no plans to raise external funding, an LLP saves Rs 20,000-50,000 per year in compliance costs compared to a Pvt Ltd.

Our recommendation: Choose LLP if you are a services business (consulting, law, design, accounting), have 2-5 partners, and are not planning to raise external funding in the near term. Choose Private Limited if you are building a product, plan to raise funding, want to issue ESOPs, or are in a sector where Pvt Ltd is the industry standard.

Ollvy handles registration for both structures. LLP Incorporation is completed in 10-12 working days at ${prices.llp} plus government fees. Private Limited Incorporation is completed in 12-15 working days at ${prices.pvtLtd} plus government fees.`,
    },
    {
      question: 'How long does company registration take in India?',
      answer: `Company registration timelines in India have improved significantly since MCA21 Version 3.0 launched in 2022. Here are the realistic timelines for each structure, assuming all documents are in order and there are no queries from the Registrar.

Private Limited Company: Typical timeline is 12-15 working days, with the fastest cases completing in 7-8 working days. Common causes of delay include name rejection through RUN, DSC delays, and document issues.

LLP (Limited Liability Partnership): Typical timeline is 10-12 working days, with the fastest cases completing in 6-7 working days. Delays usually occur due to name rejection or partner DSC delays.

OPC (One Person Company): Typical timeline is 10-12 working days, with the fastest cases completing in 6-7 working days. Nominee consent issues can cause delays.

GST Registration: Typical timeline is 5-7 working days, with the fastest cases completing in 3-4 working days. Officer queries and address proof issues are common causes of delay.

Trademark Registration: Filing takes 1-2 days, but the complete registration certificate takes 12-18 months. The examination process timeline is fixed by the government.

FSSAI License (State): Typical timeline is 30-45 working days, with the fastest cases completing in 20 working days. Timeline depends on state authority processing time.

The most common cause of delays across all registrations is document issues - blurry scans, mismatched names between PAN and Aadhaar, address proof older than 2 months, or office address documents that do not match the registration address. Our CA reviews all documents before submission and flags any issues upfront, which is why Ollvy orders consistently complete within the stated timelines.

One important note: the working days timeline starts from the date all documents are approved by our CA, not from the date of payment. We recommend having all documents ready before booking to avoid any delays.`,
    },
    {
      question: 'What documents are required for LLP registration in India?',
      answer: `LLP registration requires documents from two categories: each designated partner, and the registered office. Here is the complete checklist.

For each designated partner (required for all partners):

PAN Card - self-attested copy. The name on PAN must exactly match the name on Aadhaar. Even a minor mismatch (e.g. middle name included on one but not the other) will cause a rejection.

Aadhaar Card - both front and back. Can be submitted as a single PDF or two separate images. The address on Aadhaar does not need to match the office address.

Passport-size photograph - recent (within 6 months), white background, no spectacles. JPG or PNG, minimum 200x200 pixels.

Address proof - any one of: bank statement (last 3 months), electricity or telephone bill (last 2 months), driving licence, or passport. Must clearly show the partner's current residential address.

For the registered office:

Rent agreement - if the office is rented. Must be signed by both owner and tenant and show the complete address matching the registration address.

No Objection Certificate (NOC) from the property owner - even if a partner owns the property, an NOC is required. Ollvy provides a standard template.

Utility bill for the office - electricity or telephone bill, not older than 2 months, showing the office address.

Important notes to keep in mind:

A residential address is completely valid as a registered office address for an LLP. Many founders use their home address, especially at early stage.

If a partner is a foreign national, additional documents are required: notarised and apostilled copy of passport, foreign address proof, and a valid Indian visa.

Digital Signature Certificates (DSC) for all partners are arranged by our CA as part of the service. You do not need to organise these separately.

Once you place your order on Ollvy, our document upload system walks you through exactly what is needed for each partner, with specific format requirements and quality guidelines for each document. Our CA reviews every document before submission.`,
    },
    {
      question: 'How much does company registration cost in India?',
      answer: `The total cost of company registration in India has two components: professional fees (what you pay a CA or service provider) and government fees (paid directly to MCA). Here is a full breakdown.

LLP Incorporation: Ollvy fee is ${prices.llp}. Government fees are approximately Rs 500-800. Total cost is around Rs 8,800. This includes DSC, name reservation, LLP agreement, Form 2 filing, Certificate of Incorporation, and compliance calendar.

Private Limited Company: Ollvy fee is ${prices.pvtLtd}. Government fees are approximately Rs 3,000-6,000. Total cost is around Rs 14,000. This includes DSC for 2 directors, SPICe+ filing, PAN, TAN, Certificate of Incorporation, MOA/AOA, and compliance calendar.

OPC Incorporation: Ollvy fee is ${prices.opc}. Government fees are approximately Rs 1,500-3,000. Total cost is around Rs 11,000. This includes single director DSC, SPICe+ filing, Certificate of Incorporation, PAN, and TAN.

GST Registration: Ollvy fee is ${prices.gst}. Government fees are Rs 0. Total cost is ${prices.gst}. This includes portal application, document preparation, officer query handling, and GSTIN delivery.

Trademark Registration: Ollvy fee is ${prices.trademark}. Government fees are approximately Rs 4,500-9,000. Total cost is around Rs 14,000. This includes conflict search, class identification, TM-A filing, examination tracking, and certificate.

Why do government fees vary? For Private Limited Companies, government fees are based on authorised share capital - the higher the authorised capital, the higher the stamp duty and filing fees. Most early-stage companies register with Rs 1 lakh authorised capital, which brings government fees to the lower end of the range.

What is not included: GST at 18% on professional fees. GST on ${prices.llp} equals Rs 1,440, bringing the LLP total professional fee to Rs 9,439. Government fees are GST-exempt.

How Ollvy compares: IndiaFilings charges Rs 9,999-14,999 for LLP registration. Vakilsearch charges Rs 11,999-18,999. Ollvy prices are lower because we operate with lower overhead - no branch offices, no sales teams - and pass the savings to you without compromising on quality. Every order is handled by a vetted, experienced CA.`,
    },
    {
      question: 'Can I register a company using my home address in India?',
      answer: `Yes. Using a residential address as the registered office of a company or LLP is completely legal in India, and is one of the most common approaches taken by early-stage founders. There is no requirement to have a commercial office to register a company.

What you need for home address registration:

NOC from the property owner - if you are renting, your landlord must provide a No Objection Certificate. If you own the property, you provide a self-declaration. Ollvy provides standard templates for both. Your landlord does not need to be physically present or sign any MCA forms - the NOC is a simple one-page document.

Utility bill - an electricity or telephone bill for the home address, not older than 2 months, showing the address clearly.

Important consideration about rental agreements: Some rental agreements have clauses prohibiting commercial use of the premises. Using your home as a registered office technically counts as commercial use. In practice, this is almost never enforced for registered office purposes (as opposed to actually running a business from the address), but it is worth being aware of if your landlord is particular about the terms of your lease.

Can you change the registered office later? Yes. Once your business grows and you move to a commercial space, you can update the registered office address. For a change within the same city, the process is straightforward (Form INC-22 for companies, Form 15 for LLPs). For a change across cities or states, additional approvals are needed. Ollvy handles registered office changes as a separate service.

GST registration note: While a home address is fine for company registration, GST registration for certain business types may require a commercial address or GST-specific address proof. Our CA will flag this if relevant for your business type when you place your order.`,
    },
    {
      question: 'What is GST registration and does my business need it?',
      answer: `GST (Goods and Services Tax) registration gives your business a GSTIN - a 15-digit unique identification number - and allows you to collect GST from customers, claim input tax credit on purchases, and trade across state lines without restrictions.

When is GST registration mandatory?

Your annual turnover exceeds Rs 40 lakhs (for goods) or Rs 20 lakhs (for services). For special category states (Northeast India, Himachal Pradesh, Uttarakhand, Jammu and Kashmir), the threshold is lower.

You sell goods or services across state lines - regardless of turnover. Interstate supply triggers mandatory registration.

You sell on e-commerce platforms (Amazon, Flipkart, Meesho, etc.) - mandatory regardless of turnover.

You receive payment via reverse charge mechanism.

When should you register voluntarily (even if below threshold)?

You want to claim input tax credit on business purchases - if you are buying equipment, software, or services for your business, GST registration lets you offset that GST against your output liability.

Your clients are GST-registered businesses - they prefer vendors who can provide GST invoices, as it allows them to claim input tax credit. Without a GSTIN, you may lose B2B contracts.

You are building credibility - a GSTIN on your invoice signals that you are a legitimate, registered business.

How long does GST registration take? Typically 5-7 working days from the date of application, assuming no officer queries. If a query is raised, it can extend to 10-15 working days. Our CA handles all officer queries as part of the GST Registration service.

Penalty for not registering when mandatory: 10% of the tax due (minimum Rs 10,000), or 100% of the tax due if non-registration is deemed fraudulent. This makes it critical to register on time once you cross the threshold or meet any mandatory trigger.`,
    },
    {
      question: 'What is Director KYC and what happens if I miss the deadline?',
      answer: `Director KYC is a mandatory annual compliance requirement for all individuals who hold a Director Identification Number (DIN) in India - regardless of whether the company is active or not. It is filed using Form DIR-3 KYC on the MCA portal.

Who must file Director KYC?

Every person who has been allotted a DIN, even if they have resigned as a director from all companies.

Directors of active Private Limited Companies, OPCs, and Section 8 companies.

Designated partners of LLPs (they receive a DPIN, which is equivalent to a DIN for this purpose).

What is the deadline? The annual deadline is 30 September each year (for the financial year ending 31 March). If you miss this date, your DIN is marked as "Deactivated due to non-filing of DIR-3 KYC."

What happens if you miss the deadline?

Your DIN is immediately deactivated. You cannot sign any board resolutions, company filings, or legal documents as a director until it is reactivated.

The company cannot file any MCA forms that require a director's DIN - including annual returns and financial statements - until the DIN is reactivated.

Penalty: Rs 5,000 per director for late filing. This fee is paid to MCA and is non-negotiable - there is no way to waive it.

Reactivation process: File DIR-3 KYC with the Rs 5,000 penalty fee. MCA typically reactivates the DIN within 1-2 working days after payment and filing.

How Ollvy helps: Ollvy sends automated compliance reminders 30 days, 7 days, and 1 day before the Director KYC deadline to all users who have a company on our platform. Filing is available as a standalone service at ${prices.directorKyc} per director. This proactive reminder system helps you avoid the Rs 5,000 penalty and the disruption of a deactivated DIN.`,
    },
    {
      question: 'How does trademark registration work in India, and how long does it take?',
      answer: `Trademark registration in India gives you the exclusive legal right to use your brand name, logo, or tagline in connection with the goods or services you register it for. Here is how the process works, from start to finish.

Step 1 - Trademark search (1-2 days): Before filing, our lawyer runs a search on the Trademark Registry database (IP India) to check for identical or similar existing trademarks. If there is a conflict, we advise you before filing - saving you the government fees and a potential rejection.

Step 2 - Class selection: Trademarks are registered under specific classes from the Nice Classification system (45 classes total - 34 for goods, 11 for services). You are only protected in the class(es) you register. A clothing brand registers under Class 25. A restaurant registers under Class 43. A software product might register under Classes 9 and 42. Registering in the wrong class provides no protection.

Step 3 - TM-A filing (1 day): The application is filed on the IP India portal. Once filed, you receive an application number and can legally use the TM symbol next to your brand name immediately - even before the trademark is registered.

Step 4 - Examination (3-6 months): A government examiner reviews the application. They may accept it directly or raise an examination report with objections. If an examination report is raised, your lawyer files a response within 30 days. This is included in the Ollvy trademark service.

Step 5 - Journal publication (4 months): If accepted, the trademark is published in the Trademark Journal. During this period, any third party can oppose the registration. Oppositions are relatively rare for new, original brands.

Step 6 - Registration certificate: If there is no opposition, the registration certificate is issued. You can now use the registered trademark symbol. The certificate is backdated to the original filing date, giving you protection from day one.

Total timeline is 12-18 months from filing to certificate. Government fees are Rs 4,500 per class for individuals, startups, and small enterprises, or Rs 9,000 per class for companies and LLPs. Ollvy's professional fee is ${prices.trademark} and covers one class, the conflict search, TM-A filing, and examination response if needed.`,
    },
    {
      question: 'What is the difference between an FSSAI registration and an FSSAI licence?',
      answer: `FSSAI compliance comes in three tiers depending on the size and nature of your food business. Choosing the wrong tier is one of the most common mistakes food entrepreneurs make.

Basic Registration: This is for petty food businesses, home bakers, street vendors, and small dhabas with annual turnover below Rs 12 lakhs. Validity is 1-5 years. Ollvy fee is ${prices.fssaiBasic}.

State Licence: This is for restaurants, bakeries, mid-size food manufacturers, and caterers with annual turnover between Rs 12 lakhs and Rs 20 crores. Validity is 1-5 years. Ollvy fee is ${prices.fssaiState}.

Central Licence: This is for large manufacturers, food importers and exporters, chains with 21 or more outlets, milk and meat processing units, or any business with turnover above Rs 20 crores. Also required for multi-state operations. Validity is 1-5 years. Ollvy fee is ${prices.fssaiCentral}.

Key rule for multi-state operations: If you operate from multiple states, you need a separate FSSAI registration or licence for each state of operation - OR a Central Licence that covers all states. A restaurant chain with outlets in Delhi, Mumbai, and Bangalore needs either 3 state licences or 1 central licence.

What happens if you operate without an FSSAI licence? Penalties range from Rs 1 lakh to Rs 10 lakhs depending on the nature of the violation. This can severely impact your business finances. Additionally, Zomato, Swiggy, and other food aggregators require a valid FSSAI number to list your restaurant on their platforms. Without FSSAI, you cannot be listed on these major platforms.

Renewal requirement: FSSAI licences must be renewed before expiry. Operating with an expired licence attracts the same penalties as operating without one. Ollvy sends renewal reminders 60 days before expiry for all FSSAI clients on the platform, ensuring you never miss a renewal deadline.`,
    },
    {
      question: 'Why should I use Ollvy instead of hiring a CA directly or using IndiaFilings or Vakilsearch?',
      answer: `This is a fair question and worth answering directly. Here is an honest comparison.

Ollvy vs. hiring a local CA directly:

A local CA relationship has real advantages - they know your business over time, can give holistic advice, and are accessible by phone. The downsides: pricing is opaque (you often do not know what you are paying until the invoice arrives), timelines are unclear, deliverables are not guaranteed in writing, and if something goes wrong, your only recourse is an uncomfortable conversation.

Ollvy gives you the same quality of CA (we vet all professionals on the platform) with fixed, transparent pricing, clear timelines, documented deliverables, and in-app tracking of every stage of your order. You also get a structured document vault - everything delivered to you is stored and accessible, not buried in a WhatsApp chat.

Ollvy vs. IndiaFilings, Vakilsearch, LegalZoom India:

These platforms pioneered the online compliance space in India and have strong brand recognition. Their model is primarily lead generation - they collect your enquiry, hand it to a CA or in-house team, and manage it loosely. The experience is often inconsistent: great if you get a good CA, frustrating if you do not.

The specific gaps we built Ollvy to address:

Document collection happens on WhatsApp on those platforms. Ollvy has a structured in-app upload flow with per-document status, CA review, and rejection handling - all in one place.

Status updates are email-based or require you to call. Ollvy has real-time stage tracking in the app.

Pricing includes upsells and add-ons that make the final price unclear. Ollvy charges a fixed price with no hidden add-ons.

Compliance calendar is an afterthought. Ollvy proactively surfaces upcoming compliance deadlines as a core feature - not a newsletter.

The honest answer: if you want the cheapest possible registration and are comfortable managing the process yourself via WhatsApp and email, IndiaFilings works fine for straightforward cases. If you want a product-grade experience - transparent, trackable, and with your documents in one place - Ollvy is built for that.`,
    },
  ]

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }
}

export default async function LandingPage() {
  // Fetch popular services and FAQ prices from database in parallel
  const [popularServices, faqPrices] = await Promise.all([
    getPopularServices(),
    getFAQServicePrices(),
  ])

  // Generate FAQ schema with live prices
  const faqJsonLd = generateFAQSchema(faqPrices)

  // BreadcrumbList schema for homepage
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://www.ollvy.com',
      },
    ],
  }

  // Organization schema
  const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Ollvy Technologies Private Limited',
    url: 'https://www.ollvy.com',
    logo: 'https://www.ollvy.com/logo.png',
    description: 'Company Registration, GST & Compliance Services in India',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'IN',
    },
    sameAs: [],
  }

  // WebSite schema with SearchAction (enables sitelinks searchbox in Google)
  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Ollvy',
    url: 'https://www.ollvy.com',
    description: 'Company Registration, GST & Compliance Services in India with verified CAs',
    publisher: {
      '@type': 'Organization',
      name: 'Ollvy',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.ollvy.com/logo.png',
      },
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://www.ollvy.com/services?q={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  }

  // ItemList schema for popular services (shows as carousel in Google)
  const servicesItemListJsonLd = popularServices.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Popular Compliance Services',
    description: 'Most popular business registration and compliance services on Ollvy',
    itemListElement: popularServices.slice(0, 6).map((service, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Service',
        name: service.name,
        description: service.description,
        url: `https://www.ollvy.com/services/${service.slug}`,
        provider: {
          '@type': 'Organization',
          name: 'Ollvy',
        },
        offers: {
          '@type': 'Offer',
          price: service.ollvyFee.toString(),
          priceCurrency: 'INR',
        },
      },
    })),
  } : null

  return (
    <div className="min-h-screen bg-background pb-20 lg:pb-0">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      {servicesItemListJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(servicesItemListJsonLd) }}
        />
      )}
      <NavbarServer />

      {/* Main content with padding for fixed navbar */}
      <main className="pt-16">
        {/* Section 1 - Hero: Bold claim + product screenshot */}
        <Hero />

        {/* Section 2 - Social Proof Bar: Founder avatars + rating */}
        <SocialProofBar />

        {/* Section 3 - Services: Simplified grid (moved up) */}
        <ServicesSimplified services={popularServices} />

        {/* Section 4 - Fear -> Relief: Penalty costs vs Ollvy peace */}
        <FearRelief />

        {/* Section 5 - Product Showcase: Dashboard screenshots */}
        <ProductShowcase />

        {/* Section 6 - Single Testimonial: One powerful story */}
        <SingleTestimonial />

        {/* Section 7 - FAQ: Key questions */}
        <HomeFAQ />

        {/* Section 8 - Final CTA: Strong close */}
        <FinalCTA />
      </main>

      {/* Footer */}
      <Footer />

      {/* Mobile sticky CTA */}
      <MobileBottomCTA />
    </div>
  )
}
