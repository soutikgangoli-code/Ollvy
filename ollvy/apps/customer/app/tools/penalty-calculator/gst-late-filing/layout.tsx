import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'GST Late Filing Penalty Calculator 2025 | Ollvy',
  description: 'Calculate GST late filing penalties and interest for GSTR-1, GSTR-3B, and GSTR-9. Enter turnover and days late to get instant penalty estimates based on Section 47 CGST Act.',
  alternates: {
    canonical: 'https://ollvy.com/tools/penalty-calculator/gst-late-filing',
  },
  openGraph: {
    title: 'GST Late Filing Penalty Calculator | Ollvy',
    description: 'Calculate GST late filing penalties for GSTR-1, GSTR-3B, GSTR-9. Free instant calculator.',
    url: 'https://ollvy.com/tools/penalty-calculator/gst-late-filing',
    images: [{ url: 'https://ollvy.com/logo.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GST Late Filing Penalty Calculator | Ollvy',
    description: 'Calculate GST late filing penalties for GSTR-1, GSTR-3B, GSTR-9.',
    images: ['https://ollvy.com/logo.png'],
  },
}

export default function GSTLateFilingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
