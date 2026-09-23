import type { Metadata } from "next";
import { Bricolage_Grotesque, Figtree } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/lib/cart-context";
import { Header } from "@/components/Header";
import { DeliveryLine } from "@/components/DeliveryLine";
import { Footer } from "@/components/Footer";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { LocationSelector } from "@/components/LocationSelector";
import { getSelectedCity } from "@/lib/city-server";
import { getCities, getDeliveryRates } from "@/lib/data";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["800"],
  variable: "--font-bricolage",
});

const figtree = Figtree({
  subsets: ["latin"],
  variable: "--font-figtree",
});

export const metadata: Metadata = {
  title: "Oja Direct — Buy direct from verified warehouses",
  description:
    "Kitchenware, fans, phones, fashion and home goods delivered to Lagos, Ota and Ibadan. No middleman markup, no pay on delivery.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [cities, rates, selectedCityCode] = await Promise.all([
    getCities(),
    getDeliveryRates(),
    getSelectedCity(),
  ]);

  const selectedCity =
    cities.find((c) => c.code === selectedCityCode) ?? cities[0];
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "";

  return (
    <html lang="en" className={`${bricolage.variable} ${figtree.variable}`}>
      <body className="min-h-screen bg-ground font-body text-ink antialiased">
        <CartProvider>
          <LocationSelector />
          <Header selectedCity={selectedCityCode} />
          {selectedCity && <DeliveryLine city={selectedCity} rates={rates} />}
          <main className="pb-16 md:pb-0">{children}</main>
          <Footer cities={cities} whatsappNumber={whatsappNumber} />
          <MobileBottomNav />
        </CartProvider>
      </body>
    </html>
  );
}
