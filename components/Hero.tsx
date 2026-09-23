import Image from "next/image";
import { PriceSticker } from "@/components/PriceSticker";
import { formatNaira, percentOff } from "@/lib/format";
import type { ProductWithSupplier } from "@/lib/types";

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
            every item before dispatch, and deliver straight to you. No pay on
            delivery — pay up front, tracked all the way.
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
              className="rounded-full border border-line px-6 py-3 text-sm font-semibold text-ink transition hover:border-green"
            >
              How it works
            </a>
          </div>
        </div>

        {product && (
          <div className="relative mx-auto w-full max-w-sm rounded-[22px] border border-line bg-ground p-5">
            <div className="relative aspect-square overflow-hidden rounded-[16px] bg-paper">
              {product.image_urls[0] && (
                <Image
                  src={product.image_urls[0]}
                  alt={product.name}
                  fill
                  sizes="(min-width: 768px) 384px, 90vw"
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
    </section>
  );
}
