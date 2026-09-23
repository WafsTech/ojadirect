import { ProductCard } from "@/components/ProductCard";
import type { ProductWithSupplier, DeliveryRate } from "@/lib/types";
import type { CityCode } from "@/lib/city";

export function ProductGrid({
  products,
  rates,
  customerCity,
}: {
  products: ProductWithSupplier[];
  rates: DeliveryRate[];
  customerCity: CityCode;
}) {
  return (
    <section id="products" className="mx-auto max-w-6xl px-4 pb-12 sm:px-6">
      {products.length === 0 ? (
        <p className="rounded-[16px] border border-line bg-paper px-4 py-10 text-center text-muted">
          No products match your search yet. Try another keyword or category.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              rates={rates}
              customerCity={customerCity}
            />
          ))}
        </div>
      )}
    </section>
  );
}
