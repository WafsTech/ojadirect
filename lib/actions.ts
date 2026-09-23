"use server";

import { cookies } from "next/headers";
import { CITY_COOKIE, isCityCode } from "@/lib/city";

/** Persists the customer's chosen delivery city in a cookie for one year. */
export async function setCity(city: string): Promise<void> {
  if (!isCityCode(city)) return;
  const store = await cookies();
  store.set(CITY_COOKIE, city, {
    maxAge: 60 * 60 * 24 * 365,
    path: "/",
    sameSite: "lax",
  });
}
