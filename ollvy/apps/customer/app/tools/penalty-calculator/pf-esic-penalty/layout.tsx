import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'PF and ESIC Penalty Calculator 2025 | Ollvy',
  description: 'Calculate penalties for late PF (EPF) and ESIC contributions. Includes damages under Section 14B and interest calculations for delayed deposits.',
  alternates: {
    canonical: 'https://www.ollvy.com/tools/penalty-calculator/pf-esic-penalty',
  },
  openGraph: {
    title: 'PF and ESIC Penalty Calculator | Ollvy',
    description: 'Calculate penalties for late PF and ESIC contributions. Free instant calculator.',
    url: 'https://www.ollvy.com/tools/penalty-calculator/pf-esic-penalty',
    images: [{ url: 'https://www.ollvy.com/logo.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PF and ESIC Penalty Calculator | Ollvy',
    description: 'Calculate penalties for late PF and ESIC contributions.',
    images: ['https://www.ollvy.com/logo.png'],
  },
}

export default function PFESICLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
