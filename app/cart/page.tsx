import type { Metadata } from "next";
import { getCities, getDeliveryRates } from "@/lib/data";
import { getSelectedCity } from "@/lib/city-server";
import { CartClient } from "@/components/CartClient";

export const metadata: Metadata = { title: "Your cart — Oja Direct" };

export default async function CartPage() {
  const [cities, rates, customerCity] = await Promise.all([
    getCities(),
    getDeliveryRates(),
    getSelectedCity(),
  ]);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <h1 className="font-display text-2xl font-extrabold text-ink sm:text-3xl">
        Your cart
      </h1>
      <CartClient
        cities={cities}
        rates={rates}
        customerCity={customerCity}
        whatsappNumber={process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? ""}
      />
    </div>
  );
}
