import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * The service-role client. Bypasses RLS — it can read and write every row.
 *
 * `import "server-only"` at the top is the point of this file existing. If any
 * client component ever imports this module (directly or through a chain), the
 * BUILD FAILS instead of quietly shipping a module that references the
 * service-role key into the browser bundle. That guarantee is worth more than
 * the convenience of keeping both clients in one file.
 */

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const isSupabaseConfigured = Boolean(url && serviceKey);

/** Memoized: this was being rebuilt three times per lead submission. */
let cached: SupabaseClient | null = null;

export function supabaseAdmin(): SupabaseClient | null {
  if (!url || !serviceKey) return null;

  cached ??= createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return cached;
}
