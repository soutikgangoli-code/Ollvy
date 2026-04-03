// Server Component - H1 is server-rendered for SEO
import { DocumentTypeSelector } from './DocumentTypeSelector'

interface DocumentPageHeaderProps {
  h1: string
  label: string
  href: string
}

export function DocumentPageHeader({ h1, label, href }: DocumentPageHeaderProps) {
  return (
    <div className="mb-12 text-center">
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
