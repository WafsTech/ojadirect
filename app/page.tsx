import { getCities, getDeliveryRates, getProducts } from "@/lib/data";
import { getSelectedCity } from "@/lib/city-server";
import { pickFeaturedProduct, pickTopDeals, computeCategoryCounts, matchesQuery } from "@/lib/catalog";
import { CATEGORIES } from "@/lib/categories";
import { Hero } from "@/components/Hero";
import { CategoryNav } from "@/components/CategoryNav";
import { ProductGrid } from "@/components/ProductGrid";
import { ProductCard } from "@/components/ProductCard";
import { HowItWorks } from "@/components/HowItWorks";
import { DeliveryInfo } from "@/components/DeliveryInfo";
import { TrustSection } from "@/components/TrustSection";
import type { Category } from "@/lib/types";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string }>;
}) {
  const { q, category } = await searchParams;
  const validCategory: Category | undefined = CATEGORIES.find((c) => c.value === category)?.value;

  const [cities, rates, allProducts, selectedCityCode] = await Promise.all([
    getCities(),
    getDeliveryRates(),
    // Fetched once, unfiltered: the hero pick, category counts and deals all
    // derive from this same list (see lib/catalog.ts), and it doubles as the
    // grid when there's no search/category filter applied.
    getProducts({}),
    getSelectedCity(),
  ]);

  const categoryCounts = computeCategoryCounts(allProducts);
  const featuredProduct = pickFeaturedProduct(allProducts);
  const topDeals = pickTopDeals(allProducts, 4);
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "";

  const isFiltered = Boolean(q || validCategory);
  const products = isFiltered
    ? allProducts.filter(
        (product) =>
          (!validCategory || product.category === validCategory) &&
          (!q || matchesQuery(product, q))
      )
    : allProducts;

  return (
    <>
      <Hero product={featuredProduct} />

      <section className="border-b border-line bg-paper py-6">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="font-display text-lg font-extrabold text-ink">Shop by category</h2>
        </div>
        <div className="mt-3">
          <CategoryNav
            id="categories"
            categories={CATEGORIES}
            selected={validCategory}
            query={q}
            counts={categoryCounts}
            variant="strip"
          />
        </div>
      </section>

      {!isFiltered && topDeals.length > 0 && (
        <section className="border-b border-line py-8">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <h2 className="font-display text-xl font-extrabold text-ink sm:text-2xl">
              Today&apos;s best deals
            </h2>
            <p className="mt-1 text-sm text-muted">The biggest savings against the mall price, right now.</p>
          </div>
          <div className="mx-auto mt-4 grid max-w-6xl grid-cols-2 gap-3 px-4 sm:gap-4 sm:px-6 lg:grid-cols-4">
            {topDeals.map((product) => (
              <ProductCard key={product.id} product={product} rates={rates} customerCity={selectedCityCode} />
            ))}
          </div>
        </section>
      )}

      <ProductGrid
        products={products}
        rates={rates}
        customerCity={selectedCityCode}
        query={q}
        whatsappNumber={whatsappNumber}
      />

      <HowItWorks />
      <DeliveryInfo cities={cities} selected={selectedCityCode} />
      <TrustSection />
    </>
  );
}
