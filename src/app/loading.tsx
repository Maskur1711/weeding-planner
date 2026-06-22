export default function DashboardLoading() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <div>
          <div className="h-7 w-36 rounded-lg bg-champagne-200" />
          <div className="mt-2 h-4 w-56 rounded-lg bg-champagne-100" />
        </div>
      </div>

      {/* Cards skeleton */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="rounded-xl bg-white shadow-card p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-4 w-4 rounded bg-champagne-200" />
              <div className="h-3 w-20 rounded bg-champagne-200" />
            </div>
            <div className="h-8 w-24 rounded bg-champagne-200" />
            <div className="mt-3 h-3 w-32 rounded bg-champagne-100" />
          </div>
        ))}
      </div>

      {/* Progress bar skeleton */}
      <div className="rounded-xl bg-white shadow-card p-5">
        <div className="mb-3 h-4 w-32 rounded bg-champagne-200" />
        <div className="h-2 w-full rounded-full bg-champagne-100" />
      </div>

      {/* Chart + Table skeleton */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <div className="rounded-xl bg-white shadow-card p-5">
            <div className="h-48 rounded-lg bg-champagne-100" />
            <div className="mt-4 space-y-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-2.5 w-2.5 rounded-full bg-champagne-200" />
                    <div className="h-3 w-24 rounded bg-champagne-200" />
                  </div>
                  <div className="h-3 w-20 rounded bg-champagne-200" />
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="lg:col-span-3">
          <div className="rounded-xl bg-white shadow-card overflow-hidden">
            <div className="px-5 py-4 border-b border-champagne/20">
              <div className="h-4 w-32 rounded bg-champagne-200" />
            </div>
            <div className="p-5 space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-4 w-32 rounded bg-champagne-200" />
                    <div className="h-5 w-16 rounded-full bg-champagne-100" />
                  </div>
                  <div className="h-4 w-20 rounded bg-champagne-200" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
