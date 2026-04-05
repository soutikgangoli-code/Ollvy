import { Skeleton } from '@/components/ui/skeleton'

export default function OrdersLoading() {
  return (
    <div className="container py-12 max-w-3xl">
      {/* Back button */}
      <Skeleton className="h-10 w-32 mb-8" />

      {/* Header */}
      <div className="mb-8">
        <Skeleton className="h-4 w-20 mb-2" />
        <Skeleton className="h-10 w-40" />
      </div>

      {/* Tabs */}
      <Skeleton className="h-11 w-64 mb-8" />

      {/* Order cards */}
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-start justify-between mb-4">
              <div className="space-y-2">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-4 w-24" />
              </div>
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-16" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
