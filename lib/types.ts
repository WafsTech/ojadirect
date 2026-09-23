import type { CityCode } from "@/lib/city";

export type Category = "kitchen" | "fans" | "phones" | "fashion" | "home";
export type OrderStatus =
  | "pending_payment"
  | "paid"
  | "collected"
  | "dispatched"
  | "delivered"
  | "refunded";
export type DeliveryMode = "door" | "pickup";

export interface City {
  code: CityCode;
  name: string;
  delivery_days: string;
  pickup_fee: number;
}

export interface Supplier {
  id: string;
  name: string;
  city_code: CityCode;
  market_name: string | null;
  is_verified: boolean;
  notes: string | null;
  created_at: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: Category;
  supplier_id: string;
  cost_price: number;
  price: number;
  mall_price: number;
  quality_labels: string[];
  image_urls: string[];
  in_stock: boolean;
  is_published: boolean;
  created_at: string;
}

/** A product joined with just the supplier fields the storefront needs. */
export interface ProductWithSupplier extends Product {
  supplier: Pick<Supplier, "id" | "name" | "city_code" | "market_name"> | null;
}

export interface DeliveryRate {
  from_city: CityCode;
  to_city: CityCode;
  fee: number;
  eta_text: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  qty: number;
}

export interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  customer_city: CityCode;
  delivery_mode: DeliveryMode;
  address: string | null;
  items: OrderItem[];
  subtotal: number;
  delivery_fee: number;
  total: number;
  status: OrderStatus;
  created_at: string;
}

/**
 * Hand-written schema reference matching supabase/migrations/0001_init.sql.
 * Kept for documentation; the storefront's supabase clients are untyped and
 * results are cast to the interfaces above, since PostgREST's embedded
 * resource shapes (e.g. `products.supplier`) aren't expressible in a plain
 * hand-rolled Database generic without full relationship metadata.
 */
export interface Database {
  public: {
    Tables: {
      cities: {
        Row: City;
        Insert: City;
        Update: Partial<City>;
      };
      suppliers: {
        Row: Supplier;
        Insert: Omit<Supplier, "created_at"> & { created_at?: string };
        Update: Partial<Supplier>;
      };
      products: {
        Row: Product;
        Insert: Omit<Product, "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Product>;
      };
      delivery_rates: {
        Row: DeliveryRate;
        Insert: DeliveryRate;
        Update: Partial<DeliveryRate>;
      };
      orders: {
        Row: Order;
        Insert: Omit<Order, "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Order>;
      };
    };
  };
}
