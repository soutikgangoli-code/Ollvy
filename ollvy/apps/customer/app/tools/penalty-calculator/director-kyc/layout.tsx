import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Director KYC Penalty Calculator 2025 | Ollvy',
  description: 'Calculate penalties for late DIR-3 KYC filing and DIN deactivation. Rs 5000 late fee after deadline plus DIN deactivation risk for non-compliance.',
  alternates: {
    canonical: 'https://www.ollvy.com/tools/penalty-calculator/director-kyc',
  },
  openGraph: {
    title: 'Director KYC Penalty Calculator | Ollvy',
    description: 'Calculate DIR-3 KYC late filing penalties and DIN deactivation risks.',
    url: 'https://www.ollvy.com/tools/penalty-calculator/director-kyc',
    images: [{ url: 'https://www.ollvy.com/logo.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Director KYC Penalty Calculator | Ollvy',
    description: 'Calculate DIR-3 KYC late filing penalties and DIN deactivation risks.',
    images: ['https://www.ollvy.com/logo.png'],
  },
}

export default function DirectorKYCLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
