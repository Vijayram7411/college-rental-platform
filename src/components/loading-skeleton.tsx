// Reusable Loading Skeleton Components

export function ProductCardSkeleton() {
  return (
    <div className="campus-card animate-pulse overflow-hidden">
      <div className="aspect-square bg-neutral-200" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-neutral-200 rounded-lg w-3/4" />
        <div className="h-3 bg-neutral-200 rounded-lg w-1/2" />
        <div className="flex items-center justify-between">
          <div className="h-5 bg-neutral-200 rounded-lg w-20" />
          <div className="h-4 bg-neutral-200 rounded-lg w-16" />
        </div>
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function OrderCardSkeleton() {
  return (
    <div className="flipkart-shadow animate-pulse rounded-sm bg-white overflow-hidden">
      <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-3 bg-gray-200 rounded w-40" />
            <div className="h-3 bg-gray-200 rounded w-32" />
          </div>
          <div className="space-y-2">
            <div className="h-5 bg-gray-200 rounded w-20" />
            <div className="h-4 bg-gray-200 rounded w-16" />
          </div>
        </div>
      </div>
      <div className="p-6 space-y-4">
        <div className="flex gap-4">
          <div className="h-24 w-24 bg-gray-200 rounded-lg" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4" />
            <div className="h-3 bg-gray-200 rounded w-1/2" />
            <div className="h-3 bg-gray-200 rounded w-2/3" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function OrderListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-6">
      {Array.from({ length: count }).map((_, i) => (
        <OrderCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function ProductDetailSkeleton() {
  return (
    <div className="grid gap-8 md:grid-cols-[2fr,1fr]">
      <div className="space-y-5">
        <div className="space-y-2">
          <div className="h-8 bg-gray-200 rounded w-3/4 animate-pulse" />
          <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
        </div>
        <div className="aspect-video w-full bg-gray-200 rounded-sm animate-pulse" />
        <div className="flex gap-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-20 w-20 bg-gray-200 rounded-sm animate-pulse" />
          ))}
        </div>
        <div className="flipkart-shadow rounded-sm bg-white p-4 space-y-3">
          <div className="h-6 bg-gray-200 rounded w-32 animate-pulse" />
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-4/6 animate-pulse" />
          </div>
        </div>
      </div>
      <div className="space-y-4">
        <div className="flipkart-shadow rounded-sm bg-white p-4 space-y-4 animate-pulse">
          <div className="h-10 bg-gray-200 rounded" />
          <div className="h-10 bg-gray-200 rounded" />
        </div>
      </div>
    </div>
  );
}

export function ProfileSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flipkart-shadow rounded-sm bg-white p-6 animate-pulse">
        <div className="flex items-center gap-4 mb-6">
          <div className="h-20 w-20 bg-gray-200 rounded-full" />
          <div className="space-y-2">
            <div className="h-6 bg-gray-200 rounded w-40" />
            <div className="h-4 bg-gray-200 rounded w-56" />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-2">
              <div className="h-3 bg-gray-200 rounded w-24" />
              <div className="h-5 bg-gray-200 rounded w-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="flipkart-shadow rounded-sm bg-white overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <div className="h-6 bg-gray-200 rounded w-48 animate-pulse" />
      </div>
      <div className="divide-y divide-gray-200">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="p-4 flex items-center justify-between animate-pulse">
            <div className="space-y-2 flex-1">
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-3 bg-gray-200 rounded w-1/2" />
            </div>
            <div className="h-8 bg-gray-200 rounded w-20" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function PageHeaderSkeleton() {
  return (
    <div className="space-y-2 animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-64" />
      <div className="h-4 bg-gray-200 rounded w-96" />
    </div>
  );
}
