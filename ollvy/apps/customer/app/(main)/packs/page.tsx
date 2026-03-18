import { Metadata } from 'next'
import Link from 'next/link'
import { ChevronRight, Package } from 'lucide-react'
import { getAllPackSlugs, getPackBySlug } from '@/lib/data/packs'

export const metadata: Metadata = {
  title: 'Service Packs | Ollvy',
  description: 'Bundle multiple compliance services and save. FSSAI, GST, Shop & Establishment - all filed simultaneously.',
}

export default async function PacksIndexPage() {
  const slugs = await getAllPackSlugs()
  const packs = await Promise.all(slugs.map((slug) => getPackBySlug(slug)))

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-[1200px] mx-auto px-6 py-16">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-8">
          <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
          <ChevronRight size={12} />
          <span className="text-foreground">Packs</span>
        </div>

        {/* Header */}
        <h1 className="font-mono uppercase tracking-wider text-4xl text-foreground">
          SERVICE PACKS
        </h1>
        <p className="text-base text-muted-foreground mt-4 max-w-xl">
          Bundle multiple compliance services. All filed simultaneously. Save time and money.
        </p>

        {/* Pack cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          {packs.filter(Boolean).map((pack) => (
            <Link
              key={pack!.slug}
              href={`/packs/${pack!.slug}`}
              className="border border-border rounded-2xl p-6 hover:border-foreground/20 hover:bg-foreground/[0.03] transition-all duration-300 group"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-[hsl(var(--ollvy-green))]/10 flex items-center justify-center shrink-0">
                  <Package size={24} className="text-[hsl(var(--ollvy-green))]" />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="font-mono uppercase tracking-wider text-lg text-foreground group-hover:text-[hsl(var(--ollvy-green))] transition-colors">
                    {pack!.name}
                  </h2>
                  <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                    {pack!.tagline}
                  </p>
                  <div className="flex items-center gap-3 mt-4">
                    <span className="font-mono text-lg font-bold text-foreground">
                      ₹33,599
                    </span>
                    <span className="rounded-full text-xs px-2 py-0.5 uppercase tracking-wider bg-green-500/10 text-green-600 dark:text-green-500 border border-green-500/20">
                      {pack!.discountPercent}% OFF
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
