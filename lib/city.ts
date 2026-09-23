export type CityCode = "lagos" | "ota" | "ibadan";

export const CITY_COOKIE = "oja_city";
export const DEFAULT_CITY: CityCode = "lagos";
export const CITY_CODES: CityCode[] = ["lagos", "ota", "ibadan"];

export const CITY_LABELS: Record<CityCode, string> = {
  lagos: "Lagos",
  ota: "Ota",
  ibadan: "Ibadan",
};

export function isCityCode(value: string | undefined | null): value is CityCode {
  return value === "lagos" || value === "ota" || value === "ibadan";
}
