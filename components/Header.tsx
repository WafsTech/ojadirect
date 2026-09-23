import Link from "next/link";
import { Suspense } from "react";
import { SearchBar } from "@/components/SearchBar";
import { HeaderCategoryBar } from "@/components/HeaderCategoryBar";
import { CitySelector } from "@/components/CitySelector";
import { CartButton } from "@/components/CartButton";
import { SearchIcon } from "@/components/Icons";
import type { CityCode } from "@/lib/city";

const SEARCH_FALLBACK = (
  <div className="h-10 animate-pulse rounded-full border border-line bg-ground" />
);

export function Header({ selectedCity }: { selectedCity: CityCode }) {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/95 backdrop-blur">
      {/* Desktop: logo / centered search / city + cart, category bar below */}
      <div className="mx-auto hidden max-w-6xl items-center gap-4 px-6 py-3 md:flex">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2 font-display text-xl font-extrabold text-green-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-green text-sm text-paper">
            OD
          </span>
          Oja Direct
        </Link>

        <div className="mx-auto w-full max-w-xl">
          <Suspense fallback={SEARCH_FALLBACK}>
            <SearchBar />
          </Suspense>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <CitySelector selected={selectedCity} />
          <CartButton />
        </div>
      </div>
      <div className="hidden border-t border-line md:block">
        <Suspense fallback={null}>
          <HeaderCategoryBar />
        </Suspense>
      </div>

      {/* Mobile: logo+icons row, full-width search row, "Deliver to" row */}
      <div className="flex flex-col gap-2 px-4 py-3 md:hidden">
        <div className="flex items-center justify-between gap-3">
          <Link
            href="/"
            className="flex items-center gap-2 font-display text-lg font-extrabold text-green-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-green text-xs text-paper">
              OD
            </span>
            Oja Direct
          </Link>
          <div className="flex items-center gap-2">
            <a
              href="#search"
              aria-label="Jump to search"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green"
            >
              <SearchIcon className="h-4 w-4" aria-hidden="true" />
            </a>
            <CartButton />
          </div>
        </div>

        <div id="search">
          <Suspense fallback={SEARCH_FALLBACK}>
            <SearchBar />
          </Suspense>
        </div>

        <CitySelector selected={selectedCity} variant="row" />
      </div>
    </header>
  );
}
