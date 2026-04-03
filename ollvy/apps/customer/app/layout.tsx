import type { Metadata } from 'next'
import { Inter, Fraunces, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/toaster'
import { UTMProvider } from '@/components/providers/UTMProvider'
import { AuthProvider } from '@/components/providers/AuthProvider'
import { ThemeProvider } from '@/components/providers/ThemeProvider'
import { AuthModal, LoginSuccessBanner } from '@/components/auth'
import { StructuredData } from '@/components/seo/StructuredData'
import { GTMProvider, GTMNoScript } from '@/components/analytics/GTMProvider'
import { PostHogProvider } from '@/components/analytics/PostHogProvider'

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
  title: 'Company Registration & GST Services in India | Ollvy',
  description: 'Register your company, get GST, trademark, FSSAI, and handle compliance - with vetted CAs on Ollvy. Fixed prices. Tracked delivery. India\'s most organised compliance platform.',
  keywords: 'company registration india, llp registration, gst registration, trademark registration india, ca services india, compliance services india, business registration india',
  robots: 'index, follow',
  metadataBase: new URL('https://www.ollvy.com'),
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '48x48' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/site.webmanifest',
  alternates: {
    canonical: 'https://www.ollvy.com',
  },
  openGraph: {
    title: 'Ollvy - Company Registration & Compliance, Sorted',
    description: 'Fixed-price compliance services with vetted CAs. LLP, Pvt Ltd, GST, Trademark, FSSAI and more. Track every step in-app.',
    url: 'https://www.ollvy.com',
    siteName: 'Ollvy',
    images: [
      {
        url: 'https://www.ollvy.com/logo.png',
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
    images: ['https://www.ollvy.com/logo.png'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Preconnect to Supabase for faster API calls */}
        <link rel="preconnect" href="https://wsuleaypyjazcmmntcru.supabase.co" />
        <link rel="dns-prefetch" href="https://wsuleaypyjazcmmntcru.supabase.co" />
        <StructuredData />
      </head>
      <body className={`${inter.variable} ${fraunces.variable} ${jetbrainsMono.variable} font-sans`}>
        <GTMNoScript />
        <GTMProvider />
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <PostHogProvider>
            <AuthProvider>
              <LoginSuccessBanner />
              <UTMProvider>
                {children}
              </UTMProvider>
            </AuthProvider>
            <AuthModal />
            <Toaster />
          </PostHogProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
