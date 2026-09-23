"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/lib/cart-context";
import { HomeIcon, GridIcon, SearchIcon, CartIcon } from "@/components/Icons";

const ITEMS = [
  { href: "/", label: "Home", Icon: HomeIcon, isRoute: true },
  // The category strip only exists on the homepage, so this always routes
  // there; the search box lives in the header on every page, so that one
  // just scrolls up on whichever page you're already on.
  { href: "/#categories", label: "Categories", Icon: GridIcon, isRoute: false },
  { href: "#search", label: "Search", Icon: SearchIcon, isRoute: false },
  { href: "/cart", label: "Cart", Icon: CartIcon, isRoute: true },
] as const;

export function MobileBottomNav() {
  const pathname = usePathname();
  const { count, isHydrated } = useCart();

  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-paper pb-[env(safe-area-inset-bottom)] md:hidden"
    >
      <ul className="flex items-stretch justify-around">
        {ITEMS.map((item) => {
          const active = item.isRoute && pathname === item.href;
          return (
            <li key={item.label} className="flex-1">
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`flex flex-col items-center gap-0.5 py-2.5 text-[11px] font-medium focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-green ${
                  active ? "text-green-dark" : "text-muted"
                }`}
              >
                <span className="relative">
                  <item.Icon className="h-5 w-5" aria-hidden="true" />
                  {item.href === "/cart" && isHydrated && count > 0 && (
                    <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-sticker px-1 text-[9px] font-bold text-sticker-ink">
                      {count}
                    </span>
                  )}
                </span>
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
