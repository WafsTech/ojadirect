import { notFound } from "next/navigation";
import Image from "next/image";
import type { Metadata } from "next";
import { getProductBySlug, getDeliveryRates } from "@/lib/data";
import { CITY_LABELS } from "@/lib/city";
import { getSelectedCity } from "@/lib/city-server";
import { quoteForSupplier } from "@/lib/delivery";
import { formatNaira, percentOff } from "@/lib/format";
import { PriceSticker } from "@/components/PriceSticker";
import { ProductActions } from "@/components/ProductActions";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product not found — Oja Direct" };
  return {
    title: `${product.name} — Oja Direct`,
    description: product.description,
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [product, rates, customerCity] = await Promise.all([
    getProductBySlug(slug),
    getDeliveryRates(),
    getSelectedCity(),
  ]);

  if (!product) notFound();

  const supplierCity = product.supplier?.city_code;
  const quote = supplierCity
    ? quoteForSupplier(rates, supplierCity, customerCity)
    : null;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="grid gap-8 md:grid-cols-2">
        <div className="relative aspect-square overflow-hidden rounded-[22px] border border-line bg-ground">
          {product.image_urls[0] && (
            <Image
              src={product.image_urls[0]}
              alt={product.name}
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
              priority
            />
          )}
          <PriceSticker
            percentOff={percentOff(product.price, product.mall_price)}
            className="absolute -right-3 -top-3"
          />
        </div>

        <div>
          {supplierCity && (
            <p className="text-sm font-medium uppercase tracking-wide text-green-dark">
              Ships from {CITY_LABELS[supplierCity]}
            </p>
          )}
          <h1 className="mt-1 font-display text-2xl font-extrabold text-ink sm:text-3xl">
            {product.name}
          </h1>

          {product.quality_labels.length > 0 && (
            <ul className="mt-3 flex flex-wrap gap-2">
              {product.quality_labels.map((label) => (
                <li
                  key={label}
                  className="rounded-full border border-line bg-paper px-3 py-1 text-xs font-semibold text-green-dark"
                >
                  {label}
                </li>
              ))}
            </ul>
          )}

          <div className="mt-4 flex items-baseline gap-3">
            <span className="font-display text-3xl font-extrabold text-ink">
              {formatNaira(product.price)}
            </span>
            <span className="text-base text-muted line-through">
              {formatNaira(product.mall_price)}
            </span>
          </div>

          {quote && (
            <p className="mt-2 rounded-[12px] border border-line bg-green-tint px-3 py-2 text-sm text-green-dark">
              Delivery to {CITY_LABELS[customerCity]}: {formatNaira(quote.fee)} ·{" "}
              {quote.etaText}
            </p>
          )}

          <p className="mt-4 text-sm text-muted">{product.description}</p>

          <ProductActions
            product={product}
            customerCity={customerCity}
            whatsappNumber={process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? ""}
          />
        </div>
      </div>
    </div>
  );
}
