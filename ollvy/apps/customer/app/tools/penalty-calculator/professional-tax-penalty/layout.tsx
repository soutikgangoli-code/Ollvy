import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Professional Tax Penalty Calculator 2025 | Ollvy',
  description: 'Calculate professional tax late payment penalties by state. Covers Maharashtra, Karnataka, Gujarat, West Bengal and other states with PT requirements.',
  alternates: {
    canonical: 'https://www.ollvy.com/tools/penalty-calculator/professional-tax-penalty',
  },
  openGraph: {
    title: 'Professional Tax Penalty Calculator | Ollvy',
    description: 'Calculate professional tax late payment penalties by state.',
    url: 'https://www.ollvy.com/tools/penalty-calculator/professional-tax-penalty',
    images: [{ url: 'https://www.ollvy.com/logo.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Professional Tax Penalty Calculator | Ollvy',
    description: 'Calculate professional tax late payment penalties by state.',
    images: ['https://www.ollvy.com/logo.png'],
  },
}

export default function ProfessionalTaxLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
