import Link from "next/link";
import type { City } from "@/lib/types";

export function Footer({ cities }: { cities: City[] }) {
  return (
    <footer className="border-t border-line bg-ink text-ground">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="flex flex-wrap items-start justify-between gap-8">
          <div>
            <p className="font-display text-lg font-extrabold text-paper">Oja Direct</p>
            <p className="mt-2 max-w-xs text-sm text-ground/70">
              Direct from verified warehouses in Lagos, Ota and Ibadan. Pay
              upfront, no pay on delivery.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-paper">We deliver to</h4>
            <ul className="mt-2 space-y-1 text-sm text-ground/70">
              {cities.map((city) => (
                <li key={city.code}>
                  {city.name} · {city.delivery_days}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-paper">Links</h4>
            <ul className="mt-2 space-y-1 text-sm text-ground/70">
              <li>
                <Link href="/" className="hover:text-paper">
                  Shop
                </Link>
              </li>
              <li>
                <Link href="/cart" className="hover:text-paper">
                  Cart
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <p className="mt-8 border-t border-ground/10 pt-6 text-xs text-ground/50">
          © {new Date().getFullYear()} Oja Direct. Prices shown in Naira.
          Payments launching soon.
        </p>
      </div>
    </footer>
  );
}
