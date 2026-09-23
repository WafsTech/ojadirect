import Link from "next/link";
import { WhatsAppIcon } from "@/components/Icons";
import { whatsAppLink } from "@/lib/whatsapp";
import type { City } from "@/lib/types";

const LINKS = [
  { href: "/#products", label: "Shop" },
  { href: "/#how-it-works", label: "How it works" },
  { href: "/#delivery", label: "Delivery" },
  { href: "/#trust", label: "Refund policy" },
];

export function Footer({
  cities,
  whatsappNumber,
}: {
  cities: City[];
  whatsappNumber: string;
}) {
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
              {LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-paper">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-paper">Contact</h4>
            <ul className="mt-2 space-y-1 text-sm text-ground/70">
              {whatsappNumber ? (
                <li>
                  <a
                    href={whatsAppLink(whatsappNumber, "Hi Oja Direct, I have a question.")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 hover:text-paper"
                  >
                    <WhatsAppIcon className="h-4 w-4" aria-hidden="true" />
                    Chat on WhatsApp
                  </a>
                </li>
              ) : (
                <li className="text-ground/40">WhatsApp number not configured</li>
              )}
              {/* No email or phone line exists anywhere in this project yet — left out
                  rather than invented. Add one here once there's a real one to show. */}
              <li className="text-ground/40">Email — coming soon</li>
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
