import { Metadata } from 'next'
import Link from 'next/link'
import { Home, Search, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'Page Not Found | Ollvy',
  description: 'The page you are looking for does not exist. Browse our compliance services or return to the homepage.',
  robots: { index: false, follow: true },
}

const popularServices = [
  { name: 'Private Limited Registration', href: '/services/pvt-ltd-incorporation' },
  { name: 'GST Registration', href: '/services/gst-registration' },
  { name: 'Trademark Registration', href: '/services/trademark-registration' },
  { name: 'FSSAI License', href: '/services/cloud-kitchen-setup' },
]

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">
        {/* 404 Illustration */}
        <div className="mb-8">
          <span className="font-mono text-8xl font-bold text-muted-foreground/20">
            404
          </span>
        </div>

        {/* Message */}
        <h1 className="font-mono text-2xl font-bold text-foreground mb-3">
          Page not found
        </h1>
        <p className="text-muted-foreground mb-8">
          The page you are looking for does not exist or has been moved.
        </p>

        {/* Primary Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-12">
          <Button asChild className="gap-2">
            <Link href="/">
              <Home className="h-4 w-4" />
              Back to home
            </Link>
          </Button>
          <Button asChild variant="outline" className="gap-2">
            <Link href="/services">
              <Search className="h-4 w-4" />
              Browse services
            </Link>
          </Button>
        </div>

        {/* Popular Services */}
        <div className="pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground mb-4">
            Popular services
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {popularServices.map((service) => (
              <Link
                key={service.href}
                href={service.href}
                className="flex items-center justify-between p-3 rounded-lg border border-border hover:border-foreground/20 hover:bg-muted/30 transition-colors group"
              >
                <span className="text-sm text-foreground">
                  {service.name}
                </span>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
              </Link>
            ))}
          </div>
        </div>

        {/* Additional Help */}
        <div className="mt-8 flex flex-wrap justify-center gap-4 text-sm">
          <Link
            href="/guides"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Read Guides
          </Link>
          <Link
            href="/tools"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Free Tools
          </Link>
          <Link
            href="/services?filter=bundles"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Service Bundles
          </Link>
        </div>
      </div>
    </div>
  )
}
