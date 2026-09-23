import Link from "next/link";
import { Suspense } from "react";
import { SearchInput } from "@/components/SearchInput";
import { CitySelector } from "@/components/CitySelector";
import { CartButton } from "@/components/CartButton";
import type { CityCode } from "@/lib/city";

export function Header({ selectedCity }: { selectedCity: CityCode }) {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-4 py-3 sm:gap-4 sm:px-6">
        <Link
          href="/"
          className="order-1 flex shrink-0 items-center gap-2 font-display text-xl font-extrabold text-green-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-green text-sm text-paper">
            OD
          </span>
          Oja Direct
        </Link>

        <div className="order-3 w-full sm:order-2 sm:max-w-md sm:flex-1">
          <Suspense fallback={<div className="h-10 rounded-full border border-line bg-ground" />}>
            <SearchInput />
          </Suspense>
        </div>

        <div className="order-2 ml-auto flex items-center gap-2 sm:order-3 sm:ml-0">
          <CitySelector selected={selectedCity} />
          <CartButton />
        </div>
      </div>
    </header>
  );
}
