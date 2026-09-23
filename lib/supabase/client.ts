"use client";

import { createBrowserClient } from "@supabase/ssr";

/**
 * Supabase client for Client Components. Nothing in Phase 1 queries Supabase
 * from the browser (the cart is denormalized into localStorage), but this is
 * here so later phases — realtime stock updates, an admin dashboard — have a
 * ready-made client that respects the same RLS policies.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
