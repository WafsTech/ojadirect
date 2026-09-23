# Oja Direct

Phase 1 storefront for Oja Direct — a Nigerian middleman business that buys
from Chinese warehouses/wholesalers in **Lagos**, **Ota** (Ogun) and
**Ibadan**, and delivers to customers in those same three cities.

No payment integration yet (Phase 2 adds Paystack) and no pay on delivery —
customers pay before dispatch. In the meantime, checkout is stubbed with a
disabled "Continue to payment" button and an "Order on WhatsApp" fallback.

## Stack

- [Next.js](https://nextjs.org) (App Router) + TypeScript + Tailwind CSS
- [Supabase](https://supabase.com) (Postgres + Storage) via
  `@supabase/supabase-js` and `@supabase/ssr`
- Deployed on [Vercel](https://vercel.com)

## 1. Set up Supabase

1. Create a new project at [supabase.com](https://supabase.com).
2. In **Project Settings → API**, copy the **Project URL**, **anon public**
   key and **service_role** key.
3. Run the schema + seed migration. Either:

   **Option A — SQL editor (fastest, no CLI required)**

   Open the Supabase dashboard → **SQL Editor** → paste the contents of
   [`supabase/migrations/0001_init.sql`](supabase/migrations/0001_init.sql) →
   **Run**.

   **Option B — Supabase CLI**

   ```bash
   npm install -g supabase
   supabase login
   supabase link --project-ref <your-project-ref>
   supabase db push
   ```

   This creates the `cities`, `suppliers`, `products`, `delivery_rates` and
   `orders` tables, enables Row Level Security (public read on published
   products/suppliers/cities/delivery_rates, no public access to orders), and
   seeds 3 cities, 9 delivery rates, 5 suppliers and 12 products.

## 2. Configure environment variables

```bash
cp .env.example .env.local
```

Fill in `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://<your-project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>
NEXT_PUBLIC_WHATSAPP_NUMBER=2348012345678
```

`SUPABASE_SERVICE_ROLE_KEY` isn't used by any page yet (there's no admin
dashboard or order-writing flow in Phase 1) — it's reserved for later phases.
`NEXT_PUBLIC_WHATSAPP_NUMBER` should be in international format with no `+`
or spaces.

## 3. Install dependencies and run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## 4. Build for production

```bash
npm run build
npm run start
```

## Deploying to Vercel

1. Push this repo to GitHub.
2. In [Vercel](https://vercel.com/new), import the repository.
3. Add the same four environment variables from `.env.local` under
   **Project Settings → Environment Variables**.
4. Deploy. Vercel will run `npm run build` automatically.

## Project structure

```
app/                  Routes (App Router)
  page.tsx            Home — hero, category filters, product grid, delivery info
  product/[slug]/     Product detail page
  cart/               Cart page
  layout.tsx          Root layout — header, delivery line, footer, cart provider
components/           UI components
lib/                  Data access, delivery/pricing logic, cart context
supabase/migrations/  Database schema + seed data
```

## Business rules encoded in this build

- No pay on delivery anywhere — the "Continue to payment" button in the cart
  is permanently disabled with the note "Payments launching soon".
- Every product belongs to a supplier, and every supplier has a city
  (`lagos` | `ota` | `ibadan`).
- Delivery fee and ETA are looked up from the `delivery_rates` matrix by
  `(supplier city, customer city)`. See [`lib/delivery.ts`](lib/delivery.ts).
- If a cart mixes suppliers from different cities, the customer is charged the
  single highest applicable delivery fee and shown the slowest ETA
  (`quoteForCart` in [`lib/delivery.ts`](lib/delivery.ts)).
- Each city's fixed delivery days live in the `cities` table and are shown in
  the header's delivery line, the homepage delivery table, and the footer.
- The selected city is stored in a cookie (`oja_city`) so pricing and ETAs are
  correct on first paint, server-side. The cart is stored in `localStorage`
  via a small React context (`lib/cart-context.tsx`).

## What's intentionally not here yet

- Payments (Paystack) — Phase 2.
- Admin dashboard — Phase 3.
- Pay on delivery — never.
