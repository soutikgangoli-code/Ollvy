'use client'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { formatPaisa } from '@/lib/data/packs'

export function PackStickyTopBar({
  visible, packName, total, checkoutHref
}: {
  visible: boolean
  packName: string
  total: number
  checkoutHref: string
}) {
  return (
    <div className={cn(
      'fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border',
      'transition-all duration-300',
      visible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'
    )}>
      <div className="max-w-[1200px] mx-auto px-6 h-14 flex items-center justify-between gap-6">

        {/* Left */}
        <div className="flex items-center gap-4">
          <Link href="/" className="font-mono text-sm font-bold text-foreground tracking-tight">
            Ollvy
          </Link>
          <span className="text-border">|</span>
          <span className="font-mono uppercase tracking-wider text-sm text-foreground">
            {packName}
          </span>
        </div>

        {/* Center tabs - hidden mobile */}
        <nav className="hidden md:flex items-center gap-6">
          {['pack-builder', 'timeline', 'included', 'documents', 'faqs'].map((id) => (
            <button
              key={id}
              onClick={() => {
                document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
              }}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors capitalize"
            >
              {id.replace('-', ' ')}
            </button>
          ))}
        </nav>

        {/* Right */}
        <div className="flex items-center gap-4">
          <span className="font-mono text-sm font-semibold text-foreground hidden sm:block">
            {formatPaisa(total)}
          </span>
          <a
            href={checkoutHref}
            className="bg-[hsl(var(--ollvy-green))] text-white rounded-lg h-9 px-4 text-xs font-medium flex items-center active:scale-[0.98] transition-all"
          >
            Book Now
          </a>
        </div>

      </div>
    </div>
  )
}
