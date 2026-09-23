-- Oja Direct — Phase 1 schema + seed data
-- Run this in the Supabase SQL editor, or via `supabase db push` / the CLI (see README.md).

-- ============================================================================
-- EXTENSIONS
-- ============================================================================
create extension if not exists "pgcrypto";

-- ============================================================================
-- TABLES
-- ============================================================================

-- Cities we operate in. Delivery days are fixed per city and shown everywhere
-- delivery is mentioned.
create table if not exists cities (
  code text primary key check (code in ('lagos', 'ota', 'ibadan')),
  name text not null,
  delivery_days text not null,
  pickup_fee integer not null default 0
);

-- Suppliers we buy from. Every product belongs to exactly one supplier, and
-- every supplier is based in exactly one city.
create table if not exists suppliers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  city_code text not null references cities (code),
  market_name text,
  is_verified boolean not null default false,
  notes text,
  created_at timestamptz not null default now()
);

create index if not exists suppliers_city_code_idx on suppliers (city_code);

-- Products for sale. `mall_price` is always shown struck through above `price`.
create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text not null default '',
  category text not null check (category in ('kitchen', 'fans', 'phones', 'fashion', 'home')),
  supplier_id uuid not null references suppliers (id),
  cost_price integer not null,
  price integer not null,
  mall_price integer not null,
  quality_labels text[] not null default '{}',
  image_urls text[] not null default '{}',
  in_stock boolean not null default true,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  constraint mall_price_higher check (mall_price > price)
);

create index if not exists products_supplier_id_idx on products (supplier_id);
create index if not exists products_category_idx on products (category);
create index if not exists products_is_published_idx on products (is_published);

-- Delivery fee + ETA matrix. Keyed by (from_city, to_city) — 9 rows for 3 cities.
create table if not exists delivery_rates (
  from_city text not null references cities (code),
  to_city text not null references cities (code),
  fee integer not null,
  eta_text text not null,
  primary key (from_city, to_city)
);

-- Orders. No public read access — customers never see other customers' orders,
-- and there is no admin dashboard yet (Phase 3), so this is written/read only
-- via the service role key for now.
create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  customer_name text not null,
  customer_phone text not null,
  customer_city text not null references cities (code),
  delivery_mode text not null check (delivery_mode in ('door', 'pickup')),
  address text,
  items jsonb not null,
  subtotal integer not null,
  delivery_fee integer not null,
  total integer not null,
  status text not null default 'pending_payment'
    check (status in ('pending_payment', 'paid', 'collected', 'dispatched', 'delivered', 'refunded')),
  created_at timestamptz not null default now()
);

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================

alter table cities enable row level security;
alter table suppliers enable row level security;
alter table products enable row level security;
alter table delivery_rates enable row level security;
alter table orders enable row level security;

-- Public (anon) read access to reference/catalog data.
drop policy if exists "cities are publicly readable" on cities;
create policy "cities are publicly readable" on cities
  for select using (true);

drop policy if exists "suppliers are publicly readable" on suppliers;
create policy "suppliers are publicly readable" on suppliers
  for select using (true);

drop policy if exists "delivery rates are publicly readable" on delivery_rates;
create policy "delivery rates are publicly readable" on delivery_rates
  for select using (true);

drop policy if exists "published products are publicly readable" on products;
create policy "published products are publicly readable" on products
  for select using (is_published = true);

-- No policies are created for `orders`, so with RLS enabled the anon/public
-- role has zero access (no select/insert/update/delete). All order writes and
-- reads happen server-side with the service role key, which bypasses RLS.

-- ============================================================================
-- SEED DATA
-- ============================================================================

insert into cities (code, name, delivery_days, pickup_fee) values
  ('lagos', 'Lagos', 'Mon–Sat, daily', 1000),
  ('ota', 'Ota', 'Tue, Thu, Sat', 800),
  ('ibadan', 'Ibadan', 'Wed, Sat', 800)
on conflict (code) do update set
  name = excluded.name,
  delivery_days = excluded.delivery_days,
  pickup_fee = excluded.pickup_fee;

insert into delivery_rates (from_city, to_city, fee, eta_text) values
  ('lagos', 'lagos', 3000, 'Next day'),
  ('lagos', 'ota', 3500, '2-3 days'),
  ('lagos', 'ibadan', 5000, '2-4 days'),
  ('ota', 'ota', 2500, '1-2 days'),
  ('ota', 'lagos', 3500, '2-3 days'),
  ('ota', 'ibadan', 5500, '3-4 days'),
  ('ibadan', 'ibadan', 2500, 'Next day'),
  ('ibadan', 'lagos', 5000, '2-4 days'),
  ('ibadan', 'ota', 5000, '3-4 days')
on conflict (from_city, to_city) do update set
  fee = excluded.fee,
  eta_text = excluded.eta_text;

-- Suppliers: 2 Lagos, 1 Ota, 2 Ibadan.
insert into suppliers (id, name, city_code, market_name, is_verified, notes) values
  ('11111111-1111-1111-1111-111111111111', 'Chukwuemeka Imports', 'lagos', 'Trade Fair', true, 'Reliable warehouse, 6+ years supplying kitchenware and electronics.'),
  ('22222222-2222-2222-2222-222222222222', 'Golden Dragon Wholesale', 'lagos', 'Trade Fair', true, 'Specializes in phones and accessories.'),
  ('33333333-3333-3333-3333-333333333333', 'Ota Sunrise Traders', 'ota', 'Ontario Warehouse Market', true, 'Bulk fans, home goods and fashion items.'),
  ('44444444-4444-4444-4444-444444444444', 'Bodija Fortune Trading', 'ibadan', 'Bodija Market', true, 'Long-standing supplier of kitchenware and fashion.'),
  ('55555555-5555-5555-5555-555555555555', 'Dugbe Success Ventures', 'ibadan', 'Dugbe Market', false, 'Newer partner, goods checked before every dispatch.')
on conflict (id) do nothing;

-- Products: 12 across kitchen, fans, phones, fashion, home.
insert into products (
  slug, name, description, category, supplier_id,
  cost_price, price, mall_price, quality_labels, image_urls, in_stock, is_published
) values
  (
    'nonstick-cooking-pot-set-5pc',
    '5-Piece Nonstick Cooking Pot Set',
    'Durable nonstick aluminium pot set with tempered glass lids, all five sizes for everyday cooking.',
    'kitchen',
    '11111111-1111-1111-1111-111111111111',
    18000, 24500, 38000,
    array['Tested', 'Durable'],
    array['https://images.unsplash.com/photo-1584990347449-a5d9f800a783?w=800'],
    true, true
  ),
  (
    'electric-blender-1.5l',
    'Electric Blender, 1.5L Jug',
    'Heavy-duty 450W blender with stainless steel blades, ideal for smoothies, soups and pepper blending.',
    'kitchen',
    '11111111-1111-1111-1111-111111111111',
    9500, 13500, 21000,
    array['Tested', 'Budget'],
    array['https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=800'],
    true, true
  ),
  (
    'stainless-cutlery-set-24pc',
    '24-Piece Stainless Cutlery Set',
    'Rust-resistant stainless steel spoons, forks and knives with a storage caddy.',
    'kitchen',
    '44444444-4444-4444-4444-444444444444',
    6500, 9000, 15000,
    array['Durable'],
    array['https://images.unsplash.com/photo-1584346133934-a3afd2a33c4d?w=800'],
    true, true
  ),
  (
    'rechargeable-standing-fan-18in',
    '18-Inch Rechargeable Standing Fan',
    'Solar-ready rechargeable standing fan with remote control, runs up to 8 hours on a full charge.',
    'fans',
    '33333333-3333-3333-3333-333333333333',
    22000, 29500, 45000,
    array['Tested', 'Durable'],
    array['https://images.unsplash.com/photo-1616627547584-bf28cee262db?w=800'],
    true, true
  ),
  (
    'rechargeable-table-fan-12in',
    '12-Inch Rechargeable Table Fan',
    'Compact rechargeable desk fan with 3-speed settings and USB charging cable.',
    'fans',
    '33333333-3333-3333-3333-333333333333',
    9000, 12500, 19500,
    array['Budget'],
    array['https://images.unsplash.com/photo-1631083216712-3d68c7e64ef7?w=800'],
    true, true
  ),
  (
    'wall-mount-ceiling-fan-56in',
    '56-Inch Ceiling Fan with Light',
    '3-speed ceiling fan with integrated LED light kit and remote control.',
    'fans',
    '33333333-3333-3333-3333-333333333333',
    16000, 21500, 33000,
    array['Tested'],
    array['https://images.unsplash.com/photo-1592078615290-033ee584e267?w=800'],
    true, true
  ),
  (
    'dual-sim-android-smartphone',
    'Dual-SIM Android Smartphone, 64GB',
    '6.5-inch display, 64GB storage, 4GB RAM, dual-SIM Android smartphone with a 5000mAh battery.',
    'phones',
    '22222222-2222-2222-2222-222222222222',
    42000, 56000, 82000,
    array['Tested', 'Durable'],
    array['https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800'],
    true, true
  ),
  (
    'budget-feature-phone-dual-sim',
    'Dual-SIM Feature Phone with Torch',
    'Long-battery-life feature phone with dual-SIM support, FM radio and built-in torchlight.',
    'phones',
    '22222222-2222-2222-2222-222222222222',
    6000, 8500, 13000,
    array['Budget', 'Tested'],
    array['https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?w=800'],
    true, true
  ),
  (
    'wireless-earbuds-charging-case',
    'Wireless Earbuds with Charging Case',
    'Bluetooth 5.0 earbuds with touch controls and a compact charging case.',
    'phones',
    '22222222-2222-2222-2222-222222222222',
    5500, 8000, 14000,
    array['Tested'],
    array['https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800'],
    true, true
  ),
  (
    'ankara-print-mens-shirt',
    'Ankara Print Men''s Shirt',
    'Tailored short-sleeve shirt in vibrant Ankara print fabric, available in mixed sizes.',
    'fashion',
    '44444444-4444-4444-4444-444444444444',
    4500, 6500, 11000,
    array['Durable'],
    array['https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800'],
    true, true
  ),
  (
    'ladies-handbag-leather-look',
    'Ladies Leather-Look Handbag',
    'Structured handbag in leather-look finish with adjustable strap and inner zip pocket.',
    'fashion',
    '55555555-5555-5555-5555-555555555555',
    5000, 7500, 13500,
    array['Budget'],
    array['https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800'],
    true, true
  ),
  (
    'led-rechargeable-lantern',
    'LED Rechargeable Home Lantern',
    'Bright rechargeable LED lantern for home use, up to 12 hours of light per charge, ideal for power outages.',
    'home',
    '55555555-5555-5555-5555-555555555555',
    5500, 7800, 13000,
    array['Tested', 'Durable'],
    array['https://images.unsplash.com/photo-1516131206008-dd041a9764fd?w=800'],
    true, true
  )
on conflict (slug) do nothing;
