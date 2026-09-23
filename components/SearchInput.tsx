"use client";

import { useSearchParams } from "next/navigation";
import { SearchIcon } from "@/components/Icons";

export function SearchInput() {
  const searchParams = useSearchParams();
  const q = searchParams.get("q") ?? "";
  const category = searchParams.get("category") ?? "";

  return (
    <form
      action="/"
      method="GET"
      role="search"
      className="flex items-center gap-2 rounded-full border border-line bg-ground px-3 py-2 focus-within:ring-2 focus-within:ring-green"
    >
      <SearchIcon className="h-4 w-4 shrink-0 text-muted" aria-hidden="true" />
      <label htmlFor="search-products" className="sr-only">
        Search products
      </label>
      <input
        id="search-products"
        name="q"
        type="search"
        defaultValue={q}
        placeholder="Search kitchenware, fans, phones..."
        className="w-full bg-transparent text-sm text-ink placeholder:text-muted focus:outline-none"
      />
      {category && <input type="hidden" name="category" value={category} />}
    </form>
  );
}
