import { Metadata } from 'next';
import { StartupPage } from '@/components/startup/StartupPage';

export const metadata: Metadata = {
  title: 'Startup Compliance Stack - Incorporation to Series A | Ollvy',
  description: 'Everything a startup needs: Pvt Ltd incorporation, Startup India DPIIT recognition, GST, MSME, monthly filings, ITR. Fixed prices. CAs assigned same day.',
  alternates: { canonical: 'https://ollvy.com/startup' },
  openGraph: {
    title: 'Startup Compliance Stack | Ollvy',
    description: 'The complete compliance stack for Indian startups. Incorporation, DPIIT, GST, MSME. All in one place.',
    url: 'https://ollvy.com/startup',
    images: [{ url: 'https://ollvy.com/logo.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Startup Compliance Stack | Ollvy',
    description: 'The complete compliance stack for Indian startups. Incorporation, DPIIT, GST, MSME. All in one place.',
    images: ['https://ollvy.com/logo.png'],
  },
};

export default function StartupPageRoute() {
  return <StartupPage />;
}
