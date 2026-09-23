"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { setCity } from "@/lib/actions";
import { CITY_CODES, CITY_LABELS, type CityCode } from "@/lib/city";

export function CitySelector({
  selected,
  variant = "pill",
}: {
  selected: CityCode;
  /** "pill" = compact, used next to the cart button. "row" = full-width "Deliver to: City ▾" row, used on mobile. */
  variant?: "pill" | "row";
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleChange(next: string) {
    startTransition(async () => {
      await setCity(next);
      router.refresh();
    });
  }

  const isRow = variant === "row";

  return (
    <label
      className={
        isRow
          ? "flex w-full items-center gap-1.5 rounded-full border border-line bg-paper px-4 py-2.5 text-sm text-ink"
          : "flex items-center gap-1 rounded-full border border-line bg-paper px-3 py-2 text-sm text-ink transition hover:border-green"
      }
    >
      <span className="sr-only">Delivery city</span>
      {isRow ? (
        <span className="text-muted">Deliver to:</span>
      ) : (
        <span aria-hidden="true" className="text-muted">
          📍
        </span>
      )}
      <select
        value={selected}
        disabled={isPending}
        onChange={(event) => handleChange(event.target.value)}
        className="flex-1 bg-transparent font-semibold text-ink focus:outline-none disabled:opacity-60"
      >
        {CITY_CODES.map((code) => (
          <option key={code} value={code}>
            {CITY_LABELS[code]}
          </option>
        ))}
      </select>
      <span aria-hidden="true" className="text-muted">
        ▾
      </span>
    </label>
  );
}
