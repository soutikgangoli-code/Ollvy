// Server Component - Minimal wrapper
// Each page handles its own container/padding for flexibility
// H1 and SEO content are rendered in individual page.tsx files
// Breadcrumb schema is generated per-page via generateBreadcrumbSchema()

export default function PenaltyCalculatorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
