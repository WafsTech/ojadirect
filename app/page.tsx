import { getCities, getDeliveryRates, getProducts, getFeaturedProduct } from "@/lib/data";
import { getSelectedCity } from "@/lib/city-server";
import { Hero } from "@/components/Hero";
import { CategoryChips } from "@/components/CategoryChips";
import { ProductGrid } from "@/components/ProductGrid";
import { HowItWorks } from "@/components/HowItWorks";
import { DeliveryTable } from "@/components/DeliveryTable";
import { TrustSection } from "@/components/TrustSection";
import type { Category } from "@/lib/types";

const CATEGORIES: { value: Category; label: string }[] = [
  { value: "kitchen", label: "Kitchen" },
  { value: "fans", label: "Fans" },
  { value: "phones", label: "Phones" },
  { value: "fashion", label: "Fashion" },
  { value: "home", label: "Home" },
];

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string }>;
}) {
  const { q, category } = await searchParams;
  const validCategory = CATEGORIES.find((c) => c.value === category)?.value;

  const [cities, rates, products, featuredProduct, selectedCityCode] = await Promise.all([
    getCities(),
    getDeliveryRates(),
    getProducts({ q, category: validCategory }),
    getFeaturedProduct(),
    getSelectedCity(),
  ]);

  return (
    <>
      <Hero product={featuredProduct} />
      <CategoryChips categories={CATEGORIES} selected={validCategory} query={q} />
      <ProductGrid products={products} rates={rates} customerCity={selectedCityCode} />
      <HowItWorks />
      <DeliveryTable cities={cities} selected={selectedCityCode} />
      <TrustSection />
    </>
  );
}
