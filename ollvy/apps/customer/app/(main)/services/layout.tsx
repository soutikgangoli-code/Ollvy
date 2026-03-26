import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'All Business Compliance Services | Ollvy',
  description: 'Browse GST registration, company incorporation, trademark, ITR filing, and compliance services. Fixed prices. Tracked delivery.',
  alternates: { canonical: 'https://www.ollvy.com/services' },
  openGraph: {
    title: 'Business Compliance Services | Ollvy',
    description: 'GST, incorporation, trademark, and compliance services for Indian businesses.',
    url: 'https://www.ollvy.com/services',
    images: [{ url: 'https://www.ollvy.com/logo.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Business Compliance Services | Ollvy',
    description: 'GST, incorporation, trademark, and compliance services for Indian businesses.',
    images: ['https://www.ollvy.com/logo.png'],
  },
}

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
