"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/lib/cart-context";
import { QuantitySelector } from "@/components/QuantitySelector";
import { WhatsAppIcon } from "@/components/Icons";
import { formatNaira } from "@/lib/format";
import { quoteForCart } from "@/lib/delivery";
import { buildCartMessage, whatsAppLink } from "@/lib/whatsapp";
import { CITY_LABELS, type CityCode } from "@/lib/city";
import type { City, DeliveryRate } from "@/lib/types";

export function CartClient({
  cities,
  rates,
  customerCity,
  whatsappNumber,
}: {
  cities: City[];
  rates: DeliveryRate[];
  customerCity: CityCode;
  whatsappNumber: string;
}) {
  const { items, removeItem, setQty, subtotal, isHydrated } = useCart();

  if (!isHydrated) {
    return <p className="mt-6 text-sm text-muted">Loading your cart…</p>;
  }

  if (items.length === 0) {
    return (
      <div className="mt-6 rounded-[16px] border border-line bg-paper p-8 text-center">
        <p className="text-muted">Your cart is empty.</p>
        <Link
          href="/"
          className="mt-4 inline-block rounded-full bg-green px-6 py-3 text-sm font-semibold text-paper hover:bg-green-dark"
        >
          Start shopping
        </Link>
      </div>
    );
  }

  const supplierCities = items.map((item) => item.supplierCity);
  const { fee, etaText } = quoteForCart(rates, supplierCities, customerCity);
  const total = subtotal + fee;
  const mixedCities = new Set(supplierCities).size > 1;
  const city = cities.find((c) => c.code === customerCity);

  const message = buildCartMessage({
    lines: items.map((item) => ({ name: item.name, qty: item.qty, price: item.price })),
    city: CITY_LABELS[customerCity],
    subtotal,
    deliveryFee: fee,
    total,
  });

  return (
    <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_320px]">
      <ul className="flex flex-col gap-4">
        {items.map((item) => (
          <li key={item.productId} className="flex gap-4 rounded-[16px] border border-line bg-paper p-4">
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-[12px] bg-ground">
              {item.image && (
                <Image src={item.image} alt={item.name} fill sizes="80px" className="object-cover" />
              )}
            </div>
            <div className="flex flex-1 flex-col gap-1">
              <Link
                href={`/product/${item.slug}`}
                className="text-sm font-semibold text-ink hover:text-green-dark"
              >
                {item.name}
              </Link>
              <span className="text-xs text-muted">
                Ships from {CITY_LABELS[item.supplierCity]}
              </span>
              <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-2">
                <QuantitySelector
                  value={item.qty}
                  onChange={(qty) => setQty(item.productId, qty)}
                />
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-ink">
                    {formatNaira(item.price * item.qty)}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeItem(item.productId)}
                    className="text-xs font-medium text-muted underline-offset-2 hover:text-ink hover:underline"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <div className="h-fit rounded-[16px] border border-line bg-paper p-5">
        <h2 className="font-display text-lg font-extrabold text-ink">Order summary</h2>

        {mixedCities && (
          <p className="mt-2 rounded-[10px] bg-green-tint px-3 py-2 text-xs text-green-dark">
            Your cart has items from more than one city — we charge the
            highest applicable delivery fee once, for the slowest ETA.
          </p>
        )}

        <dl className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted">Subtotal</dt>
            <dd className="text-ink">{formatNaira(subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted">Delivery to {city?.name ?? CITY_LABELS[customerCity]}</dt>
            <dd className="text-ink">{formatNaira(fee)}</dd>
          </div>
          <div className="flex justify-between text-xs text-muted">
            <dt>Estimated arrival</dt>
            <dd>{etaText}</dd>
          </div>
          <div className="flex justify-between border-t border-line pt-2 text-base font-semibold">
            <dt className="text-ink">Total</dt>
            <dd className="text-ink">{formatNaira(total)}</dd>
          </div>
        </dl>

        <button
          type="button"
          disabled
          aria-describedby="payment-note"
          className="mt-5 w-full cursor-not-allowed rounded-full bg-line px-6 py-3 text-sm font-semibold text-muted"
        >
          Continue to payment
        </button>
        <p id="payment-note" className="mt-2 text-center text-xs text-muted">
          Payments launching soon
        </p>

        {whatsappNumber && (
          <a
            href={whatsAppLink(whatsappNumber, message)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 flex items-center justify-center gap-2 rounded-full border border-line px-6 py-3 text-sm font-semibold text-ink transition hover:border-green focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green"
          >
            <WhatsAppIcon className="h-4 w-4" aria-hidden="true" />
            Order on WhatsApp
          </a>
        )}
      </div>
    </div>
  );
}
