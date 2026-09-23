import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import { percentOff } from "@/lib/format";
import type { City, DeliveryRate, ProductWithSupplier, Category } from "@/lib/types";

const PRODUCT_SELECT = "*, supplier:suppliers(id, name, city_code, market_name)";

export const getCities = cache(async (): Promise<City[]> => {
  const supabase = await createClient();
  const { data, error } = await supabase.from("cities").select("*").order("code");
  if (error) throw error;
  return (data ?? []) as City[];
});

export const getDeliveryRates = cache(async (): Promise<DeliveryRate[]> => {
  const supabase = await createClient();
  const { data, error } = await supabase.from("delivery_rates").select("*");
  if (error) throw error;
  return (data ?? []) as DeliveryRate[];
});

export interface ProductQuery {
  q?: string;
  category?: Category;
}

export const getProducts = cache(
  async ({ q, category }: ProductQuery = {}): Promise<ProductWithSupplier[]> => {
    const supabase = await createClient();
    let query = supabase
      .from("products")
      .select(PRODUCT_SELECT)
      .eq("is_published", true)
      .order("created_at", { ascending: false });

    if (category) query = query.eq("category", category);
    if (q && q.trim()) {
      const term = q.trim().replace(/[%,]/g, "");
      query = query.or(`name.ilike.%${term}%,category.ilike.%${term}%`);
    }

    const { data, error } = await query;
    if (error) throw error;
    return (data ?? []) as unknown as ProductWithSupplier[];
  }
);

export const getProductBySlug = cache(
  async (slug: string): Promise<ProductWithSupplier | null> => {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("products")
      .select(PRODUCT_SELECT)
      .eq("slug", slug)
      .eq("is_published", true)
      .maybeSingle();
    if (error) throw error;
    return (data as unknown as ProductWithSupplier) ?? null;
  }
);

/** The product with the biggest markdown, for the homepage hero's price-comparison card. */
export const getFeaturedProduct = cache(async (): Promise<ProductWithSupplier | null> => {
  const products = await getProducts({});
  if (products.length === 0) return null;
  return products.reduce((best, product) =>
    percentOff(product.price, product.mall_price) > percentOff(best.price, best.mall_price)
      ? product
      : best
  );
});
