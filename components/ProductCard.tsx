import Link from "next/link";
import Image from "next/image";
import { PriceSticker } from "@/components/PriceSticker";
import { AddToCartButton } from "@/components/AddToCartButton";
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
  const quote = supplierCity ? quoteForSupplier(rates, supplierCity, customerCity) : null;
  const savings = product.mall_price - product.price;

  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-line bg-paper">
      <Link
        href={`/product/${product.slug}`}
        className="group block focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green"
      >
        <div className="relative aspect-square bg-ground">
          {product.image_urls[0] ? (
            <Image
              src={product.image_urls[0]}
              alt={product.name}
              fill
              sizes="(min-width: 1024px) 23vw, 45vw"
              loading="lazy"
              className="object-cover transition duration-300 group-hover:scale-[1.02]"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-xs text-muted">No image</div>
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

        <div className="flex flex-col gap-1 p-3 pb-0">
          <h3 className="line-clamp-2 text-sm font-semibold text-ink">{product.name}</h3>

          <div className="flex flex-wrap items-baseline gap-x-2">
            <span className="font-display text-base font-extrabold text-ink">
              {formatNaira(product.price)}
            </span>
            <span className="text-xs text-muted line-through">{formatNaira(product.mall_price)}</span>
          </div>
          <span className="text-xs font-semibold text-green-dark">Save {formatNaira(savings)}</span>

          {supplierCity && (
            <span className="text-[11px] text-muted">Ships from {CITY_LABELS[supplierCity]}</span>
          )}
          {quote && (
            <span className="text-[11px] text-muted">
              {formatNaira(quote.fee)} delivery · {quote.etaText}
            </span>
          )}
        </div>
      </Link>

      <div className="p-3 pt-2">
        <AddToCartButton product={product} />
      </div>
    </article>
  );
}
