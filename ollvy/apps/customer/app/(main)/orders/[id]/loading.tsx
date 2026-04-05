import { Skeleton } from '@/components/ui/skeleton'

export default function OrderDetailLoading() {
  return (
    <div className="container py-12 max-w-5xl">
      {/* Back Button */}
      <Skeleton className="h-10 w-36 mb-8" />

      {/* Header */}
      <div className="mb-12">
        {/* Order number */}
        <Skeleton className="h-4 w-28 mb-4" />

        {/* Title and status row */}
        <div className="flex items-start justify-between gap-4 flex-wrap mb-2">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Skeleton className="h-9 w-64" />
              <Skeleton className="h-6 w-24 rounded-full" />
            </div>
            <Skeleton className="h-5 w-32" />
          </div>
          <Skeleton className="h-10 w-64" />
        </div>

        {/* Stats Cards Row */}
        <div className="rounded-xl border border-border bg-card p-6 mt-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {/* Progress */}
            <div className="space-y-2">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-8 w-12" />
              <Skeleton className="h-1.5 w-full rounded-full" />
            </div>
            {/* Documents */}
            <div className="space-y-2">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-8 w-12" />
              <Skeleton className="h-1.5 w-full rounded-full" />
            </div>
            {/* Days Left */}
            <div className="space-y-2">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-8 w-8" />
              <Skeleton className="h-4 w-20" />
            </div>
            {/* SLA */}
            <div className="space-y-2">
              <Skeleton className="h-3 w-10" />
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Progress Overview Card */}
          <div className="rounded-xl border border-border overflow-hidden">
            <div className="px-6 pt-6 pb-4">
              <Skeleton className="h-3 w-14 mb-2" />
              <Skeleton className="h-6 w-48" />
            </div>
            <div className="px-6 py-4 border-t border-border/30">
              {/* Progress bar segments */}
              <div className="flex gap-1 mb-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} className="h-2 flex-1 rounded-full" />
                ))}
              </div>
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-20" />
              </div>
            </div>
            <div className="px-6 py-4 border-t border-border/30 bg-muted/30">
              <Skeleton className="h-4 w-56" />
            </div>
          </div>

          {/* Timeline Card */}
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="px-6 py-4 border-b border-border/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-4 rounded" />
                  <Skeleton className="h-3 w-28" />
                </div>
                <Skeleton className="h-4 w-12" />
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-0">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <Skeleton className="w-8 h-8 rounded-full" />
                      {i < 5 && <Skeleton className="w-0.5 flex-1 mt-2 min-h-[24px]" />}
                    </div>
                    <div className="flex-1 pb-6">
                      <Skeleton className="h-5 w-40 mb-2" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Professional Card */}
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="px-6 py-4 border-b border-border/50">
              <Skeleton className="h-3 w-36" />
            </div>
            <div className="p-6">
              <div className="flex items-center gap-3">
                <Skeleton className="w-12 h-12 rounded-full" />
                <div className="flex-1">
                  <Skeleton className="h-5 w-28 mb-1" />
                  <Skeleton className="h-4 w-20 mb-1" />
                  <Skeleton className="h-3 w-32" />
                </div>
              </div>
              <Skeleton className="h-9 w-full mt-4" />
            </div>
          </div>

          {/* Order Summary Card */}
          <div className="rounded-xl border border-border overflow-hidden">
            <div className="px-6 py-4 flex items-center justify-between">
              <Skeleton className="h-3 w-24" />
              <div className="flex items-center gap-2">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-4 w-4" />
              </div>
            </div>
          </div>

          {/* Downloads Card */}
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="px-6 py-4 border-b border-border/50">
              <Skeleton className="h-3 w-20" />
            </div>
            <div className="p-4 space-y-2">
              <Skeleton className="h-12 w-full rounded-lg" />
              <Skeleton className="h-12 w-full rounded-lg" />
            </div>
          </div>

          {/* Chat Card */}
          <div className="rounded-xl border border-border overflow-hidden h-[450px] flex flex-col">
            <div className="px-6 py-4 border-b border-border/50 shrink-0">
              <Skeleton className="h-3 w-32" />
            </div>
            <div className="flex-1 p-4 flex flex-col">
              <div className="flex-1 space-y-4">
                {/* Chat message skeletons */}
                <div className="flex justify-start">
                  <Skeleton className="h-16 w-48 rounded-lg" />
                </div>
                <div className="flex justify-end">
                  <Skeleton className="h-12 w-40 rounded-lg" />
                </div>
                <div className="flex justify-start">
                  <Skeleton className="h-10 w-56 rounded-lg" />
                </div>
              </div>
              {/* Chat input skeleton */}
              <Skeleton className="h-12 w-full rounded-lg mt-4" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
