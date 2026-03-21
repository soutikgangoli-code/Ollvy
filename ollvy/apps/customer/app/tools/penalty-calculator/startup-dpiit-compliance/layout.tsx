import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Startup DPIIT Compliance Calculator 2025 | Ollvy',
  description: 'Check DPIIT recognition compliance requirements and potential penalties. FC-GPR filing deadlines, annual compliance, and startup status maintenance.',
  alternates: {
    canonical: 'https://ollvy.com/tools/penalty-calculator/startup-dpiit-compliance',
  },
  openGraph: {
    title: 'Startup DPIIT Compliance Calculator | Ollvy',
    description: 'Check DPIIT recognition compliance requirements and deadlines.',
    url: 'https://ollvy.com/tools/penalty-calculator/startup-dpiit-compliance',
    images: [{ url: 'https://ollvy.com/logo.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Startup DPIIT Compliance Calculator | Ollvy',
    description: 'Check DPIIT recognition compliance requirements and deadlines.',
    images: ['https://ollvy.com/logo.png'],
  },
}

export default function StartupDPIITLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
