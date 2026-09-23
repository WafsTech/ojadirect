"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { setCity } from "@/lib/actions";
import { CITY_CODES, CITY_LABELS, type CityCode } from "@/lib/city";

export function CitySelector({ selected }: { selected: CityCode }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <label className="flex items-center gap-1 rounded-full border border-line bg-paper px-3 py-2 text-sm text-ink transition hover:border-green">
      <span className="sr-only">Delivery city</span>
      <span aria-hidden="true" className="text-muted">
        📍
      </span>
      <select
        value={selected}
        disabled={isPending}
        onChange={(event) => {
          const next = event.target.value;
          startTransition(async () => {
            await setCity(next);
            router.refresh();
          });
        }}
        className="bg-transparent font-medium text-ink focus:outline-none disabled:opacity-60"
      >
        {CITY_CODES.map((code) => (
          <option key={code} value={code}>
            {CITY_LABELS[code]}
          </option>
        ))}
      </select>
    </label>
  );
}
