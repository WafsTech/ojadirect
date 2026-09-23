import Link from "next/link";
import Image from "next/image";
import { PriceSticker } from "@/components/PriceSticker";
import { formatNaira, percentOff } from "@/lib/format";
import { quoteForSupplier } from "@/lib/delivery";
import { CITY_LABELS, type CityCode } from "@/lib/city";
import type { ProductWithSupplier, DeliveryRate } from "@/lib/types";

export function ProductCard({
  product,
  rates,
  customerCity,
}: {
  product: ProductWithSupplier;
  rates: DeliveryRate[];
  customerCity: CityCode;
}) {
  const supplierCity = product.supplier?.city_code;
  const quote = supplierCity
    ? quoteForSupplier(rates, supplierCity, customerCity)
    : null;

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-[16px] border border-line bg-paper transition hover:border-green focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green"
    >
      <div className="relative aspect-square bg-ground">
        {product.image_urls[0] && (
          <Image
            src={product.image_urls[0]}
            alt={product.name}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition duration-300 group-hover:scale-[1.02]"
          />
        )}
        <PriceSticker
          percentOff={percentOff(product.price, product.mall_price)}
          className="absolute -right-2 -top-2"
        />
        {!product.in_stock && (
          <span className="absolute bottom-2 left-2 rounded-full bg-ink/80 px-2 py-1 text-[11px] font-semibold text-paper">
            Out of stock
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1 p-3">
        {supplierCity && (
          <span className="text-[11px] font-medium uppercase tracking-wide text-green-dark">
            Ships from {CITY_LABELS[supplierCity]}
          </span>
        )}
        <h3 className="line-clamp-2 text-sm font-semibold text-ink">{product.name}</h3>
        <div className="mt-auto flex items-baseline gap-2 pt-1">
          <span className="font-display text-base font-extrabold text-ink">
            {formatNaira(product.price)}
          </span>
          <span className="text-xs text-muted line-through">
            {formatNaira(product.mall_price)}
          </span>
        </div>
        {quote && (
          <span className="text-xs text-muted">
            Delivery {formatNaira(quote.fee)} · {quote.etaText}
          </span>
        )}
      </div>
    </Link>
  );
}
