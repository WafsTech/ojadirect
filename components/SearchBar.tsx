"use client";

import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { SearchIcon } from "@/components/Icons";

interface SuggestionProduct {
  name: string;
  slug: string;
  category: string;
}

/**
 * The header renders this twice (once for the desktop layout, once for
 * mobile — CSS just toggles which is visible), so every id here is derived
 * from useId() rather than hardcoded, or the two instances would collide.
 */
export function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") ?? "";
  const category = searchParams.get("category");

  const [value, setValue] = useState(initialQuery);
  const [products, setProducts] = useState<SuggestionProduct[] | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);

  const inputId = useId();
  const listboxId = useId();

  // Fetches the full published catalogue's {name, slug, category} once, on
  // first focus, and filters it client-side as the person types. This is
  // fine at a dozen products. Once the catalogue passes a few hundred, this
  // should be replaced with a server-side search/suggest endpoint instead of
  // shipping the whole product list to the browser.
  async function ensureProductsLoaded() {
    if (products) return;
    const supabase = createClient();
    const { data, error } = await supabase
      .from("products")
      .select("name, slug, category")
      .eq("is_published", true);
    if (!error) setProducts((data ?? []) as SuggestionProduct[]);
  }

  const suggestions = useMemo(() => {
    const term = value.trim().toLowerCase();
    if (!products || term.length === 0) return [];
    return products.filter((p) => p.name.toLowerCase().includes(term)).slice(0, 6);
  }, [products, value]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function goToProduct(slug: string) {
    setIsOpen(false);
    router.push(`/product/${slug}`);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (!isOpen || suggestions.length === 0) return;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((i) => (i + 1) % suggestions.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((i) => (i <= 0 ? suggestions.length - 1 : i - 1));
    } else if (event.key === "Enter" && activeIndex >= 0) {
      event.preventDefault();
      goToProduct(suggestions[activeIndex].slug);
    } else if (event.key === "Escape") {
      setIsOpen(false);
    }
  }

  return (
    <div ref={containerRef} className="relative w-full">
      <form
        action="/"
        method="GET"
        role="search"
        className="flex items-center gap-2 rounded-full border border-line bg-ground px-4 py-2.5 focus-within:ring-2 focus-within:ring-green"
      >
        <SearchIcon className="h-4 w-4 shrink-0 text-muted" aria-hidden="true" />
        <label htmlFor={inputId} className="sr-only">
          Search products and categories
        </label>
        <input
          id={inputId}
          name="q"
          type="search"
          autoComplete="off"
          value={value}
          onChange={(event) => {
            setValue(event.target.value);
            setIsOpen(true);
            setActiveIndex(-1);
          }}
          onFocus={() => {
            ensureProductsLoaded();
            setIsOpen(true);
          }}
          onKeyDown={handleKeyDown}
          placeholder="Search products and categories"
          role="combobox"
          aria-expanded={isOpen && suggestions.length > 0}
          aria-controls={listboxId}
          aria-autocomplete="list"
          className="w-full bg-transparent text-sm text-ink placeholder:text-muted focus:outline-none"
        />
        {category && <input type="hidden" name="category" value={category} />}
      </form>

      {isOpen && suggestions.length > 0 && (
        <ul
          id={listboxId}
          role="listbox"
          className="absolute left-0 right-0 top-full z-30 mt-1 overflow-hidden rounded-[14px] border border-line bg-paper shadow-sm"
        >
          {suggestions.map((product, index) => (
            <li key={product.slug} role="option" aria-selected={index === activeIndex}>
              <button
                type="button"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => goToProduct(product.slug)}
                className={`block w-full px-4 py-2.5 text-left text-sm ${
                  index === activeIndex ? "bg-green-tint text-green-dark" : "text-ink hover:bg-ground"
                }`}
              >
                {product.name}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
