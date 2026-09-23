import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Supabase client for use in Server Components, Server Actions and Route
 * Handlers. Reads with the public anon key, which RLS restricts to published
 * products, suppliers, cities and delivery rates — orders have no public
 * policy at all, so they're invisible to this client. There is no
 * authentication in Phase 1, so cookie writes are a no-op guard for the
 * future.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Called from a Server Component render, where cookies are
            // read-only. Safe to ignore since Phase 1 has no auth session
            // that would need refreshing.
          }
        },
      },
    }
  );
}
