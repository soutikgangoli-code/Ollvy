import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'MCA Annual Filing Penalty Calculator 2025 | Ollvy',
  description: 'Calculate penalties for late ROC filing - AOC-4, MGT-7, MGT-7A for companies and Form 8, Form 11 for LLPs. Additional fee of Rs 100 per day delay.',
  alternates: {
    canonical: 'https://www.ollvy.com/tools/penalty-calculator/mca-annual-filing',
  },
  openGraph: {
    title: 'MCA Annual Filing Penalty Calculator | Ollvy',
    description: 'Calculate ROC late filing penalties for AOC-4, MGT-7, LLP Form 8, Form 11.',
    url: 'https://www.ollvy.com/tools/penalty-calculator/mca-annual-filing',
    images: [{ url: 'https://www.ollvy.com/logo.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MCA Annual Filing Penalty Calculator | Ollvy',
    description: 'Calculate ROC late filing penalties for AOC-4, MGT-7, LLP forms.',
    images: ['https://www.ollvy.com/logo.png'],
  },
}

export default function MCAFilingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
