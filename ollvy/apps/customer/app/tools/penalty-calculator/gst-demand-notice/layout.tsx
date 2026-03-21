import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'GST Demand Notice Calculator 2025 | Ollvy',
  description: 'Calculate interest and penalties on GST demand notices (DRC-01). Understand Section 73 and 74 implications for tax demands, interest, and penalties.',
  alternates: {
    canonical: 'https://ollvy.com/tools/penalty-calculator/gst-demand-notice',
  },
  openGraph: {
    title: 'GST Demand Notice Calculator | Ollvy',
    description: 'Calculate interest and penalties on GST demand notices (DRC-01).',
    url: 'https://ollvy.com/tools/penalty-calculator/gst-demand-notice',
    images: [{ url: 'https://ollvy.com/logo.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GST Demand Notice Calculator | Ollvy',
    description: 'Calculate interest and penalties on GST demand notices.',
    images: ['https://ollvy.com/logo.png'],
  },
}

export default function GSTDemandLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
