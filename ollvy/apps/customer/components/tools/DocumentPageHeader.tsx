// Server Component - H1 is server-rendered for SEO
import Link from 'next/link'
import { ArrowLeft, ChevronRight } from 'lucide-react'
import { DocumentTypeSelector } from './DocumentTypeSelector'

interface DocumentPageHeaderProps {
  h1: string
  label: string
  href: string
}

export function DocumentPageHeader({ h1, label, href }: DocumentPageHeaderProps) {
  return (
    <div className="mb-12 text-center">
      {/* Mobile: back arrow + page name */}
      <div className="md:hidden flex items-center justify-center mb-4">
        <Link href="/tools/documents" className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-3.5 w-3.5" />
          <span className="text-foreground">{label}</span>
        </Link>
      </div>
      {/* Full breadcrumb: hidden on mobile, visible on desktop. Stays in DOM for SEO. */}
      <nav className="hidden md:flex items-center justify-center gap-2 text-xs text-muted-foreground mb-4" aria-label="Breadcrumb">
        <Link href="/tools" className="hover:text-foreground transition-colors">
          Tools
        </Link>
        <ChevronRight className="h-3 w-3" />
        <Link href="/tools/documents" className="hover:text-foreground transition-colors">
          Documents
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-foreground">{label}</span>
      </nav>

      <p className="font-mono text-sm uppercase tracking-[0.3em] text-muted-foreground mb-4">
        Complete Guide & Document Checklist
      </p>

      <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground mb-6 tracking-tight">
        {h1}
      </h1>

      {/* Document Type Selector - Client Component */}
      <div className="flex justify-center mb-6">
        <DocumentTypeSelector currentHref={href} currentLabel={label} />
      </div>

      <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
        Step-by-step process, required documents checklist, costs, timeline, and frequently asked questions
      </p>
    </div>
  )
}
