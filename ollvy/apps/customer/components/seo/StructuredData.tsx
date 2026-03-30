// Structured Data (JSON-LD) for SEO and Google Sitelinks
// This helps Google understand your site and show rich results

export function StructuredData() {
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Ollvy',
    alternateName: 'Ollvy India',
    url: 'https://www.ollvy.com',
    logo: 'https://www.ollvy.com/android-chrome-512x512.png',
    description: 'Company registration, GST, trademark, and compliance services in India with vetted CAs. Fixed prices. Tracked delivery.',
    foundingDate: '2024',
    sameAs: [
      'https://twitter.com/ollvy',
      'https://linkedin.com/company/ollvy',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      availableLanguage: ['English', 'Hindi'],
    },
    areaServed: {
      '@type': 'Country',
      name: 'India',
    },
    serviceArea: {
      '@type': 'Country',
      name: 'India',
    },
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

  // Professional Service schema
  const professionalServiceSchema = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: 'Ollvy',
    image: 'https://www.ollvy.com/android-chrome-512x512.png',
    url: 'https://www.ollvy.com',
    description: 'Professional CA services for company registration, GST, trademark, and compliance in India.',
    priceRange: '$$',
    areaServed: 'India',
    serviceType: [
      'Company Registration',
      'GST Registration',
      'Trademark Registration',
      'FSSAI License',
      'Compliance Services',
      'LLP Registration',
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(siteNavigationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(professionalServiceSchema) }}
      />
    </>
  )
}
