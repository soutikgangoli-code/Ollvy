import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Ollvy - Compliance for Indian Businesses | GST, ITR, Payroll',
  description: 'Get your GST filings, ITR, payroll, and company compliance done by verified professionals. Fixed prices. No surprises.',
  openGraph: {
    title: 'Ollvy - Compliance for Indian Businesses',
    description: 'Get your GST filings, ITR, payroll, and company compliance done by verified professionals. Fixed prices. No surprises.',
    type: 'website',
    locale: 'en_IN',
    siteName: 'Ollvy',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ollvy - Compliance for Indian Businesses',
    description: 'Get your GST filings, ITR, payroll, and company compliance done by verified professionals.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
