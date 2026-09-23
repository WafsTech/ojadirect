"use client";

import { useState } from "react";
import { useCart } from "@/lib/cart-context";
import type { ProductWithSupplier } from "@/lib/types";

/** Adds one unit straight from the product grid — a sibling of the card's link, not nested inside it. */
export function AddToCartButton({ product }: { product: ProductWithSupplier }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  function handleAdd() {
    if (!product.supplier || !product.in_stock) return;
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      mallPrice: product.mall_price,
      image: product.image_urls[0] ?? null,
      supplierCity: product.supplier.city_code,
    });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1500);
  }

  return (
    <button
      type="button"
      onClick={handleAdd}
      disabled={!product.in_stock}
      className="w-full rounded-full bg-green px-4 py-2 text-sm font-semibold text-paper transition hover:bg-green-dark disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-dark"
    >
      {added ? "Added ✓" : product.in_stock ? "Add to cart" : "Out of stock"}
    </button>
  );
}
