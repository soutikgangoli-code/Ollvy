import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Shops and Establishment Penalty Calculator 2025 | Ollvy',
  description: 'Calculate penalties for Shops and Establishment Act violations. Late registration, renewal delays, and compliance penalties by state.',
  alternates: {
    canonical: 'https://ollvy.com/tools/penalty-calculator/shops-establishment-penalty',
  },
  openGraph: {
    title: 'Shops and Establishment Penalty Calculator | Ollvy',
    description: 'Calculate Shop Act penalties for late registration and renewal.',
    url: 'https://ollvy.com/tools/penalty-calculator/shops-establishment-penalty',
    images: [{ url: 'https://ollvy.com/logo.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Shops and Establishment Penalty Calculator | Ollvy',
    description: 'Calculate Shop Act penalties for late registration and renewal.',
    images: ['https://ollvy.com/logo.png'],
  },
}

export default function ShopsEstablishmentLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
