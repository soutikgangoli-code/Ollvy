import type { Metadata, Viewport } from 'next'
import dynamic from 'next/dynamic'
import { Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/toaster'
import { UTMProvider } from '@/components/providers/UTMProvider'
import { AuthProvider } from '@/components/providers/AuthProvider'
import { ThemeProvider } from '@/components/providers/ThemeProvider'
import { WarmupProtected } from '@/components/providers/WarmupProtected'
import { LoginSuccessBanner } from '@/components/auth/LoginSuccessBanner'
import { StructuredData } from '@/components/seo/StructuredData'
import { GTMProvider, GTMNoScript } from '@/components/analytics/GTMProvider'
import { PostHogProvider } from '@/components/analytics/PostHogProvider'

const AuthModal = dynamic(() => import('@/components/auth/AuthModal').then(m => ({ default: m.AuthModal })))

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  // 'optional' (was 'swap'): the mobile LCP element is the hero H1 in Inter.
  // With swap, the fallback paints at FCP but the H1 repaints when the ~84 KiB
  // variable font lands (~4s on slow 4G), and that repaint re-registers LCP.
  // With optional there is no swap repaint — LCP = FCP. First visits on slow
  // connections render the metric-adjusted system fallback; cached visits get
  // Inter. Same tradeoff already made for JetBrains Mono below.
  display: 'optional',
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
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
}

export const metadata: Metadata = {
  title: 'Company Registration & GST Services in India | Ollvy',
  description: 'Register your company, get GST, trademark, FSSAI, and handle compliance - with vetted CAs on Ollvy. Fixed prices. Tracked delivery. India\'s most organised compliance platform.',
  robots: 'index, follow',
  metadataBase: new URL('https://www.ollvy.com'),
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/site.webmanifest',
  // No alternates here on purpose. A root-level canonical is inherited by every
  // route that doesn't define its own, which made checkout/orders/settings pages
  // claim canonical = homepage. Each public page declares its own canonical
  // (homepage in app/page.tsx); private pages emit none and are robots.txt-blocked.
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
    <html lang="en-IN" suppressHydrationWarning>
      <head>
        {/* No global preconnects: Supabase auth is lazy (no request for anonymous
            visitors) and Razorpay only matters where checkout can start, so those
            preconnects live in BookingPanel/CheckoutClient instead. Global hints
            here would compete with the critical CSS/font connections on every page
            and get flagged as unused by Lighthouse. */}
        <StructuredData />
      </head>
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans`}>
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
              <WarmupProtected />
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
