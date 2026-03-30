import { Metadata } from 'next';
import { StartupPage } from '@/components/startup/StartupPage';

// Service schema for startup compliance stack
const startupServiceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Startup Compliance Stack',
  description: 'Complete compliance solution for Indian startups - from Pvt Ltd incorporation to Series A readiness. Includes company registration, DPIIT recognition, GST, MSME, and monthly filings.',
  provider: {
    '@type': 'Organization',
    name: 'Ollvy Technologies Private Limited',
    url: 'https://www.ollvy.com',
  },
  areaServed: {
    '@type': 'Country',
    name: 'India',
  },
  serviceType: 'Business Compliance Services',
  url: 'https://www.ollvy.com/startup',
  offers: {
    '@type': 'AggregateOffer',
    priceCurrency: 'INR',
    availability: 'https://schema.org/InStock',
    description: 'Fixed pricing for startup compliance services',
  },
};

// BreadcrumbList schema
const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.ollvy.com' },
    { '@type': 'ListItem', position: 2, name: 'Startup', item: 'https://www.ollvy.com/startup' },
  ],
};

export const metadata: Metadata = {
  title: 'Startup Compliance Stack - Incorporation to Series A | Ollvy',
  description: 'Everything a startup needs: Pvt Ltd incorporation, Startup India DPIIT recognition, GST, MSME, monthly filings, ITR. Fixed prices. CAs assigned same day.',
  alternates: { canonical: 'https://www.ollvy.com/startup' },
  openGraph: {
    title: 'Startup Compliance Stack | Ollvy',
    description: 'The complete compliance stack for Indian startups. Incorporation, DPIIT, GST, MSME. All in one place.',
    url: 'https://www.ollvy.com/startup',
    images: [{ url: 'https://www.ollvy.com/logo.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Startup Compliance Stack | Ollvy',
    description: 'The complete compliance stack for Indian startups. Incorporation, DPIIT, GST, MSME. All in one place.',
    images: ['https://www.ollvy.com/logo.png'],
  },
};

export default function StartupPageRoute() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(startupServiceSchema) }}
      />
      <StartupPage />
    </>
  );
}
