import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'TDS Late Filing Penalty Calculator 2025 | Ollvy',
  description: 'Calculate TDS return late filing penalties under Section 234E and prosecution risk under Section 271H. Covers 24Q, 26Q, 27Q, and 27EQ returns.',
  alternates: {
    canonical: 'https://www.ollvy.com/tools/penalty-calculator/tds-late-filing',
  },
  openGraph: {
    title: 'TDS Late Filing Penalty Calculator | Ollvy',
    description: 'Calculate TDS late filing penalties under Section 234E and 271H. Free instant calculator.',
    url: 'https://www.ollvy.com/tools/penalty-calculator/tds-late-filing',
    images: [{ url: 'https://www.ollvy.com/logo.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TDS Late Filing Penalty Calculator | Ollvy',
    description: 'Calculate TDS late filing penalties under Section 234E and 271H.',
    images: ['https://www.ollvy.com/logo.png'],
  },
}

export default function TDSLateFilingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
