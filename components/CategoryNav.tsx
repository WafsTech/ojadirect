import Link from "next/link";
import type { Category } from "@/lib/types";
import type { CategoryOption } from "@/lib/categories";

/**
 * Two visual modes, one component: a compact filter bar (used under the
 * desktop header, no counts) and a counted strip (used in the homepage
 * "shop by category" section). Both are plain server-rendered links so
 * filtering never needs client JS.
 */
export function CategoryNav({
  categories,
  selected,
  query,
  counts,
  variant = "bar",
  id,
}: {
  categories: CategoryOption[];
  selected?: Category;
  query?: string;
  counts?: Partial<Record<Category, number>>;
  variant?: "bar" | "strip";
  id?: string;
}) {
  function hrefFor(value?: Category) {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (value) params.set("category", value);
    const qs = params.toString();
    return qs ? `/?${qs}#products` : "/#products";
  }

  const isBar = variant === "bar";
  const totalCount = counts
    ? Object.values(counts).reduce((sum: number, n) => sum + (n ?? 0), 0)
    : undefined;

  return (
    <nav id={id} aria-label="Shop by category">
      <ul
        className={
          isBar
            ? "mx-auto flex max-w-6xl gap-2 overflow-x-auto px-4 py-2 sm:px-6 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            : "mx-auto flex max-w-6xl gap-3 overflow-x-auto px-4 pb-2 sm:px-6 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        }
      >
        <li className="shrink-0">
          <Link
            href={hrefFor(undefined)}
            aria-current={!selected ? "page" : undefined}
            className={isBar ? chipClass(!selected) : tileClass(!selected)}
          >
            <span>All</span>
            {!isBar && totalCount !== undefined && (
              <span className="text-xs text-muted">{totalCount}</span>
            )}
          </Link>
        </li>
        {categories.map((category) => (
          <li key={category.value} className="shrink-0">
            <Link
              href={hrefFor(category.value)}
              aria-current={selected === category.value ? "page" : undefined}
              className={isBar ? chipClass(selected === category.value) : tileClass(selected === category.value)}
            >
              <span>{category.label}</span>
              {!isBar && counts && (
                <span className="text-xs text-muted">{counts[category.value] ?? 0}</span>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function chipClass(active: boolean) {
  return `inline-flex whitespace-nowrap rounded-full border px-4 py-1.5 text-sm font-medium transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green ${
    active ? "border-green bg-green text-paper" : "border-line bg-paper text-ink hover:border-green"
  }`;
}

function tileClass(active: boolean) {
  return `flex min-w-[100px] flex-col items-center gap-0.5 whitespace-nowrap rounded-[14px] border px-4 py-3 text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green ${
    active ? "border-green bg-green-tint text-green-dark" : "border-line bg-paper text-ink hover:border-green"
  }`;
}
