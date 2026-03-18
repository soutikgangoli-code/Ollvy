import Link from 'next/link'

export default function PackNotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <p className="font-mono uppercase tracking-wider text-xs text-muted-foreground mb-2">
          404
        </p>
        <h1 className="font-mono uppercase tracking-wider text-2xl text-foreground mb-4">
          PACK NOT FOUND
        </h1>
        <p className="text-sm text-muted-foreground mb-8">
          The pack you are looking for does not exist or has been removed.
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center bg-[hsl(var(--ollvy-green))] text-white rounded-lg h-10 px-6 text-sm font-medium transition-all active:scale-[0.98]"
        >
          Back to Home
        </Link>
      </div>
    </div>
  )
}
