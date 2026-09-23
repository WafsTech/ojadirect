import { cookies } from "next/headers";
import { CITY_COOKIE, DEFAULT_CITY, isCityCode, type CityCode } from "@/lib/city";

/** Reads the customer's selected city from the request cookie (server-only). */
export async function getSelectedCity(): Promise<CityCode> {
  const store = await cookies();
  const value = store.get(CITY_COOKIE)?.value;
  return isCityCode(value) ? value : DEFAULT_CITY;
}
