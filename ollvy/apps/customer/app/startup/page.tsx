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
  },
};

export default function StartupPageRoute() {
  return <StartupPage />;
}
