import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ITR Late Filing Penalty Calculator 2025 | Ollvy',
  description: 'Calculate penalties for late Income Tax Return filing - Section 234F late fee, Section 234A interest, and Section 234B interest. Free instant calculator for FY 2024-25.',
  alternates: {
    canonical: 'https://ollvy.com/tools/penalty-calculator/itr-late-filing',
  },
  openGraph: {
    title: 'ITR Late Filing Penalty Calculator | Ollvy',
    description: 'Calculate late filing penalties under Section 234F, 234A, 234B. Free instant calculator.',
    url: 'https://ollvy.com/tools/penalty-calculator/itr-late-filing',
    images: [{ url: 'https://ollvy.com/logo.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ITR Late Filing Penalty Calculator | Ollvy',
    description: 'Calculate late filing penalties under Section 234F, 234A, 234B.',
    images: ['https://ollvy.com/logo.png'],
  },
}

export default function ITRLateFilingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
