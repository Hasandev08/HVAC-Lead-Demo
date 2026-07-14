import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * The public (anon-key) client, safe to use in the browser.
 *
 * This key is published in the client bundle by design — it grants nothing on
 * its own. Everything it can reach is gated by RLS, and RLS only trusts a
 * session whose email is in the `owners` table (see supabase/schema.sql).
 *
 * Kept in its own file so a client component can import it WITHOUT pulling the
 * service-role module into the client graph.
 */

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let cached: SupabaseClient | null = null;

export function supabaseBrowser(): SupabaseClient | null {
  if (!url || !anonKey) return null;

  cached ??= createClient(url, anonKey);
  return cached;
}
