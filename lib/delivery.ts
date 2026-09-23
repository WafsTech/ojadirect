import type { CityCode } from "@/lib/city";
import type { DeliveryRate } from "@/lib/types";

export interface DeliveryQuote {
  fee: number;
  etaText: string;
}

/** Roughly how many days out an ETA string reaches, for comparing "slowness". */
function etaUpperBoundDays(etaText: string): number {
  const numbers = etaText.match(/\d+/g);
  if (!numbers || numbers.length === 0) return 1; // e.g. "Next day"
  return Math.max(...numbers.map(Number));
}

export function getRate(
  rates: DeliveryRate[],
  from: CityCode,
  to: CityCode
): DeliveryRate | undefined {
  return rates.find((r) => r.from_city === from && r.to_city === to);
}

/** Delivery fee + ETA for a single supplier city shipping to the customer's city. */
export function quoteForSupplier(
  rates: DeliveryRate[],
  supplierCity: CityCode,
  customerCity: CityCode
): DeliveryQuote {
  const rate = getRate(rates, supplierCity, customerCity);
  return { fee: rate?.fee ?? 0, etaText: rate?.eta_text ?? "—" };
}

/**
 * For a cart that may span several supplier cities: charge the highest
 * applicable delivery fee once, and show the slowest ETA among them.
 */
export function quoteForCart(
  rates: DeliveryRate[],
  supplierCities: CityCode[],
  customerCity: CityCode
): DeliveryQuote {
  const uniqueCities = Array.from(new Set(supplierCities));
  const quotes = uniqueCities.map((city) =>
    quoteForSupplier(rates, city, customerCity)
  );
  if (quotes.length === 0) return { fee: 0, etaText: "—" };

  const fee = Math.max(...quotes.map((q) => q.fee));
  const slowest = quotes.reduce((slowestSoFar, candidate) =>
    etaUpperBoundDays(candidate.etaText) > etaUpperBoundDays(slowestSoFar.etaText)
      ? candidate
      : slowestSoFar
  );

  return { fee, etaText: slowest.etaText };
}

/** Cheapest delivery fee into a given city, across all supplier cities — used for the header's "from ₦X" line. */
export function minFeeToCity(
  rates: DeliveryRate[],
  customerCity: CityCode
): number | undefined {
  const applicable = rates
    .filter((r) => r.to_city === customerCity)
    .map((r) => r.fee);
  return applicable.length ? Math.min(...applicable) : undefined;
}
