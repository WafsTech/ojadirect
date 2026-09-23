"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { CartIcon } from "@/components/Icons";

export function CartButton() {
  const { count, isHydrated } = useCart();
  const showBadge = isHydrated && count > 0;

  return (
    <Link
      href="/cart"
      aria-label={`Cart, ${count} item${count === 1 ? "" : "s"}`}
      className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-line bg-paper text-ink transition hover:border-green focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green"
    >
      <CartIcon className="h-5 w-5" aria-hidden="true" />
      {showBadge && (
        <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-sticker px-1 text-[11px] font-bold text-sticker-ink">
          {count}
        </span>
      )}
    </Link>
  );
}
