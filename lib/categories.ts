import type { Category } from "@/lib/types";

export interface CategoryOption {
  value: Category;
  label: string;
}

/** Single source of truth for the 5 category filters shown across the header, homepage strip and search. */
export const CATEGORIES: CategoryOption[] = [
  { value: "kitchen", label: "Kitchen" },
  { value: "fans", label: "Fans" },
  { value: "phones", label: "Phones" },
  { value: "fashion", label: "Fashion" },
  { value: "home", label: "Home" },
];
