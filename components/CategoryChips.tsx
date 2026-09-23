import Link from "next/link";
import type { Category } from "@/lib/types";

export function CategoryChips({
  categories,
  selected,
  query,
}: {
  categories: { value: Category; label: string }[];
  selected?: Category;
  query?: string;
}) {
  function hrefFor(value?: Category) {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (value) params.set("category", value);
    const qs = params.toString();
    return qs ? `/?${qs}` : "/";
  }

  function chipClass(active: boolean) {
    return `inline-block rounded-full border px-4 py-2 text-sm font-medium transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green ${
      active
        ? "border-green bg-green text-paper"
        : "border-line bg-paper text-ink hover:border-green"
    }`;
  }

  return (
    <nav aria-label="Filter by category" className="mx-auto max-w-6xl px-4 py-4 sm:px-6">
      <ul className="flex flex-wrap gap-2">
        <li>
          <Link href={hrefFor(undefined)} aria-current={!selected ? "page" : undefined} className={chipClass(!selected)}>
            All
          </Link>
        </li>
        {categories.map((c) => (
          <li key={c.value}>
            <Link
              href={hrefFor(c.value)}
              aria-current={selected === c.value ? "page" : undefined}
              className={chipClass(selected === c.value)}
            >
              {c.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
