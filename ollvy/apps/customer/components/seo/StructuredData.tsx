// Structured Data (JSON-LD) for SEO and Google Sitelinks
// This helps Google understand your site and show rich results
// Note: FAQPage schema moved to app/page.tsx for live price injection

export function StructuredData() {
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Ollvy',
    legalName: 'Ollvy Collective Private Limited',
    alternateName: 'Ollvy India',
    url: 'https://www.ollvy.com',
    logo: 'https://www.ollvy.com/android-chrome-512x512.png',
    image: 'https://www.ollvy.com/android-chrome-512x512.png',
    description: 'Company registration, GST, trademark, and compliance services in India with vetted CAs. Fixed prices. Tracked delivery.',
    foundingDate: '2026',
    sameAs: [
      'https://twitter.com/ollvy',
      'https://linkedin.com/company/ollvy',
    ],
    address: {
      '@type': 'PostalAddress',
      streetAddress: '737, Block A, Sushant Lok Phase 1, Sector 43',
      addressLocality: 'Gurgaon',
      addressRegion: 'Haryana',
      postalCode: '122009',
      addressCountry: 'IN',
    },
    contactPoint: [
      {
        '@type': 'ContactPoint',
        contactType: 'customer service',
        availableLanguage: ['English', 'Hindi'],
        areaServed: 'IN',
      },
      {
        '@type': 'ContactPoint',
        contactType: 'sales',
        availableLanguage: ['English', 'Hindi'],
        areaServed: 'IN',
      },
    ],
    areaServed: {
      '@type': 'Country',
      name: 'India',
    },
    serviceArea: {
      '@type': 'Country',
      name: 'India',
    },
    knowsAbout: [
      'Company Registration',
      'GST Registration',
      'Trademark Registration',
      'LLP Registration',
      'FSSAI License',
      'Business Compliance',
      'Tax Filing',
      'MCA Annual Filing',
    ],
  }

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Ollvy',
    alternateName: 'Ollvy - Company Registration & Compliance',
    url: 'https://www.ollvy.com',
    description: 'Register your company, get GST, trademark, FSSAI, and handle compliance with vetted CAs on Ollvy.',
    publisher: {
      '@type': 'Organization',
      name: 'Ollvy',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.ollvy.com/android-chrome-512x512.png',
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

  // Main navigation items that Google can use for sitelinks
  const siteNavigationSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: [
      {
        '@type': 'SiteNavigationElement',
        position: 1,
        name: 'Services',
        description: 'Browse all compliance and registration services',
        url: 'https://www.ollvy.com/services',
      },
      {
        '@type': 'SiteNavigationElement',
        position: 2,
        name: 'Company Registration',
        description: 'Register Private Limited or LLP company in India',
        url: 'https://www.ollvy.com/services/pvt-ltd-incorporation',
      },
      {
        '@type': 'SiteNavigationElement',
        position: 3,
        name: 'GST Registration',
        description: 'Get GST registration for your business',
        url: 'https://www.ollvy.com/services/gst-registration',
      },
      {
        '@type': 'SiteNavigationElement',
        position: 4,
        name: 'Trademark Registration',
        description: 'Register and protect your trademark in India',
        url: 'https://www.ollvy.com/services/trademark-registration',
      },
      {
        '@type': 'SiteNavigationElement',
        position: 5,
        name: 'Guides',
        description: 'Free guides to Indian business compliance',
        url: 'https://www.ollvy.com/guides',
      },
      {
        '@type': 'SiteNavigationElement',
        position: 6,
        name: 'Tools',
        description: 'Free compliance tools and calculators',
        url: 'https://www.ollvy.com/tools',
      },
    ],
  }

  // Note: FAQPage schema moved to app/page.tsx for live price injection from database
  // Note: ProfessionalService/LocalBusiness schema removed from global layout
  // Service pages have their own Service schemas, geo pages have LocalBusiness schemas
  // Adding LocalBusiness globally causes warnings on tools, guides, and legal pages

  // Strip @context from individual schemas before merging into @graph
  const { '@context': _1, ...org } = organizationSchema
  const { '@context': _2, ...site } = websiteSchema
  const { '@context': _3, ...nav } = siteNavigationSchema

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@graph': [org, site, nav],
      }) }}
    />
  )
}
