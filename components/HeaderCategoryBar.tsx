"use client";

import { useSearchParams } from "next/navigation";
import { CategoryNav } from "@/components/CategoryNav";
import { CATEGORIES } from "@/lib/categories";

/**
 * Thin client wrapper so the header's category bar can read the current
 * `category`/`q` params to highlight the active filter. The header itself
 * lives in the root layout, which has no access to page-level searchParams.
 */
export function HeaderCategoryBar() {
  const searchParams = useSearchParams();
  const q = searchParams.get("q") ?? undefined;
  const categoryParam = searchParams.get("category");
  const selected = CATEGORIES.find((c) => c.value === categoryParam)?.value;

  return <CategoryNav categories={CATEGORIES} selected={selected} query={q} variant="bar" />;
}
