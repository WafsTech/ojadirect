import { percentOff } from "@/lib/format";
import type { ProductWithSupplier, Category } from "@/lib/types";

/**
 * Pure, in-memory helpers over an already-fetched product list. Kept separate
 * from lib/data.ts (which only talks to Supabase) so the homepage can fetch
 * the published catalogue once and derive the hero pick, deals and category
 * counts from that single list instead of issuing extra queries.
 */

export function pickFeaturedProduct(
  products: ProductWithSupplier[]
): ProductWithSupplier | null {
  if (products.length === 0) return null;
  return products.reduce((best, product) =>
    percentOff(product.price, product.mall_price) > percentOff(best.price, best.mall_price)
      ? product
      : best
  );
}

/** "Today's best deals" — the products with the largest percentage saving. */
export function pickTopDeals(
  products: ProductWithSupplier[],
  limit = 4
): ProductWithSupplier[] {
  return [...products]
    .sort(
      (a, b) => percentOff(b.price, b.mall_price) - percentOff(a.price, a.mall_price)
    )
    .slice(0, limit);
}

export function computeCategoryCounts(
  products: ProductWithSupplier[]
): Record<Category, number> {
  const counts: Record<Category, number> = {
    kitchen: 0,
    fans: 0,
    phones: 0,
    fashion: 0,
    home: 0,
  };
  for (const product of products) counts[product.category] += 1;
  return counts;
}

export function matchesQuery(product: ProductWithSupplier, query: string): boolean {
  const term = query.trim().toLowerCase();
  if (!term) return true;
  return (
    product.name.toLowerCase().includes(term) ||
    product.category.toLowerCase().includes(term)
  );
}
