import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Business Compliance Services in India | Ollvy',
  description: 'GST registration, company incorporation, trademark filing and more. Fixed-price compliance packages handled by vetted CAs and lawyers. Starting at 999.',
  alternates: {
    canonical: 'https://ollvy.com/services',
  },
  openGraph: {
    title: 'Business Compliance Services | Ollvy',
    description: 'Fixed-price compliance services for Indian SMEs. Vetted CAs and lawyers.',
    url: 'https://ollvy.com/services',
    images: [{ url: 'https://ollvy.com/logo.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Business Compliance Services | Ollvy',
    description: 'Fixed-price compliance services for Indian SMEs. Vetted CAs and lawyers.',
    images: ['https://ollvy.com/logo.png'],
  },
}

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
