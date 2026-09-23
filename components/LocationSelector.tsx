"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { setCity } from "@/lib/actions";
import { CITY_COOKIE, CITY_CODES, CITY_LABELS, type CityCode } from "@/lib/city";

function hasCityCookie(): boolean {
  return document.cookie.split("; ").some((entry) => entry.startsWith(`${CITY_COOKIE}=`));
}

/**
 * First-visit-only "Where should we deliver?" prompt. Purely a client-side
 * enhancement: it does not change what the server renders on first paint
 * (that still defaults to Lagos via lib/city-server.ts, exactly as before),
 * it just offers to set the cookie explicitly before the person starts
 * browsing. Renders nothing once a choice has been made.
 */
export function LocationSelector() {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  useEffect(() => {
    // One-time check of an external, non-reactive source (the cookie jar) on
    // mount, so server and client agree on the very first paint (dialog
    // closed) and this only opens once we know client-side there really is
    // no city cookie yet — the same shape as the cart's localStorage read.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (!hasCityCookie()) setOpen(true);
  }, []);

  if (!open) return null;

  function choose(city: CityCode) {
    startTransition(async () => {
      await setCity(city);
      setOpen(false);
      router.refresh();
    });
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="location-selector-title"
      className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 p-4 sm:items-center"
    >
      <div className="w-full max-w-sm rounded-[20px] border border-line bg-paper p-6">
        <h2 id="location-selector-title" className="font-display text-xl font-extrabold text-ink">
          Where should we deliver?
        </h2>
        <p className="mt-1 text-sm text-muted">
          Delivery fees and timing depend on your city — you can change this anytime from the header.
        </p>
        <div className="mt-5 flex flex-col gap-2">
          {CITY_CODES.map((code) => (
            <button
              key={code}
              type="button"
              disabled={isPending}
              onClick={() => choose(code)}
              className="rounded-full border border-line px-5 py-3 text-left text-sm font-semibold text-ink transition hover:border-green hover:bg-green-tint disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green"
            >
              {CITY_LABELS[code]}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
