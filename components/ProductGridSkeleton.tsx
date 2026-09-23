/** Matches ProductGrid's real dimensions so nothing jumps when data arrives. */
export function ProductGridSkeleton() {
  return (
    <div className="mx-auto max-w-6xl px-4 pb-12 sm:px-6" aria-hidden="true">
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="overflow-hidden rounded-2xl border border-line bg-paper">
            <div className="aspect-square animate-pulse bg-ground" />
            <div className="flex flex-col gap-2 p-3">
              <div className="h-3.5 w-4/5 animate-pulse rounded bg-ground" />
              <div className="h-3.5 w-2/5 animate-pulse rounded bg-ground" />
              <div className="h-3 w-3/5 animate-pulse rounded bg-ground" />
              <div className="mt-1 h-8 w-full animate-pulse rounded-full bg-ground" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
