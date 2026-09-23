import { ProductGridSkeleton } from "@/components/ProductGridSkeleton";

/**
 * Next.js's automatic loading UI for the home route — shown during full
 * navigations here (including search/category link clicks, which re-render
 * the page server-side) while the real content is still being fetched.
 */
export default function Loading() {
  return (
    <div aria-busy="true" aria-label="Loading products">
      <div className="border-b border-line bg-paper">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <div className="h-9 w-3/4 max-w-md animate-pulse rounded bg-ground sm:h-12" />
          <div className="mt-4 h-4 w-1/2 max-w-sm animate-pulse rounded bg-ground" />
        </div>
      </div>
      <div className="mx-auto flex max-w-6xl gap-2 overflow-hidden px-4 py-4 sm:px-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-8 w-20 shrink-0 animate-pulse rounded-full bg-ground" />
        ))}
      </div>
      <ProductGridSkeleton />
    </div>
  );
}
