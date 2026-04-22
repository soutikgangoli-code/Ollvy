import type { Metadata, Viewport } from 'next'
import dynamic from 'next/dynamic'
import { Inter, Fraunces, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/toaster'
import { UTMProvider } from '@/components/providers/UTMProvider'
import { AuthProvider } from '@/components/providers/AuthProvider'
import { ThemeProvider } from '@/components/providers/ThemeProvider'
import { LoginSuccessBanner } from '@/components/auth/LoginSuccessBanner'
import { StructuredData } from '@/components/seo/StructuredData'
import { GTMProvider, GTMNoScript } from '@/components/analytics/GTMProvider'
import { PostHogProvider } from '@/components/analytics/PostHogProvider'

const AuthModal = dynamic(() => import('@/components/auth/AuthModal').then(m => ({ default: m.AuthModal })))

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
  // 'optional' gives the font ~100ms to arrive, otherwise falls back permanently
  // for this session. Eliminates the font-swap LCP bump on the service-page H1
  // which uses font-mono; brand-accent fallback is still readable.
  display: 'optional',
})

export const viewport: Viewport = {
  viewportFit: 'cover',
}

export const metadata: Metadata = {
  title: 'Company Registration & GST Services in India | Ollvy',
  description: 'Register your company, get GST, trademark, FSSAI, and handle compliance - with vetted CAs on Ollvy. Fixed prices. Tracked delivery. India\'s most organised compliance platform.',
  robots: 'index, follow',
  metadataBase: new URL('https://www.ollvy.com'),
  icons: {
    icon: [
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-48x48.png', sizes: '48x48', type: 'image/png' },
      { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    apple: [
      { url: '/favicon-square.png', sizes: '192x192', type: 'image/png' },
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
        {/* Preconnect to origins that block paint or first interaction.
            Supabase: used for client-side auth + service fetches on every page.
            Razorpay: loaded on /checkout — preconnecting globally warms the TCP+TLS
            so the Razorpay modal opens faster on click. `crossOrigin=""` is required
            since the eventual script is loaded cross-origin. */}
        <link rel="preconnect" href="https://wsuleaypyjazcmmntcru.supabase.co" />
        <link rel="preconnect" href="https://checkout.razorpay.com" crossOrigin="" />
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
