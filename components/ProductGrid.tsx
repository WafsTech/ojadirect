import { ProductCard } from "@/components/ProductCard";
import { EmptyState } from "@/components/EmptyState";
import { SearchIcon, WhatsAppIcon } from "@/components/Icons";
import { CATEGORIES } from "@/lib/categories";
import { buildSearchHelpMessage, whatsAppLink } from "@/lib/whatsapp";
import type { ProductWithSupplier, DeliveryRate } from "@/lib/types";
import type { CityCode } from "@/lib/city";

export function ProductGrid({
  products,
  rates,
  customerCity,
  query,
  whatsappNumber,
}: {
  products: ProductWithSupplier[];
  rates: DeliveryRate[];
  customerCity: CityCode;
  query?: string;
  whatsappNumber: string;
}) {
  if (products.length === 0) {
    return (
      <section id="products" className="mx-auto max-w-6xl px-4 pb-12 sm:px-6">
        <EmptyState
          icon={<SearchIcon className="h-5 w-5" aria-hidden="true" />}
          title={query ? `No products match "${query}"` : "No products available yet"}
          message={
            query
              ? "Try a different keyword, or browse a category instead."
              : "Check back soon — we're restocking."
          }
          action={
            <div className="flex flex-wrap items-center justify-center gap-2">
              {CATEGORIES.map((category) => (
                <a
                  key={category.value}
                  href={`/?category=${category.value}`}
                  className="rounded-full border border-line px-4 py-2 text-sm font-medium text-ink transition hover:border-green focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green"
                >
                  {category.label}
                </a>
              ))}
              {query && whatsappNumber && (
                <a
                  href={whatsAppLink(whatsappNumber, buildSearchHelpMessage(query))}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-green px-4 py-2 text-sm font-semibold text-paper transition hover:bg-green-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-dark"
                >
                  <WhatsAppIcon className="h-4 w-4" aria-hidden="true" />
                  Ask us on WhatsApp
                </a>
              )}
            </div>
          }
        />
      </section>
    );
  }

  return (
    <section id="products" className="mx-auto max-w-6xl px-4 pb-12 sm:px-6">
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} rates={rates} customerCity={customerCity} />
        ))}
      </div>
    </section>
  );
}
