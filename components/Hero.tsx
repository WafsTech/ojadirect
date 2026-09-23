import Image from "next/image";
import { PriceSticker } from "@/components/PriceSticker";
import { formatNaira, percentOff } from "@/lib/format";
import type { ProductWithSupplier } from "@/lib/types";

const TRUST_ITEMS = [
  "Verified warehouses",
  "Checked before dispatch",
  "Transparent delivery fees",
  "Refund or replacement for wrong or damaged items",
];

export function Hero({ product }: { product: ProductWithSupplier | null }) {
  return (
    <section className="border-b border-line bg-paper">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-2 md:items-center md:py-16">
        <div>
          <h1 className="font-display text-3xl font-extrabold leading-tight text-ink sm:text-4xl md:text-5xl">
            Buy direct from the warehouse. Skip the mall markup.
          </h1>
          <p className="mt-4 max-w-md text-base text-muted sm:text-lg">
            We buy from verified wholesalers in Lagos, Ota and Ibadan, check
            every item before dispatch, and you pay upfront — no pay on
            delivery.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href="#products"
              className="rounded-full bg-green px-6 py-3 text-sm font-semibold text-paper transition hover:bg-green-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-dark"
            >
              Shop now
            </a>
            <a
              href="#how-it-works"
              className="rounded-full border border-line px-6 py-3 text-sm font-semibold text-ink transition hover:border-green focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green"
            >
              How it works
            </a>
          </div>
        </div>

        {product && (
          <div className="relative mx-auto w-full max-w-sm rounded-[22px] border border-line bg-ground p-5">
            <div className="relative aspect-square overflow-hidden rounded-2xl bg-paper">
              {product.image_urls[0] && (
                <Image
                  src={product.image_urls[0]}
                  alt={product.name}
                  fill
                  sizes="(min-width: 768px) 384px, 90vw"
                  priority
                  className="object-cover"
                />
              )}
              <PriceSticker
                percentOff={percentOff(product.price, product.mall_price)}
                className="absolute -right-3 -top-3"
              />
            </div>
            <p className="mt-4 text-sm font-medium text-muted">{product.name}</p>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="font-display text-2xl font-extrabold text-ink">
                {formatNaira(product.price)}
              </span>
              <span className="text-sm text-muted line-through">
                {formatNaira(product.mall_price)}
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="border-t border-line bg-ground">
        <ul className="mx-auto flex max-w-6xl flex-wrap justify-center gap-x-6 gap-y-2 px-4 py-3 text-xs font-medium text-muted sm:px-6 sm:text-sm">
          {TRUST_ITEMS.map((item) => (
            <li key={item} className="flex items-center gap-1.5">
              <span aria-hidden="true" className="text-green">
                ✓
              </span>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
