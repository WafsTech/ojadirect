"use client";

import { useState } from "react";
import { useCart } from "@/lib/cart-context";
import { QuantitySelector } from "@/components/QuantitySelector";
import { WhatsAppIcon } from "@/components/Icons";
import { CITY_LABELS, type CityCode } from "@/lib/city";
import { buildProductMessage, whatsAppLink } from "@/lib/whatsapp";
import type { ProductWithSupplier } from "@/lib/types";

export function ProductActions({
  product,
  customerCity,
  whatsappNumber,
}: {
  product: ProductWithSupplier;
  customerCity: CityCode;
  whatsappNumber: string;
}) {
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const message = buildProductMessage({
    name: product.name,
    qty,
    city: CITY_LABELS[customerCity],
  });

  function handleAdd() {
    if (!product.supplier) return;
    addItem(
      {
        productId: product.id,
        slug: product.slug,
        name: product.name,
        price: product.price,
        mallPrice: product.mall_price,
        image: product.image_urls[0] ?? null,
        supplierCity: product.supplier.city_code,
      },
      qty
    );
    setAdded(true);
    window.setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div className="mt-6 flex flex-col gap-3">
      <QuantitySelector value={qty} onChange={setQty} disabled={!product.in_stock} />
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={handleAdd}
          disabled={!product.in_stock}
          className="rounded-full bg-green px-6 py-3 text-sm font-semibold text-paper transition hover:bg-green-dark disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-dark"
        >
          {added ? "Added ✓" : product.in_stock ? "Add to cart" : "Out of stock"}
        </button>
        {whatsappNumber && (
          <a
            href={whatsAppLink(whatsappNumber, message)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-line px-6 py-3 text-sm font-semibold text-ink transition hover:border-green focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green"
          >
            <WhatsAppIcon className="h-4 w-4" aria-hidden="true" />
            Order on WhatsApp
          </a>
        )}
      </div>
    </div>
  );
}
