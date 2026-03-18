import type { Metadata } from 'next'
import { Inter, Fraunces, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/toaster'
import { UTMProvider } from '@/components/providers/UTMProvider'
import { ThemeProvider } from '@/components/providers/ThemeProvider'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const fraunces = Fraunces({
  subsets: ['latin'],
  weight: ['700'],
  variable: '--font-fraunces',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Ollvy - Company Registration, GST, Compliance Services in India',
  description: 'Register your company, get GST, trademark, FSSAI, and handle compliance - with vetted CAs on Ollvy. Fixed prices. Tracked delivery. India\'s most organised compliance platform.',
  keywords: 'company registration india, llp registration, gst registration, trademark registration india, ca services india, compliance services india, business registration india',
  robots: 'index, follow',
  metadataBase: new URL('https://ollvy.com'),
  alternates: {
    canonical: 'https://ollvy.com',
  },
  openGraph: {
    title: 'Ollvy - Company Registration & Compliance, Sorted',
    description: 'Fixed-price compliance services with vetted CAs. LLP, Pvt Ltd, GST, Trademark, FSSAI and more. Track every step in-app.',
    url: 'https://ollvy.com',
    siteName: 'Ollvy',
    images: [
      {
        url: '/og-home.png',
        width: 1200,
        height: 630,
        alt: 'Ollvy - Company Registration & Compliance Services India',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ollvy - Company Registration & Compliance, Sorted',
    description: 'Fixed-price compliance services with vetted CAs. LLP, Pvt Ltd, GST, Trademark, FSSAI and more.',
    images: ['/og-home.png'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${fraunces.variable} ${jetbrainsMono.variable} font-sans`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <UTMProvider>
            {children}
          </UTMProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
